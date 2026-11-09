import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { restoreSnapshotArray } from "../src/lib/game/snapshot-array.ts";
import { projectRoot } from "./with-app-env.mjs";

const root = projectRoot();

test("an intentionally empty saved collection remains empty after restore", () => {
  const defaults = [{ id: "seed" }];
  assert.deepEqual(restoreSnapshotArray([], defaults), []);
});

test("missing or malformed legacy collections use safe campaign defaults", () => {
  const defaults = [{ id: "seed" }];
  assert.deepEqual(restoreSnapshotArray(undefined, defaults), defaults);
  assert.deepEqual(restoreSnapshotArray(null, defaults), defaults);
  assert.deepEqual(restoreSnapshotArray({ id: "not-a-list" }, defaults), defaults);
});

test("campaign loading uses explicit empty-list preservation for seeded arrays", () => {
  const source = readFileSync(join(root, "src/lib/game/store.ts"), "utf8");
  for (const collection of [
    "chronicle", "quickActions", "personalVault", "factionVault", "events",
    "gates", "trades", "radio", "films", "intel", "memories", "reputations", "children",
  ]) {
    assert.match(source, new RegExp(`${collection}: restoreSnapshotArray\\(snap\\.${collection}, base\\.${collection}\\)`));
  }
  assert.match(source, /household: migrateHousehold\(restoreSnapshotArray\(snap\.household, base\.household\)\)/);
  assert.match(source, /log: snap\.log\?\.length \? snap\.log : freshLog\(\)/);
});
