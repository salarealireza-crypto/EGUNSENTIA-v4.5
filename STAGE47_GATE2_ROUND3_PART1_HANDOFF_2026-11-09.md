# تحویل ادامهٔ پروژه — Round 3 / Part 1

تاریخ: ۹ نوامبر ۲۰۲۶  
Checkpoint: `EGUNSENTIA-STAGE47-POST-CP11-ROUND3-PART1-PARTIAL-CP12-2026-11-09.zip`  
والد مستقیم: CP11، فایل Canon / genealogy audit، SHA-256 `e5e15022b23da13436997dc7facdd4f4bce16ced022fcacc0727a6262a13f946`.

## وضعیت و نقطهٔ توقف

C1 در سطح کد اجرا و تست واحد پیش رفته است: Council پنل ۲۴ از `RichOption` authoritative و `runOption` مشترک استفاده می‌کند؛ هزینه‌ها و اثرهای منفی Stock قبل از mutation بررسی می‌شوند؛ و Store یک candidate state واحد را commit می‌کند. C2 نیز ممیزی شد، اما Political Capital همچنان قرارداد معتبر balance/ledger ندارد. تصمیم CP8 مبنی بر عدم ساخت موجودی فرضی و عدم مسدودسازی کلی Wait حفظ شد. مقدار مثبت این فیلد نه کسر و نه پرداخت‌شده فرض می‌شود؛ UI/Receipt آن را صریح می‌گویند.

**Round 3 تمام نشده است.** این تحویل فقط بخش نخست، یعنی Council typed adapter + reservation preflight + Political Capital source audit را پوشش می‌دهد.

## نقاط ورود کد

- `src/lib/game/sim/council.ts`: plan metadata و command identity.
- `src/lib/platform/options/execute.ts`: `reserveOptionResources`, `lockReason`, `runOption`, `runCouncilDecree`, typed `applyEffect`.
- `src/lib/game/store.ts`: action `stampDecree`.
- `src/components/game/V45PanelBody.tsx`: `CouncilBody`.
- `src/lib/game/sim/npc.ts`: optional mood in `NpcStatus`.

## فرمان‌های بازتولید آزمون

```sh
node --experimental-strip-types --import ./scripts/register-ts.mjs --test scripts/gate2-round3.test.mjs scripts/gate2-round4.test.mjs scripts/council-queue-identity.test.mjs
node --experimental-strip-types --import ./scripts/register-ts.mjs --test scripts/gate2-round2.test.mjs scripts/gate2-round3.test.mjs scripts/gate2-round4.test.mjs scripts/council-queue-identity.test.mjs scripts/private-relations.test.mjs scripts/save-errors.test.mjs scripts/save-lifecycle.test.mjs scripts/save-queue.test.mjs scripts/save-revision.test.mjs scripts/save-validation.test.mjs
node scripts/verify-canon.mjs
node --experimental-strip-types --import ./scripts/register-ts.mjs scripts/verify-red-claw-household.mjs
npm run typecheck
npm run build
npm run lint
```

در این محیط `node_modules` وجود ندارد. برای تکرار scripts suite بدون شکست‌های پیکربندی محلی، فایل موقت `.grok/app-env.json` با صرفاً `VITE_AUTH_ENABLED=true` ساخته و پس از آزمون حذف شده است. `scripts/game.test.mjs` به `zod` نیاز دارد؛ typecheck به `@types/node` و `vite/client`؛ Build به Vite؛ Lint به ESLint. تست‌های app-data/auth نیز در دو suite به `@tanstack/react-start` و `jose` نیاز دارند. هیچ‌کدام از این dependencyها نصب یا lockfile تغییر داده نشده است.

## گام بعد دقیق

1. Round 3 / C3: audit backend adapter و مسیر فعلی Save، سپس فقط در صورت وجود backend واقعی یا production-equivalent، آزمون command → validation → authorization → mutation → transaction commit → persistent flush → reload → UI receipt.
2. برای موفقیت یا شکست، هیچ‌گاه مستقیماً رکورد DB را دست‌کاری نکن؛ فرمان واقعی بازی باید از Store/command path عبور کند.
3. تا زمان تست commit و reload واقعی، C3 را Integration-tested ننام.
4. سپس C4 NPC availability، C5 missing-person integration، C6 panel aliases و C7 browser workflows را به ترتیب ادامه بده.
5. C2 را فقط با سند اقتصادی authoritative یا تصمیم مستند مالک حل کن؛ balance، income، recovery، cap یا Wait exemption حدس نزن.

## وضعیت پذیرش

- Implemented: Council typed adapter، resource preflight، shared runner، Store action wiring، UI lock/notice، numeric stock Receipt.
- Unit-tested: ۲۷/۲۷ focused tests؛ ۹۶/۹۶ related tests؛ scripts suite ۴۴۳/۴۴۴ (یک suite به‌علت zod بارگذاری نشد).
- Build-verified: خیر.
- Integration-tested / Browser-verified / Production-verified: خیر.
- Canon changes: صفر.
- فایل حذف‌شده از والد CP11: صفر.
