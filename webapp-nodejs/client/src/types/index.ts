export interface MetricData {
    patient_id: string;
    timestamp: number;
    metric_id: string;
    value: number;
    session_id?: string;
  }
  
  export interface SessionData {
    session_id: string;
    patient_id: string;
    clinician_id: string;
    start_time: number;
    end_time?: number;
    status: 'active' | 'paused' | 'ended';
    metrics: string[];
  }
  
  export interface Metric {
    id: string;
    name: string;
    unit: string;
  }
  
  export interface User {
    clinicianId: string;
    name: string;
  }
  