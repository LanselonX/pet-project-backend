import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

export function generatedMicronutrients() {
  return {
    calories: faker.number.int({ min: 100, max: 700 }).toString(),
    fat: faker.number.int({ min: 10, max: 70 }).toString(),
    carbs: faker.number.int({ min: 10, max: 30 }).toString(),
    protein: faker.number.int({ min: 10, max: 15 }).toString(),
    fiber: faker.number.int({ min: 5, max: 10 }).toString(),
    sugars: faker.number.int({ min: 0, max: 20 }).toString(),
  };
}

export function generatedMacronutrients() {
  return {
    omega: faker.number.int({ min: 0, max: 10 }).toString(),
    magnesium: faker.number.int({ min: 10, max: 100 }).toString(),
    vitaminB: faker.number.int({ min: 5, max: 50 }).toString(),
    vitaminD: faker.number.int({ min: 1, max: 20 }).toString(),
    calcium: faker.number.int({ min: 10, max: 200 }).toString(),
    iron: faker.number.int({ min: 1, max: 15 }).toString(),
    potassium: faker.number.int({ min: 50, max: 300 }).toString(),
    sodium: faker.number.int({ min: 20, max: 150 }).toString(),
  };
}

export async function generatedPassword() {
  const secretPass = process.env.USER_PASSWORD;
  if (!secretPass) throw new Error('Password not found');
  return await bcrypt.hash(secretPass, 10);
}
