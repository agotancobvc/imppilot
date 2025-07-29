// backend/src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

<<<<<<< HEAD
=======
// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

>>>>>>> 0f95ffb703c03c3362b8083360f11c844b33e19e
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
