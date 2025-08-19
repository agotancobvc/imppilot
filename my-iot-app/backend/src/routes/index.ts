// backend/src/routes/index.ts
import { Express } from 'express';
import authRoutes from './auth.routes.js';
import trackingRoutes from './tracking.routes.js';
import userRoutes from './user.routes.js';
import onboardingRoutes from './onboarding.routes.js';
import clinicRoutes from './clinic.routes.js';
import clinicianRoutes from './clinician.routes.js';
import patientRoutes from './patient.routes.js';

export default function routes(app: Express) {
  app.use('/api/auth', authRoutes);
  app.use('/api/tracking', trackingRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/onboarding', onboardingRoutes);
  app.use('/api/clinics', clinicRoutes);
  app.use('/api/clinicians', clinicianRoutes);
  app.use('/api/patients', patientRoutes);
}
