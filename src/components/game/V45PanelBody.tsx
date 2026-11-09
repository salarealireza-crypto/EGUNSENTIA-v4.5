import { useEffect, useMemo, useState, type ReactNode, type CSSProperties } from "react";
import { flushSave } from "@/lib/game/play";
import { Receipt } from "@/components/platform/Receipt";
import { receiptFingerprint as getReceiptFingerprint } from "@/lib/game/receipt-persistence.mjs";
import { clockFromDayIndex } from "@/lib/game/time";
import { eventsForLedgerDay, ledgerDayOptions } from "@/lib/game/sim/event-ledger";
import { BookOpen, ChevronRight, CircleAlert, Gauge, Map, Radio, ScanLine, Settings2, Shield, Sparkles } from "lucide-react";
import { optionsForPanel } from "@/lib/platform/options/lookup";
import { lockReason } from "@/lib/platform/options/execute";
import { auditWorld } from "@/lib/platform/audit";
import { triggerMoment, simulateWeek, decideCouncil, verifyLetter, planItem, banquet, resolveCrisis, pinClue, discoverClue, theorize } from "@/lib/game/p4-simulation";
import { confidenceBand } from "@/lib/game/sim/letters";
import { band, contradictions } from "@/lib/game/sim/investigation";
import { blocWord, diplomaticAssessment } from "@/lib/game/sim/factions";
import { marketBoard, stockOutlook, treatyDiscount, type Good, type MarketDesk } from "@/lib/game/sim/economy";
import { relationWord } from "@/lib/game/sim/banquet";
import { commissionResearch, RESEARCH_PROJECTS } from "@/lib/game/sim/research";
import { councilPositions } from "@/lib/game/sim/council";
import { availabilityLabel, castAbsentees, castNow } from "@/lib/game/presence";
import { fromMin, toMin } from "@/lib/game/sim/core.ts";
import { nextScheduled } from "@/lib/game/sim/planner.ts";
import { getPlayerWomenCanonProfiles, PRIVATE_RELATIONS_ROSTER_GAPS } from "@/lib/game/sim/private-relations.ts";
import { useGame, worldInputsOf } from "@/lib/game/store";
import { getRedClawHouseholdCensus, RED_CLAW_FAMILY_CARDS } from "@/lib/game/sim/red-claw-household.ts";
import { cn } from "@/lib/utils";
import { CopyButton } from "./CopyButton";
import type { PlatformPanel } from "@/lib/platform/registry";

function Accent({ color }: { color: string }) {
  return <span className="inline-block size-2 rounded-full" style={{ background: `var(--color-p-${color})` }} aria-hidden />;
}

function Card({ children, accent = "amber" }: { children: ReactNode; accent?: string }) {
  return <article className="term-card" style={{ "--panel-accent": `var(--color-p-${accent})` } as CSSProperties}>{children}</article>;
}

const gateImage = (gate: string, state: string) => `/art/v45/gate-${gate}-${state}.svg`;

function ResourceStrip() {
  const world = useGame((s) => s.world);
  const vals = [
    ["WATER", world.water.stock, world.water.capacity, "cyan"],
    ["FOOD", world.food.stock, world.food.capacity, "amber"],
    ["ENERGY", world.energy.stock, world.energy.capacity, "green"],
    ["TREASURY", world.treasury.marks, 120000, "yellow"],
  ] as const;
  return <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{vals.map(([name, value, max, color]) => <div key={name} className="rounded-md border border-term/15 bg-black/20 px-3 py-2"><div className="flex items-center justify-between text-[9px] uppercase tracking-[0.16em]"><span>{name}</span><span>{Math.round((Number(value)/Number(max))*100)}%</span></div><div className="mt-2 h-1 overflow-hidden rounded-full bg-term/10"><div className="h-full bg-term" style={{width:`${Math.max(0,Math.min(100,(Number(value)/Number(max))*100))}%`,opacity:.65}} /></div><p className="mt-1 text-[10px] text-term-dim">{Math.round(Number(value)).toLocaleString()}</p></div>)}</div>;
}

function PrivateRelationsBody() {
  const people = useMemo(() => getPlayerWomenCanonProfiles(), []);
  const state = useGame((s) => s.privateRelations);
  const pregnancies = useGame((s) => s.pregnancies);
  const children = useGame((s) => s.children);
  const dayIndex = useGame((s) => s.world.dayIndex);
  const createRequest = useGame((s) => s.createPrivateInteractionRequest);
  const finalizeMarriage = useGame((s) => s.finalizePrivateMarriage);
  const resolveRequest = useGame((s) => s.resolvePrivateInteractionRequest);
  const recordBoundary = useGame((s) => s.recordPrivateBoundaryBreach);
  const recordDisclosure = useGame((s) => s.recordPrivateRelationshipDisclosure);
  const recordPregnancy = useGame((s) => s.recordPrivatePregnancyEvidence);
  const acknowledge = useGame((s) => s.acknowledgeDynasticConsequence);
  const [personId, setPersonId] = useState("elara-red");
  const [kind, setKind] = useState<"conversation" | "courtship" | "reconciliation" | "marriage-proposal">("conversation");
  const [responseNote, setResponseNote] = useState("");
  const [consentEvidence, setConsentEvidence] = useState("");
  const [marriageConsentEvidence, setMarriageConsentEvidence] = useState("");
  const [marriageCeremonyEvidence, setMarriageCeremonyEvidence] = useState("");
  const [freeToDecline, setFreeToDecline] = useState(false);
  const [independentSafeguard, setIndependentSafeguard] = useState(false);
  const [independentSafeguardEvidence, setIndependentSafeguardEvidence] = useState("");
  const [boundaryEvidence, setBoundaryEvidence] = useState("");
  const [disclosureLevel, setDisclosureLevel] = useState<"known" | "public">("known");
  const [disclosureEvidence, setDisclosureEvidence] = useState("");
  const [mother, setMother] = useState("Dagmar Red");
  const [pregnancyStatus, setPregnancyStatus] = useState<"suspected" | "confirmed" | "public" | "monitored" | "completed" | "loss">("suspected");
  const [medicalEvidence, setMedicalEvidence] = useState("");
  const [medicalVerified, setMedicalVerified] = useState(false);
  const [birthRecordId, setBirthRecordId] = useState("");
  const selected = people.find((person) => person.id === personId);
  const selectedIsCanon = selected?.sourceStatus === "CANON";
  const relationshipFor = (id: string) => state.relationships.find((row) => row.personId === id);
  const latestPregnancies = pregnancies.filter((row) => row.mother !== "—");
  const activePregnancy = latestPregnancies.filter((row) => row.mother.toLowerCase() === mother.toLowerCase() && !["inactive", "completed", "loss"].includes(row.state)).at(-1);
  const birthRecordsForMother = children.filter((child) =>
    child.mother.toLowerCase() === mother.toLowerCase()
    && child.pregnancyId === activePregnancy?.id
    && Number.isSafeInteger(child.birthDay)
    && Number.isSafeInteger(activePregnancy?.startedDay)
    && child.birthDay! >= activePregnancy!.startedDay!
    && child.birthDay! <= dayIndex,
  );
  const labelCategory = (category: string) => category.replaceAll("-", " ").toUpperCase();

  return <div className="space-y-2">
    <Card accent="rose">
      <div className="flex items-center justify-between gap-2"><p className="text-sm">Private Relations & Dynastic</p><span className="text-[9px] uppercase tracking-wider">PRIVATE / NON-GRAPHIC</span></div>
      <p className="mt-1 text-[11px]">Adult relationship records, personal boundaries, role conflicts, medical evidence and succession implications. No intimate scene, consent, pregnancy, child, or heir is inferred from rank or relationship status.</p>
      <p className="mt-1 text-[10px] text-term-dim">Current scope: 25 CP9 adult profiles plus 12 proposed former-partner dossiers. The new histories are read-only, non-romantically eligible, and remain marked PROPOSED until approved. Minors are never selectable for adult private interactions.</p>
    </Card>

    <Card accent="violet">
      <p className="text-sm">Record a request</p>
      <p className="mt-1 text-[10px] text-term-dim">This creates a pending request only. The NPC's response must be separately recorded after it occurs in play.</p>
      <label className="mt-2 block text-[9px] uppercase text-term-dim">Adult character</label>
      <select className="mt-1 min-h-10 w-full rounded border border-term/15 bg-black/30 px-2 text-[11px]" value={personId} onChange={(event) => setPersonId(event.target.value)}>{people.map((person) => <option key={person.id} value={person.id}>{person.name} · {person.ageYears}</option>)}</select>
      <label className="mt-2 block text-[9px] uppercase text-term-dim">Request type</label>
      <select className="mt-1 min-h-10 w-full rounded border border-term/15 bg-black/30 px-2 text-[11px]" value={kind} onChange={(event) => setKind(event.target.value as typeof kind)}>
        <option value="conversation">Private conversation</option><option value="courtship">Courtship request</option><option value="reconciliation">Reconciliation request</option><option value="marriage-proposal">Marriage proposal</option>
      </select>
      {selected?.powerReviewRequired ? <p className="mt-2 text-[10px] text-amber-200">Power-difference safeguard required: acceptance cannot be recorded unless refusal is penalty-free and an independent work/command route is in place.</p> : null}
      <button type="button" className="mt-2 min-h-10 rounded border border-term/20 px-3 text-[10px] uppercase disabled:opacity-40" disabled={!selected || (!selected.relationshipEligible && kind !== "conversation")} onClick={() => createRequest(personId, kind)}>Submit request</button>
    </Card>

    <Card accent="rose">
      <p className="text-sm">Pending and recorded responses</p>
      {state.requests.length ? <div className="mt-2 space-y-2">{state.requests.slice().reverse().slice(0, 12).map((request) => <div key={request.id} className="rounded border border-term/10 p-2">
        <div className="flex items-center justify-between gap-2"><p className="text-[11px]">{request.personName} · {request.kind.replaceAll("-", " ")}</p><span className="text-[9px] uppercase">{request.status}</span></div>
        <p className="mt-1 text-[10px] text-term-dim">Day {request.dayIndex + 1} · {request.time} · consent is never assumed.</p>
        {request.status === "pending" ? <div className="mt-2 space-y-2">
          <input className="min-h-9 w-full rounded border border-term/15 bg-black/30 px-2 text-[10px]" placeholder="Record what the NPC said (optional for refusal)" value={responseNote} onChange={(event) => setResponseNote(event.target.value)}/>
          <input className="min-h-9 w-full rounded border border-term/15 bg-black/30 px-2 text-[10px]" placeholder="Specific evidence of freely expressed agreement (acceptance only)" value={consentEvidence} onChange={(event) => setConsentEvidence(event.target.value)}/>
          <label className="flex items-start gap-2 text-[10px]"><input type="checkbox" checked={freeToDecline} onChange={(event) => setFreeToDecline(event.target.checked)}/> Refusal was genuinely possible without punishment or loss.</label>
          {people.find((person) => person.id === request.personId)?.powerReviewRequired && request.kind !== "conversation" ? <><label className="flex items-start gap-2 text-[10px]"><input type="checkbox" checked={independentSafeguard} onChange={(event) => setIndependentSafeguard(event.target.checked)}/> Independent reporting and protection from retaliation are in place.</label><input className="min-h-9 w-full rounded border border-term/15 bg-black/30 px-2 text-[10px]" placeholder="Evidence of independent safeguards (required)" value={independentSafeguardEvidence} onChange={(event) => setIndependentSafeguardEvidence(event.target.value)}/></> : null}
          <div className="flex flex-wrap gap-2"><button type="button" className="min-h-9 rounded border border-term/20 px-2 text-[9px] uppercase disabled:opacity-40" disabled={consentEvidence.trim().length < 12 || !freeToDecline || (Boolean(people.find((person) => person.id === request.personId)?.powerReviewRequired) && request.kind !== "conversation" && (!independentSafeguard || independentSafeguardEvidence.trim().length < 12))} onClick={() => resolveRequest(request.id, "accepted", { note: responseNote, consentEvidence, freeToDeclineConfirmed: freeToDecline, independentSafeguard, independentSafeguardEvidence })}>Record freely given acceptance</button><button type="button" className="min-h-9 rounded border border-term/20 px-2 text-[9px] uppercase" onClick={() => resolveRequest(request.id, "declined", { note: responseNote })}>Record refusal</button><button type="button" className="min-h-9 rounded border border-term/20 px-2 text-[9px] uppercase" onClick={() => resolveRequest(request.id, "withdrawn", { note: responseNote })}>Record withdrawal</button></div>
        </div> : request.responseNote ? <p className="mt-1 text-[10px]">{request.responseNote}</p> : null}
      </div>)}</div> : <p className="mt-2 text-[10px] text-term-dim">No private relationship requests have been recorded.</p>}
    </Card>

    <Card accent="amber">
      <p className="text-sm">Formalize an engagement</p>
      <p className="mt-1 text-[10px] text-term-dim">Only available after a recorded marriage proposal was accepted. Both adults' present consent and an in-world ceremony/legal record must be documented. Marriage does not automatically become public and does not imply pregnancy or an heir.</p>
      <p className="mt-2 text-[10px]">Selected: {selected?.name ?? "—"} · {relationshipFor(personId)?.status ?? "unestablished"}</p>
      <textarea className="mt-2 min-h-14 w-full rounded border border-term/15 bg-black/30 p-2 text-[10px]" placeholder="Mutual adult consent at the time of marriage (12+ characters)" value={marriageConsentEvidence} onChange={(event) => setMarriageConsentEvidence(event.target.value)}/>
      <textarea className="mt-2 min-h-14 w-full rounded border border-term/15 bg-black/30 p-2 text-[10px]" placeholder="Ceremony or legal register reference (12+ characters)" value={marriageCeremonyEvidence} onChange={(event) => setMarriageCeremonyEvidence(event.target.value)}/>
      <button type="button" className="mt-2 min-h-9 rounded border border-term/20 px-3 text-[10px] uppercase disabled:opacity-40" disabled={!selectedIsCanon || relationshipFor(personId)?.status !== "engagement-pending" || marriageConsentEvidence.trim().length < 12 || marriageCeremonyEvidence.trim().length < 12} onClick={() => { finalizeMarriage(personId, marriageConsentEvidence, marriageCeremonyEvidence); setMarriageConsentEvidence(""); setMarriageCeremonyEvidence(""); }}>Record marriage</button>
    </Card>

    <Card accent="cyan">
      <p className="text-sm">Relationship disclosure & social knowledge</p>
      <p className="mt-1 text-[10px] text-term-dim">Move an established relationship from private to household-known or public only when an in-game declaration, witness or reliable report supports it. Knowledge cannot be rolled back.</p>
      <p className="mt-2 text-[10px]">Current record: {selected?.name ?? "—"} · {relationshipFor(personId)?.status ?? "unestablished"} · {relationshipFor(personId)?.visibility ?? "private"}</p>
      <select className="mt-2 min-h-10 w-full rounded border border-term/15 bg-black/30 px-2 text-[11px]" value={disclosureLevel} onChange={(event) => setDisclosureLevel(event.target.value as typeof disclosureLevel)}><option value="known">Known within household</option><option value="public">Publicly acknowledged</option></select>
      <textarea className="mt-2 min-h-16 w-full rounded border border-term/15 bg-black/30 p-2 text-[10px]" placeholder="Witness, declaration or report that establishes the disclosure (12+ characters)" value={disclosureEvidence} onChange={(event) => setDisclosureEvidence(event.target.value)}/>
      <button type="button" className="mt-2 min-h-9 rounded border border-term/20 px-3 text-[10px] uppercase disabled:opacity-40" disabled={!selectedIsCanon || !relationshipFor(personId) || relationshipFor(personId)?.status === "unestablished" || disclosureEvidence.trim().length < 12} onClick={() => { recordDisclosure(personId, disclosureLevel, disclosureEvidence); setDisclosureEvidence(""); }}>Record disclosure</button>
    </Card>

    <Card accent="red">
      <p className="text-sm">Record a boundary breach</p>
      <p className="mt-1 text-[10px] text-term-dim">Use only when an in-game event actually records pressure, retaliation or a boundary violation. This creates a review and reputation consequences; it never creates a relationship.</p>
      <select className="mt-2 min-h-10 w-full rounded border border-term/15 bg-black/30 px-2 text-[11px]" value={personId} onChange={(event) => setPersonId(event.target.value)}>{people.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}</select>
      <textarea className="mt-2 min-h-20 w-full rounded border border-term/15 bg-black/30 p-2 text-[10px]" placeholder="Evidence / scene reference (minimum 12 characters)" value={boundaryEvidence} onChange={(event) => setBoundaryEvidence(event.target.value)}/>
      <button type="button" className="mt-2 min-h-9 rounded border border-red-400/30 px-3 text-[10px] uppercase disabled:opacity-40" disabled={!selectedIsCanon || boundaryEvidence.trim().length < 12} onClick={() => { recordBoundary(personId, boundaryEvidence); setBoundaryEvidence(""); }}>Record incident and review</button>
    </Card>

    <Card accent="amber">
      <p className="text-sm">Pregnancy & dynastic register</p>
      <p className="mt-1 text-[10px] text-term-dim">Pregnancy is never rolled or inferred from a relationship. A suspicion may be recorded with an unverified source; confirmation and later stages require explicit in-world medical verification. A completed pregnancy requires a separate child/birth record.</p>
      <label className="mt-2 block text-[9px] uppercase text-term-dim">Adult character</label>
      <select className="mt-1 min-h-10 w-full rounded border border-term/15 bg-black/30 px-2 text-[11px]" value={mother} onChange={(event) => { setMother(event.target.value); setBirthRecordId(""); }}>{people.filter((person) => person.sourceStatus === "CANON").map((person) => <option key={person.id} value={person.name}>{person.name}</option>)}</select>
      <label className="mt-2 block text-[9px] uppercase text-term-dim">Medical status</label>
      <select className="mt-1 min-h-10 w-full rounded border border-term/15 bg-black/30 px-2 text-[11px]" value={pregnancyStatus} onChange={(event) => setPregnancyStatus(event.target.value as typeof pregnancyStatus)}>{(["suspected", "confirmed", "public", "monitored", "completed", "loss"] as const).map((status) => <option key={status} value={status}>{status.toUpperCase()}</option>)}</select>
      <textarea className="mt-2 min-h-16 w-full rounded border border-term/15 bg-black/30 p-2 text-[10px]" placeholder="Medical source / clinician record ID (minimum 12 characters)" value={medicalEvidence} onChange={(event) => setMedicalEvidence(event.target.value)}/>
      <label className="mt-2 flex items-start gap-2 text-[10px]"><input type="checkbox" checked={medicalVerified} onChange={(event) => setMedicalVerified(event.target.checked)}/> In-world clinician verification is confirmed.</label>
      {pregnancyStatus === "completed" ? <><label className="mt-2 block text-[9px] uppercase text-term-dim">Linked child / birth record</label><select className="mt-1 min-h-10 w-full rounded border border-term/15 bg-black/30 px-2 text-[11px]" value={birthRecordId} onChange={(event) => setBirthRecordId(event.target.value)}><option value="">Select a dated child record</option>{birthRecordsForMother.map((child) => <option key={child.id} value={child.id}>{child.name} · Day {child.birthDay}</option>)}</select><p className="mt-1 text-[9px] text-term-dim">Only a child record with the same mother and a recorded birth day inside this pregnancy record can be linked. Existing older children do not count.</p></> : null}
      <button type="button" className="mt-2 min-h-9 rounded border border-term/20 px-3 text-[10px] uppercase disabled:opacity-40" disabled={medicalEvidence.trim().length < 12 || (pregnancyStatus !== "suspected" && !medicalVerified) || (pregnancyStatus === "completed" && (!birthRecordId || !birthRecordsForMother.some((child) => child.id === birthRecordId)))} onClick={() => recordPregnancy(mother, pregnancyStatus, medicalEvidence, medicalVerified, birthRecordId || undefined)}>Record medical status</button>
      {latestPregnancies.length ? <div className="mt-3 space-y-1">{latestPregnancies.map((record) => <p key={record.id} className="border-t border-term/10 pt-2 text-[10px]">{record.mother} · {record.state.toUpperCase()} · {record.knowledge} · {record.id}</p>)}</div> : <p className="mt-2 text-[10px] text-term-dim">No active pregnancy record is present.</p>}
    </Card>

    <Card accent="violet">
      <p className="text-sm">Dynastic consequences</p>
      <p className="mt-1 text-[10px] text-term-dim">Consequences are review records, not automatic scandal or succession rulings. Each has a source event and remains visible after resolution.</p>
      {state.consequences.length ? <div className="mt-2 space-y-2">{state.consequences.slice(0, 16).map((item) => <div key={item.id} className="rounded border border-term/10 p-2"><div className="flex items-center justify-between gap-2"><p className="text-[11px]">{item.title}</p><span className="text-[9px] uppercase">{item.status}</span></div><p className="mt-1 text-[10px]">{item.detail}</p><p className="mt-1 text-[9px] text-term-dim">Audiences: {item.audiences.join(" · ")} · Day {item.dayIndex + 1}</p><p className="mt-1 text-[9px] text-term-dim">Review: {item.requiredReview}</p>{item.status !== "resolved" ? <div className="mt-2 flex gap-2"><button type="button" className="min-h-8 border border-term/20 px-2 text-[9px] uppercase" onClick={() => acknowledge(item.id, "acknowledged")}>Acknowledge</button><button type="button" className="min-h-8 border border-term/20 px-2 text-[9px] uppercase" onClick={() => acknowledge(item.id, "resolved", "Reviewed and resolved through the recorded in-game decision.")}>Mark reviewed</button></div> : null}</div>)}</div> : <p className="mt-2 text-[10px] text-term-dim">No dynastic consequence has been generated by a recorded event.</p>}
    </Card>

    <Card accent="white">
      <p className="text-sm">Canon character dossiers</p>
      <p className="mt-1 text-[10px] text-term-dim">Appearance and movement details below are copied from the compiled Canon cards. BODY is a non-sexual movement/posture field; absent entries remain UNKNOWN. No anatomical detail is fabricated.</p>
      <div className="mt-2 space-y-2">{people.map((person) => {
        const relation = relationshipFor(person.id);
        return <details key={person.id} className="rounded border border-term/10 p-2"><summary className="cursor-pointer text-[11px]">{person.name} · {person.ageYears} · {labelCategory(person.category)} · {relation?.status ?? person.relationshipStatus}{person.sourceStatus === "PROPOSED_EXPANSION" ? " · PROPOSED" : ""}</summary>
          <p className="mt-2 text-[10px]">{person.role}</p>
          {person.currentSpouse ? <p className="mt-1 text-[10px]">Current spouse: {person.currentSpouse} · children: {person.currentChildren?.join(", ") || "none recorded"}</p> : null}
          {person.historyDisposition ? <p className="mt-1 text-[10px] text-term-dim">Historical knowledge: {person.historyDisposition} · {person.sourceStatus}</p> : null}
          <p className="mt-2 text-[9px] uppercase text-term-dim">Appearance / LOOK</p><p className="mt-1 text-[10px]">{person.appearance}</p>
          <p className="mt-2 text-[9px] uppercase text-term-dim">Movement / BODY</p><p className="mt-1 text-[10px]">{person.bodyMovement}</p>
          <p className="mt-2 text-[9px] uppercase text-term-dim">Voice</p><p className="mt-1 text-[10px]">{person.voice}</p>
          <p className="mt-2 text-[9px] uppercase text-term-dim">Behavioural tells, crisis response and interaction</p><p className="mt-1 whitespace-pre-line text-[10px]">{person.behaviour}</p>
          <p className="mt-2 text-[9px] uppercase text-term-dim">Wants / fears</p><p className="mt-1 text-[10px]">{person.wants} · {person.fears}</p>
          <p className="mt-2 text-[9px] uppercase text-term-dim">Routine / boundaries</p><p className="mt-1 text-[10px]">{person.routine} · {person.boundaries}</p>
          <p className="mt-2 text-[9px] uppercase text-term-dim">Dialogue samples</p><p className="mt-1 text-[10px]">{person.dialogueSamples}</p>
          <p className="mt-2 text-[9px] uppercase text-term-dim">Secrets / knowledge / relationships</p><p className="mt-1 text-[10px]">{person.secrets} · {person.knownInformation} · {person.relationships}</p>
          <p className="mt-2 text-[9px] uppercase text-term-dim">Story hooks</p><p className="mt-1 text-[10px]">{person.hooks}</p>
          <p className="mt-2 text-[9px] text-term-dim">{person.source} · profile {person.completeness} · {person.coverage.present}/{person.coverage.total} Canon fields present{person.coverage.missing.length ? ` · missing: ${person.coverage.missing.join(", ")}` : ""}</p>
        </details>;
      })}</div>
      <p className="mt-3 text-[9px] uppercase text-amber-200">Canon audit gaps</p>{PRIVATE_RELATIONS_ROSTER_GAPS.map((gap) => <p key={gap} className="mt-1 text-[10px] text-term-dim">• {gap}</p>)}
    </Card>
  </div>;
}

function RedClawHouseholdRoster() {
  const census = getRedClawHouseholdCensus();
  const sourceLabels = Object.entries(census.sourceStatus).map(([name, count]) => `${name.replaceAll("_", " ")}: ${count}`);
  return <>
    <Card accent="rose">
      <p className="text-sm">Red Claw Family Registry · {census.totalCards} cards</p>
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {([["Tier A", census.tiers.A], ["Tier B", census.tiers.B], ["Tier C", census.tiers.C], ["Proposed resident entries", census.proposedPermanentFamilyResidents]] as const).map(([label, value]) => <div key={label} className="rounded border border-term/10 p-2"><p className="text-[9px] uppercase text-term-dim">{label}</p><b className="text-lg tabular-nums">{value}</b></div>)}
      </div>
      <p className="mt-2 text-[10px] text-term-dim">Registry snapshot for 20 Ironmonth 105 AW. The 71 resident entries are a proposed named-family roster, not a complete demographic census of Floor 6. Household servants, duty rotations, visitors and unenumerated dependants are excluded. {census.activeCastEntries} living people are included in CAST, including two Grotsen-based relatives.</p>
      <p className="mt-2 text-[9px] text-term-dim">Provenance counts · {sourceLabels.join(" · ")}</p>
    </Card>
    <div className="space-y-2">{RED_CLAW_FAMILY_CARDS.map((person) => <details key={person.id} className="rounded border border-term/10 bg-black/10 p-2">
      <summary className="cursor-pointer text-[11px]">{person.name} · {person.ageLabel} · Tier {person.tier} · {person.sourceStatus.replaceAll("_", " ")}</summary>
      <p className="mt-2 text-[10px]">{person.occupation} · {person.familyBranch} · {person.generation}</p>
      <p className="mt-1 text-[10px]">Residence: {person.residenceStatus} · {person.currentLocation}</p>
      <p className="mt-1 text-[10px]">Parents: {person.parents.length ? person.parents.map((id) => RED_CLAW_FAMILY_CARDS.find((row) => row.id === id)?.name ?? id).join(", ") : "UNKNOWN / not recorded"}</p>
      <p className="mt-1 text-[10px]">Spouse: {person.spouseIds.length ? person.spouseIds.map((id) => RED_CLAW_FAMILY_CARDS.find((row) => row.id === id)?.name ?? id).join(", ") : "UNKNOWN / none recorded"} · Children: {person.childIds.length ? person.childIds.map((id) => RED_CLAW_FAMILY_CARDS.find((row) => row.id === id)?.name ?? id).join(", ") : "none recorded"}</p>
      <p className="mt-1 text-[10px]">Appearance: {person.appearance}</p>
      <p className="mt-1 text-[10px]">Voice / behaviour: {person.voice} · {person.temperament}</p>
      <p className="mt-1 text-[10px]">Recorded relationships: {person.relationships?.trim() || "UNKNOWN / not recorded"}</p>
      <p className="mt-1 text-[9px] text-term-dim">These are source-backed profile notes, not live affection, consent, relationship eligibility or disclosure state.</p>
      <p className="mt-1 text-[10px]">Ambition: {person.ambitions}</p>
      <p className="mt-1 text-[10px]">Knowledge boundary: {person.knowledgeBoundaries}</p>
      <p className="mt-1 text-[10px] text-term-dim">Source: {person.sourceEvidence}</p>
      <ul className="mt-1 list-disc pl-4 text-[10px]">{person.eventHooks.map((hook, index) => <li key={`${person.id}-hook-${index}`}>{hook}</li>)}</ul>
    </details>)}</div>
  </>;
}

function DataCards({ panel }: { panel: PlatformPanel }) {
  const world = useGame((s) => s.world);
  const gates = useGame((s) => s.gates);
  const trades = useGame((s) => s.trades);
  const household = useGame((s) => s.household);
  const finds = useGame((s) => s.finds);
  const events = useGame((s) => s.events);
  const intel = useGame((s) => s.intel);
  const memories = useGame((s) => s.memories);
  const reputations = useGame((s) => s.reputations);
  const films = useGame((s) => s.films);
  const children = useGame((s) => s.children);
  const p4 = useGame((s) => s.p4);

  switch (panel.id) {
    case "18":
      return <div className="space-y-2">{gates.map((g) => <Card key={g.id} accent={g.id === "east" ? "red" : "cyan"}><div className="flex gap-3"><img src={gateImage(g.id,g.visual)} alt={`${g.name} ${g.visual} demo state`} className="h-24 w-40 rounded-md border border-term/10 object-cover" /><div className="min-w-0 flex-1"><div className="flex items-center gap-2 text-sm"><Accent color={g.visual === "normal" ? "green" : "red"} />{g.name}<span className="ml-auto text-[10px] uppercase text-term-dim">{g.visual}</span></div><p className="mt-1 text-[11px] text-term-dim">{g.purpose}</p><p className="mt-2 text-[10px]">Commander {g.commander} · shift {g.shift} · traffic {g.traffic}</p><p className="text-[10px]">threat {g.threat} · ammo {g.ammo} · {g.condition}</p></div></div></Card>)}</div>;
    case "45":
      return <div className="space-y-2"><PriceBoard desk="foreign"/><ProductionLedger goods={["copper wire", "salvageable electronics"]}/>{trades.map((t) => <Card key={t.id} accent="orange"><p className="text-sm">{t.faction} · {t.representative}</p><p className="mt-1 text-[11px] text-term-dim">{t.offered} ↔ {t.wanted}</p><p className="mt-2 text-[11px]">{t.terms}</p><p className="mt-1 text-[10px] uppercase text-term-dim">{t.status} · {t.risk}</p></Card>)}</div>;
    case "54":
      return <div className="space-y-2"><PriceBoard desk="rations"/><ProductionLedger goods={["food", "water", "filters"]}/></div>;
    case "17":
      return <div className="space-y-2"><PrivateRelationsBody/><RedClawHouseholdRoster/><Card accent="rose"><p className="text-sm">Live Household & Kin State</p><p className="mt-1 text-[11px]">These entries remain the campaign save-state view. The separate 100-card registry is provenance-tagged and does not overwrite live affection, mood or relationship state.</p></Card>{household.map((h) => <Card key={h.name} accent="rose"><div className="flex items-center justify-between gap-2"><p className="text-sm">{h.name}</p><span className="text-[10px] uppercase">{h.mood}</span></div><p className="mt-1 text-[11px]">{h.title} · {h.relation}</p><p className="mt-1 text-[10px] text-term-dim">Affection {h.affection}/10 · trend {h.trend} · last contact: {h.lastInteraction}</p><p className="mt-1 text-[11px]">Request: {h.request}</p></Card>)}{children.map((c) => <Card key={c.id} accent="green"><p className="text-sm">{c.name} · age {c.ageYears}</p><p className="mt-1 text-[11px]">{c.notes}</p></Card>)}</div>;
    case "20":
      return <div className="space-y-2"><Card accent="green"><p className="text-sm">Population & Training Ledger</p><p className="mt-1 text-[11px]">Population totals are authoritative census values. Training readiness is represented only by the recorded military and order indices.</p></Card><div className="grid grid-cols-2 gap-2">{Object.entries(world.population).map(([name,value]) => <Card key={name} accent="green"><p className="text-[9px] uppercase text-term-dim">{name.replace(/([A-Z])/g," $1")}</p><b className="text-xl tabular-nums">{value.toLocaleString()}</b></Card>)}</div><Card accent="green"><p className="text-sm">Readiness indicators</p>{["Arms","Order","Morale"].map((key) => <div key={key} className="mt-2 flex items-center justify-between text-[11px]"><span>{key}</span><b>{world.indices[key] ?? "—"}/10</b></div>)}</Card></div>;
    case "21":
      return <div className="space-y-2"><Card accent="cyan"><p className="text-sm">Water, Air & Sanitation</p><p className="mt-1 text-[11px]">The live resource balance is shown below. Air and sanitation are not yet modeled as independent numeric stocks, so no fabricated readings are displayed.</p></Card>{(["water","energy"] as const).map((key) => { const r=world[key]; const net=r.production-r.consumption; return <Card key={key} accent="cyan"><div className="flex items-center justify-between"><p className="text-sm uppercase">{key}</p><b>{Math.round(r.stock).toLocaleString()} {r.unit}</b></div><p className="mt-1 text-[10px] text-term-dim">Capacity {r.capacity.toLocaleString()} · production {r.production.toLocaleString()} · consumption {r.consumption.toLocaleString()} {r.unit}</p><p className="mt-1 text-[11px]">Daily balance: <b>{net>=0?"+":""}{net.toLocaleString()} {r.unit}</b></p><p className="text-[10px] uppercase text-term-dim">Policy: {r.policy}</p></Card>})}<Card accent="cyan"><p className="text-sm">Recorded service indices</p>{Object.entries(world.indices).filter(([k])=>/water|energy|health|air|sanit/i.test(k)).map(([k,v])=><p key={k} className="mt-1 flex justify-between text-[11px]"><span>{k}</span><b>{v}/10</b></p>)}</Card></div>;
    case "52":
      return <div className="space-y-2"><Card accent="violet"><p className="text-sm">Medical Wing Situation</p><p className="mt-1 text-[11px]">This view reports only recorded health-related indicators and absences. A dedicated disease and treatment simulation has not yet been wired.</p></Card><Card accent="violet"><p className="text-[10px] uppercase text-term-dim">Health-related world indices</p>{Object.entries(world.indices).filter(([k])=>/health|medical|morale|fear/i.test(k)).map(([k,v])=><p key={k} className="mt-1 flex justify-between text-[11px]"><span>{k}</span><b>{v}/10</b></p>)}</Card><AbsenteeList/></div>;
    case "55":
      return <div className="space-y-2"><ProductionLedger goods={["rail steel", "machine bearings", "fuel stocks"]}/><Card accent="cyan"><p className="text-sm">Rail Network Operations</p><p className="mt-1 text-[11px]">The northern three-line rail remains the sole external trade route; southern rail is domestic extraction only.</p></Card>{(["rail steel","fuel stocks","machine bearings"] as const).map((good)=><Card key={good} accent="cyan"><div className="flex items-center justify-between"><p className="text-sm capitalize">{good}</p><b>{Math.round(p4.economy?.[good]?.stock ?? 0).toLocaleString()}</b></div><p className="mt-1 text-[10px] text-term-dim">Demand {p4.economy?.[good]?.demand ?? "—"} · production {p4.economy?.[good]?.production ?? "—"}</p></Card>)}<Card accent="cyan"><p className="text-sm">Transport constraints</p><p className="mt-1 text-[11px]">External rail: North Gate / frontier. Domestic extraction: southern line. Gate restrictions and market hazards remain authoritative.</p></Card></div>;
    case "56":
      return <div className="space-y-2"><Card accent="teal"><p className="text-sm">Expedition Situation</p><p className="mt-1 text-[11px]">Surface activity is constrained by the current sortie rotation and gate state. Recovered objects remain subject to quarantine and provenance checks.</p></Card><Card accent="teal"><div className="grid grid-cols-2 gap-2"><div><p className="text-[9px] uppercase text-term-dim">Garrison</p><p className="text-sm">{world.surface.garrison}</p></div><div><p className="text-[9px] uppercase text-term-dim">Sorties</p><p className="text-sm">{world.surface.sorties}</p></div><div><p className="text-[9px] uppercase text-term-dim">Weekly sorties</p><p className="text-sm">{world.surface.weekSorties}/{world.surface.weekLimit}</p></div><div><p className="text-[9px] uppercase text-term-dim">Cleansing</p><p className="text-sm">{world.surface.cleansing}</p></div></div></Card>{Object.entries(p4.sectors).map(([name,sector])=><Card key={name} accent="teal"><div className="flex items-center justify-between"><p className="text-sm capitalize">{name.replace(/-/g," ")}</p><span className="text-[10px] uppercase">{sector.status}</span></div><p className="mt-1 text-[11px]">Pressure {sector.pressure} · signs {sector.signs}</p></Card>)}{finds.slice(0,6).map((f)=><Card key={f.id} accent="yellow"><p className="text-sm">{f.name}</p><p className="mt-1 text-[10px] text-term-dim">{f.kind ?? "find"} · {f.queue} · {f.condition} · radiation {f.radiation}</p><p className="mt-1 text-[11px]">Provenance: {f.foundBy ?? "unrecorded"}</p></Card>)}</div>;
    case "22":
      return <div className="space-y-2"><PriceBoard desk="logistics"/><Card accent="orange"><p className="text-sm">Logistics throughput</p><p className="mt-1 text-[11px]">Route prices are calculated from scarcity, transit, hazard and political pressure. The board does not invent shipment capacity where no route ledger exists.</p><div className="mt-2 grid grid-cols-2 gap-2">{(["rail steel","fuel stocks","machine bearings"] as const).map((good)=><div key={good} className="rounded border border-term/10 p-2"><p className="text-[9px] uppercase text-term-dim">{good}</p><b className="text-sm">{Math.round(p4.economy?.[good]?.stock ?? 0).toLocaleString()}</b><p className="text-[10px] text-term-dim">Demand {p4.economy?.[good]?.demand ?? "—"}</p></div>)}</div></Card></div>;
    case "23":
      return <div className="space-y-2"><Card accent="orange"><p className="text-sm">Military Readiness & Law</p><p className="mt-1 text-[11px]">Equipment figures come from the canonical arms ledger. Personnel readiness is shown only through recorded population and order indices.</p></Card><div className="grid grid-cols-2 gap-2">{([ ["Ready suits",world.arms.suitsReady], ["In repair",world.arms.inRepair], ["Rifles",world.arms.rifles], ["Ammunition",world.arms.ammo], ["Soldiers",world.population.soldiers], ["Order",world.indices.Order ?? "—"] ] as const).map(([label,value])=><Card key={label} accent="orange"><p className="text-[9px] uppercase text-term-dim">{label}</p><b className="text-xl tabular-nums">{typeof value === "number" ? value.toLocaleString() : value}{label === "Order" ? "/10" : ""}</b></Card>)}</div><Card accent="red"><p className="text-sm">Border posts</p>{gates.map((g)=><div key={g.id} className="mt-2 flex items-center justify-between gap-2 border-t border-term/10 pt-2"><div><p className="text-[11px]">{g.name}</p><p className="text-[10px] text-term-dim">{g.commander} · {g.shift}</p></div><span className="text-[10px] uppercase">{g.condition} · {g.threat}</span></div>)}</Card></div>;
    case "25":
      return <div className="space-y-2"><Card accent="rose"><p className="text-sm">Housing & Utilities Ledger</p><p className="mt-1 text-[11px]">The census and utility stocks are authoritative. No apartment occupancy or district capacity is fabricated where the save has no such register.</p></Card><div className="grid grid-cols-2 gap-2">{([ ["Household population",world.population.house], ["Known residents",world.population.known], ["Water stock",world.water.stock], ["Energy stock",world.energy.stock] ] as const).map(([label,value])=><Card key={label} accent="rose"><p className="text-[9px] uppercase text-term-dim">{label}</p><b className="text-xl tabular-nums">{value.toLocaleString()}</b></Card>)}</div>{([ ["Water",world.water], ["Energy",world.energy] ] as const).map(([label,r])=><Card key={label} accent="rose"><div className="flex items-center justify-between"><p className="text-sm">{label}</p><b>{Math.round(r.stock).toLocaleString()} / {r.capacity.toLocaleString()}</b></div><p className="mt-1 text-[10px] text-term-dim">Production {r.production.toLocaleString()} · consumption {r.consumption.toLocaleString()} · policy {r.policy}</p></Card>)}</div>;
    case "33":
    case "38":
      return <div className="space-y-2">{household.map((h) => <Card key={h.name} accent="rose"><p className="text-sm">{h.name} · {h.title}</p><p className="mt-1 text-[11px]">Mood: {h.mood} · schedule: {h.tonight}</p><p className="mt-1 text-[11px] text-term-dim">Concern: {h.concern}</p></Card>)}</div>;
    case "35":
      return <div className="space-y-2">{finds.map((f) => <Card key={f.id} accent="yellow"><p className="text-sm">{f.name}</p><p className="mt-1 text-[10px] text-term-dim">{f.queue} · {f.condition} · radiation {f.radiation}</p><p className="mt-1 text-[11px]">Provenance: {f.foundBy ?? "unknown field team"}</p></Card>)}</div>;
    case "44":
    case "09":
      return <div className="space-y-2">{events.slice(0,8).map((e) => <Card key={e.id} accent="orange"><p className="text-sm">{e.id} · {e.type}</p><p className="mt-1 text-[11px]">{e.immediate}</p><p className="mt-1 text-[10px] text-term-dim">{e.date} · {e.time} · {e.location}</p></Card>)}</div>;
    case "47":
      return <div className="space-y-2">{finds.slice(0,4).map((f) => <Card key={f.id} accent="cyan"><p className="text-sm">{f.id} · {f.name}</p><p className="mt-1 text-[11px]">Origin trace: {f.foundBy ?? "field team, unlogged"}</p><p className="text-[10px] text-term-dim">Acquisition: {f.queue}</p></Card>)}</div>;
    case "48":
      return <div className="space-y-2">{memories.slice(0,8).map((m,i) => <Card key={`${m.npc}-${i}`} accent="rose"><p className="text-sm">{m.npc}</p><p className="mt-1 text-[11px]">{m.event}</p><p className="mt-1 text-[10px] text-term-dim">{m.date} · {m.certainty}</p></Card>)}</div>;
    case "49":
      return <div className="space-y-2">{reputations.map((r,i) => <Card key={`${r.audience}-${i}`} accent="amber"><div className="flex items-center justify-between"><p className="text-sm">{r.audience}</p><span className="text-xl">{r.standing}/10</span></div><p className="mt-1 text-[10px] text-term-dim">{r.note}</p></Card>)}</div>;
    case "43":
      return <div className="grid gap-2 sm:grid-cols-2">{films.map((f) => <Card key={f.id} accent="violet"><p className="text-sm">{f.title}</p><p className="mt-1 text-[10px] text-term-dim">{f.era} · {f.condition}</p><p className="mt-1 text-[11px]">{f.summary}</p></Card>)}</div>;
    case "01":
      return <MessagesBody/>;
    case "26":
    case "36":
      return <CastRoster/>;
    case "53":
      return <div className="space-y-2">{children.map((c) => <Card key={c.id} accent="green"><p className="text-sm">{c.name} · age {c.ageYears}</p><p className="mt-1 text-[11px]">{c.notes}</p></Card>)}</div>;
    case "57":
      return <div className="grid gap-2 sm:grid-cols-2">{["Haragi-Jalea","Hezur-Zuria","Odol-Beltza","Harri-Gizona","Azken-Gizona"].map((n,i)=><Card key={n} accent={i===4?"red":"yellow"}><p className="text-sm">{n}</p><p className="mt-1 text-[11px]">{i===4?"UNKNOWN — unresolved in canon.":"Evidence plate; non-gory."}</p></Card>)}</div>;
    case "14":
      return <ResearchBody/>;
    case "06":
      return <><ResourceStrip/><Card accent="white"><p className="text-sm">Canon resource rule</p><p className="mt-1 text-[11px]">Raw stock is authoritative; indices derive from underlying state rather than replacing it.</p></Card></>;
    case "13":
      return <div className="space-y-2">{intel.map((x)=><Card key={x.id} accent="red"><div className="flex items-center gap-2"><Shield className="size-4"/ ><p className="text-sm">{x.title}</p><span className="ml-auto text-[9px] uppercase">{x.confidence}</span></div><p className="mt-1 text-[11px]">{x.fact}</p><p className="mt-1 text-[10px] text-term-dim">source: {x.sourceType} · interpretation: {x.interpretation}</p></Card>)}</div>;
    case "10":
      return <Card accent="cyan"><div className="flex items-center gap-2"><Map className="size-4"/><p className="text-sm">42-tunnel accounting</p></div><p className="mt-1 text-[11px]">15 lost lines + 27 active tracked routes. Lost-line discovery stays expedition-bound.</p></Card>;
    case "03":
      return <div className="space-y-2">{useGame.getState().worldNews.map((n)=><Card key={n.id} accent="cyan"><p className="text-sm">{n.headline}</p><p className="mt-1 text-[10px] text-term-dim">{n.tag} · {n.reliability} · {n.source}</p><p className="mt-1 text-[11px]">{n.body}</p><CopyButton text={`${n.headline}\n${n.tag} · ${n.reliability} · ${n.source}\n${n.body}`} /></Card>)}</div>;
    case "02":
      return <div className="space-y-2">{useGame.getState().news.slice(0,8).map((n)=><Card key={n.id} accent="green"><p className="text-sm">{n.source}</p><p className="mt-1 text-[11px]">{n.body}</p><p className="mt-1 text-[10px] text-term-dim">{n.tag} · {n.reliability}</p><CopyButton text={`${n.source}\n${n.body}\n${n.tag} · ${n.reliability}`} /></Card>)}</div>;
    case "63":
      return <SettingsBody/>;
    default:
      return <DefaultPanelContent panel={panel}/>;
  }
}


function ResearchBody() {
  const p4 = useGame((s) => s.p4);
  const patch = useGame((s) => s.applyP4);
  const economy = p4.economy;
  const commissioned = RESEARCH_PROJECTS.filter((project) => p4.flags?.[`research:${project.id}`]);
  const completed = RESEARCH_PROJECTS.filter((project) => p4.researchProjects?.[project.id]?.status === "completed");
  const commission = (projectId: string) => {
    const result = commissionResearch(p4, projectId);
    if (result.ok) patch(result.state);
  };
  return <div className="space-y-2">
    <Card accent="cyan"><p className="text-sm">Engineering & Research Workshop</p><p className="mt-1 text-[11px]">Commissioning reserves materials and records an R&D allotment. It does not claim a project is completed; technical review and field validation remain future work.</p><div className="mt-2 grid grid-cols-3 gap-2 text-[10px]"><div className="rounded border border-term/10 p-2">COMMISSIONED<br/><b className="text-lg">{commissioned.length}</b></div><div className="rounded border border-term/10 p-2">COMPLETED<br/><b className="text-lg">{completed.length}</b></div><div className="rounded border border-term/10 p-2">R&D ALLOTMENT<br/><b className="text-lg">{(p4.spent?.marks ?? 0).toLocaleString()} marks</b></div></div></Card>
    {RESEARCH_PROJECTS.map((project) => {
      const done = !!p4.flags?.[`research:${project.id}`];
      const progress = p4.researchProjects?.[project.id];
      const available = !!economy && project.materials.every(([good, amount]) => (economy[good]?.stock ?? 0) >= amount);
      return <Card key={project.id} accent={done ? "green" : "cyan"}>
        <div className="flex items-center justify-between gap-2"><p className="text-sm">{project.title}</p><span className="text-[9px] uppercase">{progress?.status === "completed" ? "Completed" : progress ? `In progress · ${progress.progress}%` : done ? "Commissioned" : "Proposed"}</span></div>
        <p className="mt-1 text-[11px] text-term-dim">{project.summary}</p>
        <p className="mt-2 text-[10px] uppercase">Budget: {project.cost} marks · Duration: {project.durationDays} days</p>{progress && <div className="mt-2"><div className="h-1.5 overflow-hidden rounded bg-term/10"><div className="h-full bg-cyan-400" style={{ width: `${progress.progress}%` }}/></div><p className="mt-1 text-[10px] text-term-dim">{progress.status === "completed" ? `Completed on day ${progress.completedDay}. Production improved: +${project.reward.production} ${project.reward.good}/day.` : `Day ${p4.now?.day ?? 0} · target day ${progress.dueDay}`}</p></div>}
        <div className="mt-1 grid grid-cols-2 gap-1">{project.materials.map(([good, amount]) => <p key={good} className="rounded border border-term/10 px-2 py-1 text-[10px]">{good}: {Math.round(economy?.[good]?.stock ?? 0)} / {amount}</p>)}</div>
        <button type="button" disabled={done || !available} className="mt-2 min-h-10 rounded border border-term/20 px-3 text-[10px] uppercase disabled:opacity-40" onClick={() => commission(project.id)}>{done ? (progress?.status === "completed" ? "Project completed" : "Materials reserved") : available ? "Commission project" : "Insufficient reserves"}</button>
      </Card>;
    })}
    {commissioned.length > 0 && <Card accent="green"><p className="text-sm">Commission register</p>{commissioned.map((project) => { const status = p4.researchProjects?.[project.id]; return <p key={project.id} className="mt-1 text-[11px]">{project.title} — {status?.status === "completed" ? `completed (day ${status.completedDay})` : `${status?.progress ?? 0}% · due day ${status?.dueDay ?? "—"}`}</p>; })}</Card>}
  </div>;
}

function ProductionLedger({ goods }: { goods: Good[] }) {
  const economy = useGame((s) => s.p4.economy);
  if (!economy) return <Card accent="amber"><p className="text-[11px]">Production ledger unavailable.</p></Card>;
  const labels = { critical: "Critical reserve", strained: "Strained reserve", stable: "Stable reserve" } as const;
  return <Card accent="cyan"><p className="text-sm">Stock & production outlook</p><p className="mt-1 text-[10px] text-term-dim">Projected from current stock, demand and production; not a guaranteed future shipment.</p>{goods.map((good) => {
    const row = stockOutlook(economy, good);
    return <div key={good} className="mt-2 border-t border-term/10 pt-2"><div className="flex items-center justify-between gap-2"><span className="text-[11px] capitalize">{good}</span><span className="text-[9px] uppercase">{labels[row.status]}</span></div><div className="mt-1 grid grid-cols-3 gap-2 text-[10px]"><span>Stock <b>{Math.round(row.stock).toLocaleString()}</b></span><span>Net/day <b>{row.dailyBalance > 0 ? "+" : ""}{row.dailyBalance.toFixed(1)}</b></span><span>Cover <b>{row.daysOfCover === null ? "—" : `${row.daysOfCover.toFixed(1)}d`}</b></span></div></div>;
  })}</Card>;
}

function PriceBoard({ desk }: { desk: MarketDesk }) {
  const economy = useGame((s) => s.p4.economy);
  const factions = useGame((s) => s.p4.factions);
  const rows = useMemo(() => (economy ? marketBoard(economy, desk, treatyDiscount(factions.map((f) => f.treaty))) : []), [economy, factions, desk]);
  const title = desk === "rations" ? "Ration prices" : desk === "logistics" ? "Route prices" : "Foreign prices";
  return <div className="space-y-2"><Card accent="orange"><p className="text-sm">{title}</p><p className="mt-1 text-[11px]">One price per good. Tags name the pressure: scarcity, transit, hazard, political.</p></Card>{rows.map((r) => <Card key={r.good} accent="orange"><div className="flex items-center justify-between gap-2"><p className="text-sm capitalize">{r.good}</p><b>{r.price}</b></div><p className="mt-1 text-[10px] uppercase text-term-dim">{r.factors.length ? r.factors.join(" · ") : "steady"}</p></Card>)}</div>;
}

function FactionDesk() {
  const p4 = useGame((s) => s.p4);
  const reports = p4.reports ?? [];
  return <div className="space-y-2"><Card accent="cyan"><p className="text-sm">Faction diplomacy & intelligence</p><p className="mt-1 text-[11px]">Assessments combine recorded standing, treaty status and the latest political signals. They describe risk; they do not force diplomatic outcomes.</p></Card>{p4.factions.map((f) => {
    const rep = reports.filter((r) => r.faction === f.id);
    const assessment = diplomaticAssessment(f, p4.relations?.[f.id] ?? 0);
    return <Card key={f.id} accent={assessment.risk === "high" ? "red" : assessment.risk === "guarded" ? "amber" : "cyan"}>
      <div className="flex items-center justify-between gap-2"><p className="text-sm">{f.id}</p><span className="text-[10px] uppercase">{f.treaty && f.treaty !== "none" ? f.treaty : "no treaty"}</span></div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-[10px]"><div className="rounded border border-term/10 p-2"><span className="text-term-dim">STANDING</span><p className="mt-1 text-[11px] uppercase">{assessment.standing}</p></div><div className="rounded border border-term/10 p-2"><span className="text-term-dim">ESCALATION RISK</span><p className="mt-1 text-[11px] uppercase">{assessment.risk}</p></div><div className="rounded border border-term/10 p-2"><span className="text-term-dim">NEGOTIATING LEVERAGE</span><p className="mt-1 text-[11px] uppercase">{assessment.leverage}</p></div><div className="rounded border border-term/10 p-2"><span className="text-term-dim">POLITICAL PRESSURE</span><p className="mt-1 text-[11px] uppercase">{assessment.pressure}</p></div></div>
      <p className="mt-2 text-[11px]">{assessment.summary}</p><p className="mt-2 text-[11px]">Internal blocs: {blocWord(f.blocs)} · Dependencies: {(f.dependsOn ?? []).join(", ") || "none recorded"}</p><p className="mt-1 text-[10px] text-term-dim">Agenda: {f.agenda}</p>
      {rep.map((r) => <p key={`${r.credibility}-${r.text}`} className="mt-2 text-[11px]"><span className="text-[10px] uppercase">{r.credibility}</span> — {r.text}</p>)}{!rep.length && <p className="mt-2 text-[10px] text-term-dim">No report this week.</p>}
    </Card>;
  })}</div>;
}

function CastRoster() {
  const p4 = useGame((s) => s.p4);
  const world = useGame((s) => s.world);
  const rows = useMemo(() => castNow(p4, world.dayIndex, world.clock.time), [p4, world.dayIndex, world.clock.time]);
  return <div className="space-y-2"><Card accent="rose"><p className="text-sm">Where they are</p><p className="mt-1 text-[11px]">Place, activity and whether they can be reached. Private measures stay off this board.</p></Card>{rows.map((n) => <Card key={n.name} accent={n.available ? "green" : "amber"}><div className="flex items-center justify-between gap-2"><p className="text-sm">{n.name}</p><span className="text-[10px] uppercase">{availabilityLabel(n)}</span></div><p className="mt-1 text-[11px]">{n.place}</p><p className="mt-1 text-[10px] text-term-dim">{n.activity}</p></Card>)}</div>;
}

function AbsenteeList() {
  const p4 = useGame((s) => s.p4);
  const world = useGame((s) => s.world);
  const gone = useMemo(() => castAbsentees(p4, world.dayIndex, world.clock.time), [p4, world.dayIndex, world.clock.time]);
  if (!gone.length) return <Card accent="green"><p className="text-sm">No absentees</p><p className="mt-1 text-[11px]">Nobody is posted as ill or out on an errand.</p></Card>;
  return <div className="space-y-2">{gone.map((n) => <Card key={n.name} accent={n.reason === "illness" ? "red" : "amber"}><p className="text-sm">{n.name}</p><p className="mt-1 text-[11px]">{n.reason === "illness" ? "Ill" : "On errand"} · {n.place}</p><p className="mt-1 text-[10px] text-term-dim">{n.activity}</p></Card>)}</div>;
}

function EveningHallPresence() {
  const p4 = useGame((s) => s.p4);
  const world = useGame((s) => s.world);
  const rows = useMemo(
    () => castNow(p4, world.dayIndex, world.clock.time).filter((row) => /evening hall/i.test(`${row.place} ${row.activity}`)),
    [p4, world.dayIndex, world.clock.time],
  );
  return <Card accent="violet"><p className="text-sm">Evening Hall — live attendance</p><p className="mt-1 text-[10px] text-term-dim">World time {world.clock.time}. Attendance is derived from the shared CAST schedule, illness and errand records; no unrecorded guest is inferred.</p>{rows.length ? rows.map((row) => <div key={row.name} className="mt-2 border-t border-term/10 pt-2"><div className="flex items-center justify-between gap-2"><p className="text-[11px]">{row.name}</p><span className="text-[9px] uppercase">{availabilityLabel(row)}</span></div><p className="mt-1 text-[10px] text-term-dim">{row.place} · {row.activity}</p></div>) : <p className="mt-2 text-[11px]">No CAST entry currently places a named character in the Evening Hall.</p>}</Card>;
}

function MessagesBody() {
  const inbox = useGame((s) => s.inbox);
  const p4 = useGame((s) => s.p4);
  const world = useGame((s) => s.world);
  const presence = useMemo(() => castNow(p4, world.dayIndex, world.clock.time), [p4, world.dayIndex, world.clock.time]);
  return <div className="space-y-2"><p className="text-[10px] uppercase tracking-[0.16em] text-term-dim">Absentees</p><AbsenteeList/>{inbox.slice(0, 8).map((m) => {
    const sender = presence.find((row) => row.name.trim().toLocaleLowerCase() === m.from.trim().toLocaleLowerCase());
    return <Card key={m.id} accent="amber"><p className="text-sm">{m.from}</p><p className="mt-1 text-[10px] text-term-dim">{m.office} · {m.time} · {m.status}</p>{sender ? <p className="mt-1 text-[10px] text-term-dim">Current presence: {availabilityLabel(sender)} · {sender.place} · {sender.activity}</p> : <p className="mt-1 text-[10px] text-term-dim">Current presence: no matching CAST record; message origin is not treated as a live location.</p>}<p className="mt-1 text-[11px]">{m.body}</p><CopyButton text={`${m.from}\n${m.office} · ${m.time} · ${m.status}\n${m.body}`} /></Card>;
  })}</div>;
}

function SettingsBody(){
  const p4=useGame((s)=>s.p4);
  const setV45Setting=useGame((s)=>s.setV45Setting);
  return <div className="space-y-2">
    <Card accent="white"><div className="flex items-center gap-2"><Settings2 className="size-4"/><p className="text-sm">Demo configuration</p></div><p className="mt-1 text-[10px] text-term-dim">Modules are UI toggles in this demo. Disabling a module never deletes stored state.</p></Card>
    {([
      ["runtimeArt",p4.settings.runtimeArt,"Runtime art"],["tts",p4.settings.tts,"xAI TTS narration"],["reducedMotion",p4.settings.reducedMotion,"Reduced motion"],["highContrast",p4.settings.highContrast,"High contrast"]
    ] as [keyof typeof p4.settings,boolean,string][]).map(([key,value,label])=><button key={String(key)} type="button" className="flex min-h-11 w-full items-center justify-between rounded-md border border-term/10 px-3 text-left" onClick={()=>setV45Setting(key,!value)}><span>{label}</span><span className="text-[10px] uppercase">{value?"ON":"OFF"}</span></button>)}
    <div className="flex flex-wrap gap-2 pt-1">{(["Story","Steward","Hard Winter"] as const).map((a)=><button key={a} type="button" className={cn("min-h-10 px-3 text-[10px] uppercase",p4.settings.assist===a&&"bg-term text-term-bg")} onClick={()=>setV45Setting("assist",a)}>{a}</button>)}</div>
  </div>;
}

function DefaultPanelContent({ panel }: {panel: PlatformPanel}) {
  const p4=useGame((s)=>s.p4);
  const world=useGame((s)=>s.world);
  if(panel.id==="24") return <CouncilBody/>;
  if(panel.id==="33") return <PastimeBody/>;
  if(panel.id==="19") return <InvestigationBody/>;
  if(panel.id==="59") return <BanquetBody/>;
  if(panel.id==="16") return <LettersBody/>;
  if(panel.id==="12") return <PlannerBody/>;
  if(panel.id==="46") return <WorldTimeBody/>;
  if(panel.id==="64") return <MomentsBody/>;
  if(panel.id==="57") return <CrisisBody/>;
  if(panel.id==="29") return <AuditBody/>;
  return <div className="space-y-2"><Card accent={panel.accent}><div className="flex items-center gap-2"><Sparkles className="size-4"/><p className="text-sm">{panel.title}</p></div><p className="mt-1 text-[11px]">This cumulative V4.5 demo exposes the panel through the shared Command Deck shell, live state, option catalog and audit trail.</p><div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4"><div className="rounded border border-term/10 p-2"><p className="text-[9px] uppercase">Day</p><b>{world.dayIndex+1}</b></div><div className="rounded border border-term/10 p-2"><p className="text-[9px] uppercase">Hour</p><b>{world.clock.time}</b></div><div className="rounded border border-term/10 p-2"><p className="text-[9px] uppercase">Options</p><b>{optionsForPanel(panel.id).length}</b></div><div className="rounded border border-term/10 p-2"><p className="text-[9px] uppercase">Sim week</p><b>{p4.week}</b></div></div></Card><Card accent={panel.accent}><p className="text-[10px] uppercase text-term-dim">Data view</p><p className="mt-1 text-[11px]">Use the Options tab for deterministic demo actions. Records write through the cumulative ledger.</p></Card></div>;
}

function CouncilBody() {
  const p4 = useGame((state) => state.p4);
  const receiptPersistence = useGame((state) => state.receiptPersistence);
  const patch = useGame((state) => state.applyP4);
  const stamp = useGame((state) => state.stampDecree);
  const worldState = useGame((state) => state.world);
  const gates = useGame((state) => state.gates);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const receiptKey = useMemo(() => getReceiptFingerprint(p4.lastReceipt), [p4.lastReceipt]);

  useEffect(() => {
    setReceiptOpen(Boolean(receiptKey) && p4.lastReceipt?.optionId === "24-OPT-02");
  }, [receiptKey, p4.lastReceipt?.optionId]);
  const world = useMemo(() => worldInputsOf({ world: worldState, gates }), [worldState, gates]);
  const seats = useMemo(() => councilPositions(world), [world]);
  const decree = optionsForPanel("24").find((option) => option.id === "24-OPT-02");
  const cost = decree?.costs.marks ?? 0;
  const campaignMinute = toMin(worldState.clock.time) ?? -1;
  const alreadyStamped = campaignMinute >= 0 && (p4.appliedCouncilCommandIds ?? []).includes(
    `council-decree:${decree?.id ?? "24-OPT-02"}:${worldState.dayIndex}:${campaignMinute}`,
  );
  const lock = decree
    ? lockReason(decree, p4, worldState, { allowCouncilDecree: true })
    : "The authoritative Council decree is missing from the catalog.";
  const canStamp = Boolean(decree) && !lock && !alreadyStamped;

  const stampAndPersist = async (seatId: string) => {
    const beforeTurnCount = useGame.getState().turnCount;
    stamp(seatId);
    const applied = useGame.getState();
    if (applied.turnCount === beforeTurnCount || applied.p4.lastReceipt?.optionId !== "24-OPT-02") return;

    useGame.getState().setReceiptPersistence("pending");
    setReceiptOpen(true);
    applied.setNotice("Decree applied locally. Waiting for account-save confirmation.");
    const outcome = await flushSave();
    if (outcome.status === "committed" || (outcome.status === "unchanged" && outcome.storage === "persistent")) {
      useGame.getState().setReceiptPersistence("account-committed");
      useGame.getState().setNotice("Decree committed to persistent account storage.");
    } else if (outcome.status === "ephemeral" || (outcome.status === "unchanged" && outcome.storage === "ephemeral")) {
      useGame.getState().setReceiptPersistence("ephemeral");
      useGame.getState().setNotice("Decree saved in the local preview database only; it will not survive a server restart.");
    } else {
      useGame.getState().setReceiptPersistence("device-only");
      if (outcome.status === "superseded") {
        useGame.getState().setNotice("A newer campaign snapshot superseded this save attempt. Account persistence is not yet confirmed.");
      } else if (outcome.status === "blocked") {
        useGame.getState().setNotice("The account save is blocked or a version conflict remains unresolved. The device copy remains available; no persistent confirmation was recorded.");
      } else if (outcome.status === "failed" || (outcome.status === "unchanged" && outcome.storage === null)) {
        useGame.getState().setNotice("The decree remains on this device, but account persistence could not be confirmed.");
      }
    }
  };

  return (
    <div className="space-y-2">
      <Card accent="amber">
        <p className="text-sm">Nine-Ministry Council</p>
        <p className="mt-1 text-[11px]">Each minister argues from the ministry's own mandate. Only one copy of this decree can be stamped per campaign minute, regardless of the sponsoring seat.</p>
        <p className="mt-2 text-[10px] uppercase">Decree cost · {cost} marks · Available · {worldState.treasury.marks} marks · Work · {decree?.costs.hours ?? 0} hours</p>
        {decree?.costs.politicalCapital ? (
          <p className="mt-1 text-[10px] text-amber-200">Political Capital cost ({decree.costs.politicalCapital}) is listed but cannot be deducted: no authoritative balance or ledger exists.</p>
        ) : null}
        {alreadyStamped ? <p className="mt-1 text-[10px] text-amber-200">This decree has already been stamped during the current campaign minute.</p> : lock ? <p className="mt-1 text-[10px] text-amber-200">{lock}</p> : null}
      </Card>
      {receiptOpen && p4.lastReceipt?.optionId === "24-OPT-02" ? (
        <Receipt slip={p4.lastReceipt} persistence={receiptPersistence} onDismiss={() => setReceiptOpen(false)} />
      ) : null}
      {seats.map((seat) => (
        <Card key={seat.id} accent="amber">
          <div className="flex items-center justify-between">
            <p className="text-sm">{seat.ministry}</p>
            <span className="text-[10px] uppercase">{seat.stance < 0 ? "dissent" : seat.stance > 0 ? "support" : "mixed"}</span>
          </div>
          <p className="mt-1 text-[11px]">{seat.position}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            <button type="button" className="min-h-9 px-2 text-[10px] uppercase" onClick={() => patch(decideCouncil(p4, seat.id, world))}>Hear</button>
            <button type="button" className="min-h-9 px-2 text-[10px] uppercase" onClick={() => patch(decideCouncil(p4, `${seat.id}-delegate`, world))}>Delegate</button>
            <button type="button" disabled={!canStamp} className="min-h-9 px-2 text-[10px] uppercase disabled:cursor-not-allowed disabled:opacity-40" onClick={() => void stampAndPersist(seat.id)}>Decree</button>
          </div>
        </Card>
      ))}
    </div>
  );
}

function PastimeBody(){ const p4=useGame(s=>s.p4); const patch=useGame(s=>s.applyP4); const games=["Latch Stories","Ledger-and-Lamp","The Map Game","Dice and Thread","Reading Lesson","Archive Tea","Wall Songs"]; return <div className="space-y-2">{games.map((g,i)=><Card key={g} accent={i<4?"amber":"violet"}><p className="text-sm">{g}</p><p className="mt-1 text-[11px]">Optional micro-scene. It creates texture and memory, not a new rule.</p><button type="button" className="mt-2 min-h-9 px-2 text-[10px] uppercase" onClick={()=>patch({...p4,log:[`Pastime played: ${g}`,...p4.log]})}>Play</button></Card>)}</div> }
function InvestigationBody(){
  const p4 = useGame((s) => s.p4);
  const patch = useGame((s) => s.applyP4);
  const createCase = useGame((s) => s.createInvestigationCase);
  const linkClue = useGame((s) => s.linkInvestigationClue);
  const addNote = useGame((s) => s.addInvestigationNote);
  const setCaseStatus = useGame((s) => s.setInvestigationCaseStatus);
  const dayIndex = useGame((s) => s.world.dayIndex);
  const clashes = contradictions(p4.clues, p4.boardPins);
  const [caseTitle, setCaseTitle] = useState("");
  const [caseKind, setCaseKind] = useState<"general" | "missing-person-inquiry">("general");
  const [subjectName, setSubjectName] = useState("");
  const [sourceReference, setSourceReference] = useState("");
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const [archiveDrafts, setArchiveDrafts] = useState<Record<string, string>>({});
  const label = (id: string) => p4.clues.find((clue) => clue.id === id)?.label ?? id;
  const theoryNote = p4.log.find((line) => /THEORY|theory|contradict|supporting source|Pin the clue|holds it as it stands/i.test(line));
  const caseFiles = p4.investigationCases ?? [];
  return <div className="space-y-2">
    <Card accent="magenta"><div className="flex items-center gap-2"><ScanLine className="size-4"/><p className="text-sm">Evidence board</p></div><p className="mt-1 text-[11px]">Known, observed, theory, rumor and unknown remain separate. Linking evidence to a case never upgrades its classification or solves a mystery.</p></Card>
    <Card accent="magenta"><p className="text-sm">Contradictions</p>{clashes.length ? clashes.map(([a,b])=><p key={`${a}-${b}`} className="mt-1 text-[11px]">{label(a)} contradicts {label(b)}</p>) : <p className="mt-1 text-[11px]">None of the pinned leads contradict each other.</p>}</Card>
    {theoryNote ? <Card accent="magenta"><p className="text-[10px] uppercase">Theory note</p><p className="mt-1 text-[11px]">{theoryNote}</p></Card> : null}
    <Card accent="magenta"><p className="text-sm">Investigation register</p><p className="mt-1 text-[11px]">Case files organize known records and player notes. Archiving is administrative only; it does not mean the underlying mystery has been solved.</p><label className="mt-2 block text-[9px] uppercase text-term-dim">Case type<select aria-label="Investigation case type" className="mt-1 w-full rounded border border-term/20 bg-black/30 px-2 py-2 text-[11px]" value={caseKind} onChange={(event)=>setCaseKind(event.target.value as "general" | "missing-person-inquiry")}><option value="general">General investigation</option><option value="missing-person-inquiry">Missing-person inquiry (unverified)</option></select></label><input aria-label="New investigation title" className="mt-2 w-full rounded border border-term/20 bg-black/30 px-2 py-2 text-[11px]" value={caseTitle} onChange={(event)=>setCaseTitle(event.target.value)} placeholder="Case title (optional for missing-person inquiry)" maxLength={100}/>{caseKind === "missing-person-inquiry" ? <><input aria-label="Subject name from source record" className="mt-2 w-full rounded border border-term/20 bg-black/30 px-2 py-2 text-[11px]" value={subjectName} onChange={(event)=>setSubjectName(event.target.value)} placeholder="Person name exactly as recorded" maxLength={100}/><textarea aria-label="Unverified source reference" className="mt-2 min-h-14 w-full rounded border border-term/20 bg-black/30 p-2 text-[10px]" value={sourceReference} onChange={(event)=>setSourceReference(event.target.value)} placeholder="Source reference or last verified record (required; remains unverified)" maxLength={500}/><p className="mt-1 text-[10px] text-amber-200">This creates only a player-supplied inquiry. It does not confirm a disappearance or create a canon character.</p></> : null}<button type="button" disabled={caseKind === "missing-person-inquiry" && (!subjectName.trim() || !sourceReference.trim())} className="mt-2 min-h-9 w-full rounded border border-term/20 px-3 text-[10px] uppercase disabled:cursor-not-allowed disabled:opacity-40" onClick={()=>{createCase(caseTitle,caseKind === "missing-person-inquiry" ? {kind:caseKind,subjectName,sourceReference} : {kind:"general"});void flushSave();setCaseTitle("");setSubjectName("");setSourceReference("");setCaseKind("general");}}>Open case</button></Card>
    {caseFiles.length ? caseFiles.map((file)=> <Card key={file.id} accent={file.status === "archived" ? "white" : "magenta"}>
      <div className="flex items-center justify-between gap-2"><p className="text-sm">{file.id} · {file.title}</p><span className="text-[9px] uppercase">{file.status}</span></div>
      {file.kind === "missing-person-inquiry" ? <p className="mt-1 text-[10px] uppercase text-amber-200">Unverified missing-person inquiry · Subject: {file.subjectName ?? "not recorded"}</p> : null}
      <p className="mt-1 text-[10px] text-term-dim">Opened day {file.createdDay + 1} · updated day {file.updatedDay + 1} · {file.clueIds.length} linked clue(s) · {file.notes.length} note(s)</p>
      {file.clueIds.length ? <div className="mt-2 space-y-1">{file.clueIds.map((id)=>{const clue=p4.clues.find((entry)=>entry.id===id);return <p key={id} className="text-[10px]">{id} · {label(id)} <span className="uppercase text-term-dim">{clue?.evidence ?? "record missing"}</span></p>;})}</div> : <p className="mt-2 text-[10px] text-term-dim">No clues linked.</p>}
      {file.notes.map((note)=> <p key={note.id} className="mt-2 border-l border-term/20 pl-2 text-[10px]">Day {note.dayIndex + 1}{note.provenance === "player-supplied" ? " · PLAYER-SUPPLIED / UNVERIFIED" : ""}: {note.text}</p>)}
      {file.status !== "archived" ? <>
        <div className="mt-2 flex flex-wrap gap-1">{p4.clues.filter((clue)=>clue.discovered!==false&&!file.clueIds.includes(clue.id)).map((clue)=><button key={clue.id} type="button" className="min-h-8 rounded border border-term/15 px-2 text-[9px] uppercase" onClick={()=>{linkClue(file.id,clue.id);void flushSave();}}>Link {clue.id}</button>)}</div>
        <textarea aria-label={`Note for ${file.title}`} className="mt-2 min-h-14 w-full rounded border border-term/15 bg-black/30 p-2 text-[10px]" maxLength={1000} value={noteDrafts[file.id]??""} onChange={(event)=>setNoteDrafts((current)=>({...current,[file.id]:event.target.value}))} placeholder="Record an observation or a player-authored note; do not present an inference as fact."/>
        <button type="button" className="mt-1 min-h-8 rounded border border-term/15 px-2 text-[9px] uppercase" onClick={()=>{addNote(file.id,noteDrafts[file.id]??"");void flushSave();setNoteDrafts((current)=>({...current,[file.id]:""}));}}>Save note</button>
        <div className="mt-2 flex flex-wrap gap-1">{(["open","on-hold","actionable"] as const).filter((status)=>status!==file.status).map((status)=><button key={status} type="button" className="min-h-8 rounded border border-term/15 px-2 text-[9px] uppercase" onClick={()=>{setCaseStatus(file.id,status);void flushSave();}}>{status}</button>)}</div>
        <textarea aria-label={`Archive note for ${file.title}`} className="mt-2 min-h-12 w-full rounded border border-term/15 bg-black/30 p-2 text-[10px]" maxLength={500} value={archiveDrafts[file.id]??""} onChange={(event)=>setArchiveDrafts((current)=>({...current,[file.id]:event.target.value}))} placeholder="Archive note (required; archiving does not resolve the mystery)"/>
        <button type="button" className="mt-1 min-h-8 rounded border border-term/15 px-2 text-[9px] uppercase" onClick={()=>{setCaseStatus(file.id,"archived",archiveDrafts[file.id]??"");void flushSave();}}>Archive record</button>
      </> : <p className="mt-2 text-[10px] text-term-dim">Archive note: {file.archiveNote}</p>}
    </Card>) : <Card accent="magenta"><p className="text-[11px]">No investigation files have been opened. The existing clue board remains available below.</p></Card>}
    {p4.clues.map(c=><Card key={c.id} accent="magenta"><div className="flex items-center justify-between"><p className="text-sm">{c.id} · {c.discovered===false?"Unfound lead":c.label}</p><span className="text-[10px] uppercase">{c.discovered===false?"UNKNOWN":c.evidence}</span></div><p className="mt-1 text-[10px] text-term-dim">Source: {c.source} · reliability {band(c.reliability)}</p><div className="mt-2 flex flex-wrap gap-1">{c.discovered===false?<button type="button" className="min-h-9 px-2 text-[10px] uppercase" onClick={()=>{patch(discoverClue(p4,c.id));void flushSave();}}>Follow lead</button>:<><button type="button" className="min-h-9 px-2 text-[10px] uppercase" onClick={()=>{patch(pinClue(p4,c.id));void flushSave();}}>{p4.boardPins.includes(c.id)?"Pinned":"Pin"}</button>{p4.boardPins.includes(c.id)&&(c.supports?.length||c.evidence==="UNKNOWN")?<button type="button" className="min-h-9 px-2 text-[10px] uppercase" onClick={()=>{patch(theorize(p4,c.id));void flushSave();}}>Hold as theory</button>:null}</>}</div></Card>)}
  </div>;
}

function CeremonyBody(){
  const p4 = useGame((s)=>s.p4);
  const world = useGame((s)=>s.world);
  const schedule = useGame((s)=>s.scheduleCeremony);
  const recordOutcome = useGame((s)=>s.recordCeremonyOutcome);
  const [title,setTitle] = useState("");
  const [dayOffset,setDayOffset] = useState("0");
  const [start,setStart] = useState("10:00");
  const [end,setEnd] = useState("11:00");
  const [place,setPlace] = useState("Floor 5, Reception Hall");
  const [attendees,setAttendees] = useState("");
  const [cost,setCost] = useState("0");
  const targetDay = world.dayIndex + Math.max(0,Math.min(365,Number(dayOffset)||0));
  const targetClock = clockFromDayIndex(targetDay);
  const ceremonies = p4.ceremonies ?? [];
  return <div className="space-y-2">
    <Card accent="violet"><p className="text-sm">Ceremony & Calendar Desk</p><p className="mt-1 text-[11px]">Schedule a recorded ceremony using existing calendar dates and CAST availability. A budget is only charged when the ceremony is marked held. No new ritual lore is generated by this desk.</p></Card>
    <Card accent="violet"><p className="text-sm">Schedule ceremony</p>
      <label className="mt-2 block text-[9px] uppercase text-term-dim">Title</label><input className="w-full rounded border border-term/15 bg-black/30 px-2 py-2 text-[11px]" maxLength={100} value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Ceremony title"/>
      <div className="mt-2 grid grid-cols-3 gap-2"><label className="text-[9px] uppercase text-term-dim">Days ahead<input type="number" min="0" max="365" className="mt-1 w-full rounded border border-term/15 bg-black/30 px-2 py-2 text-[11px]" value={dayOffset} onChange={(e)=>setDayOffset(e.target.value)}/></label><label className="text-[9px] uppercase text-term-dim">Start<input type="time" className="mt-1 w-full rounded border border-term/15 bg-black/30 px-2 py-2 text-[11px]" value={start} onChange={(e)=>setStart(e.target.value)}/></label><label className="text-[9px] uppercase text-term-dim">End<input type="time" className="mt-1 w-full rounded border border-term/15 bg-black/30 px-2 py-2 text-[11px]" value={end} onChange={(e)=>setEnd(e.target.value)}/></label></div>
      <p className="mt-1 text-[10px] text-term-dim">Date: {targetClock.date} {targetClock.year}</p>
      <label className="mt-2 block text-[9px] uppercase text-term-dim">Place</label><input className="w-full rounded border border-term/15 bg-black/30 px-2 py-2 text-[11px]" maxLength={100} value={place} onChange={(e)=>setPlace(e.target.value)}/>
      <label className="mt-2 block text-[9px] uppercase text-term-dim">Attendees (comma-separated CAST names)</label><input className="w-full rounded border border-term/15 bg-black/30 px-2 py-2 text-[11px]" value={attendees} onChange={(e)=>setAttendees(e.target.value)} placeholder="Christian Red IV, Dagmar Red"/>
      <label className="mt-2 block text-[9px] uppercase text-term-dim">Estimated cost (marks)</label><input type="number" min="0" max="1000000" step="1" className="w-full rounded border border-term/15 bg-black/30 px-2 py-2 text-[11px]" value={cost} onChange={(e)=>setCost(e.target.value)}/>
      <button type="button" className="mt-3 min-h-10 rounded border border-term/20 px-3 text-[10px] uppercase" onClick={()=>{schedule({title,dayIndex:targetDay,start,end,place,attendees:attendees.split(",").map((name)=>name.trim()).filter(Boolean),costMarks:Number(cost),importance:"Medium"});void flushSave();}}>Schedule ceremony</button>
    </Card>
    <Card accent="violet"><p className="text-sm">Ceremony register</p><p className="mt-1 text-[10px] text-term-dim">{ceremonies.length} recorded item(s) · costs are charged only on completion as held.</p></Card>
    {ceremonies.length ? ceremonies.map((ceremony)=><Card key={ceremony.id} accent={ceremony.status==="held"?"green":ceremony.status==="planned"?"violet":"white"}>
      <div className="flex items-center justify-between gap-2"><p className="text-sm">{ceremony.title}</p><span className="text-[9px] uppercase">{ceremony.status}</span></div>
      <p className="mt-1 text-[10px]">{ceremony.date} {ceremony.year} · {ceremony.start}–{ceremony.end} · {ceremony.place}</p>
      <p className="mt-1 text-[10px] text-term-dim">Attendees: {ceremony.attendees.length?ceremony.attendees.join(", "):"not specified"} · estimated cost: {ceremony.costMarks} marks</p>
      {ceremony.recordedOutcome?<p className="mt-1 text-[10px]">Record: {ceremony.recordedOutcome}</p>:null}
      {ceremony.status==="planned"?<div className="mt-2 flex flex-wrap gap-1"><button type="button" className="min-h-8 rounded border border-term/15 px-2 text-[9px] uppercase" onClick={()=>{recordOutcome(ceremony.id,"held");void flushSave();}}>Mark held</button><button type="button" className="min-h-8 rounded border border-term/15 px-2 text-[9px] uppercase" onClick={()=>{recordOutcome(ceremony.id,"missed");void flushSave();}}>Mark missed</button><button type="button" className="min-h-8 rounded border border-term/15 px-2 text-[9px] uppercase" onClick={()=>{recordOutcome(ceremony.id,"cancelled");void flushSave();}}>Cancel</button></div>:null}
    </Card>) : <Card accent="violet"><p className="text-[11px]">No ceremonies have been scheduled.</p></Card>}
  </div>;
}

function DayReplayBody(){
  const events = useGame((s)=>s.events);
  const options = useMemo(()=>ledgerDayOptions(events),[events]);
  const [selected,setSelected] = useState("");
  const selectedKey = options.some((option)=>option.key===selected) ? selected : (options[0]?.key ?? "");
  const rows = useMemo(()=>selectedKey?eventsForLedgerDay(events,selectedKey):[],[events,selectedKey]);
  const selectedLabel = options.find((option)=>option.key===selectedKey)?.label;
  return <div className="space-y-2">
    <Card accent="white"><p className="text-sm">Day Replay</p><p className="mt-1 text-[11px]">A read-only reconstruction from saved Event Ledger rows. It does not regenerate scenes, infer missing events or rewrite the campaign record.</p><p className="mt-1 text-[10px] text-term-dim">Available ledger days: {options.length} · retained event rows: {events.length}</p>
      <label className="mt-2 block text-[9px] uppercase text-term-dim">Recorded day</label><select className="w-full rounded border border-term/15 bg-black/30 px-2 py-2 text-[11px]" value={selectedKey} onChange={(event)=>setSelected(event.target.value)} disabled={!options.length}>{options.map((option)=><option key={option.key} value={option.key}>{option.label}</option>)}</select>
    </Card>
    {selectedLabel?<Card accent="white"><p className="text-[10px] uppercase text-term-dim">Replay record · {selectedLabel}</p><p className="mt-1 text-[10px]">{rows.length} event(s), ordered by recorded in-world time.</p></Card>:null}
    {rows.map((event)=><Card key={event.id} accent={event.type==="CRISIS"?"red":event.type==="CEREMONY"?"violet":"white"}>
      <div className="flex items-center justify-between gap-2"><p className="text-sm">{typeof event.time === "string" ? event.time : "--:--"} · {typeof event.type === "string" ? event.type : "RECORDED"}</p><span className="text-[9px] uppercase">{typeof event.knowledge === "string" ? event.knowledge : "unclassified"}</span></div>
      <p className="mt-1 text-[11px]">{typeof event.immediate === "string" ? event.immediate : "Event details were not recorded."}</p>
      <p className="mt-1 text-[10px] text-term-dim">{typeof event.location === "string" ? event.location : "Location not recorded"} · {Array.isArray(event.actors) ? event.actors.filter((actor): actor is string => typeof actor === "string").join(", ") || "No actors recorded" : "No actors recorded"}</p>
      <p className="mt-1 text-[10px]">Cause: {typeof event.cause === "string" ? event.cause : "Not recorded"}</p>
      {typeof event.later === "string" && event.later ? <p className="mt-1 text-[10px]">Later: {event.later}</p> : null}
      <p className="mt-1 text-[9px] uppercase text-term-dim">Evidence: {typeof event.evidence === "string" ? event.evidence : "Not recorded"}</p>
    </Card>)}
    {!rows.length?<Card accent="white"><p className="text-[11px]">No Event Ledger entries are recorded for this day. Older days without ledger rows cannot be reconstructed reliably.</p></Card>:null}
  </div>;
}

function LettersBody(){ const p4=useGame(s=>s.p4); const patch=useGame(s=>s.applyP4); return <div className="space-y-2">{p4.letters.map(l=>{ const checks=l.checks??[]; const visible=[`${l.id} · ${l.sender}`,`Route: ${l.route} · handwriting: ${l.handwriting}`,`Seal: ${l.seal}${l.verified?` · judged ${l.verified}`:""} · checks ${checks.length}/5 · confidence ${confidenceBand(l)}`,...checks.map(c=>c.note)].join("\n"); return <Card key={l.id} accent="blue"><p className="text-sm">{l.id} · {l.sender}</p><p className="mt-1 text-[11px]">Route: {l.route} · handwriting: {l.handwriting}</p><p className="mt-1 text-[10px] uppercase">Seal: {l.seal}{l.verified?` · judged ${l.verified}`:""} · checks {checks.length}/5 · confidence {confidenceBand(l)}</p>{checks.map(c=><p key={c.kind} className="text-[10px] text-term-dim">{c.note}</p>)}<CopyButton text={visible} /><button type="button" disabled={checks.length>=5} className="mt-2 min-h-9 px-2 text-[10px] uppercase disabled:opacity-40" onClick={()=>patch(verifyLetter(p4,l.id))}>Run next check</button></Card>; })}</div> }

function PlannerBody(){
  const p4=useGame(s=>s.p4);
  const world=useGame(s=>s.world);
  const patch=useGame(s=>s.applyP4);
  const [label,setLabel]=useState("");
  const [time,setTime]=useState("16:00");
  const [npc,setNpc]=useState("");
  const [place,setPlace]=useState("Reception Hall");
  const rows=useMemo(()=>castNow(p4,world.dayIndex,time),[p4,world.dayIndex,time]);
  const places=["Reception Hall","Evening Hall","Eastern Wall","Surface Latch","Archive","Forge","Infirmary","West Cistern","Market Tunnel","Rail Platform","Radio Booth","Council Floor","Nursery Wing","Residential Hall","Dining Hall"];
  const visible=p4.planner.filter(p=>p.fixed||p.day===undefined||p.day>=(p4.now?.day??0)).slice().sort((a,b)=>(a.day??-1)-(b.day??-1)||a.time.localeCompare(b.time));
  return <div className="space-y-2">
    <Card accent="white">
      <p className="text-sm">Standing Orders & Day Planner</p>
      <p className="mt-1 text-[11px]">Appointments can reserve an existing cast member. The planner checks their daily schedule, illness, errands and overlapping reservations before confirming a time.</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <label className="text-[10px] uppercase text-term-dim">Time<input value={time} onChange={e=>setTime(e.target.value)} className="mt-1 w-full min-h-10 rounded bg-black/20 px-2 text-sm normal-case" aria-label="planned time"/></label>
        <label className="text-[10px] uppercase text-term-dim">Location<select value={place} onChange={e=>setPlace(e.target.value)} className="mt-1 w-full min-h-10 rounded bg-black/20 px-2 text-xs normal-case">{places.map(x=><option key={x} value={x}>{x}</option>)}</select></label>
        <label className="text-[10px] uppercase text-term-dim col-span-2">Person (optional)<select value={npc} onChange={e=>setNpc(e.target.value)} className="mt-1 w-full min-h-10 rounded bg-black/20 px-2 text-xs normal-case"><option value="">No person assigned</option>{rows.map(x=><option key={x.name} value={x.name}>{x.name} — {availabilityLabel(x)} ({x.place})</option>)}</select></label>
        <label className="text-[10px] uppercase text-term-dim col-span-2">Appointment<input value={label} onChange={e=>setLabel(e.target.value)} placeholder="New plan" className="mt-1 w-full min-h-10 rounded bg-black/20 px-2 text-sm normal-case"/></label>
      </div>
      <button type="button" disabled={!label.trim()||toMin(time)===null} className="mt-2 min-h-10 w-full px-3 text-[10px] uppercase disabled:opacity-40" onClick={()=>{patch(planItem(p4,label.trim(),time,{npc:npc||undefined,place}));setLabel("")}}>Add to plan</button>
      {p4.lastPlan&&<p className="mt-2 text-[10px]">{p4.lastPlan.reason}</p>}
    </Card>
    {visible.map(p=><Card key={p.id} accent="white"><div className="flex items-center gap-3"><b className="text-sm">{p.time}</b><span className="min-w-0 flex-1">{p.label}<span className="block text-[10px] text-term-dim">{p.place??"Location not specified"}{p.npc?` · ${p.npc}`:""}</span></span><span className="text-[9px] uppercase text-term-dim">{p.fixed?"fixed":p.status}</span></div></Card>)}
  </div>;
}

function WorldTimeBody(){
  const p4=useGame(s=>s.p4);
  const world=useGame(s=>s.world);
  const minute=toMin(world.clock.time)??0;
  const absolute=world.dayIndex*1440+minute;
  const next=nextScheduled(p4.planner,absolute);
  const nextDay=next?Math.floor(next.at/1440):null;
  return <div className="space-y-2">
    <Card accent="white"><p className="text-sm">World Clock</p><p className="mt-2 text-3xl tabular-nums">{world.clock.time}</p><p className="mt-1 text-sm">{world.clock.weekday} · {world.clock.date} · {world.clock.year} AW</p><p className="mt-1 text-[10px] text-term-dim">{world.clock.location} · {world.clock.floor}</p></Card>
    <div className="grid grid-cols-2 gap-2"><Card accent="white"><p className="text-[9px] uppercase text-term-dim">World day</p><b className="text-xl tabular-nums">{world.dayIndex+1}</b></Card><Card accent="white"><p className="text-[9px] uppercase text-term-dim">Simulation week</p><b className="text-xl tabular-nums">{p4.week}</b></Card></div>
    <Card accent="cyan"><p className="text-[10px] uppercase text-term-dim">Next scheduled event</p>{next?<><p className="mt-1 text-sm">{next.item.label}</p><p className="mt-1 text-[11px]">Day {nextDay!+1} · {fromMin(next.at%1440)}{next.item.npc?` · ${next.item.npc}`:""}</p></>:<p className="mt-1 text-[11px]">No future planner event is currently scheduled.</p>}</Card>
    <Card accent="white"><p className="text-[10px] uppercase text-term-dim">Recent calendar notes</p>{(p4.chronicleNotes??[]).slice(-5).reverse().map((line,i)=><p key={`${i}-${line}`} className="mt-1 text-[11px]">{line}</p>)}{!p4.chronicleNotes?.length&&<p className="mt-1 text-[11px]">No clock-related Chronicle notes recorded.</p>}</Card>
  </div>;
}
function BanquetBody(){ const p4=useGame(s=>s.p4); const patch=useGame(s=>s.applyP4); const envoys=p4.envoys??[]; const selected=p4.banquet.seated; const standings=Object.entries(p4.relations??{}); const talk=(p4.rumors??[]).filter(r=>/banquet/i.test(r)); const news=(p4.newsFeed??[]).filter(r=>/banquet/i.test(r)); const red=(p4.redLedger??[]).filter(r=>/banquet/i.test(r)); return <div className="space-y-2"><Card accent="amber"><p className="text-sm">State Banquet Seating Puzzle</p><p className="mt-1 text-[11px]">Seat order is precedence order: first seated sits nearest the head. Rivalries, feuds, diet and ritual are checked. No marriage outcome is forced.</p></Card>{envoys.map(e=><button key={e.id} type="button" className={cn("flex w-full min-h-11 items-center gap-2 rounded-md border border-term/10 px-3 text-left",selected.includes(e.id)&&"bg-term/10")} onClick={()=>patch(banquet(p4,selected.includes(e.id)?selected.filter(x=>x!==e.id):selected.concat(e.id)))}><span className="size-2 rounded-full bg-term/50"/><span>{e.name} <span className="text-[10px] text-term-dim">({e.faction}; {e.diet})</span></span><span className="ml-auto text-[9px] uppercase">{selected.includes(e.id)?`SEAT ${selected.indexOf(e.id)+1}`:"AVAILABLE"}</span></button>)}<Card accent="amber"><p className="text-[10px] uppercase">Outcome</p><p className="mt-1 text-lg">{p4.banquet.result}</p></Card><Card accent="amber"><p className="text-[10px] uppercase">Standings</p>{standings.length?standings.map(([name,n])=><p key={name} className="mt-1 text-[11px]">{name} · {relationWord(n)}</p>):<p className="mt-1 text-[11px]">No shift recorded from the table.</p>}</Card><Card accent="amber"><p className="text-[10px] uppercase">Table talk</p>{talk.length?talk.slice(0,6).map(r=><p key={r} className="mt-1 text-[11px]">{r}</p>):<p className="mt-1 text-[11px]">No banquet rumor yet.</p>}</Card><Card accent="amber"><p className="text-[10px] uppercase">Notices</p>{news.length?news.slice(0,4).map(r=><p key={r} className="mt-1 text-[11px]">{r}</p>):<p className="mt-1 text-[11px]">No banquet notice yet.</p>}</Card><Card accent="red"><p className="text-[10px] uppercase">Red Ledger</p>{red.length?red.slice(0,4).map(r=><p key={r} className="mt-1 text-[11px]">{r}</p>):<p className="mt-1 text-[11px]">No banquet line in the Red Ledger.</p>}</Card></div> }

function MomentsBody(){ const p4=useGame(s=>s.p4); const patch=useGame(s=>s.applyP4); return <div className="space-y-2">{p4.moments.map(m=><Card key={m.id} accent={m.seen?"green":"violet"}><p className="text-sm">{m.title}</p><p className="mt-1 text-[11px]">{m.copy}</p><button type="button" disabled={m.seen} className="mt-2 min-h-9 px-2 text-[10px] uppercase disabled:opacity-40" onClick={()=>patch(triggerMoment(p4,m.id))}>{m.seen?"Seen":"Trigger demo moment"}</button></Card>)}</div> }
function CrisisBody(){ const p4=useGame(s=>s.p4); const patch=useGame(s=>s.applyP4); if(!p4.crisis)return <Card accent="green"><div className="flex items-center gap-2"><Gauge className="size-4"/><p className="text-sm">No active crisis</p></div><p className="mt-1 text-[11px]">Run the weekly simulation to test the warning channel.</p><button type="button" className="mt-2 min-h-10 px-3 text-[10px] uppercase" onClick={()=>patch(simulateWeek(p4))}>Advance simulation week</button></Card>; return <Card accent="red"><div className="flex items-center gap-2"><CircleAlert className="size-4 text-p-red"/><p className="text-sm">{p4.crisis.title}</p></div><p className="mt-1 text-[11px] uppercase">Severity {p4.crisis.severity} · decision window {p4.crisis.deadlineHours}h</p>{p4.crisis.affectedGateIds?.length?<p className="mt-1 text-[10px]">Affected gate(s): {p4.crisis.affectedGateIds.join(", ")}</p>:null}<p className="mt-1 text-[10px] text-term-dim">A response is accepted only when it matches one of the listed actions. Resolved and failed outcomes update the Chronicle, resources and relevant gate state.</p><div className="mt-2 flex flex-wrap gap-1">{p4.crisis.options.map(o=><button key={o} type="button" className="min-h-10 px-2 text-[10px] uppercase" onClick={()=>patch(resolveCrisis(p4,o))}>{o}</button>)}</div></Card> }
function AuditBody(){ const state=useGame(s=>s); const rows=useMemo(()=>auditWorld(state.snapshot()),[state]); return <div className="space-y-2">{rows.map(r=><Card key={r.key} accent={r.status==="FAIL"?"red":r.status==="WARN"?"amber":"green"}><div className="flex items-center gap-2"><b className="text-[10px]">{r.status}</b><span className="text-sm">{r.key}</span><span className="ml-auto text-[9px] text-term-dim">{r.source}</span></div><p className="mt-1 text-[11px]">{r.detail}</p></Card>)}</div> }

export function V45PanelBody({ panel }: { panel: PlatformPanel }) {
  if (panel.id === "24") return <div className="space-y-3"><ResourceStrip/><CouncilBody/></div>;
  if (panel.id === "05") return <div className="space-y-3"><ResourceStrip/><CeremonyBody/></div>;
  if (panel.id === "34") return <div className="space-y-3"><ResourceStrip/><DayReplayBody/></div>;
  if (panel.id === "33") return <div className="space-y-3"><ResourceStrip/><EveningHallPresence/><AbsenteeList/><PastimeBody/></div>;
  if (panel.id === "19") return <div className="space-y-3"><ResourceStrip/><InvestigationBody/></div>;
  if (panel.id === "59") return <div className="space-y-3"><ResourceStrip/><BanquetBody/></div>;
  if (panel.id === "16") return <div className="space-y-3"><ResourceStrip/><FactionDesk/><LettersBody/></div>;
  if (panel.id === "12") return <div className="space-y-3"><ResourceStrip/><PlannerBody/></div>;
  if (panel.id === "46") return <div className="space-y-3"><ResourceStrip/><WorldTimeBody/></div>;
  if (panel.id === "64") return <div className="space-y-3"><ResourceStrip/><MomentsBody/></div>;
  if (panel.id === "57") return <div className="space-y-3"><ResourceStrip/><CrisisBody/><DataCards panel={panel}/></div>;
  if (panel.id === "58") return <div className="space-y-3"><ResourceStrip/><FactionDesk/></div>;
  if (panel.id === "29") return <div className="space-y-3"><ResourceStrip/><AuditBody/></div>;
  return <div className="space-y-3"><ResourceStrip/><DataCards panel={panel}/></div>;
}
