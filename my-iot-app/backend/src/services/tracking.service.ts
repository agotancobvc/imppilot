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

    socket.on('gaitMetrics', async ({ patientId, leftSide, rightSide, gaitSpeed }) => {
      const prisma = await getPrisma();
      await prisma.gaitMetric.create({
        data: { 
          timestamp: BigInt(Date.now()),
          sessionId: socket.data.sessionId as string,
          data: JSON.stringify({
            patientId,
            leftSide,
            rightSide,
            gaitSpeed,
          }),
        },
      });
      io.to(patientId).emit('gaitMetrics', {
        patientId,
        leftSide,
        rightSide,
        gaitSpeed,
      });
    });

    socket.on('pauseTracking', async ({ patientId }) => {
      socket.to(patientId).emit('trackingPaused');
    });

    socket.on('resumeTracking', async ({ patientId }) => {
      socket.to(patientId).emit('trackingResumed');
    });

    socket.on('stopTracking', async ({ patientId }) => {
      const prisma = await getPrisma();
      await prisma.session.update({
        where: { id: socket.data.sessionId as string },
        data: { endTime: new Date(), status: 'completed' },
      });
      socket.to(patientId).emit('trackingStopped');
    });
  });
}
