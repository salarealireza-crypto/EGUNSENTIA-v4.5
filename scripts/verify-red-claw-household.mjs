import fs from "node:fs";
import {
  RED_CLAW_FAMILY_CARDS,
  RED_CLAW_CAST_CARDS,
  getRedClawHouseholdCensus,
  validateRedClawHouseholdRoster,
} from "../src/lib/game/sim/red-claw-household.ts";

const report = validateRedClawHouseholdRoster();
const census = getRedClawHouseholdCensus();
const historical = JSON.parse(fs.readFileSync(new URL("../src/lib/canon/red-claw-historical-household.json", import.meta.url), "utf8"));
const errors = [...report.issues];
if (historical.personnel.length !== 8) errors.push(`Historical staff expected 8; found ${historical.personnel.length}.`);
if (historical.personnel.filter((x) => x.sex === "male").length !== 3) errors.push("Historical male servant count must equal 3.");
if (historical.personnel.filter((x) => x.sex === "female").length !== 5) errors.push("Historical female Iron Guard count must equal 5.");
if (historical.personnel.some((x) => x.sourceStatus !== "PROPOSED_EXPANSION")) errors.push("Historical staff must remain proposed until approved.");
if (RED_CLAW_FAMILY_CARDS.length !== 100 || census.activeCastEntries !== RED_CLAW_CAST_CARDS.length) errors.push("Registry/census mismatch.");
if (RED_CLAW_FAMILY_CARDS.some((x) => x.name === "Elara Red" && x.historicalRelationship)) errors.push("Elara must remain separate from the twelve proposed former-partner dossiers.");

if (errors.length) {
  console.error("RED CLAW HOUSEHOLD VERIFY: FAIL");
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log("RED CLAW HOUSEHOLD VERIFY: PASS");
  console.log(`Cards: ${census.totalCards} (A${census.tiers.A}/B${census.tiers.B}/C${census.tiers.C})`);
  console.log(`Proposed permanent family-linked residents: ${census.proposedPermanentFamilyResidents}; active CAST entries: ${census.activeCastEntries}`);
  console.log(`Historical personnel: 3 male servants + 5 female Iron Guard (all proposed)`);
  console.log(`Former adult partners: ${census.formerAdultPartners} (read-only, no current romantic eligibility)`);
  for (const warning of report.warnings) console.log(`WARN: ${warning}`);
}
