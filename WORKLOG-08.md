# EGUNSENTIA Stage 08 worklog

## Implemented
- Aligned the player-facing narrator identity with the game's AL terminology instead of exposing the legacy provider name Grok.
- Updated the install sheet, title screen status, and Android share text. Provider selection remains a server-side implementation detail, so changing Groq/model/provider later does not require changing the game's narrative identity.
- No API credentials were added to the source, browser bundle, or distributable archive.

## Verification
- Stage 07 baseline retained; this stage changes only player-facing narrator copy.
- Focused diplomacy/research tests: 8/8 passed. Canon verification: PASS (65-panel registry, invariants, 167 assets, preserved art, and option catalogs).
- Full typecheck/build are currently blocked by incomplete `node_modules` in the execution environment (missing `@types/node`, `vite/client`, and `zustand`). An `npm ci` attempt timed out; no successful dependency installation is claimed.
- Production art remains incomplete; no generated raster assets were added.

## Security
- `GROQ_API_KEY` remains server-only. Do not use the key exposed in chat; rotate it and configure a replacement through deployment environment settings.
