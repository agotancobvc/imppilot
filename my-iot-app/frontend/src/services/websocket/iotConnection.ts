import { io, Socket } from 'socket.io-client';
import { WEBSOCKET_CONFIG, WEBSOCKET_ERRORS } from '@/config/websocket.config';
import { GaitMetrics } from '@/types/tracking.types';

export class IoTConnectionService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private connectionTimeout: NodeJS.Timeout | null = null;

  constructor(private token: string) {}

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = io(WEBSOCKET_CONFIG.url, {
        auth: { token: this.token },
        timeout: WEBSOCKET_CONFIG.timeout,
      });

      this.connectionTimeout = setTimeout(() => {
        reject(new Error(WEBSOCKET_ERRORS.TIMEOUT));
      }, WEBSOCKET_CONFIG.timeout);

      this.socket.on(WEBSOCKET_CONFIG.events.CONNECT, () => {
        if (this.connectionTimeout) {
          clearTimeout(this.connectionTimeout);
          this.connectionTimeout = null;
        }
        this.reconnectAttempts = 0;
        this.startHeartbeat();
        resolve();
      });

      this.socket.on(WEBSOCKET_CONFIG.events.DISCONNECT, () => {
        this.stopHeartbeat();
        this.handleReconnect();
      });

      this.socket.on(WEBSOCKET_CONFIG.events.ERROR, (error: any) => {
        reject(new Error(error.message || WEBSOCKET_ERRORS.CONNECTION_FAILED));
      });
    });
  }

  disconnect(): void {
    this.stopHeartbeat();
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  subscribeToPatient(patientId: string): void {
    if (this.socket) {
      this.socket.emit(WEBSOCKET_CONFIG.events.SUBSCRIBE, { patientId });
    }
  }

  unsubscribeFromPatient(patientId: string): void {
    if (this.socket) {
      this.socket.emit(WEBSOCKET_CONFIG.events.UNSUBSCRIBE, { patientId });
    }
  }

  onGaitMetrics(callback: (metrics: GaitMetrics) => void): void {
    if (this.socket) {
      this.socket.on(WEBSOCKET_CONFIG.events.GAIT_METRICS, callback);
    }
  }

  onTrackingStarted(callback: (session: any) => void): void {
    if (this.socket) {
      this.socket.on(WEBSOCKET_CONFIG.events.TRACKING_STARTED, callback);
    }
  }

  onTrackingStopped(callback: (session: any) => void): void {
    if (this.socket) {
      this.socket.on(WEBSOCKET_CONFIG.events.TRACKING_STOPPED, callback);
    }
  }

  startTracking(patientId: string): void {
    if (this.socket) {
      this.socket.emit('startTracking', { patientId });
    }
  }

  stopTracking(patientId: string): void {
    if (this.socket) {
      this.socket.emit('stopTracking', { patientId });
    }
  }

  get isConnected(): boolean {
    return this.socket?.connected || false;
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < WEBSOCKET_CONFIG.reconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        this.connect().catch(console.error);
      }, WEBSOCKET_CONFIG.reconnectDelay);
    }
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.socket) {
        this.socket.emit('ping');
      }
    }, WEBSOCKET_CONFIG.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
}
