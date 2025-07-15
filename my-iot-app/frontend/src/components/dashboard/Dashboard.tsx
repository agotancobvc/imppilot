import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useTrackingStore } from '@/store/trackingStore';
import { useWebSocket } from '@/hooks/useWebSocket';
import GaitMetricsChart from '@/components/tracking/GaitMetricsChart';
import MetricsComparison from '@/components/tracking/MetricsComparison';
import TrackingControls from '@/components/tracking/TrackingControls';
import { LogOut, Activity, User } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { patient, clinician, clinic, logout } = useAuthStore();
  const { liveMetrics, isTracking, isConnected } = useTrackingStore();
  const [selectedMetric, setSelectedMetric] = useState('stepLength');
  const { startTracking, stopTracking } = useWebSocket();

  const metricOptions = [
    { value: 'stepLength', label: 'Step Length' },
    { value: 'stepTime', label: 'Step Time' },
    { value: 'stepCadence', label: 'Step Cadence' },
    { value: 'stanceTime', label: 'Stance Time' },
    { value: 'strideTime', label: 'Stride Time' },
    { value: 'strideLength', label: 'Stride Length' },
    { value: 'gaitSpeed', label: 'Gait Speed' },
  ];

  const currentMetrics = liveMetrics[liveMetrics.length - 1] || null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Activity className="h-8 w-8 text-primary-600" />
                <h1 className="text-xl font-bold text-gray-900">Gait Metrics</h1>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                isConnected 
                  ? 'bg-success-100 text-success-800' 
                  : 'bg-error-100 text-error-800'
              }`}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">{clinic?.name}</div>
                <div className="text-sm font-medium">{clinician?.firstName} {clinician?.lastName}</div>
              </div>
              <button
                onClick={logout}
                className="btn-secondary flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Patient Info */}
        <div className="card mb-8">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {patient?.firstName} {patient?.lastName}
              </h2>
              <p className="text-gray-600">
                MRN: {patient?.medicalRecordNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Tracking Controls */}
        <div className="mb-8">
          <TrackingControls 
            isTracking={isTracking}
            onStart={startTracking}
            onStop={stopTracking}
            isConnected={isConnected}
          />
        </div>

        {/* Metrics Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Live Metrics Chart */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Metric to Display
              </label>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="input-field max-w-xs"
              >
                {metricOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <GaitMetricsChart metrics={liveMetrics} selectedMetric={selectedMetric} />
          </div>

          {/* Current Metrics Comparison */}
          <div className="lg:col-span-1">
            <MetricsComparison currentMetrics={currentMetrics} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
