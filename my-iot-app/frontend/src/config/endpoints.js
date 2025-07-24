"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WEBSOCKET_URL = exports.API_ENDPOINTS = void 0;
var API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
exports.API_ENDPOINTS = {
    AUTH: {
        CLINIC: "".concat(API_BASE_URL, "/auth/clinic"),
        CLINICIAN: "".concat(API_BASE_URL, "/auth/clinician"),
        PATIENT: "".concat(API_BASE_URL, "/auth/patient"),
        LOGOUT: "".concat(API_BASE_URL, "/auth/logout"),
        REFRESH: "".concat(API_BASE_URL, "/auth/refresh"),
    },
    TRACKING: {
        START: "".concat(API_BASE_URL, "/tracking/start"),
        STOP: "".concat(API_BASE_URL, "/tracking/stop"),
        HISTORY: "".concat(API_BASE_URL, "/tracking/history"),
        SESSION: "".concat(API_BASE_URL, "/tracking/session"),
    },
    USERS: {
        PROFILE: "".concat(API_BASE_URL, "/users/profile"),
        UPDATE: "".concat(API_BASE_URL, "/users/update"),
    },
};
exports.WEBSOCKET_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:3001';
