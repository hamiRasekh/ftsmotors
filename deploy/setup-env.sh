#!/bin/bash

# Script to create .env.production file with secure values

set -e

PROJECT_DIR="/opt/ftsmotors/ftsmotors"
ENV_FILE="$PROJECT_DIR/.env.production"

echo "🔧 Setting up .env.production file..."

# Generate secure password for database
DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)

# Generate secure JWT secret
JWT_SECRET=$(openssl rand -base64 64 | tr -d "=+/" | cut -c1-80)

# Create .env.production file
cat > "$ENV_FILE" << EOF
# Database Configuration
POSTGRES_USER=ftsmotors
POSTGRES_PASSWORD=${DB_PASSWORD}
POSTGRES_DB=ftsmotors

# Backend Configuration
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://ftsmotors.ir

# Frontend Configuration
NEXT_PUBLIC_API_URL=https://api.ftsmotors.ir
NEXT_PUBLIC_SITE_URL=https://ftsmotors.ir

# Domain Configuration
DOMAIN=ftsmotors.ir
EMAIL=admin@ftsmotors.ir
EOF

echo "✅ .env.production file created successfully!"
echo ""
echo "📝 Generated values:"
echo "   POSTGRES_PASSWORD: ${DB_PASSWORD}"
echo "   JWT_SECRET: ${JWT_SECRET:0:20}..."
echo ""
echo "⚠️  IMPORTANT: Save these credentials securely!"
echo "   File location: $ENV_FILE"
