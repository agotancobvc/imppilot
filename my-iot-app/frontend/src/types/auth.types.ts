export interface Clinic {
    id: string;
    name: string;
    code: string;
    address: string;
    phone: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Clinician {
    id: string;
    clinicId: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'admin' | 'clinician';
    licenseNumber?: string;
    department?: string;
    createdAt: Date;
    lastLogin?: Date;
  }
  
  export interface Patient {
    id: string;
    clinicId: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    medicalRecordNumber: string;
    gender: 'male' | 'female' | 'other';
    height?: number;
    weight?: number;
    diagnosis?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface LoginStep {
    step: 1 | 2 | 3;
    clinic?: Clinic;
    clinician?: Clinician;
    patient?: Patient;
  }
  
  export interface AuthToken {
    token: string;
    refreshToken: string;
    expiresAt: Date;
  }
  