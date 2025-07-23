// backend/src/controllers/tracking.controller.ts
import { Request, Response } from 'express';
import { getPrisma } from '../config/db.js';

export async function getTrackingHistory(req: Request, res: Response) {
  const { patientId } = req.params;
  const prisma = await getPrisma();

  const sessions = await prisma.session.findMany({
    where: { patientId },
    include: { metrics: true },
    orderBy: { startTime: 'desc' },
  });

  return res.json({ sessions });
}
