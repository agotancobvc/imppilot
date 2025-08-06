// backend/src/config/server.ts
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { Server as SocketIOServer } from 'socket.io';
import { env } from './env.js';
import { registerSocketHandlers } from '../services/tracking.service.js';
import { errorMiddleware } from '../middleware/error.middleware.js';
import healthRoutes from '../routes/health.routes.js';
import routes from '../routes/index.js';

export function createApp() {
  const app = express();

  // Trust proxy (ALB/Load Balancer)
  app.set('trust proxy', true);

  // Global middleware
  app.use(helmet());
  app.use(
    cors({
      origin: ['https://imppilot.com', 'http://localhost:3000', 'http://localhost:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
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

  // Health check routes (before authentication)
  app.use('/', healthRoutes);

  // REST routes
  routes(app);

  // Error handler
  app.use(errorMiddleware);

  return app;
}

export function createHTTPServer() {
  const app = createApp();
  
  // Check if SSL certificates exist and if we should run HTTPS
  const sslKeyPath = '/etc/letsencrypt/live/imppilot.com/privkey.pem';
  const sslCertPath = '/etc/letsencrypt/live/imppilot.com/fullchain.pem';
  const runHttpsOnly = process.env.HTTPS_ENABLED !== 'false' && fs.existsSync(sslKeyPath) && fs.existsSync(sslCertPath);
  const port = parseInt(process.env.PORT || '3000', 10);

  if (runHttpsOnly) {
    // Production HTTPS mode with SSL certificates
    console.log('🔒 Starting in HTTPS mode with SSL certificates');
    
    // Create HTTP server for redirects
    const httpServer = createServer((req, res) => {
      const host = req.headers.host || 'imppilot.com';
      const httpsUrl = `https://${host}${req.url}`;
      res.writeHead(301, { 'Location': httpsUrl });
      res.end();
    });

    // HTTPS server configuration
    const httpsOptions = {
      key: fs.readFileSync(sslKeyPath),
      cert: fs.readFileSync(sslCertPath),
    } as const;

    // Create HTTPS server
    const httpsServer = https.createServer(httpsOptions, app);

    // Socket.io
    const io = new SocketIOServer(httpsServer, {
      cors: { origin: '*' },
      pingInterval: 3 * 60 * 1000, // 3-minute heartbeat
      pingTimeout: 10 * 60 * 1000, // 10-minute timeout
    });

    registerSocketHandlers(io);

    // Start both HTTP (for redirects) and HTTPS servers
    const HTTP_PORT = 80;
    const HTTPS_PORT = 443;
    
    httpServer.listen(HTTP_PORT, () => {
      console.log(`HTTP server running on port ${HTTP_PORT} (redirects to HTTPS)`);
    });

    httpsServer.listen(HTTPS_PORT, () => {
      console.log(`HTTPS server running on port ${HTTPS_PORT}`);
    });

    return { httpServer, httpsServer, io };
  } else {
    // HTTP only mode (for ALB or development)
    console.log('🌐 Starting in HTTP mode (SSL handled by ALB or disabled)');
    
    // Create HTTP server with the app
    const httpServer = createServer(app);

    // Socket.io
    const io = new SocketIOServer(httpServer, {
      cors: { origin: '*' },
      pingInterval: 3 * 60 * 1000, // 3-minute heartbeat
      pingTimeout: 10 * 60 * 1000, // 10-minute timeout
    });

    registerSocketHandlers(io);

    // Start HTTP server only
    httpServer.listen(port, () => {
      console.log(`🚀 HTTP server running on port ${port}`);
    });

    return { httpServer, httpsServer: null, io };
  }
}
