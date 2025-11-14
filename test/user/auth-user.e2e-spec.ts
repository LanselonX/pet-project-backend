import 'dotenv/config';
import request from 'supertest';
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  APP_URL,
} from '../../src/utils/constants';
import { Role } from '../../generated/prisma/enums';
import { HttpStatus } from '@nestjs/common';
import { createAdmin, deleteUser } from '../../src/utils/test/user-test.utils';

describe('AuthController (e2e)', () => {
  const app = APP_URL;
  let userId: number;
  let adminToken: string;

  const mockUser = {
    email: 'newe2etestinguser@gmail.com',
    password: 'test',
    role: Role.USER,
  };

  beforeAll(async () => {
    adminToken = await createAdmin({
      app,
      // TODO: NEED ADD BEST PRACTISE
      email: ADMIN_EMAIL!,
      password: ADMIN_PASSWORD!,
    });
  });

  describe('/auth/register (POST)', () => {
    it('it should register new user and return new object', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send(mockUser)
        .expect(201)
        .expect(({ body }) => {
          expect(body.email).toEqual(mockUser.email);
          expect(body.id).toBeDefined;
          expect(body.access_token).toBeDefined();
        });
      userId = res.body.id;
    });
    it('should fail when trying to register with existing email', () => {
      return request(app)
        .post('/auth/register')
        .send(mockUser)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('/auth/login (POST)', () => {
    it('it should login user and return token', () => {
      return request(app)
        .post('/auth/login')
        .send({
          email: mockUser.email,
          password: mockUser.password,
        })
        .expect(200)
        .expect(({ body }) => {
          expect(body.email).toEqual(mockUser.email);
          expect(body.access_token).toBeDefined();
        });
    });
  });

  afterAll(async () => {
    await deleteUser({ app, userId, token: adminToken });
  });
});
