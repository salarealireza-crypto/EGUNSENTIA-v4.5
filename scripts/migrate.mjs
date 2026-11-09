#!/usr/bin/env node
/**
 * Explicit database migrator (node-postgres, `pg`).
 *
 * Run with `npm run db:migrate` as a deliberate deployment step, separately
 * from `npm run build`. Each file is applied in one transaction
 * under a transaction-scoped advisory lock, then recorded in `_migrations`.
 * Concurrent deploys therefore re-check the ledger after taking the lock.
 *
 * The read is non-recursive, so the opt-in auth schema under migrations/auth/
 * is not applied to an app that never asked for sign-in.
 *
 * Local PGLite uses the same migrations at startup instead (see src/lib/db.ts).
 * Vercel production and NODE_ENV=production require a valid DATABASE_URL and
 * fail closed; they never silently skip migrations or switch to PGLite.
 */
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";
import { pendingMigrations } from "./migration-plan.mjs";
import { resolveDatabaseRuntime } from "../src/lib/db-runtime-policy.mjs";
import { withMigrationTransaction } from "./migration-transaction.mjs";

const databaseRuntime = resolveDatabaseRuntime({
  databaseUrl: process.env.DATABASE_URL,
  nodeEnv: process.env.NODE_ENV,
  vercel: process.env.VERCEL,
  vercelEnv: process.env.VERCEL_ENV,
  allowEphemeralPglite: process.env.PGLITE_ALLOW_EPHEMERAL,
});
if (databaseRuntime.source === "pglite") {
  console.log("[migrate] local/explicit preview PGlite is migrated by the app bootstrap; no remote migration run.");
  process.exit(0);
}
const databaseUrl = databaseRuntime.databaseUrl;
if (!databaseUrl) throw new Error("The PostgreSQL deployment URL was not resolved.");

const migrationsDir = join(dirname(fileURLToPath(import.meta.url)), "..", "migrations");

async function main() {
  let entries;
  try {
    entries = await readdir(migrationsDir);
  } catch {
    console.log("[migrate] no migrations/ directory — nothing to do.");
    return;
  }
  // An app with no schema of its own must not pay for a database connection.
  if (pendingMigrations(entries, []).length === 0) {
    console.log("[migrate] no migrations — nothing to do.");
    return;
  }

  const pool = new pg.Pool({ connectionString: databaseUrl, max: 1 });
  const client = await pool.connect();
  try {
    let count = 0;
    // Consider every checked-in migration. Re-read the applied ledger only after
    // acquiring the DB-wide transaction lock, so another deploy cannot race us
    // with a stale list captured before it committed.
    for (const { name } of pendingMigrations(entries, [])) {
      const didApply = await withMigrationTransaction(client, async () => {
        await client.query(
          "CREATE TABLE IF NOT EXISTS _migrations (name TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT now())",
        );
        const applied = (await client.query("SELECT name FROM _migrations")).rows.map(
          (r) => r.name,
        );
        if (applied.includes(name)) return false;

        const text = await readFile(join(migrationsDir, name), "utf8");
        // pg's simple-query protocol runs a whole multi-statement file at once.
        await client.query(text);
        await client.query("INSERT INTO _migrations (name) VALUES ($1)", [name]);
        return true;
      });
      if (didApply) {
        console.log(`[migrate] applied ${name}`);
        count += 1;
      } else {
        console.log(`[migrate] already applied ${name}; skipped`);
      }
    }
    console.log(count ? `[migrate] done — ${count} migration(s) applied.` : "[migrate] up to date.");
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error("[migrate] failed:", err?.message || err);
  // pg errors carry the context needed to debug a bad SQL file.
  for (const key of ["code", "detail", "hint", "position", "where"]) {
    if (err?.[key] != null) console.error(`[migrate]   ${key}: ${err[key]}`);
  }
  process.exit(1);
});
