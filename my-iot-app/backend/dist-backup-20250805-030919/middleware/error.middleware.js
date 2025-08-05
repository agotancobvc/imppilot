import { ZodError } from 'zod';
export function errorMiddleware(err, _req, res, _next) {
    if (err instanceof ZodError) {
        return res.status(400).json({ message: 'Invalid data', issues: err.issues });
    }
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
}
//# sourceMappingURL=error.middleware.js.map