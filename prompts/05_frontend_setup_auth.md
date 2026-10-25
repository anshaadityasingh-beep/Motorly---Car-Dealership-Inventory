# 05 — Frontend Scaffold, Design System & Auth UI (TDD)

Read `00_master_context.md` first. Prerequisite: backend prompts 01–04 complete (API is available at `VITE_API_URL`).

## Goal
Create `frontend/` (Vite + React + Tailwind), the API layer, auth state, routing, and the register/login screens.

## Steps
1. Scaffold with Vite (React, plain JS). Install: `react-router-dom`, `axios`, `tailwindcss` (+ its Vite/PostCSS setup per current docs), and dev deps `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`. Scripts: `dev`, `build`, `test`, `test:coverage`.
2. Structure:
```
frontend/src/
├── api/            (axiosClient with JWT interceptor, auth.api.js, vehicles.api.js)
├── context/        (AuthContext + useAuth)
├── components/     (ui/ for Button, Input, Card, Badge, Modal, Spinner, Toast)
├── pages/          (LoginPage, RegisterPage, DashboardPage, NotFoundPage)
├── routes/         (ProtectedRoute, AdminRoute)
├── hooks/ utils/ test/
```
3. `.env.example` with `VITE_API_URL`.
4. **Design tokens first:** define a cohesive visual identity in `tailwind.config` (brand colour palette, typography, radii, shadows). Dealership/automotive feel — modern, clean, confident. Dark and light friendly if easy. Build the shared `ui/` components before pages.
5. **AuthContext:** stores `user` + `token` (localStorage), exposes `login`, `register`, `logout`, `isAdmin`, restores session on load via `/api/auth/me`, auto-logout on `401`.
6. **Pages:** Login and Register with client-side validation, inline field errors, loading states, server error display, links between them. Redirect to dashboard on success.
7. **Routing:** `/login`, `/register`, `/` (protected dashboard placeholder), `*` NotFound. `ProtectedRoute` redirects unauthenticated users; `AdminRoute` blocks non-admins.

## TDD order (Vitest + RTL, mock the API layer)
1. UI components render/behave (Button disabled/loading, Input error).
2. AuthContext: login stores token, logout clears, session restore, 401 auto-logout.
3. LoginPage/RegisterPage: validation messages, successful submit, server error display.
4. ProtectedRoute / AdminRoute redirects.

## Definition of done
`npm test` green, `npm run dev` shows working login/register against the real backend, responsive on mobile widths.
