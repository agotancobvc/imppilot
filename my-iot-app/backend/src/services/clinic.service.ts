// backend/src/services/clinic.service.ts
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

/** Generate unique clinic code */
export async function generateClinicCode(prisma: PrismaClient): Promise<string> {
  let code: string;
  let isUnique = false;
  
  while (!isUnique) {
    // Generate 6-character alphanumeric code
    code = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const existing = await prisma.clinic.findUnique({ where: { code } });
    if (!existing) {
      isUnique = true;
    }
  }
  
  return code!;
}

/** Generate email verification token */
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/** Send verification email (placeholder - implement with your email service) */
export async function sendVerificationEmail(
  email: string,
  token: string,
  clinicName: string
): Promise<void> {
  // TODO: Implement with actual email service (SendGrid, AWS SES, etc.)
  console.log(`
    Verification email would be sent to: ${email}
    Clinic: ${clinicName}
    Verification URL: ${process.env.FRONTEND_URL}/verify-clinic/${token}
  `);
  
  // For now, just log the verification info
  // In production, integrate with email service:
  /*
  await emailService.send({
    to: email,
    subject: 'Verify Your Clinic Registration - ImPilot',
    template: 'clinic-verification',
    data: {
      clinicName,
      verificationUrl: `${process.env.FRONTEND_URL}/verify-clinic/${token}`,
    },
  });
  */
}

/** Auto-generate MRN for patients */
export async function generateMRN(prisma: PrismaClient, clinicId: string): Promise<string> {
  // Get clinic code for MRN prefix
  const clinic = await prisma.clinic.findUnique({
    where: { id: clinicId },
    select: { code: true },
  });
  
  if (!clinic) {
    throw new Error('Clinic not found');
  }
  
  // Count existing patients in clinic to generate sequential number
  const patientCount = await prisma.patient.count({
    where: { clinicId },
  });
  
  // Format: CLINICCODE-001, CLINICCODE-002, etc.
  const sequentialNumber = (patientCount + 1).toString().padStart(3, '0');
  const mrn = `${clinic.code}-${sequentialNumber}`;
  
  // Check if MRN already exists (edge case)
  const existing = await prisma.patient.findUnique({ where: { mrn } });
  if (existing) {
    // If collision, use timestamp-based suffix
    const timestamp = Date.now().toString().slice(-4);
    return `${clinic.code}-${sequentialNumber}${timestamp}`;
  }
  
  return mrn;
}
