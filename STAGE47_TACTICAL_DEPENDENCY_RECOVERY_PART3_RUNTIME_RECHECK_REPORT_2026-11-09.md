# EGUNSENTIA — Stage 47 / Tactical Dependency Recovery Part 3
## بازآزمایی D2، DNS/egress و صحت‌سنجی قابل‌بازتولید در CP18

**تاریخ:** ۹ نوامبر ۲۰۲۶  
**والد immutable:** `EGUNSENTIA-STAGE47-POST-CP17-TACTICAL-DEPENDENCY-RETRY-PERMISSION-DNS-AUDIT-PARTIAL-CP18-2026-11-09.zip`  
**SHA-256 والد:** `78149d2064419ff1c3e5d6d44b4a7617a2ac4b9dded089e4df776ab328f32ab7`  
**این تحویل:** CP19 — runtime dependency/DNS recheck؛ نه dependency-recovered، نه Build-verified، نه Integration-tested، نه Release Candidate.

## 1. رأی اجرایی

**D1 = Complete؛ D2 = BLOCKED؛ C3 = BLOCKED / PARTIAL؛ Gate 2 = PARTIAL.**

در CP18، بسته و sidecar بررسی و ZIP بدون خطا استخراج شد. در runtime جاری، مشکل DNS دوباره مستقل از npm بازتولید شد:

- `getent ahosts registry.npmjs.org` هیچ آدرسی برنگرداند (exit 2).
- `npm ping --fetch-retries=0 --fetch-timeout=8000` با `EAI_AGAIN getaddrinfo registry.npmjs.org` شکست خورد.
- `curl -I https://registry.npmjs.org/` با `Could not resolve host` شکست خورد.
- متغیرهای HTTP(S)/ALL proxy خالی هستند؛ `npm config get registry` همان `https://registry.npmjs.org/` و `offline=false` را نشان می‌دهد.
- درخواست HTTPS مستقیم به IPهای عمومی DNS یعنی `1.1.1.1` و `8.8.8.8` نیز با `curl (7) Could not connect` شکست خورد. این فقط نشان می‌دهد مسیر خروجی مستقیم از همین runtime در دسترس نیست؛ هیچ تغییری در resolver یا routing سیستم اعمال نشد.

با توجه به این preflight، `npm ci` در این Part مجدداً اجرا نشد؛ تلاش CP18 از قبل fetch failure با `EAI_AGAIN` را ثابت کرده است. از تکرار install بی‌حاصل جلوگیری شد.

## 2. هویت و وضعیت Zod

- `package.json`: `dependencies.zod = ^4.4.0`.
- `package-lock.json`: نسخهٔ دقیق `4.6.5`، URL رسمی tarball و integrity digest ثبت‌شده.
- `src/lib/game/delta.ts`، خط ۱، `z` را از `zod` import می‌کند.
- `npm cache ls zod`: ورودی ندارد.
- جست‌وجوی مسیرهای عمومی/اشتراکی local runtime، پوشه یا tarball مربوط به Zod پیدا نکرد.
- `node_modules` در CP18 working copy موجود نیست؛ `npm ls zod` در این وضعیت `(empty)` می‌دهد.

نتیجه: این یک مشکل نصب/دسترسی بسته است، نه نبود declaration در manifest. هیچ Zod جایگزینی ساخته نمی‌شود، هیچ import حذف نمی‌شود و manifest یا lockfile تغییر نمی‌کند.

## 3. بازآزمایی روی CP18 working copy

ابتدا CP18 با ۷۹۸ عضو استخراج شد. فایل `.grok/app-env.json` فقط برای تست‌های وابسته به workspace به‌طور موقت شامل `VITE_AUTH_ENABLED=true` شد و پس از timeout و تست‌ها حذف شد.

| بررسی | نتیجهٔ مشاهده‌شده | طبقه‌بندی |
|---|---|---|
| ZIP CP18 SHA / integrity | SHA با sidecar برابر؛ `unzip -tq` PASS | PASS |
| Focused persistence/Receipt/DB/migration | 70/70 PASS | Unit-tested |
| Runnable script tests بدون `scripts/game.test.mjs` | 461/461 PASS؛ 56 فایل | Unit-tested |
| `node scripts/verify-canon.mjs` | PASS | Unit-tested |
| `scripts/game.test.mjs` مستقیم | `ERR_MODULE_NOT_FOUND: zod` پیش از assertions | Blocked |
| App-data/auth batch | 6 PASS / 2 import-blocked (`@tanstack/react-start`, `jose`) | Partial / Blocked |
| `npm test` | فرمان در سقف ۱۲۰ ثانیه timeout شد؛ آخرین subtest مشاهده‌شده #346؛ final summary تولید نشد | Timeout / Incomplete؛ نه PASS و نه FAIL assertion |
| `npm run typecheck` | TS2688 برای `node` و `vite/client` | Blocked |
| `npm run build` | `spawn vite ENOENT` | Blocked |
| `npm run lint` | `eslint: not found` | Blocked |
| PostgreSQL / browser / production | اجرا نشد | Not run |

توجه: ۴۶۱/۴۶۱ مربوط به مجموعهٔ runnable است که `scripts/game.test.mjs` را کنار می‌گذارد؛ این عدد نتیجهٔ کامل `npm test` نیست. اجرای `npm test` در این نوبت timeout شد و نباید از آن نتیجهٔ کامل ساخت.

## 4. D2 environment matrix

| شناسه | موضوع | نتیجه | وضعیت |
|---|---|---|---|
| D2-CP18 | صحت والد | 798 entries؛ ZIP سالم؛ hash/sidecar برابر | PASS |
| D2-REGISTRY | `npm ping` | `EAI_AGAIN` در DNS | BLOCKED |
| D2-CURL | HTTPS به registry | hostname resolve نمی‌شود | BLOCKED |
| D2-DOH-CF | HTTPS مستقیم به 1.1.1.1 | اتصال برقرار نشد؛ curl exit 7 | BLOCKED |
| D2-DOH-GOOGLE | HTTPS مستقیم به 8.8.8.8 | اتصال برقرار نشد؛ curl exit 7 | BLOCKED |
| D2-ZOD | cache و local paths | tarball/package پیدا نشد | BLOCKED |
| D2-NPMCI | install در این Part | پس از DNS preflight تکرار نشد؛ CP18 قبلاً fail شده | Not retried by design |
| D2-LOCK | `package-lock.json` | SHA بدون تغییر | PASS |
| D2-CLEANUP | app-env / node_modules / npm | فایل موقت حذف؛ node_modules absent؛ فرایند install باقی نماند | PASS |

## 5. دستورهای بازتولید

```bash
node --version
npm --version
npm config get registry
npm config get offline
getent ahosts registry.npmjs.org
npm ping --fetch-retries=0 --fetch-timeout=8000
curl --connect-timeout 4 --max-time 8 -I https://registry.npmjs.org/
curl --noproxy '*' --connect-timeout 3 --max-time 6 -sS \
  -H 'accept: application/dns-json' \
  'https://1.1.1.1/dns-query?name=registry.npmjs.org&type=A'
curl --noproxy '*' --connect-timeout 3 --max-time 6 -sS \
  -H 'accept: application/dns-json' \
  'https://8.8.8.8/resolve?name=registry.npmjs.org&type=A'
```

تست‌ها:

```bash
node --experimental-strip-types --test \
  scripts/receipt-persistence.test.mjs scripts/save-autosave.test.mjs \
  scripts/save-queue.test.mjs scripts/save-lifecycle.test.mjs \
  scripts/save-errors.test.mjs scripts/save-revision.test.mjs \
  scripts/save-validation.test.mjs scripts/db-runtime-policy.test.mjs \
  scripts/migration-transaction.test.mjs

mapfile -t tests < <(find scripts -maxdepth 1 -name '*.test.mjs' \
  ! -name 'game.test.mjs' -print | sort)
node --experimental-strip-types --import ./scripts/register-ts.mjs --test "${tests[@]}"
node scripts/verify-canon.mjs
```

## 6. یکپارچگی پروژه

- `package.json` و `package-lock.json` تغییر نکرده‌اند.
- lockfile SHA-256: `72b88b98db67a9954c77d88b4415671d566298113e948cd03825a20049e5184b`.
- هیچ Canon، Save schema/migration، gameplay/economy rule یا secret تغییر نکرد.
- هیچ فایل `node_modules` یا cache به checkpoint اضافه نشده است.
- فایل موقت `.grok/app-env.json` حذف شده است.
- هیچ فایل والد CP18 حذف یا جایگزین نشده است.

## 7. تصمیم و next step

D2 در همین runtime به علت DNS/egress مسدود است. نصب را با registry mirror نامعلوم، tarball دستی یا package substitute دور نمی‌زنیم. گام بعد باید در runtime دارای DNS و HTTPS معتبر به `registry.npmjs.org` اجرا شود؛ سپس `npm ci --no-audit --no-fund` با همان lockfile، `npm ls zod` و ESM smoke test اجرا شوند. پس از نصب کامل، full tests، typecheck، lint و build اجرا می‌شوند.

پس از D2، بازگشت به C3.1–C3.10 و آزمون command → authenticated validation → SQL commit → persistent reload/restart → Receipt ضروری است. C4 شروع نمی‌شود تا C3 پذیرش شود.
