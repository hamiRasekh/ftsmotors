#!/bin/sh
set -e

echo "🚀 Starting FTS Motors Backend (Production)..."

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
max_attempts=30
attempt=0
until pg_isready -h postgres -U ${POSTGRES_USER:-ftsmotors} -d ${POSTGRES_DB:-ftsmotors} || [ $attempt -eq $max_attempts ]; do
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
