// backend/src/routes/index.ts
import { Express } from 'express';
import authRoutes from './auth.routes.js';
import trackingRoutes from './tracking.routes.js';
import userRoutes from './user.routes.js';

export default function routes(app: Express) {
  app.use('/api/auth', authRoutes);
  app.use('/api/tracking', trackingRoutes);
  app.use('/api/users', userRoutes);
}
