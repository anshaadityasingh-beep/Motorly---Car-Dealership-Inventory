# 07 — Frontend Admin Panel (TDD)

Read `00_master_context.md` first. Prerequisite: prompt 06 complete.

## Goal
Admin-only UI to add, update, delete and restock vehicles.

## Spec
- Route `/admin` guarded by `AdminRoute`; navbar link visible only to admins. Normal users never see admin controls, and hitting `/admin` redirects them.
- **Inventory table** (cards on mobile): image thumb, make, model, category, price, stock, actions (Edit, Restock, Delete).
- **Add / Edit vehicle** in a Modal (shared `VehicleForm`): fields make, model, category (select from the shared list), price, quantity, optional year and imageUrl. Client-side validation mirroring backend rules; show server field errors.
- **Restock** small dialog with quantity input (≥ 1).
- **Delete** with a confirmation dialog stating the vehicle name; toast on success/failure.
- List refreshes after every mutation; buttons show loading states and prevent double submits.
- Hooks: `useVehicleMutations` (create, update, delete, restock) built on the API layer.

## TDD order
1. `VehicleForm`: validation per field, pre-fill in edit mode, submit payload shape.
2. Admin table: renders rows, actions call the right handlers.
3. Confirm-delete dialog: cancel does nothing, confirm calls delete once.
4. Restock dialog validation.
5. `AdminRoute`/navbar visibility for user vs admin.
6. Integration-style test: add vehicle → appears in list; edit → updates; delete → removed (mock API).

## Definition of done
Tests green; admin flows work against the real backend using the seeded admin account.
