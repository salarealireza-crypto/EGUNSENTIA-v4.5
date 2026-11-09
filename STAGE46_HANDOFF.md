# EGUNSENTIA — Stage 46 paused handoff

This archive is a working copy based on the Stage 45 backup. It contains a narrow set of verified repairs and regression tests. It is **not** a finished game, release candidate, or deployment package.

## What changed

1. Fixed the undeclared `clock` reference in hard time-skip interrupts.
2. Fixed rationing so it never increases consumption, including fractional or zero baselines.
3. Replaced calendar substring matching with exact dates, optional year checks, inclusive ranges, and Dead Day matching.
4. Hardened GM response parsing against missing footers and truncated/invalid state blocks.
5. Began hardening state deltas: strict numeric parsing, recursive forbidden-key rejection, structural limits, and null-as-no-change behavior.
6. Added isolated time and parser regression tests.

## Current Stage 46 package verification (2026-11-08)

- Stage 46 focused regression suites: **21 passed / 0 failed** across the seven Stage 46 test files.
- `node scripts/verify-canon.mjs`: **PASS** — 65 canonical panels, 167 registered assets, preserved art, and all option catalogs verified. The 10 `.grok` image files reported missing by the earlier pre-repackaging checkpoint are present in this package.
- `node scripts/verify-art.mjs`: **INCOMPLETE** — required art groups remain incomplete/placeholders. Current inventory: 167 assets total, 0 generated raster assets, 150 code-drawn assets, and 17 preserved assets.
- Full `scripts/game.test.mjs`: blocked before test execution because `zod` is unavailable (`node_modules` is not installed in this package).
- Typecheck, production build, browser/mobile smoke tests, and deployment: not verified.

The original checkpoint notes in `WORKLOG-46.md` describe the state before the package restoration recorded in `STAGE46_PACKAGE_NOTES.md`. Use this section for the current packaged state.

## Remaining work

### Priority 1 — finish core correctness

- Finish delta validation: clamp/validate every numeric field against save rules, enforce stock/capacity and other invariants, bound all collections and strings, and guarantee the merged result passes save serialization.
- Fix `flushSave()` so persistent save failures reach the player via a throttled, useful notice.
- Make stored legacy saves lenient and fill missing collections from defaults; show an explicit load failure notice without overwriting local progress.
- Persist rebuilt rolling memory every eight turns and retain the newest content when truncating.
- Finish AL request safety: bounded compact state, correct quota reservation/commit/refund behavior, and classification of HTTP 429 rate limits before generic quota text.
- Resolve household-affection drift behavior and child birthday/kin matching by stable ID.
- Make migration `0005` and the no-auth `dev-user` mode consistent and idempotent.
- Remove hard-coded child ages from `SYSTEM_CORE`; supply ages from live state while preserving the under-18 safety rule.

### Priority 2 — implement the requested gameplay systems

- Disappearance Files: 15 canon records, clues, provenance, deterministic discovery, save/load persistence, Event Ledger/Chronicle integration, and the hidden-number panel.
- Dead Days and memorial ceremonies: annual schedule, invitations, attendance, resources, audience-specific outcomes, and multi-year/save-load tests.
- Commander’s Journal after time skips and a read-only Day Replay with causal timeline, evidence, knowledge-level filtering, and bounded storage.
- Adult-women lore additions as a clearly marked proposal only; do not overwrite established canon or create new canon characters without approval.

### Priority 3 — performance and visual systems

- Measure and then reduce the client bundle through safe lazy loading of the large option catalog/canon data; preserve all 65 panels, offline behavior, and canon retrieval.
- Complete the art manifest and distinct assets for every required art group; remove duplicates/placeholders and pass both art and canon verification.
- Bind gate states and energy/water warning presentation to real simulation state; add reduced-motion behavior, accessibility checks, and browser smoke tests.

### Priority 4 — release readiness

- Restore a complete dependency install (`npm ci`) and run typecheck, all tests, lint, canon/art verification, production build, and browser smoke tests.
- Verify persistent production storage with Neon; do not deploy with an in-memory PGlite fallback.
- Configure Vercel and GitHub only after the build and durable-save path are verified.
- The previously exposed API key must be revoked. A replacement must be entered directly as a server-side Vercel environment variable; do not put secrets in source files or this archive.

## Important constraints retained

- The original Stage 45 ZIP remains the untouched rollback source.
- No APK, Capacitor, or Android Studio deliverable is being produced.
- No deployment or release claim is made from this checkpoint.
