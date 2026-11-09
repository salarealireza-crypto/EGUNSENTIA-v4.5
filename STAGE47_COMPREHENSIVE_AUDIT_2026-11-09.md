# EGUNSENTIA — ممیزی جامع Stage 47 و نقشه احیا

**تاریخ ممیزی:** 2026-11-09  
**نسخه مبنا:** `EGUNSENTIA-STAGE47-CORE-RECOVERY-CP1-2026-11-08.zip`  
**SHA-256 مبنا:** `252ef2a83fbdf283d77fb34cdc797411daed911daf378a7df694443866ca670b`  
**حالت این بسته:** ممیزی و مستندسازی؛ هیچ فایل اجرایی/کد بازی در این مرحله تغییر نکرده است.

## خلاصه مدیریتی

EGUNSENTIA پروژه‌ای با هسته واقعی شبیه‌سازی، ذخیره، احراز هویت، اقتصاد، NPC، جناح‌ها، تحقیقات و رابط چندپنلی است؛ پروژه خالی نیست و بازنویسی از صفر توجیه ندارد. بااین‌حال در وضعیت فعلی هنوز برای استفاده آنلاینِ پایدار آماده نیست.

**مهم‌ترین یافته‌های قطعی:**

1. ۲۴ پنل از ۶۵ پنل هنوز به `DefaultPanelContent` مشترک می‌افتند (۳۶٫۹٪ پنل‌ها).
2. ۶۵ آیکون رجیستری یکسان و برابر `▣` هستند؛ ۰ پنل `archetype` و ۰ پنل `place` مقداردهی‌شده دارند؛ هر ۶۵ پنل همان چهار تب عمومی `Overview / Options / Records / Intel` را دارند.
3. کاتالوگ ۴۰۳ گزینه دارد و هر ۴۰۳ عنوان در اسکن فعلی یکتا است؛ اما اثرها و شروط عمدتاً از Recipeهای عمومی و پارامترهای محاسبه‌شده ساخته می‌شوند، نه طراحی اختصاصی و مستند برای هر اقدام. ۳۱۶ گزینه شرط تولیدشده دارند و ۸۷ گزینه شرط ندارند.
4. Planner در رابط `npcAvailable` را به موتور برنامه‌ریزی پاس نمی‌دهد، با اینکه موتور چنین ورودی‌ای را پشتیبانی می‌کند. سند قدیمی Planner را پنل ۱۲ معرفی می‌کند، ولی بدنه فعلی Planner در پنل ۴۶ است و پنل ۱۲ عمومی مانده است.
5. بحران، بنر و توقف زمانی دارد و تغییرات آب/غذا/انرژی را پشتیبانی می‌کند؛ جدول پیامدهای Gate و Morale کامل نیست.
6. پنل مراسم هنوز عمومی است؛ تقویم و تطبیق تاریخ وجود دارد، اما برنامه‌ریزی/رزرو/حضور/هزینه/پیامد مراسم به شکل یک چرخه کامل وجود ندارد.
7. Day Replay واقعی پیدا نشد. Snapshot و Chronicle موجودند، ولی Snapshot ذخیره/بازیابی معادل مرور رویدادهای یک روز نیست.
8. `db.ts` در نبود `DATABASE_URL` به PGlite حافظه‌ای برمی‌گردد؛ در محیط Production این انتخاب باید Fail-Closed شود تا ذخیره دائمی به‌صورت تصادفی با DB موقت جایگزین نشود.
9. مسیر Groq در `xai.ts` هنوز مدل پیش‌فرض `llama-3.3-70b-versatile` را دارد که طبق اعلام رسمی Groq در 2026-08-16 غیرفعال شده است.
10. Build، TypeScript، Browser QA و Production QA تأیید نشده‌اند. `npm run test:game` در این بسته به دلیل نصب‌نبودن Zod قبل از اجرای تست‌ها متوقف می‌شود.

## درجه‌بندی وضعیت

- **موجود و تأییدشده:** کد یا داده واقعاً پیدا شده و بررسی‌پذیر است؛ لزوماً به معنی تست سرتاسری نیست.
- **موجود ولی ناقص/وصل‌نشده:** هسته وجود دارد اما مسیر کاربردی آن کامل نیست.
- **غایب در کد فعلی:** جست‌وجوی ساختاری در مسیرهای پروژه پیاده‌سازی اختصاصی را نشان نداده است.
- **Blocked / Not verified:** محیط/وابستگی/دسترسی کافی برای آزمون واقعی فراهم نبوده است.
- **نیازمند تصمیم مالک:** بازسازی می‌تواند به لور، رفتار بازی یا سیاست رسانه‌ای اثر بگذارد و نباید با حدس انجام شود.

---

# A. فهرست نواقص و کارهای باقی‌مانده

## P0 — ایمنی و دوام آنلاین (اولویت مسدودکننده)

| ID | مشکل | شواهد/مسیرها | اقدام لازم |
|---|---|---|---|
| P0-01 | انتخاب PGlite در نبود `DATABASE_URL` حتی در استقرار | `src/lib/db.ts` (`dbSource = databaseUrl ? neon : pglite`) | در Production نبود URL باید خطای راه‌اندازی بدهد؛ PGlite فقط Local/Preview صریح باشد. |
| P0-02 | ریسک از دست رفتن Save روی instance/server restart اگر PGlite فعال شود | `src/lib/db.ts`, `src/lib/auth/server.ts` | تست اتصال Neon واقعی، restart، خروج/ورود و بارگذاری روی دستگاه/مرورگر دیگر. |
| P0-03 | اجرای Migration در دستور Build | `package.json` (`build: vite build && npm run db:migrate`) | جداسازی build از migration؛ migration با فرمان صریح و قفل/کنترل نسخه اجرا شود. |
| P0-04 | نبود اجرای واقعی Migration روی دیتابیس Production | `scripts/migrate.mjs`, `migrations/*.sql` | اجرای کنترل‌شده روی Neon آزمایشی، بررسی وضعیت migrationها و rollback/backup strategy. |
| P0-05 | OAuth پیش‌فرض مناسب دامنه Vercel تأیید نشده | `src/lib/auth/server.ts`, `src/lib/auth/runtime-config.mjs` | ساخت OAuth client اختصاصی و تنظیم callback/issuer/secret برای دامنه واقعی؛ Preview broker را Production فرض نکنید. |
| P0-06 | سیاست تک‌سازنده/allowlist در تمام صفحات و APIها اثبات نشده | `src/lib/auth/*`, `src/routes/*`, `src/lib/game/save.ts` | حساب سازنده را allowlist کنید؛ ثبت‌نام آزاد را ببندید؛ همه مسیرهای بازی، Save و AL را با نشست معتبر محافظت کنید. |
| P0-07 | مدل پیش‌فرض Groq از رده خارج است | `src/lib/game/xai.ts` | انتخاب مدل موجود در حساب مالک؛ تنظیم `LLM_MODEL`/`LLM_BASE_URL` سرورمحور و تست درخواست واقعی. |
| P0-08 | کلید AL لمسی/واقعی و Provider هنوز با سرور آنلاین آزمون نشده | `src/lib/game/xai.ts`, `gm.ts`, `GROQ_SETUP.md` | Smoke test با کلید ذخیره‌شده در Secret Manager محیط میزبانی؛ هرگز در چت، Git یا `VITE_*` قرار نگیرد. |
| P0-09 | عدم تأیید `npm ci`, Typecheck و Build در یک محیط تمیز | `package-lock.json`, `package.json`, `vite.config.ts` | نصب تکرارپذیر از Lockfile و اجرای کل دستورات از ابتدا. |
| P0-10 | مخزن Git و pipeline خودکار در بسته موجود نیست | نبود `.git/` و `.github/workflows/` | ساخت مخزن خصوصی، اتصال deployment و CI برای test/build. |
| P0-11 | Build و Migration به هم گره خورده‌اند و برای Preview/Production خطر ترتیب اجرا دارند | `package.json`, `scripts/migrate.mjs` | Preview از دیتابیس/شاخه مجزا استفاده کند؛ migration فقط با تایید نسخه/محیط اجرا شود. |
| P0-12 | وضعیت secrets و متغیرهای محیطی از روی ZIP قابل تایید نیست | نبود `.env.example`; `.grok/app-env.json` عمداً gitignore است | ساخت `.env.example` بدون مقدار محرمانه و ماتریس متغیرهای Local/Preview/Production. |

## P1 — گیم‌پلی و تکمیل سیستم‌ها

### P1-A: پنل‌های فاقد بدنه اختصاصی

این ۲۴ پنل در `src/components/game/V45PanelBody.tsx` به `DefaultPanelContent` سقوط می‌کنند:

| ID | نام پنل |
|---|---|
| 04 | Edicts & Legal Affairs |
| 05 | Ceremonies & Calendar |
| 07 | Special Reports |
| 08 | Command Log |
| 11 | Projects & Trade |
| 12 | Standing Orders & Plans |
| 15 | Surface Watch |
| 27 | Projects & Dependencies |
| 28 | Infrastructure & Maintenance |
| 30 | Dome Pulse |
| 31 | Whispers |
| 32 | Red Ledger |
| 34 | Night Chronicle |
| 37 | Clocks |
| 39 | Personal Vault |
| 40 | Faction Vault |
| 41 | Lore Atlas |
| 42 | Radio |
| 50 | Audience Hall |
| 51 | Justice & Prison |
| 60 | Culture Codex |
| 61 | City Districts Map |
| 62 | House Album |
| 65 | Year Book & Legacy |

**هدف احیا:** هر پنل باید حداقل Overview واقعی، رکوردهای مرتبط، عملیات مرتبط، وضعیت خالی معنادار، و پیوند به منبع/رویداد مربوط داشته باشد. فقط متن تزئینی یا نمودار بدون منبع داده پذیرفته نیست.

### P1-B: اتصال سیستم‌های شبیه‌سازی

| ID | نقص | وضعیت فعلی | بازسازی/گسترش پیشنهادی |
|---|---|---|---|
| GP-01 | حضور NPC در Planner | `npc.ts` زمان‌بندی/حضور را پشتیبانی می‌کند؛ UI هنگام `planItem`، callback حضور را پاس نمی‌دهد. | اتصال `npcNow` به Planner؛ دلیل قفل slot باید به انگلیسی و با زمان درون‌بازی نشان داده شود. |
| GP-02 | تعارض شماره Planner | متن قدیمی آن را پنل ۱۲ می‌نامد؛ UI Planner فعلی را برای ۴۶ رندر می‌کند؛ ۱۲ عمومی است. | تصمیم یکپارچه درباره نقش پنل ۱۲ و ۴۶، alias حفظ شود، Save و لینک‌ها تست شوند. |
| GP-03 | پیامد بحران برای Gate/Morale | بنر، tier، ساعت باقی‌مانده و interruption موجودند؛ اثر اقتصادی به آب/غذا/انرژی محدود است. | جدول نتیجه به‌ازای نوع بحران؛ Gate/Morale فقط در صورت رابطه علّی تعریف‌شده؛ ثبت در Ledger/Chronicle. |
| GP-04 | مراسم و مناسبت‌ها | تقویم و تشخیص تاریخ وجود دارد؛ پنل ۰۵ بدنه اختصاصی ندارد. | جدول مراسم canon-based، زمان/مکان/هزینه، دعوت، حضور/غیبت NPC، نتیجه و ردپای Chronicle. |
| GP-05 | Day Replay | Snapshot و Chronicle موجودند؛ Replay روزانه در کد UI/engine پیدا نشد. | ثبت timeline رویدادهای روزانه، بازپخش فقط خواندنی، عدم دستکاری campaign state. |
| GP-06 | پرونده‌های ناپدیدشدن | investigation/clue/contradiction/theory موجود است؛ چرخه اختصاصی missing-person case کامل/متصل نیست. | lifecycle پرونده با شواهد، سرنخ، تناقض، وضعیت UNKNOWN، کشف/بسته‌شدن فقط با rule valid. |
| GP-07 | Council و موتور گزینه‌ها | Council actions/decree بخشی از هزینه/صف/خبر/Chronicle را اجرا می‌کند؛ مسیر آن از option engine جداست. | بررسی هم‌پوشانی و انتقال امن به typed effect یا adapter؛ جلوگیری از دوبار خرج‌کردن منابع. |
| GP-08 | Attach-to گزینه‌ها | `attachTo`/ارتباط پنل و موجودیت در کاتالوگ پشتیبانی می‌شود؛ رابط هنوز همه را کنار موضوع مربوط نشان نمی‌دهد. | نمایش inline برای NPC/good/faction/clue/letter/site و نگه‌داشتن Orders drawer برای باقی گزینه‌ها. |
| GP-09 | Receipt و پیامدهای دیررس | اثرها، queue و noteها وجود دارند؛ رسید انسانی و trace کامل cause→effect در همه مسیرها باید سرتاسری ثابت شود. | رسید DONE/SPENT/YOU WILL HEAR/WRITTEN TO؛ delayed consequence با `Because of` به گزینه اصلی متصل باشد. |
| GP-10 | تحقیقات و گزارش‌های ویژه | Board سرنخ/تناقض/اعتماد و Hold as theory وجود دارد؛ اتصال caseها و Special Reports اختصاصی ناقص است. | پرونده‌محور کردن سرنخ‌ها، provenance، سطح اطمینان و حفاظت از UNKNOWN. |
| GP-11 | تاریخچه NPC | حافظه‌های NPC در State موجود است، اما پنل‌های عمومی مانع مشاهده و تعامل کافی‌اند. | dossier هر NPC: location/activity/availability، آخرین خاطرات، رابطه به‌صورت کلامی، سفارش‌های مجاز. |
| GP-12 | گراف پروژه‌ها | queue/dependency data در بعضی مسیرها وجود دارد؛ نقشه تعاملی کامل اثبات نشده. | dependency graph و تاثیر توقف/کمبود/اولویت با لینک به گزینه مربوط. |
| GP-13 | شهرت و روابط | داده‌های faction/relation موجودند؛ تاریخچه تفکیک‌شده برای audience/house/faction باید بررسی و تکمیل شود. | reputation timeline به تفکیک مخاطب؛ Trust/Respect/Fear/Loyalty/Closeness یکی نشوند. |
| GP-14 | قانون/عدالت/زندان | پنل ۵۱ عمومی است. | پرونده، اتهام، مدرک، جلسه، حکم، مدت، پیامد اجتماعی و ثبت رویداد؛ بدون تولید حکم/شخصیت canon از حدس. |
| GP-15 | Vaultها و provenance | داده‌های personal/faction vault موجود است؛ پنل‌های ۳۹ و ۴۰ عمومی‌اند. | جابجایی مالکیت با منشا، مکان، قفل، یکتایی آیتم و audit trail؛ ممنوعیت teleport/duplicate. |
| GP-16 | Atlas/Archive cross-link | داده canonical در JSON وجود دارد و verification سبز است؛ UI Atlas عمومی است. | نمایه و entry و See Also و statusهای KNOWN/DISPUTED/RUMOR/UNKNOWN/LOST و unlock rules. |
| GP-17 | Radio | سیستم رادیو در State موجود؛ پنل ۴۲ عمومی است. | ایستگاه‌ها/برنامه‌ها/خبرها/منبع و برچسب اعتبار؛ خبر یا شایعه خودکار Canon نشود. |
| GP-18 | Year Book / Legacy | پنل ۶۵ عمومی است. | جمع‌بندی سالانهٔ فقط مبتنی بر Event Ledger و وقایع ثابت‌شده، نه داستان‌سازی خودکار. |

### P1-C: گزینه‌ها و تصمیم‌های بازیکن

- ۴۰۳ گزینهٔ فعلی عنوان یکتا دارند؛ این معیار از نظر uniqueness اکنون عبور می‌کند.
- Recipeهای اثر در `src/lib/platform/options/effects.ts` و پارامترهای پنل، الگوی مشترک دارند؛ بنابراین اثر هر انتخاب هنوز به lore/اقتصاد/NPC/جناح مختص همان موقعیت متصل نیست.
- ۳۱۶/۴۰۳ (۷۸٫۴٪) گزینه‌ها شرط تولیدشده دارند؛ ۸۷ بدون شرط هستند. شروط hash/deterministic به معنی طراحی بازی‌محور و توضیح قفل نیستند.
- آمار اثرهای materialized: `note:403`, `flag:286`, `relation:157`, `stock:156`, `queue:273`, `npc:156`؛ این جمع‌ها تعداد انواع effect هستند، نه تعداد گزینه‌های یکتای دارای هر effect.
- عنوان یکتا با پیامد معنادار یکی نیست. معیار جدید: هر گزینه باید هدف، هزینه، شرط، ریسک، اثر فوری، پیامد دیررس، پیش‌بینی و متن مشاور متناسب داشته باشد.
- test guard برای uniqueness باید به‌صورت assertion قطعی اجرا شود؛ اسکن فعلی عنوان‌ها یکتایی را نشان می‌دهد، اما تست باید در CI مانع بازگشت شود.
- قوانین A5.4 و اصول atomic execution/confirm/no-retcon باید هنگام گسترش حفظ شوند.

## P2 — تجربه کاربری و معماری رابط

| ID | نقص | اقدام |
|---|---|---|
| UI-01 | همه ۶۵ آیکون `▣` هستند | نگاشت آیکون Lucide معنادار به هر پنل، تست ۶۵/۶۵. |
| UI-02 | هیچ پنلی `archetype` یا `place` ندارد | پرکردن رجیستری با ۹ archetype و ۸ wing-place، تست کامل بدون هم‌پوشانی. |
| UI-03 | هر ۶۵ پنل چهار تب عمومی دارد | view names براساس archetype؛ نگاشت به محتوا و state واقعی. |
| UI-04 | ۲۴ بدنه عمومی | حذف مسیر `DefaultPanelContent` پس از تکمیل bodyهای واقعی؛ تست fail-closed. |
| UI-05 | تراکم متن و کنترل‌های ریز در بخش‌هایی از UI | ممیزی typography حداقل ۱۳px، body ۱۵px و hit target حداقل ۴۴px در layout تازه؛ حفظ خوانایی موبایل. |
| UI-06 | اتصال گزینه به سوژه ناقص | inline actions و Receipt مطابق مدل فرمان. |
| UI-07 | ۸ wing بصری و responsive QA هنوز اثبات نشده | Playwright در 390×844 و 1280×800، overflow و keyboard/ARIA و reduced motion. |
| UI-08 | بعضی primitives از قبل موجودند اما کامل استفاده نشده‌اند | reuse `DeskShell`, `WingRoom`, `VoiceLine`, `Gauge`, `Cutaway`, `Receipt`؛ عدم ساخت کامپوننت تکراری. |

**نکته مثبت:** UI foundation واقعاً وجود دارد: `src/components/platform/*` و `src/lib/platform/{desks,gauges,home,voice,options}`، همچنین CommandDeck شامل Cutaway/Home sections، Crisis banner، time controls، search، favorites، drawer و views است. این پایه باید گسترش یابد نه جایگزین شود.

## P2 — دارایی‌ها و هنر

گزارش `npm run verify:art -- --structure` با موفقیت ساختار را بررسی کرد، اما ۲۳ گروه هنوز دارایی واقعی کافی ندارند. موارد عمده: gate states، film posters/stills، evening hall، household rooms، wing banners، panel heroes، NPC dossiers، news mastheads، relic cards، atlas domains، mini-games و boot/loading.

آمار فعلی: ۱۶۷ asset ثبت‌شده، ۰ generated raster، ۱۵۰ code-drawn و ۱۷ preserved؛ مجموع ۳٫۷۷ MB. این گزارش **ساختار** را PASS می‌کند، نه تکمیل بصری را.

سیاست قبلی مالک در پرامپت موجود می‌گوید تصویرسازی جدید، animation، video و audio/music bed ساخته نشود و SVG placeholder/CSS motion موجود حفظ شود. بنابراین این گروه‌ها در مرحله فعلی با SVG/CSS/کد و layout احیا می‌شوند؛ تولید asset تصویری تازه به مجوز مستقل نیاز دارد.

## P2 — لور، منابع و مستندات

1. `attachments/EGUNSENTIA_V4.1_SUPER_LORE_MASTER.txt` فقط یک stub سه‌خطی/۳۳۱ بایتی است؛ این فایل منبع lore کامل نیست. منبع اجرایی قابل اتکا در `src/lib/canon/*.json` و داده‌های canonical پروژه است.
2. `GROK_PROMPT_REMAINING.txt` به `attachments/EGUNSENTIA_V4.5_Update_Prompt.txt` ارجاع می‌دهد، ولی این attachment در بسته موجود نیست.
3. دو پرامپت باقی‌مانده دارای آمار قدیمی/متناقض هستند: ۳۵ یا ۳۲ پنل generic و ۲۵ عنوان متفاوت و economy هفتگی، درحالی‌که وضعیت فعلی ۲۴ پنل generic، ۴۰۳ عنوان یکتا و tick روزانه است. این اسناد باید archived/stale برچسب بخورند، نه اینکه حذف شوند.
4. ۱۳۷ فایل Markdown و log تاریخی در بسته وجود دارند؛ ترتیب تاریخی مهم است اما یک وضعیت واحد و به‌روز لازم است.
5. `README.md`, `.env.example`, `.github/workflows/` و `.git/` در بسته نیستند. `.grok/app-env.json` به‌درستی در gitignore قرار دارد و نباید حاوی secret وارد ZIP/Repo شود.
6. مسیر migrations دارای فایل auth تکراری در `migrations/auth/0001_auth.sql` و `migrations/0001_auth.sql` است؛ migration glob فعلی فقط `migrations/*.sql` را می‌خواند. ساختار باید روشن شود تا migrationهای auth به اشتباه دوبار یا هیچ‌وقت اجرا نشوند.
7. `vercel.json` فقط install command دارد؛ `vite.config.ts` از Nitro/Vercel پشتیبانی می‌کند، اما deployment config، function region/duration، env documentation و preview/prod separation به تست نیاز دارند.

## P3 — امکانات اختیاری/قابل تأجيل

- D1: Server-side TTS برای خبر Radio/Chapter Cards: در پرامپت قدیمی اختیاری، کاربر هنوز سیاست «بدون صوت/موسیقی» دارد؛ فقط در صورت تغییر مجوز، کوتاه، خاموش پیش‌فرض، authenticated، cached و daily quota.
- D2: Mixer state با procedural sound engine و mute ثابت: در سیاست قبلی صدا/music bed ممنوع است؛ فعلاً وارد برنامه اصلی نمی‌شود.
- art تولیدی جدید، انیمیشن جدید و ویدیو خارج از محدوده فعلی است.
- Multiplayer/online multiplayer لازم نیست؛ «آنلاین کردن» در این پروژه به معنی دسترسی مرورگر از لینک دائمی و Save ابری تک‌سازنده است، نه بازی همزمان چندنفره.

---

# B. چیزهایی که موجودند و نباید دوباره از صفر نوشته شوند

| سیستم | وضعیت مشاهده‌شده |
|---|---|
| Simulation time / hard interrupts | اصلاحات Stage 47 موجود و تست‌های regression در source حاضرند. |
| Calendar exact matching / Dead Days | منطق تطبیق دقیق و بازه‌های عبوری از سال موجود است. |
| Ration consumption | فرمول مصرف صفر/کسری به‌درستی مانع افزایش مصرف می‌شود. |
| Child birthdays / kinship identity | `birthDay` و شناسه پایدار در کد وجود دارند؛ legacy بدون birthDay حفظ می‌شود. |
| Affection drift | drift بی‌دلیل غیرفعال است. |
| Save validation / older saves | parser/normalizer و تست‌های legacy موجودند؛ آزمون کامل نیازمند وابستگی است. |
| Save conflict / revision | منطق user-scoped save و revision/conflict در `src/lib/game/save.ts` و UI موجود است. |
| AL quota/refund | quota DB-based و refund مسیر خطا در معماری وجود دارد؛ real provider call تست نشده. |
| Crisis banner / hour interrupt | در CommandDeck وجود دارد. |
| Economy daily tick / price board | tick روزانه و نمایش price/scarcity/treaty در UI موجود است؛ سند قدیمی «weekly» است. |
| Faction desk / reports / treaty / blocs | UI و داده موجود است. |
| Banquet / relations / rumors / news / Red Ledger | بدنه Banquet و داده‌های مربوط موجودند. |
| Forged letter consequence | مسیر consequence با تأخیر و relation hit در code دیده شد. |
| Industrial/gate visualization foundation | `IndustrialViz` و اجزای visualization وجود دارند؛ تکمیل همه state art اثبات نشده. |
| Canon | `npm run verify:canon` در این محیط PASS. |

**قاعده بازسازی:** این بخش‌ها ابتدا integration test می‌گیرند؛ فقط نقص واقعی‌شان تغییر می‌کند. حذف/جایگزینی آن‌ها ریسک regression بی‌دلیل دارد.

---

# C. شواهد آزمون در همین ممیزی

| فرمان | نتیجه مشاهده‌شده | تفسیر |
|---|---|---|
| `npm test` | ۳۴۸ آزمون کشف‌شده؛ ۳۴۴ موفق؛ ۴ ناموفق | چهار failure در گروه تست `with-app-env`/پیکربندی workspace؛ سه assert قابل مشاهده درباره `VITE_AUTH_ENABLED` و اجرای wrapper؛ فایل ignored `/.grok/app-env.json` در بسته منتقل‌شدنی نیست. این شکست را با تغییر auth به false دور نزنید. |
| `npm run test:game` | پیش از اجرای suite متوقف شد؛ `ERR_MODULE_NOT_FOUND` برای `zod` | Zod در `node_modules` حاضر نیست؛ این نتیجه شکست assertion بازی نیست. |
| `npm run typecheck` | FAIL: `@types/node` و `vite/client` یافت نشدند | وابستگی‌ها نصب نیستند؛ Typecheck واقعی انجام نشده است. |
| `npm run verify:canon` | PASS | رجیستری ۶۵ پنل، invariants، ۱۶۷ assets، preserved art و option catalogs معتبرند. |
| `npm run verify:art -- --structure` | PASS ساختاری؛ ۲۳ گروه ناقص | ساختار manifest معتبر، تکمیل assetها نه. |
| `npm run build` | در این ممیزی اجرا نشد | با نبود Vite/وابستگی‌ها تا نصب کامل ممکن نیست. |
| `npm run lint` | اجرا نشد | نیازمند نصب dev dependencies. |
| Playwright/browser | اجرا نشد | مرورگر واقعی/بسته‌های نصب‌شده در این محیط موجود نیستند. |
| Neon/Better Auth/AL Production | اجرا نشد | هیچ env/credential واقعی در اختیار این محیط قرار نگرفته؛ کلید را نباید در چت بفرستید. |

در ZIP فعلی `node_modules` وجود ندارد؛ `npm ci` در تلاش قبلی به خطای دسترسی/شبکه registry رسید. این موضوع باید با نصب تمیز در محیطی با registry دسترس‌پذیر حل شود. هیچ ادعای Build green یا browser verified مطرح نمی‌شود.

---

# D. مسیر احیای پیشنهادی بر اساس وابستگی‌ها

## Milestone 0 — Freeze و reproducible baseline

- Stage 47 CP1 immutable بماند.
- این فایل ممیزی و CSV inventory در repo اصلی نگهداری شوند.
- restore/backup آزمایش شود؛ هیچ migration تولیدی اجرا نشود.
- نسخه Node/npm تثبیت و CI پایه ساخته شود.

**معیار خروج:** SHA پایه ثبت، `npm ci` موفق، lockfile unchanged، test/typecheck/build results معتبر و ثبت‌شده.

## Milestone 1 — Online safety و creator-only deployment gate (P0)

- Fail-Closed DB در Vercel/Production؛ PGlite تنها در Local/Preview explicit.
- Neon free PostgreSQL؛ migrationها با فرمان جداگانه و explicit env.
- OAuth client اختصاصی Vercel domain یا روش احراز هویت owner-only؛ ثبت‌نام آزاد بسته.
- allowlist تنها حساب سازنده برای game routes, APIs, save, AL.
- `.env.example` غیرمحرمانه و `DEPLOYMENT.md`.
- کلید AL فقط در server environment: `GROQ_API_KEY` یا `XAI_API_KEY`/`LLM_API_KEY`; نه `VITE_*`, نه source, نه browser.
- مدل واقعی قابل‌دسترسی انتخاب شود؛ Groq مدل قدیمی پیش‌فرض را باید override کند.
- per-user rate/quota و provider 429 handling آزمون شوند.

**معیار خروج:** بدون `DATABASE_URL` Production boot fail؛ با Neon Save پس از redeploy/load حفظ شود؛ حساب غیرمجاز نتواند وارد campaign شود؛ API key از bundle/response/logها بیرون نرود.

## Milestone 2 — Core engine integration

- NPC schedule/availability → Planner and Messages/Personnel/Evening Hall.
- Crisis outcomes → stocks/gates/morale/ledger/chronicle with causal table.
- Council → option engine adapter and single accounting.
- Missing-person investigation lifecycle.
- Ceremony planner and attendance.
- Day Replay read-only from event timeline snapshots.

**معیار خروج:** سناریوهای زمانی، NPC absent, crisis resolution/failure, ceremony, case progress, replay read-only tests pass.

## Milestone 3 — Content/data pass

- ۲۴ generic panel را به archetype بدنه‌های واقعی تبدیل کن.
- تکمیل ۹ archetype و ۸ wing، icon/view/place metadata برای ۶۵ پنل.
- ۴۰۳ گزینه را با per-panel config و explicit rules غنی کن؛ unique title test نگه داشته شود.
- هر option: prerequisites, locks reason, cost, risks, immediate effects, delayed consequences, forecasts, voice/advisor line, attachTo.
- NPC dossier, projects/dependency map, faction histories, reputation histories, vault provenance, atlas cross-links, Year Book/Legacy.
- تمام داستان‌ها از canon JSON و logs بیایند؛ UNKNOWN/rumor/disputed status حفظ شود.

**معیار خروج:** صفر fallback panel، no illegal state mutation, no secret leak, all option targets valid, option sample per archetype changes state and leaves a trace.

## Milestone 4 — Visual/responsive code-only pass

- desk archetypes, wing tokens, Cutaway/rooms, gauges, voice, receipt, inline orders.
- min typography/touch targets; mobile-first 390×844 and desktop 1280×800.
- keyboard/ARIA, reduced motion, no horizontal overflow, all 65 panels smoke.
- استفاده از SVG/CSS و art موجود؛ طبق دستور مالک، art generation/audio/video/animation تازه انجام نشود.

## Milestone 5 — Full QA and private preview

- `npm ci`, full test (game+app-data+auth), typecheck, lint, build, verify:canon, verify:art.
- Playwright smoke; browser console zero errors.
- Save/load, reload, logout/login, revision conflicts, backup/restore, long time advance, all 65 panel routes.
- Preview deployment با Neon test branch و OAuth callback؛ AL smoke test با owner secret؛ production secrets از preview جدا.

## Milestone 6 — Personal always-available link

- private Git repository → Vercel Hobby → Neon Free → model API provider.
- stable project URL `https://<project>.vercel.app`; app itself protected by owner auth/allowlist.
- بدون دامنه اختصاصی، دامنه Vercel رایگان است. دوام لینک مشروط به فعال ماندن account/project/service است؛ «永久/عمر تضمین‌شده» نیست.

---

# E. تحلیل میزبانی رایگان

## پیشنهاد عملی

**Vercel Hobby + Neon Free + Groq/xAI API** نزدیک‌ترین مسیر به هزینه صفر برای استفاده شخصی سازنده است، چون پروژه همین حالا Vercel/Nitro و Neon/PostgreSQL را در معماری خود دارد؛ مهاجرت به Cloudflare یا بازنویسی Backend لازم نیست.

### Hosting: Vercel Hobby

- طرح Hobby رایگان است و برای پروژه شخصی/non-commercial تعریف شده؛ برای نرم‌افزار تجاری یا سرویس عمومی/درآمدزا، شرایطش را باید دوباره بررسی کرد. سقف‌های مصرف دارد و در بسیاری موارد بعد از عبور از سهمیه باید تا دوره بعد صبر کرد. [منبع رسمی Vercel Hobby: https://vercel.com/docs/plans/hobby]
- URL خودکار `*.vercel.app` ارائه می‌شود؛ دامنه اختصاصی لازم نیست. آدرس تا زمانی پایدار است که project/account فعال و در سرویس باقی بماند؛ هیچ ارائه‌دهنده‌ای تعهد lifetime دائمی رایگان نمی‌دهد. [منبع رسمی Vercel Domains: https://vercel.com/docs/domains/working-with-domains]
- TanStack Start با Nitro روی Vercel قابل deployment است و مستندات رسمی مسیر Git/CLI را توضیح می‌دهد. [راهنمای رسمی TanStack Start روی Vercel: https://vercel.com/kb/guide/deploy-a-tanstack-start-app-to-vercel]
- Fluid Compute در Hobby تا ۳۰۰ ثانیه حداکثر مدت Function را مستند کرده؛ کد AL timeout ۹۰ ثانیه‌ای دارد، پس روی کاغذ در این سقف جا می‌شود، ولی باید در محیط واقعی و endpoint واقعی آزمون شود. [حداکثر زمان Functions: https://vercel.com/docs/functions/configuring-functions/duration]
- Hobby سقف مصرف دارد؛ از جمله سهمیه CPU فعال، حافظه provisioned، invocation و function duration. خارج از سهمیه ممکن است اجرای سرویس تا بازه reset متوقف شود؛ پس «رایگان» به معنی نامحدود/بدون downtime نیست. [منبع رسمی Vercel Hobby: https://vercel.com/docs/plans/hobby]

### Database: Neon Free

- Free در مستند فعلی: ۱۰۰ CU-hour برای هر پروژه در ماه، ۱GB ذخیره‌سازی، ۵GB انتقال عمومی و scale-to-zero بعد از ۵ دقیقه عدم فعالیت. [محدودیت‌های Free Neon: https://github.com/neondatabase/website/blob/main/content/faqs/free-plan-limits-and-quotas.md]
- این دیتابیس دائمی است، برخلاف PGlite حافظه‌ایِ فعلی؛ اما بعد از idle ممکن است cold start ایجاد شود و سقف مصرف باید پایش شود.

### AL provider

- Groq free/developer rate limits وابسته به سازمان و مدل‌اند و با RPM/RPD/TPM/TPD سنجیده می‌شوند؛ عبور از حد باعث 429 می‌شود. ارقام دقیق را باید در داشبورد همان API key دید. [محدودیت‌های Groq API: https://console.groq.com/docs/rate-limits]
- کلید API موجود در اختیار سازنده، هزینه میزبانی را حذف نمی‌کند و دسترسی نامحدود یا رایگان مادام‌العمر تضمین نمی‌کند. باید مدل و سقف usage کلید مشخص باشد.
- هیچ نیازی نیست کلید را برای من بفرستید. موقع استقرار، مالک آن را به‌عنوان secret سمت سرور وارد می‌کند.

### محدودیت مفهوم «لینک دائمی»

می‌توانیم لینک پروژه را ثابت نگه داریم؛ اما لینک دائمیِ تضمین‌شده و میزبانی کاملاً رایگان و ۲۴/۷ بدون سقف وجود ندارد. سناریوی واقع‌بینانه: لینک `vercel.app` ثابت، Save روی Neon، اولین درخواست پس از idle کمی کندتر، و خاموش/محدود شدن موقت اگر سهمیه رایگان تمام شود.

**خصوصی بودن:** Private Git repository به‌تنهایی بازی را خصوصی نمی‌کند. URL Vercel برای هر کسی که آن را بداند باز می‌شود؛ پس باید تمام صفحات و APIها با احراز هویت حساب واحد سازنده محافظت شوند.

---

# F. فهرست فایل‌های اصلی برای کار بعدی

## معماری/میزبانی

- `package.json`, `package-lock.json`, `vercel.json`, `vite.config.ts`, `tsconfig.json`, `startup.sh`
- `src/lib/db.ts`, `scripts/migrate.mjs`, `scripts/migration-plan.mjs`, `migrations/*.sql`
- `src/lib/auth/server.ts`, `runtime-config.mjs`, `middleware.ts`, `verify.server.ts`, `email-password.ts`
- `src/lib/game/save.ts`, `save-validation.mjs`, `play.ts`, `gm.ts`, `xai.ts`
- `GROQ_SETUP.md` (نیاز به به‌روزرسانی مدل فعلی و دستور deploy دارد)

## Gameplay/simulation

- `src/lib/game/time.ts`, `delta.ts`, `parse.ts`, `p4-simulation.ts`, `clock-continuity.ts`, `store.ts`, `types.ts`
- `src/lib/game/sim/{npc,crisis,planner,council,investigation,letters,economy,factions,banquet,core}.ts`
- `src/lib/game/snapshot-array.ts`, `save-queue.ts`

## Platform/Content

- `src/lib/platform/registry.ts`, `desks.ts`, `gauges.ts`, `home.ts`, `voice.ts`, `leak.ts`, `options/catalog.ts`, `effects.ts`, `execute.ts`, `lookup.ts`
- `src/components/game/V45PanelBody.tsx`, `CommandDeck.tsx`, `GameShell.tsx`, `V41Panels.tsx`, `IndustrialViz.tsx`, `ChroniclePanel.tsx`, `CastPanel.tsx`
- `src/components/platform/*`
- `src/lib/canon/*.json`
- `scripts/verify-canon.mjs`, `scripts/verify-art.mjs`, `scripts/game.test.mjs`, `scripts/save-validation.test.mjs`

## Lore and project instructions

- `AGENTS.md`, `EGUNSENTIA_RELEASE_CHECKPOINTS.md`
- `GROK_PROMPT_REMAINING.txt`, `GROK_PROMPT_PLATFORM_REDESIGN.txt` (historical; metrics stale)
- `attachments/EGUNSENTIA_V4.1_SUPER_LORE_MASTER.txt` (stub only, not a canon source)
- Missing: `attachments/EGUNSENTIA_V4.5_Update_Prompt.txt`

---

# G. تصمیم‌های محافظتی و قواعدی که در شروع تعمیرات رعایت می‌شوند

1. Stage 47 CP1 و آرشیو Stage 46/40 تغییرناپذیر می‌مانند.
2. تمام تغییرات بعدی در Working Copy مستقل و با checkpoint ZIP جدید انجام می‌شوند.
3. هیچ named canon character، رابطه، شخصیت تاریخی، علت راز یا پاسخ به UNKNOWN از حدس ایجاد نمی‌شود.
4. rumor، theory، disputed، unknown و confirmed در داده و UI از هم جدا می‌مانند.
5. صرف «زیبا شدن پنل» completion نیست؛ هر پنل باید به state/command/test واقعی متصل باشد.
6. هیچ تستی برای سبز کردن suite حذف/شل نمی‌شود.
7. هیچ fallback حافظه‌ای در Production پذیرفته نیست.
8. API keys تنها در secrets سمت سرور و بدون prefix `VITE_` قرار می‌گیرند.
9. game-facing UI، روایت، پیام AL و notificationها انگلیسی می‌مانند؛ گزارش توسعه به مالک فارسی است.
10. تصویر/انیمیشن/ویدیو/موسیقی جدید تولید نمی‌شود مگر مالک سیاست رسانه‌ای را صریحاً عوض کند.

**گام اجرایی بعدی:** Milestone 0 (baseline تکرارپذیر) و سپس Milestone 1 (ایمنی آنلاین)؛ پیش از آن ساخت deploy عمومی/قابل‌دسترسی بدون auth ممنوع است.
