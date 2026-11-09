import type { Interrupt, SceneFooter } from "./types";

export function parseGm(raw: string): {
  scene: string;
  footer: SceneFooter;
  stateRaw: unknown;
  stateMissing: boolean;
} {
  const sceneMatch = raw.match(/<<<SCENE>>>\s*([\s\S]*?)\s*<<<FOOTER>>>/i);
  const footerMatch = raw.match(/<<<FOOTER>>>\s*([\s\S]*?)\s*<<<(?:STATE|END)>>>/i);
  const stateStart = raw.search(/<<<STATE>>>/i);
  const endMatch = raw.match(/<<<END>>>/i);
  const stateEnd = endMatch?.index ?? -1;
  const hasCompleteStateEnvelope = stateStart >= 0 && stateEnd > stateStart;
  const stateMatch = hasCompleteStateEnvelope
    ? raw.slice(stateStart).match(/<<<STATE>>>\s*([\s\S]*?)\s*<<<END>>>/i)
    : null;
  const sceneFallback = raw.replace(/<<<STATE>>>[\s\S]*$/i, "").replace(/<<<FOOTER>>>[\s\S]*$/i, "");
  const scene = (sceneMatch?.[1] ?? stripFences(sceneFallback)).trim();
  const footerBlock = footerMatch?.[1] ?? "";
  const pick = (label: string) => {
    const m = footerBlock.match(new RegExp(`${label}:\\s*(.+)`, "i"));
    return m?.[1]?.trim();
  };
  const interruptRaw = (pick("Interrupt") ?? "normal").toLowerCase();
  const interrupt: Interrupt = ["important", "critical", "emergency"].includes(interruptRaw)
    ? (interruptRaw as Interrupt)
    : "normal";

  let stateRaw: unknown = null;
  let stateMissing = true;
  if (footerMatch && hasCompleteStateEnvelope && stateMatch?.[1]) {
    const jsonText = stateMatch[1].trim().replace(/^```(?:json)?\s*|\s*```$/g, "");
    try {
      stateRaw = JSON.parse(jsonText);
      stateMissing = false;
    } catch {
      const repaired = jsonText.replace(/,\s*([}\]])/g, "$1");
      try {
        stateRaw = JSON.parse(repaired);
        stateMissing = false;
      } catch {
        stateRaw = null;
        stateMissing = true;
      }
    }
  }

  return {
    scene,
    footer: {
      time: pick("Time") ?? "—",
      day: pick("Day") ?? "Ironday, 20 Ironmonth 105 AW",
      floor: pick("Floor") ?? "the Dome",
      interrupt,
      prompt: pick("Prompt") ?? "Open the Platform",
    },
    stateRaw,
    stateMissing,
  };
}

function stripFences(s: string) {
  return s.replace(/<<<SCENE>>>|<<<FOOTER>>>|<<<STATE>>>|<<<END>>>/gi, "").trim();
}
