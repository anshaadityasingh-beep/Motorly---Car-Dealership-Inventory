# 00 — Master Context (load this in EVERY Antigravity session / set as workspace rules)

You are helping me build a **TDD Kata: Car Dealership Inventory System**. It is an internship assignment that will be evaluated on code quality, test discipline and git history, and it will also go on my resume. Follow everything below in every task.

## Stack (do not deviate; ask me before adding anything else)
- **Backend:** Node.js + Express, **plain JavaScript (CommonJS or ESM — pick ESM and stay consistent)**, Mongoose, MongoDB Atlas, JWT (`jsonwebtoken`), `bcryptjs`, `express-validator` (or `zod`), `cors`, `dotenv`, `helmet`.
- **Backend tests:** Jest + Supertest + `mongodb-memory-server` (tests only; the real app must connect to MongoDB Atlas).
- **Frontend:** React (Vite), React Router, Tailwind CSS, HTML5/CSS3, Axios (or fetch).
- **Frontend tests:** Vitest + React Testing Library + `@testing-library/user-event` + `jsdom`.
- **Deploy:** Vercel (two projects: `backend` and `frontend`).

## Repo layout
```
/ (repo root)
├── backend/
├── frontend/
├── prompts/            (these prompt files)
├── README.md
└── PROMPTS.md          (raw AI chat logs — I maintain this, never summarize)
```

## Product requirements (summary of the assignment)
- Auth: `POST /api/auth/register`, `POST /api/auth/login`, JWT-protected endpoints.
- Vehicles (protected): `POST /api/vehicles`, `GET /api/vehicles`, `GET /api/vehicles/search` (make, model, category, price range), `PUT /api/vehicles/:id`, `DELETE /api/vehicles/:id` (**admin only**).
- Inventory (protected): `POST /api/vehicles/:id/purchase` (decrease quantity), `POST /api/vehicles/:id/restock` (increase quantity, **admin only**).
- Vehicle fields: unique id, make, model, category, price, quantity in stock.
- Frontend SPA: register/login, dashboard of vehicles, search/filter, Purchase button (disabled at quantity 0), admin UI to add/update/delete (and restock) vehicles. Visually polished, responsive, great UX.

## Decisions already made
- `register` ALWAYS creates a role `user`. Admins are created only via a seed script (`npm run seed:admin`) using `ADMIN_EMAIL` / `ADMIN_PASSWORD` env vars. Never accept `role` from the request body.
- Roles: `user`, `admin`.
- Consistent error shape: `{ "message": "...", "errors": [optional field errors] }` with correct HTTP codes (400, 401, 403, 404, 409, 422 as appropriate).
- Never return password hashes. Never hardcode secrets; use `.env` + `.env.example`.

## NON-NEGOTIABLE: TDD workflow
For every feature, work in **small Red → Green → Refactor cycles**:
1. **RED:** write failing test(s) first. Run them, confirm they fail for the right reason. Commit: `test: <what>` .
2. **GREEN:** write the minimum code to pass. Run tests. Commit: `feat: <what>`.
3. **REFACTOR:** clean up with tests green. Commit: `refactor: <what>`.
Never write implementation before its test. Never batch a whole feature into one commit. Aim for high coverage with meaningful assertions (happy path, validation errors, auth failures, edge cases).

## Git rules
- Conventional commit prefixes: `feat`, `fix`, `test`, `refactor`, `docs`, `chore`.
- Commit frequently, with a message body explaining what the AI generated vs. what was changed by hand.
- **Every commit where AI helped must end with** (two blank lines before the trailer):
```
Co-authored-by: Antigravity <AI@users.noreply.github.com>
```

## Code quality rules
- SOLID: layered backend — `routes → controllers → services → models`. Controllers are thin; business logic lives in services; services are unit-testable.
- Meaningful names, small functions, JSDoc comments on public functions, no dead code, no `console.log` leftovers.
- Centralised error-handling middleware, async wrapper for handlers, config in one module.
- Frontend: small reusable components, custom hooks for data, an `api` service layer, an `AuthContext`, protected and admin-only routes.

## How to work with me
- Do ONE prompt file's scope per session. Do not start work from other prompt files.
- At the end of each task print: files created/changed, test results, and the commands to run them.
- If something is ambiguous or needs a new dependency not listed above, STOP and ask me.
