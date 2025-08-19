// backend/src/routes/clinician.routes.ts
import { Router } from 'express';
import {
  registerClinician,
  getCliniciansByClinic,
  updateClinician,
  deactivateClinician,
} from '../controllers/clinician.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// Public routes
router.post('/register', registerClinician);

// Protected routes (require authentication)
router.get('/clinic/:clinicId', authMiddleware, getCliniciansByClinic);
router.put('/:clinicianId', authMiddleware, updateClinician);
router.delete('/:clinicianId', authMiddleware, deactivateClinician);

export default router;
