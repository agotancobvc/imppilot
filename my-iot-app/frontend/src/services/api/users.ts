import { API_ENDPOINTS } from '@/config/endpoints';
import { Clinician, Patient } from '@/types/auth.types';

export class UserService {
  static async getClinicianProfile(token: string): Promise<Clinician> {
    const response = await fetch(API_ENDPOINTS.USERS.PROFILE, {
      headers: { 
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch clinician profile');
    }
    
    return response.json();
  }

  static async updateClinicianProfile(updates: Partial<Clinician>, token: string): Promise<Clinician> {
    const response = await fetch(API_ENDPOINTS.USERS.UPDATE, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update profile');
    }
    
    return response.json();
  }

  static async searchPatients(clinicId: string, query: string, token: string): Promise<Patient[]> {
    const response = await fetch(`${API_ENDPOINTS.USERS.PROFILE}/patients?clinicId=${clinicId}&q=${query}`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to search patients');
    }
    
    return response.json();
  }

  static async getPatientDetails(patientId: string, token: string): Promise<Patient> {
    const response = await fetch(`${API_ENDPOINTS.USERS.PROFILE}/patients/${patientId}`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch patient details');
    }
    
    return response.json();
  }
}
