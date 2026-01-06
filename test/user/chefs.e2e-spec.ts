import 'dotenv/config';
import request from 'supertest';
import { Role } from '../../generated/prisma/enums';
import { APP_URL } from '../../src/utils/constants';
import { join } from 'node:path';
import { setupAdmin } from '../setup';
import { deleteUser, registerUser } from '../helpers/users.helper';
import { createTestImage, removeTestImage } from '../helpers/files.helper';

describe('Chefs controller (e2e)', () => {
  const app = APP_URL;
  let adminToken: string;
  let userId: number;
  let chefId: number;

  const mockUser = {
    email: 'chefe2etest@gmail.com',
    password: 'test',
    role: Role.USER,
  };

  const TMP_DIR = join(process.cwd(), 'uploads', 'tmp');
  const TEST_IMAGE = join(TMP_DIR, 'test-chef.jpg');

  beforeAll(async () => {
    adminToken = await setupAdmin(app);

    await createTestImage(TEST_IMAGE);

    const user = await registerUser(app, mockUser);
    userId = user.id;
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
          imageUrl: '/uploads/tmp/test-chef.jpg',
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
    await deleteUser(app, userId, adminToken);
    await removeTestImage(TEST_IMAGE);
  });
});
