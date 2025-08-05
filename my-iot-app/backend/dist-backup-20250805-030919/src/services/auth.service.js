import jwt from 'jsonwebtoken';
const { sign } = jwt;
import { env } from '../config/env.js';
export function signAccessToken(payload) {
    return sign(payload, env.JWT_ACCESS_SECRET, {
        issuer: env.JWT_ISSUER,
        expiresIn: env.JWT_ACCESS_EXPIRES,
    });
}
//# sourceMappingURL=auth.service.js.map