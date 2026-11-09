# EGUNSENTIA — Handoff پس از Dependency Recovery Part 3

**تاریخ:** ۹ نوامبر ۲۰۲۶  
**والد دقیق:** `EGUNSENTIA-STAGE47-POST-CP17-TACTICAL-DEPENDENCY-RETRY-PERMISSION-DNS-AUDIT-PARTIAL-CP18-2026-11-09.zip`  
**SHA-256 والد:** `78149d2064419ff1c3e5d6d44b4a7617a2ac4b9dded089e4df776ab328f32ab7`  
**این بسته:** CP19 — `EGUNSENTIA-STAGE47-POST-CP18-TACTICAL-DEPENDENCY-RECHECK-PART3-PARTIAL-CP19-2026-11-09.zip`

## نقطهٔ ادامه

CP19 را والد کاری بعدی قرار بده. CP18 و همهٔ والدهای قبلی immutable هستند. این دور D2 را در یک runtime تازه بازآزمایی کرد، اما dependency recovery را کامل نکرد.

## تشخیص نهایی

- Zod مستقیم در manifest هست: `^4.4.0`; lockfile نسخهٔ `4.6.5` را pin کرده.
- تمام ۷۱ declaration ریشه‌ای CP18 در audit قبلی با lockfile منطبق بودند.
- npm registry همچنان `EAI_AGAIN` می‌دهد؛ `getent` و `curl` نیز DNS failure را نشان می‌دهند.
- HTTPS مستقیم به Cloudflare/Google public DNS IPها نیز در این محیط برقرار نشد؛ resolver یا egress را در سطح سیستم تغییر نده.
- `npm ci` در CP18 قبلاً از مرحلهٔ download شکست خورد؛ در Part 3 پس از preflight ناموفق تکرار نشد.
- `node_modules` و app-env موقت بعد از آزمون‌ها وجود ندارند.

## وضعیت آزمون

- Focused persistence/Receipt/DB/migration: 70/70 PASS.
- Runnable scripts به‌جز `scripts/game.test.mjs`: 461/461 PASS؛ 56 فایل.
- Canon verifier: PASS.
- Game suite: import blocked by missing `zod`.
- App-data/auth: 6 PASS / 2 blocked (`@tanstack/react-start`, `jose`).
- Full `npm test` در این نوبت در سقف ۱۲۰ ثانیه timeout شد و final summary نداشت؛ آن را PASS تلقی نکن.
- Typecheck blocked: `@types/node`, `vite/client`.
- Build blocked: Vite unavailable (`spawn vite ENOENT`).
- Lint blocked: ESLint unavailable.
- DB, browser, production: not run.

## دستورات دقیق بعدی

در runtime دارای DNS و HTTPS سالم به registry:

```bash
npm config get registry
npm ping
npm ci --no-audit --no-fund --cache /path/to/writable/npm-cache
npm ls zod
node --input-type=module -e "import { z } from 'zod'; console.log(z.string().parse('zod-ok'))"
npm run test:game
npm test
npm run typecheck
npm run lint
npm run build
```

هیچ نسخه‌ای را ارتقا نده؛ `package.json` و `package-lock.json` را فقط در صورت وجود defect اثبات‌شده تغییر بده. Zod را بازنویسی نکن. از registry mirror نامعلوم یا tarball بدون integrity verification استفاده نکن.

پس از بازیابی D2، به C3.1–C3.10 برگرد و فقط با commit/reload واقعی آن را Integration-tested اعلام کن. C4 تا پذیرش C3 متوقف می‌ماند.

## وضعیت گیت

D1 Complete؛ D2 Blocked by runtime DNS/egress؛ C3 Blocked/Partial؛ Gate 2 Partial؛ C4 Not started. این checkpoint release candidate نیست.
