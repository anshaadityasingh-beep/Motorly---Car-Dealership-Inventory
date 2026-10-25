# 03 — Backend Vehicles CRUD & Search (TDD)

Read `00_master_context.md` first. Prerequisite: prompt 02 complete.

## Goal
Protected vehicle endpoints with validation, search/filtering, and admin-only delete.

## Spec
- **Vehicle model:** `make`, `model`, `category` (enum: Sedan, SUV, Hatchback, Coupe, Convertible, Truck, Van, Electric — keep the list in one constants file), `price` (number ≥ 0), `quantity` (integer ≥ 0, default 0), optional `imageUrl`, optional `year`, timestamps. The Mongo `_id` serves as the unique ID; expose it as `id` in JSON.
- All endpoints require `authenticate`.
- `POST /api/vehicles` — add a vehicle (**admin only**: the frontend admin UI creates vehicles; enforce `403` for normal users). `201` + created vehicle.
- `GET /api/vehicles` — list all available vehicles (quantity > 0 by default; support `?includeOutOfStock=true` so the UI can show sold-out items with a disabled Purchase button). Pagination: `page`, `limit` with `{ data, page, limit, total, totalPages }`.
- `GET /api/vehicles/search` — query params: `make`, `model`, `category`, `minPrice`, `maxPrice`, `sort` (price asc/desc, newest), plus the same pagination. Case-insensitive partial match for make/model (escape regex input!), exact match for category, validate numeric ranges (`minPrice > maxPrice` → `400`). **Register this route BEFORE `/:id`.**
- `PUT /api/vehicles/:id` — update details (**admin only**), partial updates allowed, same validation, `404` when missing, `400` for invalid ObjectId.
- `DELETE /api/vehicles/:id` — **admin only**, `204` on success, `404` when missing.
- Layering: routes → controller → `vehicle.service.js` → model. Query-building for search lives in its own small, unit-tested function.

## TDD order
1. Model validation (each field rule).
2. Search query builder unit tests (every filter combo, regex escaping, invalid ranges).
3. Create: admin ok, user `403`, unauthenticated `401`, invalid body `422/400`.
4. List: default hides out-of-stock, `includeOutOfStock`, pagination.
5. Search endpoint: each filter, combined filters, sorting, empty result, route-order regression test.
6. Update: success, partial, invalid id, not found, user `403`.
7. Delete: admin ok, user `403`, not found.
8. Refactor and confirm coverage.

## Definition of done
All tests green, coverage for vehicle code ≥ 90%, final summary lists every endpoint with example request/response.
