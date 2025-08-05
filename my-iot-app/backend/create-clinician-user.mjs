import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createClinician() {
  try {
    // Find the clinic with code TEST123
    const clinic = await prisma.clinic.findUnique({
      where: { code: 'TEST123' }
    });

    if (!clinic) {
      console.log('❌ Clinic with code TEST123 not found');
      return;
    }

    console.log('✅ Found clinic:', clinic.name);

    // Check if clinician already exists
    const existingClinician = await prisma.clinician.findFirst({
      where: { 
        username: 'admin',
        clinicId: clinic.id 
      }
    });

    if (existingClinician) {
      console.log('✅ Clinician already exists:');
      console.log('Username: admin');
      console.log('Password: password123');
      console.log('Clinic:', clinic.name);
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create clinician
    const clinician = await prisma.clinician.create({
      data: {
        username: 'admin',
        password: hashedPassword,
        firstName: 'Dr. John',
        lastName: 'Smith',
        email: 'admin@imppilot.com',
        clinicId: clinic.id,
      }
    });

    console.log('✅ Clinician created successfully!');
    console.log('Username: admin');
    console.log('Password: password123');
    console.log('Name: Dr. John Smith');
    console.log('Clinic:', clinic.name);

  } catch (error) {
    console.error('❌ Error creating clinician:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createClinician();
