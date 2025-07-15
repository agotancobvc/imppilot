import { create } from 'zustand';
import { GaitMetrics, TrackingSession } from '@/types/tracking.types';

interface TrackingState {
  currentSession: TrackingSession | null;
  liveMetrics: GaitMetrics[];
  isTracking: boolean;
  isConnected: boolean;
  historicalSessions: TrackingSession[];
  setCurrentSession: (session: TrackingSession) => void;
  addLiveMetric: (metric: GaitMetrics) => void;
  clearLiveMetrics: () => void;
  setIsTracking: (isTracking: boolean) => void;
  setIsConnected: (isConnected: boolean) => void;
  setHistoricalSessions: (sessions: TrackingSession[]) => void;
}

export const useTrackingStore = create<TrackingState>((set) => ({
  currentSession: null,
  liveMetrics: [],
  isTracking: false,
  isConnected: false,
  historicalSessions: [],
  setCurrentSession: (session) => set({ currentSession: session }),
  addLiveMetric: (metric) => set((state) => ({ 
    liveMetrics: [...state.liveMetrics.slice(-100), metric] 
  })),
  clearLiveMetrics: () => set({ liveMetrics: [] }),
  setIsTracking: (isTracking) => set({ isTracking }),
  setIsConnected: (isConnected) => set({ isConnected }),
  setHistoricalSessions: (sessions) => set({ historicalSessions: sessions }),
}));
