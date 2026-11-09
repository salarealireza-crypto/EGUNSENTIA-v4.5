/** Desk metadata. Registry ids stay put; this only adds archetype, place, views and icon. */

export type Archetype =
  | "MINISTRY"
  | "LEDGER"
  | "SCHEMATIC"
  | "DOSSIER"
  | "POST"
  | "EVIDENCE"
  | "CLOCKFACE"
  | "CODEX"
  | "SYSTEM";

export const ARCHETYPES: Archetype[] = [
  "MINISTRY",
  "LEDGER",
  "SCHEMATIC",
  "DOSSIER",
  "POST",
  "EVIDENCE",
  "CLOCKFACE",
  "CODEX",
  "SYSTEM",
];

const MINISTRY = ["04", "14", "20", "21", "23", "24", "25", "28", "50", "51", "52", "53"];
const LEDGER = ["06", "11", "22", "32", "44", "45", "54", "64"];
const SCHEMATIC = ["10", "15", "18", "27", "30", "55", "56", "57", "61"];
const DOSSIER = ["17", "26", "33", "36", "38", "48", "49", "58", "59"];
const POST = ["01", "02", "03", "16", "42", "43"];
const EVIDENCE = ["07", "13", "19", "31", "47"];
const CLOCKFACE = ["05", "08", "09", "12", "34", "37", "46"];
const CODEX = ["35", "39", "40", "41", "60", "62", "65"];
const SYSTEM = ["29", "63"];

function index(ids: string[], archetype: Archetype): Record<string, Archetype> {
  return Object.fromEntries(ids.map((id) => [id, archetype]));
}

export const ARCHETYPE_BY_PANEL: Record<string, Archetype> = {
  ...index(MINISTRY, "MINISTRY"),
  ...index(LEDGER, "LEDGER"),
  ...index(SCHEMATIC, "SCHEMATIC"),
  ...index(DOSSIER, "DOSSIER"),
  ...index(POST, "POST"),
  ...index(EVIDENCE, "EVIDENCE"),
  ...index(CLOCKFACE, "CLOCKFACE"),
  ...index(CODEX, "CODEX"),
  ...index(SYSTEM, "SYSTEM"),
};

export const VIEWS: Record<Archetype, readonly string[]> = {
  MINISTRY: ["Today", "Petitions", "Orders", "Record"],
  LEDGER: ["Books", "Prices", "Bottlenecks", "Record"],
  SCHEMATIC: ["Map", "Layers", "Sites", "Record"],
  DOSSIER: ["Now", "Memory", "Web", "Orders"],
  POST: ["Inbox", "Read", "Reply", "Record"],
  EVIDENCE: ["Board", "Leads", "Contradictions", "Theories"],
  CLOCKFACE: ["Today", "Week", "Rules", "Record"],
  CODEX: ["Index", "Entry", "See also", "Unlocks"],
  SYSTEM: ["Status", "Tools", "Record"],
};

export const WING_PLACE: Record<string, { place: string; mood: string }> = {
  COMMAND: { place: "War Table", mood: "Amber lamp on dark iron." },
  CITY: { place: "The Works", mood: "Blueprint light on steel." },
  SHADOWS: { place: "Black Layer", mood: "Crimson on black. Say less." },
  HOUSE: { place: "Evening Hall", mood: "Rose lamplight and parchment." },
  SURFACE: { place: "The Latch", mood: "Sulfur on cold grey." },
  WORLD: { place: "Hall of Envoys", mood: "Blue and gold vellum." },
  MEDIA: { place: "The Booth", mood: "Green phosphor. The one honest screen." },
  ARCHIVE: { place: "The Stacks", mood: "Violet dust on ash paper." },
};

/** CSS token map for the eight fiction wings. Components read the variables, not these hexes. */
export interface WingToken {
  accent: string;
  surface: string;
  line: string;
  ink: string;
  motif: string;
}

export const WING_TOKENS: Record<string, WingToken> = {
  COMMAND: { accent: "#f0b429", surface: "#14100c", line: "#6b4e16", ink: "#f6efe2", motif: "brackets" },
  CITY: { accent: "#3ec8e0", surface: "#0b1418", line: "#1d4a55", ink: "#e7f7fb", motif: "grid" },
  SHADOWS: { accent: "#e879f9", surface: "#07050a", line: "#ff5a4e", ink: "#f7e9f8", motif: "redaction" },
  HOUSE: { accent: "#fb7185", surface: "#1d1512", line: "#8a4a55", ink: "#f8ece6", motif: "vignette" },
  SURFACE: { accent: "#f5d76e", surface: "#0f1210", line: "#8a7a3a", ink: "#f7f3e4", motif: "hazard" },
  WORLD: { accent: "#60a5fa", surface: "#0c1118", line: "#d4b483", ink: "#eef3fb", motif: "seal" },
  MEDIA: { accent: "#3ee07a", surface: "#03140c", line: "#1f6b3a", ink: "#d7ffe4", motif: "phosphor" },
  ARCHIVE: { accent: "#c084fc", surface: "#12101a", line: "#5c4678", ink: "#f3eefe", motif: "index" },
};

const ICONS: Record<string, string> = {
  "01": "Mail",
  "02": "Newspaper",
  "03": "Globe",
  "04": "Scale",
  "05": "Calendar",
  "06": "ClipboardList",
  "07": "FileWarning",
  "08": "ScrollText",
  "09": "BookOpen",
  "10": "Route",
  "11": "Briefcase",
  "12": "ListChecks",
  "13": "Shield",
  "14": "Cog",
  "15": "Eye",
  "16": "Landmark",
  "17": "Users",
  "18": "Castle",
  "19": "MapPinned",
  "20": "UsersRound",
  "21": "Droplets",
  "22": "Truck",
  "23": "Swords",
  "24": "Landmark",
  "25": "Home",
  "26": "Contact",
  "27": "GitBranch",
  "28": "Wrench",
  "29": "ScanSearch",
  "30": "Radar",
  "31": "Ear",
  "32": "BookMarked",
  "33": "Lamp",
  "34": "Moon",
  "35": "Gem",
  "36": "Users",
  "37": "Clock",
  "38": "Heart",
  "39": "Lock",
  "40": "Vault",
  "41": "Map",
  "42": "Radio",
  "43": "Clapperboard",
  "44": "Library",
  "45": "Ship",
  "46": "Timer",
  "47": "Fingerprint",
  "48": "Brain",
  "49": "Award",
  "50": "DoorOpen",
  "51": "Gavel",
  "52": "Cross",
  "53": "GraduationCap",
  "54": "Store",
  "55": "TrainFront",
  "56": "Compass",
  "57": "Bug",
  "58": "Flag",
  "59": "Utensils",
  "60": "Palette",
  "61": "Map",
  "62": "Images",
  "63": "Settings",
  "64": "Stamp",
  "65": "BookMarked",
};

export interface DeskMeta {
  archetype: Archetype;
  place: string;
  views: string[];
  icon: string;
}

export function deskMeta(id: string, wing: string): DeskMeta {
  const archetype = ARCHETYPE_BY_PANEL[id] ?? "SYSTEM";
  const place = archetype === "SYSTEM" ? "Utility" : (WING_PLACE[wing]?.place ?? "Desk");
  return {
    archetype,
    place,
    views: [...VIEWS[archetype]],
    icon: ICONS[id] ?? "ScrollText",
  };
}

export function panelsOf(archetype: Archetype): string[] {
  return Object.entries(ARCHETYPE_BY_PANEL)
    .filter(([, a]) => a === archetype)
    .map(([id]) => id);
}
