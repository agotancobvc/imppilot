// backend/src/routes/onboarding.routes.ts
import { Router } from 'express';
import { 
  registerClinic, 
  checkClinicCodeAvailability, 
  addClinicianToClinic 
} from '../controllers/onboarding.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * Public routes for clinic onboarding
 */

// POST /api/onboarding/register-clinic
// Self-service clinic registration
router.post('/register-clinic', registerClinic);

// GET /api/onboarding/check-code/:code
// Check if clinic code is available
router.get('/check-code/:code', checkClinicCodeAvailability);

/**
 * Protected routes (require authentication)
 */

// POST /api/onboarding/add-clinician
// Add new clinician to existing clinic (admin only)
router.post('/add-clinician', authMiddleware(), addClinicianToClinic);

export default router;
