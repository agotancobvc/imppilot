import { Server, Socket } from 'socket.io';
import { AuthService } from '../services/authService';
import { MetricsService } from '../services/metricsService';

interface AuthenticatedSocket extends Socket {
  clinicianId?: string;
  patientId?: string;
}

export function setupSocketHandlers(io: Server) {
  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log('Client connected:', socket.id);

    socket.on('authenticate', async (data: { token: string }) => {
      const user = AuthService.verifyToken(data.token);
      if (user) {
        socket.clinicianId = user.clinicianId;
        socket.emit('authenticated', { success: true, user });
      } else {
        socket.emit('authenticated', { success: false });
      }
    });

    socket.on('join_patient_room', (data: { patientId: string }) => {
      if (socket.clinicianId) {
        socket.patientId = data.patientId;
        socket.join(`patient_${data.patientId}`);
        socket.emit('joined_room', { patientId: data.patientId });
      }
    });

    socket.on('start_session', async (data: { patientId: string; metrics: string[] }) => {
      if (socket.clinicianId && socket.patientId) {
        const sessionId = `session_${Date.now()}_${socket.clinicianId}`;
        
        // Start real-time data generation
        const interval = setInterval(() => {
          data.metrics.forEach(metric => {
            const dataPoint = MetricsService.generateRealtimeData(data.patientId, metric);
            io.to(`patient_${data.patientId}`).emit('metric_update', dataPoint);
          });
        }, 1000);

        socket.emit('session_started', { sessionId });
        
        // Store interval for cleanup
        (socket as any).dataInterval = interval;
      }
    });

    socket.on('end_session', () => {
      if ((socket as any).dataInterval) {
        clearInterval((socket as any).dataInterval);
        delete (socket as any).dataInterval;
      }
      socket.emit('session_ended');
    });

    socket.on('disconnect', () => {
      if ((socket as any).dataInterval) {
        clearInterval((socket as any).dataInterval);
      }
      console.log('Client disconnected:', socket.id);
    });
  });
}
