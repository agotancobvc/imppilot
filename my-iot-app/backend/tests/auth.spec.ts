// backend/tests/auth.spec.ts
import { afterAll, beforeAll, expect, test } from 'vitest';
import supertest from 'supertest';
import { createHTTPServer } from '../src/config/server.js';

let api: supertest.SuperTest<supertest.Test>;
let server: any;

beforeAll(async () => {
  server = createHTTPServer().httpServer.listen();
  api = supertest(server);
});

afterAll(async () => {
  server.close();
});

test('clinic login fails with bad code', async () => {
  const res = await api.post('/api/auth/clinic').send({ code: 'BAD' });
  expect(res.status).toBe(401);
});
