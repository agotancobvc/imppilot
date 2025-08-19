// backend/src/routes/clinic.routes.ts
import { Router } from 'express';
import {
  registerClinic,
  verifyClinicEmail,
  getClinicDetails,
  updateClinic,
} from '../controllers/clinic.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// Public routes
router.post('/register', registerClinic);
router.get('/verify/:token', verifyClinicEmail);

// Protected routes (require authentication)
router.get('/:clinicId', authMiddleware, getClinicDetails);
router.put('/:clinicId', authMiddleware, updateClinic);

export default router;
