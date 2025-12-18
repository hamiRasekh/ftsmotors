# راهنمای تنظیم Environment Variables

## مشکل: خطای اتصال به دیتابیس

اگر خطای `Can't reach database server at postgres:5432` دریافت می‌کنید، به این معنی است که:

1. **در حال اجرای local هستید** اما `DATABASE_URL` برای Docker تنظیم شده
2. **یا** دیتابیس در حال اجرا نیست

## راه حل 1: استفاده از Docker (توصیه می‌شود)

```bash
# از root directory پروژه
docker-compose up -d postgres
```

سپس `DATABASE_URL` را برای Docker تنظیم کنید:
```
DATABASE_URL="postgresql://ftsmotors:ftsmotors123@postgres:5432/ftsmotors?schema=public"
```

## راه حل 2: استفاده از Local Database

اگر PostgreSQL را به صورت local نصب کرده‌اید:

1. فایل `.env` را در `apps/backend/` ایجاد کنید:
```env
DATABASE_URL="postgresql://ftsmotors:ftsmotors123@localhost:5432/ftsmotors?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=4000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

2. مطمئن شوید که PostgreSQL در حال اجرا است:
```bash
# Windows
net start postgresql-x64-15

# Linux/Mac
sudo systemctl start postgresql
```

3. دیتابیس را ایجاد کنید:
```sql
CREATE DATABASE ftsmotors;
CREATE USER ftsmotors WITH PASSWORD 'ftsmotors123';
GRANT ALL PRIVILEGES ON DATABASE ftsmotors TO ftsmotors;
```

## بررسی وضعیت دیتابیس

```bash
# بررسی اتصال به دیتابیس Docker
docker-compose ps postgres

# بررسی اتصال به دیتابیس local
psql -h localhost -U ftsmotors -d ftsmotors
```

