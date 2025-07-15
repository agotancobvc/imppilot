import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useTrackingStore } from '@/store/trackingStore';
import { IoTConnectionService } from '@/services/websocket/iotConnection';
import { GaitMetrics } from '@/types/tracking.types';

export const useWebSocket = () => {
  const connectionRef = useRef<IoTConnectionService | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { token, patient } = useAuthStore();
  const { 
    addLiveMetric, 
    setIsConnected, 
    setIsTracking, 
    setCurrentSession 
  } = useTrackingStore();

  useEffect(() => {
    if (token) {
      connectionRef.current = new IoTConnectionService(token);
      
      const connect = async () => {
        try {
          await connectionRef.current!.connect();
          setIsConnected(true);
          setConnectionError(null);
          
          // Set up event listeners
          connectionRef.current!.onGaitMetrics((data: GaitMetrics) => {
            addLiveMetric(data);
          });
          
          connectionRef.current!.onTrackingStarted((session) => {
            setCurrentSession(session);
            setIsTracking(true);
          });
          
          connectionRef.current!.onTrackingStopped((session) => {
            setCurrentSession(session);
            setIsTracking(false);
          });
          
          // Subscribe to patient if available
          if (patient) {
            connectionRef.current!.subscribeToPatient(patient.id);
          }
        } catch (error) {
          setConnectionError(error instanceof Error ? error.message : 'Connection failed');
          setIsConnected(false);
        }
      };
      
      connect();
      
      return () => {
        if (connectionRef.current) {
          connectionRef.current.disconnect();
        }
      };
    }
  }, [token, patient]);

  const startTracking = () => {
    if (connectionRef.current && patient) {
      connectionRef.current.startTracking(patient.id);
    }
  };

  const stopTracking = () => {
    if (connectionRef.current && patient) {
      connectionRef.current.stopTracking(patient.id);
    }
  };

  return {
    socket: connectionRef.current,
    startTracking,
    stopTracking,
    connectionError,
    isConnected: connectionRef.current?.isConnected || false,
  };
};
