import type { P4State } from "../p4-simulation.ts";

export const RESEARCH_PROJECTS = [
  { id: "filter-recovery", title: "Filter Recovery Protocol", summary: "Improve the reliability of reclaimed filtration assemblies.", cost: 120, durationDays: 4, reward: { good: "filters", production: 2 }, materials: [["filters", 8], ["glass", 5], ["chemical feedstock", 4]] },
  { id: "rail-bearing", title: "Rail Bearing Refurbishment", summary: "Standardize bearing inspection and refurbishment for the northern rail line.", cost: 180, durationDays: 6, reward: { good: "machine bearings", production: 1 }, materials: [["machine bearings", 4], ["rail steel", 8]] },
  { id: "signal-grid", title: "Signal Grid Maintenance", summary: "Restore a controlled stock of copper wire and salvage electronics for signal repairs.", cost: 150, durationDays: 5, reward: { good: "copper wire", production: 2 }, materials: [["copper wire", 10], ["salvageable electronics", 3]] },
] as const;

export type ResearchProject = (typeof RESEARCH_PROJECTS)[number];
export type ResearchProgress = { status: "active" | "completed"; startedDay: number; dueDay: number; progress: number; completedDay?: number };
export type ResearchResult = { ok: true; state: P4State } | { ok: false; reason: "already-commissioned" | "insufficient-materials" | "missing-economy" };

/** Reserve the listed stock and record an R&D allotment. Commissioning is not completion. */
export function commissionResearch(state: P4State, projectId: string): ResearchResult {
  const project = RESEARCH_PROJECTS.find((item) => item.id === projectId);
  if (!project) return { ok: false, reason: "missing-economy" };
  if (state.flags?.[`research:${project.id}`]) return { ok: false, reason: "already-commissioned" };
  if (!state.economy) return { ok: false, reason: "missing-economy" };
  for (const [good, amount] of project.materials) {
    if ((state.economy[good]?.stock ?? 0) < amount) return { ok: false, reason: "insufficient-materials" };
  }
  const economy = structuredClone(state.economy);
  for (const [good, amount] of project.materials) economy[good].stock -= amount;
  const note = `RESEARCH COMMISSIONED · ${project.title} · ${state.now?.day ?? 0}`;
  return {
    ok: true,
    state: {
      ...state,
      economy,
      spent: { marks: (state.spent?.marks ?? 0) + project.cost, hours: state.spent?.hours ?? 0 },
      flags: { ...state.flags, [`research:${project.id}`]: true },
      researchProjects: { ...state.researchProjects, [project.id]: { status: "active", startedDay: state.now?.day ?? 0, dueDay: (state.now?.day ?? 0) + project.durationDays, progress: 0 } },
      deskNotes: [note, ...(state.deskNotes ?? [])].slice(0, 40),
      log: [note, ...state.log].slice(0, 200),
    },
  };
}

/** Advance active projects once per in-game day; completion permanently improves the relevant production line. */
export function tickResearchDay(state: P4State, day: number): P4State {
  const projects = state.researchProjects ?? {};
  let changed = false;
  const next = { ...projects };
  let economy = state.economy ? structuredClone(state.economy) : undefined;
  const notes: string[] = [];
  for (const project of RESEARCH_PROJECTS) {
    const current = projects[project.id];
    if (!current || current.status !== "active") continue;
    const span = Math.max(1, current.dueDay - current.startedDay);
    const progress = Math.max(0, Math.min(100, Math.round(((day - current.startedDay) / span) * 100)));
    if (day >= current.dueDay) {
      next[project.id] = { ...current, status: "completed", progress: 100, completedDay: day };
      if (economy?.[project.reward.good]) economy[project.reward.good].production += project.reward.production;
      notes.push(`RESEARCH COMPLETED · ${project.title} · production +${project.reward.production} ${project.reward.good}/day`);
    } else {
      next[project.id] = { ...current, progress };
    }
    changed = true;
  }
  if (!changed) return state;
  return {
    ...state, researchProjects: next, ...(economy ? { economy } : {}),
    ...(notes.length ? { deskNotes: [...notes, ...(state.deskNotes ?? [])].slice(0, 40), log: [...notes, ...state.log].slice(0, 200) } : {}),
  };
}
