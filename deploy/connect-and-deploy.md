# 🔌 راهنمای اتصال و استقرار روی سرور

## اطلاعات سرور
- **IP**: 193.105.234.30
- **Port**: 20
- **Username**: root
- **Password**: p@ss0509

## روش 1: استقرار خودکار (توصیه می‌شود)

### روی Windows (PowerShell):

```powershell
cd d:\websites\ftsmotors
.\deploy\remote-deploy.ps1
```

### روی Linux/Mac:

```bash
cd /path/to/ftsmotors
chmod +x deploy/remote-deploy.sh
./deploy/remote-deploy.sh
```

## روش 2: استقرار دستی

### مرحله 1: اتصال به سرور

```bash
ssh -p 20 root@193.105.234.30
# Password: p@ss0509
```

### مرحله 2: راه‌اندازی اولیه سرور

```bash
# نصب Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# نصب Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# تنظیم فایروال
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### مرحله 3: آپلود پروژه

از سیستم محلی خود (Windows):

```powershell
# نصب WinSCP یا استفاده از SCP
scp -P 20 -r d:\websites\ftsmotors root@193.105.234.30:/opt/
```

یا از Git:

```bash
# روی سرور
mkdir -p /opt/ftsmotors
cd /opt/ftsmotors
git clone your-repo-url .
```

### مرحله 4: تنظیم Environment

```bash
cd /opt/ftsmotors
cp env.production.example .env.production
nano .env.production
```

**مهم**: رمزهای زیر را تغییر دهید:
- `POSTGRES_PASSWORD` - یک رمز قوی برای دیتابیس
- `JWT_SECRET` - یک رشته تصادفی طولانی (می‌توانید از `openssl rand -base64 32` استفاده کنید)

### مرحله 5: استقرار

```bash
cd /opt/ftsmotors
chmod +x deploy/*.sh
./deploy/deploy.sh
```

## روش 3: استفاده از WinSCP (برای Windows)

1. دانلود و نصب WinSCP
2. اتصال:
   - Host: 193.105.234.30
   - Port: 20
   - Username: root
   - Password: p@ss0509
3. آپلود فایل‌های پروژه به `/opt/ftsmotors`
4. اتصال SSH و اجرای دستورات استقرار

## بررسی وضعیت

```bash
# اتصال به سرور
ssh -p 20 root@193.105.234.30

# بررسی وضعیت کانتینرها
cd /opt/ftsmotors
docker-compose -f docker-compose.prod.yml ps

# مشاهده لاگ‌ها
docker-compose -f docker-compose.prod.yml logs -f

# بررسی سلامت
./deploy/check-health.sh
```

## عیب‌یابی

### مشکل در اتصال SSH

```bash
# بررسی پورت
telnet 193.105.234.30 20

# استفاده از verbose mode
ssh -v -p 20 root@193.105.234.30
```

### مشکل در آپلود فایل‌ها

- از WinSCP استفاده کنید
- یا از rsync استفاده کنید (اگر روی Linux/Mac هستید)

### مشکل در اجرای Docker

```bash
# بررسی نصب Docker
docker --version
docker-compose --version

# بررسی دسترسی
sudo usermod -aG docker $USER
# سپس logout و login مجدد
```

## نکات امنیتی

⚠️ **بعد از استقرار موفق:**

1. رمز SSH را تغییر دهید
2. از SSH Key به جای password استفاده کنید
3. پورت SSH را از 20 به یک پورت دیگر تغییر دهید
4. فایروال را به درستی تنظیم کنید

---

**موفق باشید! 🚀**
