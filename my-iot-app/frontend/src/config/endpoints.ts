// Use HTTPS for secure communication with the backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://imppilot.com/api';

export const API_ENDPOINTS = {
  AUTH: {
    CLINIC: `${API_BASE_URL}/auth/clinic`,
    CLINIC_LOGIN: `${API_BASE_URL}/auth/clinic`,
    CLINICIAN: `${API_BASE_URL}/auth/clinician`,
    PATIENT: `${API_BASE_URL}/auth/patient`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
  },
  TRACKING: {
    START: `${API_BASE_URL}/tracking/start`,
    STOP: `${API_BASE_URL}/tracking/stop`,
    HISTORY: `${API_BASE_URL}/tracking/history`,
    SESSION: `${API_BASE_URL}/tracking/session`,
  },
  USERS: {
    PROFILE: `${API_BASE_URL}/users/profile`,
    UPDATE: `${API_BASE_URL}/users/update`,
  },
} as const;

export const WEBSOCKET_URL = process.env.REACT_APP_WS_URL || 'ws://3.92.217.101:3000';
