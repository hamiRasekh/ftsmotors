#!/bin/bash
set -e

echo "🚀 Starting build and deployment process..."

cd /opt/ftsmotors/ftsmotors

# Step 1: Create package-lock.json if it doesn't exist
echo "📦 Step 1: Creating package-lock.json..."
if [ ! -f package-lock.json ]; then
    npm install --package-lock-only
    echo "✅ package-lock.json created"
else
    echo "✅ package-lock.json already exists"
fi

# Step 2: Build Docker images
echo "🔨 Step 2: Building Docker images..."
docker compose -f docker-compose.prod.yml build

# Step 3: Stop existing containers
echo "🛑 Step 3: Stopping existing containers..."
docker compose -f docker-compose.prod.yml down

# Step 4: Start services
echo "▶️  Step 4: Starting services..."
docker compose -f docker-compose.prod.yml up -d

# Step 5: Wait for backend to be ready
echo "⏳ Step 5: Waiting for backend to be ready..."
sleep 10

# Step 6: Check backend health
echo "🏥 Step 6: Checking backend health..."
max_attempts=30
attempt=0
until docker exec ftsmotors-backend-prod wget --quiet --tries=1 --spider http://localhost:4000/api/health 2>/dev/null || [ $attempt -eq $max_attempts ]; do
    attempt=$((attempt + 1))
    echo "Backend unavailable - attempt $attempt/$max_attempts"
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    echo "❌ Backend health check failed"
    docker compose -f docker-compose.prod.yml logs backend | tail -50
    exit 1
fi

echo "✅ Backend is healthy"

# Step 7: Show status
echo "📊 Step 7: Service status..."
docker compose -f docker-compose.prod.yml ps

echo "🎉 Deployment completed successfully!"

