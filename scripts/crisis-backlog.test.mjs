import test from "node:test";
import assert from "node:assert/strict";
import { spawnCrisis } from "../src/lib/game/sim/crisis.ts";
import { defaultP4State, resolveCrisis } from "../src/lib/game/p4-simulation.ts";

const threatened = { water: 0.1, food: 0.1, energy: 0.9, gates: { east: "BREACHED" } };
const recovered = { water: 0.9, food: 0.9, energy: 0.9, gates: { east: "NORMAL" } };
const waterShortage = { water: 0.1, food: 0.9, energy: 0.9, gates: { east: "NORMAL" } };

test("crisis backlog drops conditions that recovered before their turn", () => {
  let p = spawnCrisis(defaultP4State(), threatened, 0);
  assert.equal(p.crisis.kind, "gate");
  assert.deepEqual([...p.crisisBacklog].sort(), ["food", "water"]);

  p = resolveCrisis(p, "Reinforce the gate", 60);
  assert.equal(p.crisis, null, "resolution does not activate a stale backlog without fresh world inputs");
  p = spawnCrisis(p, recovered, 120);
  assert.equal(p.crisis, null);
  assert.deepEqual(p.crisisBacklog, []);
});

test("crisis backlog activates the highest-priority condition that is still live", () => {
  let p = spawnCrisis(defaultP4State(), threatened, 0);
  p = resolveCrisis(p, "Reinforce the gate", 60);
  p = spawnCrisis(p, waterShortage, 120);
  assert.equal(p.crisis.kind, "water");
  assert.deepEqual(p.crisisBacklog, []);
});

test("crisis backlog is pruned while another crisis remains active", () => {
  let p = spawnCrisis(defaultP4State(), threatened, 0);
  assert.equal(p.crisis.kind, "gate");
  p = spawnCrisis(p, recovered, 30);
  assert.equal(p.crisis.kind, "gate", "an active crisis is not silently cancelled");
  assert.deepEqual(p.crisisBacklog, [], "recovered queued conditions are removed");
  p = resolveCrisis(p, "Reinforce the gate", 60);
  p = spawnCrisis(p, recovered, 120);
  assert.equal(p.crisis, null);
});
