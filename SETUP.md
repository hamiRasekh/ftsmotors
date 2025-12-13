# راهنمای راه‌اندازی FTS Motors

## راه‌اندازی سریع با Docker

### 1. راه‌اندازی Development

```bash
# راه‌اندازی تمام سرویس‌ها
docker-compose -f docker-compose.dev.yml up -d

# مشاهده لاگ‌ها
docker-compose -f docker-compose.dev.yml logs -f
```

### 2. راه‌اندازی Production

```bash
# ساخت و راه‌اندازی
docker-compose up -d --build

# مشاهده لاگ‌ها
docker-compose logs -f
```

### 3. دسترسی‌ها

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Swagger Docs**: http://localhost:4000/api
- **PostgreSQL**: localhost:5432

### 4. ایجاد کاربر Admin

برای ایجاد کاربر Admin، از Prisma Studio استفاده کنید:

```bash
# در حالت Development
docker-compose -f docker-compose.dev.yml exec backend npx prisma studio

# در حالت Production
docker-compose exec backend npx prisma studio
```

یا می‌توانید مستقیماً به دیتابیس متصل شوید:

```bash
docker-compose exec postgres psql -U ftsmotors -d ftsmotors
```

سپس کاربر Admin را ایجاد کنید:

```sql
INSERT INTO "User" (id, email, password, role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin@ftsmotors.com',
  '$2b$10$YourHashedPasswordHere', -- باید با bcrypt hash شود
  'ADMIN',
  NOW(),
  NOW()
);
```

**نکته**: برای hash کردن رمز عبور، می‌توانید از این دستور استفاده کنید:

```bash
docker-compose exec backend node -e "const bcrypt = require('bcrypt'); console.log(bcrypt.hashSync('your-password', 10));"
```

## دستورات مفید Docker

### مشاهده وضعیت سرویس‌ها
```bash
docker-compose ps
```

### توقف سرویس‌ها
```bash
docker-compose down
```

### توقف و حذف داده‌ها
```bash
docker-compose down -v
```

### بازسازی کانتینرها
```bash
docker-compose up -d --build
```

### اجرای دستور در کانتینر
```bash
# Backend
docker-compose exec backend npm run prisma:studio

# Frontend
docker-compose exec frontend npm run build
```

### مشاهده لاگ‌های یک سرویس خاص
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

## Migration دیتابیس

### اجرای Migration
```bash
docker-compose exec backend npx prisma migrate dev
```

### Reset دیتابیس (حذف تمام داده‌ها)
```bash
docker-compose exec backend npx prisma migrate reset
```

## تنظیمات Environment Variables

### Backend
فایل `.env` در `apps/backend/`:

```env
DATABASE_URL="postgresql://ftsmotors:ftsmotors123@postgres:5432/ftsmotors?schema=public"
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
PORT=4000
NODE_ENV=production
FRONTEND_URL=http://localhost:3000
```

### Frontend
فایل `.env.local` در `apps/frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## استفاده از Makefile

برای راحتی بیشتر، می‌توانید از Makefile استفاده کنید:

```bash
make dev      # راه‌اندازی Development
make up       # راه‌اندازی Production
make down     # توقف سرویس‌ها
make logs     # مشاهده لاگ‌ها
make clean    # پاک کردن همه چیز
make migrate  # اجرای Migration
make studio   # باز کردن Prisma Studio
```

## عیب‌یابی

### مشکل در اتصال به دیتابیس
```bash
# بررسی وضعیت PostgreSQL
docker-compose ps postgres

# بررسی لاگ‌های PostgreSQL
docker-compose logs postgres
```

### مشکل در Backend
```bash
# بررسی لاگ‌های Backend
docker-compose logs backend

# ورود به کانتینر Backend
docker-compose exec backend sh
```

### مشکل در Frontend
```bash
# بررسی لاگ‌های Frontend
docker-compose logs frontend

# پاک کردن cache
docker-compose exec frontend rm -rf .next
```

## نکات مهم

1. **رمز عبور دیتابیس**: در Production حتماً رمز عبور دیتابیس را تغییر دهید
2. **JWT Secret**: در Production حتماً JWT_SECRET را تغییر دهید
3. **فایل‌های .env**: هرگز فایل‌های .env را commit نکنید
4. **Backup**: به صورت منظم از دیتابیس backup بگیرید

## پشتیبانی

در صورت بروز مشکل، لاگ‌ها را بررسی کنید:

```bash
docker-compose logs --tail=100
```

