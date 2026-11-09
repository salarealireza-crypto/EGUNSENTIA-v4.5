import rawCards from "./cards.json";
import rawSeeds from "./seeds.json";
import rawExcerpts from "./excerpts.json";

export interface RawCard {
  name: string;
  role: string;
  line: number;
  fields: Record<string, string>;
  text: string;
}

export interface RawSeed {
  id: string;
  line: number;
  text: string;
}

export interface Excerpt {
  title: string;
  start: number;
  end: number;
  text: string;
}

export const cardsJson = rawCards as RawCard[];
export const seedsJson = rawSeeds as RawSeed[];
export const excerpts = rawExcerpts as Record<string, Excerpt>;
