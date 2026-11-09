import { hash } from "./core.ts";

export type Faction = "Red Claws" | "Monarchia" | "Grotsen Dominion" | "Demos" | "Survivors";
export interface Envoy { id: string; name: string; faction: Faction; rank: number; diet: string; ritual: string; feuds: string[]; temper: number }
export type BanquetResult = "unplanned" | "without insult" | "tense" | "incident";
/** Standing word for a stored relation. The number itself is not player-facing. */
export function relationWord(n: number): "warm" | "cordial" | "even" | "cool" | "strained" {
  if (n >= 3) return "warm";
  if (n >= 1) return "cordial";
  if (n <= -3) return "strained";
  if (n <= -1) return "cool";
  return "even";
}
export interface BanquetReport { result: BanquetResult; score: number; issues: string[]; relationDeltas: Partial<Record<Faction, number>>; rumor?: string; redLedger?: string }

// Design assumption: pairwise faction affinity -2..+2 (symmetrical).
const AFFINITY: Record<string, number> = {
  "Monarchia|Grotsen Dominion": 1, "Monarchia|Demos": -1, "Grotsen Dominion|Demos": -2,
  "Survivors|Grotsen Dominion": -1, "Survivors|Demos": 1, "Survivors|Monarchia": 0,
};
export const affinity = (a: Faction, b: Faction) => (a === b ? 2 : AFFINITY[`${a}|${b}`] ?? AFFINITY[`${b}|${a}`] ?? 0);
// Precedence at the table (lower = nearer the head).
export const PRECEDENCE: Record<Faction, number> = { "Red Claws": 0, Monarchia: 1, "Grotsen Dominion": 2, Demos: 3, Survivors: 4 };

const POOLS: Record<string, string[]> = {
  Monarchia: ["Aurelio Venn", "Cecilia Marr", "Lothar Quist", "Ysolde Brandt"],
  "Grotsen Dominion": ["Ruprecht Holm", "Katarin Sell", "Osric Dane", "Mirela Vask"],
  Demos: ["Tobias Wren", "Ilse Marek", "Corvin Aldt", "Nadia Prell"],
  Survivors: ["Emre Falk", "Hanne Sorel", "Joss Tarn", "Petra Lind"],
};
const DIETS = ["no restriction", "no restriction", "grain-only", "no cured meat", "fast day"];
const RITUALS = ["none", "bread-and-salt greeting", "first-cup rite", "lamp-bow", "none"];

/** Generate the envoy roster once. Callers store it and never call it again (names are then locked). */
export function generateEnvoys(seed = "egunsentia"): Envoy[] {
  const out: Envoy[] = [];
  for (const f of Object.keys(POOLS) as Faction[]) {
    const pool = POOLS[f];
    const name = pool[hash(`${seed}|${f}`) % pool.length];
    out.push({
      id: `ENV-${f.split(" ")[0].toUpperCase()}`,
      name, faction: f,
      rank: 1 + (hash(`${seed}|${f}|rank`) % 3),
      diet: DIETS[hash(`${seed}|${f}|diet`) % DIETS.length],
      ritual: RITUALS[hash(`${seed}|${f}|rit`) % RITUALS.length],
      feuds: [],
      temper: 1 + (hash(`${seed}|${f}|temper`) % 3),
    });
  }
  // personal feuds are symmetric and fixed once
  const byF = (f: Faction) => out.find((e) => e.faction === f)!;
  const a = byF("Grotsen Dominion"), b = byF("Demos");
  a.feuds.push(b.id); b.feuds.push(a.id);
  return out;
}

export interface BanquetOpts { guards?: number; menu?: string[]; ritualsObserved?: string[] }
/** Seating is ordered: index 0 is nearest the head. Adjacent pairs are scored. */
export function scoreBanquet(roster: Envoy[], seatedIds: string[], opts: BanquetOpts = {}): BanquetReport {
  const seated = seatedIds.map((i) => roster.find((e) => e.id === i)).filter((e): e is Envoy => !!e);
  if (!seated.length) return { result: "unplanned", score: 0, issues: [], relationDeltas: {} };
  const guards = opts.guards ?? 2;
  const menu = opts.menu ?? ["bread", "stew", "grain", "cured meat"];
  const issues: string[] = [];
  let score = 0;
  const deltas: Partial<Record<Faction, number>> = {};
  const bump = (f: Faction, d: number) => { deltas[f] = (deltas[f] ?? 0) + d; };
  for (let i = 0; i < seated.length - 1; i++) {
    const a = seated[i], b = seated[i + 1];
    const aff = affinity(a.faction, b.faction);
    score += aff;
    if (aff <= -2) { issues.push(`${a.name} and ${b.name} are seated side by side despite open rivalry.`); bump(a.faction, -1); bump(b.faction, -1); }
    if (a.feuds.includes(b.id)) {
      score -= 3 + Math.max(a.temper, b.temper);
      issues.push(`Personal feud: ${a.name} and ${b.name}.`);
      if (guards < 2) { score -= 2; issues.push("Security thin between feuding guests."); }
    }
  }
  // precedence: a faction ranked lower seated above a higher one is an insult
  for (let i = 0; i < seated.length; i++) for (let j = i + 1; j < seated.length; j++) {
    if (PRECEDENCE[seated[i].faction] > PRECEDENCE[seated[j].faction]) { score -= 2; issues.push(`Precedence slight: ${seated[j].name} seated below ${seated[i].name}.`); bump(seated[j].faction, -1); }
  }
  for (const e of seated) {
    if (e.diet === "no cured meat" && menu.includes("cured meat")) { score -= 2; issues.push(`${e.name} cannot eat the cured meat course.`); bump(e.faction, -1); }
    if (e.diet === "grain-only" && !menu.includes("grain")) { score -= 2; issues.push(`${e.name} has no grain course.`); }
    if (e.ritual !== "none" && !(opts.ritualsObserved ?? []).includes(e.ritual)) { score -= 1; issues.push(`${e.name}'s ${e.ritual} was not observed.`); }
  }
  score += seated.length >= 3 ? 1 : 0;
  const result: BanquetResult = score >= 0 && !issues.some((s) => /feud|rivalry/.test(s)) ? "without insult" : score >= -3 ? "tense" : "incident";
  const rumor = result === "without insult" ? undefined : `Guests talk of the banquet: ${issues[0] ?? "a strained table"}`;
  for (const e of seated) bump(e.faction, result === "without insult" ? 1 : result === "incident" ? -1 : 0);
  return { result, score, issues, relationDeltas: deltas, rumor, redLedger: result === "incident" ? `Banquet incident logged: ${issues.slice(0, 2).join(" ")}` : undefined };
}
