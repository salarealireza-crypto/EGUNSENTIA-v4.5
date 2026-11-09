# EGUNSENTIA — Worklog 36

Date: 2026-11-08

## Scope
Preserve intentionally empty campaign collections during save restore while retaining defaults for missing legacy fields.

## Finding and changes
- `loadSnapshot()` used truthy `.length` checks for multiple persisted lists. When a player had a legitimately empty list, the loader replaced it with seeded day-one data. This could resurrect closed trades, removed inventory/records, memories, children, or other list content after a reload/import.
- Added `restoreSnapshotArray()` to distinguish an empty saved array (preserve it) from an absent or malformed legacy value (use canonical defaults).
- Applied it to 14 collections: chronicle, quick actions, both vaults, events, household, gates, trades, radio, films, intel, memories, reputations, and children. Chat log deliberately retains its fresh-log fallback.
- Added three regression tests.

## Verification
- Snapshot-array focused tests: 3/3 PASS.
- Full suite and static gates will be rerun at the next checkpoint.

## Result
Valid empty collections are no longer silently repopulated from day-one defaults during restore. Phase 1 remains open.
