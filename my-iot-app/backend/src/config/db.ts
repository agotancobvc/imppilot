// backend/src/config/db.ts
import { PrismaClient } from '@prisma/client';
import { getSecret } from './aws.js';

let prisma: PrismaClient | null = null;

/** Lazily initialises Prisma with credentials from environment or AWS Secrets Manager. */
export async function getPrisma(): Promise<PrismaClient> {
  if (prisma) return prisma;

  // Use environment variable if available, otherwise fallback to Secrets Manager
  let DATABASE_URL = process.env.DATABASE_URL;
  
  if (!DATABASE_URL) {
    console.log('DATABASE_URL not found in environment, trying AWS Secrets Manager...');
    const secrets = await getSecret('gaitmetrics/postgres');
    DATABASE_URL = secrets.DATABASE_URL;
  } else {
    console.log('Using DATABASE_URL from environment variable');
  }

  prisma = new PrismaClient({
    datasourceUrl: DATABASE_URL,
    log: ['error', 'warn'],
  });

  // Verify connection
  await prisma.$queryRaw`SELECT 1`;
  return prisma;
}
