import 'dotenv/config';
import { loginAndGetToken } from './helpers/auth.helper';

export const setupAdmin = async (app: string) => {
  return loginAndGetToken({
    app,
    email: process.env.ADMIN_EMAIL!,
    password: process.env.ADMIN_PASSWORD!,
  });
};

export const setupUser = async (app: string) => {
  return loginAndGetToken({
    app,
    email: process.env.USER_EMAIL!,
    password: process.env.USER_PASSWORD!,
  });
};
