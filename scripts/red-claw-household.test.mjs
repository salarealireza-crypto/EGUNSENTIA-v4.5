import assert from "node:assert/strict";
import test from "node:test";
import {
  RED_CLAW_FAMILY_CARDS,
  RED_CLAW_CAST_CARDS,
  getRedClawHouseholdCensus,
  validateRedClawHouseholdRoster,
} from "../src/lib/game/sim/red-claw-household.ts";
import {
  defaultPrivateRelationsState,
  getPlayerWomenCanonProfiles,
  createPrivateInteractionRequest,
} from "../src/lib/game/sim/private-relations.ts";

const byId = new Map(RED_CLAW_FAMILY_CARDS.map((card) => [card.id, card]));

test("Red Claw family registry has exactly 100 unique cards in the requested tier distribution", () => {
  const report = validateRedClawHouseholdRoster();
  assert.equal(report.ok, true, report.issues.join("\n"));
  assert.deepEqual(report.tierCounts, { A: 20, B: 30, C: 50 });
  assert.equal(new Set(RED_CLAW_FAMILY_CARDS.map((row) => row.id)).size, 100);
  assert.equal(new Set(RED_CLAW_FAMILY_CARDS.map((row) => row.name.toLowerCase())).size, 100);
});

test("the twelve new former-partner histories are adult-only, non-pregnancy histories with current spouses", () => {
  const partners = RED_CLAW_FAMILY_CARDS.filter((row) => row.historicalRelationship);
  assert.equal(partners.length, 12);
  for (const partner of partners) {
    const history = partner.historicalRelationship;
    assert.ok(partner.ageYears >= 18);
    assert.ok(history.ageAtStart >= 18);
    assert.equal(history.pregnancyByChristian, false);
    assert.deepEqual(history.childrenByChristian, []);
    assert.equal(history.currentRelationshipEligibility, false);
    assert.ok(byId.has(partner.currentSpouseId));
    assert.ok(partner.childIds.length >= 1);
    assert.equal(partner.sourceStatus, "PROPOSED_EXPANSION");
  }
});

test("the twelve proposed relationship entries are visible in Private Relations but are read-only for romance", () => {
  const profiles = getPlayerWomenCanonProfiles();
  assert.equal(profiles.length, 37);
  const historic = profiles.filter((row) => row.sourceStatus === "PROPOSED_EXPANSION");
  assert.equal(historic.length, 12);
  assert.ok(historic.every((row) => row.ageYears >= 18 && row.relationshipStatus === "former-partner" && row.relationshipEligible === false));
  const state = defaultPrivateRelationsState();
  for (const person of historic) {
    assert.equal(state.relationships.find((row) => row.personId === person.id)?.status, "former-partner");
    assert.equal(createPrivateInteractionRequest(state, person.id, "courtship", 2, "20:15").request, undefined);
    assert.ok(createPrivateInteractionRequest(state, person.id, "conversation", 2, "20:15").request);
    assert.match(person.secrets, /SEALED/);
  }
});

test("minors are age-appropriate family/cast records and never appear in private-relations roster", () => {
  const minors = RED_CLAW_FAMILY_CARDS.filter((row) => row.ageYears !== null && row.ageYears < 18);
  assert.ok(minors.length >= 4);
  assert.ok(minors.every((row) => row.adultRelationshipSystems?.startsWith("DISABLED") || !row.historicalRelationship));
  const profiles = getPlayerWomenCanonProfiles();
  assert.ok(profiles.every((row) => row.ageYears >= 18));
  assert.ok(RED_CLAW_CAST_CARDS.some((row) => row.ageYears === 11));
});

test("parent/child and spouse references are reciprocal where recorded", () => {
  for (const parent of RED_CLAW_FAMILY_CARDS) {
    for (const childId of parent.childIds) assert.ok(byId.get(childId)?.parents.includes(parent.id));
    for (const spouseId of parent.spouseIds) assert.ok(byId.get(spouseId)?.spouseIds.includes(parent.id));
  }
});

test("the roster census is derived from the actual records, not the faction population", () => {
  const census = getRedClawHouseholdCensus();
  assert.equal(census.totalCards, 100);
  assert.equal(census.proposedPermanentFamilyResidents, 71);
  assert.equal(census.activeCastEntries, 72);
  assert.equal(census.formerAdultPartners, 12);
});

test("historical father-generation staffing is a separate 3-servant / 5-woman Iron Guard record", async () => {
  const fs = await import("node:fs");
  const historical = JSON.parse(fs.readFileSync(new URL("../src/lib/canon/red-claw-historical-household.json", import.meta.url), "utf8"));
  assert.equal(historical.personnel.length, 8);
  assert.equal(historical.personnel.filter((row) => row.sex === "male").length, 3);
  assert.equal(historical.personnel.filter((row) => row.sex === "female").length, 5);
  assert.ok(historical.personnel.every((row) => row.sourceStatus === "PROPOSED_EXPANSION"));
  assert.ok(historical.personnel.every((row) => row.age.startsWith("UNKNOWN")));
  assert.ok(historical.personnel.every((row) => row.id.startsWith("hist-")));
  assert.ok(historical.validationWarnings.some((row) => row.includes("not Elara")) || historical.validationWarnings.some((row) => row.includes("Elara’s current Guard")));
});

test("twelve former-partner histories use proposed 88–89 AW dates and leave the first marriage undated", () => {
  const partners = RED_CLAW_FAMILY_CARDS.filter((row) => row.historicalRelationship);
  assert.ok(partners.every((row) => row.sourceStatus === "PROPOSED_EXPANSION"));
  assert.ok(partners.every((row) => row.historicalRelationship.startDate.includes("88 AW") || row.historicalRelationship.startDate.includes("89 AW")));
  assert.ok(partners.every((row) => row.historicalRelationship.endDate.endsWith("89 AW") || row.historicalRelationship.endDate.endsWith("88 AW")));
  assert.ok(partners.every((row) => row.historicalRelationship.relationshipAgeVerifiedAgainstCanonicalDOB === false));
  assert.ok(partners.every((row) => row.historicalRelationship.firstFormalMarriageCandidateDate.startsWith("UNKNOWN")));
});

test("household CAST routines map to the stated clock windows and explicit locations", async () => {
  const { buildSchedule } = await import("../src/lib/game/sim/npc.ts");
  const schedule = buildSchedule({
    name: "Household Test",
    role: "Family administrator",
    fields: { DAY: "morning household duties in Council Floor; midday family meal in Dining Hall; afternoon personal work in Archive; evening family time in Evening Hall" },
  });
  const morning = schedule.find((row) => row.activity.toLowerCase().includes("morning"));
  const midday = schedule.find((row) => row.activity.toLowerCase().includes("midday"));
  const afternoon = schedule.find((row) => row.activity.toLowerCase().includes("afternoon"));
  const evening = schedule.find((row) => row.activity.toLowerCase().includes("evening family"));
  assert.deepEqual([morning.from, morning.to, morning.place], [480, 720, "Council Floor"]);
  assert.deepEqual([midday.from, midday.to, midday.place], [720, 840, "Dining Hall"]);
  assert.deepEqual([afternoon.from, afternoon.to, afternoon.place], [840, 1080, "Archive"]);
  assert.deepEqual([evening.from, evening.to, evening.place], [1080, 1320, "Evening Hall"]);
  assert.equal(schedule.filter((row) => row.from === 1080 && row.to === 1320).length, 1);
});

test("all active family registry entries are present in CAST without duplicate display names", async () => {
  const { CAST } = await import("../src/lib/game/kernel.ts");
  const names = CAST.map((row) => row.name.trim().toLocaleLowerCase("en-GB"));
  assert.equal(new Set(names).size, names.length);
  for (const person of RED_CLAW_CAST_CARDS) assert.ok(CAST.some((row) => row.name.trim().toLocaleLowerCase("en-GB") === person.name.trim().toLocaleLowerCase("en-GB")), `Missing CAST entry: ${person.name}`);
  assert.ok(CAST.some((row) => row.name === "Mirelda Grotsen" && row.loreStatus === "CANON_IDENTITY_WITH_PROPOSED_BIOGRAPHY"));
  assert.ok(CAST.some((row) => row.name === "Helena Red-Grotsen" && row.loreStatus === "PROPOSED_EXPANSION"));
});
