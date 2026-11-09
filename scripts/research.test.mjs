import test from "node:test";
import assert from "node:assert/strict";
import { commissionResearch, RESEARCH_PROJECTS, tickResearchDay } from "../src/lib/game/sim/research.ts";
import { advanceClock, defaultP4State } from "../src/lib/game/p4-simulation.ts";

test("research commission reserves exact materials and records the R&D allotment", () => {
  const before = defaultP4State();
  const project = RESEARCH_PROJECTS[0];
  const result = commissionResearch(before, project.id);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.state.economy.filters.stock, before.economy.filters.stock - 8);
  assert.equal(result.state.economy.glass.stock, before.economy.glass.stock - 5);
  assert.equal(result.state.economy["chemical feedstock"].stock, before.economy["chemical feedstock"].stock - 4);
  assert.equal(result.state.spent.marks, before.spent.marks + project.cost);
  assert.equal(result.state.flags[`research:${project.id}`], true);
  assert.match(result.state.deskNotes[0], /RESEARCH COMMISSIONED/);
  assert.equal(before.economy.filters.stock, 200, "input state must remain unchanged");
});

test("research commission refuses duplicate projects and insufficient reserves", () => {
  const first = commissionResearch(defaultP4State(), "rail-bearing");
  assert.equal(first.ok, true);
  if (!first.ok) return;
  assert.deepEqual(commissionResearch(first.state, "rail-bearing"), { ok: false, reason: "already-commissioned" });
  const poor = defaultP4State();
  poor.economy["machine bearings"].stock = 0;
  assert.deepEqual(commissionResearch(poor, "rail-bearing"), { ok: false, reason: "insufficient-materials" });
});

test("unknown research ids are rejected without mutating state", () => {
  const before = defaultP4State();
  const result = commissionResearch(before, "unknown-project");
  assert.deepEqual(result, { ok: false, reason: "missing-economy" });
  assert.equal(before.spent.marks, 0);
});

test("research advances with the in-game day and grants its production benefit only on completion", () => {
  const commissioned = commissionResearch(defaultP4State(), "filter-recovery");
  assert.equal(commissioned.ok, true);
  if (!commissioned.ok) return;
  const startProduction = commissioned.state.economy.filters.production;
  const dayTwo = tickResearchDay(commissioned.state, 2);
  assert.equal(dayTwo.researchProjects["filter-recovery"].progress, 50);
  assert.equal(dayTwo.researchProjects["filter-recovery"].status, "active");
  assert.equal(dayTwo.economy.filters.production, startProduction);
  const dayFour = tickResearchDay(dayTwo, 4);
  assert.equal(dayFour.researchProjects["filter-recovery"].status, "completed");
  assert.equal(dayFour.researchProjects["filter-recovery"].progress, 100);
  assert.equal(dayFour.economy.filters.production, startProduction + 2);
  assert.match(dayFour.deskNotes[0], /RESEARCH COMPLETED/);
});

test("advanceClock resolves research completion at the due day", () => {
  const commissioned = commissionResearch(defaultP4State(), "signal-grid");
  assert.equal(commissioned.ok, true);
  if (!commissioned.ok) return;
  const report = advanceClock(commissioned.state, 7 * 60, 5 * 1440 + 7 * 60);
  assert.equal(report.p4.researchProjects["signal-grid"].status, "completed");
  assert.equal(report.p4.researchProjects["signal-grid"].completedDay, 5);
  assert.equal(report.p4.economy["copper wire"].production, commissioned.state.economy["copper wire"].production + 2);
});
