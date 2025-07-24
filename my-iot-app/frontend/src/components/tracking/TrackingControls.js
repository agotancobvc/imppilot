"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var TrackingControls = function (_a) {
    var isTracking = _a.isTracking, onStart = _a.onStart, onStop = _a.onStop, isConnected = _a.isConnected;
    return (<div className="card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {isConnected ? (<lucide_react_1.Wifi className="h-5 w-5 text-success-600"/>) : (<lucide_react_1.WifiOff className="h-5 w-5 text-error-600"/>)}
            <span className="text-sm font-medium text-gray-700">
              Sensor Status: {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          
          <div className={"px-3 py-1 rounded-full text-sm font-medium ".concat(isTracking
            ? 'bg-success-100 text-success-800'
            : 'bg-gray-100 text-gray-800')}>
            {isTracking ? 'Recording' : 'Stopped'}
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onStart} disabled={!isConnected || isTracking} className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            <lucide_react_1.Play className="h-4 w-4"/>
            Start Recording
          </button>
          
          <button onClick={onStop} disabled={!isTracking} className="bg-error-600 hover:bg-error-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            <lucide_react_1.Square className="h-4 w-4"/>
            Stop Recording
          </button>
        </div>
      </div>
    </div>);
};
exports.default = TrackingControls;
