#!/bin/bash
set -e

cd /opt/ftsmotors/ftsmotors

# Load env
source .env.production

# Create network
docker network create ftsmotors-network 2>/dev/null || true

# Build and start services
echo "Building and starting services..."
docker compose -f docker-compose.prod.yml up -d --build

# Wait a bit
sleep 20

# Setup SSL if needed
if [ ! -d "certbot/conf/live/ftsmotors.ir" ]; then
    echo "Setting up SSL..."
    mkdir -p certbot/conf certbot/www
    
    # Temp nginx for cert
    docker run -d --name nginx-temp --network ftsmotors-network -p 80:80 \
        -v $(pwd)/certbot/www:/var/www/certbot:ro \
        nginx:alpine sh -c "echo 'server { listen 80; location /.well-known/acme-challenge/ { root /var/www/certbot; } }' > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'" 2>/dev/null || true
    
    sleep 5
    
    # Get cert
    docker run --rm --network ftsmotors-network \
        -v $(pwd)/certbot/conf:/etc/letsencrypt \
        -v $(pwd)/certbot/www:/var/www/certbot \
        certbot/certbot certonly --webroot --webroot-path=/var/www/certbot \
        --email admin@ftsmotors.ir --agree-tos --no-eff-email \
        -d ftsmotors.ir -d www.ftsmotors.ir -d api.ftsmotors.ir || true
    
    docker stop nginx-temp 2>/dev/null || true
    docker rm nginx-temp 2>/dev/null || true
fi

# Start nginx
echo "Starting nginx..."
docker compose -f nginx/docker-compose.nginx.yml up -d

echo "Deployment complete!"
docker compose -f docker-compose.prod.yml ps

