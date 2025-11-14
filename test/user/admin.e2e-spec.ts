import 'dotenv/config';
import request from 'supertest';
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  APP_URL,
} from '../../src/utils/constants';

describe('Admin login module', () => {
  const app = APP_URL;

  describe('Admin Login', () => {
    it('should successfully login in auth/login (POST)', () => {
      return request(app)
        .post('/auth/login')
        .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
        .expect(200)
        .expect(({ body }) => {
          expect(body.access_token).toBeDefined();
          expect(body.email).toBeDefined();
        });
    });
  });
});
