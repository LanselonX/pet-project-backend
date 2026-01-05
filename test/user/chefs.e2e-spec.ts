import 'dotenv/config';
import request from 'supertest';
import { Role } from '../../generated/prisma/enums';
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  APP_URL,
} from '../../src/utils/constants';
import { createAdmin, deleteUser } from '../../src/utils/test/user-test.utils';
import { join } from 'node:path';
import { mkdir, writeFile } from 'fs/promises';
// import { writeFile } from 'node:fs/promises';

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
    adminToken = await createAdmin({
      app,
      // TODO: NEED ADD BEST PRACTISE
      email: ADMIN_EMAIL!,
      password: ADMIN_PASSWORD!,
    });

    await mkdir(TMP_DIR, { recursive: true });
    await writeFile(TEST_IMAGE, 'fake image content');

    const res = await request(app)
      .post('/auth/register')
      .send(mockUser)
      .expect(201);

    userId = res.body.user.id;
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
    await deleteUser({ app, userId, token: adminToken });
  });
});
