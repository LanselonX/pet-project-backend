import type { Request } from 'express';
import { User } from 'generated/prisma/client';

export interface ReqWithUser extends Request {
  user: User;
}
