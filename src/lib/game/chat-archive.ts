import type { SceneTurn } from "./types";

export const CHAT_ARCHIVE_FORMAT = "EGUNSENTIA_CHAT_ARCHIVE";
export const CHAT_ARCHIVE_VERSION = 2;
const DATA_MARKER = "--- EGUNSENTIA_ARCHIVE_DATA_V2 ---";
const MAX_ARCHIVE_BYTES = 10_000_000;

function encodeBase64Utf8(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}

function decodeBase64Utf8(value: string): string {
  const binary = atob(value.replace(/\s/g, ""));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function roleLabel(role: SceneTurn["role"]): string {
  return role === "player" ? "THE FIST" : role === "scene" ? "AL" : "SYSTEM NOTE";
}

/** Human-readable UTF-8 transcript with a lossless embedded payload for exact restoration. */
export function serializeChatArchive(log: SceneTurn[]): string {
  const transcript = log.map((turn, index) => {
    const lines = [`[${String(index + 1).padStart(4, "0")}] ${roleLabel(turn.role)}`, turn.text];
    if (turn.role === "scene" && turn.variants?.length) {
      turn.variants.forEach((variant, variantIndex) => {
        if (variantIndex !== (turn.activeVariant ?? 0)) {
          lines.push(`\n[AL ALTERNATIVE ${variantIndex + 1}]`, variant);
        }
      });
    }
    return lines.join("\n");
  }).join("\n\n────────────────────────────────────────\n\n");
  const payload = encodeBase64Utf8(JSON.stringify({
    format: CHAT_ARCHIVE_FORMAT,
    version: CHAT_ARCHIVE_VERSION,
    exportedAt: new Date().toISOString(),
    log,
  }));
  return `EGUNSENTIA — CHAT HISTORY\nFormat: readable TXT · UTF-8\nMessages: ${log.length}\n\n${transcript}\n\n${DATA_MARKER}\n${payload}\n`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parsePayload(parsed: unknown): SceneTurn[] {
  if (!isRecord(parsed) || parsed.format !== CHAT_ARCHIVE_FORMAT || ![1, CHAT_ARCHIVE_VERSION].includes(Number(parsed.version))) {
    throw new Error("This is not a supported EGUNSENTIA chat archive.");
  }
  if (!Array.isArray(parsed.log) || parsed.log.length === 0 || parsed.log.length > 5000) {
    throw new Error("The chat archive is empty or too large.");
  }

  return parsed.log.map((entry, index) => {
    if (!isRecord(entry) || !["player", "scene", "note"].includes(String(entry.role)) || typeof entry.text !== "string") {
      throw new Error(`The chat archive contains an invalid message at position ${index + 1}.`);
    }
    const turn: SceneTurn = {
      id: typeof entry.id === "string" && entry.id ? entry.id : `imported-${index + 1}`,
      role: entry.role as SceneTurn["role"],
      text: entry.text,
    };
    if (entry.failed === true) turn.failed = true;
    if (Array.isArray(entry.variants) && entry.variants.every((value) => typeof value === "string")) {
      turn.variants = entry.variants as string[];
      const max = Math.max(0, turn.variants.length - 1);
      turn.activeVariant = typeof entry.activeVariant === "number"
        ? Math.max(0, Math.min(max, Math.floor(entry.activeVariant)))
        : 0;
    }
    if (isRecord(entry.footer)) {
      const footer = entry.footer;
      if (typeof footer.time === "string" && typeof footer.day === "string" && typeof footer.floor === "string" &&
        ["normal", "important", "critical", "emergency"].includes(String(footer.interrupt))) {
        turn.footer = {
          time: footer.time,
          day: footer.day,
          floor: footer.floor,
          interrupt: footer.interrupt as NonNullable<SceneTurn["footer"]>["interrupt"],
          ...(typeof footer.prompt === "string" ? { prompt: footer.prompt } : {}),
        };
      }
    }
    if (Array.isArray(entry.dice)) {
      turn.dice = entry.dice.filter((die): die is NonNullable<SceneTurn["dice"]>[number] =>
        isRecord(die) && typeof die.die === "string" && typeof die.reason === "string" &&
        typeof die.result === "number" && (die.vs === undefined || typeof die.vs === "number"),
      );
    }
    return turn;
  });
}

export function parseChatArchive(raw: string): SceneTurn[] {
  if (new TextEncoder().encode(raw).length > MAX_ARCHIVE_BYTES) {
    throw new Error("The chat archive is larger than the 10 MB import limit.");
  }
  // Backward compatibility with the original JSON-in-TXT export.
  if (raw.trimStart().startsWith("{")) return parsePayload(JSON.parse(raw));
  const markerIndex = raw.lastIndexOf(DATA_MARKER);
  if (markerIndex < 0) throw new Error("The TXT file does not contain EGUNSENTIA restore data.");
  const encoded = raw.slice(markerIndex + DATA_MARKER.length).trim();
  try {
    return parsePayload(JSON.parse(decodeBase64Utf8(encoded)));
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("The chat archive")) throw error;
    throw new Error("The TXT archive is damaged or its restore data is incomplete.");
  }
}
