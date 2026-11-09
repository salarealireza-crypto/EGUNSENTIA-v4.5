import { clamp, rand01 } from "./core.ts";
import type { Faction } from "./banquet.ts";

export interface Bloc { name: string; support: number }
export interface FactionState {
  id: Faction; mood: number; pressure: number; treasury: number; agenda: string; lastAction: string;
  food?: number; water?: number; arms?: number;
  blocs?: Bloc[]; tension?: number; mobilization?: number; treaty?: "none" | "armistice" | "trade" | "alliance";
  dependsOn?: Faction[];
}
/** Player-facing bloc word. Support figures stay in state and never reach the desk. */
export function blocWord(blocs: Bloc[] | undefined): "strong" | "split" | "weak" {
  const b = blocs ?? [];
  if (!b.length) return "weak";
  if (b.length >= 2 && Math.abs(b[0].support - b[1].support) >= 4) return "split";
  const avg = b.reduce((s, x) => s + x.support, 0) / b.length;
  return avg >= 5 ? "strong" : "weak";
}
export interface Report { faction: Faction; text: string; credibility: "confirmed" | "likely" | "rumor" }

export type DiplomaticStanding = "warm" | "cordial" | "even" | "cool" | "strained";
export type DiplomaticRisk = "low" | "guarded" | "high";

/** Derive a player-facing diplomatic read without exposing internal relation scores. */
export function diplomaticAssessment(faction: FactionState, relationScore = 0): {
  standing: DiplomaticStanding; risk: DiplomaticRisk; leverage: "limited" | "moderate" | "strong";
  pressure: "low" | "rising" | "severe"; summary: string;
} {
  const standing: DiplomaticStanding = relationScore >= 3 ? "warm" : relationScore >= 1 ? "cordial" : relationScore <= -3 ? "strained" : relationScore <= -1 ? "cool" : "even";
  const tension = faction.tension ?? 3;
  const mobilization = faction.mobilization ?? 2;
  const pressure = (faction.pressure ?? 0) >= 8 ? "severe" : (faction.pressure ?? 0) >= 5 ? "rising" : "low";
  const risk: DiplomaticRisk = tension >= 8 || mobilization >= 7 || pressure === "severe" ? "high" : tension >= 5 || mobilization >= 5 || pressure === "rising" ? "guarded" : "low";
  const leverage = (faction.mood ?? 5) >= 7 && (faction.pressure ?? 0) <= 4 ? "strong" : (faction.mood ?? 5) >= 4 ? "moderate" : "limited";
  const treaty = faction.treaty ?? "none";
  const summary = risk === "high" ? "Diplomatic contact carries a serious risk of escalation." : standing === "strained" || standing === "cool" ? "Trust is weak; verify demands and guarantees before concessions." : treaty === "alliance" ? "Formal alliance remains the strongest channel for cooperation." : treaty === "trade" ? "Trade provides a practical channel for continued cooperation." : treaty === "armistice" ? "The armistice limits open conflict but does not guarantee trust." : "No formal treaty secures this relationship.";
  return { standing, risk, leverage, pressure, summary };
}

export const FACTION_SEED: FactionState[] = [
  { id: "Red Claws", mood: 7, pressure: 3, treasury: 120000, agenda: "Hold the Dome, conserve water, preserve border readiness.", lastAction: "Routine watch.", food: 60, water: 60, arms: 70, tension: 2, mobilization: 2, treaty: "alliance", blocs: [{ name: "Gate command", support: 6 }, { name: "Ministries", support: 5 }], dependsOn: ["Grotsen Dominion"] },
  { id: "Monarchia", mood: 6, pressure: 4, treasury: 98000, agenda: "Protect court influence and eastern trade.", lastAction: "Awaiting envoys.", food: 55, water: 50, arms: 50, tension: 3, mobilization: 2, treaty: "alliance", blocs: [{ name: "Court", support: 6 }, { name: "Trade houses", support: 4 }], dependsOn: ["Red Claws"] },
  { id: "Grotsen Dominion", mood: 5, pressure: 5, treasury: 76000, agenda: "Secure water and rifles; preserve succession channels.", lastAction: "Dreyer requested talks.", food: 50, water: 35, arms: 60, tension: 5, mobilization: 4, treaty: "armistice", blocs: [{ name: "Commissars", support: 5 }, { name: "Garrison", support: 5 }], dependsOn: ["Red Claws"] },
  { id: "Demos", mood: 5, pressure: 6, treasury: 54000, agenda: "Defend southern routes and assembly autonomy.", lastAction: "Border report disputed.", food: 45, water: 55, arms: 35, tension: 4, mobilization: 3, treaty: "trade", blocs: [{ name: "Assembly", support: 5 }, { name: "Technical guild", support: 6 }], dependsOn: ["Monarchia"] },
  { id: "Survivors", mood: 4, pressure: 7, treasury: 21000, agenda: "Secure travel, food and recognition.", lastAction: "Union pressure continues.", food: 30, water: 30, arms: 15, tension: 4, mobilization: 1, treaty: "none", blocs: [{ name: "Union", support: 6 }, { name: "Caravans", support: 4 }], dependsOn: ["Demos", "Monarchia"] },
];

/** One simulated week for all factions. Independent, deterministic given (week, id). */
export function stepFactions(fs: FactionState[], week: number): { factions: FactionState[]; reports: Report[]; events: string[] } {
  const events: string[] = [];
  const reports: Report[] = [];
  const byId = new Map(fs.map((f) => [f.id, f]));
  const next = fs.map((f0) => {
    const f = structuredClone(f0);
    f.food = f.food ?? 50; f.water = f.water ?? 50; f.arms = f.arms ?? 40; f.tension = f.tension ?? 3; f.mobilization = f.mobilization ?? 2;
    const r = (k: string) => rand01(`${week}|${f.id}|${k}`);
    // per-faction economy: production minus consumption, trade dependency softens or sharpens it
    const partners = (f.dependsOn ?? []).map((d) => byId.get(d)).filter(Boolean) as FactionState[];
    const partnerHealth = partners.length ? partners.reduce((s, p) => s + p.mood, 0) / partners.length : 5;
    const tradeBonus = partnerHealth >= 5 ? 1 : -2; // dependent on a stressed partner -> shortages
    f.food = clamp(f.food + (r("food") - 0.55) * 8 + tradeBonus * 0.5, 0, 100);
    f.water = clamp(f.water + (r("water") - 0.55) * 8 + tradeBonus * 0.5, 0, 100);
    f.arms = clamp(f.arms + (f.mobilization > 5 ? -2 : 1) + (r("arms") - 0.5) * 3, 0, 100);
    const shortage = f.food < 25 || f.water < 25;
    // internal blocs shift; leadership tension grows with unrest, eases with calm
    f.blocs = (f.blocs ?? []).map((b, i) => ({ ...b, support: clamp(b.support + Math.round((r(`bloc${i}`) - 0.5) * 3), 0, 10) }));
    const split = f.blocs.length > 1 ? Math.abs(f.blocs[0].support - f.blocs[1].support) : 0;
    f.tension = clamp(f.tension + (shortage ? 1 : 0) + (split >= 5 ? 1 : 0) + (f.mood <= 3 ? 1 : -0.5), 0, 10);
    f.pressure = clamp(f.pressure + (shortage ? 1 : 0) + (f.mobilization >= 6 ? 1 : 0) - (f.mood >= 7 ? 1 : 0), 0, 10);
    f.mood = clamp(f.mood + (shortage ? -1 : 0) + (f.tension >= 8 ? -1 : 0) + (f.treaty === "alliance" || f.treaty === "trade" ? 0.5 : 0) - (f.pressure >= 8 ? 0.5 : 0), 1, 10);
    // military mobilization: independent decision when pressure is high and mood low
    if (f.pressure >= 7 && f.mood <= 4 && f.mobilization < 10) { f.mobilization += 1; events.push(`${f.id} raises its readiness.`); }
    else if (f.mobilization > 0 && f.pressure <= 3) f.mobilization -= 1;
    // succession tension event
    if (f.tension >= 8 && r("succ") > 0.5) { events.push(`${f.id}: succession channels are strained.`); f.tension = 6; f.lastAction = "Internal leadership dispute."; }
    else f.lastAction = shortage ? "Shortage measures and rationing." : f.mobilization >= 5 ? "Mobilization drills." : "Routine administration and courier review.";
    // treaty drift
    if (f.treaty === "armistice" && f.mood >= 7 && f.pressure <= 3) { f.treaty = "trade"; events.push(`${f.id} proposes a trade framework.`); }
    if (f.treaty === "trade" && f.mood <= 2) { f.treaty = "none"; events.push(`${f.id} suspends its trade framework.`); }
    return f;
  });
  for (const f of next) {
    // The player sees credibility-tagged reports only, never the raw economy or tension numbers.
    const cred: Report["credibility"] = f.id === "Red Claws" ? "confirmed" : rand01(`${week}|${f.id}|cred`) > 0.5 ? "likely" : "rumor";
    const text = (f.food ?? 50) < 25 || (f.water ?? 50) < 25 ? `${f.id} appears short of food or water.` : (f.mobilization ?? 0) >= 5 ? `${f.id} is reported to be mobilizing.` : (f.tension ?? 0) >= 7 ? `${f.id} leadership appears divided.` : `${f.id} is quiet this week.`;
    reports.push({ faction: f.id, text, credibility: cred });
  }
  return { factions: next, reports, events };
}
