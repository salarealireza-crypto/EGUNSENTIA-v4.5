# Save validation hotfix — 2026-11-10

## Root cause
`defaultPrivateRelationsState()` maps the current `WOMEN` Canon registry into `privateRelations.relationships`. The roster currently has 37 profiles (covered by `scripts/private-relations.test.mjs`). However, `validatePrivateRelations()` in `save-validation.mjs` limited that array to 32. Consequently the game's own default relationship state was rejected by `serializeSavePayload()` and the account save returned `Invalid campaign data: privateRelations.relationships.`

## Fix
The validator now permits up to 64 relationship records. This is deliberately above the current 37-profile Canon roster but remains a finite bound. The requests and consequences limits remain 100 and 200.

## Regression coverage
A test constructs a save payload with `defaultPrivateRelationsState()`, checks it has 37 relationship rows, and verifies that `serializeSavePayload()` accepts it. It also verifies that 65 rows are still rejected.

## Verification
Two focused test files passed: private-relations 23/23 and save-validation 18/18 (41/41 combined). This is targeted regression evidence only; it is not a claim that the full project test suite or full local build ran.

## Data safety
The patch changes only save validation and test/documentation files. It does not alter the browser's local campaign, relationship records, user account, Neon data, SQL migrations, or AI provider configuration. Do not reset or clear the campaign to apply this fix.

## Deployment status
This patch must be imported into the GitHub `main` branch by the existing archive-import workflow and then built by Vercel. The fix is not live until that deployment reports `READY`.
