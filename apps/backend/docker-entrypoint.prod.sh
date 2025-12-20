#!/bin/sh
set -e

echo "🚀 Starting FTS Motors Backend (Production)..."

# Build DATABASE_URL from individual components to handle special characters in password
# URL encode the password if DATABASE_URL is not already set
if [ -z "$DATABASE_URL" ]; then
  POSTGRES_USER=${POSTGRES_USER:-ftsmotors}
  POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
  POSTGRES_DB=${POSTGRES_DB:-ftsmotors}
  POSTGRES_HOST=${POSTGRES_HOST:-postgres}
  POSTGRES_PORT=${POSTGRES_PORT:-5432}
  
  # URL encode password using Python (available in Alpine)
  ENCODED_PASSWORD=$(python3 -c "import urllib.parse; print(urllib.parse.quote('${POSTGRES_PASSWORD}', safe=''))")
  
  export DATABASE_URL="postgresql://${POSTGRES_USER}:${ENCODED_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"
  echo "✅ DATABASE_URL constructed from environment variables"
else
  echo "✅ Using provided DATABASE_URL"
fi

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
max_attempts=30
attempt=0
until pg_isready -h ${POSTGRES_HOST:-postgres} -U ${POSTGRES_USER:-ftsmotors} -d ${POSTGRES_DB:-ftsmotors} || [ $attempt -eq $max_attempts ]; do
  attempt=$((attempt + 1))
  echo "Database is unavailable - sleeping (attempt $attempt/$max_attempts)"
  sleep 2
done

if [ $attempt -eq $max_attempts ]; then
  echo "❌ Database connection failed after $max_attempts attempts"
  exit 1
fi

echo "✅ Database is ready!"

# Generate Prisma Client (in case it wasn't generated during build)
echo "📦 Generating Prisma Client..."
npx prisma generate || echo "⚠️  Prisma generate failed, but continuing..."

# Run migrations
echo "🔄 Running database migrations..."
npx prisma migrate deploy || {
  echo "❌ Migration deploy failed!"
  exit 1
}

# Start the application
echo "🎉 Starting NestJS application..."
exec node dist/main.js
