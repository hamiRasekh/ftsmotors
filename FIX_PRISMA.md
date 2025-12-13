# رفع مشکل Prisma و OpenSSL

## مشکل
خطای `Prisma failed to detect the libssl/openssl version` و `Could not parse schema engine response`

## راه حل اعمال شده

### 1. نصب OpenSSL در Dockerfile
```dockerfile
RUN apk add --no-cache openssl openssl-dev libc6-compat
```

### 2. اصلاح Command در Dockerfile
```dockerfile
CMD ["sh", "-c", "npx prisma generate && (npx prisma migrate deploy || npx prisma migrate dev --name init) && npm run dev"]
```

## دستورات برای راه‌اندازی مجدد

```bash
# توقف کانتینرها
docker-compose -f docker-compose.dev.yml down

# پاک کردن volume ها (اختیاری - فقط اگر مشکل ادامه دارد)
docker-compose -f docker-compose.dev.yml down -v

# ساخت مجدد backend
docker-compose -f docker-compose.dev.yml build --no-cache backend

# راه‌اندازی
docker-compose -f docker-compose.dev.yml up -d

# مشاهده لاگ‌ها
docker-compose -f docker-compose.dev.yml logs -f backend
```

## اگر مشکل ادامه دارد

### راه حل جایگزین 1: استفاده از Node.js کامل به جای Alpine
اگر مشکل ادامه دارد، می‌توانید از `node:18` به جای `node:18-alpine` استفاده کنید:

```dockerfile
FROM node:18
# OpenSSL به صورت پیش‌فرض نصب است
```

### راه حل جایگزین 2: اجرای دستی Migration
```bash
# ورود به کانتینر
docker-compose -f docker-compose.dev.yml exec backend sh

# اجرای دستی
cd /app/apps/backend
npx prisma generate
npx prisma migrate dev --name init
```

### راه حل جایگزین 3: استفاده از Prisma Binary
می‌توانید Prisma را با binary مشخص نصب کنید:

```bash
# در Dockerfile
ENV PRISMA_CLI_BINARY_TARGETS=linux-musl-openssl-1.1.x
```

## بررسی وضعیت

```bash
# بررسی لاگ‌های Prisma
docker-compose -f docker-compose.dev.yml logs backend | grep prisma

# بررسی اتصال به دیتابیس
docker-compose -f docker-compose.dev.yml exec backend npx prisma db pull
```

