import z from 'zod';
const EnvSchema = z.object({
    PORT: z.string().default('3000'),
    AWS_REGION: z.string().default('us-east-1'),
    JWT_ACCESS_EXPIRES: z.string().default('15m'),
    JWT_REFRESH_EXPIRES: z.string().default('7d'),
    JWT_ISSUER: z.string().default('gait-metrics'),
    REDIS_URL: z.string().optional(),
    NODE_ENV: z.string().default('development'),
});
export const env = EnvSchema.parse(process.env);
//# sourceMappingURL=env.js.map