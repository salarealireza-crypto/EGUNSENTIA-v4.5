import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolveDatabaseRuntime } from "../src/lib/db-runtime-policy.mjs";

const VALID_DATABASE_URL = "postgresql://egunsentia:secret@db.example.test/game?sslmode=require";

test("a local non-production process uses the local PGlite fallback", () => {
  assert.deepEqual(
    resolveDatabaseRuntime({ nodeEnv: "development" }),
    { source: "pglite" },
  );
});

test("a blank DATABASE_URL is unset locally, not a malformed Neon URL", () => {
  assert.deepEqual(
    resolveDatabaseRuntime({ databaseUrl: "  ", nodeEnv: "test" }),
    { source: "pglite" },
  );
});

test("a valid PostgreSQL URL always selects the durable backend", () => {
  assert.deepEqual(
    resolveDatabaseRuntime({ databaseUrl: ` ${VALID_DATABASE_URL} `, nodeEnv: "production", vercel: "1", vercelEnv: "production" }),
    { source: "neon", databaseUrl: VALID_DATABASE_URL },
  );
});

test("a malformed non-empty DATABASE_URL is rejected instead of falling back", () => {
  assert.throws(
    () => resolveDatabaseRuntime({ databaseUrl: "not-a-database-url", nodeEnv: "development" }),
    /valid PostgreSQL connection URL/,
  );
});

test("a non-PostgreSQL URL is rejected instead of being treated as durable storage", () => {
  assert.throws(
    () => resolveDatabaseRuntime({ databaseUrl: "https://db.example.test", nodeEnv: "development" }),
    /postgres:\/\/ or postgresql:\/\//,
  );
});

test("NODE_ENV production fails closed when DATABASE_URL is absent", () => {
  assert.throws(
    () => resolveDatabaseRuntime({ nodeEnv: "production" }),
    /DATABASE_URL is required when NODE_ENV=production/,
  );
});

test("Vercel production fails closed even when the ephemeral opt-in is set", () => {
  assert.throws(
    () => resolveDatabaseRuntime({ vercel: "1", vercelEnv: "production", nodeEnv: "production", allowEphemeralPglite: "true" }),
    /PGlite is never a production fallback/,
  );
});

test("Vercel preview requires explicit ephemeral-storage opt-in", () => {
  assert.throws(
    () => resolveDatabaseRuntime({ vercel: "1", vercelEnv: "preview", nodeEnv: "production" }),
    /PGLITE_ALLOW_EPHEMERAL=true/,
  );
});

test("Vercel preview allows PGlite only with explicit opt-in", () => {
  assert.deepEqual(
    resolveDatabaseRuntime({ vercel: "1", vercelEnv: "preview", nodeEnv: "production", allowEphemeralPglite: "true" }),
    { source: "pglite" },
  );
});

test("Vercel development also requires explicit ephemeral-storage opt-in", () => {
  assert.throws(
    () => resolveDatabaseRuntime({ vercel: "1", vercelEnv: "development", nodeEnv: "development" }),
    /PGLITE_ALLOW_EPHEMERAL=true/,
  );
  assert.deepEqual(
    resolveDatabaseRuntime({ vercel: "1", vercelEnv: "development", nodeEnv: "development", allowEphemeralPglite: "true" }),
    { source: "pglite" },
  );
});

test("the database module delegates backend selection to the fail-closed policy", async () => {
  const source = await readFile(new URL("../src/lib/db.ts", import.meta.url), "utf8");
  assert.match(source, /resolveDatabaseRuntime/);
  assert.match(source, /export const dbSource: DbSource = databaseRuntime\.source/);
  assert.doesNotMatch(source, /databaseUrl \? "neon" : "pglite"/);
});
