#!/bin/bash

# Script to troubleshoot backend issues

set -e

PROJECT_DIR="/opt/ftsmotors/ftsmotors"
cd "$PROJECT_DIR"

echo "🔍 Troubleshooting Backend Issues..."
echo ""

# 1. Check backend logs
echo "📋 Step 1: Checking backend logs..."
echo "---"
docker compose -f docker-compose.prod.yml logs backend --tail=50
echo "---"
echo ""

# 2. Check backend container status
echo "📋 Step 2: Checking backend container status..."
docker compose -f docker-compose.prod.yml ps backend
echo ""

# 3. Check if backend is running
echo "📋 Step 3: Testing backend health endpoint..."
if docker compose -f docker-compose.prod.yml exec -T backend wget --quiet --tries=1 --spider http://localhost:4000/api/health 2>/dev/null; then
    echo "✅ Backend health check passed!"
else
    echo "❌ Backend health check failed!"
    echo ""
    echo "Trying to access backend directly..."
    docker compose -f docker-compose.prod.yml exec -T backend wget --quiet --tries=1 --spider http://localhost:4000/api/health || true
fi
echo ""

# 4. Check database connection
echo "📋 Step 4: Checking database connection from backend..."
docker compose -f docker-compose.prod.yml exec -T backend pg_isready -h postgres -U ${POSTGRES_USER:-ftsmotors} -d ${POSTGRES_DB:-ftsmotors} || echo "❌ Database connection failed!"
echo ""

# 5. Check environment variables
echo "📋 Step 5: Checking environment variables..."
echo "POSTGRES_USER: ${POSTGRES_USER:-ftsmotors}"
echo "POSTGRES_DB: ${POSTGRES_DB:-ftsmotors}"
echo "JWT_SECRET: ${JWT_SECRET:+SET}"
echo "FRONTEND_URL: ${FRONTEND_URL:-https://ftsmotors.ir}"
echo ""

# 6. Check if .env file exists
if [ -f ".env" ]; then
    echo "✅ .env file exists"
else
    echo "❌ .env file NOT found!"
    echo "Please create .env file with required variables"
fi
echo ""

echo "🔧 Common fixes:"
echo "1. If migration failed: docker compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy"
echo "2. If backend crashed: docker compose -f docker-compose.prod.yml logs backend"
echo "3. If database connection failed: Check POSTGRES_PASSWORD in .env file"
echo "4. Rebuild backend: docker compose -f docker-compose.prod.yml build --no-cache backend"
