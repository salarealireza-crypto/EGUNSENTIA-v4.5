# AL quick-action recovery report — 2026-11-10

The quick-action suggestions are functional buttons, not decorative labels. Their click handler calls `submitAction()`. The source had an error-path state leak: after the AL server function returned `{ ok: false }` or threw, the shared `busy` state remained `true`. Subsequent clicks returned immediately at both the `ActionBar.send()` guard and the `submitAction()` guard.

The focused repair adds a `finally` block to `submitAction()` so `busy` is reset for both success and failure. The GitHub Actions follow-up is triggered only after the existing archive-import workflow completes successfully on `main`; it verifies one exact target block, commits only `src/lib/game/play.ts`, and pushes the repair to `main`. Vercel then receives the new commit through its existing Git integration.

This repair addresses the permanently locked composer. It does not guarantee that the Groq/xAI upstream request itself succeeds; any remaining provider error should be diagnosed from the server response after the composer can be retried.
