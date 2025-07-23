// backend/src/config/db.ts
import { PrismaClient } from '@prisma/client';
import { getSecret } from './aws.js';

let prisma: PrismaClient | null = null;

/** Lazily initialises Prisma with credentials from AWS Secrets Manager. */
export async function getPrisma(): Promise<PrismaClient> {
  if (prisma) return prisma;

  const { DATABASE_URL } = await getSecret('gaitmetrics/postgres');
  prisma = new PrismaClient({
    datasourceUrl: DATABASE_URL,
    log: ['error', 'warn'],
  });

  // Verify connection
  await prisma.$queryRaw`SELECT 1`;
  return prisma;
}
