# راهنمای استقرار سریع FTS Motors

## وضعیت فعلی
- ✅ Docker و Docker Compose نصب شده
- ✅ DNS records تنظیم شده (ftsmotors.ir و api.ftsmotors.ir -> 193.105.234.30)
- ✅ فایل env.production تنظیم شده
- ✅ فایل‌های nginx و docker-compose آماده هستند

## دستورات استقرار

### مرحله 1: ایجاد Network
```bash
cd /opt/ftsmotors/ftsmotors
docker network create ftsmotors-network
```

### مرحله 2: Build و راه‌اندازی سرویس‌ها
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

### مرحله 3: تنظیم SSL (اگر نیاز باشد)
```bash
# ایجاد دایرکتوری‌های certbot
mkdir -p certbot/conf certbot/www

# اگر certificate وجود ندارد، تولید کنید:
docker run --rm \
  --network ftsmotors-network \
  -v $(pwd)/certbot/conf:/etc/letsencrypt \
  -v $(pwd)/certbot/www:/var/www/certbot \
  -p 80:80 \
  certbot/certbot certonly \
  --standalone \
  --email admin@ftsmotors.ir \
  --agree-tos \
  --no-eff-email \
  -d ftsmotors.ir \
  -d www.ftsmotors.ir \
  -d api.ftsmotors.ir
```

### مرحله 4: راه‌اندازی Nginx
```bash
docker compose -f nginx/docker-compose.nginx.yml up -d
```

### مرحله 5: بررسی وضعیت
```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f nginx/docker-compose.nginx.yml ps
```

## اسکریپت خودکار

برای استقرار خودکار، از اسکریپت زیر استفاده کنید:

```bash
cd /opt/ftsmotors/ftsmotors
bash quick-deploy.sh
```

یا

```bash
cd /opt/ftsmotors/ftsmotors
bash deploy-step-by-step.sh
```

## بررسی سلامت سرویس‌ها

```bash
# لاگ‌های backend
docker compose -f docker-compose.prod.yml logs -f backend

# لاگ‌های frontend
docker compose -f docker-compose.prod.yml logs -f frontend

# لاگ‌های nginx
docker compose -f nginx/docker-compose.nginx.yml logs -f nginx

# تست اتصال
curl -k https://localhost/health
curl -k https://localhost/api/health
```

## مشکلات احتمالی

### اگر SSL certificate تولید نشد:
1. مطمئن شوید که DNS records درست تنظیم شده‌اند
2. مطمئن شوید که port 80 باز است
3. از دستور standalone استفاده کنید (نیازی به nginx موقت نیست)

### اگر سرویس‌ها start نمی‌شوند:
```bash
# بررسی لاگ‌ها
docker compose -f docker-compose.prod.yml logs

# بررسی وضعیت
docker compose -f docker-compose.prod.yml ps

# restart سرویس‌ها
docker compose -f docker-compose.prod.yml restart
```

## دستورات مفید

```bash
# توقف همه سرویس‌ها
docker compose -f docker-compose.prod.yml down
docker compose -f nginx/docker-compose.nginx.yml down

# راه‌اندازی مجدد
docker compose -f docker-compose.prod.yml restart
docker compose -f nginx/docker-compose.nginx.yml restart

# مشاهده لاگ‌های real-time
docker compose -f docker-compose.prod.yml logs -f

# اجرای migration
docker compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy
```

