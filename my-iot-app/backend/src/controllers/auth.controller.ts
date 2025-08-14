// backend/src/controllers/auth.controller.ts
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
const { sign, verify } = jwt;
import { Request, Response } from 'express';
import { getPrisma } from '../config/db.js';
import { env } from '../config/env.js';

const SALT_ROUNDS = 12;

/** Step 1 – clinic login */
export async function clinicLogin(req: Request, res: Response) {
  try {
    console.log('Clinic login request body:', req.body);
    const { clinicCode, code } = req.body as { clinicCode?: string; code?: string };
    const actualCode = clinicCode || code;
    console.log('Extracted code:', actualCode);
    
    if (!actualCode) {
      console.log('No clinic code provided');
      return res.status(400).json({ message: 'Clinic code is required' });
    }
    
    const prisma = await getPrisma();
    const clinic = await prisma.clinic.findUnique({ where: { code: actualCode } });
    console.log('Found clinic:', clinic);
    
    if (!clinic) return res.status(401).json({ message: 'Invalid clinic code' });
    return res.json(clinic);
  } catch (error) {
    console.error('Clinic login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
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

  // Accept either internal UUID or MRN (case-insensitive)
  const rawId = String(patientId ?? '').trim();
  const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const isUuid = uuidV4Regex.test(rawId);

  const patient = await prisma.patient.findFirst({
    where: isUuid
      ? { id: rawId, clinicId }
      : { mrn: { equals: rawId, mode: 'insensitive' }, clinicId },
  });

  if (!patient) return res.status(404).json({ message: 'Patient not found' });

  // Use canonical patient UUID in tokens regardless of whether user entered MRN or UUID
  const accessPayload = { sub: clinicianId, pid: patient.id, cid: clinicId };
  const accessToken = (sign as any)(accessPayload, env.JWT_ACCESS_SECRET, {
    issuer: env.JWT_ISSUER,
    expiresIn: env.JWT_ACCESS_EXPIRES,
  });
  const refreshToken = (sign as any)(accessPayload, env.JWT_REFRESH_SECRET, {
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
    const decoded = verify(refreshToken, env.JWT_REFRESH_SECRET) as any;
    const newAccess = (sign as any)(
      { sub: decoded.sub, pid: decoded.pid, cid: decoded.cid },
      env.JWT_ACCESS_SECRET,
      { issuer: env.JWT_ISSUER, expiresIn: env.JWT_ACCESS_EXPIRES },
    );
    return res.json({ token: newAccess });
  } catch {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
}
