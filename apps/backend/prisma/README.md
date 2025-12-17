# Prisma Seeder

این فایل برای ایجاد داده‌های اولیه در دیتابیس استفاده می‌شود.

## نحوه استفاده

### اجرای Seeder

```bash
npm run prisma:seed
```

یا مستقیماً:

```bash
npx ts-node prisma/seed.ts
```

## داده‌های ایجاد شده

Seeder به صورت خودکار موارد زیر را ایجاد می‌کند:

### 1. کاربر Admin
- **Phone**: `09123456789`
- **Email**: `admin@ftsmotors.com`
- **Password**: `admin123`
- **Role**: `ADMIN`

### 2. دسته‌بندی‌ها (5 دسته)
- سدان
- شاسی بلند (SUV)
- کوپه
- وانت
- مینی‌ون

### 3. خودروهای نمونه (4 خودرو)
- BMW X2 xDrive20d M Sport X
- BMW 3 Series 325Li
- Toyota Corolla 2020
- Kia Optima K5

### 4. مقالات نمونه (3 مقاله)
- راهنمای خرید خودروی دست دوم
- مقایسه خودروهای برقی و بنزینی
- نکات نگهداری خودرو در زمستان

### 5. اخبار نمونه (2 خبر)
- رونمایی از BMW X2 جدید 2024
- افزایش قیمت خودروهای وارداتی

### 6. صفحات نمونه (2 صفحه)
- درباره ما
- تماس با ما

## نکات مهم

- Seeder از `upsert` استفاده می‌کند، بنابراین می‌توانید آن را چندین بار اجرا کنید بدون نگرانی از ایجاد داده‌های تکراری
- اگر می‌خواهید داده‌های جدید اضافه کنید، فایل `seed.ts` را ویرایش کنید
- قبل از اجرای seeder، مطمئن شوید که دیتابیس شما آماده است و migration‌ها اجرا شده‌اند

## اجرای Migration و Seed

```bash
# 1. Generate Prisma Client
npm run prisma:generate

# 2. Run Migrations
npm run prisma:migrate

# 3. Run Seeder
npm run prisma:seed
```

## تغییر اطلاعات Admin

اگر می‌خواهید اطلاعات Admin را تغییر دهید، می‌توانید:

1. فایل `seed.ts` را ویرایش کنید
2. یا از اسکریپت `create:admin` استفاده کنید:

```bash
npm run create:admin [phone] [email] [password]
```

مثال:
```bash
npm run create:admin 09123456789 admin@example.com mypassword
```

