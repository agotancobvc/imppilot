import { Request, Response, NextFunction } from 'express';
export declare function authMiddleware(required?: boolean): (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
//# sourceMappingURL=auth.middleware.d.ts.map