// backend/src/services/postgres.service.ts
import { getPrisma } from '../config/db.js';

export async function createClinic(data: any) {
  const prisma = await getPrisma();
  return prisma.clinic.create({ data });
}
