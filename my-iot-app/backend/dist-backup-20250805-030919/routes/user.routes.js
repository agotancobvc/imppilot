import { Router } from 'express';
import * as User from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
const router = Router();
router.post('/patients', authMiddleware(true), User.createPatient);
router.put('/clinicians/:clinicianId', authMiddleware(true), User.updateClinicianProfile);
router.post('/clinicians', authMiddleware(true), User.createClinician);
export default router;
//# sourceMappingURL=user.routes.js.map