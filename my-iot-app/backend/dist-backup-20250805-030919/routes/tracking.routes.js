import { Router } from 'express';
import { getTrackingHistory } from '../controllers/tracking.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
const router = Router();
router.get('/history/:patientId', authMiddleware(true), getTrackingHistory);
export default router;
//# sourceMappingURL=tracking.routes.js.map