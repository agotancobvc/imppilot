// backend/src/middleware/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorMiddleware(err: any, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({ message: 'Invalid data', issues: err.issues });
  }
  console.error(err);
  return res.status(500).json({ message: 'Internal server error' });
}
