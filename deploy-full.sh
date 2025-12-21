#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/opt/ftsmotors/ftsmotors"
DOMAIN="ftsmotors.ir"
API_DOMAIN="api.ftsmotors.ir"
EMAIL="admin@ftsmotors.ir"

echo -e "${GREEN}🚀 Starting FTS Motors Full Deployment...${NC}"
echo ""

# Check if running as root - allow but warn
if [ "$EUID" -eq 0 ]; then 
    echo -e "${YELLOW}⚠️  Running as root. This is acceptable for server deployment.${NC}"
fi

# Navigate to project directory
cd "$PROJECT_DIR" || {
    echo -e "${RED}❌ Project directory not found: $PROJECT_DIR${NC}"
    exit 1
}

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo -e "${RED}❌ .env.production file not found!${NC}"
    echo -e "${YELLOW}Please create .env.production file first${NC}"
    exit 1
fi

# Load environment variables
set -a
source .env.production
set +a

# Check Docker and Docker Compose
echo -e "${BLUE}📋 Checking prerequisites...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed!${NC}"
    exit 1
fi

if ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker and Docker Compose are installed${NC}"

# Stop existing containers
echo -e "${YELLOW}🛑 Stopping existing containers...${NC}"
docker compose -f docker-compose.prod.yml down 2>/dev/null || true
docker compose -f nginx/docker-compose.nginx.yml down 2>/dev/null || true

# Create necessary directories
echo -e "${BLUE}📁 Creating necessary directories...${NC}"
mkdir -p certbot/conf certbot/www
mkdir -p nginx/conf.d

# Create network if it doesn't exist
echo -e "${BLUE}🌐 Creating Docker network...${NC}"
docker network create ftsmotors-network 2>/dev/null || echo -e "${YELLOW}⚠️  Network already exists${NC}"

# Build and start database and application services first (without nginx)
echo -e "${YELLOW}🔨 Building Docker images...${NC}"
docker compose -f docker-compose.prod.yml build --no-cache

echo -e "${YELLOW}🚀 Starting database and application services...${NC}"
docker compose -f docker-compose.prod.yml up -d postgres backend frontend

# Wait for services to be ready
echo -e "${YELLOW}⏳ Waiting for services to be ready...${NC}"
sleep 15

# Check if services are healthy
echo -e "${BLUE}🏥 Checking service health...${NC}"
max_attempts=30
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if docker compose -f docker-compose.prod.yml ps | grep -q "healthy\|Up"; then
        echo -e "${GREEN}✅ Services are starting up...${NC}"
        break
    fi
    attempt=$((attempt + 1))
    echo "Waiting for services... ($attempt/$max_attempts)"
    sleep 2
done

# Check SSL certificates
echo -e "${BLUE}🔒 Checking SSL certificates...${NC}"
if [ ! -d "certbot/conf/live/$DOMAIN" ]; then
    echo -e "${YELLOW}📜 SSL certificates not found. Setting up SSL...${NC}"
    
    # Create a temporary nginx config for certificate generation (HTTP only)
    cat > nginx/nginx-temp.conf <<EOF
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    server {
        listen 80;
        server_name $DOMAIN www.$DOMAIN $API_DOMAIN;

        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        location / {
            return 200 "Certificate generation in progress";
            add_header Content-Type text/plain;
        }
    }
}
EOF

    # Start temporary nginx for certificate generation
    echo -e "${YELLOW}🌐 Starting temporary nginx for certificate generation...${NC}"
    docker run -d --name ftsmotors-nginx-temp \
        --network ftsmotors-network \
        -p 80:80 \
        -v "$(pwd)/nginx/nginx-temp.conf:/etc/nginx/nginx.conf:ro" \
        -v "$(pwd)/certbot/www:/var/www/certbot:ro" \
        nginx:alpine || true

    sleep 5

    # Generate certificates
    echo -e "${YELLOW}📜 Generating SSL certificates...${NC}"
    docker run --rm \
        --network ftsmotors-network \
        -v "$(pwd)/certbot/conf:/etc/letsencrypt" \
        -v "$(pwd)/certbot/www:/var/www/certbot" \
        certbot/certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email "$EMAIL" \
        --agree-tos \
        --no-eff-email \
        --force-renewal \
        -d "$DOMAIN" \
        -d "www.$DOMAIN" \
        -d "$API_DOMAIN" || {
        echo -e "${RED}❌ Certificate generation failed!${NC}"
        echo -e "${YELLOW}⚠️  Make sure:${NC}"
        echo -e "   1. Domain $DOMAIN points to this server's IP"
        echo -e "   2. Domain $API_DOMAIN points to this server's IP"
        echo -e "   3. Port 80 is open in firewall"
        
        # Cleanup temp nginx
        docker stop ftsmotors-nginx-temp 2>/dev/null || true
        docker rm ftsmotors-nginx-temp 2>/dev/null || true
        rm -f nginx/nginx-temp.conf
        
        exit 1
    }

    # Cleanup temp nginx
    docker stop ftsmotors-nginx-temp 2>/dev/null || true
    docker rm ftsmotors-nginx-temp 2>/dev/null || true
    rm -f nginx/nginx-temp.conf

    echo -e "${GREEN}✅ SSL certificates generated successfully${NC}"
else
    echo -e "${GREEN}✅ SSL certificates already exist${NC}"
fi

# Start nginx with SSL
echo -e "${YELLOW}🌐 Starting nginx with SSL...${NC}"
docker compose -f nginx/docker-compose.nginx.yml up -d

# Wait for nginx to start
sleep 5

# Run database migrations
echo -e "${YELLOW}🔄 Running database migrations...${NC}"
docker compose -f docker-compose.prod.yml exec -T backend npx prisma migrate deploy || {
    echo -e "${YELLOW}⚠️  Migration might have already been applied${NC}"
}

# Show status
echo ""
echo -e "${GREEN}✅ Deployment completed!${NC}"
echo ""
echo -e "${GREEN}📊 Service Status:${NC}"
docker compose -f docker-compose.prod.yml ps
docker compose -f nginx/docker-compose.nginx.yml ps

echo ""
echo -e "${GREEN}🌐 Your application is available at:${NC}"
echo -e "   Frontend: https://$DOMAIN"
echo -e "   API: https://$API_DOMAIN"
echo ""
echo -e "${YELLOW}📝 Useful commands:${NC}"
echo -e "   View logs: docker compose -f docker-compose.prod.yml logs -f"
echo -e "   View nginx logs: docker compose -f nginx/docker-compose.nginx.yml logs -f"
echo -e "   Stop services: docker compose -f docker-compose.prod.yml down && docker compose -f nginx/docker-compose.nginx.yml down"
echo -e "   Restart services: docker compose -f docker-compose.prod.yml restart"
echo ""
echo -e "${BLUE}🔍 Testing connectivity...${NC}"

# Test endpoints
sleep 3
if curl -k -s -o /dev/null -w "%{http_code}" https://localhost/health 2>/dev/null | grep -q "200\|301\|302"; then
    echo -e "${GREEN}✅ Frontend is responding${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend might need a moment to start${NC}"
fi

if curl -k -s -o /dev/null -w "%{http_code}" https://localhost/api/health 2>/dev/null | grep -q "200\|301\|302"; then
    echo -e "${GREEN}✅ Backend API is responding${NC}"
else
    echo -e "${YELLOW}⚠️  Backend API might need a moment to start${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Deployment process completed!${NC}"
echo -e "${YELLOW}💡 Note: It may take a few minutes for all services to be fully ready.${NC}"

