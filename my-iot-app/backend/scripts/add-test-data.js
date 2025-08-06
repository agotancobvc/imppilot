// Script to add test clinic and clinician data
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addTestData() {
  try {
    console.log('🏥 Adding test clinic data...');
    
    // Create test clinic
    const clinic = await prisma.clinic.upsert({
      where: { code: 'TEST123' },
      update: {},
      create: {
        code: 'TEST123',
        name: 'Test Clinic',
      },
    });
    
    console.log('✅ Test clinic created:', clinic);
    
    // Create test clinician
    const clinician = await prisma.clinician.upsert({
      where: { username: 'test.clinician' },
      update: {},
      create: {
        username: 'test.clinician',
        firstName: 'Test',
        lastName: 'Clinician',
        passwordHash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeVMpYxNg8L6j/1pG', // password: 'test123'
        clinicId: clinic.id,
      },
    });
    
    console.log('✅ Test clinician created:', clinician);
    
    console.log('\n🎉 Test data added successfully!');
    console.log('📋 Login credentials:');
    console.log('   Clinic Code: TEST123');
    console.log('   Username: test.clinician');
    console.log('   Password: test123');
    
  } catch (error) {
    console.error('❌ Error adding test data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addTestData();
