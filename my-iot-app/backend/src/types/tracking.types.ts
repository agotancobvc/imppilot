// backend/src/types/tracking.types.ts
import { z } from 'zod';

export const SideMetricSchema = z.object({
  stepLength: z.number(),
  stepTime: z.number(),
  stepCadence: z.number(),
  stanceTime: z.number(),
  strideTime: z.number(),
  strideLength: z.number(),
});

export const GaitMetricSchema = z.object({
  timestamp: z.number(),
  patientId: z.string().uuid(),
  sessionId: z.string().uuid().optional(),
  leftSide: SideMetricSchema,
  rightSide: SideMetricSchema,
  gaitSpeed: z.number(),
});
export type GaitMetric = z.infer<typeof GaitMetricSchema>;
