# STAGE47 Round 1 — Packaging exclusions

- No file present in the immutable Round 0 parent project inventory was intentionally excluded from this child checkpoint.
- The parent/child comparison reports zero removed files.
- Packaging excludes generated/dependency-only paths if present: `.git/`, `node_modules/`, `dist/`, `build/`, `.next/`. None of these directories existed in the working copy at packaging time.
- No real `.env` file or credential file was present. `.env.example` is retained.
- Temporary operating-system files and symlinks were not present; the archive contains no symlink entries.
- These exclusions are packaging rules, not deleted project files. Any later dependency/build directory should be regenerated through documented tooling, not included as source checkpoint content.
