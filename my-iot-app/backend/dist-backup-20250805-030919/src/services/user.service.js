import { getPrisma } from '../config/db.js';
export async function getPatientById(patientId) {
    const prisma = await getPrisma();
    return prisma.patient.findUnique({ where: { id: patientId } });
}
//# sourceMappingURL=user.service.js.map