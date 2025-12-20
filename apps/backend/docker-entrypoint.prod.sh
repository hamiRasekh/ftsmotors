#!/bin/sh
set -e

echo "🚀 Starting FTS Motors Backend (Production)..."

# Build DATABASE_URL from individual components to handle special characters in password
if [ -z "$DATABASE_URL" ]; then
  POSTGRES_USER=${POSTGRES_USER:-ftsmotors}
  POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
  POSTGRES_DB=${POSTGRES_DB:-ftsmotors}
  POSTGRES_HOST=${POSTGRES_HOST:-postgres}
  POSTGRES_PORT=${POSTGRES_PORT:-5432}
  
  # URL encode password using Python
  ENCODED_PASSWORD=$(python3 -c "import urllib.parse; print(urllib.parse.quote('${POSTGRES_PASSWORD}', safe=''))")
  
  export DATABASE_URL="postgresql://${POSTGRES_USER}:${ENCODED_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"
  echo "✅ DATABASE_URL constructed"
fi

# Wait for database to be ready
echo "⏳ Waiting for database..."
max_attempts=30
attempt=0
until pg_isready -h ${POSTGRES_HOST:-postgres} -U ${POSTGRES_USER:-ftsmotors} -d ${POSTGRES_DB:-ftsmotors} || [ $attempt -eq $max_attempts ]; do
  attempt=$((attempt + 1))
  echo "Database unavailable - attempt $attempt/$max_attempts"
  sleep 2
done

if [ $attempt -eq $max_attempts ]; then
  echo "❌ Database connection failed"
  exit 1
fi

echo "✅ Database ready"

# Generate Prisma Client
echo "📦 Generating Prisma Client..."
npx prisma generate || echo "⚠️  Prisma generate warning"

# Run migrations
echo "🔄 Running migrations..."
npx prisma migrate deploy || {
  echo "❌ Migration failed"
  exit 1
}

# Start the application - main.js is in dist/src/main.js
echo "🎉 Starting application..."
exec node dist/src/main.js
