import 'dotenv/config';
import request from 'supertest';
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  APP_URL,
} from '../../src/utils/constants';
import { createAdmin } from '../../src/utils/test/user-test.utils';
import { mockMeal } from '../../src/utils/mock/meal-test.mock';

describe('Meals controller (e2e)', () => {
  const app = APP_URL;
  let mealId: number;
  let adminToken: string;

  beforeAll(async () => {
    adminToken = await createAdmin({
      app,
      // TODO: NEED ADD BEST PRACTISE
      email: ADMIN_EMAIL!,
      password: ADMIN_PASSWORD!,
    });
  });

  describe('/meals (POST)', () => {
    it('it should create new meals and return it', async () => {
      const res = await request(app)
        .post('/meals')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(mockMeal)
        .expect(201);

      mealId = res.body.id;
    });
  });

  afterAll(async () => {
    return await request(app)
      .delete(`/meals/${mealId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });
});
