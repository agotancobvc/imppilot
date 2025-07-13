export class MetricsService {
    static generateRealtimeData(patientId: string, metricId: string) {
      // Generate mock real-time data
      return {
        patient_id: patientId,
        metric_id: metricId,
        timestamp: Date.now(),
        value: Math.random() * 100 + 50, // Mock value
      };
    }
  }
  