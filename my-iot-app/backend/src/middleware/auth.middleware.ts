// backend/src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export function authMiddleware(required = true) {
  return (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header) return required ? res.sendStatus(401) : next();
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) return res.sendStatus(401);

    try {
      req.user = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
      return next();
    } catch {
      return res.sendStatus(401);
    }
  };
}
