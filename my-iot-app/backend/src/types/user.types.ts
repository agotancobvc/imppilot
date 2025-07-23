// backend/src/types/user.types.ts
import { z } from 'zod';

export const ClinicianSchema = z.object({
  id: z.string().uuid(),
  clinicId: z.string().uuid(),
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});
export type Clinician = z.infer<typeof ClinicianSchema>;
