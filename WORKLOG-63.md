# WORKLOG-63 — Stage 47 Round 3 Part 5: C3 failure-path and Save auth tests

Date: 2026-11-09

- Restored CP15 into a new separate working copy; verified actual archive SHA-256 `c61c1d6675147a173af6cf6998ccf576e666374ca6fd57f98645139c5920d47a` and ZIP integrity before editing.
- Added two `migration-transaction.test.mjs` tests: COMMIT failure attempts ROLLBACK while preserving the commit error; advisory-lock failure prevents migration body and rolls back.
- Added two `save-revision.test.mjs` source-contract tests: all save endpoints use `authMiddleware` and authenticated `context.userId`; `persistSave` does not accept caller-selected identity.
- Focused persistence/Receipt/DB/migration suite: 70/70 PASS.
- Runnable script suite excluding missing-Zod `scripts/game.test.mjs`: 461/461 PASS across 56 test files.
- Full `npm test`: 461 PASS / 1 blocked suite; `scripts/game.test.mjs` fails import because `zod` is absent.
- Separate app-data/auth tests: 6 PASS / 2 blocked by absent `@tanstack/react-start` and `jose`.
- Canon verifier PASS; Red Claw PASS with 14 existing age/provenance/chronology warnings; Art verifier FAIL/INCOMPLETE (167 assets; 0 generated raster; 23 incomplete groups).
- Typecheck blocked by missing `@types/node` and `vite/client`; build blocked because Vite executable is absent; lint blocked because ESLint is absent; check:auth blocked because no dev-server resolved auth flag was available.
- `DATABASE_URL`, `BETTER_AUTH_SECRET`, `PGLITE_ALLOW_EPHEMERAL` unset; PostgreSQL tools and Docker absent; no DB migration/commit/reload/restart, browser or Production test ran.
- No historical player Save fixture found in archive by filename; existing legacy tests use synthetic test fixtures only.
- package-lock SHA-256 remains `72b88b98db67a9954c77d88b4415671d566298113e948cd03825a20049e5184b`; no dependency installation or lockfile change.
- No gameplay code, Save schema, migrations, Canon, economy rules or secrets changed; no files deleted.
- CP16 is a partial C3 test-hardening checkpoint. C3 and Gate 2 remain BLOCKED/PARTIAL. Continue C3 before C4.
