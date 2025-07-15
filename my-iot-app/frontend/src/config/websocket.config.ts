export const WEBSOCKET_CONFIG = {
    url: process.env.REACT_APP_WS_URL || 'ws://localhost:3001',
    reconnectAttempts: 5,
    reconnectDelay: 3000,
    heartbeatInterval: 30000,
    timeout: 10000,
    events: {
      CONNECT: 'connect',
      DISCONNECT: 'disconnect',
      GAIT_METRICS: 'gaitMetrics',
      TRACKING_STARTED: 'trackingStarted',
      TRACKING_STOPPED: 'trackingStopped',
      SUBSCRIBE: 'subscribe',
      UNSUBSCRIBE: 'unsubscribe',
      ERROR: 'error',
    },
  } as const;
  
  export const WEBSOCKET_ERRORS = {
    CONNECTION_FAILED: 'Failed to connect to sensor',
    AUTHENTICATION_FAILED: 'Authentication failed',
    SUBSCRIPTION_FAILED: 'Failed to subscribe to patient data',
    TIMEOUT: 'Connection timeout',
  } as const;
  