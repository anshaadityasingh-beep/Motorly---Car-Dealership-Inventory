# 01 — Backend Scaffold, Config & Test Harness

Read `00_master_context.md` first and follow it strictly.

## Goal
Create the `backend/` project skeleton, DB connection, error handling and a working Jest + Supertest harness. No feature logic yet.

## Steps
1. `git init` (if needed), add root `.gitignore` (node_modules, .env, coverage, dist, .vercel). Commit: `chore: initialise repository`.
2. Create `backend/` with `npm init`, ESM (`"type": "module"`), install runtime deps (express, mongoose, dotenv, cors, helmet, jsonwebtoken, bcryptjs, express-validator) and dev deps (jest, supertest, mongodb-memory-server, nodemon, cross-env).
3. Structure:
```
backend/
├── src/
│   ├── app.js            (builds & exports the Express app — NO listen here)
│   ├── server.js         (connects DB, calls app.listen)
│   ├── config/           (env.js, db.js)
│   ├── routes/ controllers/ services/ models/ middleware/ utils/
├── tests/
│   ├── setup/            (in-memory Mongo start/stop/clear helpers)
│   └── unit/ integration/
├── scripts/              (seed-admin.js — later)
├── .env.example
└── package.json
```
4. Scripts: `start`, `dev`, `test`, `test:watch`, `test:coverage`. Configure Jest for ESM and coverage thresholds (aim ≥ 85% lines for `src/`).
5. `config/env.js` validates required env vars (`MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `FRONTEND_URL`, `PORT`) and fails fast.
6. `config/db.js`: `connectDB()` that **caches the connection** (needed for Vercel serverless later).
7. Middleware: `errorHandler`, `notFound`, `asyncHandler`, and a small `ApiError` class.

## TDD for this task
- RED: write tests for `GET /api/health` → `200 { status: "ok" }`, unknown route → `404` with the standard error shape, and a thrown `ApiError` → mapped status/message.
- GREEN → REFACTOR with commits as described in the master context.
- Provide a reusable test setup: start `mongodb-memory-server` once per suite, clear collections between tests, disconnect after.

## Definition of done
`npm test` passes, health endpoint works, `npm run dev` connects to the Atlas URI in `.env`, `.env.example` committed, commits follow Red/Green/Refactor.
