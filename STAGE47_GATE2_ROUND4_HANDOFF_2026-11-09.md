# EGUNSENTIA — Gate 2 Round 4 Handoff (CP8)

## Starting point
Use `EGUNSENTIA-STAGE47-GATE2-ROUND4-CP8-2026-11-09.zip` as the next working base. Keep CP7 immutable.

## Completed
- Generic option actions now use a persisted per-option/per-world-minute idempotency key.
- P4 normalization retains up to 500 successful option command IDs and remains backward compatible.
- Save serializer/parser round-trip of the new field is tested.
- Canonical panel lookup and historical redirect lookup are separate APIs; the old legacy-first resolver is preserved for compatibility.
- Political Capital costs were measured, not fabricated into a resource system.

## Next tasks, in order
1. Install locked dependencies in a network-enabled environment; rerun the complete `npm test`, `npm run typecheck`, `npm run build`, and lint. Do not interpret missing-package failures as code passes.
2. Add a runtime Zustand-store test around `executeV45Option`: first execution succeeds, same option/day/minute replay is rejected, different minute is allowed, failed attempts do not consume an idempotency key, Wait branch persists key after continuity, Save/load preserves the key.
3. Audit every current navigation caller and choose `resolveCanonicalPanelId`; use legacy redirects only in explicit save migration code after identifying the stored format. Do not rewrite legacy save IDs generically.
4. Resolve Political Capital from authoritative design/canon: define source, balance, spend/refund rules, whether it regenerates, and why Wait options carry the field. Until then, do not deduct or invent a balance.
5. Continue Gate 2 with remaining Council/Option, disappearance, and UI workflows, keeping UNKNOWN facts unconfirmed.

## Environment limits in CP8
- `scripts/game.test.mjs`: blocked by missing Zod.
- Separate TypeScript app/auth test group: 6 passed, 2 suite-load failures due missing `@tanstack/react-start` and `jose`.
- Full typecheck: missing `@types/node` and `vite/client`.
- Build: missing Vite executable.
- Browser and live services: not tested.

## Continuation safety
Do not include `.grok/app-env.json`, API keys, OAuth secrets, database URLs, or other credentials in a ZIP or source commit. The temporary test-only app-env file was removed before delivery.
