import { clamp, rand01 } from "./core.ts";

export type Seal = "AUTHENTIC" | "FORGED" | "UNKNOWN";
export type CheckKind = "seal" | "handwriting" | "courier" | "paper" | "politics";
export interface CheckResult { kind: CheckKind; signal: "consistent" | "inconsistent"; reliability: number; note: string; hours: number; cost: number }
export interface Letter {
  id: string;
  sender: string;
  seal: Seal;
  route: string;
  handwriting: string;
  verified?: string;
  /** Ground truth. Never shown by UI; used only to roll check outcomes. */
  truth?: "AUTHENTIC" | "FORGED";
  /** Sender's faction. Used for a delayed relation hit; never printed as a figure. */
  faction?: string;
  checks?: CheckResult[];
  material?: string;
  courierChain?: string[];
}

/** Base reliability per check kind; independent sources compound. */
export const CHECK_TABLE: Record<CheckKind, { reliability: number; hours: number; cost: number; label: string }> = {
  seal: { reliability: 0.85, hours: 2, cost: 20, label: "Seal impression compared with the register" },
  handwriting: { reliability: 0.75, hours: 3, cost: 10, label: "Hand compared with archived samples" },
  courier: { reliability: 0.8, hours: 6, cost: 40, label: "Courier chain and rail log traced" },
  paper: { reliability: 0.7, hours: 2, cost: 15, label: "Paper, ink and material examined" },
  politics: { reliability: 0.6, hours: 1, cost: 0, label: "Content tested against political context" },
};
export const CHECK_ORDER: CheckKind[] = ["seal", "handwriting", "courier", "paper", "politics"];

export function nextCheck(l: Letter): CheckKind | null {
  const done = new Set((l.checks ?? []).map((c) => c.kind));
  return CHECK_ORDER.find((k) => !done.has(k)) ?? null;
}

/** Roll one check. A reliable check reports the truth; an unreliable roll flips it (false positive / negative). */
export function runCheck(l: Letter, kind: CheckKind, week: number): CheckResult {
  const t = CHECK_TABLE[kind];
  const truth = l.truth ?? "AUTHENTIC";
  const honest: CheckResult["signal"] = truth === "AUTHENTIC" ? "consistent" : "inconsistent";
  const flip = rand01(`${l.id}|${kind}|${week}`) > t.reliability;
  const signal: CheckResult["signal"] = flip ? (honest === "consistent" ? "inconsistent" : "consistent") : honest;
  return { kind, signal, reliability: t.reliability, hours: t.hours, cost: t.cost, note: `${t.label}: ${signal}.` };
}

/** Log-odds style evidence score: positive supports authentic, negative supports forged. */
export function evidenceScore(checks: CheckResult[]): number {
  return checks.reduce((s, c) => {
    const w = Math.log(c.reliability / (1 - c.reliability));
    return s + (c.signal === "consistent" ? w : -w);
  }, 0);
}

/** Verdict only when independent checks agree strongly. Otherwise stays UNKNOWN. */
export function verdict(l: Letter): Seal {
  const checks = l.checks ?? [];
  if (checks.length < 2) return "UNKNOWN";
  const s = evidenceScore(checks);
  if (s >= 2.2) return "AUTHENTIC";
  if (s <= -2.2) return "FORGED";
  return "UNKNOWN";
}

export interface InspectOutcome { letter: Letter; hours: number; cost: number; message: string }
export function inspectLetter(l: Letter, week: number, kind?: CheckKind): InspectOutcome {
  const k = kind ?? nextCheck(l);
  if (!k) return { letter: l, hours: 0, cost: 0, message: `Letter ${l.id}: every available check has been made.` };
  if ((l.checks ?? []).some((c) => c.kind === k)) return { letter: l, hours: 0, cost: 0, message: `Letter ${l.id}: ${k} check already made.` };
  const res = runCheck(l, k, week);
  const n: Letter = { ...l, checks: [...(l.checks ?? []), res] };
  const v = verdict(n);
  n.seal = v === "UNKNOWN" ? (l.seal === "AUTHENTIC" && !l.checks?.length ? l.seal : "UNKNOWN") : v;
  if (v !== "UNKNOWN") n.verified = v;
  const msg = v === "UNKNOWN"
    ? `Letter ${l.id}: ${res.note} Evidence is not yet conclusive (${n.checks!.length} check${n.checks!.length === 1 ? "" : "s"}).`
    : `Letter ${l.id}: ${res.note} Examiners now judge it ${v}.`;
  return { letter: n, hours: res.hours, cost: res.cost, message: msg };
}
/** Confidence band for the UI, never a raw number. */
export function confidenceBand(l: Letter): "none" | "low" | "moderate" | "high" {
  const n = (l.checks ?? []).length;
  if (n < 2) return n ? "low" : "none";
  const m = Math.abs(evidenceScore(l.checks!));
  return m >= 4 ? "high" : m >= 2.2 ? "moderate" : "low";
}
export { clamp };
