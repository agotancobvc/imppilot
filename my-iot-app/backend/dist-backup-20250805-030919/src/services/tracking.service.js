import { getPrisma } from '../config/db.js';
import { GaitMetricSchema } from '../types/tracking.types.js';
export function registerSocketHandlers(io) {
    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token)
            return next(new Error('Authentication required'));
        return next();
    });
    io.on('connection', (socket) => {
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
        socket.on('gaitMetrics', async (data) => {
            const result = GaitMetricSchema.safeParse(data);
            if (!result.success)
                return;
            const metrics = result.data;
            const prisma = await getPrisma();
            await prisma.gaitMetric.create({
                data: {
                    timestamp: metrics.timestamp,
                    sessionId: socket.data.sessionId,
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
//# sourceMappingURL=tracking.service.js.map