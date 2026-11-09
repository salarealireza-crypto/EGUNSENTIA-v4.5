import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { claimAlTurnSlot, releaseAlTurnSlot } from "./al-rate-limit.mjs";
import { completeChat, missingArchiveKeyMessage, resolveLlmConfig } from "./xai";
import type { MemoryPack } from "./types";
import { validatePlayTurnInput } from "./gm-validation.mjs";

export type ChatBeat = { role: "player" | "scene"; text: string };

export const playTurn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) =>
    validatePlayTurnInput(input) as {
      action: string;
      history: ChatBeat[];
      state: string;
      memory: MemoryPack;
    },
  )
  .handler(async ({ data, context }) => {
    const { retrieveCanon, SYSTEM_CORE } = await import("./retrieve");
    if (!resolveLlmConfig().apiKey) {
      return { ok: false as const, error: missingArchiveKeyMessage() };
    }

    // Finish all local prompt assembly before reserving a billable AL slot.
    const canon = retrieveCanon(data.action + " " + data.memory.threads.join(" "));
    const recent = data.history.slice(-10);
    const memoryBlock = [
      `TURN ${data.memory.turnCount}`,
      data.memory.rollingSummary ? `ROLLING SUMMARY\n${data.memory.rollingSummary}` : "",
      data.memory.pinned.length ? `PINNED CHRONICLE\n- ${data.memory.pinned.join("\n- ")}` : "",
      data.memory.canonChanges.length ? `CANON CHANGES\n- ${data.memory.canonChanges.join("\n- ")}` : "",
      data.memory.edicts.length ? `STANDING EDICTS (enforce these)\n- ${data.memory.edicts.join("\n- ")}` : "",
      data.memory.threads.length ? `ACTIVE THREADS\n- ${data.memory.threads.join("\n- ")}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
      { role: "system", content: SYSTEM_CORE },
      {
        role: "system",
        content: `CURRENT STATE\n${data.state}\n\nMEMORY\n${memoryBlock.slice(0, 4000)}\n\nRETRIEVED CANON\n${canon}`,
      },
    ];
    for (const beat of recent) {
      messages.push({
        role: beat.role === "player" ? "user" : "assistant",
        content: beat.text.slice(0, 2800),
      });
    }
    messages.push({ role: "user", content: data.action.slice(0, 1600) });

    let rateLimitSql: Awaited<ReturnType<typeof getSql>>;
    let hasTurnSlot: boolean;
    try {
      rateLimitSql = await getSql();
      hasTurnSlot = await claimAlTurnSlot(rateLimitSql, context.userId);
    } catch {
      // Fail closed without exposing database connection details to the player.
      console.error("[AL] shared rate-limit ledger unavailable");
      return {
        ok: false as const,
        error: "The Hall cannot verify its shared speaking ledger right now. Try again shortly.",
      };
    }
    if (!hasTurnSlot) {
      return { ok: false as const, error: "The Hall is overfull this hour. Wait, then speak again." };
    }

    let result: Awaited<ReturnType<typeof completeChat>>;
    try {
      result = await completeChat(messages, 3600);
    } catch {
      try {
        await releaseAlTurnSlot(rateLimitSql, context.userId);
      } catch {
        console.error("[AL] failed request reservation could not be refunded");
      }
      return { ok: false as const, error: "The line to the archive dropped. The speaking slot was released where possible; try again." };
    }
    if (!result.ok) {
      try {
        await releaseAlTurnSlot(rateLimitSql, context.userId);
      } catch {
        console.error("[AL] failed request reservation could not be refunded");
      }
      return { ok: false as const, error: result.error };
    }
    return { ok: true as const, text: result.text };
  });
