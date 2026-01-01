import { faker, FoodModule } from '@faker-js/faker';
import { PrismaClient } from '../generated/prisma/client';
import { MealType, Role } from '../generated/prisma/enums';
import {
  generatedMacronutrients,
  generatedMicronutrients,
  generatedPassword,
} from 'src/utils/seed-utils';

const prisma = new PrismaClient();

async function main() {
  await seedUsers();
  await seedMeals();
}

async function seedMeals() {
  for (let i = 0; i < 20; i++) {
    const micronutrientsData = generatedMicronutrients();
    const macronutrientsData = generatedMacronutrients();

    await prisma.meal.upsert({
      where: { id: i + 1 },
      update: {},
      create: {
        name: faker.food.meat(),
        description: faker.lorem.words({ min: 10, max: 20 }),
        ingredients: faker.food.ingredient(),
        type: [MealType.VEGETARIAN],
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
        // TODO: NEED TO CHANGE, TESTING LOGIC
        imageUrl: faker.image.urlPicsumPhotos({ width: 400, height: 400 }),
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
