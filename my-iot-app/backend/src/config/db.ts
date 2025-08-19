// backend/src/config/db.ts
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient | null = null;

/** Lazily initialises Prisma with local SQLite database for development. */
export async function getPrisma(): Promise<PrismaClient> {
  if (prisma) return prisma;

  // Use local SQLite database for development
  const DATABASE_URL = 'file:./dev.db';
  console.log('Using local SQLite database:', DATABASE_URL);

  prisma = new PrismaClient({
    datasourceUrl: DATABASE_URL,
    log: ['error', 'warn'],
  });

  // Verify connection
  await prisma.$queryRaw`SELECT 1`;
  return prisma;
}
