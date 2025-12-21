#!/bin/bash

# Health check script for FTS Motors deployment

echo "🏥 Health Check for FTS Motors"
echo "==============================="
echo ""

# Check Docker
echo "🐳 Checking Docker..."
if command -v docker &> /dev/null; then
    echo "✅ Docker is installed"
    docker --version
else
    echo "❌ Docker is not installed"
    exit 1
fi

echo ""

# Check Docker Compose
echo "🐳 Checking Docker Compose..."
if command -v docker-compose &> /dev/null; then
    echo "✅ Docker Compose is installed"
    docker-compose --version
else
    echo "❌ Docker Compose is not installed"
    exit 1
fi

echo ""

# Check containers
echo "📦 Checking containers..."
docker-compose -f docker-compose.prod.yml ps

echo ""

# Check services
echo "🌐 Checking services..."

# Frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is running on port 3000"
else
    echo "❌ Frontend is not responding on port 3000"
fi

# Backend
if curl -f http://localhost:4000/health > /dev/null 2>&1; then
    echo "✅ Backend is running on port 4000"
else
    echo "❌ Backend is not responding on port 4000"
fi

# Database
if docker-compose -f docker-compose.prod.yml exec -T postgres pg_isready -U ftsmotors > /dev/null 2>&1; then
    echo "✅ Database is running and ready"
else
    echo "❌ Database is not ready"
fi

echo ""

# Check disk space
echo "💾 Checking disk space..."
df -h | grep -E '^/dev/'

echo ""

# Check memory
echo "🧠 Checking memory..."
free -h

echo ""
echo "✅ Health check completed!"
