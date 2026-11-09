# گزارش Round 3 ـ بخش اول: Council Typed Effects و رزرو منابع

تاریخ: ۹ نوامبر ۲۰۲۶  
پایه: CP11 ـ آرشیو `EGUNSENTIA-STAGE47-POST-CP10-ROUND2-CANON-AND-GENEALOGY-AUDIT-CP11-2026-11-09.zip`  
دامنه: Workstream C، موارد C1 و ممیزی C2 از Round 3  
وضعیت این بسته: **Partial checkpoint؛ Gate 2 هنوز تکمیل نشده است.**

## خلاصهٔ اجرایی

در این بخش، مسیر فرمان شورای پنل ۲۴ از یک موتور اثرگذاری مستقل و دست‌ساز به موتور مشترک اجرای گزینه‌های کاتالوگ منتقل شد. دادهٔ `RichOption` در کاتالوگ تنها مرجع اثرها، پیش‌شرط‌ها و هزینه‌های تعریف‌شدهٔ فرمان است. برنامهٔ شورای جدید فقط فرادادهٔ فرمان، کرسی انتخاب‌شده و شناسهٔ پایدار را نگه می‌دارد؛ دیگر فهرست دوم و موازی از اثرها تولید نمی‌کند.

هم‌زمان، پیش‌بررسی رزرو منابع اضافه شد تا همهٔ هزینه‌های قابل‌محاسبه پیش از ساخت وضعیت بعدی اعتبارسنجی شوند. کمبود موجودی، هزینهٔ نامعتبر یا قرارداد هزینهٔ نیروی انسانیِ فاقد تعریف معتبر، بدون تغییر وضعیت رد می‌شود. برای موجودی‌های منفیِ ناشی از اثرهای typed نیز دیگر کمبود با clamp به صفر پنهان نمی‌شود.

## A. کار انجام‌شده

### C1 ـ Council typed-effect adapter

- `planCouncilDecree` اکنون خود گزینهٔ authoritative شمارهٔ `24-OPT-02` از پنل ۲۴ را دریافت و نگه‌داری می‌کند؛ برنامهٔ شورا دیگر هزینه/مهلت/اثرهای موازی نمی‌سازد.
- `decreeOrder()` گزینهٔ واقعی کاتالوگ را بازمی‌گرداند؛ fallbackهای ساختگی برای هزینه، عنوان یا زمان حذف شدند. در نبود گزینهٔ کاتالوگ، فرمان مسدود می‌شود.
- فرمان شورای پنل ۲۴ به `runCouncilDecree` و سپس همان `runOption` مشترک هدایت می‌شود. مسیر اختصاصی قدیمی `stampCouncilDecree` حذف شد تا دو پیاده‌سازی متناقض باقی نماند.
- آثار typed واقعی گزینه اجرا می‌شوند: Stock، Queue، Note و NPC. صف پیامد از `afterHours: 48` و `becauseOf: 24-OPT-02` استفاده می‌کند؛ News با منشأ Council ثبت می‌شود؛ وضعیت NPC به مدت تعریف‌شده تنظیم می‌شود و mood اختیاری `strained` نیز حفظ می‌گردد.
- شناسهٔ فرمان از شناسهٔ گزینه + روز کمپین + دقیقهٔ ساعت کمپین ساخته می‌شود؛ شناسه میان کرسی‌های مختلف مشترک است و از اجرای دوباره در همان دقیقه جلوگیری می‌کند. فهرست شناسه‌ها در وضعیت P4 ذخیره و با سقف ۵۰۰ مورد نرمال می‌شود.
- Store نتیجه را در یک به‌روزرسانی Zustand ثبت می‌کند: World، P4، صف، منابع، Event Ledger، News، Chronicle و شناسهٔ idempotency در یک candidate state واحد اعمال می‌شوند. این مورد در کد پیاده‌سازی شده، اما به‌علت نبود وابستگی‌های runtime هنوز از طریق Store واقعی/مرورگر آزمون یکپارچه نشده است.
- پنل شورا همان پیش‌شرط‌ها و کمبودهای منابع را برای غیرفعال‌کردن دکمه نشان می‌دهد. هزینهٔ Political Capital پنهان یا به‌عنوان پرداخت‌شده نمایش داده نمی‌شود.

### C1 ـ رزرو و اتمیک‌بودن منابع

- `reserveOptionResources` یک preflight بدون mutation است.
- اعتبار و کفایت Treasury Marks، ساعات کار، مقادیر Resource Cost، جمع امنِ اعداد رزرو، و اثرهای منفی Stock پیش از اجرا بررسی می‌شود.
- هزینه‌های صریح منابع و برداشت‌های ناشی از اثرهای typed در یک پیش‌بررسی جمع می‌شوند تا همان موجودی دوبار به‌عنوان منبع مستقل قابل‌مصرف فرض نشود.
- برای food / water / fuel stocks، تبدیل واحد World فقط از مقیاس‌های از قبل موجود در کد (`8`، `400` و `200`) استفاده می‌کند؛ مقیاس جدید یا منبع اقتصادی جدید اختراع نشده است.
- اگر موجودی P4 یا World کافی نباشد، نتیجه رد می‌شود؛ نه Treasury و نه Stock به‌صورت جزئی تغییر نمی‌کند.
- هزینهٔ personnel در حال حاضر در هیچ‌یک از گزینه‌های کاتالوگ استفاده نشده است. اگر بعداً چنین هزینه‌ای اضافه شود، چون قرارداد رزرو معتبر آن هنوز تعریف نشده، اجرا به‌صورت محافظه‌کارانه رد خواهد شد.
- Receipt اثر عددی منابع را بیان می‌کند؛ برای مثال `Food stock decreased by 5.`، نه فقط یک پیام کیفی مثل «موجودی رو به کاهش است».

### C2 ـ ممیزی Political Capital (هنوز حل‌نشده)

ممیزی مستقیم کاتالوگ ۴۰۳ گزینه را بررسی کرد:

| یافته | تعداد |
|---|---:|
| گزینه‌های دارای هزینهٔ مثبت Political Capital | ۱۸۲ از ۴۰۳ |
| همهٔ گزینه‌های Wait | ۲۶ از ۲۶ دارای مقدار مثبت |
| اثرهای typed منفی Stock | ۹۱ |
| گزینه‌های دارای Resource Cost صریح | صفر |
| گزینه‌های دارای Personnel Cost | صفر |

در کد، Save، کاتالوگ، گزارش‌های پیشین و مستندات قابل‌جست‌وجوی پروژه، موجودی یا دفترکل authoritative برای Political Capital پیدا نشد. تصمیم مستند CP8 نیز این بود که نه موجودی فرضی ساخته شود و نه مسدودسازی کلی اعمال شود؛ زیرا هر ۲۶ گزینهٔ Wait و مسیر پیشروی زمان را از کار می‌اندازد. این سیاست قبلی در این دور حفظ شد.

بنابراین:
- هیچ موجودی آغازین، درآمد، بازیابی، سقف یا قانون هزینه‌کرد ساخته نشده است.
- هزینهٔ مثبت کاتالوگ به‌عنوان پرداخت‌شده ثبت نمی‌شود؛ Receipt و UI صریحاً عدم امکان کسر را اعلام می‌کنند.
- گزینه‌های دارای این فیلد کورکورانه مسدود نشده‌اند؛ این موضوع یک قرارداد طراحی/اقتصادی باز و مانع تکمیل C2 است.
- برای بستن C2 به منبع معتبر یا تصمیم/تأیید مالک دربارهٔ معنای دقیق این فیلد، چرخهٔ کسب/مصرف/بازپرداخت و رفتار Wait نیاز است.

## B. قرارداد واقعی گزینهٔ شورای آزموده‌شده

گزینهٔ `24-OPT-02` از کاتالوگ پنل ۲۴ چنین داده‌ای دارد:

- عنوان: `Stamp a bounded council decree`
- هزینه: ۶۰ Marks، یک ساعت کار، یک Political Capital (حل‌نشده و کسرنشده)، بدون Resource Cost صریح و بدون Personnel Cost.
- پیش‌شرط: در دسترس‌بودن `Physician Sabine Lorenz`.
- اثرها: کاهش Food به‌اندازهٔ ۵؛ Queue با تأخیر ۴۸ ساعت؛ Note در کانال News؛ و اشتغال NPC به‌مدت ۶ ساعت با mood برابر `strained`.

در آزمون ساعت ۱۰:۰۰، Food در P4 پنج واحد و در World چهل واحد (طبق ضریب موجود ۸) کاهش یافت؛ Queue با `dueMin` متناظر با ۴۸ ساعت بعد ثبت شد؛ News، Event Ledger و Chronicle به‌روزرسانی شدند؛ Sabine شش ساعت مشغول شد و mood ثبت شد. اجرای دوباره در همان روز/دقیقه، حتی از کرسی دیگر، رد شد. پس از JSON serialize/restore نیز شناسهٔ فرمان باقی ماند و replay رد شد.

این آزمون، واحد/منطقی و JSON round-trip در لایهٔ P4 است؛ آزمون commit پایگاه‌داده یا مرورگر محسوب نمی‌شود.

## C. فایل‌های تغییرکرده

### منطق و UI
- `src/lib/game/sim/council.ts` — حذف effect plan موازی؛ ارجاع مستقیم به RichOption authoritative.
- `src/lib/game/p4-simulation.ts` — حذف موتور قدیمی stamp و fallbackهای ساختگی؛ حفظ API گفت‌وگو/تفویض.
- `src/lib/platform/options/execute.ts` — preflight رزرو منابع، کنترل کمبود Stock، اجرای مشترک شورای پنل ۲۴، idempotency و Receipt دقیق.
- `src/lib/game/sim/npc.ts` — mood اختیاری Save-safe به وضعیت NPC اضافه شد.
- `src/lib/game/store.ts` — اتصال stampDecree به runner مشترک و یک set واحد.
- `src/components/game/V45PanelBody.tsx` — نمایش lock و هزینهٔ Political Capital حل‌نشده در پنل شورا.

### آزمون‌ها
- `scripts/gate2-round3.test.mjs`
- `scripts/gate2-round4.test.mjs`
- `scripts/council-queue-identity.test.mjs`
- `scripts/game.test.mjs` (اصلاح شد، ولی اجرای آن به‌علت نبود zod مسدود است.)

هیچ کارت Canon، دادهٔ خانوادگی، Save مالک، schema پایگاه‌داده، dependency manifest یا lockfile تغییر نکرده است. هیچ فایل قبلی حذف نشده است.

## D. راستی‌آزمایی

| آزمون | نتیجه | وضعیت |
|---|---:|---|
| Gate 2 Round 3 + Round 4 + Council identity | ۲۷/۲۷ | Unit-tested |
| بستهٔ آزمون‌های مرتبط Gate 2 / Save / Private Relations | ۹۶/۹۶ | Unit-tested |
| کل scripts test suite | ۴۴۳/۴۴۴ | یک suite به‌علت نبود zod بارگذاری نشد |
| Canon verifier | PASS | تأیید شد |
| Red Claw verifier | PASS با هشدارهای قبلی | پیشنهادها همچنان غیر Canon |
| TS/TSX/MJS transpile syntax checks | ۹/۹ | بررسی نحوی؛ نه typecheck |
| `npm run typecheck` | BLOCKED | `@types/node` و `vite/client` موجود نیستند |
| `npm run build` | BLOCKED | executable محلی Vite پیدا نشد (`spawn vite ENOENT`) |
| `npm run lint` | BLOCKED | ESLint نصب نیست |
| app-data/auth test batch | ۶ PASS؛ ۲ suite-load blocked | `@tanstack/react-start` و `jose` موجود نیستند |
| Browser QA | NOT RUN | مرورگر/اجرای واقعی و وابستگی‌ها در دسترس نیست |
| Backend DB transaction / durable reload | NOT RUN | هیچ backend واقعی یا production-equivalent اجرا نشد |

برای اجرای scripts suite، فایل `.grok/app-env.json` فقط به‌طور موقت با مقدار غیرمحرمانهٔ `VITE_AUTH_ENABLED=true` ساخته و بعد از آزمون حذف شد؛ این فایل در بسته نیست. پس از آن ۴۴۳ تست از ۴۴۴ تست موفق بودند و تنها `scripts/game.test.mjs` با `ERR_MODULE_NOT_FOUND: zod` متوقف شد. هیچ نصب dependency یا تغییر lockfile انجام نشد.

## E. Canon و داده‌ها

- هیچ واقعیت Canon، رابطه، والد، فرزند، وارث، رویداد خانوادگی یا شخصیت جدیدی ایجاد یا اصلاح نشد.
- تغییر فقط در قرارداد اجرای کد، UI شورا و آزمون‌هاست.
- پیشنهادهای Red Claw و موارد UNKNOWN بدون تغییر حفظ شدند.
- Political Capital همچنان حل‌نشده است و هیچ قانون اقتصادی جدیدی به Canon یا gameplay اضافه نشد.

## F. وضعیت پذیرش

- C1: منطق typed adapter و preflight منابع **Implemented** و آزمون‌های متمرکز **Unit-tested**؛ Store/DB/Browser هنوز **Integration-tested / Browser-verified نیستند**.
- C2: **Blocked / unresolved design contract**؛ منبع معتبر Political Capital یافت نشد.
- C3 تا C7 از Round 3: هنوز در این بسته انجام نشده‌اند؛ از جمله command-to-durable-commit/reload، idempotency در backend، failure injection، legacy DB persistence و UI Receipt پس از reload.
- Gate 2: **PARTIAL**؛ این checkpoint نسخهٔ release یا Production نیست.

## G. گام بعد

بخش بعدی Round 3 باید C3 را شروع کند: audit مسیر واقعی Save adapter و بک‌اند موجود، تعیین امکان یکپارچه‌سازی واقعی در محیط فعلی، و آزمون فرمان → commit → reload. تا قبل از دسترسی به backend واقعی یا محیط production-equivalent، هیچ Integration-tested ادعا نشود. سپس C4 و C5 و C6 و C7 طبق ترتیب پرامپت دنبال شوند.
