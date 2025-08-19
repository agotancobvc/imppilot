import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create clinic
  const clinic = await prisma.clinic.upsert({
    where: { code: 'TEST123' },
    update: {},
    create: {
      code: 'TEST123',
      name: 'Test Clinic',
      address: '123 Test St, Test City, TC 12345',
      email: 'info@testclinic.com',
    },
  });

  console.log('✅ Created clinic:', clinic.name);

  // Create clinician (using simple password hash for demo)
  const clinician = await prisma.clinician.upsert({
    where: { 
      username: 'test.clinician'
    },
    update: {},
    create: {
      clinicId: clinic.id,
      username: 'test.clinician',
      passwordHash: '$2b$10$K7L/VxwjlkXon0Zd.Vwu4.L9rGkqvJ8FGpVJ9rGkqvJ8FGpVJ9rGkq', // test123
      firstName: 'Test',
      lastName: 'Clinician',
      email: 'test.clinician@testclinic.com',
    },
  });

  console.log('✅ Created clinician:', clinician.firstName, clinician.lastName);

  // Create patients
  const patient1 = await prisma.patient.upsert({
    where: { mrn: 'MRN001' },
    update: {},
    create: {
      clinicId: clinic.id,
      mrn: 'MRN001',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date('1984-12-31'),
      createdBy: clinician.id,
      updatedBy: clinician.id,
    },
  });

  const patient2 = await prisma.patient.upsert({
    where: { mrn: 'MRN002' },
    update: {},
    create: {
      clinicId: clinic.id,
      mrn: 'MRN002',
      firstName: 'Jane',
      lastName: 'Smith',
      dateOfBirth: new Date('1990-05-15'),
      createdBy: clinician.id,
      updatedBy: clinician.id,
    },
  });

  console.log('✅ Created patients:', patient1.mrn, patient2.mrn);
  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
