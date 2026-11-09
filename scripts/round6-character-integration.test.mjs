import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { CAST } from "../src/lib/game/kernel.ts";
import { castNow } from "../src/lib/game/presence.ts";
import { defaultP4State } from "../src/lib/game/p4-simulation.ts";
import { RED_CLAW_FAMILY_CARDS } from "../src/lib/game/sim/red-claw-household.ts";
import { createPrivateInteractionRequest, defaultPrivateRelationsState, recordPrivateRequestEvent } from "../src/lib/game/sim/private-relations.ts";
import { appendLedgerEvents, eventsForLedgerDay, ledgerDayOptions } from "../src/lib/game/sim/event-ledger.ts";

const expected = [
  "DAGMAR RED",
  "ADELHEID VON MOREN",
  "VERA GROTSEN",
  "ELARA RED",
  "HANNE BRAUER",
  "GRANDMOTHER WILHELMINA RED",
];

test("Round 5 source-backed relationship notes reach the live Cast cards", () => {
  for (const name of expected) {
    const card = CAST.find((row) => row.name.toUpperCase() === name);
    assert.ok(card, `missing Cast card: ${name}`);
    assert.ok(card.relationships?.trim(), `missing relationship notes on Cast card: ${name}`);
  }
});


test("verified household characters remain connected to the shared live presence projection", () => {
  const rows = castNow(defaultP4State(), 0, "10:00");
  for (const name of expected) assert.ok(rows.some((row) => row.name.toUpperCase() === name), `missing live presence row: ${name}`);
});

test("household registry relationship notes remain available to the administration roster", () => {
  for (const name of ["Dagmar Red", "Adelheid von Moren", "Vera Grotsen", "Elara Red", "Wilhelmina Red"]) {
    const card = RED_CLAW_FAMILY_CARDS.find((row) => row.name === name);
    assert.ok(card?.relationships?.trim(), `missing household relationship notes: ${name}`);
  }
});


test("Private Relations events flow into Event Ledger and read-only Day Replay without implying consent", () => {
  const created = createPrivateInteractionRequest(defaultPrivateRelationsState(), "elara-red", "reconciliation", 0, "20:15");
  assert.ok(created.request);
  assert.equal(created.request.status, "pending");
  const event = recordPrivateRequestEvent(created.request, "former-partner", "20 Ironmonth", "105 AW", "Floor 6");
  const ledger = appendLedgerEvents([], event);
  const options = ledgerDayOptions(ledger);
  assert.equal(options.length, 1);
  assert.equal(options[0].label, "20 Ironmonth 105 AW");
  const replay = eventsForLedgerDay(ledger, options[0].key);
  assert.equal(replay.length, 1);
  assert.equal(replay[0].type, "PRIVATE_RELATIONSHIP");
  assert.match(replay[0].immediate, /request\/response status was recorded/);
  assert.equal(replay[0].knowledge, "player");
});

test("Cast and Household UI expose recorded relationships without conflating live state", async () => {
  const cast = await readFile(new URL("../src/components/game/CastPanel.tsx", import.meta.url), "utf8");
  const household = await readFile(new URL("../src/components/game/V45PanelBody.tsx", import.meta.url), "utf8");
  const play = await readFile(new URL("../src/lib/game/play.ts", import.meta.url), "utf8");
  assert.match(cast, /Recorded relationships/);
  assert.match(cast, /card\.relationships/);
  assert.match(household, /Recorded relationships:/);
  assert.match(household, /not live affection, consent, relationship eligibility or disclosure state/);
  assert.match(play, /canonRelationshipNotes/);
  for (const id of ["dagmar-red", "adelheid-von-moren", "vera-grotsen", "elara-red", "hanne-brauer", "wilhelmina-red"]) {
    assert.ok(play.includes(`"${id}"`), `AL state projection is missing ${id}`);
  }
  assert.match(play, /Reference lore only; never infer current feelings, consent, relationship state, or disclosure/);
});
