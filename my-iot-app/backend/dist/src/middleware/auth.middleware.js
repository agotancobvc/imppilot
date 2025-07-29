import jwt from 'jsonwebtoken';
export function authMiddleware(required = true) {
    return (req, res, next) => {
        const header = req.headers.authorization;
        if (!header)
            return required ? res.sendStatus(401) : next();
        const [scheme, token] = header.split(' ');
        if (scheme !== 'Bearer' || !token)
            return res.sendStatus(401);
        try {
            req.user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return next();
        }
        catch {
            return res.sendStatus(401);
        }
    };
}
//# sourceMappingURL=auth.middleware.js.map