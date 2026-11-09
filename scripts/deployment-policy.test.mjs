import assert from "node:assert/strict";
import test from "node:test";
import { validateDeployedAuthConfig } from "../src/lib/auth/deployment-policy.mjs";

const base = {
  VERCEL: "1",
  BETTER_AUTH_URL: "https://egunsentia.example.com",
  BETTER_AUTH_SECRET: "a".repeat(64),
};

test("self-hosted Vercel owner-password mode works without Grok broker credentials", () => {
  assert.deepEqual(validateDeployedAuthConfig({ ...base, EGUNSENTIA_AUTH_MODE: "owner-password" }), {
    deployed: true,
    baseURL: "https://egunsentia.example.com",
  });
});

test("missing broker credentials still fail unless owner-password mode is explicit", () => {
  assert.throws(
    () => validateDeployedAuthConfig(base),
    /GROK_AUTH_CLIENT_ID.*EGUNSENTIA_AUTH_MODE=owner-password/,
  );
});

test("the shared Grok preview credential remains forbidden on Vercel", () => {
  assert.throws(
    () => validateDeployedAuthConfig({
      ...base,
      EGUNSENTIA_AUTH_MODE: "owner-password",
      GROK_AUTH_CLIENT_ID: "grok_preview",
      GROK_AUTH_CLIENT_SECRET: "preview-secret",
    }),
    /shared preview OAuth client cannot be used/,
  );
});

test("owner-password mode does not weaken the HTTPS origin requirement", () => {
  assert.throws(
    () => validateDeployedAuthConfig({
      ...base,
      EGUNSENTIA_AUTH_MODE: "owner-password",
      BETTER_AUTH_URL: "http://egunsentia.example.com",
    }),
    /canonical HTTPS origin/,
  );
});

test("owner-password mode does not weaken the Better Auth signing-secret requirement", () => {
  assert.throws(
    () => validateDeployedAuthConfig({
      ...base,
      EGUNSENTIA_AUTH_MODE: "owner-password",
      BETTER_AUTH_SECRET: "too-short",
    }),
    /at least 32 bytes/,
  );
});
