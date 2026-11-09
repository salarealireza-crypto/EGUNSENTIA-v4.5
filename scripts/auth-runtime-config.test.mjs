import test from "node:test";
import assert from "node:assert/strict";
import { resolveBetterAuthSecret } from "../src/lib/auth/runtime-config.mjs";

test("uses the explicitly configured signing secret", () => {
  let fallbackCalled = false;
  assert.equal(
    resolveBetterAuthSecret({
      configuredSecret: "  stable-secret-from-env  ",
      isVercel: true,
      previewSecret: () => { fallbackCalled = true; return "x".repeat(64); },
    }),
    "stable-secret-from-env",
  );
  assert.equal(fallbackCalled, false);
});

test("fails closed on Vercel when the signing secret is missing", () => {
  assert.throws(
    () => resolveBetterAuthSecret({ isVercel: true, previewSecret: () => "x".repeat(64) }),
    /BETTER_AUTH_SECRET must be configured in Vercel/,
  );
});

test("fails closed on Vercel when the signing secret is blank", () => {
  assert.throws(
    () => resolveBetterAuthSecret({ configuredSecret: "  ", isVercel: true, previewSecret: () => "x".repeat(64) }),
    /BETTER_AUTH_SECRET must be configured in Vercel/,
  );
});

test("retains the process-stable fallback for non-Vercel previews", () => {
  const expected = "p".repeat(64);
  assert.equal(
    resolveBetterAuthSecret({ isVercel: false, previewSecret: () => expected }),
    expected,
  );
});

test("rejects an invalid preview fallback", () => {
  assert.throws(
    () => resolveBetterAuthSecret({ isVercel: false, previewSecret: () => "short" }),
    /valid preview authentication secret/,
  );
});
