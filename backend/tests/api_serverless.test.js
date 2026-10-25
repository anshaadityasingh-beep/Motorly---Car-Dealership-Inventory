import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import http from 'http';
import request from 'supertest';
import mongoose from 'mongoose';
import { connectTestDB, closeTestDB } from './setup/db.js';
import handler from '../api/index.js';

describe('Vercel Serverless Handler (backend/api/index.js)', () => {
  let server;

  beforeAll(async () => {
    await connectTestDB();
    if (!global.mongoose) {
      global.mongoose = { conn: null, promise: null };
    }
    global.mongoose.conn = mongoose;
    server = http.createServer(handler);
  });

  afterAll(async () => {
    await closeTestDB();
  });

  it('should successfully handle GET /api/health through serverless handler', async () => {
    const res = await request(server).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
