import { clamp } from "./core.ts";

// Goods named in the lore (3.67, 3.62). Raw numbers are the source; indices derive.
export const GOODS = ["food", "water", "rail steel", "copper wire", "machine bearings", "filters", "glass", "chemical feedstock", "fuel stocks", "fungal substrate", "ammunition components", "salvageable electronics"] as const;
export type Good = (typeof GOODS)[number];
export interface Market { stock: number; demand: number; production: number; base: number; strategic: number }
export interface Route { id: string; from: string; to: string; capacity: number; transit: number; hazard: number; open: boolean }
export type Economy = Record<Good, Market> & Record<string, Market>;

export const defaultEconomy = (): Record<Good, Market> => {
  const m = (stock: number, demand: number, production: number, base: number, strategic: number): Market => ({ stock, demand, production, base, strategic });
  return {
    food: m(900, 120, 110, 3, 1.4), water: m(1400, 150, 145, 2, 1.5), "rail steel": m(300, 20, 12, 12, 1.1), "copper wire": m(150, 12, 6, 14, 1.2),
    "machine bearings": m(80, 6, 3, 20, 1.3), filters: m(200, 15, 8, 9, 1.4), glass: m(250, 8, 6, 6, 1), "chemical feedstock": m(180, 10, 6, 10, 1.1),
    "fuel stocks": m(500, 40, 35, 8, 1.4), "fungal substrate": m(400, 30, 28, 4, 1.2), "ammunition components": m(220, 14, 9, 15, 1.6), "salvageable electronics": m(60, 4, 5, 18, 1.2),
  };
};

export const LOGISTICS_ROUTE: Route = { id: "dome-rail", from: "Dome", to: "yards", capacity: 30, transit: 2, hazard: 1, open: true };
export const FOREIGN_ROUTE: Route = { id: "foreign-rail", from: "Dome", to: "frontier", capacity: 20, transit: 3, hazard: 2, open: true };

export type PriceFactor = "scarcity" | "transit" | "hazard" | "political";
/** Same price as priceOf, plus the words for whichever terms actually moved it. */
export function priceBreakdown(m: Market, route?: Pick<Route, "transit" | "hazard" | "open">, politicalDiscount = 0): { price: number; factors: PriceFactor[] } {
  const cover = m.demand > 0 ? m.stock / (m.demand * 10) : 5;
  const scarcity = clamp(1 - cover, 0, 2);
  const factors: PriceFactor[] = [];
  if (scarcity > 0.02 || (route && !route.open)) factors.push("scarcity");
  if (route && route.transit > 0) factors.push("transit");
  if (route && route.hazard > 0) factors.push("hazard");
  if (politicalDiscount > 0) factors.push("political");
  return { price: priceOf(m, route, politicalDiscount), factors };
}
/** Trade and alliance treaties soften a foreign quote. The rate stays inside the engine. */
export function treatyDiscount(treaties: ReadonlyArray<string | undefined>): number {
  const friendly = treaties.filter((t) => t === "trade" || t === "alliance").length;
  return clamp(friendly * 0.05, 0, 0.5);
}
export type MarketDesk = "rations" | "logistics" | "foreign";
export function marketBoard(e: Record<Good, Market>, desk: MarketDesk, discount = 0): Array<{ good: Good; price: number; factors: PriceFactor[] }> {
  const route = desk === "logistics" ? LOGISTICS_ROUTE : desk === "foreign" ? FOREIGN_ROUTE : undefined;
  const pol = desk === "foreign" ? discount : 0;
  return GOODS.map((g) => ({ good: g, ...priceBreakdown(e[g], route, pol) }));
}
export function priceOf(m: Market, route?: Pick<Route, "transit" | "hazard" | "open">, politicalDiscount = 0): number {
  const cover = m.demand > 0 ? m.stock / (m.demand * 10) : 5; // ~10 days of cover = neutral
  const scarcity = clamp(1 - cover, 0, 2);
  const transit = route ? route.transit : 0;
  const hazard = route ? route.hazard : 0;
  const closedPremium = route && !route.open ? 1 : 0;
  const p = m.base * (1 + scarcity + closedPremium) * m.strategic + transit + hazard;
  return Math.max(0.1, Math.round(p * (1 - clamp(politicalDiscount, 0, 0.5)) * 100) / 100);
}
/** One day: production, consumption, import limited by route capacity. Returns a new economy plus bottlenecks. */
export function economyTick(e: Record<Good, Market>, imports: Partial<Record<Good, number>> = {}, routes: Route[] = []): { economy: Record<Good, Market>; bottlenecks: Good[] } {
  const cap = routes.filter((r) => r.open).reduce((s, r) => s + r.capacity, 0);
  let capLeft = routes.length ? cap : Infinity;
  const out = structuredClone(e);
  const bottlenecks: Good[] = [];
  for (const g of GOODS) {
    const m = out[g];
    let imp = imports[g] ?? 0;
    if (imp > capLeft) { imp = Math.max(0, capLeft); bottlenecks.push(g); }
    capLeft -= imp;
    m.stock = Math.max(0, m.stock + m.production + imp - m.demand);
    if (m.stock === 0 && m.demand > 0 && !bottlenecks.includes(g)) bottlenecks.push(g);
  }
  return { economy: out, bottlenecks };
}
/** Cascade: a shortage of one good lowers production of dependent goods. */
export const DEPENDS: Partial<Record<Good, Good[]>> = { "machine bearings": ["rail steel"], "ammunition components": ["chemical feedstock", "copper wire"], filters: ["glass"], "fungal substrate": ["water"], food: ["fungal substrate", "water"] };
export function cascade(e: Record<Good, Market>): Record<Good, Market> {
  const out = structuredClone(e);
  for (const g of GOODS) {
    const deps = DEPENDS[g] ?? [];
    if (deps.some((d) => e[d].stock < e[d].demand * 3)) out[g].production = Math.round(out[g].production * 0.8 * 100) / 100;
  }
  return out;
}
export const priceIndex = (e: Record<Good, Market>) => Math.round((GOODS.reduce((s, g) => s + priceOf(e[g]) / e[g].base, 0) / GOODS.length) * 100) / 100;

export type StockOutlook = {
  good: Good;
  stock: number;
  dailyBalance: number;
  daysOfCover: number | null;
  status: "critical" | "strained" | "stable";
};

/** Read-only operational outlook; does not mutate stock or alter the economy simulation. */
export function stockOutlook(economy: Record<Good, Market>, good: Good): StockOutlook {
  const market = economy[good];
  const daysOfCover = market.demand > 0 ? Math.max(0, market.stock) / market.demand : null;
  return {
    good,
    stock: market.stock,
    dailyBalance: market.production - market.demand,
    daysOfCover,
    status: daysOfCover !== null && daysOfCover < 3 ? "critical" : daysOfCover !== null && daysOfCover < 7 ? "strained" : "stable",
  };
}
