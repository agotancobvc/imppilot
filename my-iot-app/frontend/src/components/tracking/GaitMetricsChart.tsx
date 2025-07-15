import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { GaitMetrics } from '@/types/tracking.types';

interface GaitMetricsChartProps {
  metrics: GaitMetrics[];
  selectedMetric: string;
}

const GaitMetricsChart: React.FC<GaitMetricsChartProps> = ({ metrics, selectedMetric }) => {
  const getMetricValue = (metric: GaitMetrics, side: 'left' | 'right', metricName: string): number => {
    if (metricName === 'gaitSpeed') return metric.gaitSpeed;
    return metric[`${side}Side`][metricName as keyof typeof metric.leftSide];
  };

  const chartData = metrics.map((metric, index) => ({
    time: index,
    left: getMetricValue(metric, 'left', selectedMetric),
    right: getMetricValue(metric, 'right', selectedMetric),
    ...(selectedMetric === 'gaitSpeed' && { combined: metric.gaitSpeed }),
  }));

  return (
    <div className="card h-96">
      <h3 className="text-lg font-semibold mb-4 capitalize">
        {selectedMetric.replace(/([A-Z])/g, ' $1').trim()} Comparison
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          {selectedMetric !== 'gaitSpeed' && (
            <>
              <Line type="monotone" dataKey="left" stroke="#ef4444" strokeWidth={2} name="Left Side" />
              <Line type="monotone" dataKey="right" stroke="#3b82f6" strokeWidth={2} name="Right Side" />
            </>
          )}
          {selectedMetric === 'gaitSpeed' && (
            <Line type="monotone" dataKey="combined" stroke="#22c55e" strokeWidth={2} name="Gait Speed" />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GaitMetricsChart;
