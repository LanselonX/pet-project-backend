import type { Request, Response } from 'express';

export interface RequestWithRes extends Request {
  res: Response;
  user: { id: number };
}
