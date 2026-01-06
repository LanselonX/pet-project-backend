import 'dotenv/config';
import request from 'supertest';
import { APP_URL } from '../../src/utils/constants';
import { Role } from '../../generated/prisma/enums';
import { HttpStatus } from '@nestjs/common';
import { setupAdmin } from '../setup';
import { deleteUser } from '../helpers/users.helper';

describe('AuthController (e2e)', () => {
  const app = APP_URL;
  let userId: number;
  let adminToken: string;

  const mockUser = {
    email: 'authe2eusertest@gmail.com',
    password: 'test',
    role: Role.USER,
  };

  beforeAll(async () => {
    adminToken = await setupAdmin(app);
  });

  describe('/auth/register (POST)', () => {
    it('it should register new user and return new object', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send(mockUser)
        .expect(201)
        .expect(({ body }) => {
          expect(body.user.email).toEqual(mockUser.email);
          expect(body.user.id).toBeDefined();
          expect(body.accessToken).toBeDefined();
        });
      userId = res.body.user.id;
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
          expect(body.user.email).toEqual(mockUser.email);
          expect(body.accessToken).toBeDefined();
        });
    });
  });

  afterAll(async () => {
    await deleteUser(app, userId, adminToken);
  });
});
