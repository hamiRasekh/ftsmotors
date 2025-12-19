#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/opt/ftsmotors"
DOMAIN="ftsmotors.ir"
EMAIL="admin@ftsmotors.ir"  # Change this to your email

echo -e "${GREEN}🚀 Starting FTS Motors deployment...${NC}"

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
    echo -e "${RED}❌ Please do not run as root${NC}"
    exit 1
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

# Stop existing containers
echo -e "${YELLOW}🛑 Stopping existing containers...${NC}"
docker-compose -f docker-compose.prod.yml down || true

# Pull latest code (if using git)
if [ -d ".git" ]; then
    echo -e "${YELLOW}📥 Pulling latest code...${NC}"
    git pull origin main || echo -e "${YELLOW}⚠️  Git pull failed, continuing...${NC}"
fi

# Build and start services
echo -e "${YELLOW}🔨 Building Docker images...${NC}"
docker-compose -f docker-compose.prod.yml build --no-cache

# Start services
echo -e "${YELLOW}🚀 Starting services...${NC}"
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be healthy
echo -e "${YELLOW}⏳ Waiting for services to be ready...${NC}"
sleep 10

# Check if certificates exist
if [ ! -d "certbot/conf/live/$DOMAIN" ]; then
    echo -e "${YELLOW}📜 SSL certificates not found. Setting up SSL...${NC}"
    
    # Create certbot directories
    mkdir -p certbot/conf certbot/www
    
    # Start nginx temporarily for certificate generation
    docker-compose -f nginx/docker-compose.nginx.yml up -d nginx
    
    # Wait for nginx to start
    sleep 5
    
    # Generate certificates
    docker-compose -f nginx/docker-compose.nginx.yml run --rm certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email "$EMAIL" \
        --agree-tos \
        --no-eff-email \
        -d "$DOMAIN" \
        -d "www.$DOMAIN" \
        -d "api.$DOMAIN"
    
    # Reload nginx
    docker-compose -f nginx/docker-compose.nginx.yml restart nginx
else
    echo -e "${GREEN}✅ SSL certificates already exist${NC}"
    # Start nginx
    docker-compose -f nginx/docker-compose.nginx.yml up -d
fi

# Run database migrations
echo -e "${YELLOW}🔄 Running database migrations...${NC}"
docker-compose -f docker-compose.prod.yml exec -T backend npx prisma migrate deploy || {
    echo -e "${YELLOW}⚠️  Migration might have already been applied${NC}"
}

# Show status
echo -e "${GREEN}✅ Deployment completed!${NC}"
echo ""
echo -e "${GREEN}📊 Service Status:${NC}"
docker-compose -f docker-compose.prod.yml ps

echo ""
echo -e "${GREEN}🌐 Your application is available at:${NC}"
echo -e "   Frontend: https://$DOMAIN"
echo -e "   API: https://api.$DOMAIN"
echo ""
echo -e "${YELLOW}📝 Useful commands:${NC}"
echo -e "   View logs: docker-compose -f docker-compose.prod.yml logs -f"
echo -e "   Stop services: docker-compose -f docker-compose.prod.yml down"
echo -e "   Restart services: docker-compose -f docker-compose.prod.yml restart"
