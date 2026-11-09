# EGUNSENTIA — Worklog 14

## Scope
Continue Phase 1 security/stability audit. Added server-side runtime validation and bounded normalization for untrusted AL turn requests. No provider credentials or visual assets were introduced.

## AL request validation
- Added `src/lib/game/gm-validation.mjs`, a dependency-free runtime validator used by the `playTurn` server-function validator.
- Rejects malformed top-level payloads, invalid history roles, excessive history count/aggregate text, malformed memory objects/arrays, invalid turn counters, empty actions, and over-limit payload strings.
- Copies only supported fields; clamps action/history/memory text to the same effective limits already applied before prompt assembly. State is capped at 100,000 characters at the boundary and continues to be capped at 8,000 characters in the prompt, matching existing behavior.
- Preserves the existing client's maximum of 24 pinned chronicle entries; active threads and edicts are bounded to 24 entries and 500 characters each before transmission.
- Added five focused regression tests in `scripts/gm-validation.test.mjs`.

## Verification
- Focused AL validator tests: **5/5 PASS**.
- Full `npm test`: **289 passed / 2 failed / 291 total**. The two failures remain the previously identified missing-Zustand import failures; no new test failures.
- `npm run verify:canon`: **PASS**.
- `npm run verify:art -- --structure`: **PASS (structural only)**; 23 art groups remain unfilled with real art; 0 generated raster assets.
- `npm run typecheck`: blocked by missing `@types/node` and `vite/client` definitions.
- `npm run lint`: blocked because `eslint` executable is unavailable.
- `npm run build`: blocked because `vite` executable is unavailable (`spawn vite ENOENT`).
- Retried `npm ping --fetch-retries=0 --fetch-timeout=8000`; registry DNS still fails with `EAI_AGAIN registry.npmjs.org`.

## Findings retained
- AL rate limiting remains in-memory per server process and is not distributed across Vercel instances. Runtime request validation is improved, but distributed rate limiting still requires durable/shared infrastructure or a provider-side gateway and remains open.
- No end-to-end AL request can be verified without a valid server-side provider key; the previously exposed key remains compromised and must be revoked by the user.
- Typecheck/build/lint/browser smoke remain unverified because the dependency tree cannot currently be restored.

## Files changed
- `src/lib/game/gm-validation.mjs` (new)
- `src/lib/game/gm.ts`
- `src/lib/game/play.ts`
- `scripts/gm-validation.test.mjs` (new)

## Phase status
Phase 1 remains open. No release archive was created because the full dependency-backed checks and production build remain blocked. Original uploaded archives remain untouched.
