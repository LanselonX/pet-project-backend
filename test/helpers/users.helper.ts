import request from 'supertest';
import { RegisterUserDto } from '../dto/register-user.dto';

export const registerUser = async (app: string, data: RegisterUserDto) => {
  const res = await request(app).post('/auth/register').send(data).expect(201);

  return res.body.user;
};

export const deleteUser = async (app: string, id: number, token: string) => {
  await request(app)
    .delete(`/users/${id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200);
};
