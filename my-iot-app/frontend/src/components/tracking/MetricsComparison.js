"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var MetricsComparison = function (_a) {
    var currentMetrics = _a.currentMetrics;
    if (!currentMetrics)
        return null;
    var comparisonMetrics = [
        {
            name: 'Step Length',
            left: currentMetrics.leftSide.stepLength,
            right: currentMetrics.rightSide.stepLength,
            unit: 'cm',
        },
        {
            name: 'Step Time',
            left: currentMetrics.leftSide.stepTime,
            right: currentMetrics.rightSide.stepTime,
            unit: 'ms',
        },
        {
            name: 'Step Cadence',
            left: currentMetrics.leftSide.stepCadence,
            right: currentMetrics.rightSide.stepCadence,
            unit: 'steps/min',
        },
        {
            name: 'Stance Time',
            left: currentMetrics.leftSide.stanceTime,
            right: currentMetrics.rightSide.stanceTime,
            unit: 'ms',
        },
        {
            name: 'Stride Time',
            left: currentMetrics.leftSide.strideTime,
            right: currentMetrics.rightSide.strideTime,
            unit: 'ms',
        },
        {
            name: 'Stride Length',
            left: currentMetrics.leftSide.strideLength,
            right: currentMetrics.rightSide.strideLength,
            unit: 'cm',
        },
    ];
    return (<div className="card">
      <h3 className="text-lg font-semibold mb-4">Current Metrics Comparison</h3>
      <div className="space-y-4">
        {comparisonMetrics.map(function (metric) { return (<div key={metric.name} className="border-b border-gray-200 pb-3">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-700">{metric.name}</span>
              <span className="text-sm text-gray-500">{metric.unit}</span>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Left</span>
                  <span className="font-medium text-error-600">{metric.left.toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-error-500 h-2 rounded-full" style={{ width: "".concat(Math.min((metric.left / Math.max(metric.left, metric.right)) * 100, 100), "%") }}/>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Right</span>
                  <span className="font-medium text-primary-600">{metric.right.toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary-500 h-2 rounded-full" style={{ width: "".concat(Math.min((metric.right / Math.max(metric.left, metric.right)) * 100, 100), "%") }}/>
                </div>
              </div>
            </div>
          </div>); })}
        <div className="bg-success-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium text-success-700">Gait Speed</span>
            <span className="text-success-600 font-bold text-lg">
              {(currentMetrics.gaitSpeed / 10).toFixed(1)} mph
            </span>
          </div>
        </div>
      </div>
    </div>);
};
exports.default = MetricsComparison;
