import { faker } from '@faker-js/faker';
import { MealType } from '../../generated/prisma/enums';
import * as bcrypt from 'bcrypt';

export function generatedMicronutrients() {
  return {
    calories: faker.number.int({ min: 100, max: 700 }),
    fat: faker.number.int({ min: 10, max: 70 }),
    carbs: faker.number.int({ min: 10, max: 30 }),
    protein: faker.number.int({ min: 10, max: 15 }),
    fiber: faker.number.int({ min: 5, max: 10 }),
    sugars: faker.number.int({ min: 0, max: 20 }),
  };
}

export function generatedMacronutrients() {
  return {
    omega: faker.number.int({ min: 0, max: 10 }),
    magnesium: faker.number.int({ min: 10, max: 100 }),
    vitaminB: faker.number.int({ min: 5, max: 50 }),
    vitaminD: faker.number.int({ min: 1, max: 20 }),
    calcium: faker.number.int({ min: 10, max: 200 }),
    iron: faker.number.int({ min: 1, max: 15 }),
    potassium: faker.number.int({ min: 50, max: 300 }),
    sodium: faker.number.int({ min: 20, max: 150 }),
  };
}

export function getRandomEnumMealType(): MealType {
  const values = Object.keys(MealType);
  const randomValues = Math.floor(Math.random() * values.length);
  return MealType[values[randomValues]];
}

export async function generatedPassword() {
  const secretPass = process.env.USER_PASSWORD;
  if (!secretPass) throw new Error('Password not found');
  return await bcrypt.hash(secretPass, 10);
}
