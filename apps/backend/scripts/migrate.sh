#!/bin/sh
set -e

echo "🔄 Running database migration..."

# Build DATABASE_URL from individual components to handle special characters in password
if [ -z "$DATABASE_URL" ]; then
  POSTGRES_USER=${POSTGRES_USER:-ftsmotors}
  POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
  POSTGRES_DB=${POSTGRES_DB:-ftsmotors}
  POSTGRES_HOST=${POSTGRES_HOST:-postgres}
  POSTGRES_PORT=${POSTGRES_PORT:-5432}
  
  # URL encode password using Python
  if command -v python3 >/dev/null 2>&1; then
    ENCODED_PASSWORD=$(python3 -c "import urllib.parse; print(urllib.parse.quote('${POSTGRES_PASSWORD}', safe=''))")
  else
    # Fallback: use node if python is not available
    ENCODED_PASSWORD=$(node -e "console.log(encodeURIComponent('${POSTGRES_PASSWORD}'))")
  fi
  
  export DATABASE_URL="postgresql://${POSTGRES_USER}:${ENCODED_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"
  echo "✅ DATABASE_URL constructed"
fi

# Generate Prisma Client
echo "📦 Generating Prisma Client..."
npx prisma generate || echo "⚠️  Prisma generate warning"

# Run migrations
echo "🔄 Running migrations..."
npx prisma migrate deploy

echo "✅ Migration completed successfully!"

