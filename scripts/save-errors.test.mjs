import test from "node:test";
import assert from "node:assert/strict";
import { describeSaveFailure, SAVE_FAILURE_NOTICE_INTERVAL_MS } from "../src/lib/game/save-errors.mjs";

test("save errors are classified without exposing arbitrary technical details", () => {
  assert.equal(describeSaveFailure(new Error("fetch failed: private-host" )).kind, "network");
  assert.equal(describeSaveFailure(new Error("Unauthorized session" )).kind, "authorization");
  const validation = describeSaveFailure(new Error("TypeError: Invalid campaign data: world.clock.time."));
  assert.equal(validation.kind, "validation");
  assert.match(validation.notice, /Invalid field: world\.clock\.time/);
  const secret = describeSaveFailure(new Error("Invalid campaign data: customer@example.com secret-token"));
  assert.equal(secret.kind, "validation");
  assert.doesNotMatch(secret.notice, /customer@example|secret-token/i);
  const result = describeSaveFailure(new Error("database password leaked"));
  assert.equal(result.kind, "storage");
  assert.doesNotMatch(result.notice, /database password leaked/i);
});

test("save failure notifications have an explicit throttle interval", () => {
  assert.equal(SAVE_FAILURE_NOTICE_INTERVAL_MS, 60_000);
});
