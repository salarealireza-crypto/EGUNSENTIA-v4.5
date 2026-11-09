import test from "node:test";
import assert from "node:assert/strict";
import { parseImportedSave, parseStoredSave, serializeSavePayload, validateImportFileSize } from "../src/lib/game/save-validation.mjs";

function snapshot() {
  const arrays = [
    "inbox", "news", "worldNews", "cases", "threads", "chronicle", "relations",
    "secretClocks", "calendar", "edicts", "stalkers", "finds", "sorties", "mysteries",
    "foreignReports", "kin", "log", "quickActions", "personalVault", "factionVault",
    "events", "household", "gates", "trades", "radio", "films", "intel", "memories",
    "reputations", "pregnancies", "children",
  ];
  return {
    version: "V4.5 Demo / Update 4.5",
    view: "play", dock: "platform", platformOpen: true, panel: "platform",
    world: {}, p4: {}, ...Object.fromEntries(arrays.map((key) => [key, []])),
    rollingSummary: "", turnCount: 0,
  };
}

test("serializes a structurally valid campaign snapshot", () => {
  const source = snapshot();
  const serialized = serializeSavePayload(source);
  assert.deepEqual(parseStoredSave(serialized), source);
});

test("rejects a missing required collection", () => {
  const source = snapshot();
  delete source.chronicle;
  assert.throws(() => serializeSavePayload(source), /chronicle/);
});

test("rejects malformed world and P4 roots", () => {
  assert.throws(() => serializeSavePayload({ ...snapshot(), world: null }), /world/);
  assert.throws(() => serializeSavePayload({ ...snapshot(), p4: [] }), /p4/);
});

test("rejects prototype-sensitive property names", () => {
  const source = JSON.parse(JSON.stringify(snapshot()));
  Object.defineProperty(source, "__proto__", { value: { polluted: true }, enumerable: true });
  assert.throws(() => serializeSavePayload(source), /unsupported data field/);
});

test("rejects non-finite numbers and invalid turn counters", () => {
  assert.throws(() => serializeSavePayload({ ...snapshot(), turnCount: -1 }), /turn counter/);
  const source = snapshot();
  source.world.water = Number.NaN;
  assert.throws(() => serializeSavePayload(source), /invalid number/);
});

test("rejects deeply nested and oversized payloads", () => {
  const deep = snapshot();
  let cursor = deep.world;
  for (let i = 0; i < 45; i += 1) cursor.child = (cursor = {});
  assert.throws(() => serializeSavePayload(deep), /nested too deeply/);
  assert.throws(() => parseStoredSave(" ".repeat(1_400_001)), /too large/);
});

test("rejects values that JSON serialization would silently discard", () => {
  const source = snapshot();
  source.world.missing = undefined;
  assert.throws(() => serializeSavePayload(source), /unsupported data/);
});

test("rejects malformed persisted JSON", () => {
  assert.throws(() => parseStoredSave("not-json"), /could not be read/);
});


test("imports a legacy campaign when newer optional collections are absent", () => {
  const legacy = snapshot();
  delete legacy.memories;
  delete legacy.reputations;
  delete legacy.pregnancies;
  delete legacy.children;
  delete legacy.p4;
  assert.equal(parseImportedSave(JSON.stringify(legacy)).version, legacy.version);
});

test("rejects malformed optional collections in an imported campaign", () => {
  const malformed = snapshot();
  malformed.children = {};
  assert.throws(() => parseImportedSave(JSON.stringify(malformed)), /children/);
});

test("rejects oversized or non-object imported campaign files", () => {
  assert.throws(() => parseImportedSave(" ".repeat(1_400_001)), /too large/);
  assert.throws(() => parseImportedSave(JSON.stringify([])), /invalid root/);
});


test("rejects invalid world clock counters and resource arithmetic fields", () => {
  for (const dayIndex of [-1, 1.5, "4", Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => parseImportedSave(JSON.stringify({ ...snapshot(), world: { dayIndex } })), /world\.dayIndex/);
  }
  for (const stock of [-1, "41000", Number.NaN, Number.POSITIVE_INFINITY]) {
    const source = snapshot();
    source.world = { water: { stock } };
    const serialized = JSON.stringify(source);
    assert.throws(() => parseImportedSave(serialized), /world\.water\.stock/);
  }
});

test("accepts legacy worlds with omitted nested fields and valid empty collections", () => {
  const legacy = snapshot();
  legacy.world = { dayIndex: 12, clock: { time: "07:00" }, water: { stock: 100, capacity: 200 } };
  legacy.trades = [];
  const parsed = parseImportedSave(JSON.stringify(legacy));
  assert.equal(parsed.world.dayIndex, 12);
  assert.deepEqual(parsed.trades, []);
});

test("loads older stored campaigns with missing optional collections through safe defaults", () => {
  const legacy = snapshot();
  delete legacy.chronicle;
  delete legacy.children;
  delete legacy.pregnancies;
  delete legacy.p4;
  const parsed = parseStoredSave(JSON.stringify(legacy));
  assert.equal(parsed.version, legacy.version);
  assert.equal("chronicle" in parsed, false);
  assert.equal("children" in parsed, false);
  assert.equal("p4" in parsed, false);
});

test("accepts a safe absolute birthDay and rejects malformed birthday values", () => {
  const valid = snapshot();
  valid.children = [{ id: "CH-test", name: "Test Child", ageYears: 0, birthDay: -365, status: "living", notes: "" }];
  assert.equal(parseStoredSave(JSON.stringify(valid)).children[0].birthDay, -365);
  for (const birthDay of ["365", 1.5, Number.NaN, Number.MAX_SAFE_INTEGER + 1]) {
    const invalid = snapshot();
    invalid.children = [{ id: "CH-test", birthDay }];
    assert.throws(() => parseImportedSave(JSON.stringify(invalid)), /birthDay/);
  }
});

test("rejects malformed optional world sections before restore can spread them", () => {
  const source = snapshot();
  source.world = { clock: [] };
  assert.throws(() => parseImportedSave(JSON.stringify(source)), /world clock/);
  source.world = { water: "not-a-resource-block" };
  assert.throws(() => parseImportedSave(JSON.stringify(source)), /world water/);
});


test("checks the browser File.size limit before file contents are read", async () => {
  validateImportFileSize(0);
  validateImportFileSize(1_400_000);
  for (const value of [-1, 1_400_001, Number.NaN, Number.POSITIVE_INFINITY, "10"]) {
    assert.throws(() => validateImportFileSize(value), /too large/);
  }
  const { readFileSync } = await import("node:fs");
  const { join } = await import("node:path");
  const { projectRoot } = await import("./with-app-env.mjs");
  const source = readFileSync(join(projectRoot(), "src/components/game/TitleScreen.tsx"), "utf8");
  assert.ok(source.indexOf("validateImportFileSize(file.size)") < source.indexOf("await file.text()"));
});


test("accepts legacy saves without privateRelations and validates the optional versioned block", () => {
  const legacy = snapshot();
  delete legacy.privateRelations;
  assert.equal(parseImportedSave(JSON.stringify(legacy)).version, legacy.version);
  const current = snapshot();
  current.privateRelations = { schemaVersion: 1, relationships: [], requests: [], consequences: [] };
  assert.doesNotThrow(() => serializeSavePayload(current));
  assert.throws(() => serializeSavePayload({ ...current, privateRelations: { schemaVersion: 2, relationships: [], requests: [], consequences: [] } }), /privateRelations/);
  assert.throws(() => parseImportedSave(JSON.stringify({ ...current, privateRelations: { schemaVersion: 1, relationships: [], requests: Array(101).fill({}), consequences: [] } })), /privateRelations\.requests/);
});
