"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTrackingStore = void 0;
var zustand_1 = require("zustand");
exports.useTrackingStore = (0, zustand_1.create)(function (set) { return ({
    currentSession: null,
    liveMetrics: [],
    isTracking: false,
    isConnected: false,
    historicalSessions: [],
    setCurrentSession: function (session) { return set({ currentSession: session }); },
    addLiveMetric: function (metric) { return set(function (state) { return ({
        liveMetrics: __spreadArray(__spreadArray([], state.liveMetrics.slice(-100), true), [metric], false)
    }); }); },
    clearLiveMetrics: function () { return set({ liveMetrics: [] }); },
    setIsTracking: function (isTracking) { return set({ isTracking: isTracking }); },
    setIsConnected: function (isConnected) { return set({ isConnected: isConnected }); },
    setHistoricalSessions: function (sessions) { return set({ historicalSessions: sessions }); },
}); });
