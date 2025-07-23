// backend/src/app.ts
import { createHTTPServer } from './config/server.js';
import { env } from './config/env.js';

(async () => {
  const { httpServer } = createHTTPServer();
  httpServer.listen(env.PORT, () =>
    console.log(`🚀 Backend listening on port ${env.PORT}`),
  );
})();
