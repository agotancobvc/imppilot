"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var authStore_1 = require("@/store/authStore");
var trackingStore_1 = require("@/store/trackingStore");
var useWebSocket_1 = require("@/hooks/useWebSocket");
var GaitMetricsChart_1 = require("@/components/tracking/GaitMetricsChart");
var MetricsComparison_1 = require("@/components/tracking/MetricsComparison");
var TrackingControls_1 = require("@/components/tracking/TrackingControls");
var lucide_react_1 = require("lucide-react");
var Dashboard = function () {
    var _a = (0, authStore_1.useAuthStore)(), patient = _a.patient, clinician = _a.clinician, clinic = _a.clinic, logout = _a.logout;
    var _b = (0, trackingStore_1.useTrackingStore)(), liveMetrics = _b.liveMetrics, isTracking = _b.isTracking, isConnected = _b.isConnected;
    var _c = (0, react_1.useState)('stepLength'), selectedMetric = _c[0], setSelectedMetric = _c[1];
    var _d = (0, useWebSocket_1.useWebSocket)(), startTracking = _d.startTracking, stopTracking = _d.stopTracking;
    var metricOptions = [
        { value: 'stepLength', label: 'Step Length' },
        { value: 'stepTime', label: 'Step Time' },
        { value: 'stepCadence', label: 'Step Cadence' },
        { value: 'stanceTime', label: 'Stance Time' },
        { value: 'strideTime', label: 'Stride Time' },
        { value: 'strideLength', label: 'Stride Length' },
        { value: 'gaitSpeed', label: 'Gait Speed' },
    ];
    var currentMetrics = liveMetrics[liveMetrics.length - 1] || null;
    return (<div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <lucide_react_1.Activity className="h-8 w-8 text-primary-600"/>
                <h1 className="text-xl font-bold text-gray-900">Gait Metrics</h1>
              </div>
              <div className={"px-2 py-1 rounded-full text-xs font-medium ".concat(isConnected
            ? 'bg-success-100 text-success-800'
            : 'bg-error-100 text-error-800')}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">{clinic === null || clinic === void 0 ? void 0 : clinic.name}</div>
                <div className="text-sm font-medium">{clinician === null || clinician === void 0 ? void 0 : clinician.firstName} {clinician === null || clinician === void 0 ? void 0 : clinician.lastName}</div>
              </div>
              <button onClick={logout} className="btn-secondary flex items-center gap-2">
                <lucide_react_1.LogOut className="h-4 w-4"/>
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
              <lucide_react_1.User className="h-6 w-6 text-primary-600"/>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {patient === null || patient === void 0 ? void 0 : patient.firstName} {patient === null || patient === void 0 ? void 0 : patient.lastName}
              </h2>
              <p className="text-gray-600">
                MRN: {patient === null || patient === void 0 ? void 0 : patient.medicalRecordNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Tracking Controls */}
        <div className="mb-8">
          <TrackingControls_1.default isTracking={isTracking} onStart={startTracking} onStop={stopTracking} isConnected={isConnected}/>
        </div>

        {/* Metrics Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Live Metrics Chart */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Metric to Display
              </label>
              <select value={selectedMetric} onChange={function (e) { return setSelectedMetric(e.target.value); }} className="input-field max-w-xs">
                {metricOptions.map(function (option) { return (<option key={option.value} value={option.value}>
                    {option.label}
                  </option>); })}
              </select>
            </div>
            <GaitMetricsChart_1.default metrics={liveMetrics} selectedMetric={selectedMetric}/>
          </div>

          {/* Current Metrics Comparison */}
          <div className="lg:col-span-1">
            <MetricsComparison_1.default currentMetrics={currentMetrics}/>
          </div>
        </div>
      </main>
    </div>);
};
exports.default = Dashboard;
