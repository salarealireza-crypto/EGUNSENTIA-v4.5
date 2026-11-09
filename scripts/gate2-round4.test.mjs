import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { appendOptionCommandIdentity, optionCommandIdentity } from "../src/lib/game/sim/option-command.ts";
import { defaultP4State, normalizeP4 } from "../src/lib/game/p4-simulation.ts";
import { LEGACY_ALIASES, PANEL_BY_ID, PANEL_REGISTRY, resolveCanonicalPanelId, resolveLegacyPanelTarget, resolvePanelId } from "../src/lib/platform/registry.ts";
import { OPTION_CATALOG } from "../src/lib/platform/options/catalog.ts";
import { parseStoredSave, serializeSavePayload } from "../src/lib/game/save-validation.mjs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("generic option command identity is stable and bound to an exact world minute", () => {
  assert.equal(optionCommandIdentity("14-OPT-03", 7, 615), "v45-option:14-OPT-03:7:615");
  assert.equal(optionCommandIdentity("14-OPT-03", 7, 616), "v45-option:14-OPT-03:7:616");
  assert.equal(optionCommandIdentity("14-OPT-03", 8, 615), "v45-option:14-OPT-03:8:615");
  assert.equal(optionCommandIdentity("", 7, 615), null);
  assert.equal(optionCommandIdentity("../secret", 7, 615), null);
  assert.equal(optionCommandIdentity("14-OPT-03", -1, 615), null);
  assert.equal(optionCommandIdentity("14-OPT-03", 7, 1440), null);
  assert.equal(optionCommandIdentity("14-OPT-03", 7, 1.5), null);
});

test("successful generic option identities are deduplicated and bounded to 500", () => {
  const once = appendOptionCommandIdentity([], "v45-option:14-OPT-03:7:615");
  const twice = appendOptionCommandIdentity(once, "v45-option:14-OPT-03:7:615");
  assert.deepEqual(twice, once);
  const many = Array.from({ length: 505 }, (_, i) => `option-${i}`);
  const bounded = appendOptionCommandIdentity(many, "option-505");
  assert.equal(bounded.length, 500);
  assert.equal(bounded[0], "option-6");
  assert.equal(bounded.at(-1), "option-505");
});

test("generic option idempotency survives P4 normalization and legacy saves default safely", () => {
  const base = defaultP4State();
  assert.deepEqual(normalizeP4(base).appliedOptionCommandIds, []);
  const keys = Array.from({ length: 505 }, (_, i) => `v45-option:${i}:1:420`);
  const restored = normalizeP4({ ...base, appliedOptionCommandIds: keys });
  assert.equal(restored.appliedOptionCommandIds.length, 500);
  assert.equal(restored.appliedOptionCommandIds[0], "v45-option:5:1:420");
  assert.deepEqual(normalizeP4({ ...base, appliedOptionCommandIds: ["ok", null, 4] }).appliedOptionCommandIds, ["ok"]);
});

test("generic option command identities survive the real save serializer and parser", () => {
  const payload = {
    version: "round4-test",
    inbox: [], news: [], worldNews: [], cases: [], threads: [], chronicle: [], relations: [],
    secretClocks: [], calendar: [], edicts: [], stalkers: [], finds: [], sorties: [], mysteries: [],
    foreignReports: [], kin: [], log: [], quickActions: [], personalVault: [], factionVault: [],
    events: [], household: [], gates: [], trades: [], radio: [], films: [], intel: [], memories: [],
    reputations: [], pregnancies: [], children: [],
    world: { dayIndex: 7, clock: { time: "17:15" }, treasury: { marks: 80 } },
    p4: { appliedOptionCommandIds: ["v45-option:14-OPT-03:7:615"] },
    rollingSummary: "", turnCount: 3,
  };
  const serialized = serializeSavePayload(payload);
  const restored = parseStoredSave(serialized);
  assert.deepEqual(restored.p4.appliedOptionCommandIds, payload.p4.appliedOptionCommandIds);
});

test("all 65 canonical panel IDs resolve to themselves", () => {
  assert.equal(PANEL_REGISTRY.length, 65);
  for (let i = 1; i <= 65; i++) {
    const id = String(i).padStart(2, "0");
    assert.ok(PANEL_BY_ID[id], `panel ${id} exists`);
    assert.equal(resolveCanonicalPanelId(id), id);
  }
  assert.equal(resolveCanonicalPanelId("not-a-panel"), null);
});

test("legacy panel redirects are explicit, valid, and separate from canonical navigation", () => {
  const aliases = Object.entries(LEGACY_ALIASES);
  assert.equal(aliases.length, 11);
  assert.equal(new Set(aliases.map(([source]) => source)).size, aliases.length);
  for (const [source, target] of aliases) {
    assert.ok(PANEL_BY_ID[target], `${source} redirects to an existing canonical panel ${target}`);
    assert.equal(resolveLegacyPanelTarget(source), target);
    assert.equal(resolveCanonicalPanelId(source), source, `${source} remains reachable as a current panel`);
    assert.equal(resolvePanelId(source), target, `${source} keeps the historical legacy-first behavior`);
  }
  for (const panel of PANEL_REGISTRY) {
    if (panel.legacyAlias) assert.equal(LEGACY_ALIASES[panel.id], panel.legacyAlias);
  }
});

test("store guards generic option execution before runOption and records both completion branches", () => {
  const source = read("src/lib/game/store.ts");
  const blockStart = source.indexOf("executeV45Option: (optionId) => {");
  const blockEnd = source.indexOf("      setV45Setting:", blockStart);
  assert.ok(blockStart >= 0 && blockEnd > blockStart);
  const block = source.slice(blockStart, blockEnd);
  assert.ok(block.indexOf("optionCommandIdentity(") < block.indexOf("runOption({"));
  assert.match(block, /appliedOptionCommandIds\?\.includes\(commandId\)/);
  assert.match(block, /advanced\.p4, appliedOptionCommandIds: appendOptionCommandIdentity/);
  assert.match(block, /result\.p4, appliedOptionCommandIds: appendOptionCommandIdentity/);
});

test("catalog Political Capital costs are audited, not silently treated as spendable currency", () => {
  const options = Object.values(OPTION_CATALOG).flat();
  const positive = options.filter((option) => (option.costs?.politicalCapital ?? 0) > 0);
  const waits = options.filter((option) => option.category === "Wait");
  assert.equal(options.length, 403);
  assert.equal(positive.length, 182);
  assert.equal(waits.length, 26);
  assert.ok(waits.every((option) => (option.costs?.politicalCapital ?? 0) > 0));
  const source = read("src/lib/platform/options/execute.ts");
  assert.match(source, /unresolvedPoliticalCapital/);
  assert.match(source, /no authoritative balance or ledger exists/i);
  assert.doesNotMatch(source, /politicalCapitalBalance|spendPoliticalCapital/i);
});
