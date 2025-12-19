# 📋 خلاصه فایل‌های استقرار

این فایل خلاصه‌ای از تمام فایل‌هایی است که برای استقرار پروژه ایجاد شده‌اند.

## 📁 ساختار فایل‌ها

### 1. فایل‌های Docker Production

- **`docker-compose.prod.yml`** - تنظیمات Docker Compose برای production
- **`apps/backend/Dockerfile.prod`** - Dockerfile برای backend در production
- **`apps/frontend/Dockerfile.prod`** - Dockerfile برای frontend در production
- **`apps/backend/docker-entrypoint.prod.sh`** - اسکریپت راه‌اندازی backend

### 2. تنظیمات Nginx

- **`nginx/nginx.conf`** - تنظیمات کامل Nginx برای reverse proxy و SSL
- **`nginx/docker-compose.nginx.yml`** - Docker Compose برای Nginx و Certbot

### 3. اسکریپت‌های استقرار

- **`deploy/setup-server.sh`** - راه‌اندازی اولیه سرور (نصب Docker، تنظیم فایروال)
- **`deploy/deploy.sh`** - اسکریپت کامل استقرار (build، deploy، SSL)
- **`deploy/quick-deploy.sh`** - اسکریپت سریع استقرار
- **`deploy/check-health.sh`** - بررسی سلامت سرویس‌ها

### 4. فایل‌های Environment

- **`env.production.example`** - نمونه فایل environment برای production

### 5. مستندات

- **`DEPLOYMENT.md`** - راهنمای کامل و جامع استقرار
- **`README_DEPLOY.md`** - راهنمای سریع استقرار

## 🚀 مراحل سریع استقرار

### روی سرور Ubuntu:

```bash
# 1. راه‌اندازی اولیه
./deploy/setup-server.sh

# 2. آپلود پروژه به /opt/ftsmotors

# 3. تنظیم environment
cp env.production.example .env.production
nano .env.production  # تغییر رمزها

# 4. استقرار
chmod +x deploy/*.sh
./deploy/deploy.sh
```

## 🔧 تنظیمات مهم

### Environment Variables (.env.production)

```env
POSTGRES_PASSWORD=YOUR_SECURE_PASSWORD
JWT_SECRET=YOUR_RANDOM_SECRET_KEY
DOMAIN=ftsmotors.ir
EMAIL=your-email@example.com
```

### DNS Records

- `@` (root) → 193.105.234.30
- `www` → 193.105.234.30
- `api` → 193.105.234.30

### Ports

- `80` - HTTP (redirect to HTTPS)
- `443` - HTTPS
- `3000` - Frontend (internal)
- `4000` - Backend (internal)
- `5432` - PostgreSQL (internal)

## ✅ چک‌لیست

- [ ] سرور راه‌اندازی شده
- [ ] Docker و Docker Compose نصب شده
- [ ] پروژه آپلود شده
- [ ] `.env.production` تنظیم شده
- [ ] رمزهای عبور تغییر کرده‌اند
- [ ] DNS تنظیم شده
- [ ] کانتینرها راه‌اندازی شده‌اند
- [ ] SSL تنظیم شده
- [ ] سایت در دسترس است

## 🐛 عیب‌یابی

```bash
# بررسی وضعیت
docker-compose -f docker-compose.prod.yml ps

# مشاهده لاگ‌ها
docker-compose -f docker-compose.prod.yml logs -f

# بررسی سلامت
./deploy/check-health.sh
```

## 📞 نکات مهم

1. **امنیت**: حتماً رمزهای عبور پیش‌فرض را تغییر دهید
2. **SSL**: گواهینامه SSL به صورت خودکار با Let's Encrypt تنظیم می‌شود
3. **بکاپ**: به صورت منظم از دیتابیس بکاپ بگیرید
4. **مانیتورینگ**: لاگ‌ها را به صورت منظم بررسی کنید

---

برای جزئیات بیشتر، فایل `DEPLOYMENT.md` را مطالعه کنید.
