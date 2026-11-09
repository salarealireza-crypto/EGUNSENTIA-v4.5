import test from "node:test";
import assert from "node:assert/strict";
import { FACTION_SEED, diplomaticAssessment, stepFactions } from "../src/lib/game/sim/factions.ts";

test("diplomatic assessment translates stored standing and political pressure into readable signals", () => {
  const ally = diplomaticAssessment(FACTION_SEED[0], 4);
  assert.equal(ally.standing, "warm");
  assert.equal(ally.risk, "low");
  assert.equal(ally.leverage, "strong");
  assert.match(ally.summary, /alliance/i);

  const strained = diplomaticAssessment({ ...FACTION_SEED[4], pressure: 9, tension: 8, mobilization: 7 }, -4);
  assert.equal(strained.standing, "strained");
  assert.equal(strained.risk, "high");
  assert.equal(strained.pressure, "severe");
  assert.match(strained.summary, /escalation/i);
});

test("diplomatic assessment is read-only and stable for older faction saves", () => {
  const oldSaveFaction = { id: "Demos", mood: 5, pressure: 3, treasury: 0, agenda: "", lastAction: "" };
  const before = structuredClone(oldSaveFaction);
  const first = diplomaticAssessment(oldSaveFaction, 0);
  const second = diplomaticAssessment(oldSaveFaction, 0);
  assert.deepEqual(oldSaveFaction, before);
  assert.deepEqual(first, second);
  assert.equal(first.standing, "even");
});

test("weekly faction simulation remains deterministic after adding diplomatic reads", () => {
  const a = stepFactions(structuredClone(FACTION_SEED), 3);
  const b = stepFactions(structuredClone(FACTION_SEED), 3);
  assert.deepEqual(a, b);
});
