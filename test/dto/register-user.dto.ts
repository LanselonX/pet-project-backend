import { Role } from '../../generated/prisma/enums';

export class RegisterUserDto {
  email: string;
  password: string;
  role: Role;
}
