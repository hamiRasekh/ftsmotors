#!/bin/sh
set -e

echo "🚀 Starting FTS Motors Backend..."

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
max_attempts=30
attempt=0
until pg_isready -h postgres -U ftsmotors -d ftsmotors || [ $attempt -eq $max_attempts ]; do
  attempt=$((attempt + 1))
  echo "Database is unavailable - sleeping (attempt $attempt/$max_attempts)"
  sleep 2
done

if [ $attempt -eq $max_attempts ]; then
  echo "❌ Database connection failed after $max_attempts attempts"
  exit 1
fi

echo "✅ Database is ready!"

# Generate Prisma Client
echo "📦 Generating Prisma Client..."
cd /app/apps/backend
npx prisma generate

# Run migrations
echo "🔄 Running database migrations..."
npx prisma migrate deploy || {
  echo "⚠️  Migration deploy failed, trying migrate dev..."
  npx prisma migrate dev --name init --create-only || true
  npx prisma migrate deploy || true
}

# Run seed
echo "🌱 Running database seed..."
npm run prisma:seed || {
  echo "⚠️  Seed failed, but continuing..."
}

# Start the application
echo "🎉 Starting NestJS application..."
exec npm run start:prod

