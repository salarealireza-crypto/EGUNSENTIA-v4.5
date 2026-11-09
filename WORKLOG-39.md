# EGUNSENTIA — Worklog 39

Date: 2026-11-08

## Scope
Ensure account deletion removes all associated campaign and AL quota data.

## Finding and changes
- The Better Auth user, session, and account tables already cascade on user deletion, but the app's `game_saves` and `al_rate_limits` tables had no foreign key back to the account.
- Deleting an account could therefore leave campaign payloads and AL usage metadata orphaned in PostgreSQL.
- Added `migrations/0005_user_data_cascade.sql`: it first removes legacy orphan rows, then adds idempotently-checked foreign keys from both account-owned tables to `"user"("id")` with `ON DELETE CASCADE`.
- Updated the ordered migration-plan test and added regression checks for identity alignment and cascade semantics.

## Verification
- Migration-plan tests: 8/8 PASS. User-data-retention tests: 2/2 PASS (10/10 combined).
- No live database is configured in this work session; the SQL has not been applied to Neon/PGLite here.

## Result
The migration plan now enforces account data cleanup when users are deleted, pending a real database migration test. Phase 1 remains open.
