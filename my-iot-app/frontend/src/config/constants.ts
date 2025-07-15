export const APP_CONFIG = {
    APP_NAME: 'Gait Metrics System',
    VERSION: '1.0.0',
    API_TIMEOUT: 10000,
    WEBSOCKET_RECONNECT_ATTEMPTS: 5,
    WEBSOCKET_RECONNECT_DELAY: 3000,
    METRICS_BUFFER_SIZE: 100,
    CHART_UPDATE_INTERVAL: 100,
  };
  
  export const GAIT_METRICS = {
    STEP_LENGTH: 'stepLength',
    STEP_TIME: 'stepTime',
    STEP_CADENCE: 'stepCadence',
    STANCE_TIME: 'stanceTime',
    STRIDE_TIME: 'strideTime',
    STRIDE_LENGTH: 'strideLength',
    GAIT_SPEED: 'gaitSpeed',
  } as const;
  
  export const USER_ROLES = {
    ADMIN: 'admin',
    CLINICIAN: 'clinician',
  } as const;
  
  export const TRACKING_STATUS = {
    ACTIVE: 'active',
    PAUSED: 'paused',
    COMPLETED: 'completed',
  } as const;
  