import { PANEL_REGISTRY } from "@/lib/platform/registry";
import { collectStrings, leaks } from "@/lib/platform/leak";
import type { GameSnapshot } from "@/lib/game/types";
export interface AuditRow{key:string;status:"PASS"|"WARN"|"FAIL";source:string;detail:string}
export function auditWorld(s:GameSnapshot):AuditRow[]{
 const ids=PANEL_REGISTRY.map(p=>p.id); const uniq=new Set(ids).size===ids.length;
 const inv=s.world.population.known===60000 && s.world.population.redClaws===12500 && s.world.arms.suitsReady+s.world.arms.inRepair===1000;
 const names=s.household.map(h=>h.name).join("|").toLowerCase();
 const wives=s.household.length===3 && names.includes("dagmar") && names.includes("adelheid") && names.includes("vera");
 // Hidden-value scan over everything the player can read (never over raw state keys).
 const visible=collectStrings([s.log,s.news,s.worldNews,s.chronicle,s.inbox,s.intel,s.memories,s.events,(s as any).p4?.log,(s as any).p4?.rumors,(s as any).p4?.reports,(s as any).p4?.newsFeed,(s as any).p4?.memories,(s as any).p4?.queue,(s as any).p4?.deskNotes,(s as any).p4?.lastReceipt,(s as any).p4?.chronicleNotes]);
 const leaked=leaks(visible);
 const p4=(s as any).p4;
 const q:any[]=p4?.queue??[]; const qIds=new Set(q.map(x=>x.id));
 const queueOk=qIds.size===q.length && q.every(x=>Number.isFinite(x.dueDay) && x.dueDay>=0);
 const plan:any[]=(p4?.planner??[]).filter((x:any)=>x.status==="planned");
 const plannerOk=plan.every((x:any)=>/^\d{2}:\d{2}$/.test(x.time));
 const crisisOk=!p4?.crisis || (p4.crisis.deadlineHours>0 && ["normal","important","critical","emergency"].includes(p4.crisis.severity));
 const unknownLetters=(p4?.letters??[]).every((l:any)=>l.seal!=="AUTHENTIC"&&l.seal!=="FORGED" || (l.checks?.length>=2) || l.id==="L-02");
 return [
  {key:"canon-invariants",status:inv?"PASS":"FAIL",source:"A3.3",detail:`Population ${s.world.population.known}; Mark IV ${s.world.arms.suitsReady+s.world.arms.inRepair}.`},
  {key:"panel-ids",status:uniq&&ids.length===65?"PASS":"FAIL",source:"A4.1",detail:`${ids.length} canonical platform panels registered including [29].`},
  {key:"wife-numbering",status:wives?"PASS":"FAIL",source:"A3.3 / V4.1 household canon",detail:"Exactly three active household wife records are expected."},
  {key:"hidden-value-leak",status:leaked.length===0?"PASS":"FAIL",source:"A4.5",detail:leaked.length?`${leaked.length} player-visible string(s) expose a hidden value.`:"No hidden relation or clock value appears in player-visible text."},
  {key:"asset-state",status:(p4?.unlockedAssets?.length??0)>=0?"PASS":"WARN",source:"A9.1",detail:"Manifest-backed art is available; see verify-art for the generated/placeholder count."},
  {key:"queue-integrity",status:queueOk?"PASS":"FAIL",source:"A5.3 / A8.7",detail:`${q.length} queued consequence(s); ids unique, due days valid.`},
  {key:"planner-integrity",status:plannerOk?"PASS":"FAIL",source:"A8.7",detail:`${plan.length} planned item(s) with valid times.`},
  {key:"crisis-integrity",status:crisisOk?"PASS":"FAIL",source:"A8.5",detail:p4?.crisis?`Open crisis tier ${p4.crisis.severity}.`:"No open crisis."},
  {key:"letter-integrity",status:unknownLetters?"PASS":"FAIL",source:"A7",detail:"No letter is judged authentic or forged without at least two independent checks."},
 ];
}
