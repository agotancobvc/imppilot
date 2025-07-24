"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatters = void 0;
exports.formatters = {
    gaitSpeed: function (speed) { return "".concat((speed / 10).toFixed(1), " mph"); },
    stepLength: function (length) { return "".concat(length.toFixed(1), " cm"); },
    stepTime: function (time) { return "".concat(time.toFixed(0), " ms"); },
    stepCadence: function (cadence) { return "".concat(cadence.toFixed(0), " steps/min"); },
    stanceTime: function (time) { return "".concat(time.toFixed(0), " ms"); },
    strideTime: function (time) { return "".concat(time.toFixed(0), " ms"); },
    strideLength: function (length) { return "".concat(length.toFixed(1), " cm"); },
    timestamp: function (timestamp) {
        return new Date(timestamp).toLocaleTimeString();
    },
    date: function (date) {
        return date.toLocaleDateString();
    },
    dateTime: function (date) {
        return date.toLocaleString();
    },
};
