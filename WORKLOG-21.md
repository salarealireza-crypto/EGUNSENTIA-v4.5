# EGUNSENTIA — Worklog 21

## Scope
Continue Phase 1 with trade-offer deadline/reminder lifecycle auditing.

## Finding
The day-advance path emitted the same "still open" recess-trade reminder on every simulated day after day 2. The offer was deliberately not auto-accepted, because its deadline is natural-language text ("before Council recess") and does not encode a precise expiry instant; however, repeating the same reminder daily created notification spam during long skips and across separate advances.

## Changes
- Added optional persisted `TradeOffer.lastReminderDay` metadata.
- Extracted `collectTradeReminders()` as a pure helper.
- An open recess offer now receives its first reminder after the existing grace period, then at most one reminder every seven in-world days.
- Closed offers and offers with unrelated deadline text do not receive reminders.
- Offers are not automatically expired or accepted; player/AL decision semantics remain unchanged.
- Added `scripts/trade-reminders.test.mjs` with three regression tests.

## Verification
- Focused crisis, long-campaign, resource-policy, and trade-reminder suites: **11/11 PASS**.
- Full `npm test`: **318 passed / 2 failed / 320 total**. The two known failures remain import-time blockers in the game option execution tests because `node_modules/zustand/index.js` is missing; no test was removed or skipped.
- Canon verification: **PASS**.
- Art verification: **structural PASS only**; all 23 art groups still need completion.
- TypeScript, ESLint, production build, and browser smoke remain unverified/blocked by incomplete dependencies.

## Phase status
Phase 1 remains open. Original uploaded archives remain unchanged. No release archive or deployment was created.
