# راهنمای تنظیم Environment Variables

## مشکل: خطای اتصال به دیتابیس

اگر خطای `Can't reach database server at postgres:5432` دریافت می‌کنید، به این معنی است که:

- **در حال اجرای local هستید** اما `DATABASE_URL` برای Docker تنظیم شده (`postgres:5432`)
- **یا** در حال اجرای Docker هستید اما `DATABASE_URL` برای local تنظیم شده (`localhost:5432`)

## راه حل سریع

### برای Local Development:

```powershell
# از directory apps/backend
.\setup-local-env.ps1
```

این script به صورت خودکار `DATABASE_URL` را به `localhost:5432` تغییر می‌دهد.

### برای Docker Development:

```powershell
# از directory apps/backend
.\setup-docker-env.ps1
```

این script به صورت خودکار `DATABASE_URL` را به `postgres:5432` تغییر می‌دهد.

## راه حل دستی

### Local Development:

فایل `.env` را ویرایش کنید و `DATABASE_URL` را به این صورت تغییر دهید:

```env
DATABASE_URL="postgresql://ftsmotors:ftsmotors123@localhost:5432/ftsmotors?schema=public"
```

**مهم:** مطمئن شوید که:
1. PostgreSQL در حال اجرا است (از Docker یا local installation)
2. دیتابیس `ftsmotors` وجود دارد
3. User `ftsmotors` با password `ftsmotors123` وجود دارد

### Docker Development:

```env
DATABASE_URL="postgresql://ftsmotors:ftsmotors123@postgres:5432/ftsmotors?schema=public"
```

**مهم:** مطمئن شوید که:
1. Docker containers در حال اجرا هستند: `docker-compose up -d`
2. Container `ftsmotors-db` healthy است

## بررسی وضعیت

### بررسی Docker:

```bash
docker-compose ps
```

### بررسی اتصال به دیتابیس:

```bash
# برای local
psql -h localhost -U ftsmotors -d ftsmotors

# برای Docker
docker exec -it ftsmotors-db psql -U ftsmotors -d ftsmotors
```

## نکات مهم

1. **هرگز `.env` را commit نکنید** - این فایل در `.gitignore` است
2. **برای production** از environment variables سرور استفاده کنید
3. **برای team development** از `.env.example` استفاده کنید

