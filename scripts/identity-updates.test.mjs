import test from "node:test";
import assert from "node:assert/strict";
import { patchExistingByStableId } from "../src/lib/game/identity-updates.mjs";

test("kin and household updates follow stable ids, not display names or array positions", () => {
  const current = [
    { id: "HH-1", name: "Old display name", mood: "calm", affection: 4 },
    { id: "HH-2", name: "Same display name", mood: "steady", affection: 7 },
  ];
  const updates = [{ id: "HH-2", name: "Renamed", mood: "concerned", affection: 8 }];
  const result = patchExistingByStableId(current, updates);
  assert.equal(result[0].name, "Old display name");
  assert.equal(result[0].affection, 4);
  assert.equal(result[1].id, "HH-2");
  assert.equal(result[1].name, "Renamed");
  assert.equal(result[1].affection, 8);
});

test("stable-id updates never create new canon people and reject duplicate or missing ids", () => {
  const current = [{ id: "KIN-known", name: "Known person", mood: "calm" }];
  assert.deepEqual(patchExistingByStableId(current, [{ id: "KIN-unknown", name: "Unapproved person" }]), current);
  assert.throws(() => patchExistingByStableId(current, [{ name: "Name-only" }]), /stable person id/);
  assert.throws(() => patchExistingByStableId(current, [{ id: "KIN-known" }, { id: "KIN-known" }]), /only once/);
});
