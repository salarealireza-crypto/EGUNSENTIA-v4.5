import { OPTION_CATALOG } from "./catalog";

/** Structural view of a catalog row. The source catalog is `as const`, so a direct index is not a string. */
export interface CatalogOption {
  id: string;
  title: string;
  summary: string;
  category: string;
  costs: { marks: number; hours: number; politicalCapital?: number; resources?: Record<string, number>; personnel?: readonly string[] };
  risk: string;
  uncertainty: string;
  delay: string;
  forecast: { knownEffects: readonly string[]; unknownEffects: readonly string[] };
}

const CATALOG = OPTION_CATALOG as unknown as Record<string, readonly CatalogOption[]>;

export function optionsForPanel(panelId: string): readonly CatalogOption[] {
  return CATALOG[panelId] ?? [];
}
