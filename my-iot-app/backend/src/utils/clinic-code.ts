// backend/src/utils/clinic-code.ts
import { PrismaClient } from '@prisma/client';

/**
 * Generate a unique, human-readable clinic code
 * Format: 3 letters + 3 numbers (e.g., "ABC123")
 */
export async function generateClinicCode(prisma: PrismaClient): Promise<string> {
  const maxAttempts = 100;
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const code = generateRandomCode();
    
    // Check if code already exists
    const existingClinic = await prisma.clinic.findUnique({
      where: { code }
    });
    
    if (!existingClinic) {
      return code;
    }
  }
  
  throw new Error('Unable to generate unique clinic code after maximum attempts');
}

/**
 * Generate a random clinic code in format ABC123
 */
function generateRandomCode(): string {
  // Generate 3 random letters (avoiding confusing letters like I, O, Q)
  const letters = 'ABCDEFGHJKLMNPRSTUVWXYZ';
  const numbers = '0123456789';
  
  let code = '';
  
  // Add 3 letters
  for (let i = 0; i < 3; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  
  // Add 3 numbers
  for (let i = 0; i < 3; i++) {
    code += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  
  return code;
}

/**
 * Validate clinic code format
 */
export function isValidClinicCode(code: string): boolean {
  // Must be exactly 6 characters: 3 letters + 3 numbers
  const codeRegex = /^[A-Z]{3}[0-9]{3}$/;
  return codeRegex.test(code);
}

/**
 * Generate a custom clinic code based on clinic name
 * Fallback to random if custom generation fails
 */
export async function generateCustomClinicCode(
  prisma: PrismaClient, 
  clinicName: string
): Promise<string> {
  try {
    // Extract first 3 letters from clinic name
    const nameLetters = clinicName
      .replace(/[^A-Za-z]/g, '') // Remove non-letters
      .toUpperCase()
      .substring(0, 3)
      .padEnd(3, 'X'); // Pad with X if less than 3 letters
    
    // Try different number combinations
    for (let i = 100; i <= 999; i++) {
      const code = nameLetters + i.toString();
      
      const existingClinic = await prisma.clinic.findUnique({
        where: { code }
      });
      
      if (!existingClinic) {
        return code;
      }
    }
    
    // Fallback to random generation
    return await generateClinicCode(prisma);
    
  } catch (error) {
    // Fallback to random generation
    return await generateClinicCode(prisma);
  }
}
