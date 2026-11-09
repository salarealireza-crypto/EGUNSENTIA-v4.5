import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const imp = (path) => import(new URL(`../${path}`, import.meta.url));
const [P, Council, Execute, Catalog, Kernel, Core, Investigation, Presence] = await Promise.all([
  imp("src/lib/game/p4-simulation.ts"),
  imp("src/lib/game/sim/council.ts"),
  imp("src/lib/platform/options/execute.ts"),
  imp("src/lib/platform/options/catalog.ts"),
  imp("src/lib/game/kernel.ts"),
  imp("src/lib/game/sim/core.ts"),
  imp("src/lib/game/sim/investigation-cases.ts"),
  imp("src/lib/game/presence.ts"),
]);

function runInput(option, world = Kernel.dayOneWorld(), p4 = P.defaultP4State(), turnCount = 0) {
  return {
    ...(option ? { option } : {}),
    p4,
    world,
    gates: [],
    trades: [],
    events: [],
    news: [],
    chronicle: [],
    turnCount,
    worldInputs: Core.DEFAULT_WORLD,
  };
}

function councilInput({ day = 0, time = "10:00", p4 = P.defaultP4State(), turnCount = 0 } = {}) {
  const baseWorld = Kernel.dayOneWorld();
  const world = { ...baseWorld, dayIndex: day, clock: { ...baseWorld.clock, time } };
  const minute = Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5));
  return { ...runInput(undefined, world, P.syncClock(p4, day, minute), turnCount), p4: P.syncClock(p4, day, minute) };
}

test("council plan carries the exact authoritative catalog option and stable minute identity", () => {
  const order = P.decreeOrder();
  assert.ok(order);
  const planned = Council.planCouncilDecree(Core.DEFAULT_WORLD, "CM-2", order, 4, 600);
  assert.equal(planned.ok, true);
  if (!planned.ok) return;
  assert.equal(planned.plan.commandId, "council-decree:24-OPT-02:4:600");
  assert.equal(planned.plan.option, order);
  assert.deepEqual(planned.plan.option.effects.map((effect) => effect.type), ["stock", "queue", "note", "npc"]);
  assert.equal(planned.plan.option.effects[0].delta, -5);
  assert.equal(planned.plan.option.effects[1].afterHours, 48);
});

test("Council decree uses the shared typed-option runner and is idempotent across seats", () => {
  const initial = P.defaultP4State();
  const input = councilInput({ p4: initial });
  const order = P.decreeOrder();
  assert.ok(order);
  const first = Execute.runCouncilDecree(input, "CM-2");
  assert.equal(first.ok, true);
  if (!first.ok) return;
  assert.equal(first.p4.spent.marks, order.costs.marks);
  assert.equal(first.p4.spent.hours, order.costs.hours);
  assert.equal(first.p4.economy.food.stock, initial.economy.food.stock - 5);
  assert.equal(first.world.food.stock, input.world.food.stock - 40);
  assert.ok(first.p4.lastReceipt.done.some((line) => /Food stock decreased by 5/i.test(line)));
  assert.equal(first.p4.queue.length, 1);
  assert.equal(first.p4.queue[0].source, order.id);
  assert.equal(first.p4.queue[0].dueMin, 600 + 48 * 60);
  assert.equal(first.p4.npcStatus["Physician Sabine Lorenz"].mood, "strained");
  assert.equal(first.p4.npcStatus["Physician Sabine Lorenz"].errandUntil, 16 * 60);
  assert.ok(first.events.some((event) => event.id === `EV-${first.commandId.replace(/[^a-zA-Z0-9_-]/g, "-")}` && event.actors.includes("Treasury")));
  assert.equal(first.news[0].source, "Council");
  assert.ok(first.chronicle.some((entry) => entry.id === `CH-${first.events.find((event) => event.type === "COMMAND").id}`));
  assert.match(first.p4.lastReceipt.done.join(" "), /stamped through Treasury/i);
  assert.match(first.p4.lastReceipt.done.join(" "), /Political Capital cost \(1\).*not deducted/i);

  const replay = Execute.runCouncilDecree({ ...input, p4: first.p4 }, "CM-2");
  assert.equal(replay.ok, false);
  if (!replay.ok) assert.match(replay.notice, /already been stamped/i);
  const secondSeatReplay = Execute.runCouncilDecree({ ...input, p4: first.p4 }, "CM-3");
  assert.equal(secondSeatReplay.ok, false);
  assert.equal(first.p4.spent.marks, order.costs.marks);
  assert.equal(first.p4.queue.length, 1);

  const laterWorld = { ...input.world, clock: { ...input.world.clock, time: "16:00" } };
  const laterInput = { ...input, world: laterWorld, p4: P.syncClock(first.p4, 0, 16 * 60), turnCount: 1 };
  const later = Execute.runCouncilDecree(laterInput, "CM-2");
  assert.equal(later.ok, true);
  if (later.ok) assert.equal(later.p4.queue.length, 2);
});

test("council idempotency keys survive normalization and are bounded", () => {
  const base = P.defaultP4State();
  const ids = Array.from({ length: 505 }, (_, index) => `decree-${index}`);
  const restored = P.normalizeP4({ ...base, appliedCouncilCommandIds: ids });
  assert.equal(restored.appliedCouncilCommandIds.length, 500);
  assert.equal(restored.appliedCouncilCommandIds[0], "decree-5");
  assert.deepEqual(P.normalizeP4({ ...base, appliedCouncilCommandIds: ["ok", null, 3] }).appliedCouncilCommandIds, ["ok"]);
});

test("malformed council plan inputs and unknown seats are rejected", () => {
  const order = P.decreeOrder();
  assert.ok(order);
  const malformed = Council.planCouncilDecree(Core.DEFAULT_WORLD, "CM-2", { ...order, id: "24-OPT-99" }, 0, 420);
  assert.equal(malformed.ok, false);
  if (!malformed.ok) assert.match(malformed.reason, /authoritative panel 24 catalog/i);
  const unknownSeat = Council.planCouncilDecree(Core.DEFAULT_WORLD, "CM-0", order, 0, 420);
  assert.equal(unknownSeat.ok, false);
});

test("the council decree catalog item cannot be executed through the generic option path", () => {
  const option = Catalog.OPTION_CATALOG["24"].find((row) => row.id === "24-OPT-02");
  assert.ok(option);
  const result = Execute.runOption(runInput(option));
  assert.equal(result.ok, false);
  if (!result.ok) assert.match(result.notice, /Council panel/i);
});

test("generic options reject insufficient marks without reducing the treasury to zero", () => {
  const catalogOption = Catalog.OPTION_CATALOG["10"].find((row) => row.id === "10-OPT-01");
  assert.ok(catalogOption);
  const option = { ...catalogOption, costs: { ...catalogOption.costs, marks: 1 } };
  const world = { ...Kernel.dayOneWorld(), treasury: { ...Kernel.dayOneWorld().treasury, marks: 0 } };
  const result = Execute.runOption(runInput(option, world));
  assert.equal(result.ok, false);
  if (!result.ok) assert.match(result.notice, /requires .* marks/i);
  assert.equal(world.treasury.marks, 0);
});

test("generic options reject malformed marks costs", () => {
  const option = Catalog.OPTION_CATALOG["10"].find((row) => row.id === "10-OPT-01");
  assert.ok(option);
  const result = Execute.runOption(runInput({ ...option, costs: { ...option.costs, marks: -5 } }));
  assert.equal(result.ok, false);
  if (!result.ok) assert.match(result.notice, /invalid treasury cost/i);
});

test("negative typed stock effects are preflighted and cannot clamp an insufficient balance", () => {
  const option = Catalog.OPTION_CATALOG["24"].find((row) => row.id === "24-OPT-02");
  assert.ok(option);
  const baseP4 = P.defaultP4State();
  const lowP4 = { ...baseP4, economy: { ...baseP4.economy, food: { ...baseP4.economy.food, stock: 4 } } };
  const input = councilInput({ p4: lowP4 });
  const result = Execute.runCouncilDecree(input, "CM-2");
  assert.equal(result.ok, false);
  if (!result.ok) assert.match(result.notice, /needs 5 food/i);
  assert.equal(lowP4.economy.food.stock, 4);
  assert.equal(input.world.treasury.marks, 120000);
  assert.equal(input.world.food.stock, 620);
});

test("negative typed stock effects reject insufficient world stock before any mutation", () => {
  const base = councilInput();
  const lowWorld = { ...base.world, food: { ...base.world.food, stock: 39 } };
  const input = { ...base, world: lowWorld };
  const result = Execute.runCouncilDecree(input, "CM-2");
  assert.equal(result.ok, false);
  if (!result.ok) assert.match(result.notice, /needs 40 food stock units/i);
  assert.equal(input.p4.economy.food.stock, base.p4.economy.food.stock);
  assert.equal(input.world.food.stock, 39);
  assert.equal(input.world.treasury.marks, base.world.treasury.marks);
});

test("explicit resource reservations and typed effects commit together", () => {
  const catalog = Catalog.OPTION_CATALOG["24"].find((row) => row.id === "24-OPT-03");
  assert.ok(catalog);
  const option = { ...catalog, costs: { ...catalog.costs, resources: { food: 10 } } };
  const world = { ...Kernel.dayOneWorld(), clock: { ...Kernel.dayOneWorld().clock, time: "10:00" } };
  const p4 = P.syncClock(P.defaultP4State(), 0, 600);
  const result = Execute.runOption(runInput(option, world, p4));
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.p4.economy.food.stock, p4.economy.food.stock - 10);
  assert.equal(result.world.food.stock, world.food.stock - 80);
  assert.equal(result.world.treasury.marks, world.treasury.marks - option.costs.marks);
});



test("Council command identity survives JSON save/load and blocks replay", () => {
  const input = councilInput({ day: 3, time: "10:15" });
  const order = P.decreeOrder();
  assert.ok(order);
  const first = Execute.runCouncilDecree(input, "CM-2");
  assert.equal(first.ok, true);
  if (!first.ok) return;
  const restored = P.normalizeP4(JSON.parse(JSON.stringify(first.p4)));
  assert.equal(restored.spent.marks, order.costs.marks);
  assert.equal(restored.spent.hours, order.costs.hours);
  assert.equal(restored.queue.filter((item) => item.source === order.id).length, 1);
  const duplicate = Execute.runCouncilDecree({ ...input, p4: restored }, "CM-2");
  assert.equal(duplicate.ok, false);
});

test("a successful generic option keeps its exact costs, receipt and event after JSON save/load", () => {
  const catalogOption = Catalog.OPTION_CATALOG["10"].find((row) => row.id === "10-OPT-01");
  assert.ok(catalogOption);
  const option = { ...catalogOption, costs: { ...catalogOption.costs, marks: 7 } };
  const world = { ...Kernel.dayOneWorld(), treasury: { ...Kernel.dayOneWorld().treasury, marks: 100 } };
  const result = Execute.runOption(runInput(option, world));
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.world.treasury.marks, 93);
  assert.equal(result.p4.spent.marks, 7);
  assert.equal(result.p4.lastReceipt.optionId, option.id);
  assert.ok(result.events.some((event) => event.type === "COMMAND" && event.cause.includes(option.id)));
  const restored = P.normalizeP4(JSON.parse(JSON.stringify(result.p4)));
  assert.equal(restored.spent.marks, 7);
  assert.equal(restored.lastReceipt.optionId, option.id);
});

test("missing-person inquiries require a player-supplied subject and source and remain unverified", () => {
  const empty = Investigation.createInvestigationCase([], "", 5, { kind: "missing-person-inquiry", subjectName: "A name from record", sourceReference: "" });
  assert.equal(empty.created, undefined);
  assert.match(empty.message, /source reference/i);
  const created = Investigation.createInvestigationCase([], "", 5, { kind: "missing-person-inquiry", subjectName: "A name from record", sourceReference: "Archive index 12, folio 3 (unverified copy)" });
  assert.ok(created.created);
  assert.equal(created.created.kind, "missing-person-inquiry");
  assert.equal(created.created.subjectName, "A name from record");
  assert.equal(created.created.status, "open");
  assert.equal(created.created.notes[0].classification, "unverified");
  assert.equal(created.created.notes[0].provenance, "player-supplied");
  const restored = Investigation.normalizeInvestigationCases(JSON.parse(JSON.stringify(created.rows)));
  assert.equal(restored[0].kind, "missing-person-inquiry");
  assert.equal(restored[0].notes[0].classification, "unverified");
});

test("general case creation remains backward-compatible and does not fabricate a person", () => {
  const created = Investigation.createInvestigationCase([], "Supply ledger discrepancy", 7);
  assert.ok(created.created);
  assert.equal(created.created.kind, "general");
  assert.equal(created.created.subjectName, undefined);
  assert.equal(created.created.notes.length, 0);
});

test("CAST and all live availability projections use the shared cast presence calculation", () => {
  const p4 = P.defaultP4State();
  const rows = Presence.castNow(p4, 0, "10:00");
  assert.ok(rows.length > 0);
  assert.ok(rows.every((row) => typeof row.available === "boolean" && row.name && row.place));
  const sourceCastPanel = readFileSync(new URL("../src/components/game/CastPanel.tsx", import.meta.url), "utf8");
  const sourcePanels = readFileSync(new URL("../src/components/game/V45PanelBody.tsx", import.meta.url), "utf8");
  assert.match(sourceCastPanel, /castNow\(p4, world\.dayIndex, world\.clock\.time\)/);
  assert.match(sourcePanels, /function MessagesBody[\s\S]*?castNow\(p4, world\.dayIndex, world\.clock\.time\)/);
  assert.match(sourcePanels, /function PlannerBody[\s\S]*?planItem\(p4,label\.trim\(\),time/);
  assert.match(sourcePanels, /function EveningHallPresence[\s\S]*?castNow\(p4, world\.dayIndex, world\.clock\.time\)/);
  assert.match(sourcePanels, /panel\.id === "33"[\s\S]*?EveningHallPresence/);
  assert.match(sourcePanels, /appliedCouncilCommandIds[\s\S]*?alreadyStamped/);
  assert.match(sourcePanels, /Only one copy of this decree can be stamped per campaign minute/);
});


test("discussion-only council API cannot create a partial decree without the treasury transaction", () => {
  const initial = P.defaultP4State();
  const next = P.decideCouncil(initial, "CM-2-decree", Core.DEFAULT_WORLD, P.decreeOrder());
  assert.equal(next.queue.filter((item) => item.source === "council").length, 0);
  assert.equal(next.spent.marks, initial.spent.marks);
  assert.match(next.log[0], /atomic Stamp Decree action/i);
});
