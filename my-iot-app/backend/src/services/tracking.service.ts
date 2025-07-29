// backend/src/services/tracking.service.ts
import { Server as SocketIOServer, Socket } from 'socket.io';
import { getPrisma } from '../config/db.js';
import { GaitMetricSchema } from '../types/tracking.types.js';

export function registerSocketHandlers(io: SocketIOServer) {
  io.use(async (socket, next) => {
    // Simple JWT auth token query param ?token=
    const token = socket.handshake.auth.token as string;
    if (!token) return next(new Error('Authentication required'));
    // TODO: verify token and attach clinician info
    return next();
  });

  io.on('connection', (socket: Socket) => {
    socket.on('subscribe', async ({ patientId }) => {
      socket.join(patientId);
    });

    socket.on('startTracking', async ({ patientId }) => {
      const prisma = await getPrisma();
      const session = await prisma.session.create({
        data: { patientId, clinicianId: socket.data.sub },
      });
      socket.to(patientId).emit('trackingStarted', session);
      socket.data.sessionId = session.id;
    });

    socket.on('gaitMetrics', async (data: unknown) => {
      const result = GaitMetricSchema.safeParse(data);
      if (!result.success) return;

      const metrics = result.data;
      const prisma = await getPrisma();
      await prisma.gaitMetric.create({
        data: { 
          timestamp: metrics.timestamp,
          sessionId: socket.data.sessionId as string,
          data: {
            patientId: metrics.patientId,
            leftSide: metrics.leftSide,
            rightSide: metrics.rightSide,
            gaitSpeed: metrics.gaitSpeed
          }
        },
      });
      io.to(metrics.patientId).emit('gaitMetrics', metrics);
    });

    socket.on('stopTracking', async ({ patientId }) => {
      const prisma = await getPrisma();
      await prisma.session.update({
        where: { id: socket.data.sessionId },
        data: { endTime: new Date(), status: 'completed' },
      });
      io.to(patientId).emit('trackingStopped');
    });
  });
}
