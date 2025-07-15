export interface UserPreferences {
    theme: 'light' | 'dark';
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
      sound: boolean;
    };
    dashboard: {
      defaultView: 'live' | 'history';
      autoRefresh: boolean;
      refreshInterval: number;
    };
  }
  
  export interface UserSession {
    id: string;
    userId: string;
    clinicId: string;
    patientId?: string;
    startTime: Date;
    endTime?: Date;
    ipAddress: string;
    userAgent: string;
    isActive: boolean;
  }
  
  export interface UserActivity {
    id: string;
    userId: string;
    action: string;
    resource: string;
    timestamp: Date;
    metadata?: any;
  }
  