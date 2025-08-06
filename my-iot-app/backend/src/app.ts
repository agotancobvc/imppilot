// backend/src/app.ts
import { createHTTPServer } from './config/server.js';
import { env } from './config/env.js';

(async () => {
  // Server is already started by createHTTPServer()
  createHTTPServer();
})();
