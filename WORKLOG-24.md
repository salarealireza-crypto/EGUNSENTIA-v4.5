# EGUNSENTIA — Worklog 24

Date: 2026-11-08

## Scope
Audit campaign save ordering, remote-save acknowledgement, new-campaign overwrite safety, and imported-save validation.

## Findings
- The remote persistence action can return `{ ok: false, error }` for a rejected payload without throwing. The latest-save queue previously treated any resolved promise as a successful write, so the caller could not distinguish a rejected save from a stored one.
- A queued snapshot superseded by a newer snapshot resolved normally, and `flushSave()` updated its in-memory saved timestamp before the remote save completed. This could label a skipped or failed snapshot as saved.
- The New Campaign action wrote directly through `persistSave`, bypassing the shared serialized queue. A concurrent older write could therefore race with and overwrite the new campaign.
- Imported JSON was passed directly to `loadSnapshot()` without checking the byte limit, root shape, collections, or nested-data constraints.

## Changes
- `createLatestSaveQueue()` now detects explicit `{ ok: false }` responses and rejects them with the server's error message.
- The queue returns whether its snapshot was the latest successfully written revision. Superseded queued/in-flight revisions return `false`.
- `flushSave()` now marks the remote save timestamp only after the latest queued write succeeds.
- New Campaign now uses `flushSave()` and the same serialized queue as all other campaign writes.
- Added `parseImportedSave()` with a 1.4 MB limit, JSON/root/version checks, required world root, optional P4/summary/counter checks, collection shape validation, and existing depth/node/prototype-safety inspection. It allows absent legacy collections for `loadSnapshot()` to fill from current defaults.
- TitleScreen validates imported files before passing them to `loadSnapshot()`.
- Added queue ordering/acknowledgement and imported-save regression tests.

## Verification
- Save queue + save validation focused tests: **15/15 PASS**.
- Full `npm test`: **325 passed / 2 failed / 327 total**. Both failures remain import-time blockers in the existing option-execution tests because `node_modules/zustand/index.js` is missing. No tests were skipped or removed.
- `node --experimental-strip-types --check src/lib/game/save-queue.ts`: PASS.
- `node --experimental-strip-types --check src/lib/game/play.ts`: PASS.
- `node --check src/lib/game/save-validation.mjs`: PASS.
- Canon verification: PASS (65-panel registry, invariants, 167 asset references, preserved art, option catalogs).
- Art verification: structural PASS only; 23 groups remain unfilled with real art (0 generated raster, 150 code-drawn, 17 preserved).
- TypeScript check remains blocked by missing `@types/node` and `vite/client` type definitions.
- ESLint remains unavailable (`eslint: not found`). Production build remains unavailable (`vite: spawn ENOENT`). Browser, localStorage, account DB round-trip, and multi-device tests were not run.

## Phase / release status
Phase 1 remains open. Original uploaded archives remain unchanged. No release archive, Git commit, deployment, or production-readiness claim was created.
