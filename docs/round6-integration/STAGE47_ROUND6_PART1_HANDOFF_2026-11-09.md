# Round 6 Part 1 Handoff — CP23

## Parent and integrity
- Parent: CP22 Round 5 partial checkpoint; immutable.
- Parent archive: `EGUNSENTIA-STAGE47-POST-CP21-ROUND5-CHARACTER-LORE-PARTIAL-CP22-2026-11-09.zip`.
- Parent SHA-256: `656c2352bcadf7a6597fb7c857a6e9804541691f82d517df930b9531262140a3`.
- CP22 ZIP integrity and sidecar were verified before extraction; 867 files extracted to a new working copy.

## Scope completed
- Connected six Round 5 source-backed relationship notes to `CastCard`, CastPanel display/search, Household roster display, and AL compact-state context.
- Preserved separation between reference lore and live relationship/consent/disclosure state.
- Confirmed the six profiles appear in shared CAST live-presence projection.
- Added a pure-function test from Private Relations request to Event Ledger and read-only Day Replay.
- No new missing-person case, relationship state, event semantics, resource rule, or save schema was invented.

## Source files changed
- `src/lib/game/types.ts`
- `src/lib/game/kernel.ts`
- `src/lib/game/play.ts`
- `src/components/game/CastPanel.tsx`
- `src/components/game/V45PanelBody.tsx`
- `scripts/round6-character-integration.test.mjs`

## Verification
- Round 6 integration tests: 5/5 PASS.
- Focused combined suite: 62/62 PASS.
- Runnable script tests excluding `scripts/game.test.mjs`: 467/467 PASS across 57 files.
- Canon verifier: PASS.
- Red Claw verifier: PASS with 14 existing warnings.
- Full `npm test`: 467 pass, one suite import-blocked by missing `zod`.
- Typecheck blocked by missing `@types/node` and `vite/client`.
- Build blocked: `vite` not installed (`spawn vite ENOENT`).
- Lint blocked: `eslint` not installed.
- `play.ts` runtime import blocked by missing `@tanstack/react-start`.
- No PostgreSQL, save commit/reload/restart, browser QA, responsive QA or production verification.

## Exact resume point
Round 6 is still in progress. Next bounded work should continue the integration matrix without broad rewrite:
1. Restore exact locked dependencies in a DNS-enabled environment (`npm ci --no-audit --no-fund`; do not edit lockfile or use an unverified mirror).
2. Run full test suite, semantic typecheck, lint and production build.
3. Execute compact AL projection against installed runtime and verify server-side AL request context; validator remains authoritative.
4. When a real isolated persistent backend is available, test Store action → Event Ledger → save commit → reload → Day Replay.
5. Browser-test Cast, Household, Planner, Messages, Evening Hall, Calendar, Private Relations and Day Replay with authoritative persisted state.
6. Keep Investigation Register separate unless an authoritative missing-person source is found; absences alone are not missing-person records.

## Commands
```bash
node --experimental-strip-types --import ./scripts/register-ts.mjs --test scripts/round6-character-integration.test.mjs
node --experimental-strip-types --import ./scripts/register-ts.mjs --test scripts/round6-character-integration.test.mjs scripts/private-relations.test.mjs scripts/red-claw-household.test.mjs scripts/gate2-round3.test.mjs scripts/gameplay-integration.test.mjs
node --experimental-strip-types --import ./scripts/register-ts.mjs --test $(find scripts -type f -name '*.test.mjs' ! -name 'game.test.mjs' | sort)
node scripts/verify-canon.mjs
node --experimental-strip-types --import ./scripts/register-ts.mjs scripts/verify-red-claw-household.mjs
npm test
npm run typecheck
npm run lint
npm run build
```

Temporary `.grok/app-env.json` with only `VITE_AUTH_ENABLED=true` may be needed for app-env tests; create only for the test run and remove afterward. Do not package it. No `node_modules`, `.env`, secrets or credentials belong in the checkpoint.

## Status
`Round 6 Part 1 = source-implemented + unit-tested; full integration remains partial/blocked.` Round 7 and later have not started.
