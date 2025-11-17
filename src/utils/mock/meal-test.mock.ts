import { MealType } from '../../../generated/prisma/enums';

export const mockMeal = {
  name: 'test',
  description: 'test description',
  ingredients: 'test ingredients',
  type: [MealType.GLUTEN_FREE],
  macronutrients: {
    calories: '10',
    fat: '10',
    carbs: '10',
    protein: '10',
    fiber: '10',
    sugars: '10',
  },
  micronutrients: {
    omega: '10',
    magnesium: '10',
    vitaminB: '10',
    vitaminD: '10',
    calcium: '10',
    iron: '10',
    potassium: '10',
    sodium: '10',
  },
};
