# EGUNSENTIA — Worklog 29

Date: 2026-11-08

## Scope
Lockfile reproducibility and package integrity audit (first step in the Stage 29–40 continuation).

## Findings and changes
- Confirmed the npm lockfile is version 3 and contains 472 package entries.
- Verified all 71 declared direct dependencies (57 production + 14 development) are represented in the lockfile and match the root manifest ranges exactly.
- Verified all 471 remote package tarballs have Subresource Integrity hashes; no missing integrity entries were found.
- `npm ls --package-lock-only --depth=0` passes.
- Added `scripts/package-lock-integrity.test.mjs` with three regression checks for manifest/lockfile parity, direct dependency entries, and remote package integrity hashes.
- Focused tests pass 3/3.

## Installation / verification limits
- `npm ci --ignore-scripts --offline --dry-run --no-audit --no-fund` completed as a dry-run only; this does not install dependencies.
- A real `npm ci --ignore-scripts --no-audit --no-fund` attempt exceeded the execution time limit. No successful dependency installation is claimed.
- The dependency tree remains incomplete; `zustand/index.js` is absent and npm cache remains empty.
- No dependency version or lockfile was changed.

## Result
- Lockfile integrity is confirmed. The blocker is package retrieval / installation, not a package-lock mismatch.
- No source runtime behavior changed. Phase 1 remains open; build, TypeScript, lint, browser QA, and database integration remain unverified.
