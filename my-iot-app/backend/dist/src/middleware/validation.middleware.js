export function validateBody(schema) {
    return (req, res, next) => {
        try {
            req.body = schema.parse(req.body);
            next();
        }
        catch (e) {
            next(e);
        }
    };
}
//# sourceMappingURL=validation.middleware.js.map