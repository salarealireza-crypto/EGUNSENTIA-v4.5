import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { dbSource, getSql } from "@/lib/db";
import type { GameSnapshot } from "./types";
import { parseStoredSave, serializeSavePayload } from "./save-validation.mjs";
import { validateExpectedSaveRevision } from "./save-revision.mjs";

export const loadSave = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{ payload: string; updated_at: string; revision: number }>`
      select payload, updated_at, revision from game_saves where user_id = ${context.userId} limit 1
    `;
    const row = rows[0];
    if (!row) {
      return {
        ok: true as const,
        payload: null,
        updatedAt: null as string | null,
        revision: 0,
        storage: dbSource === "neon" ? "persistent" as const : "ephemeral" as const,
      };
    }
    try {
      const payload = parseStoredSave(row.payload) as GameSnapshot;
      return {
        ok: true as const,
        payload,
        updatedAt: row.updated_at,
        revision: Number(row.revision),
        storage: dbSource === "neon" ? "persistent" as const : "ephemeral" as const,
      };
    } catch (err) {
      console.error("[save] corrupt payload", err);
      return { ok: false as const, error: "The stored campaign could not be read." };
    }
  });

export const persistSave = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    if (
      input === null
      || typeof input !== "object"
      || Array.isArray(input)
      || !("payload" in input)
      || !("expectedRevision" in input)
    ) {
      throw new TypeError("Invalid campaign save request.");
    }
    const expectedRevision = validateExpectedSaveRevision(input.expectedRevision);
    return { payload: input.payload as GameSnapshot, expectedRevision };
  })
  .handler(async ({ context, data }) => {
    let text: string;
    try {
      text = serializeSavePayload(data.payload);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invalid campaign save.";
      return { ok: false as const, error: message };
    }
    const sql = await getSql();
    const rows = await sql<{ revision: number }>`
      with updated as (
        update game_saves
           set payload = ${text}, updated_at = now(), revision = revision + 1
         where user_id = ${context.userId} and revision = ${data.expectedRevision}
        returning revision
      ), inserted as (
        insert into game_saves (user_id, payload, updated_at, revision)
        select ${context.userId}, ${text}, now(), 1
         where ${data.expectedRevision} = 0
           and not exists (select 1 from updated)
        on conflict (user_id) do nothing
        returning revision
      )
      select revision from updated
      union all
      select revision from inserted
      limit 1
    `;
    const row = rows[0];
    if (!row) {
      return {
        ok: false as const,
        conflict: true as const,
        error: "Another device updated this campaign. Your local copy is preserved; reload to compare the account copy before choosing which version to keep.",
      };
    }
    return {
      ok: true as const,
      revision: Number(row.revision),
      storage: dbSource === "neon" ? "persistent" as const : "ephemeral" as const,
    };
  });

export const clearSave = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    if (input === null || typeof input !== "object" || Array.isArray(input) || !("expectedRevision" in input)) {
      throw new TypeError("Invalid campaign save revision.");
    }
    return { expectedRevision: validateExpectedSaveRevision(input.expectedRevision) };
  })
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql<{ revision: number }>`
      delete from game_saves
       where user_id = ${context.userId} and revision = ${data.expectedRevision}
      returning revision
    `;
    if (!rows[0]) {
      return {
        ok: false as const,
        conflict: true as const,
        error: "The account campaign changed before it could be cleared. Reload and compare the current version first.",
      };
    }
    return { ok: true as const, revision: Number(rows[0].revision) };
  });
