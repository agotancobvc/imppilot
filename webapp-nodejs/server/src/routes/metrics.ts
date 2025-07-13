import express from 'express';

const router = express.Router();

router.get('/history/:patientId/:metricId', (req, res) => {
  const { patientId, metricId } = req.params;
  // Add your metrics history logic here
  res.json({ data: [] });
});

export default router;
