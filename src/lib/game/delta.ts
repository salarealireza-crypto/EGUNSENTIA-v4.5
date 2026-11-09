import { z } from "zod";
import { serializeSavePayload } from "./save-validation.mjs";
import { patchExistingByStableId } from "./identity-updates.mjs";
import { appendLedgerEvents } from "./sim/event-ledger.ts";
import {
  applyBoundaryReputationImpact,
  getPlayerWomenCanonProfiles,
  normalizePrivateRelations,
  recordBoundaryBreach,
  recordBoundaryBreachEvent,
  recordPregnancyEvidence,
  recordPregnancyEvent,
  recordPrivateRequestEvent,
  recordPrivateRelationshipDisclosure,
  recordPrivateRelationshipDisclosureEvent,
  resolvePrivateInteractionRequest,
} from "./sim/private-relations.ts";
import type {
  CalendarEvent,
  CaseItem,
  ChronicleEntry,
  Edict,
  EventLedgerEntry,
  FilmItem,
  FindItem,
  ForeignReport,
  GameSnapshot,
  GateStatus,
  HouseholdStatus,
  InboxItem,
  IntelReport,
  KinCard,
  Mystery,
  NewsItem,
  NewsTag,
  NpcMemory,
  PolicyKind,
  RadioStation,
  Relation,
  ReputationSlice,
  ResourceBlock,
  SecretClock,
  SortieRecord,
  Stalker,
  ThreadItem,
  TradeOffer,
  VaultItem,
  WorldNewsItem,
  WorldState,
} from "./types";

const newsTag = z.enum([
  "CONFIRMED",
  "INITIAL REPORT",
  "RUMOR",
  "DISPUTED",
  "CLASSIFIED",
  "OFFICIAL",
  "LOCAL REPORT",
  "INTELLIGENCE",
  "UNVERIFIED",
]);
const policy = z.enum(["normal", "ration", "reserve", "repair", "trade"]);
const inboxStatus = z.enum(["open", "answered", "delegated", "postponed", "verdict"]);
const stalkerStatus = z.enum(["ready", "rest", "sick", "on-sortie", "cleansing"]);
const num = z.number().finite();
const str = z.string().max(4000);

const resourcePatch = z
  .object({
    stock: num.optional(),
    capacity: num.optional(),
    production: num.optional(),
    consumption: num.optional(),
    unit: str.optional(),
    policy: policy.optional(),
  })
  .strict();

const inboxItem = z
  .object({
    id: str,
    from: str.optional(),
    office: str.optional(),
    time: str.optional(),
    body: str.optional(),
    status: inboxStatus.optional(),
    urgency: z.enum(["low", "normal", "important", "critical"]).optional(),
    deadline: str.optional(),
    glyph: str.optional(),
    delegate: str.optional(),
    verdict: str.optional(),
  })
  .strict();

export const stateDeltaSchema = z
  .object({
    clock: z
      .object({
        weekday: str.optional(),
        date: str.optional(),
        year: str.optional(),
        time: str.optional(),
        location: str.optional(),
        floor: str.optional(),
      })
      .partial()
      .strict()
      .optional(),
    resources: z
      .object({
        water: resourcePatch.optional(),
        food: resourcePatch.optional(),
        energy: resourcePatch.optional(),
      })
      .strict()
      .optional(),
    treasury: z
      .object({
        marks: num.optional(),
        income: num.optional(),
        expenses: num.optional(),
      })
      .partial()
      .strict()
      .optional(),
    arms: z
      .object({
        suitsReady: num.optional(),
        inRepair: num.optional(),
        rifles: num.optional(),
        ammo: num.optional(),
      })
      .partial()
      .strict()
      .optional(),
    population: z
      .object({
        house: num.optional(),
        soldiers: num.optional(),
        bound: num.optional(),
        redClaws: num.optional(),
        known: num.optional(),
      })
      .partial()
      .strict()
      .optional(),
    indices: z.record(z.string(), num).optional(),
    blocs: z
      .object({
        oldGuard: num.optional(),
        banners: num.optional(),
        works: num.optional(),
      })
      .partial()
      .strict()
      .optional(),
    surface: z
      .object({
        garrison: str.optional(),
        sorties: str.optional(),
        cleansing: str.optional(),
        weekSorties: num.optional(),
        weekLimit: num.optional(),
      })
      .partial()
      .strict()
      .optional(),
    inbox: z
      .object({
        new: z.array(inboxItem).optional(),
        updated: z.array(inboxItem).optional(),
        resolved: z.array(str).optional(),
      })
      .strict()
      .optional(),
    news: z
      .array(
        z
          .object({
            id: str,
            source: str,
            time: str.optional(),
            body: str,
            tag: newsTag.optional(),
            reliability: z.enum(["high", "medium", "low", "unverified"]).optional(),
          })
          .passthrough(),
      )
      .optional(),
    worldNews: z
      .array(
        z
          .object({
            id: str,
            headline: str,
            tag: newsTag,
            source: str.optional(),
            reliability: z.enum(["high", "medium", "low", "unverified"]).optional(),
            body: str,
          })
          .passthrough(),
      )
      .optional(),
    cases: z
      .object({
        new: z.array(z.record(z.string(), z.unknown())).optional(),
        updated: z.array(z.record(z.string(), z.unknown())).optional(),
        resolved: z.array(str).optional(),
      })
      .strict()
      .optional(),
    threads: z
      .array(
        z
          .object({
            id: str,
            title: str.optional(),
            kind: z.enum(["thread", "seed"]).optional(),
            summary: str.optional(),
            status: z.enum(["active", "dormant", "watched", "resolved"]).optional(),
          })
          .passthrough(),
      )
      .optional(),
    relations: z
      .array(
        z
          .object({
            name: str,
            trust: num.optional(),
            respect: num.optional(),
            fear: num.optional(),
            loyalty: num.optional(),
            closeness: num.optional(),
          })
          .passthrough(),
      )
      .optional(),
    secretClocks: z
      .array(
        z
          .object({
            id: str,
            label: str.optional(),
            value: num.optional(),
            max: num.optional(),
          })
          .passthrough(),
      )
      .optional(),
    calendar: z
      .object({
        new: z.array(z.record(z.string(), z.unknown())).optional(),
        updated: z.array(z.record(z.string(), z.unknown())).optional(),
      })
      .strict()
      .optional(),
    finds: z
      .object({
        new: z.array(z.record(z.string(), z.unknown())).optional(),
        updated: z.array(z.record(z.string(), z.unknown())).optional(),
      })
      .strict()
      .optional(),
    sorties: z
      .object({
        new: z.array(z.record(z.string(), z.unknown())).optional(),
        updated: z.array(z.record(z.string(), z.unknown())).optional(),
      })
      .strict()
      .optional(),
    stalkers: z.array(z.record(z.string(), z.unknown())).optional(),
    mysteries: z.array(z.record(z.string(), z.unknown())).optional(),
    foreignReports: z.array(z.record(z.string(), z.unknown())).optional(),
    kin: z.array(z.object({
      id: str,
      name: str.optional(),
      role: str.optional(),
      mood: str.optional(),
      ageYears: num.optional(),
    }).strict()).max(40).optional(),
    chronicle: z
      .object({
        line: str.optional(),
        canonChanges: z.array(str).optional(),
      })
      .strict()
      .optional(),
    edicts: z
      .object({
        new: z.array(z.record(z.string(), z.unknown())).optional(),
        updated: z.array(z.record(z.string(), z.unknown())).optional(),
      })
      .strict()
      .optional(),
    dice: z
      .array(
        z.object({
          die: str.optional(),
          result: num,
          reason: str.optional(),
          vs: num.optional(),
        }),
      )
      .optional(),
    quickActions: z.array(str).optional(),
    toasts: z
      .array(
        z.object({
          kind: z.enum(["message", "knock", "alert", "notice"]).optional(),
          text: str,
        }),
      )
      .optional(),
    rollingSummary: str.optional(),
    nightSummary: str.optional(),
    requestedDossier: str.nullable().optional(),
    household: z.array(z.object({
      id: str,
      name: str.optional(),
      title: str.optional(),
      mood: str.optional(),
      relation: str.optional(),
      affection: num.optional(),
      trend: z.enum(["rising", "steady", "cooling"]).optional(),
      misses: z.enum(["low", "medium", "high"]).optional(),
      lastInteraction: str.optional(),
      concern: str.optional(),
      request: str.optional(),
      available: z.boolean().optional(),
      tonight: str.optional(),
      chosenEvening: z.boolean().optional(),
      portraitHue: str.optional(),
    }).strict()).max(20).optional(),
    gates: z.array(z.record(z.string(), z.unknown())).optional(),
    trades: z
      .object({
        new: z.array(z.record(z.string(), z.unknown())).optional(),
        updated: z.array(z.record(z.string(), z.unknown())).optional(),
      })
      .strict()
      .optional(),
    films: z
      .object({
        new: z.array(z.record(z.string(), z.unknown())).optional(),
        updated: z.array(z.record(z.string(), z.unknown())).optional(),
      })
      .strict()
      .optional(),
    intel: z
      .object({
        new: z.array(z.record(z.string(), z.unknown())).optional(),
      })
      .strict()
      .optional(),
    events: z
      .object({
        new: z.array(z.record(z.string(), z.unknown())).max(100).optional(),
      })
      .strict()
      .optional(),
    personalVault: z
      .object({
        new: z.array(z.record(z.string(), z.unknown())).optional(),
        updated: z.array(z.record(z.string(), z.unknown())).optional(),
      })
      .strict()
      .optional(),
    factionVault: z
      .object({
        new: z.array(z.record(z.string(), z.unknown())).optional(),
        updated: z.array(z.record(z.string(), z.unknown())).optional(),
      })
      .strict()
      .optional(),
    memories: z
      .object({
        new: z.array(z.record(z.string(), z.unknown())).optional(),
      })
      .strict()
      .optional(),
    reputations: z.array(z.record(z.string(), z.unknown())).optional(),
    privateRelations: z
      .object({
        responses: z.array(z.object({
          requestId: str,
          outcome: z.enum(["accepted", "declined", "withdrawn", "cancelled"]),
          note: str.optional(),
          consentEvidence: str.optional(),
          freeToDeclineConfirmed: z.boolean().optional(),
          independentSafeguard: z.boolean().optional(),
          independentSafeguardEvidence: str.optional(),
        }).strict()).max(12).optional(),
        boundaryBreaches: z.array(z.object({ personId: str, evidence: str }).strict()).max(12).optional(),
        visibilityUpdates: z.array(z.object({ personId: str, visibility: z.enum(["known", "public"]), evidence: str }).strict()).max(12).optional(),
      })
      .strict()
      .optional(),
    // AL may record an in-world suspicion only. Confirmation and later states
    // require a separately documented medical action in the owner-facing desk.
    pregnancyUpdates: z.array(z.object({ mother: str, evidence: str }).strict()).max(8).optional(),
    radio: z.array(z.record(z.string(), z.unknown())).optional(),
    tonightFilm: str.nullable().optional(),
    radioFreq: num.optional(),
  })
  .strict();

export type StateDelta = z.infer<typeof stateDeltaSchema>;

function clamp(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

function clampIndex(n: number) {
  return clamp(Math.round(n), 0, 10);
}

function mergeResource(cur: ResourceBlock, patch?: z.infer<typeof resourcePatch>): ResourceBlock {
  if (!patch) return cur;
  const capacity = patch.capacity != null ? Math.max(0, patch.capacity) : Math.max(0, cur.capacity);
  const stock = clamp(patch.stock ?? cur.stock, 0, capacity);
  return {
    stock,
    capacity,
    production: Math.max(0, patch.production ?? cur.production),
    consumption: Math.max(0, patch.consumption ?? cur.consumption),
    unit: patch.unit ?? cur.unit,
    policy: (patch.policy as PolicyKind) ?? cur.policy,
  };
}

function mergeById<T extends { id: string }>(list: T[], incoming: Array<Partial<T> & { id: string }>): T[] {
  const next = [...list];
  for (const item of incoming) {
    const i = next.findIndex((x) => x.id === item.id);
    if (i >= 0) next[i] = { ...next[i], ...item };
    else next.unshift(item as T);
  }
  return next;
}

export interface ApplyResult {
  ok: boolean;
  notice?: string;
  toasts: { kind: "message" | "knock" | "alert" | "notice"; text: string }[];
  dice: { die: string; result: number; reason: string; vs?: number }[];
  nightSummary?: string;
  adjustments?: string[];
}

const FORBIDDEN_DELTA_KEYS = new Set(["proto", "__proto__", "prototype", "constructor"]);
const NULLABLE_DELTA_ROOT_KEYS = new Set(["requestedDossier", "tonightFilm"]);
function sanitizeDeltaInput(value: unknown, depth = 0, budget = { nodes: 0 }): unknown {
  if (depth > 12 || ++budget.nodes > 5000) throw new Error("Delta exceeds structural limits.");
  if (typeof value === "string") {
    if (value.length > 4000) throw new Error("Delta string exceeds its limit.");
    return value;
  }
  if (Array.isArray(value)) {
    if (value.length > 100) throw new Error("Delta array exceeds its limit.");
    const keys = Object.keys(value);
    if (keys.length !== value.length || keys.some((key, index) => key !== String(index))) {
      throw new Error("Delta contains an unsupported array property.");
    }
    return value.map((item) => sanitizeDeltaInput(item, depth + 1, budget));
  }
  if (value && typeof value === "object") {
    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null) {
      throw new Error("Delta contains an unsupported object.");
    }
    const source = value as Record<string, unknown>;
    const clean: Record<string, unknown> = {};
    for (const [key, child] of Object.entries(source)) {
      if (!key || key.length > 120) throw new Error("Delta property name exceeds its limit.");
      if (FORBIDDEN_DELTA_KEYS.has(key)) throw new Error("Delta contains a forbidden property.");
      if (child === null) {
        // Null means no change by default. Only schema-declared nullable root
        // fields retain null because their explicit meaning is to clear them.
        if (depth === 0 && NULLABLE_DELTA_ROOT_KEYS.has(key)) clean[key] = null;
        continue;
      }
      clean[key] = sanitizeDeltaInput(child, depth + 1, budget);
    }
    return clean;
  }
  if (typeof value === "number" && !Number.isFinite(value)) throw new Error("Delta contains a non-finite number.");
  return value;
}

export function parseStateDelta(raw: unknown): { delta: StateDelta | null; notice?: string } {
  if (raw == null) return { delta: null, notice: "The Platform kept the last numbers — the archive sent no state this turn." };
  let safeInput: unknown;
  try {
    safeInput = sanitizeDeltaInput(raw);
  } catch {
    return { delta: null, notice: "The Platform kept the last numbers — the archive state exceeded safety limits." };
  }
  const parsed = stateDeltaSchema.safeParse(safeInput);
  if (!parsed.success) {
    return {
      delta: null,
      notice: "The Platform kept the last numbers — the archive state could not be read.",
    };
  }
  for (const people of [parsed.data.kin, parsed.data.household]) {
    if (people) {
      const ids = people.map((person) => person.id);
      if (new Set(ids).size !== ids.length) {
        return { delta: null, notice: "The Platform kept the last numbers — the archive repeated a person identity." };
      }
    }
  }
  return { delta: parsed.data };
}

export function applyDelta(
  snap: GameSnapshot,
  delta: StateDelta,
): { next: GameSnapshot; result: ApplyResult } {
  const adjustments: string[] = [];
  for (const [group, patch] of Object.entries({
    treasury: delta.treasury,
    arms: delta.arms,
    population: delta.population,
    surface: delta.surface,
  })) {
    for (const [field, value] of Object.entries(patch ?? {})) {
      if (typeof value === "number" && value < 0) adjustments.push(`${group}:${field}`);
    }
  }
  for (const [resource, patch] of Object.entries(delta.resources ?? {})) {
    for (const field of ["stock", "capacity", "production", "consumption"] as const) {
      const value = patch?.[field];
      if (typeof value === "number" && value < 0) adjustments.push(`${resource}:${field}`);
    }
  }
  const world: WorldState = {
    ...snap.world,
    clock: { ...snap.world.clock, ...(delta.clock ?? {}) },
    water: mergeResource(snap.world.water, delta.resources?.water),
    food: mergeResource(snap.world.food, delta.resources?.food),
    energy: mergeResource(snap.world.energy, delta.resources?.energy),
    treasury: {
      marks: Math.max(0, delta.treasury?.marks ?? snap.world.treasury.marks),
      income: Math.max(0, delta.treasury?.income ?? snap.world.treasury.income),
      expenses: Math.max(0, delta.treasury?.expenses ?? snap.world.treasury.expenses),
    },
    arms: {
      suitsReady: Math.max(0, delta.arms?.suitsReady ?? snap.world.arms.suitsReady),
      inRepair: Math.max(0, delta.arms?.inRepair ?? snap.world.arms.inRepair),
      rifles: Math.max(0, delta.arms?.rifles ?? snap.world.arms.rifles),
      ammo: Math.max(0, delta.arms?.ammo ?? snap.world.arms.ammo),
    },
    population: {
      house: Math.max(0, delta.population?.house ?? snap.world.population.house),
      soldiers: Math.max(0, delta.population?.soldiers ?? snap.world.population.soldiers),
      bound: Math.max(0, delta.population?.bound ?? snap.world.population.bound),
      redClaws: Math.max(0, delta.population?.redClaws ?? snap.world.population.redClaws),
      known: Math.max(0, delta.population?.known ?? snap.world.population.known),
    },
    indices: { ...snap.world.indices },
    blocs: { ...snap.world.blocs, ...(delta.blocs ?? {}) },
    surface: {
      ...snap.world.surface,
      ...(delta.surface ?? {}),
      weekSorties: Math.max(0, delta.surface?.weekSorties ?? snap.world.surface.weekSorties),
      weekLimit: Math.max(0, delta.surface?.weekLimit ?? snap.world.surface.weekLimit),
    },
  };
  if (delta.indices) {
    for (const [k, v] of Object.entries(delta.indices)) {
      const bounded = clampIndex(v);
      if (bounded !== v) adjustments.push(`index:${k}`);
      world.indices[k] = bounded;
    }
  }
  for (const key of ["oldGuard", "banners", "works"] as const) {
    const bounded = clampIndex(world.blocs[key]);
    if (bounded !== world.blocs[key]) adjustments.push(`bloc:${key}`);
    world.blocs[key] = bounded;
  }

  let inbox = [...snap.inbox];
  if (delta.inbox?.new) {
    for (const item of delta.inbox.new) {
      if (!inbox.some((m) => m.id === item.id)) {
        inbox.unshift({
          id: item.id,
          from: item.from ?? "Unknown",
          office: item.office ?? "Hall",
          time: item.time ?? world.clock.time,
          body: item.body ?? "",
          status: item.status ?? "open",
          urgency: item.urgency,
          deadline: item.deadline,
          glyph: item.glyph,
          delegate: item.delegate,
          verdict: item.verdict,
        });
      }
    }
  }
  if (delta.inbox?.updated) inbox = mergeById(inbox, delta.inbox.updated as InboxItem[]);
  if (delta.inbox?.resolved) {
    inbox = inbox.map((m) =>
      delta.inbox!.resolved!.includes(m.id) ? { ...m, status: "answered" as const } : m,
    );
  }

  let news = snap.news;
  if (delta.news?.length) news = mergeById(news, delta.news as NewsItem[]);
  let worldNews = snap.worldNews;
  if (delta.worldNews?.length) worldNews = mergeById(worldNews, delta.worldNews as WorldNewsItem[]);

  let cases = snap.cases;
  if (delta.cases?.new) cases = mergeById(cases, delta.cases.new as unknown as CaseItem[]);
  if (delta.cases?.updated) cases = mergeById(cases, delta.cases.updated as unknown as CaseItem[]);
  if (delta.cases?.resolved) {
    cases = cases.map((c) =>
      delta.cases!.resolved!.includes(c.id) ? { ...c, status: "resolved" } : c,
    );
  }

  let threads = snap.threads;
  if (delta.threads?.length) threads = mergeById(threads, delta.threads as ThreadItem[]);

  let relations = snap.relations;
  if (delta.relations?.length) {
    const next = [...relations];
    for (const r of delta.relations) {
      const i = next.findIndex((x) => x.name === r.name);
      const patch: Relation = {
        name: r.name,
        trust: clampIndex(r.trust ?? (i >= 0 ? next[i].trust : 5)),
        respect: clampIndex(r.respect ?? (i >= 0 ? next[i].respect : 5)),
        fear: clampIndex(r.fear ?? (i >= 0 ? next[i].fear : 5)),
        loyalty: clampIndex(r.loyalty ?? (i >= 0 ? next[i].loyalty : 5)),
        closeness: clampIndex(r.closeness ?? (i >= 0 ? next[i].closeness : 5)),
      };
      if (i >= 0) next[i] = patch;
      else next.push(patch);
    }
    relations = next;
  }

  let secretClocks = snap.secretClocks;
  if (delta.secretClocks?.length) {
    secretClocks = mergeById(
      secretClocks,
      delta.secretClocks.map((c) => ({
        id: c.id,
        label: c.label,
        value: c.value != null ? clamp(c.value, 0, Math.max(0, c.max ?? 10)) : undefined,
        max: c.max != null ? Math.max(0, c.max) : undefined,
      })) as SecretClock[],
    );
  }

  let calendar = snap.calendar;
  if (delta.calendar?.new) calendar = mergeById(calendar, delta.calendar.new as unknown as CalendarEvent[]);
  if (delta.calendar?.updated) calendar = mergeById(calendar, delta.calendar.updated as unknown as CalendarEvent[]);

  let finds = snap.finds;
  if (delta.finds?.new) finds = mergeById(finds, delta.finds.new as unknown as FindItem[]);
  if (delta.finds?.updated) finds = mergeById(finds, delta.finds.updated as unknown as FindItem[]);

  let sorties = snap.sorties;
  if (delta.sorties?.new) sorties = mergeById(sorties, delta.sorties.new as unknown as SortieRecord[]);
  if (delta.sorties?.updated) sorties = mergeById(sorties, delta.sorties.updated as unknown as SortieRecord[]);

  let stalkers = snap.stalkers;
  if (delta.stalkers?.length) {
    stalkers = mergeById(
      stalkers,
      delta.stalkers.map((s) => {
        const dose = typeof s.dose === "number" ? clamp(s.dose, 0, 10) : undefined;
        const wear = typeof s.wear === "number" ? clamp(s.wear, 0, 3) : undefined;
        const sortiesInRotation =
          typeof s.sortiesInRotation === "number" ? clamp(s.sortiesInRotation, 0, 30) : undefined;
        return { ...s, dose, wear, sortiesInRotation };
      }) as unknown as Stalker[],
    );
  }

  let mysteries = snap.mysteries;
  if (delta.mysteries?.length) {
    mysteries = mergeById(
      mysteries,
      delta.mysteries.map((m) => ({
        ...m,
        clues: typeof m.clues === "number" ? clamp(m.clues, 0, Number(m.needed) || 6) : undefined,
      })) as unknown as Mystery[],
    );
  }

  let foreignReports = snap.foreignReports;
  if (delta.foreignReports?.length) {
    foreignReports = mergeById(foreignReports, delta.foreignReports as unknown as ForeignReport[]);
  }

  let kin = snap.kin;
  if (delta.kin?.length) {
    // AL may update known cast members, but cannot create a new named canon person.
    kin = patchExistingByStableId(kin, delta.kin).map((person) => {
      const patch = delta.kin!.find((candidate) => candidate.id === person.id);
      if (!patch) return person;
      if (patch.name && patch.name !== person.name) adjustments.push(`kin:${person.id}:name`);
      if (patch.role && patch.role !== person.role) adjustments.push(`kin:${person.id}:role`);
      const ageYears = patch.ageYears == null ? person.ageYears : Math.max(0, patch.ageYears);
      if (patch.ageYears != null && ageYears !== patch.ageYears) adjustments.push(`kin:${person.id}:ageYears`);
      // Names and kinship labels are canon identity, not AL-editable state.
      return { ...person, mood: patch.mood ?? person.mood, ageYears };
    });
  }

  let household = snap.household;
  if (delta.household?.length) {
    household = patchExistingByStableId(household, delta.household).map((person) => {
      const patch = delta.household!.find((candidate) => candidate.id === person.id);
      if (!patch) return person;
      if (patch.name && patch.name !== person.name) adjustments.push(`household:${person.id}:name`);
      if (patch.title && patch.title !== person.title) adjustments.push(`household:${person.id}:title`);
      if (patch.portraitHue && patch.portraitHue !== person.portraitHue) adjustments.push(`household:${person.id}:portraitHue`);
      const affection = patch.affection == null ? person.affection : clamp(patch.affection, 1, 10);
      if (patch.affection != null && affection !== patch.affection) adjustments.push(`household:${person.id}:affection`);
      const { id: _id, name: _name, title: _title, portraitHue: _portraitHue, ...statePatch } = patch;
      return { ...person, ...statePatch, affection };
    });
  }

  let gates = snap.gates;
  if (delta.gates?.length) {
    gates = mergeById(gates, delta.gates as unknown as GateStatus[]);
  }

  let trades = snap.trades;
  if (delta.trades?.new) trades = mergeById(trades, delta.trades.new as unknown as TradeOffer[]);
  if (delta.trades?.updated) trades = mergeById(trades, delta.trades.updated as unknown as TradeOffer[]);

  let films = snap.films;
  if (delta.films?.new) films = mergeById(films, delta.films.new as unknown as FilmItem[]);
  if (delta.films?.updated) films = mergeById(films, delta.films.updated as unknown as FilmItem[]);

  let intel = snap.intel;
  if (delta.intel?.new) intel = mergeById(intel, delta.intel.new as unknown as IntelReport[]);

  let events = snap.events;
  if (delta.events?.new) {
    const incoming = (delta.events.new as unknown as EventLedgerEntry[]).map((event) => ({
      ...event,
      year: event.year ?? world.clock.year,
    }));
    events = appendLedgerEvents(events, incoming);
  }

  let personalVault = snap.personalVault;
  if (delta.personalVault?.new) personalVault = mergeById(personalVault, delta.personalVault.new as unknown as VaultItem[]);
  if (delta.personalVault?.updated) personalVault = mergeById(personalVault, delta.personalVault.updated as unknown as VaultItem[]);

  let factionVault = snap.factionVault;
  if (delta.factionVault?.new) factionVault = mergeById(factionVault, delta.factionVault.new as unknown as VaultItem[]);
  if (delta.factionVault?.updated) factionVault = mergeById(factionVault, delta.factionVault.updated as unknown as VaultItem[]);

  let memories = snap.memories;
  if (delta.memories?.new) memories = [...(delta.memories.new as unknown as NpcMemory[]), ...memories].slice(0, 60);

  let reputations = snap.reputations;
  if (delta.reputations?.length) {
    const nextRep = [...reputations];
    for (const r of delta.reputations as unknown as ReputationSlice[]) {
      const i = nextRep.findIndex((x) => x.name === r.name && x.audience === r.audience);
      if (i >= 0) nextRep[i] = { ...nextRep[i], ...r };
      else nextRep.push(r);
    }
    reputations = nextRep;
  }

  let privateRelations = normalizePrivateRelations(snap.privateRelations);
  let pregnancies = [...snap.pregnancies];
  const privateRelationEvents: EventLedgerEntry[] = [];
  const eventDate = world.clock.date;
  const eventYear = world.clock.year;
  const eventTime = world.clock.time;
  const eventLocation = world.clock.floor || world.clock.location || "Unknown";

  for (const response of delta.privateRelations?.responses ?? []) {
    const resolved = resolvePrivateInteractionRequest(privateRelations, response.requestId, response.outcome, {
      dayIndex: world.dayIndex,
      time: eventTime,
      note: response.note,
      consentEvidence: response.consentEvidence,
      freeToDeclineConfirmed: response.freeToDeclineConfirmed,
      independentSafeguard: response.independentSafeguard,
      independentSafeguardEvidence: response.independentSafeguardEvidence,
    });
    if (!resolved.ok || !resolved.request) {
      return { next: snap, result: { ok: false, notice: `The Platform rejected a private-relations update: ${resolved.message}`, toasts: [], dice: [], adjustments: [] } };
    }
    privateRelations = resolved.state;
    const profile = getPlayerWomenCanonProfiles().find((person) => person.id === resolved.request!.personId);
    if (!profile) return { next: snap, result: { ok: false, notice: "The Platform rejected a private-relations update because the Canon profile is missing.", toasts: [], dice: [], adjustments: [] } };
    privateRelationEvents.push(recordPrivateRequestEvent(resolved.request, profile.category, eventDate, eventYear, eventLocation));
  }

  for (const incident of delta.privateRelations?.boundaryBreaches ?? []) {
    const breach = recordBoundaryBreach(privateRelations, incident.personId, world.dayIndex, eventTime, incident.evidence);
    if (!breach.ok || !breach.consequence) {
      return { next: snap, result: { ok: false, notice: `The Platform rejected a boundary review: ${breach.message}`, toasts: [], dice: [], adjustments: [] } };
    }
    if (breach.duplicate) continue;
    const profile = getPlayerWomenCanonProfiles().find((person) => person.id === incident.personId);
    if (!profile) return { next: snap, result: { ok: false, notice: "The Platform rejected a boundary review because the Canon profile is missing.", toasts: [], dice: [], adjustments: [] } };
    privateRelations = {
      ...breach.state,
      requests: breach.state.requests.map((row) => row.personId === incident.personId && row.status === "pending" ? { ...row, status: "cancelled" as const, eventId: breach.consequence!.sourceEventId } : row),
    };
    reputations = applyBoundaryReputationImpact(reputations, profile.category);
    privateRelationEvents.push(recordBoundaryBreachEvent(breach.consequence, eventDate, eventYear, eventTime, eventLocation, profile.name, incident.evidence));
  }

  for (const update of delta.privateRelations?.visibilityUpdates ?? []) {
    const disclosure = recordPrivateRelationshipDisclosure(privateRelations, update.personId, update.visibility, world.dayIndex, update.evidence);
    if (!disclosure.ok || !disclosure.consequence) {
      return { next: snap, result: { ok: false, notice: `The Platform rejected a relationship disclosure: ${disclosure.message}`, toasts: [], dice: [], adjustments: [] } };
    }
    privateRelations = disclosure.state;
    const profile = getPlayerWomenCanonProfiles().find((person) => person.id === update.personId);
    if (!profile) return { next: snap, result: { ok: false, notice: "The Platform rejected a disclosure because the Canon profile is missing.", toasts: [], dice: [], adjustments: [] } };
    privateRelationEvents.push(recordPrivateRelationshipDisclosureEvent(
      disclosure.consequence, profile.name, update.visibility, eventDate, eventYear, eventTime, eventLocation, update.evidence,
    ));
  }

  for (const update of delta.pregnancyUpdates ?? []) {
    const recorded = recordPregnancyEvidence(pregnancies, privateRelations, {
      mother: update.mother,
      status: "suspected",
      dayIndex: world.dayIndex,
      evidence: update.evidence,
      medicallyVerified: false,
      childAlreadyRecorded: false,
    });
    if (!recorded.ok || !recorded.record || !recorded.consequence) {
      return { next: snap, result: { ok: false, notice: `The Platform rejected a medical/dynastic note: ${recorded.message}`, toasts: [], dice: [], adjustments: [] } };
    }
    pregnancies = recorded.pregnancies;
    privateRelations = recorded.state;
    privateRelationEvents.push(recordPregnancyEvent(recorded.consequence, recorded.record, eventDate, eventYear, eventTime));
  }
  if (privateRelationEvents.length) events = appendLedgerEvents(events, privateRelationEvents);

  let radio = snap.radio;
  if (delta.radio?.length) radio = mergeById(radio, delta.radio as unknown as RadioStation[]);

  let edicts = snap.edicts;
  if (delta.edicts?.new) edicts = mergeById(edicts, delta.edicts.new as unknown as Edict[]);
  if (delta.edicts?.updated) edicts = mergeById(edicts, delta.edicts.updated as unknown as Edict[]);

  const chronicle = [...snap.chronicle];
  const at = `${world.clock.time} ${world.clock.weekday} ${world.clock.date}`;
  if (delta.chronicle?.line) {
    chronicle.push({
      id: `c-${snap.turnCount + 1}`,
      line: delta.chronicle.line,
      at,
      pinned: false,
      kind: "turn",
    });
  }
  if (delta.chronicle?.canonChanges?.length) {
    for (const fact of delta.chronicle.canonChanges) {
      chronicle.push({
        id: `canon-${snap.turnCount + 1}-${chronicle.length}`,
        line: fact,
        at,
        pinned: true,
        kind: "canon",
      });
    }
  }

  const toasts = (delta.toasts ?? []).map((t) => ({
    kind: t.kind ?? ("notice" as const),
    text: t.text,
  }));
  const dice = (delta.dice ?? []).map((d) => ({
    die: d.die || "d20",
    result: clamp(Math.round(d.result), 1, 20),
    reason: d.reason || "uncertain outcome",
    vs: d.vs,
  }));

  const next = {
    world,
    inbox,
    news,
    worldNews,
    cases,
    threads,
    chronicle,
    relations,
    secretClocks,
    calendar,
    edicts,
    stalkers,
    finds,
    sorties,
    mysteries,
    foreignReports,
    kin,
    household,
    gates,
    trades,
    films,
    intel,
    events,
    personalVault,
    factionVault,
    memories,
    reputations,
    pregnancies,
    privateRelations,
    radio,
    radioFreq: delta.radioFreq ?? snap.radioFreq,
    tonightFilm: delta.tonightFilm === undefined ? snap.tonightFilm : delta.tonightFilm,
    rollingSummary: delta.rollingSummary ?? snap.rollingSummary,
    quickActions: delta.quickActions?.filter(Boolean).slice(0, 8) ?? snap.quickActions,
    turnCount: snap.turnCount + 1,
    requestedDossier:
      delta.requestedDossier === undefined ? snap.requestedDossier : delta.requestedDossier,
  };

  const candidate: GameSnapshot = { ...snap, ...next };
  try {
    // Apply only deltas that already satisfy the exact production save contract.
    serializeSavePayload(candidate);
  } catch {
    return {
      next: snap,
      result: {
        ok: false,
        notice: "The Platform rejected an unsafe or incomplete state update. The previous campaign state was preserved.",
        toasts: [],
        dice: [],
        adjustments: [],
      },
    };
  }

  return {
    next: candidate,
    result: {
      ok: true,
      toasts,
      dice,
      nightSummary: delta.nightSummary,
      adjustments,
    },
  };
}

export function clampChronicle(entries: ChronicleEntry[], maxUnpinned = 80): ChronicleEntry[] {
  const pinned = entries.filter((e) => e.pinned || e.kind === "canon");
  const rest = entries.filter((e) => !e.pinned && e.kind !== "canon");
  return [...pinned, ...rest.slice(-maxUnpinned)];
}

export type { NewsTag };
