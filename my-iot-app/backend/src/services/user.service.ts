// backend/src/services/user.service.ts
import { getPrisma } from '../config/db.js';

export async function getPatientById(patientId: string) {
  const prisma = await getPrisma();
  return prisma.patient.findUnique({ where: { id: patientId } });
}
