# EGUNSENTIA — Worklog 43

Date: 2026-11-08

## Scope
Prevent repeated executions of the same option from collapsing separate delayed consequences into one queue item.

## Finding and changes
- Delayed consequence IDs were derived only from the catalog option ID. Repeating an option could create two queue records with the same ID.
- Queue resolution removes entries by ID; duplicate IDs therefore caused one resolution to remove every duplicate while firing only one outcome.
- `runOption()` now supplies a monotonically incremented execution number (`turnCount + 1`) to the effect applier. Every queued consequence ID is now suffixed with the execution number.
- Added regression coverage for repeated execution and exactly-once delayed resolution.

## Verification
- `scripts/queued-consequence-identity.test.mjs`: 2/2 PASS.
- Full suite after Stage 43: 381 PASS / 2 blocked / 383 total. Both blocked tests fail before test assertions because Zustand is absent; no tests removed or skipped.
- Canon verification: PASS (65-panel registry, invariants, 167 references and option catalogs).
- Art structure: structural PASS only; all 23 groups remain unfilled with production raster assets.
- TypeScript, ESLint, Vite production build, browser E2E and live database checks remain blocked/unverified because dependencies and external services are unavailable.

## Result
Each repeated command keeps its own delayed consequence and its own eventual resolution. Phase 1/2 remain open.
