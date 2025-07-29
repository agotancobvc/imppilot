import { getPrisma } from '../config/db.js';
import bcrypt from 'bcryptjs';
export async function createPatient(req, res) {
    const prisma = await getPrisma();
    const patient = await prisma.patient.create({ data: req.body });
    return res.status(201).json(patient);
}
export async function updateClinicianProfile(req, res) {
    const prisma = await getPrisma();
    const { clinicianId } = req.params;
    const clinician = await prisma.clinician.update({
        where: { id: clinicianId },
        data: req.body,
    });
    return res.json(clinician);
}
export async function createClinician(req, res) {
    const prisma = await getPrisma();
    const { password, ...rest } = req.body;
    const hash = await bcrypt.hash(password, 12);
    const clinician = await prisma.clinician.create({
        data: { ...rest, passwordHash: hash },
    });
    return res.status(201).json(clinician);
}
//# sourceMappingURL=user.controller.js.map