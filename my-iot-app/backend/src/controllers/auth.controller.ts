// backend/src/controllers/auth.controller.ts
<<<<<<< HEAD
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { getPrisma } from '../config/db.js';
import { env } from '../config/env.js';
import { prismaTx } from '../utils/prismaTx.js';
=======
import * as bcrypt from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { Request, Response } from 'express';
import { getPrisma } from '../config/db.js';
import { env } from '../config/env.js';

>>>>>>> 0f95ffb703c03c3362b8083360f11c844b33e19e

const SALT_ROUNDS = 12;

/** Step 1 – clinic login */
export async function clinicLogin(req: Request, res: Response) {
  const { code } = req.body as { code: string };
  const prisma = await getPrisma();
  const clinic = await prisma.clinic.findUnique({ where: { code } });
  if (!clinic) return res.status(401).json({ message: 'Invalid clinic code' });
  return res.json(clinic);
}

/** Step 2 – clinician login */
export async function clinicianLogin(req: Request, res: Response) {
  const { clinicId, username, password } = req.body;
  const prisma = await getPrisma();
  const clinician = await prisma.clinician.findFirst({
    where: { clinicId, username },
  });
  if (!clinician) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, clinician.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  return res.json(clinician);
}

/** Step 3 – patient selection + JWT issuance */
export async function patientLogin(req: Request, res: Response) {
  const { clinicId, clinicianId, patientId } = req.body;
  const prisma = await getPrisma();
  const patient = await prisma.patient.findFirst({
    where: { id: patientId, clinicId },
  });
  if (!patient) return res.status(404).json({ message: 'Patient not found' });

  const accessPayload = { sub: clinicianId, pid: patientId, cid: clinicId };
<<<<<<< HEAD
  const accessToken = jwt.sign(accessPayload, process.env.JWT_ACCESS_SECRET!, {
    issuer: env.JWT_ISSUER,
    expiresIn: env.JWT_ACCESS_EXPIRES,
  });
  const refreshToken = jwt.sign(accessPayload, process.env.JWT_REFRESH_SECRET!, {
=======
  const accessToken = (sign as any)(accessPayload, env.JWT_ACCESS_SECRET, {
    issuer: env.JWT_ISSUER,
    expiresIn: env.JWT_ACCESS_EXPIRES,
  });
  const refreshToken = (sign as any)(accessPayload, env.JWT_REFRESH_SECRET, {
>>>>>>> 0f95ffb703c03c3362b8083360f11c844b33e19e
    issuer: env.JWT_ISSUER,
    expiresIn: env.JWT_REFRESH_EXPIRES,
  });

  await prisma.refreshToken.create({
    data: { token: refreshToken, clinicianId },
  });

  return res.json({ patient, token: accessToken, refreshToken });
}

/** Refresh access-token */
export async function refreshToken(req: Request, res: Response) {
  const { refreshToken } = req.body;
  const prisma = await getPrisma();
  const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
  if (!stored) return res.status(401).json({ message: 'Invalid refresh token' });

  try {
<<<<<<< HEAD
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;
    const newAccess = jwt.sign(
      { sub: decoded.sub, pid: decoded.pid, cid: decoded.cid },
      process.env.JWT_ACCESS_SECRET!,
=======
    const decoded = verify(refreshToken, env.JWT_REFRESH_SECRET) as any;
    const newAccess = (sign as any)(
      { sub: decoded.sub, pid: decoded.pid, cid: decoded.cid },
      env.JWT_ACCESS_SECRET,
>>>>>>> 0f95ffb703c03c3362b8083360f11c844b33e19e
      { issuer: env.JWT_ISSUER, expiresIn: env.JWT_ACCESS_EXPIRES },
    );
    return res.json({ token: newAccess });
  } catch {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
}
