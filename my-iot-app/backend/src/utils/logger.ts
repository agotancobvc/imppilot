// backend/src/utils/logger.ts
// Simple wrapper – you can replace with pino or winston.
export const logger = {
    info: console.log,
    warn: console.warn,
    error: console.error,
  };
  