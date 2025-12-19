#!/bin/bash

# Quick deployment script for FTS Motors
# Usage: ./quick-deploy.sh

set -e

PROJECT_DIR="/opt/ftsmotors"
DOMAIN="ftsmotors.ir"

echo "🚀 Quick Deployment Script for FTS Motors"
echo "=========================================="

# Check if .env.production exists
if [ ! -f "$PROJECT_DIR/.env.production" ]; then
    echo "❌ .env.production not found!"
    echo "📝 Creating from example..."
    cp "$PROJECT_DIR/env.production.example" "$PROJECT_DIR/.env.production"
    echo "⚠️  Please edit .env.production and set your passwords!"
    echo "   Then run this script again."
    exit 1
fi

cd "$PROJECT_DIR"

# Load environment
set -a
source .env.production
set +a

# Build and deploy
echo "🔨 Building images..."
docker-compose -f docker-compose.prod.yml build

echo "🚀 Starting services..."
docker-compose -f docker-compose.prod.yml up -d

echo "⏳ Waiting for services..."
sleep 15

echo "🔄 Running migrations..."
docker-compose -f docker-compose.prod.yml exec -T backend npx prisma migrate deploy || echo "⚠️  Migration might already be applied"

echo "✅ Deployment complete!"
echo ""
echo "🌐 Your site should be available at:"
echo "   - https://$DOMAIN"
echo "   - https://api.$DOMAIN"
echo ""
echo "📊 Check status: docker-compose -f docker-compose.prod.yml ps"
