# EGUNSENTIA — Worklog 19

## Scope
Continue Phase 1 with long-campaign time progression and age-boundary regression coverage.

## Finding
`simulateAdvance()` called `tickChildren()` only on the final day of a multi-day advance. `tickChildren()` itself aged living children only when the current day index was an exact multiple of 365. A skip crossing multiple year boundaries therefore processed at most one birthday, and a skip ending between year boundaries could miss birthdays crossed earlier in the interval entirely.

## Changes
- Changed `simulateAdvance()` to process child aging on every simulated day.
- Removed the final-day-only guard from `tickChildren()`; the year-boundary check remains the single authority for aging.
- Added `scripts/long-campaign-time.test.mjs` with regression tests for a 730-day advance and an 800-day advance. Living children age once per crossed year; dead children do not age.

## Verification
- Long-campaign time regression tests: **2/2 PASS**.
- Full `npm test`: **312 passed / 2 failed / 314 total**. Both remaining failures occur before test execution when importing `src/lib/game/store.ts`, because the installed `node_modules/zustand/index.js` package file is absent. No new failure was introduced.
- `node scripts/verify-canon.mjs`: **PASS** (65-panel registry, invariants, 167 references, preserved art, option catalogs).
- `node scripts/verify-art.mjs --structure`: **PASS (structural only)**; 167 references, 0 generated raster assets, 150 code-drawn, 17 preserved; all 23 asset groups still require real-art completion.
- TypeScript, ESLint, and production build remain unverified/blocked by the incomplete dependency tree. No claim of production readiness.

## Phase status
Phase 1 remains open. Original uploaded archives remain unchanged. No release archive or deployment was created.
