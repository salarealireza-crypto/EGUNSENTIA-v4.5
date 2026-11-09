# EGUNSENTIA — Worklog 18

## Scope
Continue Phase 1 with a deterministic resource-policy audit across day-based and hour-based time advancement.

## Finding
`simulateAdvance()` previously reduced a rationed resource's persisted `consumption` field by 8% on every simulated day. This compounded the reduction (0.92^n) and permanently rewrote the baseline, so long skips could make consumption approach the one-unit floor regardless of the intended policy. The hour-based `runClockAdvance()` path did not apply rationing at all, producing different resource outcomes depending on how the player advanced time.

## Changes
- Added pure `resourceConsumptionForTick()` in `src/lib/game/time.ts`. Ration policy applies a fixed 8% reduction for a tick, with the existing minimum of one unit, without mutating the saved baseline.
- Updated day-based `tickResources()` to use the shared effective-consumption helper.
- Updated hour-based `runClockAdvance()` in `src/lib/game/store.ts` to use the same helper, aligning both time-advance paths.
- Added `scripts/resource-policy.test.mjs` with tests for non-compounding rationing, normal policy, and the minimum consumption floor.

## Verification
- New resource-policy tests: **3/3 PASS**.
- Focused economy, faction diplomacy, and research tests: **11/11 PASS**.
- Full `npm test`: **310 passed / 2 failed / 312 total**. Both failures are still blocked at import time by missing `node_modules/zustand/index.js` (the two option-execution tests); no new failure introduced.
- `node scripts/verify-canon.mjs`: **PASS**.
- `node scripts/verify-art.mjs --structure`: **PASS (structural only)** — 167 references, 0 generated raster assets, 150 code-drawn, 17 preserved; all 23 groups still need real-art completion.
- `npm run typecheck`: **BLOCKED** because `@types/node` and Vite client type definitions are absent.
- ESLint and Vite executables remain absent from the partial dependency tree; lint and production build are not verified.

## Phase status
Phase 1 remains open. No full dependency restoration, production build, deployment, or release archive is claimed. Original uploaded ZIP archives remain unchanged.
