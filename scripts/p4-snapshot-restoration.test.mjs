import assert from "node:assert/strict";
import { test } from "node:test";
import { defaultP4State, normalizeP4 } from "../src/lib/game/p4-simulation.ts";

test("P4 normalization restores required seed rosters and planner when saved arrays are empty", () => {
  const source = defaultP4State();
  const restored = normalizeP4({ ...source, factions: [], planner: [], envoys: [] });
  assert.equal(restored.factions.length, source.factions.length);
  assert.equal(restored.planner.length, 5);
  assert.equal(restored.envoys.length, 4);
});

test("P4 normalization supplies the same canonical defaults for absent legacy collections", () => {
  const source = defaultP4State();
  const restored = normalizeP4({ ...source, factions: undefined, planner: undefined, envoys: undefined });
  assert.equal(restored.factions.length, source.factions.length);
  assert.equal(restored.planner.length, 5);
  assert.equal(restored.envoys.length, 4);
});
