import { z } from 'zod';
export declare const ClinicianSchema: z.ZodObject<{
    id: z.ZodString;
    clinicId: z.ZodString;
    username: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    clinicId: string;
    username: string;
    firstName: string;
    lastName: string;
}, {
    id: string;
    clinicId: string;
    username: string;
    firstName: string;
    lastName: string;
}>;
export type Clinician = z.infer<typeof ClinicianSchema>;
//# sourceMappingURL=user.types.d.ts.map