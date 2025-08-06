// backend/src/controllers/onboarding.controller.ts
import * as bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { z } from 'zod';
import { getPrisma } from '../config/db.js';
// import { generateClinicCode } from '../utils/clinic-code.js';

// Temporary inline clinic code generation until utils file is compiled
function generateRandomCode(): string {
  const letters = 'ABCDEFGHJKLMNPRSTUVWXYZ';
  const numbers = '0123456789';
  let code = '';
  for (let i = 0; i < 3; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  for (let i = 0; i < 3; i++) {
    code += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  return code;
}

async function generateClinicCode(prisma: any): Promise<string> {
  const maxAttempts = 100;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const code = generateRandomCode();
    const existingClinic = await prisma.clinic.findUnique({ where: { code } });
    if (!existingClinic) return code;
  }
  throw new Error('Unable to generate unique clinic code');
}

const SALT_ROUNDS = 12;

// Validation schemas
const ClinicRegistrationSchema = z.object({
  clinicName: z.string().min(2).max(100),
  adminFirstName: z.string().min(1).max(50),
  adminLastName: z.string().min(1).max(50),
  adminEmail: z.string().email(),
  adminUsername: z.string().min(3).max(30),
  adminPassword: z.string().min(8).max(100),
  organizationType: z.enum(['hospital', 'clinic', 'research', 'private_practice']).optional(),
  contactPhone: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().default('US')
  }).optional()
});

/**
 * Self-service clinic registration
 * Creates clinic, generates unique code, and sets up admin clinician
 */
export async function registerClinic(req: Request, res: Response) {
  try {
    // Validate input
    const validatedData = ClinicRegistrationSchema.parse(req.body);
    const prisma = await getPrisma();

    // Check if username already exists
    const existingClinician = await prisma.clinician.findUnique({
      where: { username: validatedData.adminUsername }
    });

    if (existingClinician) {
      return res.status(400).json({ 
        message: 'Username already exists. Please choose a different username.' 
      });
    }

    // Generate unique clinic code
    const clinicCode = await generateClinicCode(prisma);

    // Hash password
    const passwordHash = await bcrypt.hash(validatedData.adminPassword, SALT_ROUNDS);

    // Create clinic and admin clinician in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create clinic
      const clinic = await tx.clinic.create({
        data: {
          code: clinicCode,
          name: validatedData.clinicName,
          // Add additional fields if you extend the schema
          ...(validatedData.organizationType && { organizationType: validatedData.organizationType }),
          ...(validatedData.contactPhone && { contactPhone: validatedData.contactPhone }),
          ...(validatedData.address && { address: validatedData.address })
        }
      });

      // Create admin clinician
      const adminClinician = await tx.clinician.create({
        data: {
          clinicId: clinic.id,
          username: validatedData.adminUsername,
          passwordHash,
          firstName: validatedData.adminFirstName,
          lastName: validatedData.adminLastName,
          // email: validatedData.adminEmail, // Uncomment when email field is added to schema
          // role: 'admin' // Uncomment when role field is added to schema
        }
      });

      return { clinic, adminClinician };
    });

    // Return success response (don't include sensitive data)
    return res.status(201).json({
      message: 'Clinic registered successfully!',
      clinic: {
        id: result.clinic.id,
        name: result.clinic.name,
        code: result.clinic.code
      },
      adminClinician: {
        id: result.adminClinician.id,
        username: result.adminClinician.username,
        firstName: result.adminClinician.firstName,
        lastName: result.adminClinician.lastName
      },
      instructions: {
        step1: `Your clinic code is: ${result.clinic.code}`,
        step2: `Admin username: ${validatedData.adminUsername}`,
        step3: 'You can now log in to the system using these credentials',
        step4: 'Share the clinic code with other clinicians to join your clinic'
      }
    });

  } catch (error) {
    console.error('Clinic registration error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Invalid input data',
        errors: error.errors
      });
    }

    return res.status(500).json({
      message: 'Internal server error during clinic registration'
    });
  }
}

/**
 * Check if clinic code is available
 */
export async function checkClinicCodeAvailability(req: Request, res: Response) {
  try {
    const { code } = req.params;
    const prisma = await getPrisma();

    const existingClinic = await prisma.clinic.findUnique({
      where: { code }
    });

    return res.json({
      available: !existingClinic,
      code
    });
  } catch (error) {
    console.error('Code availability check error:', error);
    return res.status(500).json({
      message: 'Error checking code availability'
    });
  }
}

/**
 * Add clinician to existing clinic (for clinic admins)
 */
export async function addClinicianToClinic(req: Request, res: Response) {
  try {
    const AddClinicianSchema = z.object({
      clinicId: z.string().uuid(),
      username: z.string().min(3).max(30),
      password: z.string().min(8).max(100),
      firstName: z.string().min(1).max(50),
      lastName: z.string().min(1).max(50),
      email: z.string().email().optional(),
      role: z.enum(['admin', 'clinician']).default('clinician')
    });

    const validatedData = AddClinicianSchema.parse(req.body);
    const prisma = await getPrisma();

    // Check if username already exists
    const existingClinician = await prisma.clinician.findUnique({
      where: { username: validatedData.username }
    });

    if (existingClinician) {
      return res.status(400).json({ 
        message: 'Username already exists' 
      });
    }

    // Verify clinic exists
    const clinic = await prisma.clinic.findUnique({
      where: { id: validatedData.clinicId }
    });

    if (!clinic) {
      return res.status(404).json({ message: 'Clinic not found' });
    }

    // Hash password and create clinician
    const passwordHash = await bcrypt.hash(validatedData.password, SALT_ROUNDS);

    const newClinician = await prisma.clinician.create({
      data: {
        clinicId: validatedData.clinicId,
        username: validatedData.username,
        passwordHash,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        ...(validatedData.email && { email: validatedData.email }),
        ...(validatedData.role && { role: validatedData.role })
      }
    });

    return res.status(201).json({
      message: 'Clinician added successfully',
      clinician: {
        id: newClinician.id,
        username: newClinician.username,
        firstName: newClinician.firstName,
        lastName: newClinician.lastName,
        clinicName: clinic.name
      }
    });

  } catch (error) {
    console.error('Add clinician error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Invalid input data',
        errors: error.errors
      });
    }

    return res.status(500).json({
      message: 'Internal server error'
    });
  }
}
