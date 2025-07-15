import { API_ENDPOINTS } from '@/config/endpoints';
import { TrackingSession } from '@/types/tracking.types';

export class TrackingService {
  static async startSession(patientId: string, token: string): Promise<TrackingSession> {
    const response = await fetch(API_ENDPOINTS.TRACKING.START, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ patientId }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to start tracking session');
    }
    
    return response.json();
  }

  static async stopSession(sessionId: string, token: string): Promise<TrackingSession> {
    const response = await fetch(API_ENDPOINTS.TRACKING.STOP, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ sessionId }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to stop tracking session');
    }
    
    return response.json();
  }

  static async getHistory(patientId: string, token: string): Promise<TrackingSession[]> {
    const response = await fetch(`${API_ENDPOINTS.TRACKING.HISTORY}?patientId=${patientId}`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch tracking history');
    }
    
    return response.json();
  }
}
