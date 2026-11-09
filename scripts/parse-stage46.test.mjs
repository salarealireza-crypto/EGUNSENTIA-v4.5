import assert from "node:assert/strict";
import test from "node:test";
import { parseGm } from "../src/lib/game/parse.ts";

test("GM parser excludes orphaned state without a footer and rejects truncated JSON", () => {
  const noFooter = parseGm('<<<SCENE>>>A scene.<<<STATE>>>{"resources":{"water":{"stock":4}}}');
  assert.equal(noFooter.scene, "A scene.");
  assert.equal(noFooter.stateMissing, true);
  const truncated = parseGm('<<<SCENE>>>A scene.<<<FOOTER>>>Time: 09:00\n<<<STATE>>>{"resources":');
  assert.equal(truncated.stateMissing, true);
  assert.equal(truncated.stateRaw, null);
});

test("GM parser accepts a complete state block", () => {
  const parsed = parseGm('<<<SCENE>>>A scene.<<<FOOTER>>>Time: 09:00\nDay: Ironday\n<<<STATE>>>{"turn":2}<<<END>>>');
  assert.equal(parsed.scene, "A scene.");
  assert.equal(parsed.stateMissing, false);
  assert.deepEqual(parsed.stateRaw, { turn: 2 });
});

test("GM parser discards an otherwise valid state block without its completion marker", () => {
  const parsed = parseGm('<<<SCENE>>>A complete scene.<<<FOOTER>>>Time: 09:00\n<<<STATE>>>{"resources":{"water":{"stock":4}}}');
  assert.equal(parsed.scene, "A complete scene.");
  assert.equal(parsed.stateMissing, true);
  assert.equal(parsed.stateRaw, null);
});

test("GM parser preserves valid scene text when structured state is malformed", () => {
  const parsed = parseGm('<<<SCENE>>>The gate crew reports a quiet watch.<<<FOOTER>>>Time: 09:00\n<<<STATE>>>{"resources":{"water":{"stock":4},}<<<END>>>');
  assert.equal(parsed.scene, "The gate crew reports a quiet watch.");
  assert.equal(parsed.stateMissing, true);
  assert.equal(parsed.stateRaw, null);
});

test("an intentionally partial but complete state object remains valid", () => {
  const parsed = parseGm('<<<SCENE>>>The report is complete.<<<FOOTER>>>Time: 09:00\n<<<STATE>>>{}<<<END>>>');
  assert.equal(parsed.stateMissing, false);
  assert.deepEqual(parsed.stateRaw, {});
});
