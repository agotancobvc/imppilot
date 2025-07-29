import * as bcrypt from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { getPrisma } from '../config/db.js';
import { env } from '../config/env.js';
const SALT_ROUNDS = 12;
export async function clinicLogin(req, res) {
    const { code } = req.body;
    const prisma = await getPrisma();
    const clinic = await prisma.clinic.findUnique({ where: { code } });
    if (!clinic)
        return res.status(401).json({ message: 'Invalid clinic code' });
    return res.json(clinic);
}
export async function clinicianLogin(req, res) {
    const { clinicId, username, password } = req.body;
    const prisma = await getPrisma();
    const clinician = await prisma.clinician.findFirst({
        where: { clinicId, username },
    });
    if (!clinician)
        return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, clinician.passwordHash);
    if (!ok)
        return res.status(401).json({ message: 'Invalid credentials' });
    return res.json(clinician);
}
export async function patientLogin(req, res) {
    const { clinicId, clinicianId, patientId } = req.body;
    const prisma = await getPrisma();
    const patient = await prisma.patient.findFirst({
        where: { id: patientId, clinicId },
    });
    if (!patient)
        return res.status(404).json({ message: 'Patient not found' });
    const accessPayload = { sub: clinicianId, pid: patientId, cid: clinicId };
    const accessToken = sign(accessPayload, env.JWT_ACCESS_SECRET, {
        issuer: env.JWT_ISSUER,
        expiresIn: env.JWT_ACCESS_EXPIRES,
    });
    const refreshToken = sign(accessPayload, env.JWT_REFRESH_SECRET, {
        issuer: env.JWT_ISSUER,
        expiresIn: env.JWT_REFRESH_EXPIRES,
    });
    await prisma.refreshToken.create({
        data: { token: refreshToken, clinicianId },
    });
    return res.json({ patient, token: accessToken, refreshToken });
}
export async function refreshToken(req, res) {
    const { refreshToken } = req.body;
    const prisma = await getPrisma();
    const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!stored)
        return res.status(401).json({ message: 'Invalid refresh token' });
    try {
        const decoded = verify(refreshToken, env.JWT_REFRESH_SECRET);
        const newAccess = sign({ sub: decoded.sub, pid: decoded.pid, cid: decoded.cid }, env.JWT_ACCESS_SECRET, { issuer: env.JWT_ISSUER, expiresIn: env.JWT_ACCESS_EXPIRES });
        return res.json({ token: newAccess });
    }
    catch {
        return res.status(401).json({ message: 'Invalid refresh token' });
    }
}
//# sourceMappingURL=auth.controller.js.map