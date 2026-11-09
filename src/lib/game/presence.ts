import { CAST } from "./kernel";
import { absMin } from "./sim/core.ts";
import { absentees, cleanName, npcNow, type NpcCard, type NpcNow } from "./sim/npc.ts";
import type { P4State } from "./p4-simulation";

/** Cast cards shaped for the life engine. Names are the cleaned keys used by rollNpcDay. */
export function castCards(): NpcCard[] {
  return CAST.map((c) => ({
    name: c.name,
    role: c.role,
    fields: { DAY: c.day, FEARS: c.fears, WANTS: c.wants },
  }));
}

export const CAST_LIFE_NAMES: string[] = CAST.map((c) => cleanName(c.name));

function absOf(dayIndex: number, time: string): number {
  const hh = Number.parseInt(time.slice(0, 2), 10);
  const mm = Number.parseInt(time.slice(3, 5), 10);
  const minute = (Number.isFinite(hh) ? hh : 0) * 60 + (Number.isFinite(mm) ? mm : 0);
  return absMin(dayIndex, minute);
}

/** Current place, activity and reachability for every cast card. No private scores. */
export function castNow(p4: P4State, dayIndex: number, time: string): NpcNow[] {
  const abs = absOf(dayIndex, time);
  const statuses = p4.npcStatus ?? {};
  const seen: Record<string, NpcNow> = {};
  const rows: NpcNow[] = [];
  for (const card of castCards()) {
    const row = npcNow(card, abs, statuses[cleanName(card.name)], seen);
    seen[row.name] = row;
    rows.push(row);
  }
  return rows;
}

/** Ill or out on an errand — the only absences the hall and the message desk post. */
export function castAbsentees(p4: P4State, dayIndex: number, time: string): NpcNow[] {
  return absentees(castCards(), p4.npcStatus ?? {}, absOf(dayIndex, time));
}

export function availabilityLabel(n: NpcNow): string {
  if (n.reason === "illness") return "ill";
  if (n.reason === "errand") return "on errand";
  if (n.available) return "available";
  if (n.kind === "rest") return "resting";
  return "away";
}
