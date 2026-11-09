# EGUNSENTIA — Stage 47 / Tactical Dependency Recovery Part 2
## بازآزمایی D2 و تشخیص موانع مجوز محلی و DNS

**تاریخ:** ۹ نوامبر ۲۰۲۶  
**والد immutable:** `EGUNSENTIA-STAGE47-POST-CP16-TACTICAL-DEPENDENCY-AUDIT-PARTIAL-CP17-2026-11-09.zip`  
**SHA-256 والد:** `c308f2c00ab1fc11b2cbfb81cd0770d7dfc98eff26b208c020c9e316a3583ee0`  
**این تحویل:** CP18 — ممیزی/تلاش مجدد D2؛ نه Dependency-recovered و نه Release Candidate.

## 1. رأی اجرایی

**D1 کامل است؛ D2 هنوز BLOCKED است.** در این دور دو مانع محلی قابل‌رفع شناسایی شد و بدون تغییر پروژه دور زده شد:

1. working copy قبلی در مسیر `.../egunsentia_cp16_resume/working` مالک `root` داشت؛ کاربر جاری مجاز به ساخت `node_modules` در آن نبود.
2. cache پیش‌فرض npm در `/home/oai/.npm` شامل فایل‌های root-owned بود و `npm cache verify` با `EACCES` شکست می‌خورد.

یک working copy تازه و کاربر-مالک مستقیماً از CP17 در مسیر `EGUNSENTIA_CP17_WRITABLE_WORKING_COPY` ساخته شد. یک cache مستقل و قابل‌نوشتن در `/mnt/data/egunsentia_npm_cache` ایجاد شد. `npm cache verify --cache ...` موفق شد و دیگر این دو مانع محلی جلوی آغاز نصب را نمی‌گیرند.

با وجود این اصلاح، نصب دقیق lockfile به علت DNS runtime شکست خورد: تلاش برای دریافت tarballهای npm (از جمله `zod-4.6.5.tgz`) با `EAI_AGAIN` مواجه شد. npm سپس خطای ثانویه `Exit handler never called!` داد. log کامل این تلاش در cache خارجی نگهداری شد و خلاصهٔ خطا در Verification Log ثبت شده است.

وضعیت عمومی npm هنگام بررسی، `All Systems Operational` و جزء `Package installation` برابر `Operational` بود؛ بنابراین شواهد محلی به مشکل resolver/egress همین runtime اشاره می‌کنند، نه قطعی عمومی npm. منابع: https://status.npmjs.org/ و https://www.npmjs.com/package/zod?activeTab=versions.

## 2. اقدامات و شواهد

### 2.1 صحت والد و working copy تازه
- SHA-256 آرشیو CP17 با sidecar برابر است: `c308f2c00ab1fc11b2cbfb81cd0770d7dfc98eff26b208c020c9e316a3583ee0`.
- `unzip -tq`: PASS؛ ۷۸۹ عضو؛ هیچ مسیر absolute یا path traversal در ZIP پیدا نشد.
- CP17 در working copy مستقل تازه استخراج شد؛ مالک پوشه UID کاربر جاری بود و write probe موفق شد.
- `package.json` همچنان SHA-256 `f33db47e9c69f1919406896834b860721e8f3042bd362cffbd4f3d29fd063103` دارد.
- `package-lock.json` همچنان SHA-256 `72b88b98db67a9954c77d88b4415671d566298113e948cd03825a20049e5184b` دارد.

### 2.2 cache و مجوز
- `npm cache verify` با cache پیش‌فرض `/home/oai/.npm` با `EACCES` برای ساخت `_cacache` شکست خورد؛ پیام npm به فایل‌های root-owned اشاره داشت.
- مسیر تازه `/mnt/data/egunsentia_npm_cache` ایجاد شد.
- `npm cache verify --cache /mnt/data/egunsentia_npm_cache`: PASS؛ cache سالم اما خالی بود (۰ bytes، ۰ index entries).
- از `sudo chown` یا تغییر مالکیت سیستم استفاده نشد.

### 2.3 نصب دقیق lockfile

فرمان اجراشده از working copy تازه:

```bash
npm ci --no-audit --no-fund --fetch-retries=0 --fetch-timeout=12000 --cache /mnt/data/egunsentia_npm_cache
```

خروجی نهایی:

```text
npm error Exit handler never called!
```

اما debug log، خطاهای واقعی دریافت بسته را ثبت کرده است، از جمله:

```text
http fetch GET https://registry.npmjs.org/zod/-/zod-4.6.5.tgz attempt 1 failed with EAI_AGAIN
http fetch GET https://registry.npmjs.org/vite/-/vite-8.3.2.tgz attempt 1 failed with EAI_AGAIN
```

`socket.getaddrinfo("registry.npmjs.org", 443)` نیز `Temporary failure in name resolution` برگرداند. `HTTP_PROXY`, `HTTPS_PROXY`, `ALL_PROXY` تنظیم نشده‌اند؛ `npm config get proxy` و `https-proxy` هر دو `null` هستند. هیچ `.npmrc` پروژه/کاربر/سیستم پیدا نشد. registry برابر `https://registry.npmjs.org/` و offline mode برابر `false` بود.

پس از شکست نصب، فقط `node_modules` ناقصی که همان تلاش ایجاد کرده بود حذف شد. هیچ فرایند npm install باقی نماند. cache خارجی از پروژه و ZIP خارج است.

## 3. آزمون‌های قابل اجرا در CP17 تازه

هیچ فایل source یا dependency تغییر نکرده است.

| بررسی | نتیجه | تفسیر |
|---|---:|---|
| Focused persistence/Receipt/DB/migration | 70/70 PASS | آزمون واحد/قراردادی؛ بدون backend واقعی |
| Runnable script suite (به‌جز `scripts/game.test.mjs`) | 461/461 PASS؛ 56 فایل | آزمون‌های runnable بدون suite وابسته به Zod |
| `node scripts/verify-canon.mjs` | PASS | ۶۵ پنل، invariantها، ۱۶۷ asset و option catalog |
| `npm cache verify --cache /mnt/data/egunsentia_npm_cache` | PASS | cache خالی و قابل‌نوشتن |
| `npm ci` | BLOCKED | DNS `EAI_AGAIN`؛ سپس خطای ثانویهٔ npm |
| Zod ESM import / `npm run test:game` | BLOCKED | Zod نصب نشده؛ assertions بازی بارگذاری نمی‌شوند |
| Full `npm test` | 461 PASS / 1 BLOCKED | suite بازی هنوز import-time blocked است |
| Typecheck / build / lint | BLOCKED | dependencyهای پروژه نصب نشده‌اند |

برای اجرای ۴۶۱ تست، `.grok/app-env.json` فقط به‌طور موقت با مقدار غیرمحرمانهٔ `VITE_AUTH_ENABLED=true` ساخته و بلافاصله حذف شد. در CP18 این فایل وجود ندارد. `node_modules` نیز در CP18 وجود ندارد.

## 4. ماتریس تشخیص

| مسئله | طبقه‌بندی | وضعیت |
|---|---|---|
| Zod در `package.json` اعلام نشده | Project defect؟ | رد شد؛ Zod مستقیم اعلام شده است |
| Zod در lockfile ثبت نشده | Project defect؟ | رد شد؛ نسخهٔ 4.6.5 و integrity موجود است |
| تفاوت manifest و lockfile | Project defect؟ | رد شد؛ audit قبلی 71/71 تطبیق داشت |
| registry عمومی npm از دسترس خارج است | External outage؟ | تأیید نشد؛ status page عملیاتی بود |
| resolver این runtime DNS را resolve نمی‌کند | Environmental | تأیید شد (`EAI_AGAIN`) |
| npm cache پیش‌فرض root-owned است | Environmental/permissions | تأیید شد؛ با cache جدا دور زده شد |
| working copy قبلی root-owned بود | Environmental/permissions | تأیید شد؛ با extraction تازه دور زده شد |
| مشکل dependency Zod در source | Project defect؟ | شواهدی ندارد؛ هنوز اجرای تست بازی مسدود است |

## 5. محدودیت‌ها و تصمیم

- `package.json`، `package-lock.json`، کد بازی، Canon، Save schema، SQL migrations، اقتصاد، secrets و محتوای gameplay تغییر نکرده‌اند.
- هیچ نسخه‌ای ارتقا داده نشده است؛ Zod همچنان همان `4.6.5` قفل‌شده است.
- هیچ tarball یا dependency از منبع نامعتبر وارد نشده است.
- `node_modules`، cache npm و فایل موقت app-env در CP18 گنجانده نشده‌اند.
- این Part نصب dependency را کامل نکرده؛ D2 همچنان BLOCKED است.
- C3.1–C3.10 هنوز به PostgreSQL واقعی و پیکربندی امن نیاز دارد؛ C4 تا پذیرش C3 شروع نمی‌شود.

## 6. گام بعد دقیق

در یک runtime که DNS/HTTPS به `registry.npmjs.org` دارد، از CP18 یا CP17 working copy تازه استفاده شود:

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

اگر شبکه هنوز مسدود است، نصب را تکرار نکنید؛ log کامل DNS و registry را ثبت کنید و dependencyها را با فایل‌های دستی یا نسخهٔ جایگزین بازسازی نکنید. پس از D2، به C3 واقعی بازگردید.

**وضعیت نهایی:** D1 = PASS/Complete؛ D2 = BLOCKED by runtime DNS; C3 = BLOCKED/PARTIAL; Gate 2 = PARTIAL. این checkpoint release candidate نیست.
