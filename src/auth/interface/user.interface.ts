import { Role } from 'generated/prisma/enums';

export interface IUser {
  // TODO: id, string
  id: string | number;
  email: string;
  role: Role;
}
