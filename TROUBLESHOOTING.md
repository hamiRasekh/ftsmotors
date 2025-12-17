# راهنمای عیب‌یابی

## مشکل: ارور 500 در صفحه اصلی

### علل احتمالی:

1. **Backend در دسترس نیست**
   ```bash
   # بررسی وضعیت Backend
   docker-compose ps backend
   
   # مشاهده لاگ‌های Backend
   docker-compose logs backend
   
   # بررسی اینکه Backend روی پورت 4000 در حال اجرا است
   curl http://localhost:4000/api/health
   ```

2. **دیتابیس متصل نیست**
   ```bash
   # بررسی لاگ‌های دیتابیس
   docker-compose logs postgres
   
   # بررسی اتصال از Backend
   docker-compose exec backend pg_isready -h postgres -U ftsmotors
   ```

3. **Migration ها اجرا نشده‌اند**
   ```bash
   # اجرای دستی Migration
   docker-compose exec backend npx prisma migrate deploy
   
   # بررسی وضعیت Migration
   docker-compose exec backend npx prisma migrate status
   ```

4. **Seed اجرا نشده**
   ```bash
   # اجرای دستی Seed
   docker-compose exec backend npm run prisma:seed
   ```

5. **API_URL درست تنظیم نشده**
   - در Docker، Frontend باید از `http://backend:4000` برای server-side استفاده کند
   - برای client-side از `http://localhost:4000` استفاده می‌شود
   - بررسی کنید که environment variables درست تنظیم شده‌اند

### راه‌حل‌های سریع:

```bash
# 1. توقف و راه‌اندازی مجدد
docker-compose down
docker-compose up -d

# 2. مشاهده لاگ‌های همه سرویس‌ها
docker-compose logs -f

# 3. بررسی وضعیت همه سرویس‌ها
docker-compose ps

# 4. تست اتصال Backend
docker-compose exec backend curl http://backend:4000/api/health

# 5. تست اتصال از Frontend به Backend
docker-compose exec frontend curl http://backend:4000/api/articles
```

### بررسی دستی:

1. **بررسی Backend API:**
   ```bash
   # از host machine
   curl http://localhost:4000/api/articles
   curl http://localhost:4000/api/news
   ```

2. **بررسی Frontend:**
   ```bash
   # مشاهده لاگ‌های Frontend
   docker-compose logs frontend
   ```

3. **بررسی دیتابیس:**
   ```bash
   # اتصال به دیتابیس
   docker-compose exec postgres psql -U ftsmotors -d ftsmotors
   
   # بررسی جداول
   \dt
   
   # بررسی داده‌ها
   SELECT * FROM "User" LIMIT 5;
   SELECT * FROM "Article" LIMIT 5;
   SELECT * FROM "News" LIMIT 5;
   ```

### لاگ‌های مهم:

```bash
# همه لاگ‌ها
docker-compose logs --tail=100

# فقط Backend
docker-compose logs backend --tail=50

# فقط Frontend
docker-compose logs frontend --tail=50

# فقط Database
docker-compose logs postgres --tail=50
```

### مشکلات رایج:

#### 1. "ECONNREFUSED" یا "Connection refused"
- Backend در حال اجرا نیست
- پورت 4000 در دسترس نیست
- Network مشکل دارد

**راه‌حل:**
```bash
docker-compose restart backend
docker-compose ps
```

#### 2. "Prisma Client not generated"
- Prisma Client generate نشده

**راه‌حل:**
```bash
docker-compose exec backend npx prisma generate
docker-compose restart backend
```

#### 3. "Migration failed"
- Migration ها اجرا نشده‌اند

**راه‌حل:**
```bash
docker-compose exec backend npx prisma migrate deploy
```

#### 4. "Cannot find module"
- Dependencies نصب نشده‌اند

**راه‌حل:**
```bash
docker-compose exec backend npm install
docker-compose restart backend
```

### تست کامل:

```bash
# 1. بررسی همه سرویس‌ها
docker-compose ps

# 2. تست Backend
curl http://localhost:4000/api/articles
curl http://localhost:4000/api/news

# 3. تست Frontend
curl http://localhost:3000

# 4. بررسی لاگ‌ها برای خطا
docker-compose logs | grep -i error
```

### در صورت ادامه مشکل:

1. تمام container ها را پاک کنید:
   ```bash
   docker-compose down -v
   ```

2. Image ها را rebuild کنید:
   ```bash
   docker-compose build --no-cache
   ```

3. دوباره راه‌اندازی کنید:
   ```bash
   docker-compose up -d
   ```

4. لاگ‌ها را بررسی کنید:
   ```bash
   docker-compose logs -f
   ```

