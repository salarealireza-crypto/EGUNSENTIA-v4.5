import test from "node:test";
import assert from "node:assert/strict";
import { describeSaveFailure, SAVE_FAILURE_NOTICE_INTERVAL_MS } from "../src/lib/game/save-errors.mjs";

test("save errors are classified without exposing raw technical details", () => {
  assert.equal(describeSaveFailure(new Error("fetch failed: private-host" )).kind, "network");
  assert.equal(describeSaveFailure(new Error("Unauthorized session" )).kind, "authorization");
  assert.equal(describeSaveFailure(new Error("Invalid campaign data: secret" )).kind, "validation");
  const result = describeSaveFailure(new Error("database password leaked"));
  assert.equal(result.kind, "storage");
  assert.doesNotMatch(result.notice, /database password leaked/i);
});

test("save failure notifications have an explicit throttle interval", () => {
  assert.equal(SAVE_FAILURE_NOTICE_INTERVAL_MS, 60_000);
});
