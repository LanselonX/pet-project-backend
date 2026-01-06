import { MealType } from '../../generated/prisma/enums';

export const mealMock = {
  name: 'test meal',
  description: 'test description',
  ingredients: 'testing ingredients',
  type: [MealType.NOT_SPICY, MealType.NOT_SPICY],
  imageUrl: '/uploads/tmp/test-meal.jpg',
  price: 300,
  micronutrients: {
    omega: '123',
    magnesium: '222',
    vitaminB: '322',
    vitaminD: '444',
    calcium: '555',
    iron: '777',
    potassium: '888',
    sodium: '655',
  },
  macronutrients: {
    calories: '123',
    fat: '345',
    carbs: '444',
    protein: '555',
    fiber: '432',
    sugars: '444',
  },
};
