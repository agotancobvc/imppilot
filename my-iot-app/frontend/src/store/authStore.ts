import { create } from 'zustand';
import { Clinic, Clinician, Patient } from '@/types/auth.types';

interface AuthState {
  clinic: Clinic | null;
  clinician: Clinician | null;
  patient: Patient | null;
  token: string | null;
  isAuthenticated: boolean;
  setClinic: (clinic: Clinic) => void;
  setClinician: (clinician: Clinician) => void;
  setPatient: (patient: Patient) => void;
  setToken: (token: string) => void;
  logout: () => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  clinic: null,
  clinician: null,
  patient: null,
  token: null,
  isAuthenticated: false,
  setClinic: (clinic) => set({ clinic }),
  setClinician: (clinician) => set({ clinician }),
  setPatient: (patient) => set({ patient, isAuthenticated: true }),
  setToken: (token) => set({ token }),
  logout: () => set({ 
    clinic: null, 
    clinician: null, 
    patient: null, 
    token: null, 
    isAuthenticated: false 
  }),
  reset: () => set({ 
    clinic: null, 
    clinician: null, 
    patient: null, 
    token: null, 
    isAuthenticated: false 
  }),
}));
