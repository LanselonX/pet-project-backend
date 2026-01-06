import request from 'supertest';
import 'dotenv/config';

//TODO: мне не нравится название dto
export const registerUser = async (app, dto) => {
  const res = await request(app).post('/auth/register').send(dto).expect(201);

  return res.body.user;
};

export const deleteUser = async (app, id, token) => {
  await request(app)
    .delete(`/users/${id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200);
};
