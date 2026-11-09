# EGUNSENTIA — Worklog 20

## Scope
Continue Phase 1 with crisis-queue lifecycle auditing and regression coverage.

## Finding
The crisis system queued additional crisis kinds when multiple world conditions were active. The queue was then advanced by `tickCrisis` / `resolveCrisis` without access to fresh `WorldInputs`. A queued water/food crisis could therefore become active after the underlying shortage had already recovered. Old or duplicated backlog entries were also not revalidated against current triggers.

## Changes
- `spawnCrisis()` now re-evaluates every queued kind against current world triggers on each spawn pass.
- Pending kinds are deduplicated and sorted by crisis severity.
- A queued condition that has recovered is removed rather than opened later.
- Pre-empted active crises are returned to the backlog only if their trigger remains live in the current world snapshot.
- Crisis resolution/failure no longer opens the next backlog entry without fresh world inputs; the next hourly spawn pass performs the revalidation.
- Added `scripts/crisis-backlog.test.mjs` with three regression tests for stale queue removal, live queue activation, and pruning while another crisis remains active.

## Verification
- Focused crisis/economy/diplomacy/research suites: **14/14 PASS**.
- Full `npm test`: **315 passed / 2 failed / 317 total**. Both remaining failures are import-time blockers in `scripts/game.test.mjs` because `node_modules/zustand/index.js` is absent. They are not assertion failures in the crisis changes.
- `node scripts/verify-canon.mjs`: **PASS** (65-panel registry, invariants, 167 references, preserved art, option catalogs).
- `node scripts/verify-art.mjs --structure`: **PASS (structural only)**; 167 references, 0 generated raster assets, 150 code-drawn, 17 preserved; all 23 asset groups still require real-art completion.
- TypeScript, ESLint, production build, and browser smoke remain unverified/blocked by the incomplete dependency installation. `node_modules/zustand`, `node_modules/vite`, `node_modules/typescript`, and `node_modules/@types/node` are present as empty directories.

## Phase status
Phase 1 remains open. Original uploaded archives remain unchanged. No release archive or deployment was created.
