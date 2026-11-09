# EGUNSENTIA — Worklog 44

Date: 2026-11-08

## Scope
Make option-generated delayed consequences respect their declared hour-level delay rather than resolving at midnight by rounded day.

## Finding and changes
- Option-generated queue records previously stored only `dueDay = ceil(afterHours / 24) + currentDay`. The clock engine then resolved them at midnight, so an 8-hour action could fire too early or too late depending on the starting time.
- Added optional absolute `dueMin` to queue records. Option execution now computes `dueMin` from the live world clock plus `afterHours * 60`, retaining `dueDay` for legacy compatibility and UI grouping.
- `advanceClock()` now resolves an exact-minute queue deadline when present, with the old midnight-of-`dueDay` behavior for legacy records.
- P4 normalization removes malformed optional exact deadlines and preserves the legacy `dueDay` fallback.

## Verification
- Exact-deadline + repeated-option queue suites: 5/5 PASS.
- Full suite after Stage 44: 384 PASS / 2 blocked / 386 total. Both blocked tests are the missing-Zustand imports in the existing option/store integration tests.
- Canon verification: PASS. No full TypeScript/build verification because project dependencies remain unavailable.

## Result
Delayed option consequences now resolve on their intended in-game hour. Existing day-only save queue entries retain their prior behavior.
