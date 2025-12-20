#!/bin/bash

# Script to fix environment variables and network issues on server

set -e

PROJECT_DIR="/opt/ftsmotors/ftsmotors"
cd "$PROJECT_DIR"

echo "🔧 Fixing environment and network issues..."

# 1. Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo "❌ .env.production file not found!"
    echo "Creating .env.production from env.production..."
    
    if [ -f "env.production" ]; then
        cp env.production .env.production
        echo "✅ Created .env.production"
    else
        echo "❌ env.production also not found!"
        exit 1
    fi
fi

# 2. Also create .env file (Docker Compose reads .env by default)
if [ ! -f ".env" ]; then
    echo "Creating .env file (Docker Compose default)..."
    cp .env.production .env
    echo "✅ Created .env"
fi

# 3. Remove existing network if it exists (but wasn't created by compose)
echo "Checking network..."
if docker network inspect ftsmotors-network >/dev/null 2>&1; then
    echo "⚠️  Network ftsmotors-network exists"
    echo "Removing existing network..."
    docker network rm ftsmotors-network 2>/dev/null || {
        echo "⚠️  Could not remove network (containers might be using it)"
        echo "Stopping containers first..."
        docker compose -f docker-compose.prod.yml down 2>/dev/null || true
        docker network rm ftsmotors-network 2>/dev/null || true
    }
    echo "✅ Network removed"
fi

# 4. Verify .env file content
echo ""
echo "📝 Current .env file content:"
echo "---"
head -5 .env
echo "..."
echo "---"
echo ""

# 5. Verify variables are set
echo "🔍 Checking environment variables..."
source .env
if [ -z "$POSTGRES_PASSWORD" ]; then
    echo "❌ POSTGRES_PASSWORD is not set!"
    exit 1
fi
if [ -z "$JWT_SECRET" ]; then
    echo "❌ JWT_SECRET is not set!"
    exit 1
fi
echo "✅ Environment variables are set"

echo ""
echo "✅ All fixes applied!"
echo ""
echo "Now you can run:"
echo "  docker compose -f docker-compose.prod.yml up -d"
