import request from 'supertest';
import { IDeleteInterface } from '../interfaces/delete-user.interface';
import { IAuthAdminInterface } from '../interfaces/auth-admin.interface';

export const createAdmin = async ({
  app,
  email,
  password,
}: IAuthAdminInterface) => {
  const res = await request(app)
    .post('/auth/login')
    .send({ email, password })
    .expect(200);

  return res.body.accessToken;
};

export const deleteUser = async ({ app, userId, token }: IDeleteInterface) => {
  return request(app)
    .delete(`/users/${userId}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200);
};
