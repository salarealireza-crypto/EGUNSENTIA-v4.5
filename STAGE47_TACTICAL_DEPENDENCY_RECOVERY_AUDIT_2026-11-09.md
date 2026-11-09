# Stage 47 — Tactical Dependency Recovery Audit (2026-11-09)

## Executive decision

**Zod is already a declared project dependency. It does not need to be authored, re-created, upgraded, or added to the manifest.** The package is declared in `package.json` as `zod: ^4.4.0`, and `package-lock.json` pins the actual package to `4.6.5` with a registry tarball URL and integrity digest. The failure is an incomplete dependency installation, compounded by this execution environment's inability to resolve `registry.npmjs.org`.

This is a D1 environment/dependency audit only. D2 installation recovery remains **BLOCKED** by DNS/network access. No project source, package manifest, lockfile, gameplay logic, Canon, Save schema, migration, or economic rule was modified. No new dependency version was introduced.

## Corrected manifest finding

An earlier conversational summary incorrectly described `devDependencies` as empty. That statement was wrong. Direct inspection of the CP16 source confirms:

- `dependencies`: 57 entries.
- `devDependencies`: 14 entries.
- `package-lock.json`: lockfile version 3.
- All 71 root direct dependency declarations match the root lockfile declarations and have corresponding `node_modules/<package>` lock entries; no manifest/lock range mismatch was found.
- `zod` is a production dependency (`^4.4.0`), not a missing dev dependency.
- The lockfile resolves Zod to `4.6.5` at `https://registry.npmjs.org/zod/-/zod-4.6.5.tgz`, with the integrity digest recorded in the lockfile.
- `src/lib/game/delta.ts:1` imports `z` from `zod`.

## Environment evidence

| Item | Observed | Classification |
|---|---|---|
| Node | `v22.16.0` | Environment fact |
| npm | `10.9.2` | Environment fact |
| npm registry config | `https://registry.npmjs.org/` | Configuration |
| npm offline mode | `false` | Configuration |
| `package.json` | 57 dependencies / 14 devDependencies | Source audited |
| Root lock declarations | 71/71 match manifest ranges and lock entries | Source audited |
| Zod lock version | `4.6.5` | Source audited |
| npm cache | No Zod cache entry returned by `npm cache ls zod` | Environment fact |
| `node_modules` at start | Partial tree from prior failed installation; Zod directory empty/incomplete | Environment fact |
| `npm ls zod` after cleanup | `(empty)` | Environment fact |
| Direct ESM import | `ERR_MODULE_NOT_FOUND`, resolving to absent `node_modules/zod/index.js` | Reproduced |
| `npm ping` | `EAI_AGAIN` / `getaddrinfo` for `registry.npmjs.org` | Network/DNS blocker |
| `curl` with normal settings | Could not resolve `registry.npmjs.org` | Network/DNS blocker |
| `curl --noproxy '*'` | Could not resolve `registry.npmjs.org` | Network/DNS blocker |
| HTTP(S)/ALL proxy variables | Unset in this execution environment | Environment fact |
| `package-lock.json` SHA-256 | `72b88b98db67a9954c77d88b4415671d566298113e948cd03825a20049e5184b` | Integrity check |
| `package.json` SHA-256 | `f33db47e9c69f1919406896834b860721e8f3042bd362cffbd4f3d29fd063103` | Integrity check |

The official npm status page reported all systems operational, including package installation, when checked on 2026-11-09. This does not make the local failure disappear; it indicates the observed `EAI_AGAIN` is specific to this execution environment's resolver/egress path rather than evidence of a general npm registry outage. Status reference: https://status.npmjs.org/.

## Verification run in this part

| Command/check | Result | Meaning |
|---|---:|---|
| CP16 ZIP SHA-256 | PASS | Matches `1bd3504c1b5fce7fdb3538b9c4014ed80bdae936429ae94f72cc5824ee5d1f8c` |
| `unzip -tq` CP16 | PASS | No archive corruption |
| Manifest/lock direct-dependency audit | PASS 71/71 | No dependency-range drift |
| `npm cache ls zod` | No result | Zod is not available from local npm cache |
| `npm ping --fetch-retries=0 --fetch-timeout=15000` | BLOCKED | `EAI_AGAIN` resolving registry host |
| `curl -I https://registry.npmjs.org/` | BLOCKED | DNS resolution failure |
| `curl --noproxy '*' -I https://registry.npmjs.org/` | BLOCKED | Same DNS failure without proxy |
| `node --input-type=module -e "import { z } from 'zod'..."` | BLOCKED | `ERR_MODULE_NOT_FOUND` |
| `npm run test:game` | BLOCKED | `scripts/game.test.mjs` fails to load through `src/lib/game/delta.ts` because Zod is absent |
| Focused persistence/Receipt/DB/migration tests | 70/70 PASS | Runnable without installed dependencies |
| Script tests excluding `scripts/game.test.mjs` | 461/461 PASS, 56 files | Non-Zod runnable tests remain green without `node_modules` |
| `npm test` | 461 PASS / 1 FAIL | Single failure is import-time missing Zod; 462 discovered |
| `npm run typecheck` | BLOCKED | Missing `@types/node` and `vite/client` type definitions |
| `npm run build` | BLOCKED | `spawn vite ENOENT` |
| `npm run lint` | BLOCKED | `eslint: not found` |
| `node scripts/verify-canon.mjs` | PASS | 65-panel registry, invariants, 167 assets and option catalogues |
| Red Claw verifier | PASS with 14 warnings | Existing chronology/provenance warnings preserved |

For the 461-script run, a temporary `.grok/app-env.json` containing only `{"VITE_AUTH_ENABLED":"true"}` was created for the test process and removed immediately afterward. It is not part of this checkpoint. The incomplete `node_modules` tree from the previous failed install was removed; no partial install is treated as valid. No npm process remained running.

## What this does and does not establish

**Established:** Zod is correctly declared; exact version is pinned; lockfile is internally aligned with the manifest; the source import exists; package installation cannot complete here because the execution environment cannot resolve the configured npm registry; the Zod-dependent game test is blocked before assertions execute.

**Not established:** Zod itself is defective; the application uses an incompatible Zod version; npm is globally down; a package manifest correction is required. None of those conclusions is supported by the available evidence.

## Next execution steps

1. Run on a machine/runtime with working DNS and HTTPS access to `registry.npmjs.org`, using the existing CP16-derived working copy.
2. Verify the configured registry and connectivity first: `npm config get registry` then `npm ping`.
3. Remove only an incomplete local installation, then run `npm ci --no-audit --no-fund`. Do not run `npm install zod`, change the Zod range, or edit the lockfile.
4. Confirm the exact installation: `npm ls zod`; expected package version is `4.6.5`.
5. Smoke-test ESM import: `node --input-type=module -e "import { z } from 'zod'; console.log(z.string().parse('zod-ok'))"`.
6. Run `npm run test:game`, then the full `npm test` (including the app-data/auth suites). Record exact pass/fail/block counts.
7. Run `npm run typecheck`, `npm run lint`, and `npm run build`; fix only verified project defects, never weaken configuration or suppress checks.
8. Resume C3.1–C3.10 only after dependency recovery. Do not advance to C4 until C3's actual command → persistent commit → restart/reload → Receipt matrix is accepted.

## Project integrity

- `package.json` and `package-lock.json`: unchanged.
- Canon / lore / character records: unchanged.
- Save schema and SQL migrations: unchanged.
- Gameplay and economic rules: unchanged.
- Secrets: none added or copied.
- `node_modules`: excluded from checkpoint.
- Temporary `.grok/app-env.json`: removed.
- Parent CP16: immutable.

**Disposition:** D1 audit complete; D2 installation recovery blocked by execution-environment DNS. C3 and Gate 2 remain PARTIAL / BLOCKED. This is not a Build-verified, Integration-tested, Browser-verified, Production-verified, or release checkpoint.
