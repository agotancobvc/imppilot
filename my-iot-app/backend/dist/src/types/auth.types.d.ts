import { z } from 'zod';
export declare const ClinicSchema: z.ZodObject<{
    id: z.ZodString;
    code: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    code: string;
    name: string;
    id: string;
}, {
    code: string;
    name: string;
    id: string;
}>;
export type Clinic = z.infer<typeof ClinicSchema>;
export declare const JWTUserPayload: z.ZodObject<{
    sub: z.ZodString;
    pid: z.ZodString;
    cid: z.ZodString;
}, "strip", z.ZodTypeAny, {
    sub: string;
    pid: string;
    cid: string;
}, {
    sub: string;
    pid: string;
    cid: string;
}>;
//# sourceMappingURL=auth.types.d.ts.map