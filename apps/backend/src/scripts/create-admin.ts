import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const phone = process.argv[2] || '09123456789';
  const email = process.argv[3] || 'admin@ftsmotors.com';
  const password = process.argv[4] || 'admin123';

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { phone },
    update: {
      email,
      password: hashedPassword,
      role: 'ADMIN',
    },
    create: {
      phone,
      email,
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ کاربر Admin با موفقیت ایجاد شد:');
  console.log(`   Phone: ${user.phone}`);
  console.log(`   Email: ${user.email}`);
  console.log(`   Password: ${password}`);
  console.log(`   Role: ${user.role}`);
}

main()
  .catch((e) => {
    console.error('❌ خطا:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

