export type EvidenceClass = "KNOWN" | "OBSERVED" | "THEORY" | "RUMOR" | "UNKNOWN";
export interface Clue {
  id: string; label: string; evidence: EvidenceClass; source: string; linked: string[];
  discovered?: boolean;
  /** discovery condition: needs these clue ids known, or a panel visit */
  requires?: string[];
  reliability?: number; // witness / source reliability 0..1 (hidden; shown as a band)
  falseLead?: boolean; // hidden
  contradicts?: string[];
  supports?: string[];
}
export interface Link { a: string; b: string; kind: "supports" | "contradicts" | "theory" }
export interface CaseState { id: string; title: string; clues: string[]; resolved: boolean; resolution?: string }

export const band = (r = 0.5) => (r >= 0.8 ? "firm" : r >= 0.55 ? "fair" : "weak");

/** A clue becomes discoverable once all required clues are discovered. */
export function discoverable(c: Clue, all: Clue[]): boolean {
  if (c.discovered) return false;
  return (c.requires ?? []).every((r) => all.find((x) => x.id === r)?.discovered);
}
export function discover(all: Clue[], id: string): { clues: Clue[]; ok: boolean; message: string } {
  const c = all.find((x) => x.id === id);
  if (!c) return { clues: all, ok: false, message: "No such lead." };
  if (!discoverable(c, all)) return { clues: all, ok: false, message: c.discovered ? "Already on the board." : "Not enough is known to find this yet." };
  return { clues: all.map((x) => (x.id === id ? { ...x, discovered: true } : x)), ok: true, message: `Found: ${c.label} (${band(c.reliability)} source).` };
}
export function contradictions(all: Clue[], pinned: string[]): Array<[string, string]> {
  const out: Array<[string, string]> = [];
  for (const a of all) for (const b of a.contradicts ?? []) if (pinned.includes(a.id) && pinned.includes(b) && !out.some(([x, y]) => (x === a.id && y === b) || (x === b && y === a.id))) out.push([a.id, b]);
  return out;
}
/**
 * The board never solves a mystery: a THEORY needs two independent non-rumor supports with no
 * pinned contradiction; even then it stays THEORY, never KNOWN. Observation upgrades UNKNOWN -> OBSERVED only via discover().
 */
export function advanceTheory(all: Clue[], pinned: string[], target: string): { clues: Clue[]; message: string } {
  const t = all.find((c) => c.id === target);
  if (!t || !pinned.includes(target)) return { clues: all, message: "Pin the clue first." };
  const sup = all.filter((c) => pinned.includes(c.id) && c.id !== target && (c.supports ?? []).includes(target) && c.evidence !== "RUMOR" && c.discovered !== false);
  if (contradictions(all, pinned).some(([a, b]) => a === target || b === target)) return { clues: all, message: "Pinned evidence contradicts this lead; the board cannot advance it." };
  if (sup.length < 2) return { clues: all, message: `Only ${sup.length} supporting source${sup.length === 1 ? "" : "s"}; at least two are needed to hold a theory.` };
  if (t.evidence === "UNKNOWN" || t.evidence === "RUMOR") return { clues: all.map((c) => (c.id === target ? { ...c, evidence: "THEORY" as const } : c)), message: `${t.label} is now held as a THEORY. It is not proven.` };
  return { clues: all, message: "The board holds it as it stands; proof must come from the field." };
}
export function resolveCase(c: CaseState, all: Clue[]): CaseState {
  const known = c.clues.filter((id) => all.find((x) => x.id === id)?.evidence === "KNOWN").length;
  if (known < Math.max(2, Math.ceil(c.clues.length * 0.6))) return c;
  return { ...c, resolved: true, resolution: "Enough is established to act; consequences are entered in the ledger." };
}
