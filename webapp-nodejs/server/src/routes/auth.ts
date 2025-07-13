import express from 'express';
import { AuthService } from '../services/authService.js';

const router = express.Router();

router.post('/login', (req, res) => {
  const { clinicianId, password } = req.body;
  
  if (AuthService.validateClinician(clinicianId, password)) {
    const token = AuthService.generateToken(clinicianId);
    res.json({ success: true, token, name: AuthService.getClinicianName(clinicianId) });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

export default router;
