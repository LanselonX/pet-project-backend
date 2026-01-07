import 'dotenv/config';
import { loginAndGetToken } from './helpers/auth.helper';

//TODO: need to add env helper
export const setupAdmin = async (app: string) => {
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) throw new Error('data is missing');

  return loginAndGetToken({
    app,
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });
};

export const setupUser = async (app: string) => {
  const USER_EMAIL = process.env.USER_EMAIL;
  const USER_PASSWORD = process.env.USER_PASSWORD;
  if (!USER_EMAIL || !USER_PASSWORD) throw new Error('data is missing');

  return loginAndGetToken({
    app,
    email: USER_EMAIL,
    password: USER_PASSWORD,
  });
};
