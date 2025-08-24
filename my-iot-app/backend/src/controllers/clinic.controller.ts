// backend/src/controllers/clinic.controller.ts
import { Request, Response } from 'express';
import { getPrisma } from '../config/db.js';
import { generateClinicCode, generateVerificationToken, sendVerificationEmail } from '../services/clinic.service.js';
import { auditLog } from '../services/audit.service.js';

/** Register a new clinic */
export async function registerClinic(req: Request, res: Response) {
  try {
    const { name, email, address, phone } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ message: 'Clinic name and email are required' });
    }

    const prisma = await getPrisma();
    
    // Check if email already exists
    const existingClinic = await prisma.clinic.findUnique({ where: { email } });
    if (existingClinic) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Generate unique clinic code
    const code = await generateClinicCode(prisma);
    const verificationToken = generateVerificationToken();

    // Create clinic with code as ID
    const clinic = await prisma.clinic.create({
      data: {
        id: code,
        name,
        email,
        address,
        phone,
        code,
        emailVerificationToken: verificationToken,
        emailVerified: false,
      },
    });

    // Send verification email
    await sendVerificationEmail(email, verificationToken, name);

    // Audit log (disabled for local testing)
    // await auditLog(prisma, {
    //   tableName: 'Clinic',
    //   recordId: clinic.id,
    //   action: 'CREATE',
    //   newValues: clinic,
    //   userType: 'system',
    //   ipAddress: req.ip,
    //   userAgent: req.get('User-Agent'),
    // });

    return res.status(201).json({
      message: 'Clinic registered successfully. Please check your email to verify your account.',
      clinicId: clinic.id,
      code: clinic.code,
    });
  } catch (error) {
    console.error('Clinic registration error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

/** Verify clinic email */
export async function verifyClinicEmail(req: Request, res: Response) {
  try {
    const { token } = req.params;
    
    if (!token) {
      return res.status(400).json({ message: 'Verification token is required' });
    }

    const prisma = await getPrisma();
    
    const clinic = await prisma.clinic.findUnique({
      where: { emailVerificationToken: token },
    });

    if (!clinic) {
      return res.status(404).json({ message: 'Invalid verification token' });
    }

    if (clinic.emailVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    // Update clinic as verified
    const updatedClinic = await prisma.clinic.update({
      where: { id: clinic.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
      },
    });

    // Audit log
    await auditLog(prisma, {
      tableName: 'Clinic',
      recordId: clinic.id,
      action: 'UPDATE',
      oldValues: { emailVerified: false },
      newValues: { emailVerified: true },
      userType: 'system',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });

    return res.json({
      message: 'Email verified successfully',
      clinic: {
        id: updatedClinic.id,
        name: updatedClinic.name,
        code: updatedClinic.code,
        emailVerified: updatedClinic.emailVerified,
      },
    });
  } catch (error) {
    console.error('Email verification error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

/** Get clinic details */
export async function getClinicDetails(req: Request, res: Response) {
  try {
    const { clinicId } = req.params;
    
    const prisma = await getPrisma();
    
    const clinic = await prisma.clinic.findUnique({
      where: { id: clinicId },
      include: {
        clinicians: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            username: true,
            isActive: true,
            createdAt: true,
          },
        },
        patients: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            mrn: true,
            dateOfBirth: true,
            createdAt: true,
          },
        },
      },
    });

    if (!clinic) {
      return res.status(404).json({ message: 'Clinic not found' });
    }

    return res.json(clinic);
  } catch (error) {
    console.error('Get clinic details error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

/** Update clinic details */
export async function updateClinic(req: Request, res: Response) {
  try {
    const { clinicId } = req.params;
    const { name, address, phone } = req.body;
    
    const prisma = await getPrisma();
    
    const existingClinic = await prisma.clinic.findUnique({
      where: { id: clinicId },
    });

    if (!existingClinic) {
      return res.status(404).json({ message: 'Clinic not found' });
    }

    const updatedClinic = await prisma.clinic.update({
      where: { id: clinicId },
      data: {
        ...(name && { name }),
        ...(address && { address }),
        ...(phone && { phone }),
      },
    });

    // Audit log
    await auditLog(prisma, {
      tableName: 'Clinic',
      recordId: clinicId,
      action: 'UPDATE',
      oldValues: {
        name: existingClinic.name,
        address: existingClinic.address,
        phone: existingClinic.phone,
      },
      newValues: { name, address, phone },
      userType: 'clinician',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });

    return res.json(updatedClinic);
  } catch (error) {
    console.error('Update clinic error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
