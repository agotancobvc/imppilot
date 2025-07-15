import { API_ENDPOINTS } from '@/config/endpoints';
import { Clinic, Clinician, Patient } from '@/types/auth.types';

export class AuthService {
  static async validateClinic(code: string): Promise<Clinic> {
    const response = await fetch(API_ENDPOINTS.AUTH.CLINIC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    
    if (!response.ok) {
      throw new Error('Invalid clinic code');
    }
    
    return response.json();
  }

  static async loginClinician(clinicId: string, username: string, password: string): Promise<Clinician> {
    const response = await fetch(API_ENDPOINTS.AUTH.CLINICIAN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clinicId, username, password }),
    });
    
    if (!response.ok) {
      throw new Error('Invalid credentials');
    }
    
    return response.json();
  }

  static async selectPatient(clinicId: string, clinicianId: string, patientId: string): Promise<{ patient: Patient; token: string }> {
    const response = await fetch(API_ENDPOINTS.AUTH.PATIENT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clinicId, clinicianId, patientId }),
    });
    
    if (!response.ok) {
      throw new Error('Invalid patient ID');
    }
    
    return response.json();
  }

  static async logout(token: string): Promise<void> {
    await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
  }
}
