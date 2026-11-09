/** In-character desk voice. Deterministic. No hidden numbers. Max 140 characters. */
import { PANEL_REGISTRY } from "./registry";

export type VoiceBand = "calm" | "strained" | "crisis";
export type VoiceContext = "low" | "clear" | "after";

const TAIL: Record<VoiceContext, string> = {
  low: "The stores are thin. Do not pretend.",
  clear: "Nothing is waiting on this desk.",
  after: "The order is written. It will answer later.",
};

/** Three band lines per advisor. Context tails make nine lines. */
const FLAVOR: Record<string, [string, string, string]> = {
  "Samer Vogt": [
    "The hall can hear you if you speak once.",
    "People are counting footsteps. Promise less.",
    "Do not dress a crisis as a courtesy.",
  ],
  "Security Guard": [
    "The door is shut. Name your business.",
    "Too many bodies in the corridor. Be brief.",
    "Weapons stay slung until I say otherwise.",
  ],
  "Wilhelmina Red": [
    "Sit. The lamps are lit for a reason.",
    "The house is listening harder than it admits.",
    "We do not panic where the children can see.",
  ],
  "Steward Office": [
    "The books match the barrels. For now.",
    "A shortage is already a rumour. Act before it is a speech.",
    "Feed the wards before you feed a ceremony.",
  ],
  "Elara Red": [
    "I brought you what can be said aloud.",
    "Someone is lying politely. I have not named them.",
    "Burn nothing. Hide the page, do not eat it.",
  ],
  "House Archive": [
    "The year is still open. Write in ink.",
    "Margins are full of almost-truths. Read twice.",
    "If the city falls, the book should still be true.",
  ],
  Engineering: [
    "The map is current only where feet have been.",
    "A mark is not a repair. Send the crew.",
    "If it groans, it is already late.",
  ],
  "Treasury Minister": [
    "Coin is a promise with a short memory.",
    "We can spend, or we can eat. Say which.",
    "Do not mint courage. It does not spend.",
  ],
  "Command Staff": [
    "The rota is posted. Break it only in ink.",
    "Three tasks are late. Pick the one that bleeds.",
    "Hold the wall. The rest can wait an hour.",
  ],
  "Master Armorer": [
    "Suits do not grow back. Treat them as kin.",
    "The queue is longer than the forge is kind.",
    "No heroics on a cracked joint.",
  ],
  "Ansgar Red": [
    "The Latch smells of sulfur and wet iron.",
    "Surface light is a liar. Take a lamp anyway.",
    "If the watch goes quiet, that is the alarm.",
  ],
  "Adelheid von Moren": [
    "Say the soft thing first. The hard thing stays.",
    "They are smiling with their treaties closed.",
    "A slight at this table outlives a skirmish.",
  ],
  "Dagmar Red": [
    "The wall is standing. That is the whole report.",
    "Do not send me a speech. Send me a name.",
    "Children do not ride the patrol. That is final.",
  ],
  "Training Office": [
    "Drills continue. Fear is not a curriculum.",
    "The young are watching who you spare.",
    "Train for the dark, not for the parade.",
  ],
  "Tomas Hesse": [
    "The cistern is speaking. It is not pleased.",
    "Water does not care for your schedule.",
    "If the west stair is wet, believe it.",
  ],
  "War Ministry": [
    "Readiness is a habit, not a mood.",
    "We can hold, or we can chase. Not both.",
    "Name the gate before you name the glory.",
  ],
  Council: [
    "Nine voices. One stamp. Make it legible.",
    "They will dissent. Let them, then decide.",
    "A decree that cannot be fed is a rumour.",
  ],
  "Housing Office": [
    "Beds are a policy. Say who sleeps dry.",
    "The outer wards are already sharing breath.",
    "Do not close a door you cannot reopen.",
  ],
  "Personnel Office": [
    "I know where they are. I will not gossip why.",
    "Someone is avoiding someone. The work still waits.",
    "Do not spend a person you cannot replace.",
  ],
  "Repair Ministry": [
    "Cracks first, paint never.",
    "The list is longer than the shift.",
    "If it sparks, clear the tunnel.",
  ],
  System: [
    "This desk is a tool. It is not a story.",
    "The check is unhappy. Read the line, then the cause.",
    "Settings do not save the city. They save the record.",
  ],
  "Ministry of Medicine": [
    "The infirmary is quiet. That can change.",
    "Quarantine is a kindness said without softness.",
    "Count the beds, not the bravery.",
  ],
  "Education Office": [
    "The children have questions. Answer one truly.",
    "Lessons continue. Fear can wait in the hall.",
    "Close the school only if the air is wrong.",
  ],
  "Stores Ministry": [
    "Rations are a sentence the city can read.",
    "The market is already telling on us.",
    "Open the reserve, or tell them why not.",
  ],
  "Rail Office": [
    "The rail is a promise with a timetable.",
    "A stalled car becomes a rumour by evening.",
    "Keep the line clear. Heroics block the tunnel.",
  ],
  "Surface Watch": [
    "Above is cold, bright, and not ours.",
    "Tracks where there should be none. I marked the map.",
    "Bring them home before you bring the trophy.",
  ],
  "Science Ministry": [
    "Quarantine the find. Wonder can wait.",
    "Confidence is not knowledge. Label it so.",
    "Do not skip the scan because a prince is curious.",
  ],
  "Archive Office": [
    "The card is filed. The doubt is filed beside it.",
    "Provenance or it did not happen.",
    "Seal what you cannot yet say.",
  ],
  "Time Office": [
    "The clock is the only honest minister.",
    "You are late to something. Choose which.",
    "An hour spent is an hour the city also spent.",
  ],
  "Household Office": [
    "The house is not a ministry. It still keeps score.",
    "Someone wanted a word and did not get it.",
    "Go home before the lamps accuse you.",
  ],
  "City Office": [
    "The wards are a map, not a metaphor.",
    "A bottleneck in one tunnel is a speech in another.",
    "Keep the lights on in the outer ring.",
  ],
  "Culture Office": [
    "A song is not a ration. It still holds a room.",
    "The old words are fraying. Mend one.",
    "Do not cancel the rite to look serious.",
  ],
};

const BANDS: VoiceBand[] = ["calm", "strained", "crisis"];
const CONTEXTS: VoiceContext[] = ["low", "clear", "after"];

function flavor(advisorId: string): [string, string, string] {
  return (
    FLAVOR[advisorId] ?? [
      `${advisorId} waits for a plain order.`,
      `${advisorId} says the day is tighter than it looks.`,
      `${advisorId} will not soften this.`,
    ]
  );
}

export function voiceLines(advisorId: string): string[] {
  const tone = flavor(advisorId);
  return BANDS.flatMap((band, bi) => CONTEXTS.map((ctx) => clip(`${tone[bi]} ${TAIL[ctx]}`)));
}

function clip(s: string): string {
  const t = s.replace(/\s+/g, " ").trim();
  return t.length <= 140 ? t : t.slice(0, 139).trimEnd() + "…";
}

export function advisorIds(): string[] {
  return [...new Set(PANEL_REGISTRY.map((p) => p.advisorId))];
}

export interface VoiceInput {
  crisis?: boolean;
  lowGauge?: boolean;
  pending?: boolean;
  justOrdered?: boolean;
}

export function voiceBand(input: VoiceInput): VoiceBand {
  if (input.crisis) return "crisis";
  if (input.lowGauge || input.pending) return "strained";
  return "calm";
}

export function voiceContext(input: VoiceInput): VoiceContext {
  if (input.justOrdered) return "after";
  if (input.lowGauge) return "low";
  return "clear";
}

/** Stable pick. Same state always yields the same line. */
export function pickVoice(advisorId: string, input: VoiceInput): string {
  const lines = voiceLines(advisorId);
  const bi = BANDS.indexOf(voiceBand(input));
  const ci = CONTEXTS.indexOf(voiceContext(input));
  return lines[bi * CONTEXTS.length + ci] ?? lines[0];
}
