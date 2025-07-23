// backend/src/config/server.ts
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { env } from './env.js';
import { registerSocketHandlers } from '../services/tracking.service.js';
import { errorMiddleware } from '../middleware/error.middleware.js';
import routes from '../routes/index.js';

export function createApp() {
  const app = express();

  // Global middleware
  app.use(helmet());
  app.use(
    cors({
      origin: '*',
      credentials: true,
    }),
  );
  app.use(compression());
  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());

  // Rate limiting
  app.use(
    rateLimit({
      windowMs: 1 * 60 * 1000,
      max: 120,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  // REST routes
  routes(app);

  // Error handler
  app.use(errorMiddleware);

  return app;
}

export function createHTTPServer() {
  const app = createApp();
  const httpServer = createServer(app);

  // Socket.io
  const io = new SocketIOServer(httpServer, {
    cors: { origin: '*' },
    pingInterval: 3 * 60 * 1000, // 3-minute heartbeat
    pingTimeout: 10 * 60 * 1000, // 10-minute timeout
  });

  registerSocketHandlers(io);

  return { httpServer, io };
}
