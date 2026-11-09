# Server-side Groq configuration

EGUNSENTIA's AL narrator uses the existing server-side OpenAI-compatible chat transport. To use Groq, add this environment variable to the **server deployment**:

- `GROQ_API_KEY` — the Groq API key, stored as a secret environment variable.

When `GROQ_API_KEY` is the only provider setting, the server selects:

- Base URL: `https://api.groq.com/openai/v1`
- Default model: `openai/gpt-oss-120b`

The previous default `llama-3.3-70b-versatile` was deprecated for free and developer-tier usage on 16 August 2026. Groq's current deprecation guidance recommends `openai/gpt-oss-120b` or `qwen/qwen3.6-27b`; the latter was itself superseded in September 2026, so this project selects the currently listed production `openai/gpt-oss-120b` default. A real request still must be checked against the exact account key before play is enabled.

The provider remains replaceable without changing game code. Set `LLM_API_KEY`, `LLM_BASE_URL`, and `LLM_MODEL` to override the provider endpoint, credential, and model; optionally set `LLM_FALLBACK_MODELS` as a comma-separated list. Existing `XAI_API_KEY` behavior remains supported and now defaults to the current documented xAI flagship model `grok-4.7`. No fallback model is tried implicitly; specify only fallback IDs that the account can use.

**Never put API keys in `VITE_*` variables, browser code, a committed `.env` file, APK assets, or a distributable ZIP.** Add or rotate the secret in the deployment provider's server-side environment settings, then redeploy. No real key is stored in this source package.
