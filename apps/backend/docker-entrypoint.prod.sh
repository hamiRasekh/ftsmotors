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
npx prisma generate || {
  echo "⚠️  Prisma generate warning"
  echo "⚠️  Continuing anyway..."
}

# Run migrations (this will apply all pending migrations)
echo "🔄 Running migrations..."
echo "📋 Checking for pending migrations..."
npx prisma migrate deploy || {
  echo "❌ Migration failed"
  echo "💡 Trying to resolve migration issues..."
  # Try to mark migrations as applied if they already exist in DB
  npx prisma migrate resolve --applied || echo "⚠️  Could not resolve migrations"
  # Try deploy again
  npx prisma migrate deploy || {
    echo "❌ Migration failed after retry"
    exit 1
  }
}
echo "✅ Migrations completed successfully"

# Run seed (only if no data exists or to update existing data)
echo "🌱 Running database seed..."
# Change to correct directory for seed execution (prisma files are in /app)
cd /app 2>/dev/null || true

# Try using prisma db seed first (uses package.json seed config)
echo "📦 Attempting to run seed with prisma db seed..."
if npx prisma db seed 2>&1; then
  echo "✅ Seed completed successfully"
else
  echo "⚠️  prisma db seed failed, trying compiled version..."
  # Fallback: try compiled version if available
  if [ -f "/app/dist/prisma/seed.js" ]; then
    echo "📦 Using compiled seed file..."
    node dist/prisma/seed.js || echo "⚠️  Compiled seed failed, but continuing..."
  else
    echo "⚠️  Seed skipped (tsx/ts-node not available and compiled version not found)"
    echo "💡 To run seed manually, use: docker-compose exec backend npx prisma db seed"
  fi
fi

# Start the application - main.js is in dist/src/main.js
echo "🎉 Starting application..."
exec node dist/src/main.js
