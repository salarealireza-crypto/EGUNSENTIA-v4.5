# EGUNSENTIA — Worklog 22

## Scope
Unify daily continuity side effects between day-based skips and hour-level clock advancement.

## Finding
`simulateAdvance()` applied daily household, critical calendar, child-age, weekly relic, radio, and trade-reminder logic for every crossed day. `runClockAdvance()` advanced the P4 clock and fractional resource balances but skipped those legacy daily systems when the hour-level clock crossed midnight. This made game state depend on which time-advance command the player used.

## Changes
- Extracted `advanceDailyContinuity()` in `src/lib/game/time.ts` for non-resource daily side effects.
- Reused it from `simulateAdvance()` so day-based and hour-based paths share the same daily continuity rules.
- Wired `runClockAdvance()` to process each crossed day using a cloned `SimState`, then persist the resulting calendar, household, kin, child, relic/find, sortie, faction-vault, film, radio, trade, and world changes.
- Kept resource growth in the existing fractional hour-based calculation; the shared helper does not tick resources, avoiding duplicate consumption/production.
- Added `scripts/hourly-daily-continuity.test.mjs` for critical calendar activation and birthday boundary behavior.

## Verification
- New hourly continuity + long-campaign + trade reminder focused tests: **7/7 PASS**.
- `npm test`: **320 passed / 2 failed / 322 total**. Both failures are the known import-time blockers in the two option-execution tests because `node_modules/zustand/index.js` is absent. No tests were removed or skipped.
- Canon verification: **PASS** (65-panel registry, invariants, 167 asset references, option catalogs).
- Art verification: **structural PASS only**; all 23 art groups still need real-art completion (0 generated raster assets).
- TypeScript, ESLint, production build, and browser smoke remain unverified/blocked because the corresponding executables/dependencies are absent.

## Phase status
Phase 1 remains open. Original uploaded archives remain unchanged. No release archive, Git commit, or deployment was created.
