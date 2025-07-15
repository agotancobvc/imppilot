export interface GaitMetrics {
    timestamp: number;
    leftSide: SideMetrics;
    rightSide: SideMetrics;
    gaitSpeed: number; // mph * 10
  }
  
  export interface SideMetrics {
    stepLength: number;
    stepTime: number;
    stepCadence: number;
    stanceTime: number;
    strideTime: number;
    strideLength: number;
  }
  
  export interface TrackingSession {
    id: string;
    patientId: string;
    clinicianId: string;
    startTime: Date;
    endTime?: Date;
    status: 'active' | 'paused' | 'completed';
    metrics: GaitMetrics[];
  }
  
  export interface ComparisonMetric {
    name: string;
    left: number;
    right: number;
    unit: string;
  }
  