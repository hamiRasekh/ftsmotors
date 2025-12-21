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

echo -e "${GREEN}🚀 Starting FTS Motors Step-by-Step Deployment...${NC}"
echo ""

cd "$PROJECT_DIR" || exit 1

# Load environment variables
if [ -f ".env.production" ]; then
    set -a
    source .env.production
    set +a
else
    echo -e "${RED}❌ .env.production not found!${NC}"
    exit 1
fi

# Step 1: Create network
echo -e "${BLUE}Step 1: Creating Docker network...${NC}"
docker network create ftsmotors-network 2>/dev/null || echo -e "${YELLOW}Network already exists${NC}"

# Step 2: Build images
echo -e "${BLUE}Step 2: Building Docker images (this may take several minutes)...${NC}"
docker compose -f docker-compose.prod.yml build --no-cache

# Step 3: Start database
echo -e "${BLUE}Step 3: Starting database...${NC}"
docker compose -f docker-compose.prod.yml up -d postgres
echo -e "${YELLOW}Waiting for database to be ready...${NC}"
sleep 10

# Step 4: Start backend
echo -e "${BLUE}Step 4: Starting backend...${NC}"
docker compose -f docker-compose.prod.yml up -d backend
echo -e "${YELLOW}Waiting for backend to be ready...${NC}"
sleep 15

# Step 5: Start frontend
echo -e "${BLUE}Step 5: Starting frontend...${NC}"
docker compose -f docker-compose.prod.yml up -d frontend
echo -e "${YELLOW}Waiting for frontend to be ready...${NC}"
sleep 10

# Step 6: Setup SSL
echo -e "${BLUE}Step 6: Setting up SSL certificates...${NC}"
mkdir -p certbot/conf certbot/www

if [ ! -d "certbot/conf/live/$DOMAIN" ]; then
    echo -e "${YELLOW}Generating SSL certificates...${NC}"
    
    # Create temporary nginx config
    cat > nginx/nginx-temp.conf <<EOF
events { worker_connections 1024; }
http {
    server {
        listen 80;
        server_name $DOMAIN www.$DOMAIN $API_DOMAIN;
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }
        location / { return 200 "OK"; add_header Content-Type text/plain; }
    }
}
EOF

    # Start temp nginx
    docker run -d --name ftsmotors-nginx-temp \
        --network ftsmotors-network \
        -p 80:80 \
        -v "$(pwd)/nginx/nginx-temp.conf:/etc/nginx/nginx.conf:ro" \
        -v "$(pwd)/certbot/www:/var/www/certbot:ro" \
        nginx:alpine 2>/dev/null || true
    
    sleep 5

    # Generate certificates
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
        -d "$DOMAIN" \
        -d "www.$DOMAIN" \
        -d "$API_DOMAIN" || {
        echo -e "${RED}❌ Certificate generation failed!${NC}"
        docker stop ftsmotors-nginx-temp 2>/dev/null || true
        docker rm ftsmotors-nginx-temp 2>/dev/null || true
        rm -f nginx/nginx-temp.conf
        exit 1
    }

    # Cleanup
    docker stop ftsmotors-nginx-temp 2>/dev/null || true
    docker rm ftsmotors-nginx-temp 2>/dev/null || true
    rm -f nginx/nginx-temp.conf
    
    echo -e "${GREEN}✅ SSL certificates generated${NC}"
else
    echo -e "${GREEN}✅ SSL certificates already exist${NC}"
fi

# Step 7: Start nginx
echo -e "${BLUE}Step 7: Starting nginx...${NC}"
docker compose -f nginx/docker-compose.nginx.yml up -d
sleep 5

# Step 8: Run migrations
echo -e "${BLUE}Step 8: Running database migrations...${NC}"
docker compose -f docker-compose.prod.yml exec -T backend npx prisma migrate deploy || {
    echo -e "${YELLOW}⚠️  Migration might have already been applied${NC}"
}

# Final status
echo ""
echo -e "${GREEN}✅ Deployment completed!${NC}"
echo ""
echo -e "${GREEN}📊 Service Status:${NC}"
docker compose -f docker-compose.prod.yml ps
echo ""
docker compose -f nginx/docker-compose.nginx.yml ps
echo ""
echo -e "${GREEN}🌐 Your application:${NC}"
echo -e "   Frontend: https://$DOMAIN"
echo -e "   API: https://$API_DOMAIN"
echo ""

