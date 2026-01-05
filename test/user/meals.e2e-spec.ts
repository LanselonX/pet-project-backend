import 'dotenv/config';
import request from 'supertest';
import { join } from 'node:path';
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  APP_URL,
} from '../../src/utils/constants';
import { createAdmin } from '../../src/utils/test/user-test.utils';
import { mkdir, writeFile } from 'fs/promises';
import { MealType } from '../../generated/prisma/enums';

describe('Meals controller (e2e', () => {
  const app = APP_URL;
  let adminToken: string;
  let mealId: number;

  const TMP_DIR = join(process.cwd(), 'uploads', 'tmp');
  const TEST_IMAGE = join(TMP_DIR, 'test-meal.jpg');

  //TODO: need put away
  const mockMeal = {
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

  beforeAll(async () => {
    adminToken = await createAdmin({
      app,
      email: ADMIN_EMAIL!,
      password: ADMIN_PASSWORD!,
    });

    try {
      await mkdir(TMP_DIR, { recursive: true });
      await writeFile(TEST_IMAGE, 'fake image content');
    } catch (error) {
      console.log(error);
    }
  });

  describe('/meals (POST)', () => {
    it('it should create new meals', async () => {
      const res = await request(app)
        .post('/meals')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(mockMeal)
        .expect(201);

      mealId = res.body.id;
    });
  });

  describe('meals (DELETE)', () => {
    it('should delete test meal', async () => {
      return await request(app)
        .delete(`/meals/${mealId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });
  });
});
