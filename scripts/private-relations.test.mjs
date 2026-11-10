import assert from "node:assert/strict";
import test from "node:test";
import {
  acknowledgeDynasticConsequence,
  applyBoundaryReputationImpact,
  createPrivateInteractionRequest,
  defaultPrivateRelationsState,
  finalizePrivateMarriage,
  getPlayerWomenCanonProfiles,
  normalizePrivateRelations,
  recordBoundaryBreach,
  recordPregnancyEvidence,
  recordPrivateRelationshipDisclosure,
  recordPrivateRequestEvent,
  resolvePrivateInteractionRequest,
  hasCanonicalAdultProfile,
  PRIVATE_RELATIONS_ROSTER_GAPS,
} from "../src/lib/game/sim/private-relations.ts";
import { appendLedgerEvents } from "../src/lib/game/sim/event-ledger.ts";
import { serializeSavePayload } from "../src/lib/game/save-validation.mjs";
import { dayOneReputations, dayOnePregnancies, dayOneChildren } from "../src/lib/game/v41-data.ts";

const time = "20:15";

test("the adult House/Guard/attendant roster preserves CP9 profiles and clearly labels proposed former partners", () => {
  const profiles = getPlayerWomenCanonProfiles();
  assert.equal(profiles.length, 37);
  assert.ok(profiles.every((person) => person.ageYears >= 18));
  assert.equal(profiles.filter((person) => person.sourceStatus === "PROPOSED_EXPANSION").length, 12);
  assert.ok(profiles.filter((person) => person.sourceStatus === "PROPOSED_EXPANSION").every((person) => !person.relationshipEligible && person.historyDisposition));
  assert.equal(profiles.filter((person) => person.category === "official-wife").length, 3);
  assert.equal(profiles.filter((person) => person.category === "iron-guard").length, 4);
  assert.equal(profiles.filter((person) => person.category === "household-attendant").length, 5);
  assert.ok(profiles.some((person) => person.id === "sabine-lorenz"));
  assert.ok(profiles.some((person) => person.id === "hedda-red"));
  assert.equal(profiles.find((person) => person.id === "elara-red")?.relationshipStatus, "former-partner");
  assert.match(profiles.find((person) => person.id === "dagmar-red").appearance, /auburn/i);
  assert.match(profiles.find((person) => person.id === "sigrid-falk").bodyMovement, /weight/i);
  assert.match(profiles.find((person) => person.id === "hanne-brauer").bodyMovement, /UNKNOWN/);
});

test("Round 5 exposes only source-backed relationship summaries for the six incomplete first-tier profiles", () => {
  const profiles = new Map(getPlayerWomenCanonProfiles().map((person) => [person.id, person]));
  assert.match(profiles.get("dagmar-red").relationships, /Konrad Red and Liese Red/);
  assert.match(profiles.get("adelheid-von-moren").relationships, /Emil Red/);
  assert.match(profiles.get("adelheid-von-moren").relationships, /Marriage Kin, not a blood relationship/);
  assert.match(profiles.get("vera-grotsen").relationships, /no blood relationship to Christian is established/);
  assert.match(profiles.get("elara-red").relationships, /former partner, not an official wife/);
  assert.match(profiles.get("elara-red").relationships, /exact count convention is unresolved/);
  assert.match(profiles.get("wilhelmina-red").relationships, /maternal grandson/);
  assert.match(profiles.get("hanne-brauer").relationships, /retired from the active attendant roster/);
  assert.match(profiles.get("hanne-brauer").relationships, /protective of Mila/);
  assert.ok(PRIVATE_RELATIONS_ROSTER_GAPS.some((item) => /sources are not consistent about the Iron Guard detail count/.test(item)));
  assert.ok(PRIVATE_RELATIONS_ROSTER_GAPS.some((item) => /do not invent another member/.test(item)));
});

test("legacy saves normalize to a complete relationship roster without inventing current consent", () => {
  const state = normalizePrivateRelations(undefined);
  assert.equal(state.schemaVersion, 1);
  assert.equal(state.relationships.find((row) => row.personId === "dagmar-red").status, "married");
  assert.equal(state.relationships.find((row) => row.personId === "elara-red").status, "former-partner");
  assert.equal(state.relationships.find((row) => row.personId === "mila").status, "unestablished");
  assert.deepEqual(state.requests, []);
  assert.deepEqual(state.consequences, []);
});

test("requests remain pending and never assume an NPC accepts", () => {
  const state = defaultPrivateRelationsState();
  const created = createPrivateInteractionRequest(state, "elara-red", "reconciliation", 4, time);
  assert.ok(created.request);
  assert.equal(created.request.status, "pending");
  assert.equal(created.state.relationships.find((row) => row.personId === "elara-red").status, "former-partner");
  assert.match(created.message, /No acceptance or consent has been assumed/);
});

test("family-elder romance and a new proposal to an existing wife are rejected", () => {
  const state = defaultPrivateRelationsState();
  assert.equal(createPrivateInteractionRequest(state, "wilhelmina-red", "courtship", 1, time).request, undefined);
  assert.equal(createPrivateInteractionRequest(state, "dagmar-red", "marriage-proposal", 1, time).request, undefined);
  assert.ok(createPrivateInteractionRequest(state, "wilhelmina-red", "conversation", 1, time).request);
});

test("an accepted conversation never changes a spouse's relationship or disclosure state", () => {
  const state = defaultPrivateRelationsState();
  const created = createPrivateInteractionRequest(state, "dagmar-red", "conversation", 1, time);
  const accepted = resolvePrivateInteractionRequest(created.state, created.request.id, "accepted", {
    dayIndex: 1, time, consentEvidence: "She freely agreed to the private conversation.", freeToDeclineConfirmed: true,
  });
  const dagmar = accepted.state.relationships.find((row) => row.personId === "dagmar-red");
  assert.equal(accepted.ok, true);
  assert.equal(dagmar.status, "married");
  assert.equal(dagmar.visibility, "public");
  assert.equal(dagmar.lastEventId, null);
});

test("stale or forged pending proposals cannot bypass Canon relationship eligibility", () => {
  const base = defaultPrivateRelationsState();
  const forged = {
    ...base,
    requests: [{
      id: "legacy-forged-wife-proposal", personId: "dagmar-red", personName: "Dagmar Red",
      kind: "marriage-proposal", status: "pending", dayIndex: 1, time,
      responseNote: "", consentEvidence: "", freeToDeclineConfirmed: false, independentSafeguard: false,
    }],
  };
  const result = resolvePrivateInteractionRequest(forged, "legacy-forged-wife-proposal", "accepted", {
    dayIndex: 1, time, consentEvidence: "This should not authorize a new marriage.", freeToDeclineConfirmed: true,
  });
  assert.equal(result.ok, false);
  const forgedEngagement = {
    ...base,
    relationships: base.relationships.map((row) => row.personId === "dagmar-red" ? { ...row, status: "engagement-pending" } : row),
  };
  assert.equal(finalizePrivateMarriage(forgedEngagement, "dagmar-red", 2, time, "Mutual consent confirmed.", "Ceremony record MR-02 confirmed.").ok, false);
});

test("proposed Red Claw dossiers cannot create Canon boundary or medical events", () => {
  assert.equal(hasCanonicalAdultProfile("elara-red"), true);
  assert.equal(hasCanonicalAdultProfile("rc-lenna-falkner"), false);
  const state = defaultPrivateRelationsState();
  const proposedConversation = createPrivateInteractionRequest(state, "rc-lenna-falkner", "conversation", 2, time);
  assert.ok(proposedConversation.request);
  const neutralResponse = resolvePrivateInteractionRequest(proposedConversation.state, proposedConversation.request.id, "accepted", {
    dayIndex: 2, time, consentEvidence: "She freely agreed to a neutral conversation.", freeToDeclineConfirmed: true,
  });
  assert.equal(neutralResponse.ok, true);
  assert.equal(neutralResponse.state.relationships.find((row) => row.personId === "rc-lenna-falkner").status, "former-partner");
  assert.equal(recordPrivateRelationshipDisclosure(state, "rc-lenna-falkner", "public", 2, "Proposed public notice without Canon approval.").ok, false);
  const boundary = recordBoundaryBreach(state, "rc-lenna-falkner", 2, time, "A proposed incident with no Canon basis.");
  const pregnancy = recordPregnancyEvidence([], state, { mother: "Lenna Falkner", status: "suspected", dayIndex: 2, evidence: "A proposed medical note without Canon status." });
  assert.equal(boundary.ok, false);
  assert.equal(pregnancy.ok, false);
});

test("accepted requests require freely given consent evidence and power safeguards", () => {
  const initial = createPrivateInteractionRequest(defaultPrivateRelationsState(), "mila", "courtship", 3, time).state;
  const requestId = initial.requests[0].id;
  const noEvidence = resolvePrivateInteractionRequest(initial, requestId, "accepted", { dayIndex: 3, time, freeToDeclineConfirmed: true, independentSafeguard: true });
  assert.equal(noEvidence.ok, false);
  const noFreeChoice = resolvePrivateInteractionRequest(initial, requestId, "accepted", { dayIndex: 3, time, consentEvidence: "The character explicitly agreed", freeToDeclineConfirmed: false, independentSafeguard: true });
  assert.equal(noFreeChoice.ok, false);
  const noSafeguard = resolvePrivateInteractionRequest(initial, requestId, "accepted", { dayIndex: 3, time, consentEvidence: "The character explicitly agreed in scene", freeToDeclineConfirmed: true, independentSafeguard: false });
  assert.equal(noSafeguard.ok, false);
  const accepted = resolvePrivateInteractionRequest(initial, requestId, "accepted", { dayIndex: 3, time, consentEvidence: "Explicit dialogue agreement; no threat or penalty", freeToDeclineConfirmed: true, independentSafeguard: true, independentSafeguardEvidence: "Independent reporting officer and anti-retaliation directive logged in the service register.", note: "Independent reporting route established." });
  assert.equal(accepted.ok, true);
  assert.equal(accepted.state.relationships.find((row) => row.personId === "mila").status, "courtship");
  assert.equal(accepted.consequence.kind, "conflict-of-interest");
});

test("a declined request preserves the relationship state and creates no punishment", () => {
  const created = createPrivateInteractionRequest(defaultPrivateRelationsState(), "freja-dorn", "courtship", 2, time);
  const declined = resolvePrivateInteractionRequest(created.state, created.request.id, "declined", { dayIndex: 2, time, note: "She declined; the decision was respected." });
  assert.equal(declined.ok, true);
  assert.equal(declined.state.relationships.find((row) => row.personId === "freja-dorn").status, "unestablished");
  assert.equal(declined.consequence, undefined);
  assert.match(declined.message, /no penalty/i);
});

test("boundary breaches create review records and lower relevant audience reputation", () => {
  const result = recordBoundaryBreach(defaultPrivateRelationsState(), "katya", 8, time, "The player persisted after a clearly stated refusal.");
  assert.equal(result.ok, true);
  assert.equal(result.consequence.kind, "boundary-breach");
  const duplicate = recordBoundaryBreach(result.state, "katya", 8, time, "The player persisted after a clearly stated refusal.");
  assert.equal(duplicate.ok, true);
  assert.equal(duplicate.duplicate, true);
  assert.equal(duplicate.state, result.state);
  const reputations = applyBoundaryReputationImpact(dayOneReputations(), "household-attendant");
  assert.equal(reputations.find((row) => row.audience === "House").standing, 5);
  assert.equal(reputations.find((row) => row.audience === "Bound Workers").standing, 2);
  assert.equal(reputations.find((row) => row.audience === "Soldiers").standing, 8);
});

test("suspected pregnancy stays unverified; confirmation requires explicit medical verification", () => {
  const state = defaultPrivateRelationsState();
  const suspected = recordPregnancyEvidence(dayOnePregnancies(), state, { mother: "Vera Grotsen", status: "suspected", dayIndex: 9, evidence: "Infirmary test ordered; result not yet confirmed." });
  assert.equal(suspected.ok, true);
  assert.equal(suspected.record.knowledge, "player");
  assert.equal(suspected.record.state, "suspected");
  const blocked = recordPregnancyEvidence(suspected.pregnancies, suspected.state, { mother: "Vera Grotsen", status: "confirmed", dayIndex: 10, evidence: "Test result confirmed by physician." });
  assert.equal(blocked.ok, false);
  const confirmed = recordPregnancyEvidence(suspected.pregnancies, suspected.state, { mother: "Vera Grotsen", status: "confirmed", dayIndex: 10, evidence: "Medical record MED-VERA-10; physician confirmed.", medicallyVerified: true });
  assert.equal(confirmed.ok, true);
  assert.equal(confirmed.record.knowledge, "medical");
  assert.equal(confirmed.consequence.kind, "pregnancy-and-succession");
});

test("pregnancy disclosure and completion require a confirmed record and a birth record", () => {
  const initial = defaultPrivateRelationsState();
  const suspected = recordPregnancyEvidence(dayOnePregnancies(), initial, { mother: "Dagmar Red", status: "suspected", dayIndex: 1, evidence: "Infirmary appointment entered." });
  const confirmed = recordPregnancyEvidence(suspected.pregnancies, suspected.state, { mother: "Dagmar Red", status: "confirmed", dayIndex: 2, evidence: "Medical record MED-DAG-02; clinician verified.", medicallyVerified: true });
  assert.equal(confirmed.record.startedDay, 1);
  const noChild = recordPregnancyEvidence(confirmed.pregnancies, confirmed.state, { mother: "Dagmar Red", status: "completed", dayIndex: 4, evidence: "Birth record reference BR-04", medicallyVerified: true });
  assert.equal(noChild.ok, false);
  const olderChild = dayOneChildren().find((child) => child.mother === "Dagmar Red");
  const oldChildResult = recordPregnancyEvidence(confirmed.pregnancies, confirmed.state, { mother: "Dagmar Red", status: "completed", dayIndex: 4, evidence: "An older child was incorrectly offered as this birth.", medicallyVerified: true, birthRecord: { ...olderChild, birthDay: 0 } });
  assert.equal(oldChildResult.ok, false);
  const birthRecord = { id: "CH-dagmar-newborn", name: "Newborn Red", mother: "Dagmar Red", pregnancyId: confirmed.record.id, ageYears: 0, birthDay: 3, status: "living", notes: "Separately recorded birth." };
  const withChild = recordPregnancyEvidence(confirmed.pregnancies, confirmed.state, { mother: "Dagmar Red", status: "completed", dayIndex: 4, evidence: "Medical record MED-DAG-04; birth record BR-03.", medicallyVerified: true, birthRecord });
  assert.equal(withChild.ok, true);
  assert.equal(withChild.record.childRecordId, birthRecord.id);
  assert.equal(withChild.record.startedDay, 1);
  const unrelatedBirth = recordPregnancyEvidence(confirmed.pregnancies, confirmed.state, { mother: "Dagmar Red", status: "completed", dayIndex: 4, evidence: "A same-mother child without this pregnancy link.", medicallyVerified: true, birthRecord: { ...birthRecord, pregnancyId: "PG-unrelated" } });
  assert.equal(unrelatedBirth.ok, false);
});

test("pregnancy status cannot be downgraded after medical confirmation", () => {
  const initial = defaultPrivateRelationsState();
  const suspected = recordPregnancyEvidence([], initial, { mother: "Vera Grotsen", status: "suspected", dayIndex: 10, evidence: "Infirmary test ordered; result pending." });
  const confirmed = recordPregnancyEvidence(suspected.pregnancies, suspected.state, { mother: "Vera Grotsen", status: "confirmed", dayIndex: 11, evidence: "Medical record MED-VERA-11; clinician confirmed.", medicallyVerified: true });
  const downgrade = recordPregnancyEvidence(confirmed.pregnancies, confirmed.state, { mother: "Vera Grotsen", status: "suspected", dayIndex: 12, evidence: "Attempted downgrade to suspicion only." });
  assert.equal(confirmed.ok, true);
  assert.equal(downgrade.ok, false);
  assert.equal(confirmed.pregnancies[0].state, "confirmed");
});

test("dynastic consequence cannot be silently erased and resolution requires a note", () => {
  const breach = recordBoundaryBreach(defaultPrivateRelationsState(), "sigrid-falk", 5, time, "A duty-related retaliation was recorded in the command log.");
  const blocked = acknowledgeDynasticConsequence(breach.state, breach.consequence.id, "resolved", "");
  assert.equal(blocked.ok, false);
  const resolved = acknowledgeDynasticConsequence(breach.state, breach.consequence.id, "resolved", "Independent review completed; duty reassignment recorded.");
  assert.equal(resolved.ok, true);
  assert.equal(resolved.state.consequences[0].status, "resolved");
});

test("new private relationship and medical events append to the causal ledger once", () => {
  const state = defaultPrivateRelationsState();
  const created = createPrivateInteractionRequest(state, "elara-red", "conversation", 2, time);
  const resolved = resolvePrivateInteractionRequest(created.state, created.request.id, "declined", { dayIndex: 2, time });
  const profile = getPlayerWomenCanonProfiles().find((row) => row.id === "elara-red");
  const request = resolved.request;
  assert.equal(recordPrivateRequestEvent(request, profile.category, "23 Ironmonth", "105 AW", "Floor 6").knowledge, "player");
  const row = {
    id: request.eventId, date: "23 Ironmonth", year: "105 AW", time, location: "Floor 6", type: "PRIVATE_RELATIONSHIP",
    actors: ["Christian Red IV", profile.name], cause: "Request outcome", immediate: "Elara declined.", evidence: "Player scene record", knowledge: "player",
  };
  const once = appendLedgerEvents([], row);
  const twice = appendLedgerEvents(once, row);
  assert.equal(once.length, 1);
  assert.equal(twice.length, 1);
});



test("ordinary private conversations do not require employment safeguards", () => {
  const created = createPrivateInteractionRequest(defaultPrivateRelationsState(), "mila", "conversation", 4, time);
  const accepted = resolvePrivateInteractionRequest(created.state, created.request.id, "accepted", {
    dayIndex: 4, time, consentEvidence: "She explicitly agreed to a private conversation.", freeToDeclineConfirmed: true,
  });
  assert.equal(accepted.ok, true);
  assert.equal(accepted.consequence, undefined);
  assert.equal(accepted.state.relationships.find((row) => row.personId === "mila").status, "unestablished");
});

test("power-dependent courtship requires a separate written safeguarding record", () => {
  const created = createPrivateInteractionRequest(defaultPrivateRelationsState(), "elara-red", "courtship", 5, time);
  const withoutProof = resolvePrivateInteractionRequest(created.state, created.request.id, "accepted", {
    dayIndex: 5, time, consentEvidence: "She explicitly asked to pursue courtship.", freeToDeclineConfirmed: true, independentSafeguard: true,
  });
  assert.equal(withoutProof.ok, false);
  const withProof = resolvePrivateInteractionRequest(created.state, created.request.id, "accepted", {
    dayIndex: 5, time, consentEvidence: "She explicitly asked to pursue courtship.", freeToDeclineConfirmed: true,
    independentSafeguard: true, independentSafeguardEvidence: "External command review and anti-retaliation procedure are entered in the duty register.",
  });
  assert.equal(withProof.ok, true);
  assert.equal(withProof.consequence.kind, "conflict-of-interest");
});


test("an accepted proposal remains an engagement until a separately evidenced marriage record", () => {
  const proposal = createPrivateInteractionRequest(defaultPrivateRelationsState(), "elara-red", "marriage-proposal", 11, time);
  const accepted = resolvePrivateInteractionRequest(proposal.state, proposal.request.id, "accepted", {
    dayIndex: 11,
    time,
    consentEvidence: "Elara clearly and freely accepted the proposal in dialogue.",
    freeToDeclineConfirmed: true,
    independentSafeguard: true,
    independentSafeguardEvidence: "An independent officer controls command reviews and anti-retaliation reporting.",
  });
  assert.equal(accepted.ok, true);
  assert.equal(accepted.state.relationships.find((row) => row.personId === "elara-red").status, "engagement-pending");
  const blocked = finalizePrivateMarriage(accepted.state, "elara-red", 12, time, "", "");
  assert.equal(blocked.ok, false);
  const married = finalizePrivateMarriage(
    accepted.state,
    "elara-red",
    12,
    time,
    "Both adults reaffirmed their choice without penalty or command pressure.",
    "Marriage register MR-ELARA-12 and witnessed household ceremony.",
  );
  assert.equal(married.ok, true);
  assert.equal(married.relationship.status, "married");
  assert.equal(married.relationship.visibility, "known");
  assert.equal(married.consequence.kind, "household-review");
  assert.equal(married.event.knowledge, "player");
  const duplicate = finalizePrivateMarriage(married.state, "elara-red", 12, time, "Mutual consent recorded again.", "A second ceremony record reference.");
  assert.equal(duplicate.ok, false);
});

test("an active engagement retains its accepted proposal through the rolling request-history cap", () => {
  const proposal = createPrivateInteractionRequest(defaultPrivateRelationsState(), "elara-red", "marriage-proposal", 1, time);
  const accepted = resolvePrivateInteractionRequest(proposal.state, proposal.request.id, "accepted", {
    dayIndex: 1, time, consentEvidence: "Elara clearly and freely accepted the proposal.", freeToDeclineConfirmed: true,
    independentSafeguard: true, independentSafeguardEvidence: "Independent officer and anti-retaliation route are recorded.",
  });
  let state = accepted.state;
  for (let day = 2; day < 112; day += 1) {
    const conversation = createPrivateInteractionRequest(state, "elara-red", "conversation", day, time);
    const declined = resolvePrivateInteractionRequest(conversation.state, conversation.request.id, "declined", { dayIndex: day, time });
    state = declined.state;
  }
  assert.ok(state.requests.length <= 100);
  assert.ok(state.requests.some((row) => row.id === proposal.request.id && row.status === "accepted"));
  assert.equal(finalizePrivateMarriage(state, "elara-red", 112, time, "Both adults reaffirmed freely.", "Marriage register MR-ELARA-112; witnessed ceremony.").ok, true);
});

test("malformed optional relationship save rows are dropped safely and ineligible statuses stay canonical", () => {
  const base = defaultPrivateRelationsState();
  const normalized = normalizePrivateRelations({
    schemaVersion: 1,
    relationships: [
      { personId: "dagmar-red", status: "unestablished", visibility: "private", note: "tampered" },
      { personId: "elara-red", status: "former-partner", visibility: "private", note: "visibility rollback" },
    ],
    requests: [
      { id: "duplicate-id", personId: "elara-red", kind: "conversation", status: "declined", dayIndex: 1, time },
      { id: "duplicate-id", personId: "mila", kind: "conversation", status: "declined", dayIndex: 1, time },
    ],
    consequences: [
      { id: "bad-row", title: "Malformed", dayIndex: 1, status: "open", kind: "boundary-breach" },
    ],
  });
  assert.equal(normalized.relationships.find((row) => row.personId === "dagmar-red").status, "married");
  assert.equal(normalized.relationships.find((row) => row.personId === "dagmar-red").visibility, "public");
  assert.equal(normalized.relationships.find((row) => row.personId === "elara-red").visibility, "known");
  assert.equal(normalized.requests.length, 1);
  assert.deepEqual(normalized.consequences, []);
  assert.deepEqual(base.consequences, []);
});

test("a public relationship disclosure is evidence-backed and cannot be rolled back", () => {
  const created = createPrivateInteractionRequest(defaultPrivateRelationsState(), "elara-red", "reconciliation", 6, time);
  const accepted = resolvePrivateInteractionRequest(created.state, created.request.id, "accepted", {
    dayIndex: 6, time, consentEvidence: "Elara explicitly chose to resume courtship.", freeToDeclineConfirmed: true,
    independentSafeguard: true, independentSafeguardEvidence: "Independent command review is active and recorded outside her chain of command.",
  });
  assert.equal(accepted.ok, true);
  const disclosure = recordPrivateRelationshipDisclosure(accepted.state, "elara-red", "public", 7, "A public household declaration was delivered before the assembled council.");
  assert.equal(disclosure.ok, true);
  assert.equal(disclosure.state.relationships.find((row) => row.personId === "elara-red").visibility, "public");
  assert.equal(disclosure.consequence.kind, "relationship-disclosure");
  const rollback = recordPrivateRelationshipDisclosure(disclosure.state, "elara-red", "private", 8, "Attempted to hide the already public announcement.");
  assert.equal(rollback.ok, false);
});

test("the account save validator accepts the full default 37-profile relationship roster", () => {
  const collections = [
    "inbox", "news", "worldNews", "cases", "threads", "chronicle", "relations",
    "secretClocks", "calendar", "edicts", "stalkers", "finds", "sorties", "mysteries",
    "foreignReports", "kin", "log", "quickActions", "personalVault", "factionVault",
    "events", "household", "gates", "trades", "radio", "films", "intel", "memories",
    "reputations", "pregnancies", "children",
  ];
  const payload = {
    version: "V4.5 Demo / Update 4.5",
    world: {},
    p4: {},
    rollingSummary: "",
    turnCount: 0,
    ...Object.fromEntries(collections.map((key) => [key, []])),
    privateRelations: defaultPrivateRelationsState(),
  };

  assert.equal(payload.privateRelations.relationships.length, 37);
  assert.doesNotThrow(() => serializeSavePayload(payload));

  const tooMany = {
    ...payload,
    privateRelations: {
      ...payload.privateRelations,
      relationships: Array(65).fill(payload.privateRelations.relationships[0]),
    },
  };
  assert.throws(() => serializeSavePayload(tooMany), /privateRelations\.relationships/);
});

