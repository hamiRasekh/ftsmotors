# 🚀 راهنمای سریع استقرار

## مراحل سریع

### 1. اتصال به سرور
```bash
ssh root@193.105.234.30
```

### 2. راه‌اندازی اولیه (یک بار)
```bash
# نصب Docker و Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh
sudo usermod -aG docker $USER

# نصب Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# تنظیم فایروال
sudo ufw allow 22/tcp && sudo ufw allow 80/tcp && sudo ufw allow 443/tcp && sudo ufw enable

# خروج و ورود مجدد
exit
```

### 3. آپلود پروژه
```bash
# ایجاد دایرکتوری
sudo mkdir -p /opt/ftsmotors
sudo chown $USER:$USER /opt/ftsmotors

# آپلود فایل‌های پروژه (از طریق SCP/SFTP یا Git)
cd /opt/ftsmotors
# یا: git clone your-repo .
```

### 4. تنظیم Environment
```bash
cd /opt/ftsmotors
cp env.production.example .env.production
nano .env.production  # رمزهای عبور را تغییر دهید
```

### 5. استقرار
```bash
chmod +x deploy/deploy.sh
./deploy/deploy.sh
```

یا سریع:
```bash
chmod +x deploy/quick-deploy.sh
./deploy/quick-deploy.sh
```

## دستورات مفید

```bash
# مشاهده لاگ‌ها
docker-compose -f docker-compose.prod.yml logs -f

# راه‌اندازی مجدد
docker-compose -f docker-compose.prod.yml restart

# توقف
docker-compose -f docker-compose.prod.yml down

# وضعیت
docker-compose -f docker-compose.prod.yml ps
```

## تنظیم SSL

اگر SSL خودکار تنظیم نشد:

```bash
docker-compose -f nginx/docker-compose.nginx.yml run --rm certbot certonly \
    --webroot --webroot-path=/var/www/certbot \
    --email your-email@example.com --agree-tos --no-eff-email \
    -d ftsmotors.ir -d www.ftsmotors.ir -d api.ftsmotors.ir
```

---

برای راهنمای کامل، فایل `DEPLOYMENT.md` را مطالعه کنید.
