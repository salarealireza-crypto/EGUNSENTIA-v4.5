# EGUNSENTIA — Worklog 31

Date: 2026-11-08

## Scope
Replace the AL rate limiter's process-local counter with a shared, atomic database quota.

## Finding and changes
- The old `Map`-based 36-turn/hour limit was per server process. Vercel can route requests for one account across multiple instances, so the process-local limit was not a reliable production control.
- Added `migrations/0004_al_rate_limits.sql` with one account-scoped rate row and a timestamp index.
- Added `src/lib/game/al-rate-limit.mjs`. Its PostgreSQL-compatible `INSERT … ON CONFLICT … DO UPDATE … WHERE … RETURNING` claims one slot atomically against the database clock. A full window returns no rows; a new or expired window starts at one.
- `playTurn` now uses the verified `context.userId` and shared DB helper. The per-process Map was removed. A DB error propagates (fail-closed); it does not silently grant an AI turn.
- Updated migration-plan expectations and added five focused regression tests.

## Verification
- AL rate-limit focused tests: 5/5 PASS.
- AL validation + rate limit + migration plan/transaction + LLM config focused tests: 27/27 PASS after updating the migration registry test for migration 0004.
- Real Neon/PostgreSQL concurrency integration is still unavailable; SQL-level atomic semantics are reviewed and mocked tests pass, but no claim of live DB execution is made.

## Result
The AI usage quota is now designed to be shared across Vercel instances instead of resetting per process. Phase 1 remains open pending real DB integration and full deployment verification.
