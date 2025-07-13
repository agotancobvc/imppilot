import React, { useState, useEffect } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { MetricChart } from './MetricChart';
import { SessionControls } from './SessionControls';
import './Dashboard.css';

interface DashboardProps {
  patientId: string;
  clinicianName: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ patientId, clinicianName }) => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionPaused, setSessionPaused] = useState(false);
  const [metricsData, setMetricsData] = useState<Record<string, any[]>>({});
  
  const socket = useSocket();

  const availableMetrics = [
    { id: 'step_length', name: 'Step Length', unit: 'cm' },
    { id: 'stride_length', name: 'Stride Length', unit: 'cm' },
    { id: 'cadence', name: 'Cadence', unit: 'steps/min' },
    { id: 'gait_speed', name: 'Gait Speed', unit: 'm/s' },
    { id: 'stance_time', name: 'Stance Time', unit: '%' },
    { id: 'swing_time', name: 'Swing Time', unit: '%' },
  ];

  useEffect(() => {
    if (socket) {
      socket.emit('join_patient_room', { patientId });

      socket.on('metric_update', (data) => {
        setMetricsData(prev => ({
          ...prev,
          [data.metric_id]: [...(prev[data.metric_id] || []), data].slice(-50)
        }));
      });

      socket.on('session_started', () => {
        setSessionActive(true);
        setSessionPaused(false);
      });

      socket.on('session_ended', () => {
        setSessionActive(false);
        setSessionPaused(false);
      });
    }

    return () => {
      if (socket) {
        socket.off('metric_update');
        socket.off('session_started');
        socket.off('session_ended');
      }
    };
  }, [socket, patientId]);

  const handleStartSession = () => {
    if (socket && selectedMetrics.length > 0) {
      socket.emit('start_session', { patientId, metrics: selectedMetrics });
    }
  };

  const handleEndSession = () => {
    if (socket) {
      socket.emit('end_session');
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Gait Analysis Dashboard</h1>
        <div className="session-info">
          <span>Patient: {patientId}</span>
          <span>Clinician: {clinicianName}</span>
        </div>
      </header>

      <div className="metrics-selection">
        <h3>Select Metrics to Monitor:</h3>
        <div className="metrics-grid">
          {availableMetrics.map(metric => (
            <label key={metric.id} className="metric-checkbox">
              <input
                type="checkbox"
                checked={selectedMetrics.includes(metric.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedMetrics([...selectedMetrics, metric.id]);
                  } else {
                    setSelectedMetrics(selectedMetrics.filter(m => m !== metric.id));
                  }
                }}
                disabled={sessionActive}
              />
              {metric.name} ({metric.unit})
            </label>
          ))}
        </div>
      </div>

      <SessionControls
        sessionActive={sessionActive}
        sessionPaused={sessionPaused}
        onStart={handleStartSession}
        onEnd={handleEndSession}
        canStart={selectedMetrics.length > 0}
      />

      <div className="charts-container">
        {selectedMetrics.map(metricId => (
          <MetricChart
            key={metricId}
            metricId={metricId}
            data={metricsData[metricId] || []}
            metric={availableMetrics.find(m => m.id === metricId)!}
          />
        ))}
      </div>
    </div>
  );
};
