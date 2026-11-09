// Pure helpers shared by every V4.5 simulation module. No React, no store, no DOM.
export type Tier = "normal" | "important" | "critical" | "emergency";
export const TIER_RANK: Record<Tier, number> = { normal: 0, important: 1, critical: 2, emergency: 3 };
export const TIERS: Tier[] = ["normal", "important", "critical", "emergency"];

export const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

/** FNV-1a 32-bit hash. Deterministic across runs and platforms. */
export function hash(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}
/** Deterministic pseudo-random number in [0,1) derived from a seed string. */
export const rand01 = (seed: string) => (hash(seed) % 100000) / 100000;

export function toMin(hhmm: string): number | null {
  const m = /^\s*(\d{1,2}):(\d{2})\s*$/.exec(hhmm);
  if (!m) return null;
  const h = Number(m[1]);
  const mi = Number(m[2]);
  if (h > 23 || mi > 59) return null;
  return h * 60 + mi;
}
export function fromMin(min: number): string {
  const m = ((Math.round(min) % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}
export const absMin = (day: number, minute: number) => day * 1440 + minute;

/** Ratios 0..1 of the world stocks plus discrete gate / event flags. Supplied by the store. */
export interface WorldInputs {
  water: number;
  food: number;
  energy: number;
  gates?: Record<string, string>; // e.g. { east: "BREACHED" }
  outbreak?: boolean;
  fire?: boolean;
  cisternFailure?: boolean;
}
export const DEFAULT_WORLD: WorldInputs = { water: 0.7, food: 0.7, energy: 0.7, gates: {} };

export function pick<T>(arr: T[], seed: string): T {
  return arr[hash(seed) % arr.length];
}
