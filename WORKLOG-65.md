# WORKLOG-65 — D2 retry, working-copy/cache permissions and DNS (2026-11-09)

- Started from immutable CP17; verified its SHA-256 and ZIP integrity.
- Detected that the previous extracted working directory was root-owned; created a fresh UID-1000 working copy and verified it was writable.
- Detected default npm cache EACCES due to root-owned files. Did not use sudo/chown. Created isolated writable npm cache; cache verification passes.
- Re-ran exact-lockfile npm ci using custom cache. It entered package-fetch stage, but registry tarballs including Zod 4.6.5 and Vite returned EAI_AGAIN; npm then emitted secondary Exit handler never called.
- DNS getaddrinfo independently reproduced temporary name-resolution failure. npm status page was operational; no global outage inferred.
- Removed incomplete node_modules; verified no npm process remains. Lockfile remained SHA-256 72b88b98db67a9954c77d88b4415671d566298113e948cd03825a20049e5184b.
- Re-ran focused persistence/Receipt/DB/migration tests: 70/70 PASS; runnable scripts excluding game.test.mjs: 461/461 PASS across 56 files; Canon verifier PASS.
- No source, manifest, lockfile, Canon, Save schema/migration, game rule, or secret changed.
- D1 remains complete. D2 remains BLOCKED by execution-runtime DNS. C3 and Gate 2 remain PARTIAL/BLOCKED; C4 remains gated.
