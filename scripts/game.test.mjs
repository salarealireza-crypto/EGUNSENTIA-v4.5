// Run: node --import ./scripts/register-ts.mjs --test scripts/game.test.mjs
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const exists = (p) => { const raw = String(p); const rel = raw.startsWith("/.grok/") ? raw.slice(1) : raw.startsWith("/") ? `public${raw}` : raw; return fs.existsSync(path.join(root, rel)); };
const imp = (p) => import(path.join(root, p));

const { PANEL_REGISTRY } = await imp("src/lib/platform/registry.ts");
const { OPTION_CATALOG } = await imp("src/lib/platform/options/catalog.ts");
const T = await imp("src/lib/game/time.ts");
const { parseGm } = await imp("src/lib/game/parse.ts");
const { parseStateDelta } = await imp("src/lib/game/delta.ts");
const chatArchive = await imp("src/lib/game/chat-archive.ts");
const K = await imp("src/lib/game/kernel.ts");
const V = await imp("src/lib/game/v41-data.ts");
const { auditWorld } = await imp("src/lib/platform/audit.ts");
const { leaks, collectStrings } = await imp("src/lib/platform/leak.ts");
const S = await imp("src/lib/game/p4-simulation.ts");
const core = await imp("src/lib/game/sim/core.ts");
const L = await imp("src/lib/game/sim/letters.ts");
const P = await imp("src/lib/game/sim/planner.ts");
const B = await imp("src/lib/game/sim/banquet.ts");
const C = await imp("src/lib/game/sim/crisis.ts");
const N = await imp("src/lib/game/sim/npc.ts");
const I = await imp("src/lib/game/sim/investigation.ts");
const E = await imp("src/lib/game/sim/economy.ts");
const F = await imp("src/lib/game/sim/factions.ts");
const CM = await imp("src/lib/game/sim/council.ts");
const Execute = await imp("src/lib/platform/options/execute.ts");
const cards = JSON.parse(read("src/lib/canon/cards.json"));
const store = read("src/lib/game/store.ts");

test("chat TXT archive is readable and restores messages, alternate AL replies, and active selection", () => {
  const original = [
    { id: "p-1", role: "player", text: "سلام؛ تصمیم من این است." },
    { id: "s-1", role: "scene", text: "پاسخ نخست AL.", variants: ["پاسخ نخست AL.", "پاسخ جایگزین AL."], activeVariant: 1,
      footer: { time: "09:00", day: "Ironday", floor: "Hall", interrupt: "normal" } },
  ];
  const txt = chatArchive.serializeChatArchive(original);
  assert.match(txt, /EGUNSENTIA — CHAT HISTORY/);
  assert.match(txt, /سلام؛ تصمیم من این است\./);
  assert.match(txt, /پاسخ نخست AL\./);
  assert.deepEqual(chatArchive.parseChatArchive(txt), original);
  // Existing v1 JSON exports remain importable.
  assert.deepEqual(chatArchive.parseChatArchive(JSON.stringify({ format: "EGUNSENTIA_CHAT_ARCHIVE", version: 1, log: original })), original);
});

const snapshot = (p4) => ({ world: K.dayOneWorld(), household: V.dayOneHousehold(), log: [], news: K.dayOneNews(), worldNews: K.dayOneWorldNews(), chronicle: K.dayOneChronicle(), inbox: K.dayOneInbox(), intel: V.dayOneIntel(), memories: V.dayOneMemories(), events: V.dayOneEvents(), p4 });

// ---------------------------------------------------------------- A4.7: registry / alias / catalog
test("canonical panel registry is exactly 65 unique panels [01]-[65]", () => {
  assert.equal(PANEL_REGISTRY.length, 65);
  assert.equal(new Set(PANEL_REGISTRY.map((p) => p.number)).size, 65);
  for (let i = 1; i <= 65; i++) assert.ok(PANEL_REGISTRY.some((p) => p.number === i), `panel ${i}`);
});
test("legacy alias table: unique, never points at itself", () => {
  const aliases = PANEL_REGISTRY.filter((p) => p.legacyAlias).map((p) => p.legacyAlias);
  assert.ok(aliases.length >= 10);
  assert.equal(new Set(aliases).size, aliases.length);
  for (const p of PANEL_REGISTRY) if (p.legacyAlias) assert.notEqual(p.legacyAlias, p.id);
});
test("every panel has option catalog entries with the required fields", () => {
  for (const p of PANEL_REGISTRY) {
    const opts = OPTION_CATALOG[p.id];
    assert.ok(Array.isArray(opts) && opts.length >= 5, `panel ${p.id}`);
    for (const o of opts) { assert.ok(o.id && o.title && o.summary, o.id); assert.equal(typeof o.costs.marks, "number"); assert.ok(o.costs.marks >= 0); }
  }
});
test("option catalog: no title repeated more than twice (E1 target)", () => {
  const counts = {};
  for (const opts of Object.values(OPTION_CATALOG)) for (const o of opts) counts[o.title] = (counts[o.title] ?? 0) + 1;
  assert.ok(Math.max(...Object.values(counts)) <= 2);
});

// ---------------------------------------------------------------- A4.7: time / Dead Days / parse
test("calendar: 12x30 months then 5 Dead Days, then new year", () => {
  assert.equal(T.clockFromDayIndex(0).label, "Ironday, 20 Ironmonth 105 AW");
  assert.equal(T.clockFromDayIndex(310).date, "30 Endmonth");
  for (let i = 1; i <= 5; i++) assert.equal(T.clockFromDayIndex(310 + i).date, `Dead Day ${i}`);
  assert.equal(T.clockFromDayIndex(316).date, "1 First Light");
  assert.equal(T.clockFromDayIndex(316).year, "106 AW");
});
test("weekday cycles through the seven canon days", () => {
  assert.deepEqual([0, 1, 2, 3, 4, 5, 6, 7].map((d) => T.clockFromDayIndex(d).weekday), [...T.WEEKDAYS, "Ironday"]);
});
test("parseAdvance: day-or-longer units, hours are NOT rounded to days", () => {
  assert.equal(T.parseAdvance("advance 3 days"), 3);
  assert.equal(T.parseAdvance("advance 2 weeks"), 14);
  assert.equal(T.parseAdvance("advance one month"), 30);
  assert.equal(T.parseAdvance("advance 5 hours"), null);
  assert.equal(T.parseAdvance("hello"), null);
});
test("parseAdvanceSpec: hours and targets", () => {
  assert.deepEqual(T.parseAdvanceSpec("advance 5 hours"), { kind: "hours", n: 5 });
  assert.deepEqual(T.parseAdvanceSpec("advance 1 hour"), { kind: "hours", n: 1 });
  assert.deepEqual(T.parseAdvanceSpec("wait an hour"), { kind: "hours", n: 1 });
  assert.deepEqual(T.parseAdvanceSpec("advance 1.5 hours"), { kind: "hours", n: 1.5 });
  assert.deepEqual(T.parseAdvanceSpec("advance to 20:00"), { kind: "until", target: { time: "20:00" } });
  assert.deepEqual(T.parseAdvanceSpec("advance to 22:00"), { kind: "until", target: { time: "22:00" } });
  assert.deepEqual(T.parseAdvanceSpec("advance to 07:00"), { kind: "until", target: { time: "07:00" } });
  assert.deepEqual(T.parseAdvanceSpec("advance to 8pm"), { kind: "until", target: { time: "20:00" } });
  assert.deepEqual(T.parseAdvanceSpec("advance to marketday"), { kind: "until", target: "marketday" });
  assert.deepEqual(T.parseAdvanceSpec("advance until next scheduled item"), { kind: "until", target: "next-item" });
  assert.equal(T.parseAdvanceSpec("advance to 25:00"), null);
  assert.equal(T.parseAdvanceSpec("advance 0 hours"), null);
});
test("GM block parser: scene, footer, state, bad JSON", () => {
  const ok = parseGm("<<<SCENE>>>Hello<<<FOOTER>>>Interrupt: critical\nTime: 10:00<<<STATE>>>{\"a\":1}<<<END>>>");
  assert.equal(ok.scene, "Hello"); assert.equal(ok.footer.interrupt, "critical"); assert.equal(ok.stateMissing, false); assert.deepEqual(ok.stateRaw, { a: 1 });
  const bad = parseGm("<<<SCENE>>>x<<<FOOTER>>>y<<<STATE>>>{nope<<<END>>>");
  assert.equal(bad.stateMissing, true);
  assert.equal(parseGm("<<<SCENE>>>x<<<FOOTER>>>Interrupt: bogus<<<END>>>").footer.interrupt, "normal");
});

test("chat TXT archive round-trips ordered turns and alternate AI replies", () => {
  const original = [
    { id: "p1", role: "player", text: "Open the gate\ncarefully." },
    { id: "s1", role: "scene", text: "The gate opens.", variants: ["The gate opens.", "The hinges yield."], activeVariant: 1, footer: { time: "10:00", day: "Ironday", floor: "Floor 6", interrupt: "normal" } },
  ];
  const encoded = chatArchive.serializeChatArchive(original);
  assert.match(encoded, /EGUNSENTIA — CHAT HISTORY/);
  assert.match(encoded, /EGUNSENTIA_ARCHIVE_DATA_V2/);
  assert.deepEqual(chatArchive.parseChatArchive(encoded).map((turn) => ({ ...turn })), original);
});

test("chat TXT archive rejects unrelated and malformed files", () => {
  assert.throws(() => chatArchive.parseChatArchive("not an Egunsentia archive"));
  assert.throws(() => chatArchive.parseChatArchive(JSON.stringify({ format: "EGUNSENTIA_CHAT_ARCHIVE", version: 1, log: [{ role: "npc", text: "x" }] })));
});

// ---------------------------------------------------------------- A4.7: delta / wives / briefing / option atomicity (source-level where deps are needed)
test("delta engine clamps stock to capacity and indices to 0..10 (source check)", () => {
  const d = read("src/lib/game/delta.ts");
  assert.match(d, /const stock = clamp\(patch\.stock \?\? cur\.stock, 0, capacity\)/);
  assert.match(d, /clampIndex\(/);
});
test("wife numbering: three wives, Adelheid second, Vera third, no fourth", () => {
  const kin = K.dayOneKin();
  const roles = Object.fromEntries(kin.map((k) => [k.name, k.role.toLowerCase()]));
  assert.match(roles["Dagmar Red"], /first wife/);
  assert.match(roles["Adelheid von Moren"], /second wife/);
  assert.match(roles["Vera Grotsen"], /third wife/);
  assert.equal(kin.filter((k) => /wife/.test(k.role.toLowerCase())).length, 3);
  assert.equal(V.dayOneHousehold().length, 3);
});
test("briefing guard: scripted briefing never replays after Day 1", () => {
  assert.match(store, /const briefed =\s*\n?\s*g\.chronicle\.some\(\(c\) => c\.id\.startsWith\("c-brief-"\)\) \|\| g\.world\.dayIndex > 0 \|\| g\.turnCount > 1/);
  assert.match(store, /if \(briefed\) \{\s*\n\s*g\.openPlatform\(\)/);
});

test("chat answer variants are additive and campaign resume no longer forces the title screen", () => {
  assert.match(store, /appendSceneVariant: \(id, text\)/);
  assert.match(store, /variants: \[\.\.\.variants, text\]/);
  const shell = read("src/components/game/GameShell.tsx");
  assert.match(shell, /loadSnapshot\(remote\.payload\)/);
  assert.doesNotMatch(shell, /loadSnapshot\(\{ \.\.\.remote\.payload, view: "title" \}\)/);
  assert.match(shell, /localMeta\.remoteRevision/);
  assert.match(shell, /baseMatchesRemote/);
  assert.match(shell, /blockRemoteSaves/);
});

test("regenerating a narrator answer does not replay the original action or apply another state delta", () => {
  const play = read("src/lib/game/play.ts");
  const regen = play.slice(play.indexOf("export async function regenerateReply"));
  assert.match(regen, /appendSceneVariant\(sceneId, parsed\.scene\)/);
  assert.doesNotMatch(regen, /applyDelta|pushPlayer|pushScene/);
  assert.match(regen, /narration-only alternative/);
});
test("option engine is atomic: every validation returns before the single set()", () => {
  const a = store.indexOf("executeV45Option: (optionId) =>");
  const body = store.slice(a, store.indexOf("setV45Setting", a));
  const firstSet = body.indexOf("set({ world");
  assert.ok(firstSet > 0);
  assert.equal((body.match(/\bset\(\{ world/g) ?? []).length, 1);
  assert.ok(body.indexOf("Option not found") < firstSet && body.indexOf("Not enough treasury") < firstSet);
});
test("localCommand routes hour and target advances before day parsing", () => {
  assert.ok(store.indexOf("parseAdvanceSpec(raw)") < store.indexOf("const days = parseAdvance(raw)"));
});

// ---------------------------------------------------------------- audit + hidden-value leak + migration
test("auditWorld on a day-one snapshot: no FAIL rows", () => {
  const rows = auditWorld(snapshot(S.defaultP4State()));
  assert.ok(rows.length >= 8);
  assert.deepEqual(rows.filter((r) => r.status === "FAIL"), []);
});
test("hidden-value leak scan catches exposures and passes clean text", () => {
  assert.equal(leaks(["Trust: 7 with Dagmar", "secret clock at 3/8"]).length, 2);
  assert.equal(leaks(["Dagmar seems wary.", "She trusts the watch captain.", "Fear of the gate is common."]).length, 0);
  assert.equal(auditWorld(snapshot({ ...S.defaultP4State(), log: ["Respect = 4 for Samer"] })).find((r) => r.key === "hidden-value-leak").status, "FAIL");
});
test("simulated 30 days never leaks hidden values into player-visible p4 text", () => {
  let p = S.defaultP4State();
  const r = S.advanceClock(p, 0, 30 * 1440, { water: 0.1, food: 0.15, energy: 0.1, gates: {} }, { allowCritical: true });
  assert.deepEqual(leaks(collectStrings([r.p4.log, r.p4.rumors, r.p4.reports, r.p4.newsFeed])), []);
});
test("V4.1 save migration: old / missing p4 normalizes additively and stays audit-clean", () => {
  const fromV41 = S.normalizeP4(undefined);
  assert.equal(fromV41.week, 0); assert.ok(fromV41.envoys.length === 4);
  const oldDemo = { week: 3, factions: [{ id: "Red Claws", mood: 7, pressure: 3, treasury: 1, agenda: "x", lastAction: "y" }], sectors: {}, npcSchedule: [], clues: [{ id: "CL-1", label: "a", evidence: "OBSERVED", source: "s", linked: [] }], boardPins: [], letters: [{ id: "L-01", sender: "x", seal: "UNKNOWN", route: "r", handwriting: "h" }], planner: [], council: [], banquet: { seated: [], result: "unplanned" }, moments: [], queue: [{ id: "Q1", dueDay: 2, label: "l", source: "s", visibility: "public" }], crisis: { active: true, title: "Monster Warning", severity: "critical", deadlineHours: 6, options: ["a"] }, log: [], settings: { assist: "Steward", reducedMotion: false, highContrast: false, textScale: 1, runtimeArt: false, tts: false }, unlockedAssets: [] };
  const n = S.normalizeP4(oldDemo);
  assert.equal(n.week, 3); assert.equal(n.queue.length, 1); assert.equal(n.crisis.title, "Monster Warning");
  assert.equal(n.factions[0].treasury, 1); assert.ok(n.factions[0].blocs.length >= 1);
  assert.equal(n.planner.length, 5); assert.ok(n.letters[0].truth);
  assert.deepEqual(auditWorld(snapshot(n)).filter((r) => r.status === "FAIL"), []);
  assert.deepEqual(S.normalizeP4(JSON.parse(JSON.stringify(n))), n); // idempotent + JSON-safe
});

// ---------------------------------------------------------------- delta / state-integrity of the engine
test("engine functions never mutate their input state", () => {
  const p = S.defaultP4State(); const snap = JSON.stringify(p);
  S.verifyLetter(p, "L-01"); S.planItem(p, "x", "16:00"); S.banquet(p, ["ENV-MONARCHIA"]); S.decideCouncil(p, "CM-1-decree"); S.simulateWeek(p); S.pinClue(p, "CL-M5"); S.triggerMoment(p, "birth");
  S.advanceClock(p, 0, 3000);
  assert.equal(JSON.stringify(p), snap);
});

// ---------------------------------------------------------------- Letters (D4)
test("letters: UNKNOWN stays UNKNOWN until independent checks support a verdict", () => {
  let p = S.defaultP4State();
  assert.equal(p.letters.find((l) => l.id === "L-01").seal, "UNKNOWN");
  p = S.verifyLetter(p, "L-01");
  const one = p.letters.find((l) => l.id === "L-01");
  assert.equal(one.seal, "UNKNOWN"); assert.equal(one.checks.length, 1); assert.equal(one.verified, undefined);
});
test("letters: forged letter is exposed by multi-source checks; costs and delay accrue", () => {
  let p = S.defaultP4State();
  for (let i = 0; i < 5; i++) p = S.verifyLetter(p, "L-03");
  const l = p.letters.find((x) => x.id === "L-03");
  assert.equal(l.checks.length, 5);
  assert.ok(p.spent.marks > 0 && p.spent.hours > 0);
  assert.notEqual(l.seal, "AUTHENTIC");
});
test("letters: unreliable checks can produce false positives/negatives (deterministic)", () => {
  let flips = 0;
  for (let w = 0; w < 200; w++) { const r = L.runCheck({ id: "X", truth: "FORGED", seal: "UNKNOWN" }, "politics", w); if (r.signal === "consistent") flips++; }
  assert.ok(flips > 20 && flips < 120, `politics check flips ${flips}/200`);
  assert.deepEqual(L.runCheck({ id: "X", truth: "FORGED", seal: "UNKNOWN" }, "seal", 7), L.runCheck({ id: "X", truth: "FORGED", seal: "UNKNOWN" }, "seal", 7));
});
test("letters: verdict needs >=2 checks and a clear margin", () => {
  const mk = (signals) => ({ id: "L", seal: "UNKNOWN", checks: signals.map((s, i) => ({ kind: ["seal", "handwriting", "courier"][i], signal: s, reliability: 0.8 })) });
  assert.equal(L.verdict(mk(["consistent"])), "UNKNOWN");
  assert.equal(L.verdict(mk(["consistent", "consistent"])), "AUTHENTIC");
  assert.equal(L.verdict(mk(["inconsistent", "inconsistent"])), "FORGED");
  assert.equal(L.verdict(mk(["consistent", "inconsistent"])), "UNKNOWN");
});

// ---------------------------------------------------------------- Planner (D5)
test("planner: collision with a fixed item reschedules with travel time and logs why", () => {
  let p = S.defaultP4State();
  p = S.planItem(p, "Forge walk-through", "10:15", { place: "Forge", durMin: 30 });
  assert.equal(p.lastPlan.ok, true); assert.ok(p.lastPlan.rescheduledTo);
  const it = p.planner.find((x) => x.label === "Forge walk-through");
  assert.ok(P.travelMinutes("Reception Hall", "Forge") > 0);
  assert.ok(it.time >= "11:00" || it.time < "09:00", it.time);
});
test("planner: higher priority displaces lower, fixed never displaced", () => {
  let items = [];
  ({ items } = P.addPlanItem(items, "low", "16:00", { priority: 10, day: 0 }));
  const r = P.addPlanItem(items, "high", "16:00", { priority: 80, day: 0 });
  assert.equal(r.result.ok, true); assert.deepEqual(r.result.displaced, ["low"]);
  assert.equal(r.items.find((i) => i.label === "low").status, "missed");
  const fixed = P.addPlanItem(P.FIXED_RHYTHM, "x", "20:00", { priority: 99, day: 0 });
  assert.notEqual(fixed.items.at(-1).time, "20:00");
});
test("planner: rejects bad time, emergency departures and surface moves in critical alerts", () => {
  assert.equal(P.addPlanItem([], "x", "25:99").result.ok, false);
  assert.equal(P.addPlanItem([], "x", "12:00", { place: "Forge", tier: "emergency" }).result.ok, false);
  assert.equal(P.addPlanItem([], "x", "12:00", { place: "Surface Latch", tier: "critical" }).result.ok, false);
});
test("planner: NPC availability forces a later slot", () => {
  const r = P.addPlanItem([], "meet", "12:00", { day: 0, npc: "Dagmar Red", npcAvailable: (_n, at) => at % 1440 >= 13 * 60 });
  assert.ok(r.result.rescheduledTo >= "13:00");
});
test("planner: due items resolve strictly in timestamp order; targets resolve", () => {
  let items = [...P.FIXED_RHYTHM];
  ({ items } = P.addPlanItem(items, "late", "23:00", { day: 0 }));
  ({ items } = P.addPlanItem(items, "early", "08:00", { day: 0 }));
  const due = P.dueBetween(items, 0, 1440).map((d) => d.at);
  assert.deepEqual(due, [...due].sort((a, b) => a - b));
  assert.equal(P.nextClockTime(core.absMin(0, 19 * 60), "20:00"), core.absMin(0, 20 * 60));
  assert.equal(P.nextClockTime(core.absMin(0, 21 * 60), "07:00"), core.absMin(1, 7 * 60));
  assert.equal(P.nextScheduled(items, core.absMin(0, 9 * 60)).item.label, "Morning Briefing");
  assert.equal(P.nextMarketday(0, 0), core.absMin(5, 7 * 60)); // day 0 = Ironday, Marketday is day 5
});

// ---------------------------------------------------------------- Consequence queue + clock (A4.7 queue ordering, D2)
test("advanceClock: queue and planner items fire in timestamp order and weeks are not skipped", () => {
  let p = S.defaultP4State();
  p.queue = [{ id: "Qb", dueDay: 3, label: "b", source: "t", visibility: "public" }, { id: "Qa", dueDay: 1, label: "a", source: "t", visibility: "public" }];
  const r = S.advanceClock(p, 0, 16 * 1440);
  assert.deepEqual(r.fired.filter((x) => x === "a" || x === "b"), ["a", "b"]);
  assert.equal(r.p4.week, 2); // weeks at day 7 and 14 both ran although neither was landed on exactly
  assert.equal(r.p4.queue.length, 0);
});
test("advanceClock: hour advance does not jump to a whole day", () => {
  const r = S.advanceClock(S.defaultP4State(), core.absMin(0, 10 * 60), core.absMin(0, 15 * 60));
  assert.equal(r.reachedMin, core.absMin(0, 15 * 60)); assert.equal(r.p4.now.minute, 15 * 60);
});

// ---------------------------------------------------------------- Crisis (D2)
test("crisis: auto-spawns from world conditions, highest tier first, rest queued", () => {
  const p = S.defaultP4State();
  const q = C.spawnCrisis(p, { water: 0.1, food: 0.1, energy: 0.8, gates: { east: "BREACHED" } }, 0);
  assert.equal(q.crisis.kind, "gate"); assert.equal(q.crisis.severity, "emergency");
  assert.deepEqual([...q.crisisBacklog].sort(), ["food", "water"]);
  assert.equal(C.spawnCrisis(p, { water: 0.9, food: 0.9, energy: 0.9 }, 0).crisis, null);
});
test("crisis: deadline in hours, escalates by stage, last stage fails with consequences", () => {
  let p = C.spawnCrisis(S.defaultP4State(), { water: 0.1, food: 0.9, energy: 0.9 }, 0);
  assert.equal(p.crisis.severity, "critical");
  p = C.tickCrisis(p, 10, 600); assert.equal(p.crisis.deadlineHours, 14);
  p = C.tickCrisis(p, 14, 1440); assert.equal(p.crisis.stage, 1); assert.equal(p.crisis.severity, "emergency");
  p = C.tickCrisis(p, 200, 3000);
  assert.equal(p.crisis, null);
  assert.equal(p.crisisHistory.at(-1).outcome, "failed"); assert.ok(p.chronicleNotes.length && p.queue.length);
});
test("crisis: resolution writes aftermath chain to queue and Chronicle", () => {
  let p = C.spawnCrisis(S.defaultP4State(), { water: 0.1, food: 0.9, energy: 0.9 }, 0);
  p = S.resolveCrisis(S.normalizeP4(p), "Ration water by ward");
  assert.equal(p.crisis, null); assert.equal(p.queue.filter((q) => q.source === "crisis").length, 2);
  assert.match(p.chronicleNotes.at(-1), /Ration water by ward/); assert.equal(p.crisisHistory.at(-1).outcome, "resolved");
});
test("crisis: stock table covers every kind; failure loses stock, unknown kinds do not", () => {
  for (const d of C.CRISIS_DEFS) {
    assert.ok(C.CRISIS_STOCK_EFFECTS[d.kind], d.kind);
    const failed = C.crisisStockEffect(d.kind, "failed");
    const resolved = C.crisisStockEffect(d.kind, "resolved");
    assert.ok(failed.water + failed.food + failed.energy < 0, d.kind);
    assert.deepEqual(Object.keys(resolved).sort(), ["energy", "food", "water"]);
  }
  assert.deepEqual(C.crisisStockEffect("no-such-kind", "failed"), { water: 0, food: 0, energy: 0 });
  const sample = C.crisisStockEffect("water", "failed");
  sample.water = 9;
  assert.equal(C.crisisStockEffect("water", "failed").water, C.CRISIS_STOCK_EFFECTS.water.failed.water);
});
test("interrupt tiers: emergency always stops; critical stops unless waived; important only if asked", () => {
  assert.equal(C.shouldInterrupt("emergency", { allowCritical: true }), true);
  assert.equal(C.shouldInterrupt("critical"), true); assert.equal(C.shouldInterrupt("critical", { allowCritical: true }), false);
  assert.equal(C.shouldInterrupt("important"), false); assert.equal(C.shouldInterrupt("important", { stopAtImportant: true }), true);
  assert.equal(C.shouldInterrupt("normal", { stopAtImportant: true }), false);
});
test("advanceClock stops when an emergency opens, and a 1h pause is always possible", () => {
  const w = { water: 0.8, food: 0.8, energy: 0.8, gates: { east: "BREACHED" } };
  const r = S.advanceClock(S.defaultP4State(), 0, 10 * 1440, w, { allowCritical: true });
  assert.equal(r.stopped, true); assert.equal(r.tier, "emergency"); assert.ok(r.reachedMin <= 120);
  const again = S.advanceClock(r.p4, r.reachedMin, r.reachedMin + 5 * 1440, w);
  assert.ok(again.reachedMin - r.reachedMin <= 60); assert.equal(again.stopped, true);
});

// ---------------------------------------------------------------- Banquet (D6)
test("banquet: envoy roster is generated once and deterministic (names locked)", () => {
  assert.deepEqual(B.generateEnvoys(), B.generateEnvoys());
  const p = S.defaultP4State(); assert.deepEqual(S.normalizeP4(p).envoys, p.envoys);
});
test("banquet: rivals seated together produce tense/incident; compatible seating is without insult", () => {
  const r = B.generateEnvoys();
  const good = B.scoreBanquet(r, ["ENV-MONARCHIA", "ENV-GROTSEN", "ENV-SURVIVORS"], { ritualsObserved: r.map((e) => e.ritual) });
  const bad = B.scoreBanquet(r, ["ENV-GROTSEN", "ENV-DEMOS"], { guards: 1 });
  assert.notEqual(bad.result, "without insult"); assert.ok(bad.score < good.score);
  assert.ok(bad.rumor && bad.issues.some((i) => /feud|rivalry/i.test(i)));
});
test("banquet: precedence slights and seat count are not decided by headcount alone", () => {
  const r = B.generateEnvoys();
  const a = B.scoreBanquet(r, ["ENV-SURVIVORS", "ENV-MONARCHIA"]);
  assert.ok(a.issues.some((i) => /Precedence/.test(i)));
  assert.equal(B.scoreBanquet(r, []).result, "unplanned");
});
test("banquet writes relations, rumors, news and Red Ledger", () => {
  let p = S.defaultP4State();
  p = S.banquet(p, ["ENV-GROTSEN", "ENV-DEMOS"], { guards: 1 });
  assert.ok(Object.keys(p.relations).length); assert.ok(p.rumors.length); assert.ok(p.newsFeed.length);
  assert.ok(p.redLedger.length || p.banquet.result !== "incident");
});

// ---------------------------------------------------------------- NPC life engine (D1)
test("NPC schedules cover 24h for every cast card and are data-driven from the DAY line", () => {
  assert.ok(cards.length >= 40);
  for (const c of cards) {
    const s = N.buildSchedule(c);
    assert.ok(s.length >= 4, c.name);
    for (let m = 0; m < 1440; m += 90) assert.ok(N.blockAt(s, m), `${c.name}@${m}`);
  }
  const dagmar = cards.find((c) => /^DAGMAR RED/.test(c.name));
  assert.equal(N.cleanName(dagmar.name), "Dagmar Red");
  assert.equal(N.npcNow(dagmar, core.absMin(0, 3 * 60)).kind, "rest");
  assert.equal(N.npcNow(dagmar, core.absMin(0, 6 * 60 + 30)).place, "Eastern Wall");
});
test("NPC illness, errands, avoidance and relationship drift", () => {
  const dagmar = cards.find((c) => /^DAGMAR RED/.test(c.name));
  const ill = N.npcNow(dagmar, 1000, { illUntil: 5000, avoiding: [], grudge: {} });
  assert.equal(ill.available, false); assert.equal(ill.reason, "illness");
  const st = N.nudgeRelation(undefined, "Samer Vogt", -4);
  assert.deepEqual(st.avoiding, ["Samer Vogt"]);
  const here = N.npcNow(dagmar, core.absMin(0, 10 * 60), st, { "Samer Vogt": { place: N.npcNow(dagmar, core.absMin(0, 10 * 60)).place } });
  assert.equal(here.reason, "avoidance");
  const rolls = new Set(); for (let d = 0; d < 200; d++) { const s = N.rollDailyEvents("Test Npc", d); rolls.add(s.illUntil ? "ill" : s.errandUntil ? "err" : s.petition ? "pet" : "none"); }
  assert.ok(rolls.has("ill") && rolls.has("err") && rolls.has("pet") && rolls.has("none"));
});

// ---------------------------------------------------------------- Investigation (D3)
test("investigation: discovery needs prerequisites; theory needs two non-rumor supports; board never proves", () => {
  let p = S.defaultP4State();
  assert.equal(p.clues.find((c) => c.id === "CL-M5T").discovered, false);
  p = S.discoverClue(p, "CL-M5T"); assert.equal(p.clues.find((c) => c.id === "CL-M5T").discovered, true);
  p = S.pinClue(S.pinClue(S.pinClue(p, "CL-M5"), "CL-GATE"), "CL-M5T");
  p = S.theorize(p, "CL-M5T");
  const t = p.clues.find((c) => c.id === "CL-M5T");
  assert.equal(t.evidence, "THEORY"); assert.notEqual(t.evidence, "KNOWN");
});
test("investigation: false lead contradiction blocks advancement; rumor does not count", () => {
  let p = S.defaultP4State();
  p = S.discoverClue(p, "CL-M5T");
  p = S.pinClue(S.pinClue(S.pinClue(S.pinClue(p, "CL-M5"), "CL-GATE"), "CL-RUM"), "CL-M5T");
  assert.ok(I.contradictions(p.clues, p.boardPins).length >= 1);
  const out = I.advanceTheory(p.clues, ["CL-M5", "CL-RUM", "CL-M5T"], "CL-M5T");
  assert.match(out.message, /Only 1|contradicts/);
  assert.equal(out.clues.find((c) => c.id === "CL-M5T").evidence, "UNKNOWN");
});
test("investigation: a case resolves only when enough clues are KNOWN", () => {
  const clues = [{ id: "a", evidence: "OBSERVED" }, { id: "b", evidence: "THEORY" }];
  assert.equal(I.resolveCase({ id: "c", title: "t", clues: ["a", "b"], resolved: false }, clues).resolved, false);
  const k = clues.map((c) => ({ ...c, evidence: "KNOWN" }));
  assert.equal(I.resolveCase({ id: "c", title: "t", clues: ["a", "b"], resolved: false }, k).resolved, true);
});

// ---------------------------------------------------------------- Council (D9), factions (D7), economy (D8)
test("council: nine ministers state ministry-biased positions that react to the world", () => {
  const calm = CM.councilPositions({ water: 0.9, food: 0.9, energy: 0.9, gates: {} });
  const bad = CM.councilPositions({ water: 0.1, food: 0.1, energy: 0.1, gates: { east: "BREACHED" }, outbreak: true });
  assert.equal(calm.length, 9); assert.equal(new Set(calm.map((c) => c.position)).size, 9);
  assert.notEqual(JSON.stringify(calm), JSON.stringify(bad));
  assert.ok(bad.find((c) => c.ministry === "Medicine").position.includes("quarantine"));
});
test("council decisions create memories, rumors and queued consequences", () => {
  const p = S.decideCouncil(S.defaultP4State(), "CM-4-decree");
  assert.ok(p.memories.length && p.rumors.length && p.queue.some((q) => q.source === "council"));
  assert.ok(S.decideCouncil(S.defaultP4State(), "CM-4-delegate").queue.some((q) => /reports/.test(q.label)));
});
test("factions: shortages, blocs, mobilization and reports with credibility tags only", () => {
  let fs = F.FACTION_SEED.map((f) => ({ ...f, food: 10, water: 10, pressure: 8, mood: 3 }));
  let all = [];
  for (let w = 1; w <= 8; w++) { const r = F.stepFactions(fs, w); fs = r.factions; all = all.concat(r.reports); }
  assert.ok(fs.some((f) => f.mobilization > 2));
  assert.ok(all.every((r) => ["confirmed", "likely", "rumor"].includes(r.credibility)));
  assert.equal(leaks(all.map((r) => r.text)).length, 0);
  assert.ok(fs.every((f) => f.mood >= 1 && f.mood <= 10 && f.pressure >= 0 && f.pressure <= 10));
});
test("factions evolve independently (not modulo arithmetic): same input, different ids differ", () => {
  const a = F.stepFactions(F.FACTION_SEED, 1).factions; const b = F.stepFactions(F.FACTION_SEED, 2).factions;
  assert.notDeepEqual(a.map((f) => f.food), b.map((f) => f.food));
});
test("economy: price from scarcity + transit + hazard + politics; shortages cascade; goods are lore goods", () => {
  const e = E.defaultEconomy();
  const base = E.priceOf(e.food);
  assert.ok(E.priceOf({ ...e.food, stock: 20 }) > base);
  assert.ok(E.priceOf(e.food, { transit: 2, hazard: 1, open: true }) > base);
  assert.ok(E.priceOf(e.food, { transit: 0, hazard: 0, open: false }) > base);
  assert.ok(E.priceOf(e.food, undefined, 0.3) < base);
  assert.ok(["rail steel", "copper wire", "machine bearings", "filters", "glass", "chemical feedstock", "fuel stocks", "fungal substrate", "ammunition components", "salvageable electronics"].every((g) => E.GOODS.includes(g)));
  const low = { ...e, "rail steel": { ...e["rail steel"], stock: 1 } };
  assert.ok(E.cascade(low)["machine bearings"].production < e["machine bearings"].production);
  const t = E.economyTick(e, { food: 500 }, [{ id: "r", from: "a", to: "b", capacity: 100, transit: 1, hazard: 0, open: true }]);
  assert.ok(t.bottlenecks.includes("food"));
  const rations = E.marketBoard(e, "rations");
  assert.ok(rations.find((r) => r.good === "food").factors.includes("scarcity"));
  assert.ok(!rations.find((r) => r.good === "food").factors.includes("political"));
  const routed = E.marketBoard(e, "logistics");
  assert.ok(routed.every((r) => r.factors.includes("transit") && r.factors.includes("hazard")));
  const foreign = E.marketBoard(e, "foreign", E.treatyDiscount(["alliance", "trade", "none"]));
  assert.ok(foreign.every((r) => r.factors.includes("political")));
});
test("economy ticks once per simulated day and bottlenecks enter rumors", () => {
  const start = S.defaultP4State();
  const food0 = start.economy.food.stock;
  const perDay = start.economy.food.demand - start.economy.food.production;
  const three = S.advanceClock(start, 0, 3 * 1440);
  assert.equal(three.p4.economy.food.stock, food0 - 3 * perDay);
  assert.equal(three.p4.week, 0);
  let short = S.defaultP4State();
  short = S.normalizeP4({ ...short, economy: { ...short.economy, food: { ...short.economy.food, stock: 5, production: 0, demand: 50 } } });
  const burned = S.advanceClock(short, 0, 1440);
  assert.ok(burned.p4.rumors.some((r) => r === "Bottleneck: food is running short."));
  assert.equal(S.simulateWeek(start).economy.food.stock, food0);
});
test("forged letter judged authentic queues a diplomatic hit two days later", () => {
  let week = -1;
  for (let w = 0; w < 400; w++) {
    const rolled = L.runCheck({ id: "L-03", sender: "Unsigned supply notice", seal: "UNKNOWN", route: "r", handwriting: "h", truth: "FORGED" }, "handwriting", w);
    if (rolled.signal === "consistent") { week = w; break; }
  }
  assert.ok(week >= 0);
  let p = S.normalizeP4({
    ...S.defaultP4State(),
    week,
    letters: S.defaultP4State().letters.map((l) => l.id === "L-03" ? { ...l, checks: [{ kind: "seal", signal: "consistent", reliability: 0.85, hours: 2, cost: 20, note: "preset" }] } : l),
  });
  const before = p.relations.Survivors ?? 0;
  p = S.verifyLetter(p, "L-03");
  const letter = p.letters.find((l) => l.id === "L-03");
  assert.equal(letter.truth, "FORGED");
  assert.equal(letter.verified, "AUTHENTIC");
  assert.equal(p.relations.Survivors ?? 0, before);
  const q = p.queue.find((item) => item.relationHit?.faction === "Survivors");
  assert.ok(q);
  assert.equal(q.dueDay, p.now.day + 2);
  assert.equal(leaks([q.label, p.log[0]]).length, 0);
  const adv = S.advanceClock(p, core.absMin(p.now.day, p.now.minute), core.absMin(p.now.day + 2, p.now.minute));
  assert.ok((adv.p4.relations.Survivors ?? 0) < before);
  assert.ok(!adv.p4.queue.some((item) => item.id === q.id));
});
test("council decree executes the authoritative catalog effects through the shared option runner", () => {
  const order = S.decreeOrder();
  assert.ok(order);
  assert.equal(order.id, "24-OPT-02");
  assert.ok(order.costs.marks > 0 && order.costs.hours >= 0);
  const initial = S.syncClock(S.defaultP4State(), 0, 10 * 60);
  const baseWorld = K.dayOneWorld();
  const world = { ...baseWorld, clock: { ...baseWorld.clock, time: "10:00" } };
  const input = { p4: initial, world, gates: K.dayOneGates(), trades: [], events: K.dayOneEvents(), news: K.dayOneNews(), chronicle: K.dayOneChronicle(), turnCount: 0, worldInputs: core.DEFAULT_WORLD };
  const stamped = Execute.runCouncilDecree(input, "CM-2");
  assert.equal(stamped.ok, true);
  if (!stamped.ok) return;
  assert.equal(stamped.p4.spent.marks, order.costs.marks);
  assert.equal(stamped.p4.spent.hours, order.costs.hours);
  assert.equal(stamped.p4.economy.food.stock, initial.economy.food.stock - 5);
  assert.equal(stamped.world.food.stock, world.food.stock - 40);
  assert.ok(stamped.p4.lastReceipt.done.some((line) => /Food stock decreased by 5/i.test(line)));
  const q = stamped.p4.queue.find((item) => item.source === order.id);
  assert.ok(q);
  assert.equal(q.dueMin, 10 * 60 + 48 * 60);
  assert.equal(stamped.p4.npcStatus["Physician Sabine Lorenz"].mood, "strained");
  assert.equal(stamped.p4.lastReceipt.optionId, order.id);
  assert.ok(stamped.events.some((event) => event.id === `EV-${stamped.commandId}`));
  assert.equal(Execute.runCouncilDecree({ ...input, p4: stamped.p4 }, "CM-2").ok, false);
  assert.match(store, /stampDecree: \(seatId\) => set\(\(s\) =>/);
  assert.match(store, /runCouncilDecree\(/);
  assert.match(read("src/components/game/V45PanelBody.tsx"), /stamp\(c\.id\)/);
});
test("bloc words stay strong, split or weak", () => {
  assert.equal(F.blocWord([{ name: "a", support: 8 }, { name: "b", support: 2 }]), "split");
  assert.equal(F.blocWord([{ name: "a", support: 6 }, { name: "b", support: 5 }]), "strong");
  assert.equal(F.blocWord([{ name: "a", support: 2 }, { name: "b", support: 2 }]), "weak");
});
test("council seats are nine stable positions, not a fresh store snapshot", () => {
  const body = read("src/components/game/V45PanelBody.tsx");
  assert.doesNotMatch(body, /useGame\(\s*s\s*=>\s*worldInputsOf/);
  assert.doesNotMatch(body, /useGame\(\s*s\s*=>\s*s\.snapshot\(/);
  const world = { water: 0.7, food: 0.2, energy: 0.8, gates: { east: "NORMAL" } };
  const seats = CM.councilPositions(world);
  assert.equal(seats.length, 9);
  assert.equal(new Set(seats.map((c) => c.id)).size, 9);
  for (const seat of seats) {
    assert.equal(typeof seat.ministry, "string");
    assert.equal(typeof seat.position, "string");
    assert.ok(seat.position.length > 0);
    assert.ok(seat.stance === -1 || seat.stance === 0 || seat.stance === 1);
  }
  const again = CM.councilPositions(world);
  assert.deepEqual(again.map((c) => c.position), seats.map((c) => c.position));
});

// ---------------------------------------------------------------- art / manifest (A9) - integrity only; completeness is verify-art.mjs
test("art manifest: every registered path exists, preserved V4.1 art present", () => {
  const manifest = JSON.parse(read("public/art/ART_MANIFEST.json"));
  assert.ok(manifest.assets.some((a) => a.source === "preserved"));
  for (const asset of manifest.assets) assert.ok(exists(asset.path), asset.path);
});
test("demo package explicitly records incompleteness", () => {
  const s = read("V45_UNFINISHED.md");
  assert.match(s, /Demo\s*\/\s*Update\s*4\.5/i); assert.match(s, /video/i); assert.match(s, /animation/i);
});
test("CopyButton exists and is used on narrator replies", () => {
  const btn = read("src/components/game/CopyButton.tsx");
  assert.match(btn, /export function CopyButton/);
  assert.match(btn, /navigator\.clipboard\.writeText/);
  assert.match(btn, /execCommand\("copy"\)/);
  assert.match(read("src/components/game/SceneView.tsx"), /CopyButton/);
});

test("wing tokens cover eight wings and the registry carries desk meta", async () => {
  const { WING_TOKENS, WING_PLACE, VIEWS } = await imp("src/lib/platform/desks.ts");
  const css = read("src/styles.css");
  const wings = Object.keys(WING_PLACE);
  assert.equal(wings.length, 8);
  assert.equal(Object.keys(WING_TOKENS).length, 8);
  for (const wing of wings) {
    const t = WING_TOKENS[wing];
    assert.ok(t.accent && t.surface && t.line && t.ink && t.motif, wing);
    const re = new RegExp(
      `\\[data-wing="${wing}"\\]\\s*\\{[^}]*--wing-accent:\\s*${t.accent};[^}]*--wing-surface:\\s*${t.surface};[^}]*--wing-line:\\s*${t.line};[^}]*--wing-ink:\\s*${t.ink};[^}]*--wing-motif:\\s*${t.motif};`,
    );
    assert.match(css, re, wing);
  }
  for (const p of PANEL_REGISTRY) {
    assert.equal(VIEWS[p.archetype].join("|"), p.views.join("|"), p.id);
    assert.ok(p.place, p.id);
    assert.notEqual(p.icon, "▣");
    assert.match(p.icon, /^[A-Za-z]/);
  }
});

test("platform components do not set type smaller than 13px", () => {
  const dir = path.join(root, "src/components/platform");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".tsx") || f.endsWith(".ts"));
  const bad = [];
  for (const file of files) {
    const text = fs.readFileSync(path.join(dir, file), "utf8");
    for (const m of text.matchAll(/text-\[(\d+(?:\.\d+)?)px\]/g)) {
      if (Number(m[1]) < 13) bad.push(`${file}:${m[0]}`);
    }
    for (const m of text.matchAll(/font-size:\s*(\d+(?:\.\d+)?)px/g)) {
      if (Number(m[1]) < 13) bad.push(`${file}:${m[0]}`);
    }
    if (/\btext-xs\b/.test(text)) bad.push(`${file}:text-xs`);
  }
  assert.deepEqual(bad, []);
  assert.ok(files.some((f) => f === "DeskShell.tsx"));
  assert.ok(files.some((f) => f === "Gauge.tsx"));
  assert.ok(files.some((f) => f === "VoiceLine.tsx"));
});

test("home queue, pulse words and voice stay player-safe", async () => {
  const home = await imp("src/lib/platform/home.ts");
  const voice = await imp("src/lib/platform/voice.ts");
  const snap = {
    water: { stock: 100, capacity: 400 },
    food: { stock: 10, capacity: 100 },
    energy: { stock: 80, capacity: 100 },
    treasuryMarks: 120000,
    order: 5,
    morale: 7,
    gaugeShift: { water: "down", food: "flat" },
    crisis: { active: true, title: "Water Shortage", severity: "critical", deadlineHours: 12, kind: "water" },
    letters: [{ id: "L-1", sender: "Dreyer", seal: "UNKNOWN" }],
    inboxOpen: [{ id: "m1", from: "Ilona Brandt", urgency: "important" }],
    absentees: [{ name: "Tomas Hesse" }],
    planner: [{ id: "P-1000", time: "10:00", label: "Morning Briefing", status: "planned" }],
    clockTime: "07:00",
    queue: [{ id: "q1", dueDay: 0, label: "Repair crews return", becauseOf: "Open the reserve" }],
    day: 0,
    rumors: ["Filters are late on the market."],
    bottlenecks: [],
    chronicle: [{ id: "c1", line: "The hall woke before the lamps." }],
    news: [{ id: "n1", body: "The booth filed a quiet morning.", source: "Booth" }],
  };
  const items = home.buildDeskQueue(snap);
  assert.ok(items.length <= 5 && items.length >= 1);
  assert.equal(items[0].title, "Water Shortage");
  assert.equal(items[0].panelId, "21");
  assert.match(items.map((i) => i.status).join(" "), /Because of: Open the reserve/);
  const water = home.pulseReadings(snap).find((g) => g.key === "water");
  assert.equal(water.word, "Short");
  assert.equal(water.arrow, "down");
  assert.ok(!JSON.stringify(home.pulseReadings(snap)).match(/\d{3,}/));
  assert.ok(home.attentionForWing(snap, "CITY", ["21", "54"]) >= 1);
  assert.equal(home.buildLooked(snap).length <= 6, true);
  const lines = voice.advisorIds().flatMap((id) => voice.voiceLines(id));
  assert.ok(lines.length >= voice.advisorIds().length * 6);
  assert.ok(lines.every((line) => line.length <= 140 && line.length > 0));
  assert.deepEqual(leaks(lines), []);
  const input = { crisis: true, lowGauge: true, pending: true };
  assert.equal(voice.pickVoice("Tomas Hesse", input), voice.pickVoice("Tomas Hesse", input));
});

function memoryStorage() {
  if (globalThis.localStorage) return;
  const mem = new Map();
  globalThis.localStorage = {
    getItem: (k) => (mem.has(k) ? mem.get(k) : null),
    setItem: (k, v) => mem.set(k, String(v)),
    removeItem: (k) => mem.delete(k),
    clear: () => mem.clear(),
    key: (i) => [...mem.keys()][i] ?? null,
    get length() { return mem.size; },
  };
}

test("executing one option writes a receipt, changes the desk, and hides raw numbers", async () => {
  memoryStorage();
  const { useGame } = await imp("src/lib/game/store.ts");
  useGame.getState().reset();
  const before = useGame.getState();
  const p4Before = before.p4;
  const stockBefore = JSON.stringify(before.p4.economy);
  const relBefore = JSON.stringify(before.p4.relations ?? {});
  const flagBefore = JSON.stringify(before.p4.flags ?? {});
  const queueBefore = before.p4.queue.length;
  const noteBefore = JSON.stringify([before.p4.log, before.p4.newsFeed, before.p4.rumors, before.p4.chronicleNotes, before.p4.deskNotes]);
  useGame.getState().executeV45Option("10-OPT-01");
  const after = useGame.getState();
  const slip = after.p4.lastReceipt;
  assert.ok(slip && slip.done.length > 0 && slip.optionId === "10-OPT-01");
  assert.equal(after.p4 === p4Before, false);
  assert.equal(JSON.stringify(p4Before.economy), stockBefore);
  const changed =
    JSON.stringify(after.p4.economy) !== stockBefore ||
    JSON.stringify(after.p4.relations ?? {}) !== relBefore ||
    JSON.stringify(after.p4.flags ?? {}) !== flagBefore ||
    after.p4.queue.length !== queueBefore ||
    JSON.stringify([after.p4.log, after.p4.newsFeed, after.p4.rumors, after.p4.chronicleNotes, after.p4.deskNotes]) !== noteBefore;
  assert.equal(changed, true);
  assert.equal(after.turnCount, before.turnCount + 1);
  const visible = collectStrings([
    slip,
    after.notice,
    after.news,
    after.chronicle,
    after.events,
    after.p4.log,
    after.p4.rumors,
    after.p4.newsFeed,
    after.p4.deskNotes,
    after.p4.chronicleNotes,
    after.p4.queue,
    after.p4.memories,
    after.p4.lastReceipt,
  ]);
  assert.deepEqual(leaks(visible), []);
  assert.equal(visible.some((line) => /\b(secret clock|trust|respect|fear|loyalty|closeness)\b[^.\n]{0,20}-?\d/.test(line)), false);
});

test("18-OPT-02 reinforces the east gate and 45-OPT-01 accepts the open offer", async () => {
  memoryStorage();
  const { useGame } = await imp("src/lib/game/store.ts");
  const { decreeOrder } = await imp("src/lib/game/p4-simulation.ts");
  useGame.getState().reset();
  const marks = useGame.getState().world.treasury.marks;
  const eastBefore = useGame.getState().gates.find((g) => g.id === "east");
  useGame.getState().executeV45Option("18-OPT-02");
  let s = useGame.getState();
  const east = s.gates.find((g) => g.id === "east");
  assert.equal(east.condition, "reinforced");
  assert.equal(east.threat, "watched");
  assert.equal(east.visual, eastBefore.visual);
  assert.equal(s.world.treasury.marks, marks - 80);
  assert.ok(s.p4.lastReceipt?.done.some((line) => /east gate is reinforced/i.test(line)));
  assert.ok(Object.values(s.p4.gaugeShift ?? {}).some((dir) => dir === "up" || dir === "down"));
  assert.equal(s.turnCount, 1);
  useGame.getState().reset();
  useGame.getState().executeV45Option("45-OPT-01");
  s = useGame.getState();
  assert.equal(s.trades.some((t) => t.status === "open"), false);
  assert.equal(s.trades.some((t) => t.status === "accepted"), true);
  assert.equal(s.world.treasury.marks, marks - 40);
  assert.equal(s.p4.lastReceipt?.optionId, "45-OPT-01");
  assert.deepEqual(leaks(collectStrings([s.p4.lastReceipt, s.p4.log, s.p4.queue, s.news, s.chronicle])), []);
  useGame.getState().reset();
  useGame.setState({ world: { ...useGame.getState().world, treasury: { ...useGame.getState().world.treasury, marks: 10 } } });
  useGame.getState().executeV45Option("18-OPT-02");
  assert.match(useGame.getState().notice, /Not enough treasury/);
  assert.notEqual(useGame.getState().gates.find((g) => g.id === "east").condition, "reinforced");
  useGame.getState().reset();
  const order = decreeOrder();
  assert.ok(order);
  assert.equal(order.id, "24-OPT-02");
  useGame.setState({ world: { ...useGame.getState().world, clock: { ...useGame.getState().world.clock, time: "10:00" } } });
  const beforeCouncil = useGame.getState();
  const rich = beforeCouncil.world.treasury.marks;
  const food = beforeCouncil.p4.economy.food.stock;
  useGame.getState().stampDecree("CM-2");
  s = useGame.getState();
  assert.equal(s.world.treasury.marks, rich - order.costs.marks);
  assert.equal(s.p4.economy.food.stock, food - 5);
  assert.match(s.notice ?? "", /Decree applied locally; account save pending/);
  assert.ok(s.p4.queue.some((q) => q.source === order.id));
});

test("desk receipt and locked execute are wired", () => {
  const deck = read("src/components/game/CommandDeck.tsx");
  const receipt = read("src/components/platform/Receipt.tsx");
  assert.match(deck, /lockReason\(opt, p4, world\)/);
  assert.match(deck, /disabled=\{!!locked\}/);
  assert.match(deck, /<Receipt slip=\{p4\.lastReceipt\}/);
  assert.match(deck, /opt\.risk === "medium" \|\| opt\.risk === "high"/);
  for (const label of ["DONE", "SPENT", "YOU WILL HEAR", "WRITTEN TO"]) assert.match(receipt, new RegExp(label));
  assert.equal(store.includes("runOption("), true);
});

test("narrator transport uses configured LLM endpoint, else legacy xAI", async () => {
  const xai = await imp("src/lib/game/xai.ts");
  const gm = read("src/lib/game/gm.ts");
  const voice = read("src/lib/game/voice.ts");
  assert.match(gm, /missingArchiveKeyMessage\(\)/);
  assert.match(voice, /archiveLinked\(\)/);
  assert.equal(gm.includes("process.env.XAI_API_KEY"), false);
  assert.equal(voice.includes("process.env.XAI_API_KEY"), false);

  const llmKey = "sk-unit-llm-DO-NOT-LEAK";
  const xaiKey = "sk-unit-xai-DO-NOT-LEAK";
  const messages = [{ role: "user", content: "Speak." }];
  const originalFetch = globalThis.fetch;
  const originalError = console.error;
  const calls = [];
  const logs = [];
  console.error = (...args) => {
    logs.push(args.map((part) => (typeof part === "string" ? part : JSON.stringify(part))).join(" "));
  };
  try {
    globalThis.fetch = async (url, init) => {
      calls.push({ url: String(url), init });
      const model = JSON.parse(init.body).model;
      if (model === "cheap-chat" || model === "grok-4.5") {
        return new Response(JSON.stringify({ choices: [{ message: { content: "heard" } }] }), { status: 200 });
      }
      if (model === "gone-model") {
        return new Response(`model not found ${llmKey}`, { status: 404 });
      }
      return new Response(`boom ${llmKey} ${xaiKey}`, { status: 500 });
    };

    const configured = await xai.completeChat(messages, 40, {
      LLM_API_KEY: llmKey,
      LLM_BASE_URL: "https://example.test/v1/",
      LLM_MODEL: "cheap-chat",
      XAI_API_KEY: xaiKey,
    });
    assert.equal(configured.ok, true);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, "https://example.test/v1/chat/completions");
    assert.equal(calls[0].init.headers.Authorization, `Bearer ${llmKey}`);
    assert.equal(JSON.parse(calls[0].init.body).model, "cheap-chat");
    assert.equal(calls[0].init.method, "POST");

    calls.length = 0;
    const fallback = await xai.completeChat(messages, 40, {
      LLM_API_KEY: llmKey,
      LLM_BASE_URL: "https://example.test/v1",
      LLM_MODEL: "gone-model",
      LLM_FALLBACK_MODELS: "cheap-chat, other-chat",
    });
    assert.equal(fallback.ok, true);
    assert.equal(fallback.model, "cheap-chat");
    assert.equal(calls.length, 2);
    assert.equal(calls[1].url, "https://example.test/v1/chat/completions");
    assert.equal(calls[1].init.headers.Authorization, `Bearer ${llmKey}`);
    assert.equal(JSON.parse(calls[1].init.body).model, "cheap-chat");

    calls.length = 0;
    const legacy = await xai.completeChat(messages, 40, { XAI_API_KEY: xaiKey });
    assert.equal(legacy.ok, true);
    assert.equal(legacy.model, "grok-4.5");
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, "https://api.x.ai/v1/chat/completions");
    assert.equal(calls[0].init.headers.Authorization, `Bearer ${xaiKey}`);
    assert.equal(JSON.parse(calls[0].init.body).model, "grok-4.5");
    assert.equal(JSON.parse(calls[0].init.body).temperature, 0.85);

    calls.length = 0;
    globalThis.fetch = async (url, init) => {
      calls.push({ url: String(url), model: JSON.parse(init.body).model });
      const model = JSON.parse(init.body).model;
      if (model === "grok-4.5") return new Response("unknown model", { status: 404 });
      return new Response(JSON.stringify({ choices: [{ message: { content: "heard" } }] }), { status: 200 });
    };
    const legacyFallback = await xai.completeChat(messages, 40, { XAI_API_KEY: xaiKey });
    assert.equal(legacyFallback.ok, true);
    assert.equal(legacyFallback.model, "grok-3");
    assert.deepEqual(calls.map((c) => c.model), ["grok-4.5", "grok-3"]);
    assert.equal(calls[1].url, "https://api.x.ai/v1/chat/completions");

    calls.length = 0;
    const groqKey = "test-groq-secret";
    const groqConfig = xai.resolveLlmConfig({ GROQ_API_KEY: groqKey });
    assert.equal(groqConfig.apiKey, groqKey);
    assert.equal(groqConfig.baseUrl, "https://api.groq.com/openai/v1");
    assert.equal(groqConfig.model, "llama-3.3-70b-versatile");
    assert.equal(groqConfig.keyVar, "GROQ_API_KEY");
    globalThis.fetch = async (url, init) => {
      calls.push({ url: String(url), init });
      return new Response(JSON.stringify({ choices: [{ message: { content: "groq connected" } }] }), { status: 200 });
    };
    const groq = await xai.completeChat(messages, 40, { GROQ_API_KEY: groqKey });
    assert.equal(groq.ok, true);
    assert.equal(groq.text, "groq connected");
    assert.equal(calls[0].url, "https://api.groq.com/openai/v1/chat/completions");
    assert.equal(calls[0].init.headers.Authorization, `Bearer ${groqKey}`);
    assert.equal(JSON.parse(calls[0].init.body).model, "llama-3.3-70b-versatile");
    assert.equal(xai.archiveLinked({ GROQ_API_KEY: groqKey }), true);

    const missingLegacy = await xai.completeChat(messages, 40, {});
    assert.equal(missingLegacy.ok, false);
    assert.equal(
      missingLegacy.error,
      "The archive key is missing in this environment (XAI_API_KEY not set). The Voice of the Fist cannot speak.",
    );
    assert.equal(missingLegacy.error.includes(llmKey), false);
    assert.equal(xai.archiveLinked({}), false);
    assert.equal(xai.archiveLinked({ XAI_API_KEY: xaiKey }), true);
    assert.equal(xai.archiveLinked({ LLM_API_KEY: llmKey }), true);
    const missingCustom = xai.missingArchiveKeyMessage({ LLM_BASE_URL: "https://example.test/v1" });
    assert.match(missingCustom, /LLM_API_KEY not set/);
    assert.equal(missingCustom.includes(llmKey), false);

    logs.length = 0;
    globalThis.fetch = async () => new Response(`refused ${llmKey}`, { status: 401 });
    const refused = await xai.completeChat(messages, 40, {
      LLM_API_KEY: llmKey,
      LLM_BASE_URL: "https://example.test/v1",
      LLM_MODEL: "cheap-chat",
    });
    assert.equal(refused.ok, false);
    assert.equal(refused.error.includes(llmKey), false);
    assert.equal(logs.some((line) => line.includes(llmKey)), false);
    assert.match(refused.error, /cannot authenticate/);
  } finally {
    globalThis.fetch = originalFetch;
    console.error = originalError;
  }
});




test("time skip hard interrupt includes the computed in-world clock label", () => {
  const world = K.dayOneWorld();
  world.water.stock = 1;
  const state = {
    world, inbox: [], news: [], worldNews: [], calendar: [], stalkers: [], finds: [], sorties: [],
    kin: [], household: [], gates: [], trades: [], films: [], events: [], personalVault: [],
    factionVault: [], children: [], threads: [], secretClocks: [], chronicle: [], radio: [],
  };
  const result = T.simulateAdvance(state, 1);
  assert.match(result.digest.major[0], /^INTERRUPT Wellday, 21 Ironmonth 105 AW:/);
  assert.match(result.digest.interrupt, /Water stock below critical reserve/);
});

test("ration policy never increases consumption, including fractional and zero baselines", () => {
  assert.equal(T.resourceConsumptionForTick({ consumption: 0, policy: "ration" }), 0);
  assert.ok(T.resourceConsumptionForTick({ consumption: 0.5, policy: "ration" }) < 0.5);
  assert.equal(T.resourceConsumptionForTick({ consumption: 0.5, policy: "normal" }), 0.5);
});

test("calendar matching is exact and supports an explicit day range", () => {
  const world = K.dayOneWorld();
  const state = {
    world, inbox: [], news: [], worldNews: [],
    calendar: [
      { id: "exact", name: "Exact", date: "21 Ironmonth", status: "planned", importance: "Critical" },
      { id: "substring", name: "False match", date: "1 Ironmonth", status: "planned", importance: "Critical" },
      { id: "range", name: "Range", date: "19–21 Ironmonth", status: "planned", importance: "Critical" },
    ],
    stalkers: [], finds: [], sorties: [], kin: [], household: [], gates: [], trades: [], films: [], events: [],
    personalVault: [], factionVault: [], children: [], threads: [], secretClocks: [], chronicle: [], radio: [],
  };
  T.advanceDailyContinuity(state, 1, []);
  assert.equal(state.calendar.find((e) => e.id === "exact").status, "started");
  assert.equal(state.calendar.find((e) => e.id === "substring").status, "planned");
  assert.equal(state.calendar.find((e) => e.id === "range").status, "started");
});


test("GM parser strips raw state when footer is absent and rejects truncated JSON safely", () => {
  const noFooter = parseGm('<<<SCENE>>>A scene.<<<STATE>>>{"resources":{"water":{"stock":4}}}');
  assert.equal(noFooter.scene, "A scene.");
  assert.equal(noFooter.stateMissing, true);
  const truncated = parseGm('<<<SCENE>>>A scene.<<<FOOTER>>>Time: 09:00\n<<<STATE>>>{"resources":');
  assert.equal(truncated.stateMissing, true);
  assert.equal(truncated.stateRaw, null);
});

test("delta parser rejects coercion and forbidden keys, while null fields are no-ops", () => {
  assert.equal(parseStateDelta({ resources: { water: { stock: "12" } } }).delta, null);
  assert.equal(parseStateDelta(JSON.parse('{"__proto__":{"polluted":true}}')).delta, null);
  assert.equal(parseStateDelta({ inbox: { new: [{ id: "x", constructor: { prototype: { polluted: true } } }] } }).delta, null);
  const parsed = parseStateDelta({ resources: { water: { stock: null, production: 5 } } });
  assert.equal(parsed.delta.resources.water.stock, undefined);
  assert.equal(parsed.delta.resources.water.production, 5);
  const nullable = parseStateDelta({ requestedDossier: null, tonightFilm: null });
  assert.equal(nullable.delta.requestedDossier, null);
  assert.equal(nullable.delta.tonightFilm, null);
});
