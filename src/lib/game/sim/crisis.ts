import { absMin, clamp, TIER_RANK, type Tier, type WorldInputs } from "./core.ts";

export interface Crisis {
  active: boolean;
  title: string;
  severity: Tier;
  deadlineHours: number;
  options: string[];
  id?: string;
  kind?: string;
  stage?: number;
  openedAtMin?: number;
  /** Gate IDs captured when a gate-breach crisis opens; keeps later outcomes targeted. */
  affectedGateIds?: string[];
}
export interface CrisisDef {
  kind: string;
  tier: Tier;
  deadlineHours: number;
  trigger: (w: WorldInputs, sectorSigns?: Record<string, number>) => boolean;
  stages: string[]; // title per stage; last stage failing = consequence
  options: string[];
  aftermath: string;
  failure: string;
}

export const CRISIS_DEFS: CrisisDef[] = [
  { kind: "water", tier: "critical", deadlineHours: 24, trigger: (w) => w.water < 0.2, stages: ["Water Shortage", "Water Rationing Riot Risk", "Cistern Dry"], options: ["Ration water by ward", "Open emergency reserve", "Import water by rail"], aftermath: "Water rationing recorded in the Chronicle; wards recover over three days.", failure: "Wards go dry; unrest and sickness follow." },
  { kind: "food", tier: "critical", deadlineHours: 36, trigger: (w) => w.food < 0.2, stages: ["Food Shortage", "Ration Queues Form", "Hunger in the Tunnels"], options: ["Cut portions evenly", "Prioritize workers and guard", "Open the Stores reserve"], aftermath: "Ration books reissued; the Stores Ministry files a recovery plan.", failure: "Queues break; the Market Tunnel closes." },
  { kind: "energy", tier: "important", deadlineHours: 48, trigger: (w) => w.energy < 0.15, stages: ["Energy Shortfall", "Forge Brownout", "Radiators Fail"], options: ["Throttle non-essential wards", "Divert Forge output", "Order geothermal inspection"], aftermath: "Radiator schedules restored; Forge crews logged overtime.", failure: "Radiators fail in the outer wards." },
  { kind: "gate", tier: "emergency", deadlineHours: 3, trigger: (w) => Object.values(w.gates ?? {}).some((g) => g === "BREACHED"), stages: ["Gate Breached", "Breach Spreads", "Gate Falls"], options: ["Reinforce the gate", "Seal inner doors", "Evacuate the outer ward"], aftermath: "The breach is contained; the Chronicle records the cost.", failure: "The gate falls; the state crosses a line that cannot be narrated away." },
  { kind: "outbreak", tier: "critical", deadlineHours: 12, trigger: (w) => !!w.outbreak, stages: ["Outbreak Reported", "Infirmary Overflow", "Quarantine Breach"], options: ["Quarantine the ward", "Open the Infirmary annex", "Restrict gatherings"], aftermath: "Quarantine lifted by the Ministry of Medicine.", failure: "The outbreak crosses ward lines." },
  { kind: "fire", tier: "emergency", deadlineHours: 2, trigger: (w) => !!w.fire, stages: ["Fire in the Tunnels", "Fire Spreads", "Section Lost"], options: ["Send fire crews", "Seal the section", "Evacuate residents"], aftermath: "The fire is out; Repair Ministry begins a survey.", failure: "A tunnel section is lost." },
  { kind: "cistern", tier: "critical", deadlineHours: 8, trigger: (w) => !!w.cisternFailure, stages: ["Cistern Failure", "Pressure Loss", "West Wards Dry"], options: ["Dispatch repair crews", "Switch to reserve pumps", "Ration downstream wards"], aftermath: "Cistern repaired; pressure schedules restored.", failure: "The west wards lose water." },
  { kind: "monster", tier: "important", deadlineHours: 12, trigger: (_w, s) => (s?.east ?? 0) >= 4 || (s?.["lost-lines"] ?? 0) >= 5, stages: ["Monster Warning", "Wall Contact", "Surface Incursion"], options: ["Increase watch", "Order wall inspection", "Launch surface survey"], aftermath: "Watch rotas revised; signs are logged for the Bestiary.", failure: "Contact on the wall; the east watch is stretched." },
];

/** Fractions of capacity applied to world stocks. Resolved is the cost or recovery of a choice; failed is the loss. */
export interface CrisisStockDelta {
  water: number;
  food: number;
  energy: number;
}

export const CRISIS_STOCK_EFFECTS: Record<string, { resolved: CrisisStockDelta; failed: CrisisStockDelta }> = {
  water: { resolved: { water: 0.05, food: 0, energy: 0 }, failed: { water: -0.12, food: -0.02, energy: 0 } },
  food: { resolved: { water: 0, food: 0.05, energy: 0 }, failed: { water: 0, food: -0.14, energy: 0 } },
  energy: { resolved: { water: 0, food: 0, energy: 0.04 }, failed: { water: 0, food: -0.02, energy: -0.1 } },
  gate: { resolved: { water: 0, food: -0.02, energy: -0.03 }, failed: { water: -0.04, food: -0.06, energy: -0.08 } },
  outbreak: { resolved: { water: -0.02, food: -0.02, energy: 0 }, failed: { water: -0.05, food: -0.06, energy: -0.03 } },
  fire: { resolved: { water: -0.04, food: -0.01, energy: -0.03 }, failed: { water: -0.06, food: -0.05, energy: -0.08 } },
  cistern: { resolved: { water: 0.04, food: 0, energy: -0.01 }, failed: { water: -0.14, food: 0, energy: -0.02 } },
  monster: { resolved: { water: 0, food: -0.01, energy: -0.02 }, failed: { water: 0, food: -0.04, energy: -0.04 } },
};

const ZERO_STOCK: CrisisStockDelta = { water: 0, food: 0, energy: 0 };

/** Conservative gameplay tuning: resolved crises steady morale; failures reduce it. */
export const CRISIS_MORALE_EFFECTS: Record<string, { resolved: number; failed: number }> = {
  water: { resolved: 1, failed: -2 },
  food: { resolved: 1, failed: -3 },
  energy: { resolved: 1, failed: -2 },
  gate: { resolved: 1, failed: -4 },
  outbreak: { resolved: 1, failed: -3 },
  fire: { resolved: 1, failed: -3 },
  cistern: { resolved: 1, failed: -2 },
  monster: { resolved: 1, failed: -2 },
};

export function crisisMoraleEffect(kind: string | undefined, outcome: "resolved" | "failed"): number {
  return kind ? CRISIS_MORALE_EFFECTS[kind]?.[outcome] ?? 0 : 0;
}

/** Lookup for the store. Unknown kinds move nothing. Returns a copy so callers cannot mutate the table. */
export function crisisStockEffect(kind: string | undefined, outcome: "resolved" | "failed"): CrisisStockDelta {
  const row = kind ? CRISIS_STOCK_EFFECTS[kind] : undefined;
  const delta = row?.[outcome] ?? ZERO_STOCK;
  return { water: delta.water, food: delta.food, energy: delta.energy };
}

const def = (kind?: string) => CRISIS_DEFS.find((d) => d.kind === kind);
const nextTier = (t: Tier): Tier => (t === "normal" ? "important" : t === "important" ? "critical" : "emergency");

export interface CrisisHost {
  crisis: Crisis | null;
  crisisBacklog?: string[];
  crisisHistory?: Array<{ kind: string; outcome: "resolved" | "failed"; atMin: number; affectedGateIds?: string[] }>;
  chronicleNotes?: string[];
  queue: Array<{ id: string; dueDay: number; label: string; source: string; visibility: "public" | "private" | "secret" }>;
  log: string[];
}

/** Spawn the highest-tier crisis whose trigger holds. Extra triggers wait in the backlog. */
export function spawnCrisis<T extends CrisisHost>(p: T, world: WorldInputs, nowMin: number, signs?: Record<string, number>): T {
  const live = CRISIS_DEFS.filter((d) => d.trigger(world, signs));
  const openKind = p.crisis?.active ? p.crisis.kind : undefined;
  // Re-evaluate the backlog against current world conditions on every spawn pass.
  // This drops stale queued crises whose trigger has cleared and deduplicates old saves.
  const liveKinds = new Set(live.map((d) => d.kind));
  const pendingKinds = [...new Set([...(p.crisisBacklog ?? []), ...live.map((d) => d.kind)])]
    .filter((kind) => kind !== openKind && liveKinds.has(kind));
  const pending = pendingKinds
    .map((kind) => CRISIS_DEFS.find((d) => d.kind === kind))
    .filter((d): d is CrisisDef => Boolean(d))
    .sort((a, b) => TIER_RANK[b.tier] - TIER_RANK[a.tier]);
  const n = structuredClone(p);
  if (n.crisis?.active) {
    if (!pending.length) {
      n.crisisBacklog = [];
      return n;
    }
    // A higher tier pre-empts; otherwise all still-live conditions wait in priority order.
    const top = pending[0];
    if (TIER_RANK[top.tier] > TIER_RANK[n.crisis.severity]) {
      const stillLiveOpen = n.crisis.kind && liveKinds.has(n.crisis.kind) ? [n.crisis.kind] : [];
      n.crisisBacklog = [...new Set([...stillLiveOpen, ...pending.slice(1).map((d) => d.kind)])];
      n.crisis = open0(top, nowMin, world);
      n.log.unshift(`${top.stages[0]} pre-empts the open crisis.`);
    } else {
      n.crisisBacklog = pending.map((d) => d.kind);
    }
    return n;
  }
  if (!pending.length) {
    n.crisisBacklog = [];
    return n;
  }
  const top = pending[0];
  n.crisis = open0(top, nowMin, world);
  n.crisisBacklog = pending.slice(1).map((d) => d.kind);
  n.log.unshift(`${top.stages[0]} opened; decision window ${top.deadlineHours}h.`);
  return n;
}
const open0 = (d: CrisisDef, nowMin: number, world?: WorldInputs): Crisis => ({
  active: true,
  id: `CR-${d.kind}-${nowMin}`,
  kind: d.kind,
  title: d.stages[0],
  severity: d.tier,
  deadlineHours: d.deadlineHours,
  options: [...d.options],
  stage: 0,
  openedAtMin: nowMin,
  ...(d.kind === "gate" ? {
    affectedGateIds: Object.entries(world?.gates ?? {})
      .filter(([, status]) => status === "BREACHED")
      .map(([id]) => id)
      .sort(),
  } : {}),
});

/** Burn hours off the crisis deadline. Expiry escalates a stage; the last stage fails. */
export function tickCrisis<T extends CrisisHost>(p: T, hours: number, nowMin: number): T {
  if (!p.crisis?.active || hours <= 0) return p;
  const n = structuredClone(p);
  let left = hours;
  const c = n.crisis!;
  const d = def(c.kind);
  while (left > 0 && n.crisis?.active) {
    const cc = n.crisis;
    if (left < cc.deadlineHours) { cc.deadlineHours -= left; left = 0; break; }
    left -= cc.deadlineHours;
    const stage = (cc.stage ?? 0) + 1;
    if (!d || stage >= d.stages.length) {
      n.log.unshift(`Crisis failed: ${d?.failure ?? "no decision was made"}`);
      n.chronicleNotes = [...(n.chronicleNotes ?? []), `${cc.title}: ${d?.failure ?? "unresolved"}`];
      n.crisisHistory = [...(n.crisisHistory ?? []), { kind: cc.kind ?? "unknown", outcome: "failed", atMin: nowMin, ...(cc.affectedGateIds?.length ? { affectedGateIds: [...cc.affectedGateIds] } : {}) }];
      n.queue.push({ id: `Q-fail-${cc.kind}-${nowMin}`, dueDay: Math.floor(nowMin / 1440) + 1, label: `Recovery from failed response: ${cc.title}`, source: "crisis", visibility: "public" });
      n.crisis = null;
      break;
    }
    cc.stage = stage;
    cc.title = d.stages[stage];
    cc.severity = nextTier(cc.severity);
    cc.deadlineHours = Math.max(1, Math.round(d.deadlineHours / 2));
    n.log.unshift(`Crisis escalates: ${cc.title} (${cc.severity}).`);
  }
  // Backlog activation is deferred until spawnCrisis receives fresh world inputs.
  // That pass rechecks each queued trigger before opening another crisis.
  return n;
}

export function resolveCrisis<T extends CrisisHost>(p: T, choice: string, nowMin = 0): T {
  if (!p.crisis?.active) return p;
  const n = structuredClone(p);
  const c = n.crisis!;
  const d = def(c.kind);
  if (!d?.options.includes(choice)) {
    n.log.unshift(`Crisis response rejected: "${choice}" is not an available response for ${c.title}.`);
    return n;
  }
  n.log.unshift(`Crisis response: ${choice}`);
  const day = Math.floor(nowMin / 1440);
  // aftermath/recovery chain: queued consequences + Chronicle / Chapter Card note
  n.queue.push({ id: `Q-rec1-${c.kind}-${nowMin}`, dueDay: day + 1, label: `Aftermath review: ${c.title} (${choice})`, source: "crisis", visibility: "public" });
  n.queue.push({ id: `Q-rec3-${c.kind}-${nowMin}`, dueDay: day + 3, label: `Recovery report: ${d?.aftermath ?? c.title}`, source: "crisis", visibility: "public" });
  n.chronicleNotes = [...(n.chronicleNotes ?? []), `${c.title}: answered with "${choice}". ${d?.aftermath ?? ""}`.trim()];
  n.crisisHistory = [...(n.crisisHistory ?? []), { kind: c.kind ?? "unknown", outcome: "resolved", atMin: nowMin, ...(c.affectedGateIds?.length ? { affectedGateIds: [...c.affectedGateIds] } : {}) }];
  n.crisis = null;
  // The next spawn pass revalidates queued conditions against the then-current world.
  return n;
}

/** Highest interruption tier currently demanding the player's attention. */
export function interruptTier(p: { crisis: Crisis | null }): Tier {
  return p.crisis?.active ? p.crisis.severity : "normal";
}
/**
 * Does an advance request stop here? emergency always stops; critical stops unless
 * the player explicitly waived it (`allowCritical`); important/normal stop only if `stopAtImportant`.
 */
export function shouldInterrupt(tier: Tier, opts: { allowCritical?: boolean; stopAtImportant?: boolean } = {}): boolean {
  if (tier === "emergency") return true;
  if (tier === "critical") return !opts.allowCritical;
  if (tier === "important") return !!opts.stopAtImportant;
  return false;
}
export { absMin, clamp };
