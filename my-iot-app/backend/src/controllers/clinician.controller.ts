// backend/src/controllers/clinician.controller.ts
import * as bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { getPrisma } from '../config/db.js';
import { auditLog } from '../services/audit.service.js';

const SALT_ROUNDS = 12;

/** Register a new clinician */
export async function registerClinician(req: Request, res: Response) {
  try {
    const { clinicId, username, email, password, firstName, lastName } = req.body;
    
    if (!clinicId || !username || !password || !firstName || !lastName) {
      return res.status(400).json({ 
        message: 'Clinic ID, username, password, first name, and last name are required' 
      });
    }

    const prisma = await getPrisma();
    
    // Verify clinic exists and is verified (search by ID or code)
    const clinic = await prisma.clinic.findFirst({ 
      where: { 
        OR: [
          { id: clinicId },
          { code: clinicId }
        ]
      },
      select: { id: true, name: true, emailVerified: true, code: true }
    });
    
    if (!clinic) {
      return res.status(404).json({ message: 'Clinic not found' });
    }

    // Check if clinic email is verified (disabled for local testing)
    // if (!clinic.emailVerified) {
    //   return res.status(400).json({ message: 'Clinic email must be verified before adding clinicians' });
    // }

    // Check if username already exists
    const existingUsername = await prisma.clinician.findUnique({ where: { username } });
    if (existingUsername) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    // Check if email already exists (if provided)
    if (email) {
      const existingEmail = await prisma.clinician.findUnique({ where: { email } });
      if (existingEmail) {
        return res.status(409).json({ message: 'Email already exists' });
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create clinician
    const clinician = await prisma.clinician.create({
      data: {
        clinicId: clinic.id,
        username,
        email: email || null,
        passwordHash,
        firstName,
        lastName,
        isActive: true,
      },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        isActive: true,
        createdAt: true,
        clinic: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    // Audit log
    await auditLog(prisma, {
      tableName: 'Clinician',
      recordId: clinician.id,
      action: 'CREATE',
      newValues: { 
        clinicId: clinic.id, 
        username, 
        email, 
        firstName, 
        lastName 
      },
      userType: 'system',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });

    return res.status(201).json({
      message: 'Clinician registered successfully',
      clinician,
    });
  } catch (error) {
    console.error('Clinician registration error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

/** Get clinicians for a clinic */
export async function getCliniciansByClinic(req: Request, res: Response) {
  try {
    const { clinicId } = req.params;
    
    const prisma = await getPrisma();
    
    const clinicians = await prisma.clinician.findMany({
      where: { 
        clinicId,
        isActive: true 
      },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.json(clinicians);
  } catch (error) {
    console.error('Get clinicians error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

/** Update clinician details */
export async function updateClinician(req: Request, res: Response) {
  try {
    const { clinicianId } = req.params;
    const { email, firstName, lastName, isActive } = req.body;
    
    const prisma = await getPrisma();
    
    const existingClinician = await prisma.clinician.findUnique({
      where: { id: clinicianId },
    });

    if (!existingClinician) {
      return res.status(404).json({ message: 'Clinician not found' });
    }

    // Check if email already exists (if changing email)
    if (email && email !== existingClinician.email) {
      const existingEmail = await prisma.clinician.findUnique({ where: { email } });
      if (existingEmail) {
        return res.status(409).json({ message: 'Email already exists' });
      }
    }

    const updatedClinician = await prisma.clinician.update({
      where: { id: clinicianId },
      data: {
        ...(email !== undefined && { email }),
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(isActive !== undefined && { isActive }),
      },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        isActive: true,
        updatedAt: true,
      },
    });

    // Audit log
    await auditLog(prisma, {
      tableName: 'Clinician',
      recordId: clinicianId,
      action: 'UPDATE',
      oldValues: {
        email: existingClinician.email,
        firstName: existingClinician.firstName,
        lastName: existingClinician.lastName,
        isActive: existingClinician.isActive,
      },
      newValues: { email, firstName, lastName, isActive },
      userType: 'clinician',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });

    return res.json(updatedClinician);
  } catch (error) {
    console.error('Update clinician error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

/** Deactivate clinician */
export async function deactivateClinician(req: Request, res: Response) {
  try {
    const { clinicianId } = req.params;
    
    const prisma = await getPrisma();
    
    const existingClinician = await prisma.clinician.findUnique({
      where: { id: clinicianId },
    });

    if (!existingClinician) {
      return res.status(404).json({ message: 'Clinician not found' });
    }

    const updatedClinician = await prisma.clinician.update({
      where: { id: clinicianId },
      data: { isActive: false },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        isActive: true,
      },
    });

    // Audit log
    await auditLog(prisma, {
      tableName: 'Clinician',
      recordId: clinicianId,
      action: 'UPDATE',
      oldValues: { isActive: true },
      newValues: { isActive: false },
      userType: 'clinician',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });

    return res.json({
      message: 'Clinician deactivated successfully',
      clinician: updatedClinician,
    });
  } catch (error) {
    console.error('Deactivate clinician error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
