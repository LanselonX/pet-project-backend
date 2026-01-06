import request from 'supertest';
import 'dotenv/config';

// import { IDeleteInterface } from '../interfaces/delete-user.interface';
// import { IAuthInterface } from '../interfaces/auth-admin.interface';

export const loginAndGetToken = async ({ app, email, password }) => {
  const res = await request(app)
    .post('/auth/login')
    .send({ email, password })
    .expect(200);

  return res.body.accessToken;
};

// export const deleteUser = async ({ app, userId, token }) => {
//   return request(app)
//     .delete(`/users/${userId}`)
//     .set('Authorization', `Bearer ${token}`)
//     .expect(200);
// };
