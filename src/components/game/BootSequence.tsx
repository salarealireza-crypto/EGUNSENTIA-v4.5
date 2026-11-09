import { useEffect, useState } from "react";
import { ClawMark } from "./ClawMark";
import { IndustrialViz } from "./IndustrialViz";

const LINES = [
  "GEOTHERMAL TAP · NOMINAL",
  "SUBSTATION 4 · ONLINE",
  "MARK IV HEART CELLS · 1000 ACCOUNTED",
  "VOICE OF THE FIST · 91.4",
  "NORTH GATE · NORMAL",
  "EAST WATCH · HEIGHTENED",
  "BLACK LAYER · SEALED",
  "FIST AUTHORITY · WAITING",
];

export function BootSequence({ onDone, compact }: { onDone?: () => void; compact?: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduced) {
      setN(LINES.length);
      onDone?.();
      return;
    }
    const id = window.setInterval(() => {
      setN((v) => {
        if (v >= LINES.length) {
          window.clearInterval(id);
          onDone?.();
          return v;
        }
        return v + 1;
      });
    }, 220);
    return () => window.clearInterval(id);
  }, [onDone]);

  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      <IndustrialViz mode="boot" className={compact ? "h-28 w-full" : "h-40 w-full"} />
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
        {LINES.slice(0, n).map((line) => (
          <p key={line} className="py-0.5 text-term">
            {line}
          </p>
        ))}
        {n < LINES.length ? <p className="term-blink">INITIALIZING…</p> : null}
      </div>
      {!compact ? <ClawMark className="size-8 text-accent" /> : null}
    </div>
  );
}
