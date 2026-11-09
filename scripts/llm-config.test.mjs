import test from "node:test";
import assert from "node:assert/strict";
import { resolveLlmConfig } from "../src/lib/game/xai.ts";

test("Groq uses the current production GPT OSS 120B default", () => {
  const cfg = resolveLlmConfig({ GROQ_API_KEY: "test-groq-key" });
  assert.equal(cfg.baseUrl, "https://api.groq.com/openai/v1");
  assert.equal(cfg.model, "openai/gpt-oss-120b");
  assert.equal(cfg.apiKey, "test-groq-key");
});

test("xAI defaults to Grok 4.7 without stale implicit fallback IDs", () => {
  const cfg = resolveLlmConfig({ XAI_API_KEY: "test-xai-key" });
  assert.equal(cfg.baseUrl, "https://api.x.ai/v1");
  assert.equal(cfg.model, "grok-4.7");
  assert.deepEqual(cfg.fallbacks, []);
});

test("explicit LLM settings override provider defaults", () => {
  const cfg = resolveLlmConfig({
    GROQ_API_KEY: "test-groq-key",
    LLM_BASE_URL: "https://llm.example.test/v1/",
    LLM_MODEL: "account-approved-model",
    LLM_FALLBACK_MODELS: "fallback-a, fallback-b",
  });
  assert.equal(cfg.baseUrl, "https://llm.example.test/v1");
  assert.equal(cfg.model, "account-approved-model");
  assert.deepEqual(cfg.fallbacks, ["fallback-a", "fallback-b"]);
});
