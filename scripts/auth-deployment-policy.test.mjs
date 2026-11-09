import test from "node:test";
import assert from "node:assert/strict";
import { validateDeployedAuthConfig } from "../src/lib/auth/deployment-policy.mjs";

const valid = {
  VERCEL: "1",
  BETTER_AUTH_URL: "https://egunsentia-private.vercel.app",
  BETTER_AUTH_SECRET: "0123456789abcdef0123456789abcdef",
  GROK_AUTH_CLIENT_ID: "egunsentia-private-client",
  GROK_AUTH_CLIENT_SECRET: "private-client-secret-value",
};

test("local development does not require deployment OAuth credentials", () => {
  assert.deepEqual(validateDeployedAuthConfig({ NODE_ENV: "development" }), { deployed: false });
});

test("a valid deployed config returns only the canonical origin", () => {
  assert.deepEqual(validateDeployedAuthConfig(valid), {
    deployed: true,
    baseURL: "https://egunsentia-private.vercel.app",
  });
});

test("deployed auth refuses an explicit auth-off switch", () => {
  assert.throws(
    () => validateDeployedAuthConfig({ VERCEL: "1", VITE_AUTH_ENABLED: "false" }),
    /VITE_AUTH_ENABLED=false is not allowed/,
  );
});

test("deployed auth requires an explicit canonical URL", () => {
  assert.throws(() => validateDeployedAuthConfig({ ...valid, BETTER_AUTH_URL: "" }), /BETTER_AUTH_URL must be set/);
});

test("deployed auth rejects non-HTTPS origins and non-origin paths", () => {
  assert.throws(() => validateDeployedAuthConfig({ ...valid, BETTER_AUTH_URL: "http://egunsentia.vercel.app" }), /canonical HTTPS origin/);
  assert.throws(() => validateDeployedAuthConfig({ ...valid, BETTER_AUTH_URL: "https://egunsentia.vercel.app/path" }), /canonical HTTPS origin/);
});

test("deployed auth requires a 32-byte signing secret", () => {
  assert.throws(() => validateDeployedAuthConfig({ ...valid, BETTER_AUTH_SECRET: "too-short" }), /at least 32 bytes/);
});

test("deployed auth requires app-specific OAuth credentials", () => {
  assert.throws(() => validateDeployedAuthConfig({ ...valid, GROK_AUTH_CLIENT_SECRET: "" }), /dedicated GROK_AUTH_CLIENT_ID/);
  assert.throws(() => validateDeployedAuthConfig({ ...valid, GROK_AUTH_CLIENT_ID: "grok_preview" }), /shared preview OAuth client/);
});
