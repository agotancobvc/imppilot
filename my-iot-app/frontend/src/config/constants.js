"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRACKING_STATUS = exports.USER_ROLES = exports.GAIT_METRICS = exports.APP_CONFIG = void 0;
exports.APP_CONFIG = {
    APP_NAME: 'Gait Metrics System',
    VERSION: '1.0.0',
    API_TIMEOUT: 10000,
    WEBSOCKET_RECONNECT_ATTEMPTS: 5,
    WEBSOCKET_RECONNECT_DELAY: 3000,
    METRICS_BUFFER_SIZE: 100,
    CHART_UPDATE_INTERVAL: 100,
};
exports.GAIT_METRICS = {
    STEP_LENGTH: 'stepLength',
    STEP_TIME: 'stepTime',
    STEP_CADENCE: 'stepCadence',
    STANCE_TIME: 'stanceTime',
    STRIDE_TIME: 'strideTime',
    STRIDE_LENGTH: 'strideLength',
    GAIT_SPEED: 'gaitSpeed',
};
exports.USER_ROLES = {
    ADMIN: 'admin',
    CLINICIAN: 'clinician',
};
exports.TRACKING_STATUS = {
    ACTIVE: 'active',
    PAUSED: 'paused',
    COMPLETED: 'completed',
};
