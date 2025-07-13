import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MetricChartProps {
  metricId: string;
  data: Array<{
    timestamp: number;
    value: number;
    metric_id: string;
  }>;
  metric: {
    id: string;
    name: string;
    unit: string;
  };
}

export const MetricChart: React.FC<MetricChartProps> = ({ metricId, data, metric }) => {
  const chartData = {
    labels: data.map((item, index) => {
      const date = new Date(item.timestamp);
      return date.toLocaleTimeString();
    }),
    datasets: [
      {
        label: `${metric.name} (${metric.unit})`,
        data: data.map(item => item.value),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${metric.name} - Real-time Monitoring`,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: metric.unit,
        },
        beginAtZero: true,
      },
    },
    animation: {
      duration: 750,
    },
  };

  return (
    <div className="metric-chart" style={{ height: '300px', marginBottom: '20px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};
