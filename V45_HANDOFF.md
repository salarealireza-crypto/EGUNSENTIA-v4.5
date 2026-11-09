# EGUNSENTIA V4.5 DEMO — HANDOFF

Read `V45_PROGRESS.md` first, then `GROK_PROMPT_REMAINING.txt` (the task).

## Conventions
- Panel registry `src/lib/platform/registry.ts`; options `src/lib/platform/options/catalog.ts`; audit `src/lib/platform/audit.ts` (+ `leak.ts`).
- Simulation: `src/lib/game/p4-simulation.ts` (state + API) over pure modules in `src/lib/game/sim/*.ts`. These import each other with explicit `.ts` extensions so plain Node can run them. Keep state additive; always pass saves through `normalizeP4`.
- Store entry points: `advanceHours`, `advanceUntil`, `runClockAdvance` (store.ts), `worldInputsOf(state)`.
- Tests: `npm run test:game`. Art check: `npm run verify:art -- --structure`. Canon: `npm run verify:canon`.

## Preserve
All V4.1 code, canon, saves and preserved art. No earlier knight artwork.
