import request from 'supertest';
import { join } from 'node:path';
import { APP_URL } from '../../src/utils/constants';
import { setupAdmin } from '../setup';
import { createTestImage, removeTestImage } from '../helpers/files.helper';
import { mealMock } from '../mocks/meals.mock';

describe('Meals controller (e2e', () => {
  const app = APP_URL;
  let adminToken: string;
  let mealId: number;

  const TMP_DIR = join(process.cwd(), 'uploads', 'tmp');
  const TEST_IMAGE = join(TMP_DIR, 'test-meal.jpg');

  beforeAll(async () => {
    adminToken = await setupAdmin(app);

    await createTestImage(TEST_IMAGE);
  });

  describe('/meals (POST)', () => {
    it('it should create new meals', async () => {
      const res = await request(app)
        .post('/meals')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(mealMock)
        .expect(201);

      mealId = res.body.id;
    });
  });

  describe('/meals (GET)', () => {
    it('should return meal by id (GET)', async () => {
      return request(app).get(`/meals/${mealId}`).expect(200);
    });
  });

  describe('/meals', () => {
    it('should get all meals via /meals (GET)', () => {
      return request(app)
        .get('/meals')
        .expect(200)
        .expect(({ body }) => {
          expect(body.data).toBeDefined();
          expect(Array.isArray(body.data)).toBe(true);
          expect(body.hasNextPage).toBeDefined();
        });
    });
  });

  describe('/meals (PATCH)', () => {
    it('should update meal /meals (UPDATE)', () => {
      return request(app)
        .patch(`/meals/${mealId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated' })
        .expect(200)
        .expect(({ body }) => {
          expect(body.name).toBe('Updated');
        });
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

  afterAll(async () => {
    await removeTestImage(TEST_IMAGE);
  });
});
