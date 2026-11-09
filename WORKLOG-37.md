# EGUNSENTIA — Worklog 37

Date: 2026-11-08

## Scope
Audit legacy P4 array normalization against the pre-existing V4.1 compatibility contract.

## Finding and resolution
- The P4 normalizer deliberately seeds `factions`, `planner`, and `envoys` when an empty or absent array is encountered. The existing V4.1 migration test explicitly requires an empty legacy `planner` array to restore the five-item fixed rhythm.
- A proposed change to preserve empty P4 arrays conflicted with this established compatibility behavior and was reverted after the full suite exposed it. No existing migration behavior or test was removed.
- Added two regression tests that pin the current canonical-seed behavior for empty and missing legacy P4 arrays.

## Verification
- P4 normalization tests: 2/2 PASS.
- The full-suite compatibility check is rerun at the Stage 40 checkpoint.

## Result
Legacy P4 seed defaults remain intact. Stage 36's empty-list preservation applies only to the top-level campaign collections it was designed for; P4's fixed seed arrays retain their canonical migration semantics.
