import { faker } from '@faker-js/faker';
import { PrismaClient } from '../generated/prisma/client';
import { Role } from '../generated/prisma/enums';
import {
  generatedMacronutrients,
  generatedMicronutrients,
  generatedPassword,
  getRandomEnumMealType,
} from 'src/utils/seed.utils';
import { join } from 'node:path';
import { readdir } from 'node:fs/promises';

const prisma = new PrismaClient();

async function main() {
  await seedUsers();
  await seedMeals();
}

async function seedMeals() {
  const imagesDir = join(process.cwd(), 'uploads/seed-food');
  const imageFiles = await readdir(imagesDir);

  const images = imageFiles.filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f));

  for (let i = 0; i < 30; i++) {
    const micronutrientsData = generatedMicronutrients();
    const macronutrientsData = generatedMacronutrients();
    const randomImage = faker.helpers.arrayElement(images);

    await prisma.meal.upsert({
      where: { id: i + 1 },
      update: {},
      create: {
        name: faker.food.meat(),
        description: faker.lorem.words({ min: 8, max: 15 }),
        // TODO: need rly ingredients
        ingredients: faker.lorem.words({ min: 30, max: 50 }),
        price: faker.number.int({ min: 450, max: 600 }),
        type: [getRandomEnumMealType()],
        macronutrients: {
          create: {
            ...micronutrientsData,
          },
        },
        micronutrients: {
          create: {
            ...macronutrientsData,
          },
        },
        // TODO: bad practise
        imageUrl: `http://localhost:3000/uploads/seed-food/${randomImage}`,
      },
    });
  }
}

async function seedUsers() {
  const passwordData = await generatedPassword();

  await prisma.user.upsert({
    where: { email: 'lanselon1221@gmail.com' },
    update: {},
    create: {
      email: 'lanselon1221@gmail.com',
      name: 'lanselon',
      password: passwordData,
      role: Role.ADMIN,
      refreshToken: null,
    },
  });
  await prisma.user.upsert({
    where: { email: 'testuser@gmail.com' },
    update: {},
    create: {
      email: 'testuser@gmail.com',
      name: 'testuser',
      password: passwordData,
      role: Role.USER,
      refreshToken: null,
    },
  });
  await prisma.user.upsert({
    where: { email: 'newuser@gmail.com' },
    update: {},
    create: {
      email: 'newuser@gmail.com',
      name: 'newuser',
      password: passwordData,
      role: Role.USER,
      refreshToken: null,
    },
  });

  await prisma.user.upsert({
    where: { email: 'newuser2@gmail.com' },
    update: {},
    create: {
      email: 'newuser2@gmail.com',
      name: 'newuser2',
      password: passwordData,
      role: Role.USER,
      refreshToken: null,
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
