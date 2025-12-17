# راهنمای راه‌اندازی Docker

این راهنما نحوه راه‌اندازی پروژه FTS Motors با Docker را توضیح می‌دهد.

## پیش‌نیازها

- Docker Desktop (یا Docker Engine + Docker Compose)
- حداقل 4GB RAM آزاد
- پورت‌های 3000 و 4000 و 5432 باید آزاد باشند

## راه‌اندازی سریع

```bash
# ساخت و راه‌اندازی تمام سرویس‌ها
docker-compose up -d

# مشاهده لاگ‌ها
docker-compose logs -f

# توقف سرویس‌ها
docker-compose down

# توقف و حذف تمام داده‌ها (دیتابیس)
docker-compose down -v
```

## سرویس‌ها

### 1. PostgreSQL Database
- **پورت**: 5432
- **یوزر**: ftsmotors
- **پسورد**: ftsmotors123
- **دیتابیس**: ftsmotors

### 2. Backend (NestJS)
- **پورت**: 4000
- **URL**: http://localhost:4000
- **API Docs**: http://localhost:4000/api

### 3. Frontend (Next.js)
- **پورت**: 3000
- **URL**: http://localhost:3000

## فرآیند راه‌اندازی

وقتی `docker-compose up` را اجرا می‌کنید، این مراحل به ترتیب انجام می‌شوند:

1. **PostgreSQL** راه‌اندازی می‌شود و منتظر می‌ماند تا healthy شود
2. **Backend** شروع می‌شود و:
   - منتظر می‌ماند تا دیتابیس آماده شود
   - Prisma Client را generate می‌کند
   - Migration ها را اجرا می‌کند
   - Seed (داده‌های اولیه) را اجرا می‌کند
   - سرور NestJS را راه‌اندازی می‌کند
3. **Frontend** شروع می‌شود و منتظر می‌ماند تا Backend آماده شود

## داده‌های اولیه (Seed)

Seeder به صورت خودکار این داده‌ها را ایجاد می‌کند:

### کاربر Admin
- **Phone**: `09123456789`
- **Email**: `admin@ftsmotors.com`
- **Password**: `admin123`
- **Role**: `ADMIN`

### دسته‌بندی‌ها
- سدان
- شاسی بلند (SUV)
- کوپه
- وانت
- مینی‌ون

### خودروهای نمونه
- BMW X2 xDrive20d M Sport X
- BMW 3 Series 325Li
- Toyota Corolla 2020
- Kia Optima K5

### مقالات و اخبار نمونه
- 3 مقاله
- 2 خبر

### صفحات نمونه
- درباره ما
- تماس با ما

## دستورات مفید

```bash
# مشاهده وضعیت سرویس‌ها
docker-compose ps

# مشاهده لاگ‌های Backend
docker-compose logs -f backend

# مشاهده لاگ‌های Frontend
docker-compose logs -f frontend

# مشاهده لاگ‌های Database
docker-compose logs -f postgres

# اجرای دستور در Backend container
docker-compose exec backend sh

# اجرای Prisma Studio
docker-compose exec backend npx prisma studio

# اجرای Seed مجدد
docker-compose exec backend npm run prisma:seed

# اجرای Migration جدید
docker-compose exec backend npx prisma migrate dev

# بازسازی image ها
docker-compose build --no-cache

# پاک کردن تمام container ها و image ها
docker-compose down --rmi all -v
```

## عیب‌یابی

### مشکل: دیتابیس راه‌اندازی نمی‌شود
```bash
# بررسی لاگ‌های دیتابیس
docker-compose logs postgres

# پاک کردن volume دیتابیس و شروع مجدد
docker-compose down -v
docker-compose up -d postgres
```

### مشکل: Backend نمی‌تواند به دیتابیس متصل شود
```bash
# بررسی اینکه دیتابیس healthy است
docker-compose ps

# بررسی لاگ‌های Backend
docker-compose logs backend

# بررسی اتصال از داخل container
docker-compose exec backend pg_isready -h postgres -U ftsmotors
```

### مشکل: Migration یا Seed اجرا نمی‌شود
```bash
# اجرای دستی Migration
docker-compose exec backend npx prisma migrate deploy

# اجرای دستی Seed
docker-compose exec backend npm run prisma:seed

# بررسی وضعیت Migration
docker-compose exec backend npx prisma migrate status
```

### مشکل: Frontend نمی‌تواند به Backend متصل شود
- مطمئن شوید که Backend روی پورت 4000 در حال اجرا است
- بررسی کنید که `NEXT_PUBLIC_API_URL` درست تنظیم شده است
- بررسی لاگ‌های Frontend برای خطاهای CORS

## Environment Variables

می‌توانید فایل `.env` در root پروژه ایجاد کنید:

```env
# Database
DATABASE_URL=postgresql://ftsmotors:ftsmotors123@postgres:5432/ftsmotors?schema=public

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## نکات مهم

1. **داده‌های دیتابیس**: داده‌های دیتابیس در volume `postgres_data` ذخیره می‌شوند و با `docker-compose down -v` پاک می‌شوند.

2. **Hot Reload**: در حالت development، تغییرات در کد به صورت خودکار reload می‌شوند.

3. **Production**: برای production، باید از Dockerfile اصلی (نه Dockerfile.compose) استفاده کنید.

4. **Security**: در production، حتماً JWT_SECRET و پسورد دیتابیس را تغییر دهید.

## پشتیبانی

در صورت بروز مشکل، لاگ‌ها را بررسی کنید:
```bash
docker-compose logs --tail=100
```

