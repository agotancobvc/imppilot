import { PrismaClient } from '@prisma/client';
import { getSecret } from './aws.js';
let prisma = null;
export async function getPrisma() {
    if (prisma)
        return prisma;
    const { DATABASE_URL } = await getSecret('gaitmetrics/posstgres');
    prisma = new PrismaClient({
        datasourceUrl: DATABASE_URL,
        log: ['error', 'warn'],
    });
    await prisma.$queryRaw `SELECT 1`;
    return prisma;
}
//# sourceMappingURL=db.js.map