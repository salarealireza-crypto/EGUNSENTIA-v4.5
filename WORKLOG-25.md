# EGUNSENTIA — Worklog 25

Date: 2026-11-08

## Scope
Audit recovery after network interruption and returning to a suspended browser tab.

## Finding
- The browser's Zustand-persisted campaign remains the local recovery copy, and startup attempts an account load/sync. However, after an account save failed while offline, there was no explicit retry on the browser `online` event. A player who regained connectivity without performing another game action could remain with a newer local campaign and an older account copy.
- Returning to a visible tab while online also did not trigger an account-save retry.

## Changes
- Added `attachSaveLifecycle()` in `src/lib/game/save-lifecycle.ts`.
- Wired lifecycle handling into `GameShell`: retry account sync on `online`, on returning to a visible tab while online, and retain best-effort writes on `visibilitychange` to hidden and `pagehide`.
- Listener teardown is explicit on component cleanup. Rejected/synchronous flush errors are contained so browser lifecycle events are not disrupted; `flushSave()` continues to own error reporting.
- Added lifecycle regression tests for reconnection, online tab resume, offline visibility behavior, page-hide best-effort, listener cleanup, and retry after a rejected attempt.

## Verification
- Focused save lifecycle tests: **2/2 PASS**.
- Full `npm test`: **327 passed / 2 failed / 329 total**. Both failures are import-time blockers in existing option-execution tests because `node_modules/zustand/index.js` is absent (`ERR_MODULE_NOT_FOUND`). No tests were removed or skipped.
- Canon verification: PASS (65-panel registry, invariants, 167 asset references, preserved art, option catalogs).
- Art verification: structural PASS only; 23 groups remain without real art (0 generated raster, 150 code-drawn, 17 preserved).
- `check:auth` was attempted but indeterminate because no development server's resolved `VITE_AUTH_ENABLED` value was available (exit 2).
- TypeScript, ESLint, production build, browser lifecycle integration, actual offline/online browser behavior, database round-trip, and multi-device sync remain unverified due incomplete dependencies or absent live services.

## Phase / release status
Phase 1 remains open. No release archive, Git commit, deployment, or production-readiness claim was created. Original uploaded archives remain unchanged.
