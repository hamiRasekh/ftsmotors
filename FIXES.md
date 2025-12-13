# رفع مشکلات Docker

## مشکلات برطرف شده

### 1. مشکل `date-fns-jalali`
- **مشکل**: پکیج `date-fns-jalali@^2.1.0-rc.1` در npm وجود ندارد
- **راه حل**: پکیج از `package.json` حذف شد
- **فایل**: `apps/frontend/package.json`

### 2. Warning `version` در docker-compose
- **مشکل**: Attribute `version` در docker-compose obsolete است
- **راه حل**: `version: '3.8'` از فایل‌های docker-compose حذف شد
- **فایل‌ها**: 
  - `docker-compose.yml`
  - `docker-compose.dev.yml`

## دستورات برای راه‌اندازی مجدد

```bash
# پاک کردن کانتینرهای قبلی
docker-compose -f docker-compose.dev.yml down -v

# ساخت مجدد (بدون cache)
docker-compose -f docker-compose.dev.yml build --no-cache

# راه‌اندازی
docker-compose -f docker-compose.dev.yml up -d

# مشاهده لاگ‌ها
docker-compose -f docker-compose.dev.yml logs -f
```

## اگر هنوز مشکل دارید

اگر هنوز مشکل دارید، می‌توانید:

1. **پاک کردن کامل Docker cache:**
```bash
docker system prune -a --volumes
```

2. **بررسی لاگ‌های دقیق:**
```bash
docker-compose -f docker-compose.dev.yml logs backend
docker-compose -f docker-compose.dev.yml logs frontend
```

3. **اجرای دستی npm install:**
```bash
# در کانتینر frontend
docker-compose -f docker-compose.dev.yml exec frontend sh
cd /app/apps/frontend
npm install --legacy-peer-deps
```

