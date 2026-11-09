import test from "node:test";
import assert from "node:assert/strict";
import { buildRollingMemorySummary } from "../src/lib/game/rolling-memory.mjs";

test("rolling AL memory retains only the newest eight turn entries", () => {
  const entries = Array.from({ length: 10 }, (_, i) => ({ kind: "turn", at: `D${i}`, line: `Turn ${i}` }));
  const summary = buildRollingMemorySummary(entries);
  assert.doesNotMatch(summary, /Turn 0|Turn 1/);
  assert.match(summary, /Turn 2/);
  assert.match(summary, /Turn 9/);
});

test("rolling AL memory truncates from the beginning and preserves the newest tail", () => {
  const summary = buildRollingMemorySummary([
    { kind: "turn", line: "OLD-" + "x".repeat(100) },
    { kind: "turn", line: "NEWEST-MARKER" },
  ], 40);
  assert.equal(summary.length, 40);
  assert.ok(summary.endsWith("NEWEST-MARKER"));
  assert.ok(!summary.startsWith("OLD-"));
});
