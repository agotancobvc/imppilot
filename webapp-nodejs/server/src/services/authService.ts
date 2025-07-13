import jwt from 'jsonwebtoken';
import { config } from '../config';

interface Clinician {
  id: string;
  password: string;
  name: string;
}

// Mock clinician database - replace with real authentication
const CLINICIANS: Record<string, Clinician> = {
  'dr.smith': { id: 'dr.smith', password: 'password123', name: 'Dr. Sarah Smith' },
  'dr.jones': { id: 'dr.jones', password: 'secure456', name: 'Dr. Michael Jones' },
  'dr.brown': { id: 'dr.brown', password: 'clinic789', name: 'Dr. Lisa Brown' },
  'admin': { id: 'admin', password: 'admin', name: 'Administrator' },
};

export class AuthService {
  static validateClinician(clinicianId: string, password: string): boolean {
    const clinician = CLINICIANS[clinicianId.toLowerCase()];
    return clinician && clinician.password === password;
  }

  static getClinicianName(clinicianId: string): string {
    const clinician = CLINICIANS[clinicianId.toLowerCase()];
    return clinician ? clinician.name : clinicianId;
  }

  static generateToken(clinicianId: string): string {
    return jwt.sign(
      { clinicianId, name: this.getClinicianName(clinicianId) },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
  }

  static verifyToken(token: string): { clinicianId: string; name: string } | null {
    try {
      return jwt.verify(token, config.jwt.secret) as { clinicianId: string; name: string };
    } catch {
      return null;
    }
  }
}
