import type {
  CaseItem,
  CalendarEvent,
  CastCard,
  ChronicleEntry,
  Edict,
  FindItem,
  ForeignReport,
  InboxItem,
  KinCard,
  Mystery,
  NewsItem,
  Relation,
  SceneFooter,
  SecretClock,
  SortieRecord,
  Stalker,
  ThreadItem,
  WorldNewsItem,
  WorldState,
} from "./types";
import { cardsJson, seedsJson } from "@/lib/canon/load";
import { RED_CLAW_CAST_CARDS } from "./sim/red-claw-household.ts";

export const OPENING_FOOTER: SceneFooter = {
  time: "07:00",
  day: "Ironday, 20 Ironmonth 105 AW",
  floor: "Floor 6, Dagmar's chamber",
  interrupt: "normal",
  prompt: "Open the Platform",
};

export const OPENING_SCENE = `Dawn in the Dome did not come from the sky. It came from the lamps.

A low amber band woke along the iron ribs of the ceiling, one lamp after another, as if the tower itself were remembering how to be a day. Heat ticked in the pipes. Somewhere far below, the Furnace exhaled and the whole Fist answered with a faint, familiar tremor. The air in the chamber smelled of gun oil, cold stone, and leather polish.

Dagmar was already on her feet.

She stood at the inner window in black leather, the duty braid down her back, the scar through her left eyebrow catching the lamp-light. One palm rested on the sill. Beyond the glass the atrium fell away in rings of iron and marble, lamps like coals receding into the dark. She did not look at the bed. She looked at the wall that was not visible from here and still, somehow, was the thing she was watching.

Boots paused in the passage outside. Elara: half a step left of the door, already counting exits. She did not knock. She never knocked at this hour.

On the side table, yesterday's gloves. A cup gone cold. The red-glass lamp that Dagmar preferred, burning a narrow throat of light. From the Hall below came the first iron of the morning — a distant latch, a cart wheel, someone calling a name that died in the stairwell.

Ironday. Council day. Two years into the Fist, and the city still woke as if it might have to fight before noon.

Samer would be in the listening room, sorting the night. At ten he would bring the papers to the Reception Hall. Until then the hours belonged to whoever claimed them: the Hall, the library, the training gallery, the wall, the wives, the children still sleeping two floors down.

Dagmar's shoulder lowered a fraction. Not quite a smile. She spoke without turning, voice low and level, as if noting a fact already decided.

"The lamps are lit. The east is still the east."

A second, quieter: "Liese asked for you last night. I told her the Fist sleeps when he can."

Outside, Elara's weight shifted on the stone. The Dome held its breath the way it always did at seven — not waiting for an order, exactly. Waiting to see whether the man who held the title would rise into the day, or let the day come in and find him.

The morning briefing was three hours away. The rest was his.`;

export const dayOneWorld = (): WorldState => ({
  clock: {
    weekday: "Ironday",
    date: "20 Ironmonth",
    year: "105 AW",
    time: "07:00",
    location: "Dagmar's chamber",
    floor: "Floor 6, the Dome",
  },
  water: { stock: 41000, capacity: 41000, production: 520, consumption: 470, unit: "m³", policy: "normal" },
  food: { stock: 620, capacity: 620, production: 8.4, consumption: 7.6, unit: "t", policy: "normal" },
  energy: { stock: 18000, capacity: 18000, production: 1400, consumption: 1250, unit: "EU", policy: "normal" },
  treasury: { marks: 120000, income: 2400, expenses: 2100 },
  arms: { suitsReady: 960, inRepair: 40, rifles: 2400, ammo: 180000 },
  population: { house: 1500, soldiers: 5000, bound: 6000, redClaws: 12500, known: 60000 },
  indices: {
    Water: 6,
    Food: 6,
    Energy: 7,
    Arms: 8,
    Morale: 7,
    Order: 5,
    Wealth: 6,
    Fear: 7,
    Honor: 3,
  },
  blocs: { oldGuard: 6, banners: 7, works: 5 },
  surface: {
    garrison: "20 / 20",
    sorties: "2 / 3 this week",
    cleansing: "5 items · next release in 3 days",
    weekSorties: 2,
    weekLimit: 3,
  },
  dayIndex: 0,
  lastWeeklyRelicDay: 0,
});

export const dayOneInbox = (): InboxItem[] => [
  {
    id: "m1",
    from: "Steward Ilona Brandt",
    office: "Food",
    time: "09:40 Ironday",
    body: "The mushroom hall on the third row has blight. May I burn it?",
    status: "open",
    urgency: "important",
    deadline: "today 18:00",
    glyph: "IB",
  },
  {
    id: "m2",
    from: "Commander Ansgar Red",
    office: "Surface Watch",
    time: "08:15 Ironday",
    body: "Fresh tracks near the Latch. Request a sortie.",
    status: "open",
    urgency: "important",
    deadline: "Watchday",
    glyph: "AR",
  },
];

export const dayOneNews = (): NewsItem[] => [
  {
    id: "n1",
    source: "Warden Tomas Hesse",
    time: "07:20",
    body: "My lord, the west cistern is at 18%. If we continue like this, we will have trouble tomorrow.",
    tag: "INITIAL REPORT",
    reliability: "medium",
  },
  {
    id: "n2",
    source: "Steward Ilona",
    time: "08:00",
    body: "The Water Rite is on the 14th, all House invited.",
    tag: "CONFIRMED",
    reliability: "high",
  },
  {
    id: "n3",
    source: "Grandmother Wilhelmina Red",
    time: "—",
    body: "Uncle Albrecht has died. The rites are tomorrow at the Ash. Will you attend?",
    tag: "CONFIRMED",
    reliability: "high",
  },
  {
    id: "n4",
    source: "Envoy Dreyer (Grotsen)",
    time: "—",
    body: "The Dominion would welcome an exchange of rifles for water.",
    tag: "INITIAL REPORT",
    reliability: "medium",
  },
];

export const dayOneWorldReport = `RAID FROM TUNNEL 37
[INITIAL REPORT] At 04:17, a group of unidentified creatures entered the southern territory of the Demos. Local sources claim the breach was sealed before dawn. No confirmed count of dead.

THE HOUSE OF ASCHEN WEDS
[CONFIRMED] Countess Seraphine von Aschen's cousin has married in the palace complex. Monarchian banners were shown. Red Claw observers were not invited.`;

export const dayOneCases = (): CaseItem[] => [
  {
    id: "105-041",
    accused: "Foreman Hals",
    charge: "theft of state water",
    status: "awaiting sentence",
    evidence: ["cistern seal broken on third watch", "empty jugs in Hals' alcove", "Warden Tomas' count sheet"],
  },
  {
    id: "105-042",
    accused: "Cousin Ewald Red",
    charge: "treason",
    status: "under investigation",
    evidence: ["letter fragment naming Grotsen", "a missing night from the guest log"],
  },
];

export const dayOneThreads = (): ThreadItem[] => [
  {
    id: "A",
    title: "Eastern Border Tension",
    kind: "thread",
    summary: "Near-term military / diplomatic pressure on the monster-facing edge.",
    status: "active",
  },
  {
    id: "B",
    title: "Survivor Envoy / Union Pressure",
    kind: "thread",
    summary: "A Survivor envoy is pressing for union. Outcomes unscripted.",
    status: "active",
  },
  {
    id: "C",
    title: "Morning Briefing",
    kind: "thread",
    summary: "Samer arrives at 10:00 with the day's papers. Information gateway, not a forced quest.",
    status: "active",
  },
  ...seedsJson.slice(0, 12).map((s) => ({
    id: s.id,
    title: s.text.split(" — ")[1]?.split(".")[0] ?? s.id,
    kind: "seed" as const,
    summary: s.text.replace(/^SEED-V15-\d+\s+[—-]\s+/, "").slice(0, 220),
    status: "dormant" as const,
  })),
];

const HOUSE = [
  "DAGMAR",
  "ADELHEID",
  "VERA",
  "ELARA",
  "LUKA",
  "KONRAD",
  "LIESE",
  "WILHELMINA",
  "SAMER",
];

function parseCard(raw: (typeof cardsJson)[number]): CastCard {
  const m = raw.name.match(/^(.*?),\s*(\d+)\s*$/);
  const base = (m?.[1] ?? raw.name).trim();
  const age = m?.[2];
  const group = HOUSE.some((h) => base.toUpperCase().includes(h)) ? "House" : "Office";
  return {
    name: base,
    age,
    role: raw.role,
    group,
    look: raw.fields.LOOK ?? "",
    voice: raw.fields.VOICE ?? "",
    day: raw.fields.DAY ?? "",
    wants: raw.fields.WANTS,
    fears: raw.fields.FEARS,
    hooks: raw.fields.HOOKS,
    never: raw.fields.NEVER,
    secret: raw.fields.SECRET,
    relationships: raw.fields.RELATIONS ?? "",
  };
}

const compiledCast: CastCard[] = cardsJson.map(parseCard);
const compiledNames = new Set(compiledCast.map((card) => card.name.trim().toLocaleLowerCase("en-GB")));
const expansionCast: CastCard[] = RED_CLAW_CAST_CARDS
  .filter((person) => !compiledNames.has(person.name.trim().toLocaleLowerCase("en-GB")))
  .map((person) => ({
    name: person.name,
    age: person.ageYears === null ? undefined : String(person.ageYears),
    role: person.occupation,
    group: person.residenceStatus === "departed" ? "Grotsen / External Family" : "Red Claw Household",
    look: person.appearance,
    voice: person.voice,
    day: person.castDay || person.dailyRoutine,
    wants: person.ambitions,
    fears: person.fears,
    hooks: person.eventHooks.join("; "),
    never: person.knowledgeBoundaries,
    relationships: person.relationships,
    loreStatus: person.sourceStatus,
    householdTier: person.tier,
    residenceStatus: person.residenceStatus,
  }));

/** The Cast adds living proposed household NPCs without duplicating compiled Canon cards. */
export const CAST: CastCard[] = [...compiledCast, ...expansionCast];

export const FEATURED_CAST = CAST.filter((c) =>
  [
    "DAGMAR RED",
    "ADELHEID VON MOREN",
    "VERA GROTSEN",
    "ELARA RED",
    "LUKA VAHL",
    "KONRAD RED",
    "LIESE RED",
    "GRANDMOTHER WILHELMINA RED",
    "SAMER (SAMUEL) VOGT",
  ].includes(c.name),
);

export const PANELS: { id: string; label: string; accent: string }[] = [
  { id: "01", label: "Messages", accent: "amber" },
  { id: "02", label: "Internal News", accent: "green" },
  { id: "03", label: "World Report", accent: "cyan" },
  { id: "04", label: "Cases", accent: "red" },
  { id: "05", label: "Calendar", accent: "violet" },
  { id: "06", label: "Status", accent: "white" },
  { id: "07", label: "Special", accent: "magenta" },
  { id: "08", label: "Household", accent: "rose" },
  { id: "09", label: "Personal Vault", accent: "amber" },
  { id: "10", label: "Faction Vault", accent: "yellow" },
  { id: "11", label: "Lore Atlas", accent: "cyan" },
  { id: "12", label: "Standing Orders", accent: "white" },
  { id: "13", label: "Radio", accent: "green" },
  { id: "14", label: "Projector", accent: "violet" },
  { id: "15", label: "Surface Watch", accent: "yellow" },
  { id: "16", label: "Diplomatic Desk", accent: "blue" },
  { id: "17", label: "House & Kin", accent: "rose" },
  { id: "18", label: "Borders", accent: "teal" },
  { id: "19", label: "Event Ledger", accent: "orange" },
  { id: "20", label: "Black Layer", accent: "red" },
  { id: "21", label: "Foreign Trade", accent: "blue" },
  { id: "22", label: "Relic Bay", accent: "yellow" },
  { id: "23", label: "Military & Law", accent: "orange" },
  { id: "24", label: "Time", accent: "white" },
];

export const SUGGESTIONS = [
  "Rise and go to the Hall",
  "Speak with Dagmar",
  "Ask after Liese",
  "Open the Platform",
  "Wait until the briefing",
  "Walk the eastern wall",
];

export const BRIEFING_SCENE = `The Reception Hall on Floor 5 was already awake when the hour turned.

Iron rails in the floor caught the lamps. A clerk's bench had been cleared. The air smelled of ink, wet wool, and the sour metal of a night spent listening. Samuel Vogt stood with the day's papers in both hands, dark coat, red armband, hair still combed from a basin. Ink on his fingers. He did not smile. He rarely did, at ten.

"Sir," he said. "The morning report is ready."

He laid the sheets down as if they might bruise.

Water. The west cistern is reported at eighteen percent. Warden Tomas asks whether to ration, open the reserve, or find the leak.

Security. Commander Ansgar reports fresh tracks near the Latch and requests a sortie. The eastern border remains tense. No confirmed monster contact since yesterday's second watch.

House. Grandmother Wilhelmina records the death of Uncle Albrecht. Rites at the Ash tomorrow. She asks if the Fist will stand.

Trade. Envoy Dreyer of the Dominion offers rifles for water. The message names Vera.

World. The Demos reports an unidentified breach from Tunnel 37 before dawn. Tag: initial report.

Internal. Steward Ilona: blight in the third-row mushroom hall. She asks leave to burn it. Two numbered requests wait in Messages.

Samer's throat worked once. He did not soften the cistern number, though the habit was there, behind the teeth.

"That is the short of it."

He waited, papers still in reach.

To see the details, say Open. Or answer a message by number. Or send the room away and take the day in your own order.`;

export const BRIEFING_FOOTER: SceneFooter = {
  time: "10:00",
  day: "Ironday, 20 Ironmonth 105 AW",
  floor: "Floor 5, Reception Hall",
  interrupt: "important",
  prompt: "[!] Open the Platform [!]",
};

export const dayOneWorldNews = (): WorldNewsItem[] => [
  {
    id: "w1",
    headline: "RAID FROM TUNNEL 37",
    tag: "INITIAL REPORT",
    source: "Demos border posts",
    reliability: "unverified",
    body: "At 04:17, a group of unidentified creatures entered the southern territory of the Demos. Local sources claim the breach was sealed before dawn. No confirmed count of dead.",
  },
  {
    id: "w2",
    headline: "THE HOUSE OF ASCHEN WEDS",
    tag: "CONFIRMED",
    source: "Monarchian court circular",
    reliability: "high",
    body: "Countess Seraphine von Aschen's cousin has married in the palace complex. Monarchian banners were shown. Red Claw observers were not invited.",
  },
];

export const dayOneChronicle = (): ChronicleEntry[] => [
  {
    id: "c-0",
    line: "Christian Red IV wakes in Dagmar's chamber, Floor 6. Ironday, 20 Ironmonth 105 AW. Two years into the Fist.",
    at: "07:00 Ironday 20 Ironmonth",
    pinned: true,
    kind: "turn",
  },
];

export const dayOneRelations = (): Relation[] => [
  { name: "Dagmar Red", trust: 7, respect: 8, fear: 4, loyalty: 8, closeness: 7 },
  { name: "Adelheid von Moren", trust: 6, respect: 7, fear: 5, loyalty: 6, closeness: 5 },
  { name: "Vera Grotsen", trust: 5, respect: 6, fear: 6, loyalty: 5, closeness: 4 },
  { name: "Elara Red", trust: 6, respect: 8, fear: 3, loyalty: 7, closeness: 5 },
  { name: "Samer Vogt", trust: 8, respect: 7, fear: 5, loyalty: 8, closeness: 4 },
  { name: "Wilhelmina Red", trust: 6, respect: 7, fear: 6, loyalty: 7, closeness: 5 },
  { name: "Ansgar Red", trust: 7, respect: 7, fear: 4, loyalty: 7, closeness: 3 },
  { name: "Ilona Brandt", trust: 6, respect: 6, fear: 5, loyalty: 6, closeness: 2 },
];

export const dayOneSecretClocks = (): SecretClock[] => [
  { id: "SC-cistern", label: "West cistern failure", value: 2, max: 5 },
  { id: "SC-envoy", label: "Survivor union ultimatum", value: 1, max: 6 },
];

export const dayOneCalendar = (): CalendarEvent[] => [
  {
    id: "EVT-105-brief",
    name: "Morning Briefing",
    date: "20 Ironmonth",
    start: "10:00",
    end: "12:00",
    place: "Floor 5, Reception Hall",
    type: "Duty",
    importance: "High",
    status: "planned",
    reminder: true,
  },
  {
    id: "EVT-105-council",
    name: "Council of Representatives",
    date: "20 Ironmonth",
    start: "14:00",
    end: "16:00",
    place: "Floor 5, Council Chamber",
    type: "Duty",
    importance: "High",
    status: "planned",
    reminder: true,
  },
  {
    id: "EVT-105-041",
    name: "Funeral of Uncle Albrecht Red",
    date: "21 Ironmonth",
    start: "16:00",
    end: "18:00",
    place: "Floor -5, the Ash",
    type: "Family",
    importance: "Medium",
    status: "planned",
    reminder: true,
  },
  {
    id: "EVT-105-water",
    name: "Water Rite",
    date: "14 Wellmonth",
    start: "10:00",
    end: "14:00",
    place: "the Ash",
    type: "Rite",
    importance: "High",
    status: "planned",
    reminder: true,
  },
];

export const dayOneEdicts = (): Edict[] => [];

export const dayOneStalkers = (): Stalker[] => [
  { id: "ansgar", name: "Ansgar Red", role: "Commander", dose: 3, sortiesInRotation: 4, status: "ready", rotation: "core", wear: 1, scar: "radiation burn at the neck" },
  { id: "ilka", name: "Ilka Red", role: "Scout / cartographer", dose: 2, sortiesInRotation: 5, status: "ready", rotation: "core", wear: 0 },
  { id: "tobiah", name: "Tobiah Red", role: "Relic hunter / engineer", dose: 2, sortiesInRotation: 3, status: "ready", rotation: "core", wear: 1, scar: "limp" },
  { id: "maren", name: "Maren Red", role: "Cleanser / radiation medic", dose: 4, sortiesInRotation: 2, status: "ready", rotation: "core", wear: 0 },
  { id: "hessler", name: "Brand Hessler", role: "Garrison stalker — point", dose: 1, sortiesInRotation: 2, status: "ready", rotation: "garrison", wear: 0 },
  { id: "wern", name: "Ilse Wern", role: "Garrison stalker — signals", dose: 1, sortiesInRotation: 3, status: "ready", rotation: "garrison", wear: 0 },
  { id: "marr", name: "Josef Marr", role: "Garrison stalker — heavy", dose: 2, sortiesInRotation: 2, status: "ready", rotation: "garrison", wear: 1 },
  { id: "brun", name: "Tessa Brun", role: "Garrison stalker — maps", dose: 0, sortiesInRotation: 1, status: "ready", rotation: "garrison", wear: 0 },
  { id: "ranke", name: "Otto Ranke", role: "Garrison stalker — rear", dose: 3, sortiesInRotation: 6, status: "ready", rotation: "garrison", wear: 1 },
  { id: "bauer", name: "Leni Bauer", role: "Garrison stalker — medic aid", dose: 1, sortiesInRotation: 2, status: "ready", rotation: "garrison", wear: 0 },
];

export const dayOneFinds = (): FindItem[] => [
  {
    id: "F-01",
    name: "Pre-war lamp glass",
    condition: "cracked",
    radiation: "low",
    queue: "cleansing",
    release: "23 Ironmonth",
    foundBy: "Ilka Red",
    kind: "tool",
  },
  {
    id: "F-02",
    name: "Street fragment, district unnamed",
    condition: "soot-stained paper",
    radiation: "clean",
    queue: "catalogued",
    foundBy: "Ilka Red",
    kind: "map",
  },
];

export const dayOneSorties = (): SortieRecord[] => [
  {
    id: "S-104",
    team: ["Ansgar Red", "Ilka Red", "Brand Hessler", "Tessa Brun"],
    objective: "Confirm tracks west of the Latch",
    route: "Throat → north ruin street",
    hours: 3.5,
    rangeM: 420,
    result: "incident",
    debrief: "Tracks confirmed, then lost in ash. No contact. Dose +1 on Hessler.",
    at: "18 Ironmonth",
  },
  {
    id: "S-105",
    team: ["Ilka Red", "Tobiah Red", "Josef Marr", "Leni Bauer", "Otto Ranke"],
    objective: "Recover a humming casing",
    route: "Throat → collapsed arcade",
    hours: 4,
    rangeM: 510,
    result: "find",
    debrief: "Lamp glass recovered. Arcade unstable. Returned before the hour.",
    at: "19 Ironmonth",
  },
];

export const dayOneMysteries = (): Mystery[] => [
  { id: "M1", title: "Why monsters swarm through the gates", clues: 2, needed: 6, leads: ["gate-cycle logs incomplete", "old swarm season does not match"] },
  { id: "M2", title: "What happened in Tunnel 18", clues: 0, needed: 6, leads: ["sealed in living memory"] },
  { id: "M3", title: "Where the pre-war film was shot", clues: 1, needed: 6, leads: ["a skyline reel in the Hall projector"] },
  { id: "M4", title: "Whether the surface can ever be lived on", clues: 0, needed: 6, leads: [] },
  { id: "M5", title: "Whether other humans survive elsewhere", clues: 0, needed: 6, leads: ["Sixth Carrier tone at 108.0"] },
  { id: "M6", title: "What Azken-Gizona is", clues: 1, needed: 6, leads: ["scattered human-face reports"] },
];

export const dayOneForeign = (): ForeignReport[] => [
  {
    id: "FR-01",
    group: "Archive Teams",
    faction: "Demos",
    tag: "INITIAL REPORT",
    body: "Demos archive stalkers were seen near the southern ruin after the Tunnel 37 breach. Topside Accord: no weapons raised.",
  },
];

export const dayOneKin = (): KinCard[] => [
  { id: "HH-dagmar-red", name: "Dagmar Red", role: "First wife", mood: "watchful", ageYears: 37 },
  { id: "HH-adelheid-von-moren", name: "Adelheid von Moren", role: "Second wife", mood: "composed", ageYears: 24 },
  { id: "HH-vera-grotsen", name: "Vera Grotsen", role: "Third wife", mood: "unsettled", ageYears: 19 },
  { id: "CH-konrad", name: "Konrad Red", role: "Son, 15", mood: "restless", ageYears: 15 },
  { id: "CH-liese", name: "Liese Red", role: "Daughter, 11", mood: "curious", ageYears: 11 },
  { id: "CH-emil", name: "Emil Red", role: "Adelheid's child", mood: "sleeping", ageYears: 3 },
  { id: "CH-luka", name: "Luka Vahl", role: "Acknowledged son, 18", mood: "quiet", ageYears: 18 },
  { id: "KIN-wilhelmina-red-house-representative", name: "Wilhelmina Red", role: "House Representative", mood: "grieving", ageYears: 68 },
  { id: "KIN-elara-red-iron-guard", name: "Elara Red", role: "Iron Guard", mood: "on duty", ageYears: 34 },
];

export const DELEGATES = [
  "Steward Ilona Brandt",
  "Commander Ansgar Red",
  "Marshal Gerhard Rask",
  "Warden Tomas Hesse",
  "Furnace-Master Ludek",
  "Grandmother Wilhelmina Red",
  "Overseer Brun",
  "Elara Red",
  "Dagmar Red",
  "Samer Vogt",
];

export const OPENING_SUMMARY =
  "Year 105 AW, Ironday 20 Ironmonth. Egunsentia V4.5 Demo / Update 4.5. Christian Red IV wakes in the Dome. Two years into the Fist. Three wives: Dagmar First, Adelheid Second, Vera Third. Eastern border tense. Survivor envoy pressing for union. Morning briefing at 10:00.";

