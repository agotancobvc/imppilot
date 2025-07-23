// backend/src/types/auth.types.ts
import { z } from 'zod';

export const ClinicSchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  name: z.string(),
});
export type Clinic = z.infer<typeof ClinicSchema>;

export const JWTUserPayload = z.object({
  sub: z.string(),
  pid: z.string(),
  cid: z.string(),
});
