// Hidden-value leak scan (A4.5): exact Secret Clock / Relation numbers must never appear in player-visible text.
const HIDDEN = /\b(secret clock|trust|respect|fear|loyalty|closeness)\b[^.\n]{0,14}?(?:[:=]|\bis\b|\bat\b|\()\s*-?\d+(?:\.\d+)?(?:\s*\/\s*\d+)?/i;

export function collectStrings(v: unknown, out: string[] = [], depth = 0): string[] {
  if (depth > 6 || v == null) return out;
  if (typeof v === "string") out.push(v);
  else if (Array.isArray(v)) for (const x of v) collectStrings(x, out, depth + 1);
  else if (typeof v === "object") for (const x of Object.values(v as Record<string, unknown>)) collectStrings(x, out, depth + 1);
  return out;
}
export function leaks(strings: string[]): string[] {
  return strings.filter((s) => HIDDEN.test(s)).slice(0, 5);
}
