# 09 — Deployment on Vercel (Backend + Frontend + Atlas)

Read `00_master_context.md` first. Prerequisite: everything works locally and all tests pass.

## Goal
A live, working deployment. I will do the dashboard clicks myself; you prepare the code/config and give me exact step-by-step instructions.

## Backend (Express on Vercel serverless)
1. Add `backend/api/index.js` that imports the Express `app` and exports it as the default handler; ensure `connectDB()` is awaited per request using the **cached connection** (no new connection on every invocation).
2. Add `backend/vercel.json` rewriting all routes (`/(.*)`) to `/api`.
3. CORS: allow only `FRONTEND_URL` (and `http://localhost:5173` in dev). Make sure preflight `OPTIONS` works.
4. `server.js` stays for local dev only. Verify `GET /api/health` is reachable via the serverless handler.
5. Env vars needed on Vercel: `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `FRONTEND_URL`, `NODE_ENV=production`.

## MongoDB Atlas (give me exact steps)
- Create free M0 cluster, DB user, and Network Access `0.0.0.0/0` (required for Vercel's dynamic IPs; explain the tradeoff and mention using a strong password), get the connection string, set DB name.
- Tell me how to run `seed:admin` once against the production DB safely (locally, using the production URI in a temporary env var, never committed).

## Frontend (Vite on Vercel)
1. Add `frontend/vercel.json` with an SPA rewrite so deep links (`/admin`, `/login`) don't 404.
2. Env var `VITE_API_URL` pointing to the deployed backend URL.
3. Confirm production build works with `npm run build && npm run preview`.

## Vercel project setup (instructions for me)
- Import the same GitHub repo twice: Project A root directory `backend`, Project B root directory `frontend`, correct framework preset, env vars added, redeploy order (backend first, then set `VITE_API_URL`, deploy frontend, then update backend `FRONTEND_URL` and redeploy backend).

## Post-deploy smoke test checklist
Register → login → browse → search → purchase → logout → login as admin → add/edit/restock/delete a vehicle. Provide a short troubleshooting list (CORS errors, 404 on refresh, cold-start DB timeouts, missing env vars).

## Definition of done
Both URLs live, smoke test passes, URLs added to the README.
