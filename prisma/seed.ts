import { PrismaClient } from '../generated/prisma/client';
import { Role } from '../generated/prisma/enums';

const prisma = new PrismaClient();

async function main() {
  await seedUsers();
}

async function seedUsers() {
  await prisma.user.upsert({
    where: { email: 'lanselon1221@gmail.com' },
    update: {},
    create: {
      email: 'lanselon1221@gmail.com',
      password: 'test',
      role: Role.ADMIN,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
