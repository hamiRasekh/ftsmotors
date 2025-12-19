# 🚀 راهنمای سریع استقرار

## اطلاعات سرور شما
- **IP**: 193.105.234.30
- **Port**: 20
- **Username**: root
- **Password**: p@ss0509

## ⚡ روش سریع (Windows)

### گزینه 1: استفاده از فایل Batch

1. دوبار کلیک روی فایل:
   ```
   deploy\deploy-to-server.bat
   ```

2. منتظر بمانید تا استقرار کامل شود

### گزینه 2: استفاده از PowerShell

```powershell
cd d:\websites\ftsmotors
.\deploy\remote-deploy.ps1
```

## 📋 روش دستی (گام به گام)

### مرحله 1: اتصال به سرور

```bash
ssh -p 20 root@193.105.234.30
# Password: p@ss0509
```

### مرحله 2: راه‌اندازی اولیه (فقط یک بار)

```bash
# نصب Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# نصب Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# تنظیم فایروال
ufw allow 20/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### مرحله 3: آپلود پروژه

**روش A: استفاده از WinSCP (توصیه می‌شود برای Windows)**

1. دانلود WinSCP از https://winscp.net
2. اتصال:
   - Host: `193.105.234.30`
   - Port: `20`
   - Username: `root`
   - Password: `p@ss0509`
3. آپلود تمام فایل‌های پروژه به `/opt/ftsmotors`

**روش B: استفاده از SCP (از Command Prompt)**

```cmd
scp -P 20 -r d:\websites\ftsmotors\* root@193.105.234.30:/opt/ftsmotors/
```

### مرحله 4: تنظیم Environment

```bash
# روی سرور
cd /opt/ftsmotors
cp env.production.example .env.production
nano .env.production
```

**مهم**: این مقادیر را تغییر دهید:

```env
POSTGRES_PASSWORD=یک_رمز_قوی_برای_دیتابیس
JWT_SECRET=$(openssl rand -base64 32)
DOMAIN=ftsmotors.ir
EMAIL=your-email@example.com
```

برای تولید JWT_SECRET:
```bash
openssl rand -base64 32
```

### مرحله 5: استقرار

```bash
cd /opt/ftsmotors
chmod +x deploy/*.sh
./deploy/deploy.sh
```

این اسکریپت به صورت خودکار:
- ✅ Docker images را می‌سازد
- ✅ کانتینرها را راه‌اندازی می‌کند
- ✅ Migration دیتابیس را اجرا می‌کند
- ✅ SSL را تنظیم می‌کند

### مرحله 6: بررسی

```bash
# بررسی وضعیت
docker-compose -f docker-compose.prod.yml ps

# مشاهده لاگ‌ها
docker-compose -f docker-compose.prod.yml logs -f

# تست سایت
curl https://ftsmotors.ir
```

## 🔍 بررسی وضعیت

### از مرورگر:
- https://ftsmotors.ir
- https://api.ftsmotors.ir/health

### از سرور:
```bash
ssh -p 20 root@193.105.234.30
cd /opt/ftsmotors
docker-compose -f docker-compose.prod.yml ps
```

## 🐛 عیب‌یابی

### مشکل: نمی‌توانم به سرور متصل شوم

```bash
# بررسی اتصال
ping 193.105.234.30
telnet 193.105.234.30 20
```

### مشکل: Docker نصب نیست

```bash
# نصب Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

### مشکل: کانتینرها راه‌اندازی نمی‌شوند

```bash
# بررسی لاگ‌ها
cd /opt/ftsmotors
docker-compose -f docker-compose.prod.yml logs

# بررسی وضعیت
docker-compose -f docker-compose.prod.yml ps
```

### مشکل: SSL کار نمی‌کند

```bash
# بررسی گواهینامه‌ها
ls -la /opt/ftsmotors/certbot/conf/live/ftsmotors.ir/

# تمدید دستی
cd /opt/ftsmotors
docker-compose -f nginx/docker-compose.nginx.yml run --rm certbot renew
```

## 📞 دستورات مفید

```bash
# راه‌اندازی مجدد
docker-compose -f docker-compose.prod.yml restart

# توقف
docker-compose -f docker-compose.prod.yml down

# مشاهده لاگ‌های یک سرویس
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend

# بکاپ دیتابیس
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U ftsmotors ftsmotors > backup.sql
```

## ✅ چک‌لیست نهایی

- [ ] به سرور متصل شده‌ام
- [ ] Docker و Docker Compose نصب شده
- [ ] پروژه آپلود شده
- [ ] `.env.production` تنظیم شده
- [ ] رمزهای عبور تغییر کرده‌اند
- [ ] استقرار اجرا شده
- [ ] سایت در دسترس است
- [ ] SSL کار می‌کند

---

**موفق باشید! 🎉**

اگر مشکلی پیش آمد، فایل `DEPLOYMENT.md` را برای راهنمای کامل مطالعه کنید.
