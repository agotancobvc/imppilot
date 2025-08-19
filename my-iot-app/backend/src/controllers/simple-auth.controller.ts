import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function simplePatientLogin(req: Request, res: Response) {
  try {
    const { clinicId, patientId } = req.body;
    
    console.log('Simple patient login attempt:', { clinicId, patientId });

    // Find clinic by code
    const clinic = await prisma.clinic.findUnique({
      where: { code: clinicId }
    });

    if (!clinic) {
      console.log('Clinic not found:', clinicId);
      return res.status(404).json({ message: 'Invalid clinic code' });
    }

    // Find patient by MRN
    const patient = await prisma.patient.findFirst({
      where: { 
        mrn: patientId,
        clinicId: clinic.id 
      },
      include: {
        clinic: {
          select: {
            name: true,
            code: true
          }
        }
      }
    });

    if (!patient) {
      console.log('Patient not found:', { patientId, clinicId: clinic.id });
      return res.status(404).json({ message: 'Patient not found' });
    }

    console.log('Patient login successful:', patient.mrn);

    // Return simple success response
    return res.json({
      success: true,
      patient: {
        id: patient.id,
        mrn: patient.mrn,
        firstName: patient.firstName,
        lastName: patient.lastName,
        clinic: patient.clinic
      },
      token: 'demo-token-' + patient.id // Simple demo token
    });

  } catch (error) {
    console.error('Simple patient login error:', error);
    return res.status(500).json({ message: 'Login failed' });
  }
}
