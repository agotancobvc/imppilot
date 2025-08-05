import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useTrackingStore } from '@/store/trackingStore';
import { useWebSocket } from '@/hooks/useWebSocket';

const Dashboard: React.FC = () => {
  const { patient, clinician, clinic, logout } = useAuthStore();
  const { liveMetrics, isTracking, isConnected } = useTrackingStore();
  const [selectedMetric, setSelectedMetric] = useState('step_length');
  const [timeFrame, setTimeFrame] = useState('1m');
  const { startTracking, stopTracking, pauseTracking, resumeTracking } = useWebSocket();
  const [isPaused, setIsPaused] = useState(false);

  const metricOptions = [
    { value: 'step_length', label: 'Step Length' },
    { value: 'step_length_variability', label: 'Step Length Variability' },
    { value: 'stride_length', label: 'Stride Length' },
    { value: 'stride_length_variability', label: 'Stride Length Variability' },
    { value: 'stride_time_variability', label: 'Stride Time Variability' },
    { value: 'cadence', label: 'Cadence' },
    { value: 'gait_speed', label: 'Gait Speed' },
    { value: 'gait_cycle_variability', label: 'Gait Cycle Variability' },
    { value: 'stance_time', label: 'Stance Time' },
    { value: 'swing_time', label: 'Swing Time' },
    { value: 'swing_time_variability', label: 'Swing Time Variability' },
    { value: 'double_support_time', label: 'Double Support Time' },
  ];

  const handleStart = () => {
    startTracking();
    setIsPaused(false);
  };

  const handlePause = () => {
    pauseTracking();
    setIsPaused(true);
  };

  const handleResume = () => {
    resumeTracking();
    setIsPaused(false);
  };

  const handleEnd = () => {
    stopTracking();
    setIsPaused(false);
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-title">
          <span>Gait Metrics System</span>
          <div className={`connection-status ${
            isConnected ? 'connected' : 'disconnected'
          }`}>
            <div className="status-dot"></div>
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>
        
        <div className="dashboard-nav">
          <div className="nav-info">
            <div className="clinician-info">{clinic?.name}</div>
            <div className="patient-info">{clinician?.firstName} {clinician?.lastName}</div>
          </div>
          <button onClick={logout} className="logout-btn">
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Patient Info */}
        <div className="patient-card">
          <div className="patient-avatar">
            <span>👤</span>
          </div>
          <div className="patient-details">
            <h2>{patient?.firstName} {patient?.lastName}</h2>
            <p>MRN: {patient?.medicalRecordNumber}</p>
          </div>
        </div>

        {/* Page Header with Controls */}
        <div className="page-header">
          <h1>Real-Time Dashboard</h1>
          <div className="control-buttons">
            {!isTracking && !isPaused && (
              <button className="control-btn start-btn" onClick={handleStart}>
                <span className="control-icon">▶</span>
                <span className="control-text">Start</span>
              </button>
            )}
            {isTracking && !isPaused && (
              <button className="control-btn pause-btn" onClick={handlePause}>
                <span className="control-icon">⏸</span>
                <span className="control-text">Pause</span>
              </button>
            )}
            {isPaused && (
              <button className="control-btn start-btn" onClick={handleResume}>
                <span className="control-icon">▶</span>
                <span className="control-text">Resume</span>
              </button>
            )}
            {(isTracking || isPaused) && (
              <button className="control-btn end-btn" onClick={handleEnd}>
                <span className="control-icon">⏹</span>
                <span className="control-text">End Session</span>
              </button>
            )}
          </div>
        </div>

        {/* Charts Container */}
        <div className="charts-container">
          <div className="chart-section">
            <div className="chart-header">
              <div className="metric-selector">
                <label htmlFor="metric-select">Metric:</label>
                <select
                  id="metric-select"
                  className="metric-dropdown"
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                >
                  {metricOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="time-frame-controls">
                {['1m', '5m', '10m', '30m', 'all'].map((frame) => (
                  <button
                    key={frame}
                    className={`time-btn ${timeFrame === frame ? 'active' : ''}`}
                    onClick={() => setTimeFrame(frame)}
                  >
                    {frame}
                  </button>
                ))}
              </div>
            </div>
            <div className="chart-container">
              <canvas 
                id="gait-chart" 
                width="400" 
                height="200"
                style={{
                  width: '100%',
                  height: '300px',
                  background: 'rgba(15, 15, 15, 0.5)',
                  borderRadius: '8px',
                  border: '1px solid rgba(148, 163, 184, 0.1)'
                }}
              >
                Chart will be rendered here
              </canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
