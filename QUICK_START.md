# راه‌اندازی سریع FTS Motors

## 🚀 شروع سریع با Docker

### 1. راه‌اندازی Development

```bash
# راه‌اندازی تمام سرویس‌ها
docker-compose -f docker-compose.dev.yml up -d

# صبر کنید تا سرویس‌ها آماده شوند (حدود 30 ثانیه)
# سپس دسترسی‌ها:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:4000
# - Swagger: http://localhost:4000/api
```

### 2. ایجاد کاربر Admin

```bash
# پس از راه‌اندازی، کاربر Admin را ایجاد کنید:
docker-compose -f docker-compose.dev.yml exec backend npm run create:admin admin@ftsmotors.com admin123

# یا با ایمیل و رمز عبور دلخواه:
docker-compose -f docker-compose.dev.yml exec backend npm run create:admin your-email@example.com your-password
```

### 3. ورود به پنل ادمین

1. به آدرس http://localhost:3000/admin/login بروید
2. با ایمیل و رمز عبور Admin وارد شوید
3. از پنل مدیریت استفاده کنید

## 📋 دستورات مفید

### مشاهده لاگ‌ها
```bash
docker-compose -f docker-compose.dev.yml logs -f
```

### توقف سرویس‌ها
```bash
docker-compose -f docker-compose.dev.yml down
```

### بازسازی سرویس‌ها
```bash
docker-compose -f docker-compose.dev.yml up -d --build
```

### باز کردن Prisma Studio
```bash
docker-compose -f docker-compose.dev.yml exec backend npx prisma studio
```

## 🎨 شروع طراحی فرانت

پس از راه‌اندازی، می‌توانید شروع به طراحی فرانت کنید:

1. فایل‌های فرانت در `apps/frontend/src/app/` قرار دارند
2. کامپوننت‌ها در `apps/frontend/src/components/` هستند
3. استایل‌ها با Tailwind CSS نوشته شده‌اند
4. فونت فارسی Vazir از CDN لود می‌شود

### ساختار صفحات:

- `app/page.tsx` - صفحه اصلی
- `app/about/page.tsx` - درباره ما
- `app/contact/page.tsx` - تماس با ما
- `app/cars/` - صفحات خودروها
- `app/blog/` - صفحات مقالات
- `app/news/` - صفحات اخبار
- `app/admin/` - پنل مدیریت

## 🔧 تنظیمات

### تغییر پورت‌ها

در فایل `docker-compose.dev.yml` می‌توانید پورت‌ها را تغییر دهید:

```yaml
ports:
  - "3000:3000"  # Frontend
  - "4000:4000"  # Backend
  - "5432:5432"  # PostgreSQL
```

### تغییر رمز عبور دیتابیس

در فایل `docker-compose.dev.yml`:

```yaml
environment:
  POSTGRES_PASSWORD: your-password-here
  DATABASE_URL: postgresql://ftsmotors:your-password-here@postgres:5432/ftsmotors?schema=public
```

## ⚠️ نکات مهم

1. **اولین بار**: پس از راه‌اندازی، حتماً کاربر Admin را ایجاد کنید
2. **Development**: از `docker-compose.dev.yml` استفاده کنید
3. **Production**: از `docker-compose.yml` استفاده کنید
4. **Backup**: به صورت منظم از دیتابیس backup بگیرید

## 🆘 عیب‌یابی

### مشکل در اتصال به دیتابیس
```bash
# بررسی وضعیت
docker-compose -f docker-compose.dev.yml ps

# بررسی لاگ‌ها
docker-compose -f docker-compose.dev.yml logs postgres
```

### مشکل در Backend
```bash
# بررسی لاگ‌ها
docker-compose -f docker-compose.dev.yml logs backend

# ورود به کانتینر
docker-compose -f docker-compose.dev.yml exec backend sh
```

### مشکل در Frontend
```bash
# بررسی لاگ‌ها
docker-compose -f docker-compose.dev.yml logs frontend

# پاک کردن cache
docker-compose -f docker-compose.dev.yml exec frontend rm -rf .next
```

## 📚 مستندات بیشتر

برای اطلاعات بیشتر، فایل `SETUP.md` و `README.md` را مطالعه کنید.

