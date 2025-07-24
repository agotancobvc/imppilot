"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var recharts_1 = require("recharts");
var GaitMetricsChart = function (_a) {
    var metrics = _a.metrics, selectedMetric = _a.selectedMetric;
    var getMetricValue = function (metric, side, metricName) {
        if (metricName === 'gaitSpeed')
            return metric.gaitSpeed;
        return metric["".concat(side, "Side")][metricName];
    };
    var chartData = metrics.map(function (metric, index) { return (__assign({ time: index, left: getMetricValue(metric, 'left', selectedMetric), right: getMetricValue(metric, 'right', selectedMetric) }, (selectedMetric === 'gaitSpeed' && { combined: metric.gaitSpeed }))); });
    return (<div className="card h-96">
      <h3 className="text-lg font-semibold mb-4 capitalize">
        {selectedMetric.replace(/([A-Z])/g, ' $1').trim()} Comparison
      </h3>
      <recharts_1.ResponsiveContainer width="100%" height="100%">
        <recharts_1.LineChart data={chartData}>
          <recharts_1.CartesianGrid strokeDasharray="3 3"/>
          <recharts_1.XAxis dataKey="time"/>
          <recharts_1.YAxis />
          <recharts_1.Tooltip />
          <recharts_1.Legend />
          {selectedMetric !== 'gaitSpeed' && (<>
              <recharts_1.Line type="monotone" dataKey="left" stroke="#ef4444" strokeWidth={2} name="Left Side"/>
              <recharts_1.Line type="monotone" dataKey="right" stroke="#3b82f6" strokeWidth={2} name="Right Side"/>
            </>)}
          {selectedMetric === 'gaitSpeed' && (<recharts_1.Line type="monotone" dataKey="combined" stroke="#22c55e" strokeWidth={2} name="Gait Speed"/>)}
        </recharts_1.LineChart>
      </recharts_1.ResponsiveContainer>
    </div>);
};
exports.default = GaitMetricsChart;
