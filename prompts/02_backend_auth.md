# 02 — Backend Authentication (TDD)

Read `00_master_context.md` first. Prerequisite: prompt 01 is complete and green.

## Goal
Users can register and log in; JWT secures endpoints; role-based access control exists for admin-only routes.

## Spec
- **User model:** `name`, `email` (unique, lowercase, validated), `password` (hashed with bcrypt, `select: false`), `role` (`user` | `admin`, default `user`), timestamps.
- `POST /api/auth/register` — body `{ name, email, password }`. Validate (email format, password ≥ 8 chars incl. a number). `201` returns `{ user, token }` (no password). Duplicate email → `409`. Ignore/reject any `role` in body.
- `POST /api/auth/login` — body `{ email, password }`. Success `200 { user, token }`. Wrong credentials → `401` with a generic message (don't reveal which part was wrong).
- `GET /api/auth/me` (protected) — returns current user. Useful for the frontend.
- **Middleware:** `authenticate` (verifies `Authorization: Bearer <token>`, loads user, `401` on missing/invalid/expired token) and `authorizeRoles(...roles)` (`403` when role not allowed).
- **Seed script** `scripts/seed-admin.js` + `npm run seed:admin`: creates/updates an admin from `ADMIN_EMAIL` / `ADMIN_PASSWORD`. Idempotent.
- Structure: `auth.routes → auth.controller → auth.service → User model`; token helpers in `utils/token.js`.

## TDD order (each bullet = a Red/Green cycle with its own commits)
1. User model: hashing on save, password not selected by default, unique email, default role.
2. Token util: sign/verify, expiry.
3. Register: success, validation failures, duplicate email, role injection ignored.
4. Login: success, wrong password, unknown email, response never leaks hash.
5. `authenticate` middleware: no header, malformed header, bad token, expired token, valid token.
6. `authorizeRoles`: user blocked, admin allowed.
7. `/me` endpoint.
8. Seed script logic as a testable service function.
9. Refactor pass: remove duplication, ensure thin controllers.

## Definition of done
All auth tests pass, coverage for auth code ≥ 90%, README-ready curl examples printed in your final summary.
