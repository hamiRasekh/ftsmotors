import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2] || 'admin@ftsmotors.com';
  const password = process.argv[3] || 'admin123';

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
    },
    create: {
      email,
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ کاربر Admin با موفقیت ایجاد شد:');
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

