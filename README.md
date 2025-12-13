# FTS Motors - سایت شرکتی خودرویی

پروژه کامل وب‌سایت شرکتی خودرویی با Next.js و NestJS

## ساختار پروژه

این پروژه به صورت Monorepo با استفاده از Turborepo مدیریت می‌شود:

```
ftsmotors/
├── apps/
│   ├── frontend/          # Next.js App
│   └── backend/           # NestJS API
├── packages/
│   ├── shared/            # Shared types & utilities
│   └── ui/                # Shared UI components
└── package.json
```

## تکنولوژی‌ها

### Frontend
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- فونت فارسی Vazir
- React Query
- React Hook Form + Zod

### Backend
- NestJS
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Swagger/OpenAPI

## راه‌اندازی با Docker

### پیش‌نیازها
- Docker
- Docker Compose

### راه‌اندازی سریع

1. **کلون کردن پروژه و رفتن به دایرکتوری:**
```bash
cd ftsmotors
```

2. **راه‌اندازی با Docker Compose (Development):**
```bash
docker-compose -f docker-compose.dev.yml up -d
```

3. **راه‌اندازی با Docker Compose (Production):**
```bash
docker-compose up -d
```

### دسترسی‌ها

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- Swagger Docs: http://localhost:4000/api
- PostgreSQL: localhost:5432

### دستورات Docker

```bash
# مشاهده لاگ‌ها
docker-compose logs -f

# توقف سرویس‌ها
docker-compose down

# توقف و حذف volume ها
docker-compose down -v

# بازسازی کانتینرها
docker-compose up -d --build

# اجرای دستور در کانتینر
docker-compose exec backend npm run prisma:studio
```

## راه‌اندازی بدون Docker

### پیش‌نیازها
- Node.js >= 18
- PostgreSQL
- npm >= 9

### نصب وابستگی‌ها
```bash
npm install
```

### راه‌اندازی دیتابیس
```bash
cd apps/backend
# ایجاد فایل .env با DATABASE_URL
npx prisma migrate dev
npx prisma generate
```

### اجرای پروژه
```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start
```

## تنظیمات اولیه

### ایجاد کاربر Admin

برای ایجاد کاربر Admin، می‌توانید از Prisma Studio استفاده کنید:

```bash
cd apps/backend
npx prisma studio
```

یا از طریق API:

```bash
# ایجاد کاربر Admin (نیاز به کد اضافی)
```

### تنظیمات Environment Variables

**Backend (.env):**
```env
DATABASE_URL="postgresql://ftsmotors:ftsmotors123@localhost:5432/ftsmotors?schema=public"
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## پنل ادمین

پنل ادمین در آدرس `/admin` در دسترس است.

برای ورود:
1. به `/admin/login` بروید
2. با ایمیل و رمز عبور Admin وارد شوید

### ویژگی‌های پنل ادمین:
- Dashboard با آمار کلی
- مدیریت دسته‌بندی‌ها (CRUD)
- مدیریت خودروها (CRUD)
- مدیریت مقالات (CRUD)
- مدیریت اخبار (CRUD)
- مدیریت پیام‌های تماس

## ساختار صفحات

- `/` - صفحه اصلی
- `/about` - درباره ما
- `/contact` - تماس با ما
- `/cars` - لیست خودروها
- `/cars/[category]` - خودروهای یک دسته‌بندی
- `/cars/[category]/[slug]` - جزئیات خودرو
- `/blog` - لیست مقالات
- `/blog/[slug]` - جزئیات مقاله
- `/news` - لیست اخبار
- `/news/[slug]` - جزئیات خبر
- `/admin` - پنل مدیریت

## بهینه‌سازی‌ها

### SEO
- Dynamic metadata برای هر صفحه
- Schema.org (JSON-LD) برای خودروها، مقالات و اخبار
- Sitemap.xml خودکار
- Robots.txt
- Open Graph tags
- Twitter Cards

### Performance
- Image optimization با Next.js Image
- Code splitting و lazy loading
- API Response caching
- Database query optimization

### Security
- JWT authentication
- Password hashing با bcrypt
- Input validation و sanitization
- CORS configuration
- Rate limiting

## توسعه

برای شروع توسعه:

1. پروژه را با Docker راه‌اندازی کنید
2. تغییرات را در فایل‌های مربوطه اعمال کنید
3. تغییرات به صورت خودکار reload می‌شوند

## لایسنس

این پروژه برای استفاده داخلی است.
