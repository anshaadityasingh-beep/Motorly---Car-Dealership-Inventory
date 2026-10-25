# 06 — Frontend Dashboard: Browse, Search, Filter, Purchase (TDD)

Read `00_master_context.md` first. Prerequisite: prompt 05 complete.

## Goal
A beautiful, responsive dashboard where users browse vehicles, search/filter them, and purchase.

## Spec
- **Navbar:** brand, user name, role badge, logout. Mobile-friendly menu.
- **Dashboard:** responsive grid of `VehicleCard`s. Each card: image (fallback placeholder), make + model, category badge, formatted price (use `Intl.NumberFormat`; INR or USD — **ask me which**), stock indicator ("In stock: 3", "Only 1 left", "Sold out"), and a **Purchase** button that is **disabled when quantity is 0**.
- **Search & filters** bar: text search (make/model), category select, min/max price, sort. Debounce input (≈300 ms), reflect filters in the URL query string, "Clear filters" button, uses `GET /api/vehicles/search`.
- **Purchase flow:** click → optimistic or loading state on the button → success toast and card updates stock immediately; failure toast with server message (e.g. someone bought the last one) and refresh the card. Prevent double-click submits.
- **States:** skeleton loaders, empty state ("No vehicles match your filters"), error state with retry.
- **Pagination** (or load-more) matching the API.
- Hooks: `useVehicles(filters)`, `useDebounce`, `usePurchase`.
- Accessibility: labelled inputs, focus rings, `aria-disabled`/`disabled` correct, keyboard operable, sufficient contrast.

## TDD order
1. `VehicleCard`: renders data, shows "Sold out", Purchase disabled at 0, enabled otherwise, calls handler once.
2. `useDebounce` hook.
3. Filters component: emits correct params, clear resets, URL sync.
4. Dashboard: loading → data, empty state, error + retry, pagination.
5. Purchase flow: success updates stock & toast, failure shows message, double-click guarded.

## Definition of done
Tests green, works against the real API, looks great at 360px, 768px and 1280px.
