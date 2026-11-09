import type { RichOption } from "../../platform/options/effects.ts";
import type { WorldInputs } from "./core.ts";
import { clamp } from "./core.ts";

export interface MinistryDef { id: string; ministry: string; bias: string; lens: (w: WorldInputs) => { stance: number; text: string } }
const lvl = (r: number) => (r < 0.25 ? "critically low" : r < 0.5 ? "thin" : "adequate");

export const MINISTRIES: MinistryDef[] = [
  { id: "CM-1", ministry: "War", bias: "readiness first", lens: (w) => { const b = Object.values(w.gates ?? {}).some((g) => g !== "NORMAL"); return { stance: b ? 1 : 0, text: b ? "War asks for every spare rifle and watch rotation on the gate until it is secure." : "War reports readiness lists are current and requests budget for ammunition components." }; } },
  { id: "CM-2", ministry: "Treasury", bias: "preserve marks and trade", lens: (w) => ({ stance: w.food < 0.3 ? 1 : -1, text: w.food < 0.3 ? "Treasury will fund emergency purchases but wants the rail trade protected." : "Treasury opposes new spending until foreign purchase patterns are understood." }) },
  { id: "CM-3", ministry: "Stores", bias: "count what we have", lens: (w) => ({ stance: w.food < 0.5 ? 1 : 0, text: `Stores finds food stock ${lvl(w.food)} and wants an inventory before any decree.` }) },
  { id: "CM-4", ministry: "Energy/Water/Food", bias: "systems fail together", lens: (w) => { const m = Math.min(w.water, w.food, w.energy); return { stance: m < 0.3 ? 1 : 0, text: `Water ${lvl(w.water)}, energy ${lvl(w.energy)}: failures propagate across sectors, so act on the lowest first.` }; } },
  { id: "CM-5", ministry: "Science", bias: "verified before attractive", lens: () => ({ stance: -1, text: "Science will not endorse a theory about the surface until it is observed twice." }) },
  { id: "CM-6", ministry: "Recreation/Funeral", bias: "cohesion", lens: (w) => ({ stance: w.food < 0.3 ? -1 : 1, text: w.food < 0.3 ? "Recreation proposes a modest rite to keep the wards steady through the shortage." : "Recreation asks that the Hall calendar and funerals be kept on schedule." }) },
  { id: "CM-7", ministry: "Bound Workers", bias: "registry visibility", lens: () => ({ stance: 0, text: "Bound Workers asks that any labor levy be entered in the registry first, so no one disappears from it." }) },
  { id: "CM-8", ministry: "Medicine", bias: "prevention", lens: (w) => ({ stance: w.outbreak ? 1 : 0, text: w.outbreak ? "Medicine wants quarantine now and will argue against any gathering." : "Medicine supports free care and a standing prevention budget." }) },
  { id: "CM-9", ministry: "Recycling/Repair", bias: "repair is production", lens: (w) => ({ stance: w.energy < 0.4 ? 1 : 0, text: "Repair argues that restored tools and recovered components beat new orders." }) },
];

export interface CouncilSeat { id: string; ministry: string; stance: number; position: string }
export function councilPositions(w: WorldInputs): CouncilSeat[] {
  return MINISTRIES.map((m) => { const l = m.lens(w); return { id: m.id, ministry: m.ministry, stance: clamp(l.stance, -1, 1), position: l.text }; });
}

/** A Council plan is command metadata only. The catalog's RichOption.effects remain
 * the sole authoritative effect contract and are applied by the shared option runner. */
export interface CouncilDecreePlan {
  commandId: string;
  seat: CouncilSeat;
  option: RichOption;
}

export type CouncilDecreePlanResult =
  | { ok: true; plan: CouncilDecreePlan }
  | { ok: false; reason: string };

/** Build a stable command identity from the option and in-world minute. */
export function planCouncilDecree(
  world: WorldInputs,
  seatId: string,
  option: RichOption,
  day: number,
  minute: number,
): CouncilDecreePlanResult {
  if (!/^CM-[1-9]$/.test(seatId)) return { ok: false, reason: "Unknown council seat." };
  if (!option || option.id !== "24-OPT-02" || option.panelId !== "24" || !option.title?.trim()) {
    return { ok: false, reason: "The Council decree does not match the authoritative panel 24 catalog order." };
  }
  if (!Array.isArray(option.effects) || !Array.isArray(option.requires) || !option.costs) {
    return { ok: false, reason: "The Council catalog order is incomplete." };
  }
  if (!Number.isSafeInteger(day) || day < 0 || !Number.isSafeInteger(minute) || minute < 0 || minute >= 1440) {
    return { ok: false, reason: "The campaign clock is invalid; the decree was not stamped." };
  }
  const seat = councilPositions(world).find((row) => row.id === seatId);
  if (!seat) return { ok: false, reason: "The selected council seat is not available." };
  return {
    ok: true,
    plan: {
      commandId: `council-decree:${option.id}:${day}:${minute}`,
      seat,
      option,
    },
  };
}
