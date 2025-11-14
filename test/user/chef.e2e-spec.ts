import 'dotenv/config';
import request from 'supertest';
import { Role } from '../../generated/prisma/enums';
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  APP_URL,
} from '../../src/utils/constants';

describe('Chefs controller (e2e)', () => {
  const app = APP_URL;
  let adminToken: string;
  let userId: number;
  let chefId: number;

  const mockUser = {
    email: 'cheftestinguser@gmail.com',
    password: 'test',
    role: Role.USER,
  };

  beforeAll(async () => {
    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
      .expect(200);

    adminToken = loginRes.body.access_token;

    const userRes = await request(app)
      .post('/auth/register')
      .send(mockUser)
      .expect(201);

    userId = userRes.body.id;
  });

  describe('/chefs (POST)', () => {
    it('it should create new chefs', async () => {
      const res = await request(app)
        .post('/chefs')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          bio: 'e2e bio for chef',
          userId: userId,
          mealIds: [1, 2, 3],
        })
        .expect(201);
      chefId = res.body.id;
    });
  });

  describe('/chefs (PATCH)', () => {
    it('should update current chefs', async () => {
      return await request(app)
        .patch(`/chefs/${chefId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          bio: 'updated e2e bio for chef',
          mealIds: [5, 6],
        })
        .expect(200);
    });
  });

  describe('/chefs (DELETE)', () => {
    it('shiold delete test chef', async () => {
      return await request(app)
        .delete(`/chefs/${chefId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });
  });

  afterAll(async () => {
    return await request(app)
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });
});
