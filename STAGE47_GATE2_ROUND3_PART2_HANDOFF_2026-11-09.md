# EGUNSENTIA — Round 3 Part 2 Handoff (2026-11-09)

## Exact continuation parent

Use `EGUNSENTIA-STAGE47-POST-CP12-ROUND3-PART2-PARTIAL-CP13-2026-11-09.zip` as the next working parent. Its parent is CP12 (SHA-256 `4bcce80dd5676714e0987c114b8cb649963a90a5856ead99019a38b21ac5ace6`). CP12 remains immutable.

The CP12 ZIP/working-copy discrepancy is documented in `STAGE47_GATE2_ROUND3_PART2_PERSISTENCE_AUTOSAVE_REPORT_2026-11-09.md`: two Part 1 notice/test edits were in the working copy but not in the CP12 ZIP. CP13 includes both edits and the new Round 3 Part 2 changes. Do not silently alter CP12.

## Current implementation

- Central debounced autosave subscribes to the Zustand canonical campaign snapshot after hydration/conflict resolution.
- Snapshot changes are debounced 400 ms; notice-only UI metadata is ignored.
- Identical in-flight flushes share one promise. The existing latest-save queue and server-side expected-revision conditional write remain in place.
- Save outcomes distinguish persistent PostgreSQL/Neon storage from in-memory PGlite preview storage, unchanged, superseded, blocked and failed.
- Command Deck orders and Council decrees do not show a final success receipt until the flush result is known. PGlite and device-only outcomes are explicitly non-persistent.
- A blank account with no save row is no longer treated as if the local seed snapshot were already persisted.

## Verification summary

- Focused persistence/save tests: 58/58 PASS.
- Script tests excluding `scripts/game.test.mjs`: 449/449 PASS.
- Full `npm test`: 449 PASS; one test suite blocked at import by missing `zod`.
- Separate app-data/auth TS test batch: 6 PASS; 2 blocked at import by missing `@tanstack/react-start` and `jose`.
- Changed TS/TSX transpilation: 9/9 PASS (not a semantic typecheck).
- Canon verifier: PASS.
- Red Claw verifier: PASS with extant provenance/chronology warnings.
- Art verifier: FAIL/INCOMPLETE (0 generated raster assets, 23 incomplete groups).
- Typecheck: BLOCKED (`@types/node`, `vite/client` absent).
- Build: BLOCKED (`vite` executable absent).
- Lint: BLOCKED (`eslint` absent).
- Real DB transaction/commit/reload: NOT RUN; `DATABASE_URL` unset and database dependencies/server unavailable.
- Browser and Production verification: NOT RUN.

## Resume instructions — C3

1. Keep all existing immutable checkpoints; make a new separate working copy from CP13.
2. Inspect `src/lib/db.ts`, `src/lib/game/save.ts`, migrations `0002_saves.sql` and `0003_save_revisions.sql`, `save-validation.mjs`, `save-revision.mjs`, `save-queue.ts`, `save-autosave.ts`, `play.ts`, and `GameShell.tsx` before further edits.
3. Configure the existing PostgreSQL URL and auth secrets only in the provider's protected environment UI. Never request or record secret values in chat or files.
4. Install the exact dependencies from `package-lock.json` using the intended package manager; do not upgrade or rewrite the lockfile.
5. Use an isolated test account/database, apply the existing migrations, then execute actual UI/command paths. Test commit, rejection/no mutation, reload, server restart, idempotency, revision conflicts, concurrent sessions, partial failures, legacy saves and Receipt reconstruction.
6. Do not mutate rows directly to claim the player-command integration path passed. Do not use PGlite as production-persistence proof.
7. Mark C3 Integration-tested only after a real/prod-equivalent backend commit and reload is exercised through the actual server adapter and command route. Browser-verified and Production-verified remain separate statuses.
8. After the C3 slice, continue C4 NPC availability, then C5 missing-person links, C6 aliases and C7 browser QA, in prompt order.

## Owner-facing blockers

The only action requiring the owner is secure configuration of the existing database/auth environment if a real persistent backend is to be tested. Do not paste credentials here. If no backend is configured, keep C3 honestly Blocked and continue independent code-level work only.

## Checkpoint composition

CP13 contains 750 files: 8 substantive additions, 13 modifications and 0 deletions relative to the 739-file CP12 archive, plus the generated change-manifest, file-inventory and SHA-256 index files. The inventory self-excludes and separately excludes the SHA list; the SHA list covers every other packaged file. Verify the ZIP against its external sidecar before resuming.
