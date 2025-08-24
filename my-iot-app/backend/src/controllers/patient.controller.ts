// backend/src/controllers/patient.controller.ts
import { Request, Response } from 'express';
import { getPrisma } from '../config/db.js';
import { generateMRN } from '../services/clinic.service.js';
import { auditLog } from '../services/audit.service.js';

/** Add a new patient */
export async function addPatient(req: Request, res: Response) {
  try {
    const { clinicId, firstName, lastName, dateOfBirth } = req.body;
    const clinicianId = req.user?.id; // From auth middleware
    
    if (!clinicId || !firstName || !lastName || !dateOfBirth) {
      return res.status(400).json({ 
        message: 'Clinic ID, first name, last name, and date of birth are required' 
      });
    }

    const prisma = await getPrisma();
    
    // Verify clinic exists
    const clinic = await prisma.clinic.findUnique({ 
      where: { id: clinicId },
      select: { id: true, name: true }
    });
    
    if (!clinic) {
      return res.status(404).json({ message: 'Clinic not found' });
    }

    // Generate unique MRN
    const mrn = await generateMRN(prisma, clinicId);

    // Create patient
    const patient = await prisma.patient.create({
      data: {
        clinicId,
        firstName,
        lastName,
        mrn,
        dateOfBirth: new Date(dateOfBirth),
        createdBy: clinicianId,
        updatedBy: clinicianId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        mrn: true,
        dateOfBirth: true,
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
      tableName: 'Patient',
      recordId: patient.id,
      action: 'CREATE',
      newValues: { 
        clinicId, 
        firstName, 
        lastName, 
        mrn, 
        dateOfBirth 
      },
      userId: clinicianId,
      userType: 'clinician',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });

    return res.status(201).json({
      message: 'Patient added successfully',
      patient,
    });
  } catch (error) {
    console.error('Add patient error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

/** Get patients for a clinic */
export async function getPatientsByClinic(req: Request, res: Response) {
  try {
    const { clinicId } = req.params;
    const { search, limit = 50, offset = 0 } = req.query;
    
    const prisma = await getPrisma();
    
    const whereClause: any = { clinicId };
    
    // Add search functionality
    if (search) {
      whereClause.OR = [
        { firstName: { contains: search as string } },
        { lastName: { contains: search as string } },
        { mrn: { contains: search as string } },
      ];
    }

    const patients = await prisma.patient.findMany({
      where: whereClause,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        mrn: true,
        dateOfBirth: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: Number(limit),
      skip: Number(offset),
    });

    const totalCount = await prisma.patient.count({ where: whereClause });

    return res.json({
      patients,
      pagination: {
        total: totalCount,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: Number(offset) + Number(limit) < totalCount,
      },
    });
  } catch (error) {
    console.error('Get patients error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

/** Get patient details */
export async function getPatientDetails(req: Request, res: Response) {
  try {
    const { patientId } = req.params;
    
    const prisma = await getPrisma();
    
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        clinic: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        sessions: {
          select: {
            id: true,
            startTime: true,
            endTime: true,
            status: true,
            clinician: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: {
            startTime: 'desc',
          },
          take: 10, // Last 10 sessions
        },
      },
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    return res.json(patient);
  } catch (error) {
    console.error('Get patient details error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

/** Update patient details */
export async function updatePatient(req: Request, res: Response) {
  try {
    const { patientId } = req.params;
    const { firstName, lastName, dateOfBirth } = req.body;
    const clinicianId = req.user?.id;
    
    const prisma = await getPrisma();
    
    const existingPatient = await prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!existingPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const updatedPatient = await prisma.patient.update({
      where: { id: patientId },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
        updatedBy: clinicianId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        mrn: true,
        dateOfBirth: true,
        updatedAt: true,
      },
    });

    // Audit log
    await auditLog(prisma, {
      tableName: 'Patient',
      recordId: patientId,
      action: 'UPDATE',
      oldValues: {
        firstName: existingPatient.firstName,
        lastName: existingPatient.lastName,
        dateOfBirth: existingPatient.dateOfBirth,
      },
      newValues: { firstName, lastName, dateOfBirth },
      userId: clinicianId,
      userType: 'clinician',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });

    return res.json({
      message: 'Patient updated successfully',
      patient: updatedPatient,
    });
  } catch (error) {
    console.error('Update patient error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

/** Search patients across clinic */
export async function searchPatients(req: Request, res: Response) {
  try {
    const { clinicId } = req.params;
    const { q } = req.query;
    
    if (!q || typeof q !== 'string' || q.trim().length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }

    const prisma = await getPrisma();
    
    const patients = await prisma.patient.findMany({
      where: {
        clinicId,
        OR: [
          { firstName: { contains: q.trim() } },
          { lastName: { contains: q.trim() } },
          { mrn: { contains: q.trim() } },
        ],
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        mrn: true,
        dateOfBirth: true,
      },
      take: 20, // Limit search results
      orderBy: [
        { lastName: 'asc' },
        { firstName: 'asc' },
      ],
    });

    return res.json(patients);
  } catch (error) {
    console.error('Search patients error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
