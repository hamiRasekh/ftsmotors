import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 ایجاد ادمین‌های جدید...\n');

  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Admin 1
  console.log('👤 در حال ایجاد ادمین اول...');
  const admin1 = await prisma.user.upsert({
    where: { phone: '09213680135' },
    update: {
      email: 'admin1@ftsmotors.com',
      password: hashedPassword,
      role: 'ADMIN',
      name: 'مدیر سیستم 1',
    },
    create: {
      phone: '09213680135',
      email: 'admin1@ftsmotors.com',
      password: hashedPassword,
      role: 'ADMIN',
      name: 'مدیر سیستم 1',
    },
  });
  console.log('✅ ادمین اول ایجاد شد:', admin1.phone, '-', admin1.email);

  // Admin 2
  console.log('👤 در حال ایجاد ادمین دوم...');
  const admin2 = await prisma.user.upsert({
    where: { phone: '09123895285' },
    update: {
      email: 'admin2@ftsmotors.com',
      password: hashedPassword,
      role: 'ADMIN',
      name: 'مدیر سیستم 2',
    },
    create: {
      phone: '09123895285',
      email: 'admin2@ftsmotors.com',
      password: hashedPassword,
      role: 'ADMIN',
      name: 'مدیر سیستم 2',
    },
  });
  console.log('✅ ادمین دوم ایجاد شد:', admin2.phone, '-', admin2.email);

  console.log('\n✅ همه ادمین‌ها با موفقیت ایجاد شدند!');
}

main()
  .catch((e) => {
    console.error('❌ خطا:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

