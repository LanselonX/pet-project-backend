import request from 'supertest';

type LoginParams = {
  app: string;
  email: string;
  password: string;
};

export const loginAndGetToken = async ({
  app,
  email,
  password,
}: LoginParams): Promise<string> => {
  const res = await request(app)
    .post('/auth/login')
    .send({ email, password })
    .expect(200);

  return res.body.accessToken;
};
