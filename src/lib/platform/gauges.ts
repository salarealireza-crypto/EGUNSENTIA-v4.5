/** Player-facing gauge words. Hidden stock figures never leave this module. */

export type BandWord = "Plenty" | "Steady" | "Thin" | "Short" | "Failing";
export type GaugeArrow = "up" | "down" | "flat";

export function ratioBand(ratio: number): BandWord {
  if (ratio >= 0.8) return "Plenty";
  if (ratio >= 0.55) return "Steady";
  if (ratio >= 0.35) return "Thin";
  if (ratio >= 0.18) return "Short";
  return "Failing";
}

export function indexBand(n: number): BandWord {
  return ratioBand((Number.isFinite(n) ? n : 0) / 10);
}

export function bandRank(b: BandWord): number {
  return { Failing: 0, Short: 1, Thin: 2, Steady: 3, Plenty: 4 }[b];
}

export function isLow(b: BandWord): boolean {
  return bandRank(b) <= 2;
}

export interface GaugeReading {
  key: string;
  label: string;
  word: BandWord;
  arrow: GaugeArrow;
}

export function resourceGauge(key: string, label: string, stock: number, capacity: number, shift?: GaugeArrow): GaugeReading {
  const word = ratioBand(capacity > 0 ? stock / capacity : 0);
  return { key, label, word, arrow: shift ?? "flat" };
}
