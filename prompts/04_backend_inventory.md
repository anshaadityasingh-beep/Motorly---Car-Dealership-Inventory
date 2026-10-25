# 04 — Backend Inventory: Purchase & Restock (TDD)

Read `00_master_context.md` first. Prerequisite: prompt 03 complete.

## Goal
Safe stock changes with no overselling, even under concurrent requests.

## Spec
- `POST /api/vehicles/:id/purchase` — any authenticated user. Body optional `{ quantity }` (default 1, integer ≥ 1). Decrements stock **atomically** using a single conditional update, e.g. `findOneAndUpdate({ _id, quantity: { $gte: qty } }, { $inc: { quantity: -qty } }, { new: true })` — NOT read-then-write. If it fails: `404` if the vehicle doesn't exist, `409` (or `400`) with a clear "insufficient stock" message if it does. Returns the updated vehicle.
- `POST /api/vehicles/:id/restock` — **admin only**. Body `{ quantity }` (integer ≥ 1, sensible upper bound such as 10000). Increments atomically with `$inc`. Returns the updated vehicle.
- Logic lives in `inventory.service.js` with `purchaseVehicle(id, qty)` and `restockVehicle(id, qty)`.
- (Nice-to-have, only if simple) a `Purchase` record `{ user, vehicle, quantity, priceAtPurchase, createdAt }` — **ask me before adding**.

## TDD order
1. Service unit tests: purchase decrements, purchase to exactly zero, purchase when 0 stock, qty larger than stock, invalid qty (0, negative, float, string), unknown id.
2. **Concurrency test:** stock = 5, fire 10 parallel purchases via `Promise.all`; assert exactly 5 succeed and final stock is 0.
3. Restock service: increments, invalid qty, unknown id.
4. Endpoint tests: unauthenticated `401`, user purchase ok, user restock `403`, admin restock ok, invalid ids.
5. Refactor shared validation (quantity validator reused).

## Definition of done
All tests green including the concurrency test; overall backend coverage report shown; list final endpoint table in the summary.
