import test from "node:test";
import assert from "node:assert/strict";
import { evaluateCreatorAccess } from "../src/lib/auth/creator-access.mjs";

const creator = { id: "user_123", email: "Creator@Example.com" };

test("local non-production remains usable without a creator allowlist", () => {
  assert.deepEqual(evaluateCreatorAccess(creator, { NODE_ENV: "development" }), {
    allowed: true,
    reason: "local",
  });
});

test("deployed app denies access until the creator allowlist is configured", () => {
  assert.deepEqual(evaluateCreatorAccess(creator, { VERCEL: "1", NODE_ENV: "production" }), {
    allowed: false,
    reason: "not_configured",
  });
});

test("creator email matching is trimmed and case-insensitive but exact", () => {
  assert.equal(evaluateCreatorAccess(creator, {
    VERCEL: "1",
    EGUNSENTIA_OWNER_EMAILS: " other@example.com, creator@example.com ",
  }).allowed, true);
  assert.equal(evaluateCreatorAccess(creator, {
    VERCEL: "1",
    EGUNSENTIA_OWNER_EMAILS: "creator+other@example.com",
  }).allowed, false);
});

test("stable owner user ids are supported when email is unavailable", () => {
  assert.equal(evaluateCreatorAccess({ id: "user_123", email: null }, {
    VERCEL: "1",
    EGUNSENTIA_OWNER_IDS: "user_123,user_456",
  }).allowed, true);
});

test("a user outside the configured creator allowlist is denied", () => {
  assert.deepEqual(evaluateCreatorAccess({ id: "other", email: "other@example.com" }, {
    NODE_ENV: "production",
    EGUNSENTIA_OWNER_EMAILS: "creator@example.com",
  }), { allowed: false, reason: "not_allowlisted" });
});

test("the creator allowlist never grants access to an absent user", () => {
  assert.deepEqual(evaluateCreatorAccess(null, {
    VERCEL: "1",
    EGUNSENTIA_OWNER_IDS: "user_123",
  }), { allowed: false, reason: "unauthenticated" });
});
