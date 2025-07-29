// backend/src/services/auth.service.ts
// Contains helper utilities, e.g. token generation, reused by controllers.
<<<<<<< HEAD
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function signAccessToken(payload: object) {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
=======
import { sign } from 'jsonwebtoken';
import { env } from '../config/env.js';

export function signAccessToken(payload: object) {
  return (sign as any)(payload, env.JWT_ACCESS_SECRET, {
>>>>>>> 0f95ffb703c03c3362b8083360f11c844b33e19e
    issuer: env.JWT_ISSUER,
    expiresIn: env.JWT_ACCESS_EXPIRES,
  });
}
