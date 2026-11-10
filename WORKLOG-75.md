# WORKLOG-75 — Save validator / relationship roster mismatch (2026-11-10)

## Finding
- The default Canon private-relations state is built from the complete 37-profile roster.
- `serializeSavePayload()` previously capped `privateRelations.relationships` at 32 entries, so a normal fresh campaign could not be saved even though its relationship state was created by the project itself.
- This is a source-level validation mismatch, not a corrupted campaign and not a Neon account/database failure.

## Change
- Raised the relationship-record cap to 64. Existing caps for requests (100) and consequences (200) are unchanged.
- Added a regression test using `defaultPrivateRelationsState()` and asserting all 37 canonical profile records pass validation; a 65-entry payload remains rejected.
- No user campaign data, Canon facts, relationship statuses, DB schema, or migrations are rewritten.

## Verification
- `private-relations.test.mjs`: 23/23 PASS.
- `save-validation.test.mjs`: 18/18 PASS.
- Combined targeted verification: 41/41 PASS. Full project suite, typecheck, lint and full build are not claimed from this focused run.
