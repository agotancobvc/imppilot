import { z } from 'zod';
export declare const SideMetricSchema: z.ZodObject<{
    stepLength: z.ZodNumber;
    stepTime: z.ZodNumber;
    stepCadence: z.ZodNumber;
    stanceTime: z.ZodNumber;
    strideTime: z.ZodNumber;
    strideLength: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    stepLength: number;
    stepTime: number;
    stepCadence: number;
    stanceTime: number;
    strideTime: number;
    strideLength: number;
}, {
    stepLength: number;
    stepTime: number;
    stepCadence: number;
    stanceTime: number;
    strideTime: number;
    strideLength: number;
}>;
export declare const GaitMetricSchema: z.ZodObject<{
    timestamp: z.ZodNumber;
    patientId: z.ZodString;
    sessionId: z.ZodOptional<z.ZodString>;
    leftSide: z.ZodObject<{
        stepLength: z.ZodNumber;
        stepTime: z.ZodNumber;
        stepCadence: z.ZodNumber;
        stanceTime: z.ZodNumber;
        strideTime: z.ZodNumber;
        strideLength: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        stepLength: number;
        stepTime: number;
        stepCadence: number;
        stanceTime: number;
        strideTime: number;
        strideLength: number;
    }, {
        stepLength: number;
        stepTime: number;
        stepCadence: number;
        stanceTime: number;
        strideTime: number;
        strideLength: number;
    }>;
    rightSide: z.ZodObject<{
        stepLength: z.ZodNumber;
        stepTime: z.ZodNumber;
        stepCadence: z.ZodNumber;
        stanceTime: z.ZodNumber;
        strideTime: z.ZodNumber;
        strideLength: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        stepLength: number;
        stepTime: number;
        stepCadence: number;
        stanceTime: number;
        strideTime: number;
        strideLength: number;
    }, {
        stepLength: number;
        stepTime: number;
        stepCadence: number;
        stanceTime: number;
        strideTime: number;
        strideLength: number;
    }>;
    gaitSpeed: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    timestamp: number;
    patientId: string;
    leftSide: {
        stepLength: number;
        stepTime: number;
        stepCadence: number;
        stanceTime: number;
        strideTime: number;
        strideLength: number;
    };
    rightSide: {
        stepLength: number;
        stepTime: number;
        stepCadence: number;
        stanceTime: number;
        strideTime: number;
        strideLength: number;
    };
    gaitSpeed: number;
    sessionId?: string | undefined;
}, {
    timestamp: number;
    patientId: string;
    leftSide: {
        stepLength: number;
        stepTime: number;
        stepCadence: number;
        stanceTime: number;
        strideTime: number;
        strideLength: number;
    };
    rightSide: {
        stepLength: number;
        stepTime: number;
        stepCadence: number;
        stanceTime: number;
        strideTime: number;
        strideLength: number;
    };
    gaitSpeed: number;
    sessionId?: string | undefined;
}>;
export type GaitMetric = z.infer<typeof GaitMetricSchema>;
//# sourceMappingURL=tracking.types.d.ts.map