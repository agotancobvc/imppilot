import { getPrisma } from '../config/db.js';
export async function createClinic(data) {
    const prisma = await getPrisma();
    return prisma.clinic.create({ data });
}
//# sourceMappingURL=postgres.service.js.map