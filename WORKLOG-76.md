# WORKLOG-76 — AL quick-action composer recovery (2026-11-10)

## Finding
The Hall quick-action chips (`Speak with Dagmar`, `Ask after Liese`, `Open the Platform`, `Wait until the briefing`, and related suggestions) are actual buttons wired to `ActionBar.send()` and `submitAction()`.

`submitAction()` sets the shared `busy` flag before requesting the AL server function. Its non-OK result branch and catch branch returned without clearing `busy`. `ActionBar.send()` refuses to submit while `busy` is true, so the composer and quick-action chips become inert after a failed request.

## Repair
A focused GitHub Actions follow-up applies a guarded patch to `src/lib/game/play.ts`, adding a `finally` block that always clears `busy`. The script refuses to modify the file unless it finds the exact expected block once, and it is idempotent.

## Scope
This does not change campaign state, Neon data, authentication, or provider keys. It only restores the ability to submit or retry after a failed AL request. The actual provider/API error still needs separate diagnosis if AL continues to fail after the composer is unlocked.
