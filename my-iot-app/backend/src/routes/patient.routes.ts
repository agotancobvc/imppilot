// backend/src/routes/patient.routes.ts
import { Router } from 'express';
import {
  addPatient,
  getPatientsByClinic,
  getPatientDetails,
  updatePatient,
  searchPatients,
} from '../controllers/patient.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// Authentication disabled for local testing
// router.use(authMiddleware);

router.post('/add', addPatient);
router.get('/clinic/:clinicId', getPatientsByClinic);
router.get('/clinic/:clinicId/search', searchPatients);
router.get('/:patientId', getPatientDetails);
router.put('/:patientId', updatePatient);

export default router;
