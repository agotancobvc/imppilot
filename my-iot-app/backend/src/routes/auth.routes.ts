// backend/src/routes/auth.routes.ts
import { Router } from 'express';
import * as Auth from '../controllers/auth.controller.js';
import * as SimpleAuth from '../controllers/simple-auth.controller.js';

const router = Router();

router.post('/clinic', Auth.clinicLogin);
router.post('/clinician', Auth.clinicianLogin);
router.post('/patient', Auth.patientLogin);
router.post('/refresh', Auth.refreshToken);

export default router;
