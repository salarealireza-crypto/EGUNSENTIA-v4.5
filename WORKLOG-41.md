# EGUNSENTIA — Worklog 41

Date: 2026-11-08

## Scope
Align option time costs with the player-facing command deck and account for actual elapsed time during Wait interruptions.

## Changes
- Validate option `costs.hours` as a safe integer from 0 through 24 before execution.
- Record declared work-hour costs for non-Wait actions in the P4 spend ledger and receipt.
- Wait actions now advance their full declared duration rather than a four-hour clamp; interrupted waits count only `reachedMin - from` as elapsed hours.
- Added a time-cost chip to command cards.

## Verification
- `scripts/option-costs.test.mjs`: 4/4 PASS.
- Full suite after Stage 41: 375 PASS / 2 blocked / 377 total. Both blocked imports require missing `zustand` from `src/lib/game/store.ts`.
- No tests removed or skipped. TypeScript/build/browser verification remains blocked by missing dependencies.

## Result
Player-visible option durations and time accounting now agree; ordinary work-hour costs are recorded without silently advancing the world clock.
