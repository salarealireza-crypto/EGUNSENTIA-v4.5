# EGUNSENTIA Stage 47 — نقشه اجرایی تعمیر و احیا

## Current authoritative continuation override — CP23 / Round 6 Part 2 (2026-11-10)

The historical Intake Round 0 / Round 1 sequencing below is superseded for current work by CP23 evidence and the current master continuation prompt. CP23 Round 6 Part 1 is complete at source/unit-test level; do not restart earlier rounds or repeat Part 1. Latest follow-up checkpoint: `EGUNSENTIA-STAGE47-CP23-ROUND6-PART2-FOLLOWUP-RECHECK4-PARTIAL-2026-11-10.zip`, built from immediate parent `EGUNSENTIA-STAGE47-CP23-ROUND6-PART2-INDEPENDENT-VERIFICATION-PARTIAL-2026-11-10.zip` (parent SHA-256 `0115229c3f0486a53d094ce047221c96b8857fafba9b797b776fe1618c622ed7`); CP23 source ancestor SHA-256 `9875a15787b3ba835f9eaadc7cc84f8f5ee030956f4dfb902c5e89d7dbcb11fb`.

Round 6 Part 2 remains PARTIAL / BLOCKED. Official npm Registry DNS returns `EAI_AGAIN`; HTTPS returns curl exit 6. Exact npm ci was not attempted. Lockfile SHA remains `72b88b98db67a9954c77d88b4415671d566298113e948cd03825a20049e5184b`, with all 71 direct ranges matching. Latest checks: Round 6 5/5, combined focused 62/62, script suite excluding missing-Zod game suite 467/467, Canon PASS, Red Claw PASS with 14 warnings retained, art structure PASS with 23 groups unfilled; selected TS App Data/Auth batch 6 pass / 2 import-blocked. Full game test, typecheck, lint and build remain blocked by missing dependencies. Limited leak smoke is not the full hidden-value simulation.

AL runtime/provider, durable PostgreSQL, browser/responsive QA and Production verification remain NOT RUN. CP14 asset pack was not supplied. Political Capital contract remains unresolved; Gate 2 and Round 6 remain PARTIAL/BLOCKED; Round 7 and C4 remain gated.

See `docs/round6-part2-round4/` and `WORKLOG-74.md`. Resume from the Round 6 Part 2 Follow-up Recheck 4 checkpoint ZIP. Continue only with checks independent of dependency installation while DNS is unavailable. Once official registry DNS/HTTPS works, use a clean child copy and run `npm ci --no-audit --no-fund`; do not change package manifests, lockfile, gameplay state, Canon, schemas, migrations, economy or existing art to bypass the blocker.
---


این سند ترتیب کار بعدی را مشخص می‌کند. اجرای هر مرحله مستقل، قابل آزمون و checkpoint می‌شود. Gate 0 فقط اسناد و setup پایه را تثبیت کرد؛ Gate 1 بخشی از سیاست‌های امنیتی و اتصال آنلاین را در کد پیاده‌سازی کرده و با وضعیت Partial بسته شده است.

## وضعیت authoritative بر اساس Master Prompt — Intake Round 0 (2026-11-09)

این بخش، نقطهٔ ادامهٔ فعلی است و خلاصه‌های قدیمی CP5 تا CP9 در پایین سند را به‌عنوان تاریخچه نگه می‌دارد؛ برای resume از وضعیت همین بخش و `STAGE47_ROUND0_HANDOFF_2026-11-09.md` استفاده شود.

- ورودی: `EGUNSENTIA-RED-CLAW-HOUSEHOLD-EXPANSION-CP9-STAGED-2026-11-09.zip`؛ SHA-256: `096929f9bc35575b8c9c19b311a7fef17c9e4623b073c50ac84403807c56e690`.
- فایل دریافت‌شده Staged CP9 Extension است؛ آرشیو خالص CP9 با SHA مورد انتظار پرامپت در ورودی نبود. manifest مرحله‌ای، ۶۴۰ فایل پایه، ۳۰ افزودنی، ۸ تغییر و صفر حذف را نشان می‌دهد؛ تمام hashهای ثبت‌شده تطبیق داده شدند.
- **Round 0: انجام‌شده** — archive/ZIP/inventory، handoffها، وضعیت منبع، وابستگی‌ها و baseline tests بررسی شدند. هیچ منطق بازی یا Canon تغییر نکرد.
- **Round 1: بعدی** — ممیزی و hardening سیستم موجود Private Relations & Dynastic؛ فقط اصلاح gap اثبات‌شده، بدون reimplementation.
- **Round 2: پس از Round 1** — audit roster/genealogy/timeline و پوشش ۱۹ فیلد پروفایل؛ V4.1 کامل، V4.5 و دفتر معتبر Floor 7 همچنان ورودی‌های مفقودند.
- **Round 3: پس از Round 2** — باقیماندهٔ Gate 2 به ترتیب پرامپت؛ Gate 2 فعلاً PARTIAL، Political Capital فاقد قرارداد authoritative است و persistence/browser E2E اثبات نشده.
- **Round 4: پس از Round 3** — dependency recovery و full test/typecheck/lint/build/browser verification. اکنون `node_modules` وجود ندارد؛ Zod، TypeScript type definitions، Vite و ESLint غایب‌اند.
- Red Claw Household Expansion صرفاً staged و proposal-bearing است: ۷۹ مورد توسعه پیشنهادی نیازمند تصمیم مالک‌اند؛ ساختار ۱۰۰ کارت پاس شده، اما سیستم کامل خانوار/اشغال/خدمات/رویدادهای پایدار تحویل نشده است.
- هیچ‌گونه Browser-verified، Integration-tested برای backend پایدار یا Production-verified ادعا نمی‌شود.

**Round 0 verdict:** ممیزی ورودی برای بستهٔ staged تکمیل شد؛ این verdict نه تأیید هش آرشیو خالص CP9، نه CP10، نه بستن Gate 2 و نه مجوز انتشار است.

## Gate 0 — Freeze / baseline
- [x] تأیید SHA-256 و extract مستقل CP2 در working copy مجزا؛ ZIP اصلی CP2 و CP1 دست‌نخورده ماندند
- [x] تعیین Node/npm دقیق: Node `v22.16.0` و npm `10.9.2`
- [ ] نصب موفق `npm ci` — **BLOCKED**: `registry.npmjs.org` با `EAI_AGAIN` resolve نشد و npm cache خالی بود
- [x] بازسازی setup محلی غیرمحرمانه `.grok/app-env.json` با `VITE_AUTH_ENABLED=true`؛ فایل ignored و خارج از ZIP تحویلی است
- [ ] اجرای کامل `npm test`, `npm run test:game`, `npm run typecheck`, `npm run lint`, `npm run build` — **BLOCKED** به‌علت وابستگی‌های نصب‌نشده؛ جزئیات در `STAGE47_GATE0_REPORT_2026-11-09.md`
- [x] `verify:canon` — PASS
- [ ] `verify:art` — INCOMPLETE؛ ۲۳ گروه هنری هنوز تصویر Raster نهایی ندارند
- [x] تفکیک تست‌های پاس‌شده از suiteهای load-failed و commandهای blocked؛ هیچ تستی حذف نشد
- [x] ساخت `README.md`, `.env.example`, `DEPLOYMENT.md`

**Gate 0 decision:** PARTIALLY COMPLETE / ENVIRONMENT BLOCKED. Do not mark the project build-verified or start a deploy. See `STAGE47_GATE0_EVIDENCE_2026-11-09.json`.

## Gate 1 — Online data/auth safety (P0)
- [x] `db.ts`: Production و تمام Vercel deployments بدون `DATABASE_URL` معتبر fail closed می‌شوند؛ URL غیر-PostgreSQL نیز رد می‌شود.
- [x] PGlite در Local قابل استفاده است؛ در Vercel Preview/Development فقط با `PGLITE_ALLOW_EPHEMERAL=true` فعال می‌شود؛ Vercel Production هرگز PGlite نمی‌پذیرد.
- [x] migration command از Build جدا شد؛ `npm run db:migrate` مرحله مستقل و صریح است.
- [x] migration order و نسخه‌های تکراری schema بررسی شد؛ فایل auth nested/root byte-identical است و migrator فقط root `migrations/*.sql` را می‌خواند.
- [ ] Neon test project/branch و migration smoke — **BLOCKED** تا دسترسی شبکه/حساب دیتابیس فراهم شود.
- [x] سیاست deployed Better Auth: HTTPS origin canonical، secret حداقل ۳۲ بایت، OAuth client اختصاصی و رد shared preview client؛ auth-off صریح در Vercel رد می‌شود.
- [x] creator-only allowlist دقیق بر اساس email و/یا user ID؛ محیط deployed بدون allowlist همه را رد می‌کند.
- [~] حفاظت routeها: تمام write/game endpoints بررسی ساختاری شدند و AL status route به auth middleware متصل شد؛ end-to-end مرورگر و آزمون نشست واقعی باقی است.
- [x] کلید AL فقط در متغیرهای server-side خوانده می‌شود؛ مدل‌های پیش‌فرض به `openai/gpt-oss-120b` و `grok-4.7` به‌روزرسانی و fallback ضمنی قدیمی حذف شد.
- [~] آزمون quota/refund/429/concurrency با تست‌های محلی موجود و Gate 1 پاس شد؛ درخواست واقعی provider، timeout شبکه و اعتبار کلید سازنده مسدود است.
- [ ] Save persistence پس از redeploy/restart/logout/login/device switch — **BLOCKED** تا Neon و محیط deployed واقعی موجود شود.

**Gate 1 decision:** PARTIALLY COMPLETE / EXTERNAL INTEGRATION BLOCKED. Policy and focused tests pass; no live DB, OAuth, AL provider, browser, or production verification has been performed. See `STAGE47_GATE1_REPORT_2026-11-09.md`.

## Gate 2 — Gameplay integrations
### Round 1 — Planner / NPC availability / crisis outcomes
- [x] Planner panel 12 is now the Planner; panel 46 is now World Time. The legacy alias/collision still requires a separate audit before it can be marked complete.
- [~] Live CAST availability is connected to Planner appointments; duration-window and same-NPC overlap checks are implemented. Personnel/Message/Cast/Evening Hall cross-panel consistency remains.
- [x] First-pass crisis outcome table applies stock and bounded Morale deltas by causal type; values are provisional gameplay tuning, not canon.
- [~] Gate-crisis target IDs are captured; resolved and failed outcomes update the affected Gate only. Chronicle notes and `crisisHistory` are written. Independent Event Ledger integration remains open.
- [x] Targeted gameplay integration tests: 14/14 pass.

### Round 2 — Event Ledger / Ceremonies / Investigation / Day Replay (CP6)
- [x] Shared Event Ledger append helper with stable-ID deduplication and a 500-row retention ceiling.
- [x] Add in-world year to new timeline entries; old records without year remain readable as legacy entries.
- [x] Route time advances, option commands, AL Delta events, decrees, ceremonies, investigation actions and crisis outcomes into the ledger.
- [x] Capture crisis outcomes produced during direct clock advance and Wait orders; avoid double-recording on repeated state application.
- [x] Ceremony workflow: schedule within one campaign year, same-day time validation, venue/person conflict checks, full-interval CAST availability, estimated cost, held/missed/cancelled outcomes, calendar synchronization and cost deduction only when held.
- [x] Add a separate, backward-compatible investigation case register; link existing clues, add player notes, track statuses and archive administratively without solving UNKNOWN facts.
- [~] Investigation lifecycle is generic and player-authored; automatic generation of individual missing-person files from authoritative missing-person records remains open because no complete source dataset/record contract was found.
- [x] Day Replay panel is read-only, grouped by year/date, chronological within the recorded day, based only on saved ledger rows.
- [x] Round 2 tests: 11/11 targeted PASS; all runnable script tests 387/387 PASS excluding Zod-dependent `scripts/game.test.mjs` which could not load.
- [~] Focused strict TypeScript check passed for six relevant modules and their resolved dependencies; full project typecheck remains blocked by missing `@types/node` and `vite/client`.
- [ ] Browser, persistence and visual verification remain unrun.

### Remaining Gate 2 work
- [ ] Council typed-effect adapter and no-double-spend guarantee across every decree/option path.
- [ ] Command → state → persistent save → UI receipt integration tests against a runnable save backend.
- [ ] NPC availability consistency across Planner, Personnel, Message, CAST and Evening Hall.
- [ ] Automatic missing-person file generation/integration once authoritative source records are identified; retain UNKNOWN where no evidence exists.
- [ ] Audit and resolve remaining legacy panel aliases without colliding with panel 24 Ministry Operations.
- [ ] Browser verification of panels 05, 19 and 34 and full Gate 2 workflows.

## Gate 3 — 65 panels / content
- [ ] 65/65 registry icon
- [ ] 65/65 archetype + place + views
- [ ] تکمیل body برای 24 generic panel
- [ ] DefaultPanelContent unreachable; regression test
- [ ] 403 options: typed effect, meaningful prerequisites, readable lock reason, actual forecasts, links to canon/NPC/faction/good
- [ ] inline attachTo + Orders fallback + Receipt + delayed consequence trace
- [ ] no option changes invalid/hidden state; no hidden numeric leakage
- [ ] all 8 archetypes have one meaningful e2e sample

## Gate 4 — UX and QA
- [ ] mobile 390x844 and desktop 1280x800
- [ ] zero horizontal overflow
- [ ] text scales/hit targets, keyboard, aria, reduced motion
- [ ] all 65 panel routes open
- [ ] full Playwright browser smoke and console check
- [ ] V4.1 fixture and older save migration
- [ ] `verify:canon`, `verify:art`; art structure gaps documented

## Gate 5 — private preview + stable link
- [ ] private GitHub repository and protected main branch
- [ ] Vercel Hobby project with private source, `vercel.app` domain
- [ ] Neon Free PostgreSQL URL and secret environment
- [ ] Better Auth secrets/URL/issuer/client and correct callback URLs
- [ ] Groq or xAI secret/model and request limits
- [ ] Vercel Production deployment protected by app auth/owner allowlist
- [ ] validate usage limits/cold starts; no card/billing upgrade required
- [ ] test backup/export/restore and rollback

## ممنوعیت‌های ادامه کار
- Do not put API keys in chat, source, commit, logs or browser-exposed env.
- Do not allow PGlite to be the Production DB.
- Do not expose game URL without authentication even for personal use.
- Do not change established canon or resolve UNKNOWN by invention.
- Do not generate visual/audio assets against the existing owner scope.
- Do not report an unexecuted test/build/browser/production status as PASS.

## Checkpoint policy
پس از هر Gate یا بخش کامل: ZIP کامل پروژه، SHA-256، inventory/hash comparison، Worklog، test evidence و exact next step. CP1 و Original archives هرگز overwrite نشوند.

## CP5 update — Gate 2 Round 1 (2026-11-09)
- [x] CP4 used as immutable base; all 605 base files preserved.
- [x] Planner/World Time routing corrected; live CAST availability and NPC double-booking protection implemented.
- [x] Gate crisis target tracking and stock/Morale/Gate outcome path implemented.
- [x] Targeted tests 14/14; script suite 376/376 (excluding Zod-dependent `game.test.mjs`); MJS syntax 86/86; TS/TSX syntax transpile 131/131; Canon PASS.
- [ ] Typecheck/build/browser/live integrations remain blocked or unverified because npm dependency installation is unavailable (`EAI_AGAIN`).
- [ ] Ceremony, missing-person investigations, Day Replay, Event Ledger, Council typed effects, and cross-panel NPC consistency remain open.
- **CP5 decision:** PARTIAL CHECKPOINT. Gate 2 remains in progress; do not treat as release candidate.

## CP6 update — Gate 2 Round 2 (2026-11-09)
- [x] CP5 used as immutable base; all 611 base files preserved.
- [x] Event Ledger made year-aware and idempotent with 500-row cap; option, AL Delta, time, crisis, decree, ceremony and investigation paths wired to it.
- [x] Ceremony scheduling and outcome workflow added to panel 05.
- [x] Separate investigation case register added to panel 19; clue classification and UNKNOWN status are not upgraded by linking/archiving.
- [x] Read-only Day Replay added to panel 34.
- [x] Strict focused typecheck: 6 modules; MJS syntax: 87 files; TS/TSX transpile: 132 files with zero syntax errors; Canon PASS.
- [x] Runnable script tests: 387/387 PASS; targeted Gate 2 Round 2 tests: 11/11 PASS.
- [ ] `scripts/game.test.mjs` blocked because `zod` is not installed; npm registry access was unavailable in this environment.
- [ ] Full typecheck blocked by missing type definitions; production build blocked because local Vite binary is absent. Browser, Neon/OAuth/provider and Production verification not run.
- **CP6 decision:** Gate 2 Round 2 delivered as a complete source checkpoint; Gate 2 overall remains PARTIAL pending Council typed effects, end-to-end persistence/UI verification, cross-panel NPC consistency, specialized missing-person data integration and browser checks.

## CP7 update — Gate 2 Round 3 (2026-11-09)
- [x] CP6 used as the immutable base; all 620 base files are preserved.
- [x] Council decree now has a typed deterministic effect plan and a single store transaction for treasury debit, P4 spent marks/hours, queue, receipt, news, Chronicle and Event Ledger.
- [x] Decree idempotency is global to order + campaign day + minute (not per ministry seat); the persisted key survives P4 normalization and the UI disables all sponsoring-seat buttons after the stamp.
- [x] `decideCouncil` is limited to hearing/delegation and cannot produce a partial decree. Generic option execution cannot route the Council decree around the atomic action.
- [x] Treasury Marks costs are validated before execution; insufficient balances and malformed Marks costs are rejected without clamping the treasury to zero.
- [x] CAST, Personnel (panel 26), CAST (panel 36), Messages (panel 01), Planner (panel 12), and Evening Hall (panel 33) use the same live CAST availability calculation where relevant. Missing matches remain explicitly unknown.
- [x] Added player-supplied `Missing-person inquiry` case type requiring a source reference; the subject and initial source remain `PLAYER-SUPPLIED / UNVERIFIED` and do not create or confirm canon characters.
- [x] `appliedCouncilCommandIds` normalization and retention are aligned at 500 entries; cross-seat repeat stamping is rejected.
- [x] Catalog option lookup now correctly types the declared `hours` field; focused strict TypeScript checking exposed and resolved the previous mismatch.
- [x] Tests: 29/29 focused Gate 2 Round 3 tests PASS; 400/400 runnable script tests PASS excluding `scripts/game.test.mjs`, which cannot load because `zod` is not installed.
- [x] Strict focused TypeScript check passed for P4 simulation, council, investigation cases, and option execution with resolved dependencies. Eight changed TS/TSX files transpile without syntax diagnostics; 74 MJS files pass `node --check`.
- [x] Canon verification PASS: 65 panel registry, invariants, 167 assets, preserved art and all option catalogs.
- [~] The option catalog declares positive `politicalCapital` cost on 182/403 options, but no authoritative political-capital balance/ledger exists. 26 Wait-category options also carry the value; no arbitrary resource balance or blanket block was invented. This must be resolved in a dedicated economy/design pass.
- [~] Full project typecheck, Build, `scripts/game.test.mjs`, browser QA, persistence against a live DB and AL integration remain BLOCKED/NOT RUN due missing installed dependencies and unavailable external integrations.
- **CP7 decision:** Round 3 is delivered as a complete source checkpoint; Gate 2 overall remains PARTIAL. Next: audit political-capital semantics and implement full generic option command idempotency/persistence tests once the app dependencies can be installed, then proceed through remaining gameplay and browser integration.

## CP7 update — Gate 2 Round 3 (2026-11-09)
- [x] CP6 used as immutable base; all 620 base files preserved.
- [x] Typed Council Decree plan and one store transaction now commit P4, treasury Marks, work hours, queue, receipt, News, Chronicle and Event Ledger.
- [x] Decree idempotency is global to order + campaign day + minute, not ministry seat; a second seat cannot stamp the same decree again in that minute. The UI disables all seat buttons after one stamp.
- [x] `decideCouncil` remains for hear/delegate only; generic option route cannot issue a partial Council decree.
- [x] Marks balance/cost is validated; invalid or unaffordable Marks orders do not execute or silently clamp the balance to zero.
- [x] Personnel (26), CAST (36), Messages (01), Planner (12), Cast side panel, and Evening Hall (33) use the shared live CAST availability projection where applicable.
- [x] Added a player-supplied missing-person inquiry with mandatory source reference and explicit unverified provenance; no canon person or disappearance is inferred.
- [x] Persisted decree idempotency normalization is aligned at 500 entries; CatalogOption structural typing now includes its declared hours and other cost fields.
- [x] Verification: 29/29 focused tests PASS; 400/400 runnable script tests PASS excluding `scripts/game.test.mjs` (blocked because Zod is absent); focused strict TypeScript check PASS; 8 changed TS/TSX transpile checks PASS; 74 MJS syntax checks PASS; Canon PASS.
- [~] 182/403 catalog options have positive `politicalCapital` cost, but no authoritative balance/ledger exists. This is not silently treated as paid and no arbitrary balance was invented. 26 Wait-category items also carry this field, so blanket-blocking it would break existing time progression; the meaning must be resolved in the economy design pass.
- [~] Full project typecheck, Build, Zod-dependent game tests, browser QA, live PostgreSQL/Better Auth and AL-provider verification remain BLOCKED/NOT RUN.
- **CP7 decision:** Round 3 delivered as an independently verified source checkpoint. Gate 2 overall remains PARTIAL; CP7 is not a release candidate.

## CP8 update — Gate 2 Round 4 (2026-11-09)
- [x] CP7 used as immutable base; all 626 base files are preserved.
- [x] Generic V4.5 option executions now derive a stable identity from option ID + world day + minute; successful executions persist the identity in P4 state, and repeated execution in the same minute is rejected before `runOption`.
- [x] Generic option idempotency history is normalized on restore and bounded to 500 identities; legacy saves default to an empty history. The actual save serializer/parser round-trip was tested.
- [x] Panel identity routing is explicit: `resolveCanonicalPanelId` resolves all 65 current panel IDs without redirect collisions; `resolveLegacyPanelTarget` applies the historical redirect table; `resolvePanelId` retains legacy-first behavior for compatibility.
- [x] Audited the 11 legacy redirect entries: all sources collide with current canonical panel IDs, all targets point to registered panels, and the current mapping/property values agree. No existing source caller of `resolvePanelId` was found; do not repurpose legacy migration references without explicit mode.
- [x] Added 8 focused Gate 2 Round 4 tests (option identity, dedupe/cap, normalization, real Save round-trip, 65 canonical IDs, 11 legacy redirects, store wiring, Political Capital inventory); 8/8 PASS.
- [x] Runnable script suite excluding the dependency-blocked `scripts/game.test.mjs`: 408/408 PASS (includes the 8 new tests). Canon verification PASS. 89 MJS files pass `node --check`; four changed TS modules pass syntax checks; focused strict TypeScript check for the new option identity module + desk metadata + panel registry PASS.
- [~] `scripts/game.test.mjs` is BLOCKED because Zod is absent; the four separate TS suites have 6 passing tests and 2 suite-load failures because `@tanstack/react-start` and `jose` are absent. Full `npm test` therefore exits non-zero for missing packages, not a demonstrated assertion regression.
- [~] Full `npm run typecheck` BLOCKED by missing `@types/node` and `vite/client`; `npm run build` BLOCKED because Vite is not installed in this workspace. Browser QA not run.
- [~] Political Capital remains unresolved: 182/403 options specify a positive politicalCapital cost, including all 26 Wait options. There is no authoritative spendable balance/ledger; no new resource balance was invented and these costs remain a design/economy blocker.
- **CP8 decision:** Round 4 is delivered as a source checkpoint, not a release candidate. Next: verify generic option execution and receipts with a fully installed Zustand/app dependency environment; resolve Political Capital economy semantics from authoritative design data; continue remaining Gate 2 workflows.

## CP9 — Private Relations & Dynastic Round 1 (2026-11-09; independent workstream)
- [x] CP8 used as immutable base; CP8 remains preserved.
- [x] Added backward-compatible versioned Private Relations state and panel 17 UI.
- [x] Added 25 named adult character dossiers based only on compiled Canon cards; 15 fields are projected; absent fields remain UNKNOWN.
- [x] Added NPC-led private request flow, no-penalty refusal/withdrawal, free-to-decline evidence, independent safeguards for command/staff relationships, engagement and separately evidenced marriage formalization.
- [x] Added evidence-backed visibility/disclosure, boundary-breach review, audience-specific reputation impact, suspicion-only AL pregnancy updates and owner-verified medical progression.
- [x] Added dynastic review, Event Ledger/Chronicle events, Save validation and AL Delta/compact-state integration.
- [x] Tests: 15/15 feature tests; 18/18 Save validation tests; 421/424 runnable repository script tests (three local `.grok/app-env.json` environment expectations failed; Zod-dependent `game.test.mjs` excluded); Canon PASS; 7 changed TS/TSX transpile checks PASS.
- [~] Lore dossiers remain partial relative to missing sources: full V4.1 master and V4.5 update prompt absent; 8 of 25 profiles have incomplete selected fields; 6 profiles lack BODY field; fifth permanent Iron Guard member remains UNKNOWN.
- [~] Full project typecheck BLOCKED by missing `@types/node` and `vite/client`; Build BLOCKED by absent Vite; browser, DB/OAuth, live AL and Production checks NOT RUN. Art verifier remains incomplete on pre-existing asset groups.
- **CP9 decision:** Private Relations feature implemented at source and focused-test level; not Browser/Production verified. No NSFW or explicit-content mode added. Gate 2 remains independently PARTIAL and is not closed by CP9.

## Stage 47 continuation — Private Relations hardening Round 1 (2026-11-09; partial)
- [x] Round 0 audit checkpoint used as immutable parent; work performed in a separate working copy.
- [x] Audited and hardened existing CP9 Private Relations transitions, marriage evidence, disclosure monotonicity, Save normalization, request-history retention, boundary idempotency, pregnancy-state monotonicity and birth-record linkage.
- [x] Kept the three Canon official wives and Elara former-partner distinction unchanged; 12 Red Claw PROPOSED_EXPANSION dossiers remain non-Canon. Neutral conversation remains distinct from romantic/medical/dynastic transitions.
- [x] Added sourceStatus/historyDisposition to AL compact state and corrected the AL roster instructions to distinguish 25 Canon records from 12 proposed dossiers.
- [x] Focused tests 39/39 PASS; full script suite 437/441 (four failures due missing zod and local app-env); Canon verifier PASS; Red Claw verifier PASS with warnings; seven changed TS/TSX syntax-transpile checks PASS.
- [~] Typecheck BLOCKED (missing @types/node and vite/client); Build BLOCKED (Vite absent); lint BLOCKED (ESLint absent). No dependency/lockfile change was made.
- [~] No real AL, persistent DB commit/reload, browser, staging or Production workflow was exercised.
- [~] A4 remains partial: no authoritative child/birth registration pathway exists. Existing children are historical and lack pregnancyId/birthDay links; no new child or parentage was created. Legacy pregnancy startedDay cannot be guessed.
- **Round 1 decision:** partial source hardening checkpoint CP10 delivered; Workstream A and Gate 2 remain PARTIAL. Next: establish an evidence-backed child/birth registration contract before claiming A4 complete, then proceed to Round 2 Canon/roster/genealogy audit-only. Missing V4.1 master, V4.5 update prompt and full Floor 7 genealogy remain owner/source blockers.


## Round 2 — Canon / character / genealogy audit (2026-11-09)

- [x] Audit-only review of compiled Canon cards, atlas, excerpts, Private Relations roster, V4.1 data, Red Claw household registry and available expansion dossiers.
- [x] Separate 25-person core PR roster from 12 PROPOSED_EXPANSION history rows; identify two additional adult female Canon cards outside core roster.
- [x] Produce per-character coverage matrix, Canon-vs-proposal timeline, genealogy edge audit, 100-card provenance report, source register and conflict/risk register.
- [x] Preserve all UNKNOWN values; no lore approvals or Canon changes.
- [~] Full V4.1 Master missing; full V4.5 prompt missing; Floor 7 genealogy ledger contents missing. Edge-level provenance issues remain unresolved.
- [x] Canon verifier PASS; Red Claw verifier PASS with documented warnings.
- **Round 2 disposition:** Audit delivered; no character-lore expansion approved or applied. Next per sequence: Round 3 / Workstream C Gate 2 gameplay, beginning with council typed-effect adapter and atomic resource reservations.


## CP12 — Gate 2 Round 3 Part 1 (2026-11-09; partial)
- [x] CP11 used as immutable parent; no parent file removed.
- [x] Council panel 24 uses the authoritative `24-OPT-02` RichOption and shared `runOption` typed-effect pipeline; removed parallel hand-built decree effects and fabricated fallback costs/delays.
- [x] Added preflight resource reservation for Marks, hours, explicit resource costs and negative typed Stock effects. Insufficient balance rejects before candidate-state mutation; resource receipts record numeric changes.
- [x] NPC mood remains optional/save-safe; Council event/news/chronicle/queue and minute-based idempotency are wired through the shared execution path.
- [x] Round 3 focused tests 27/27 PASS; related Gate 2/Save/Private Relations 96/96 PASS; scripts suite 443/444 (game suite blocked on missing `zod`); Canon PASS; Red Claw PASS with existing warnings; syntax transpile checks 9/9 PASS.
- [~] Political Capital remains unresolved: 182/403 options positive, including all 26 Wait options; no authoritative balance/ledger. Preserve CP8 decision: do not invent a balance or blanket-block Wait; cost is visibly not deducted/not marked paid. Requires authoritative design/owner decision.
- [~] Full typecheck BLOCKED by missing `@types/node` and `vite/client`; Build BLOCKED because Vite is absent; Lint BLOCKED because ESLint is absent. No dependencies/lockfile changed.
- [ ] C3 durable command→transaction→persistent flush→reload is not yet Integration-tested. No DB/backend/browser or Production verification run. Next: audit and test C3 against actual existing backend adapter; then C4–C7 in prompt order.
- **CP12 decision:** deliver this bounded Round 3 Part 1 source checkpoint only. Gate 2 stays PARTIAL; CP12 is not Build-verified, Browser-verified, or a release candidate.


## Round 3 Part 2 — C3 persistence wiring (CP13, 2026-11-09)

- [x] Central snapshot autosave wired after hydration; 400 ms debounce; non-snapshot notices ignored.
- [x] Identical in-flight save flushes coalesced; existing latest-save queue and revision CAS preserved.
- [x] Storage class and Receipt status distinguish persistent DB, ephemeral PGlite and device-only copies.
- [x] Empty account with no row is not falsely marked as an already-saved local seed.
- [x] Unit tests 58/58; script suite excluding `scripts/game.test.mjs` 449/449; Canon PASS; Red Claw PASS with warnings.
- [ ] C3.1–C3.10 real backend integration: BLOCKED by unset `DATABASE_URL`, absent DB dependencies and no PostgreSQL service. Must test actual player-command path through commit/reload/restart, failure injection, retries/idempotency and concurrency.
- [ ] C3 Receipt reconstruction after persistent reload and browser verification.
- [ ] C4 NPC availability, C5 missing-person integration, C6 panel aliases and C7 browser QA remain not started in this execution sequence.


## CP14 — Gate 2 / Round 3 Part 3: C3 source audit (2026-11-09)

- [x] CP13 restored in a separate working copy; SHA-256 and ZIP integrity re-verified; CP13 remains immutable.
- [x] Audited `db-runtime-policy`, DB adapter, authenticated Save server functions, expectedRevision CTE, migration runner/transaction lock, autosave queue, command identity and Receipt UI.
- [x] Re-ran focused save/persistence tests: 58/58 PASS; runnable scripts excluding Zod-dependent `scripts/game.test.mjs`: 449/449 PASS; Canon verifier PASS.
- [x] Added C3.1–C3.10 acceptance matrix and exact source-audit handoff.
- [~] Found C3.8 UI gap: `p4.lastReceipt` is stored in campaign snapshot, but `receiptOpen` and `receiptPersistence` are local React state and are not reconstructed after reload.
- [~] `npm ci --no-audit --no-fund` timed out at 180 seconds; partial `node_modules` removed; package-lock hash unchanged. Full typecheck/build/lint remain blocked.
- [~] No PostgreSQL URL/auth configuration, DB service/client or Docker; no real migration, command commit, restart/reload, idempotency retry, two-session concurrency or browser test ran.
- **CP14 decision:** source-audit/documentation-only partial checkpoint. C3 remains BLOCKED / PARTIAL; Gate 2 remains PARTIAL. Next work must remain in C3: obtain isolated persistent backend, recover dependencies, address Receipt reconstruction, then complete C3.1–C3.10 before C4.


## CP15 — Gate 2 / Round 3 Part 4: C3 Receipt reconstruction (2026-11-09)

- [x] Continue from immutable CP14 in a separate working copy; preserve CP14 and all earlier parents.
- [x] Add a receipt fingerprint helper and shared Receipt persistence type contract.
- [x] Reconstruct Command Deck and Council Receipt visibility from persisted `p4.lastReceipt` after component mount/reload.
- [x] Derive `account-committed` / `ephemeral` only from confirmed `loadSave` / `flushSave` storage classification; Receipt payload presence alone never proves persistence.
- [x] Keep Receipt persistence status transient/runtime-only; do not add it to `persistKeys`, `GameSnapshot`, Save schema or migrations.
- [x] Avoid duplicate display of Council decree Receipt in generic Command Deck.
- [x] Focused persistence + Receipt tests: 66/66 PASS; runnable script suite excluding the Zod-blocked `scripts/game.test.mjs`: 457/457 PASS; Canon verifier PASS.
- [x] Changed TS/TSX transpile checks: 7/7 PASS; declaration parser check: PASS. These are syntax checks only.
- [~] Full `npm test`: 457 PASS / 1 blocked (`zod` import in `scripts/game.test.mjs`); not a fully green full-suite run.
- [~] `verify:red-claw`: PASS with 14 existing provenance/chronology warnings. Art verifier: FAIL/INCOMPLETE (167 registered assets; 0 generated raster; 23 incomplete groups).
- [~] Typecheck BLOCKED (`@types/node`, `vite/client` unavailable); build BLOCKED (`vite` permission/executable error); lint BLOCKED (`eslint` permission error). Dependency install was not completed.
- [~] C3.8 Receipt reconstruction is implemented and unit/source-contract tested, but Browser-verified and PostgreSQL-restoration verified remain NOT RUN.
- [~] C3.1–C3.10 live persistence integration remains BLOCKED: no `DATABASE_URL`, auth configuration, PostgreSQL service/client or Docker; no migrations, transaction commit/reload/restart, network retry, failure injection or multi-session concurrency test.
- **CP15 decision:** source-level Receipt reconstruction partial checkpoint only. C3 and Gate 2 remain BLOCKED / PARTIAL. Continue C3 integration as soon as a protected isolated persistent backend and complete dependency environment are available; do not start C4 before C3 acceptance.

## CP16 — Round 3 Part 5: C3 failure-path and auth-boundary tests (2026-11-09; partial)
- [x] CP15 restored separately; archive hash `c61c1d6675147a173af6cf6998ccf576e666374ca6fd57f98645139c5920d47a` and ZIP integrity verified; parent immutable.
- [x] Added migration transaction unit tests for COMMIT failure and advisory-lock failure; rollback behavior and primary-error preservation asserted.
- [x] Added source-contract tests that Save endpoints are authenticated and account identity derives from `context.userId`, not client input.
- [x] Focused persistence/Receipt/DB/migration tests 70/70 PASS; runnable scripts excluding Zod-blocked game suite 461/461 PASS; Canon PASS.
- [~] Full `npm test` 461 PASS / 1 import-blocked suite (`zod`); app-data/auth 6 PASS / 2 import-blocked (`@tanstack/react-start`, `jose`). Typecheck/build/lint/check:auth blocked.
- [~] Real DB, migrations, command commit/reload/restart, post-commit lost-response retry, two-session concurrency, browser and Production checks remain NOT RUN; no `DATABASE_URL` or PG tools/service/Docker.
- [~] No genuine historical player Save fixture found; C3.6 has synthetic parser coverage only.
- **CP16 decision:** test-hardening partial checkpoint only. C3 remains BLOCKED/PARTIAL; Gate 2 remains PARTIAL. Continue C3.1–C3.10 against isolated persistent backend before C4.

## CP17 — Tactical D1 dependency environment audit (2026-11-09; partial)

- Confirmed `package.json` declares 57 dependencies and 14 devDependencies; all 71 direct ranges map to matching root lock declarations and lock entries. Zod is already a direct dependency (`^4.4.0`) pinned to `4.6.5`; no dependency-manifest correction is justified.
- `src/lib/game/delta.ts` directly imports Zod. The game test fails before assertions solely because the package is not installed.
- `npm ping` and `curl` cannot resolve `registry.npmjs.org` (`EAI_AGAIN` / DNS failure). npm's public status page reported package installation operational on 2026-11-09; classify this blocker as execution-environment DNS/egress, not a registry-wide outage.
- Focused tests 70/70 PASS; runnable scripts excluding the Zod-dependent game suite 461/461 PASS; full `npm test` 461 PASS / 1 blocked import; Canon PASS; Red Claw PASS with 14 warnings. Typecheck/build/lint remain blocked by absent installed tooling.
- No package, lockfile, gameplay, Canon, Save schema or migration changes. D1 complete, D2 blocked. On a network-enabled runtime, run `npm ci --no-audit --no-fund` from CP17 without changing lockfile, verify Zod 4.6.5, then run full tests/typecheck/lint/build. Return to C3 integration after dependency recovery; C4 remains gated.

## CP18 — Tactical D2 retry / permission isolation (2026-11-09; partial)

- Fresh CP17 working copy is writable; prior root-owned path was not modified.
- Default npm cache `EACCES` was bypassed with a separate writable cache; cache verification passes.
- Exact lockfile `npm ci` still fails during npm tarball download with `EAI_AGAIN` resolving `registry.npmjs.org`; verbose log also records npm's secondary `Exit handler never called!`.
- Official npm status page showed Package installation Operational; no global registry outage is inferred.
- 70/70 focused tests, 461/461 runnable tests (56 files), and Canon verifier PASS on fresh CP17 copy.
- `node_modules` cleanup complete; package manifest and lockfile hashes unchanged.
- D2 remains BLOCKED by execution-runtime DNS. C3/Gate 2 remain PARTIAL; do not start C4.

## CP19 — D2 runtime DNS/egress recheck (2026-11-09; partial)
- [x] CP18 parent SHA/sidecar and ZIP integrity reverified; fresh separate working copy created.
- [x] Registry DNS failure reproduced by `getent`, `npm ping` (`EAI_AGAIN`) and `curl`; direct-IP HTTPS probes to 1.1.1.1 and 8.8.8.8 also failed. System DNS/routing not changed.
- [x] Confirmed Zod remains manifest-declared (`^4.4.0`) and lock-pinned (`4.6.5`); no dependency declaration defect found.
- [x] Rechecked focused tests 70/70, runnable scripts excluding game suite 461/461, Canon PASS.
- [~] Game suite blocked by missing Zod; app-data/auth 6 PASS / 2 import-blocked; full `npm test` timed out at 120 seconds with no final summary; typecheck/build/lint blocked by missing dependencies.
- [~] D2 remains BLOCKED until a runtime with registry DNS/HTTPS is provided. Do not retry `npm ci` in the same network state or use unverified mirrors/tarballs.
- [~] C3 real PostgreSQL command/commit/reload remains blocked; C4 must not start before C3 acceptance.


## CP20 — Round 3 final closeout disposition (2026-11-09)

- [x] Final owner-directed attempt limited to Round 3; CP19 restored separately and immutable.
- [x] Reverified C1/Council/reservations and C6 resolver source tests; 27/27 PASS. Focused persistence/Receipt/DB/migration 70/70 PASS; runnable scripts excluding Zod-blocked game test 461/461 PASS; Canon PASS.
- [~] C2 remains blocked by absent authoritative Political Capital balance/ledger and spend/refund/Wait contract (182/403 positive; all 26 Wait options have positive field). No invented economy rule.
- [~] C3 remains blocked at real PostgreSQL command-to-commit-to-reload acceptance: no DATABASE_URL, database service/client or Docker/Podman; npm registry DNS EAI_AGAIN prevents exact-lock dependency installation.
- [~] C4/C5/C6/C7 are not accepted: C4 connected availability matrix gated by C3; C5 lacks authoritative missing-person records; C6 source-level aliases pass but browser restore/history is unverified; C7 browser workflows not run.
- [x] No Round 4 or later scope was started in this final attempt.
- **CP20 decision:** terminal checkpoint of this attempt, not a complete Round 3/Gate 2 acceptance. Gate 2 stays PARTIAL/BLOCKED; no release candidate.


## Round 4 — Dependency recovery and full verification (CP21, 2026-11-09; partial)

- [x] CP20 restored in a clean separate working copy; CP20 ZIP/sidecar verified and immutable.
- [x] D1: Node 22.16.0/npm 10.9.2; package manifest/lock audit; 71 direct declarations match; 471 locked package records; no packageManager/engines/project npmrc; package-lock hash unchanged.
- [~] D2: registry DNS/HTTPS blocked (`EAI_AGAIN`); exact-lockfile installation could not proceed. No mirror, dependency removal, package substitute or lockfile edit. 471 exact locked registry URLs listed in the dependency inventory.
- [x] D3: Gate2 27/27, focused persistence/Receipt/migration 70/70, runnable scripts 461/461, Canon PASS, Red Claw PASS with 14 warnings.
- [~] Full test suite blocked by Zod import; separate app/auth 6 PASS / 2 blocked; typecheck/build/lint blocked due to absent packages/tools. Art verifier remains incomplete; auth invariant cannot query a running Vite server.
- [~] No persistent DB service/config; C3 command-to-commit/reload/restart and DB concurrency not run. Browser tooling exists only partially; no Vite app server, no browser gameplay or responsive QA.
- **CP21 disposition:** Round 4 PARTIAL / BLOCKED. No source changes; Round 5 and later work not started. Resume only in a DNS-enabled environment with exact npm install, isolated persistent DB and actual browser QA.


## Round 5 Closeout — 2026-11-09 / CP22
- Source-bounded Workstream B executed after owner instruction to move beyond unfixable Round 4 environment blockers.
- Focused profile and household tests: 32/32 PASS; Canon verifier PASS.
- Six public RELATIONS profile fields added from cited Canon/approved V15 evidence. The Iron Guard count ambiguity is corrected and remains unresolved; no member was invented.
- 19-field coverage, relationship edge provenance, household/NPC, timeline, source register and unresolved-item matrices are in `docs/round5-character-lore/`.
- Canon expansion remains partial due absent complete V4.1/V4.5 source, BODY supplement §4.5.12, Family Ledger and authoritative guard roster. Proposals remain non-Canon.
- Round 6 has not started.

## Round 6 Part 1 — Character / Household / Presence / Event Replay integration (2026-11-09; CP23 partial)
- [x] CP22 restored from its verified archive into a fresh separate working copy; parent immutable.
- [x] Identified and repaired a real projection gap: Round 5 `RELATIONS` was not carried into CAST character cards or searchable/displayed in CastPanel; household registry omitted its relationship summary in administration UI.
- [x] Added `CastCard.relationships`; kernel maps Canon card `RELATIONS` and household registry `relationships` into CAST; CastPanel displays and searches it; Household roster displays recorded notes with a live-state caveat.
- [x] Added six source-backed Round 5 relationship notes to AL compact-state context using the correct profile IDs; notes explicitly cannot imply feelings, consent, relationship state or disclosure.
- [x] Verified the six profiles remain in shared `castNow()` presence projection; added Private Relations request → Event Ledger → Day Replay pure-function test.
- [x] Round 6 integration tests 5/5; combined focused suite 62/62; runnable scripts excluding missing-Zod game suite 467/467 across 57 files; Canon PASS; Red Claw PASS with 14 existing warnings.
- [~] Full `npm test` 467 PASS / 1 import-blocked suite (`zod`); typecheck missing node/vite types; build missing Vite; lint missing ESLint; AL runtime import blocked by missing `@tanstack/react-start`.
- [~] PostgreSQL save commit/reload/restart, browser/responsive UI, AL live call and production verification NOT RUN. Investigation Register remains player-supplied/unverified for missing-person inquiries; no automatic cases inferred from absence.
- **CP23 disposition:** Round 6 Part 1 source-implemented and unit-tested; Round 6 remains PARTIAL. Continue remaining integration in a later bounded part. Round 7 has not started.


## Latest continuation override — CP23 Round 6 Part 2 preflight (2026-11-10)

This section supersedes earlier historical resume instructions in this document where they conflict with the current CP23 continuation prompt. Current resume point is CP23 Round 6 Part 2, not Round 0/1/2/3/4. Round 6 Part 1 is complete only at source/unit level. On 2026-11-10 the official npm registry DNS/HTTPS preflight failed (`Temporary failure in name resolution`); exact `npm ci --no-audit --no-fund` was therefore not attempted. No package files changed. Independent tests and checks are recorded in `docs/round6-part2-preflight/`: 467/467 runnable script tests excluding `game.test.mjs`, 62/62 focused, Canon PASS, Red Claw PASS with 14 warnings, art structure PASS with 23 unfilled groups. Full npm test remains 467 pass / one Zod suite load failure; typecheck/lint/build blocked. AL runtime, persistent DB, browser and production checks remain NOT RUN. Gate 2 remains PARTIAL/BLOCKED; Political Capital contract unresolved. Round 7 must not start. Next: restore official registry DNS/HTTPS and exact lockfile install.

## Round 6 Part 2 follow-up — CP23 R6P2 recheck (2026-11-10; partial / blocked)

- [x] Restored the previous preflight checkpoint to a fresh copy; its 882-row inventory passed path/size/SHA verification. Package-lock SHA and 71 direct manifest/lock ranges remain exact.
- [~] Official npm registry remains unreachable at DNS (`EAI_AGAIN`; HTTPS ping curl exit 6). Per the continuation rules, `npm ci --no-audit --no-fund` was not attempted.
- [x] Independent tests repeated: Round 6 5/5; combined focused 62/62; runnable scripts excluding missing-Zod `scripts/game.test.mjs` 467/467; Canon PASS; Red Claw PASS with 14 warnings; art structure PASS with 23 groups unfilled.
- [~] Isolated game suite import-blocked by absent Zod. `npm test` timed out after 180 seconds without a final TAP summary and is INCOMPLETE, not PASS. Typecheck (TS2688 node/vite types), lint (ESLint absent), build (Vite absent), and AL runtime import (`@tanstack/react-start` absent) remain blocked.
- [~] No DATABASE_URL/PostgreSQL tools or Docker/Podman; persistent DB integration NOT RUN. Chromium is installed, but no real app build/start; browser/responsive QA NOT RUN. Production verification NOT RUN. Separate CP14 Visual Asset Pack was not supplied.
- [x] No gameplay/source, Canon, Save, schema, migration, economy, package manifest/lockfile, or existing art modifications; temporary app-env removed.
- **Decision:** Round 6 remains PARTIAL; Gate 2 remains PARTIAL/BLOCKED; Political Capital contract unresolved; Round 7 not started. Exact next action is still official registry DNS/HTTPS recovery, followed by exact-lock `npm ci` and real AL/DB/browser acceptance.
- Evidence: `docs/round6-part2-followup/` and WORKLOG-72.
