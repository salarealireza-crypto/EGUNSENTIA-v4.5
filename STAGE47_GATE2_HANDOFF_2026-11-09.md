# Gate 2 Round 1 — Recovery Handoff

Current checkpoint: **CP5 — Gate 2 Gameplay Integration Round 1**.

## Resume from

Extract `EGUNSENTIA-STAGE47-GATE2-GAMEPLAY-CP5-2026-11-09.zip` into a new working directory. Do not resume from CP4 unless intentionally rolling back. Keep the original Stage 46, CP1–CP4 and CP5 archives immutable.

## Completed in CP5

- Planner panel routing: panel 12 = Planner; panel 46 = World Time.
- NPC availability from live CAST schedule is used in Planner.
- Appointments check availability through the full interval and prevent same-NPC overlap.
- Gate crisis records retain the affected Gate IDs.
- Invalid crisis choices do not close active crises.
- Crisis outcome table updates stocks/Morale; Gate crisis results update only the affected Gate.
- Crisis results are recorded in crisis history and Chronicle notes.
- New gameplay integration test file added.

## Test state

- 376/376 script tests passed, excluding `scripts/game.test.mjs` because the missing Zod dependency prevents it from loading.
- Targeted gameplay tests: 14/14 passed.
- 86 MJS syntax checks and 131 TS/TSX syntax transpile checks passed.
- Canon verification passed.
- `npm ci` remains blocked by registry DNS (`EAI_AGAIN`); TypeScript semantic typecheck and production build remain blocked.

## Next exact task group

1. Independent Event Ledger integration for crisis effects, with stable event IDs and duplicate-application prevention.
2. Ceremony workflow (schedule, attendees, availability, cost, outcome, history).
3. Missing-person investigations as a stateful case lifecycle; keep UNKNOWN facts unresolved.
4. Immutable Day Replay from event timeline data.
5. Council typed effects and no-double-spend tests.
6. Extend tests across UI receipt and persistent-save boundaries when a test DB/runtime can be installed.

## Important constraints

- Do not put secrets into ZIP, `.env.example`, `VITE_*`, logs or browser code.
- Keep `.grok/app-env.json` local and excluded from the checkpoint archive.
- Do not claim Build/Typecheck/Browser/Production verification.
- Do not invent canon, named characters, relationships or mystery resolutions.
- Morale delta table values are provisional game balancing, not canon; review before tuning the full economy.
