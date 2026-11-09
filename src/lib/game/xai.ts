const XAI_BASE = "https://api.x.ai/v1";
const XAI_MODEL = "grok-4.7";
const XAI_FALLBACKS: string[] = [];
const GROQ_BASE = "https://api.groq.com/openai/v1";
const GROQ_MODEL = "openai/gpt-oss-120b";

export type XaiKind = "credits" | "key" | "model" | "rate" | "other";

export interface XaiFail {
  ok: false;
  kind: XaiKind;
  error: string;
  status: number;
}

export interface XaiOk {
  ok: true;
  text: string;
  model: string;
}

export interface LlmConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
  fallbacks: string[];
  /** True when any LLM_* variable is set. Otherwise the xAI defaults apply. */
  configured: boolean;
  /** Env var name a missing-key error should name. Never the key itself. */
  keyVar: "LLM_API_KEY" | "GROQ_API_KEY" | "XAI_API_KEY";
}

function readEnv(env: NodeJS.ProcessEnv, name: string): string | undefined {
  const raw = env[name];
  if (typeof raw !== "string") return undefined;
  const value = raw.trim();
  return value || undefined;
}

function scrubSecrets(text: string, secrets: string[]): string {
  let out = text;
  for (const secret of secrets) {
    if (secret) out = out.split(secret).join("[redacted]");
  }
  return out;
}

export function resolveLlmConfig(env: NodeJS.ProcessEnv = process.env): LlmConfig {
  const llmKey = readEnv(env, "LLM_API_KEY");
  const xaiKey = readEnv(env, "XAI_API_KEY");
  const groqKey = readEnv(env, "GROQ_API_KEY");
  const baseSet = readEnv(env, "LLM_BASE_URL");
  const modelSet = readEnv(env, "LLM_MODEL");
  const fallbackSet = readEnv(env, "LLM_FALLBACK_MODELS");
  const configured = Boolean(llmKey || groqKey || baseSet || modelSet || fallbackSet);
  if (!configured) {
    return {
      apiKey: xaiKey ?? "",
      baseUrl: XAI_BASE,
      model: XAI_MODEL,
      fallbacks: [...XAI_FALLBACKS],
      configured: false,
      keyVar: "XAI_API_KEY",
    };
  }
  // Explicit LLM_* settings override provider defaults. Otherwise Groq keys
  // select Groq; legacy XAI_API_KEY keeps the existing xAI behavior.
  const useGroq = Boolean(groqKey && !llmKey && !baseSet && !modelSet && !fallbackSet);
  const fallbacks = fallbackSet
    ? fallbackSet.split(",").map((part) => part.trim()).filter(Boolean)
    : [];
  return {
    apiKey: llmKey ?? groqKey ?? xaiKey ?? "",
    baseUrl: (baseSet ?? (useGroq ? GROQ_BASE : XAI_BASE)).replace(/\/+$/, ""),
    model: modelSet ?? (useGroq ? GROQ_MODEL : XAI_MODEL),
    fallbacks,
    configured: true,
    keyVar: llmKey || baseSet || modelSet || fallbackSet ? "LLM_API_KEY" : groqKey ? "GROQ_API_KEY" : "LLM_API_KEY",
  };
}

export function archiveLinked(env: NodeJS.ProcessEnv = process.env): boolean {
  return Boolean(resolveLlmConfig(env).apiKey);
}

export function missingArchiveKeyMessage(env: NodeJS.ProcessEnv = process.env): string {
  const { keyVar } = resolveLlmConfig(env);
  return `The archive key is missing in this environment (${keyVar} not set). The Voice of the Fist cannot speak.`;
}

function chatCompletionsUrl(baseUrl: string): string {
  return `${baseUrl.replace(/\/+$/, "")}/chat/completions`;
}

export const MAX_LLM_RESPONSE_BYTES = 512 * 1024;

class LlmResponseTooLargeError extends Error {
  constructor() {
    super("The archive response exceeded the allowed size.");
    this.name = "LlmResponseTooLargeError";
  }
}

/** Read an upstream response with a strict byte cap, including chunked bodies. */
export async function readBoundedResponseText(
  response: Response,
  maxBytes = MAX_LLM_RESPONSE_BYTES,
): Promise<string> {
  if (!Number.isSafeInteger(maxBytes) || maxBytes < 1) {
    throw new TypeError("The response byte limit must be a positive safe integer.");
  }
  const declaredLength = Number(response.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    throw new LlmResponseTooLargeError();
  }
  if (!response.body) return "";

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  const chunks: string[] = [];
  let totalBytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        await reader.cancel();
        throw new LlmResponseTooLargeError();
      }
      chunks.push(decoder.decode(value, { stream: true }));
    }
    chunks.push(decoder.decode());
    return chunks.join("");
  } finally {
    reader.releaseLock();
  }
}

export function classify(status: number, body: string): { kind: XaiKind; error: string } {
  const t = body.toLowerCase();
  // Provider throttling is a transport-level rate limit, even when its body
  // happens to contain words such as "quota" or "usage".
  if (status === 429 || /rate.?limit|too many requests|\brpm\b/.test(t)) {
    return {
      kind: "rate",
      error: "The archive is rate-limited. Wait, then speak again.",
    };
  }
  if (
    status === 402 ||
    /spending-limit|out of credits|insufficient.?credit|quota|billing|subscription/.test(t)
  ) {
    return {
      kind: "credits",
      error: "The archive is out of credits. The Voice of the Fist is silent until the ledger is filled.",
    };
  }
  if (status === 401 || /invalid.?api.?key|incorrect api key|unauthorized|authentication/.test(t)) {
    return {
      kind: "key",
      error: "The archive key is refused. The Voice of the Fist cannot authenticate.",
    };
  }
  if (
    status === 403 ||
    status === 404 ||
    /model.*not|not allowed|permission|does not have access|unknown model|forbidden/.test(t)
  ) {
    if (/model/.test(t) || status === 404) {
      return {
        kind: "model",
        error: "This archive model is not permitted.",
      };
    }
    if (/credit|quota|spending/.test(t)) {
      return {
        kind: "credits",
        error: "The archive is out of credits. The Voice of the Fist is silent until the ledger is filled.",
      };
    }
    return {
      kind: "key",
      error: "The archive forbids this request. The key may be wrong, or this model is not allowed.",
    };
  }
  return {
    kind: "other",
    error: `The archive returns ${status}.`,
  };
}

async function callModel(
  apiKey: string,
  baseUrl: string,
  model: string,
  messages: { role: string; content: string }[],
  maxTokens: number,
): Promise<XaiOk | XaiFail> {
  let res: Response | undefined;
  let raw = "";
  const url = chatCompletionsUrl(baseUrl);
  // One retry on a pure network failure (no HTTP status), 90 s timeout each.
  for (let attempt = 0; ; attempt++) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 90_000);
    try {
      res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.85,
          max_tokens: maxTokens,
        }),
        signal: ctrl.signal,
      });
      raw = await readBoundedResponseText(res);
      clearTimeout(timer);
      break;
    } catch (err) {
      clearTimeout(timer);
      if (err instanceof LlmResponseTooLargeError) {
        return {
          ok: false,
          kind: "other",
          status: res?.status ?? 0,
          error: "The archive response exceeded the allowed size.",
        };
      }
      console.error("[xai] network", {
        attempt,
        model,
        err: scrubSecrets(String(err), [apiKey]),
      });
      if (attempt >= 1) {
        return {
          ok: false,
          kind: "other",
          status: 0,
          error: "The line to the archive dropped (network or timeout). Speak again.",
        };
      }
    }
  }
  if (!res) {
    return { ok: false, kind: "other", status: 0, error: "The line to the archive dropped (network or timeout). Speak again." };
  }
  if (!res.ok) {
    console.error("[xai]", {
      status: res.status,
      model,
      body: scrubSecrets(raw, [apiKey]).slice(0, 4000),
    });
    const mapped = classify(res.status, raw);
    return {
      ok: false,
      status: res.status,
      kind: mapped.kind,
      error: scrubSecrets(mapped.error, [apiKey]),
    };
  }
  try {
    const body = JSON.parse(raw) as { choices?: { message?: { content?: unknown } }[] };
    const text = body.choices?.[0]?.message?.content;
    if (typeof text !== "string" || !text.trim()) {
      return {
        ok: false,
        kind: "other",
        status: res.status,
        error: "The archive returned an empty or unreadable reply. Speak again.",
      };
    }
    return { ok: true, text, model };
  } catch (err) {
    console.error("[xai] parse", scrubSecrets(String(err), [apiKey]), scrubSecrets(raw, [apiKey]).slice(0, 1000));
    return {
      ok: false,
      kind: "other",
      status: res.status,
      error: "The archive answered in a tongue the Hall could not read.",
    };
  }
}

export async function completeChat(
  messages: { role: string; content: string }[],
  maxTokens = 2400,
  env: NodeJS.ProcessEnv = process.env,
): Promise<XaiOk | XaiFail> {
  const cfg = resolveLlmConfig(env);
  if (!cfg.apiKey) {
    return { ok: false, kind: "key", status: 0, error: missingArchiveKeyMessage(env) };
  }
  const first = await callModel(cfg.apiKey, cfg.baseUrl, cfg.model, messages, maxTokens);
  if (first.ok) return first;
  if (first.kind === "model") {
    for (const model of cfg.fallbacks) {
      const next = await callModel(cfg.apiKey, cfg.baseUrl, model, messages, maxTokens);
      if (next.ok) return next;
      if (next.kind !== "model") return next;
    }
  }
  return first;
}
