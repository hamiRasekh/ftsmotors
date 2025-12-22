# دستورات Migration

## روش 1: استفاده از اسکریپت (پس از rebuild)

```bash
docker exec -it ftsmotors-backend-prod sh /app/scripts/migrate.sh
```

## روش 2: دستور inline (بدون نیاز به rebuild)

```bash
docker exec -it ftsmotors-backend-prod sh -c '
POSTGRES_USER=${POSTGRES_USER:-ftsmotors}
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
POSTGRES_DB=${POSTGRES_DB:-ftsmotors}
POSTGRES_HOST=${POSTGRES_HOST:-postgres}
POSTGRES_PORT=${POSTGRES_PORT:-5432}

# URL encode password using Python
ENCODED_PASSWORD=$(python3 -c "import urllib.parse; print(urllib.parse.quote('\''${POSTGRES_PASSWORD}'\'', safe='\'''\''))")

export DATABASE_URL="postgresql://${POSTGRES_USER}:${ENCODED_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"

echo "🔄 Running migrations..."
cd /app && npx prisma generate && npx prisma migrate deploy
'
```

## روش 3: دستور ساده‌تر (یک خط)

```bash
docker exec -it ftsmotors-backend-prod sh -c 'export DATABASE_URL="postgresql://${POSTGRES_USER:-ftsmotors}:$(python3 -c "import urllib.parse; print(urllib.parse.quote('\''${POSTGRES_PASSWORD}'\'', safe='\'''\''))")@${POSTGRES_HOST:-postgres}:${POSTGRES_PORT:-5432}/${POSTGRES_DB:-ftsmotors}?schema=public" && cd /app && npx prisma generate && npx prisma migrate deploy'
```

## روش 4: Restart کردن container (ساده‌ترین روش)

```bash
docker restart ftsmotors-backend-prod
docker logs -f ftsmotors-backend-prod
```

