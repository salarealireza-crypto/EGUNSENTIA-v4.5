# WORKLOG-64 — Tactical dependency recovery audit (D1)

Date: 2026-11-09

- Restored CP16 into a separate working copy; verified CP16 ZIP SHA-256 and `unzip -tq` before work.
- Corrected an earlier inaccurate conversational statement: `package.json` does not have empty `devDependencies`; it contains 57 direct dependencies and 14 devDependencies.
- Compared all 71 root direct dependency declarations with `package-lock.json`: 71/71 ranges and lock entries match.
- Confirmed `zod` is already declared as `dependencies.zod = ^4.4.0`; lockfile pins `4.6.5`; `src/lib/game/delta.ts` imports it.
- Confirmed npm cache has no Zod package. `npm ls zod` is empty after cleanup; direct ESM import and `npm run test:game` fail before assertions with `ERR_MODULE_NOT_FOUND`.
- `npm ping` fails with `EAI_AGAIN` for `registry.npmjs.org`; `curl` with and without proxy bypass reports DNS host resolution failure. HTTP(S)/ALL proxy variables are unset. npm's public status page reported the package installation component operational on 2026-11-09; the evidence points to this execution runtime's resolver/egress, not a general registry incident.
- Removed incomplete `node_modules` from the failed prior install; retained no partial package tree. `package.json` SHA-256 `f33db47e9c69f1919406896834b860721e8f3042bd362cffbd4f3d29fd063103`; `package-lock.json` SHA-256 `72b88b98db67a9954c77d88b4415671d566298113e948cd03825a20049e5184b` unchanged.
- Focused Persistence/Receipt/DB/Migration tests: 70/70 PASS. Runnable script suite excluding `scripts/game.test.mjs`: 461/461 PASS across 56 files. Full `npm test`: 461 PASS / 1 import-time missing-Zod failure. Canon PASS; Red Claw PASS with 14 warnings.
- Typecheck BLOCKED (`@types/node`, `vite/client`); build BLOCKED (`vite` absent); lint BLOCKED (`eslint` absent). No DB/browser/Production test.
- Temporary `.grok/app-env.json` contained only `VITE_AUTH_ENABLED=true` for the script run and was removed; no secret was present. No npm process remains.
- No code, package manifest, lockfile, Canon, Save schema, migrations, economic rules or secrets changed; no source file deleted.
- D1 audit complete; D2 install blocked by environment DNS. C3 and Gate 2 remain PARTIAL/BLOCKED. C4 remains gated on C3 acceptance.
