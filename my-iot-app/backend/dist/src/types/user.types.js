import { z } from 'zod';
export const ClinicianSchema = z.object({
    id: z.string().uuid(),
    clinicId: z.string().uuid(),
    username: z.string(),
    firstName: z.string(),
    lastName: z.string(),
});
//# sourceMappingURL=user.types.js.map