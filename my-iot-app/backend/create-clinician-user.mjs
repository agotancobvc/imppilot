import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createClinician() {
  try {
    // Find the clinic with code G16B0T
    const clinic = await prisma.clinic.findUnique({
      where: { code: 'G16B0T' }
    });

    if (!clinic) {
      console.log('❌ Clinic with code G16B0T not found');
      return;
    }

    console.log('✅ Found clinic:', clinic.name);

    // Check if clinician already exists
    const existingClinician = await prisma.clinician.findFirst({
      where: { 
        username: 'testclinician4',
        clinicId: clinic.id 
      }
    });

    if (existingClinician) {
      console.log('✅ Clinician already exists:');
      console.log('Username: testclinician4');
      console.log('Password: password123');
      console.log('Clinic:', clinic.name);
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('password123', 12);

    // Create clinician
    const clinician = await prisma.clinician.create({
      data: {
        username: 'testclinician4',
        passwordHash: hashedPassword,
        firstName: 'Dr. Sarah',
        lastName: 'Johnson',
        email: 'testclinician4@imppilot.com',
        clinicId: clinic.id,
        role: 'clinician'
      }
    });

    console.log('✅ Clinician created successfully!');
    console.log('Username: testclinician4');
    console.log('Password: password123');
    console.log('Name: Dr. Sarah Johnson');
    console.log('Clinic:', clinic.name);

  } catch (error) {
    console.error('❌ Error creating clinician:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createClinician();
