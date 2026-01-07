import { RegisterUserDto } from 'test/dto/register-user.dto';
import { Role } from '../../generated/prisma/enums';

export const mockUser = (suffix: string): RegisterUserDto => ({
  email: `authe2e${suffix}@gmail.com`,
  password: process.env.USER_PASSWORD!,
  role: Role.USER,
});
