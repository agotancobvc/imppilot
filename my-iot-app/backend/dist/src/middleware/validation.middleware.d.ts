import { ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';
export declare function validateBody(schema: ZodSchema): (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=validation.middleware.d.ts.map