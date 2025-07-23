// backend/src/services/auth.service.ts
// Contains helper utilities, e.g. token generation, reused by controllers.
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function signAccessToken(payload: object) {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
    issuer: env.JWT_ISSUER,
    expiresIn: env.JWT_ACCESS_EXPIRES,
  });
}
