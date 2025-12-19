# راهنمای کامل استقرار (Deployment Guide)

این راهنما به شما کمک می‌کند تا پروژه FTS Motors را روی سرور Ubuntu به صورت کامل و بدون باگ استقرار دهید.

## 📋 پیش‌نیازها

- سرور Ubuntu 20.04 یا بالاتر
- دسترسی root یا sudo
- دامنه‌های تنظیم شده:
  - `ftsmotors.ir` (یا دامنه شما)
  - `www.ftsmotors.ir`
  - `api.ftsmotors.ir`
- DNS records که به IP سرور شما (193.105.234.30) اشاره می‌کنند

## 🚀 مراحل استقرار

### مرحله 1: اتصال به سرور

```bash
ssh root@193.105.234.30
# یا
ssh your_username@193.105.234.30
```

### مرحله 2: راه‌اندازی اولیه سرور

فایل `deploy/setup-server.sh` را اجرا کنید:

```bash
# دانلود و اجرای اسکریپت
curl -fsSL https://raw.githubusercontent.com/your-repo/ftsmotors/main/deploy/setup-server.sh -o setup-server.sh
chmod +x setup-server.sh
./setup-server.sh
```

یا به صورت دستی:

```bash
# به‌روزرسانی سیستم
sudo apt-get update && sudo apt-get upgrade -y

# نصب Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# نصب Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# تنظیم فایروال
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# خروج و ورود مجدد برای اعمال تغییرات Docker
exit
# سپس دوباره وارد شوید
```

### مرحله 3: کلون کردن پروژه

```bash
# ایجاد دایرکتوری
sudo mkdir -p /opt/ftsmotors
sudo chown $USER:$USER /opt/ftsmotors

# کلون کردن پروژه (یا آپلود فایل‌ها)
cd /opt/ftsmotors
git clone https://github.com/your-repo/ftsmotors.git .
# یا از طریق SCP/SFTP فایل‌ها را آپلود کنید
```

### مرحله 4: تنظیم فایل‌های Environment

```bash
cd /opt/ftsmotors

# کپی کردن فایل نمونه
cp .env.production.example .env.production

# ویرایش فایل
nano .env.production
```

محتویات `.env.production` را به این صورت تنظیم کنید:

```env
# Database Configuration
POSTGRES_USER=ftsmotors
POSTGRES_PASSWORD=YOUR_VERY_SECURE_PASSWORD_HERE
POSTGRES_DB=ftsmotors

# Backend Configuration
JWT_SECRET=YOUR_VERY_LONG_RANDOM_SECRET_KEY_HERE
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://ftsmotors.ir

# Frontend Configuration
NEXT_PUBLIC_API_URL=https://api.ftsmotors.ir
NEXT_PUBLIC_SITE_URL=https://ftsmotors.ir

# Domain Configuration
DOMAIN=ftsmotors.ir
EMAIL=your-email@example.com
```

**⚠️ مهم:** 
- `POSTGRES_PASSWORD` را به یک رمز عبور قوی تغییر دهید
- `JWT_SECRET` را به یک رشته تصادفی طولانی تغییر دهید (می‌توانید از `openssl rand -base64 32` استفاده کنید)

### مرحله 5: تنظیم Nginx

```bash
cd /opt/ftsmotors

# ایجاد دایرکتوری‌های لازم
mkdir -p nginx/conf.d certbot/conf certbot/www

# فایل nginx.conf در مسیر nginx/nginx.conf قرار دارد
# اگر نیاز به تغییر دارید، آن را ویرایش کنید
```

### مرحله 6: استقرار پروژه

```bash
cd /opt/ftsmotors

# دادن دسترسی اجرا به اسکریپت
chmod +x deploy/deploy.sh

# اجرای اسکریپت استقرار
./deploy/deploy.sh
```

یا به صورت دستی:

```bash
# ساخت و راه‌اندازی کانتینرها
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# راه‌اندازی Nginx
docker-compose -f nginx/docker-compose.nginx.yml up -d

# اجرای Migration
docker-compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy

# بررسی وضعیت
docker-compose -f docker-compose.prod.yml ps
```

### مرحله 7: تنظیم SSL (Let's Encrypt)

اگر اسکریپت deploy.sh به صورت خودکار SSL را تنظیم نکرد:

```bash
# راه‌اندازی موقت Nginx
docker-compose -f nginx/docker-compose.nginx.yml up -d nginx

# دریافت گواهینامه SSL
docker-compose -f nginx/docker-compose.nginx.yml run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email your-email@example.com \
    --agree-tos \
    --no-eff-email \
    -d ftsmotors.ir \
    -d www.ftsmotors.ir \
    -d api.ftsmotors.ir

# راه‌اندازی مجدد Nginx
docker-compose -f nginx/docker-compose.nginx.yml restart nginx
```

## 🔧 مدیریت و نگهداری

### مشاهده لاگ‌ها

```bash
# همه سرویس‌ها
docker-compose -f docker-compose.prod.yml logs -f

# سرویس خاص
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f postgres
```

### توقف و راه‌اندازی مجدد

```bash
# توقف
docker-compose -f docker-compose.prod.yml down

# راه‌اندازی
docker-compose -f docker-compose.prod.yml up -d

# راه‌اندازی مجدد
docker-compose -f docker-compose.prod.yml restart
```

### به‌روزرسانی پروژه

```bash
cd /opt/ftsmotors

# دریافت آخرین تغییرات
git pull origin main

# بازسازی و راه‌اندازی مجدد
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# اجرای Migration (در صورت نیاز)
docker-compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy
```

### پشتیبان‌گیری از دیتابیس

```bash
# ایجاد بکاپ
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U ftsmotors ftsmotors > backup_$(date +%Y%m%d_%H%M%S).sql

# بازگردانی بکاپ
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U ftsmotors ftsmotors < backup_file.sql
```

### بررسی سلامت سرویس‌ها

```bash
# وضعیت کانتینرها
docker-compose -f docker-compose.prod.yml ps

# بررسی سلامت Backend
curl http://localhost:4000/health

# بررسی سلامت Frontend
curl http://localhost:3000

# بررسی از طریق Nginx
curl https://ftsmotors.ir/health
curl https://api.ftsmotors.ir/health
```

## 🐛 عیب‌یابی

### مشکل: کانتینرها راه‌اندازی نمی‌شوند

```bash
# بررسی لاگ‌ها
docker-compose -f docker-compose.prod.yml logs

# بررسی وضعیت
docker-compose -f docker-compose.prod.yml ps

# بررسی استفاده از پورت‌ها
sudo netstat -tulpn | grep -E '3000|4000|5432'
```

### مشکل: اتصال به دیتابیس برقرار نمی‌شود

```bash
# بررسی وضعیت PostgreSQL
docker-compose -f docker-compose.prod.yml exec postgres pg_isready -U ftsmotors

# بررسی لاگ‌های PostgreSQL
docker-compose -f docker-compose.prod.yml logs postgres

# اتصال به دیتابیس
docker-compose -f docker-compose.prod.yml exec postgres psql -U ftsmotors -d ftsmotors
```

### مشکل: SSL کار نمی‌کند

```bash
# بررسی گواهینامه‌ها
ls -la certbot/conf/live/ftsmotors.ir/

# تمدید دستی گواهینامه
docker-compose -f nginx/docker-compose.nginx.yml run --rm certbot renew

# بررسی لاگ‌های Nginx
docker-compose -f nginx/docker-compose.nginx.yml logs nginx
```

### مشکل: Frontend به Backend متصل نمی‌شود

1. بررسی متغیرهای محیطی:
```bash
docker-compose -f docker-compose.prod.yml exec frontend env | grep API
```

2. بررسی شبکه Docker:
```bash
docker network inspect ftsmotors_ftsmotors-network
```

3. تست اتصال از Frontend به Backend:
```bash
docker-compose -f docker-compose.prod.yml exec frontend wget -O- http://backend:4000/health
```

## 🔒 امنیت

### تغییر رمزهای عبور پیش‌فرض

1. تغییر رمز دیتابیس:
```bash
# ویرایش .env.production
nano .env.production

# تغییر POSTGRES_PASSWORD

# راه‌اندازی مجدد
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```

2. تغییر JWT_SECRET:
```bash
# تولید کلید جدید
openssl rand -base64 32

# ویرایش .env.production و راه‌اندازی مجدد
```

### تنظیمات فایروال

```bash
# فقط پورت‌های لازم را باز کنید
sudo ufw status
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw deny 5432/tcp   # PostgreSQL (فقط داخلی)
```

## 📊 مانیتورینگ

### بررسی استفاده از منابع

```bash
# استفاده از CPU و RAM
htop

# استفاده از دیسک
df -h

# استفاده از Docker
docker stats
```

### تنظیم Log Rotation

برای جلوگیری از پر شدن دیسک با لاگ‌ها، می‌توانید log rotation را تنظیم کنید.

## 📞 پشتیبانی

در صورت بروز مشکل:
1. لاگ‌ها را بررسی کنید
2. وضعیت کانتینرها را چک کنید
3. اتصالات شبکه را بررسی کنید
4. فایل‌های environment را بررسی کنید

## ✅ چک‌لیست نهایی

- [ ] سرور راه‌اندازی شده است
- [ ] Docker و Docker Compose نصب شده‌اند
- [ ] پروژه کلون/آپلود شده است
- [ ] فایل `.env.production` تنظیم شده است
- [ ] رمزهای عبور تغییر کرده‌اند
- [ ] کانتینرها راه‌اندازی شده‌اند
- [ ] Migration اجرا شده است
- [ ] SSL تنظیم شده است
- [ ] سایت از طریق HTTPS در دسترس است
- [ ] API از طریق HTTPS در دسترس است
- [ ] فایروال تنظیم شده است

---

**موفق باشید! 🚀**
