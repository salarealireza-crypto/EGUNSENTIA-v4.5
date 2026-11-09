import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { AL_RATE_LIMIT_PER_HOUR, claimAlTurnSlot } from "../src/lib/game/al-rate-limit.mjs";
import { projectRoot } from "./with-app-env.mjs";

const root = projectRoot();

test("the shared AL quota uses one hourly limit per verified account", async () => {
  let received;
  const accepted = await claimAlTurnSlot({
    async query(text, params) {
      received = { text, params };
      return [{ request_count: 1 }];
    },
  }, "verified-user-1");
  assert.equal(accepted, true);
  assert.deepEqual(received.params, ["verified-user-1", 36]);
  assert.equal(AL_RATE_LIMIT_PER_HOUR, 36);
  assert.match(received.text, /ON CONFLICT \(user_id\) DO UPDATE/i);
  assert.match(received.text, /request_count < \$2/i);
  assert.match(received.text, /RETURNING request_count/i);
});

test("a full active window denies the slot without treating it as a DB failure", async () => {
  const accepted = await claimAlTurnSlot({ async query() { return []; } }, "verified-user-1");
  assert.equal(accepted, false);
});

test("the AL quota refuses a missing or blank verified identity", async () => {
  for (const userId of ["", "  ", null, undefined, 7]) {
    await assert.rejects(
      claimAlTurnSlot({ async query() { throw new Error("must not query"); } }, userId),
      /verified user id/,
    );
  }
});

test("the migration creates an account-scoped, indexed rate-limit ledger", () => {
  const migration = readFileSync(join(root, "migrations/0004_al_rate_limits.sql"), "utf8");
  assert.match(migration, /user_id TEXT PRIMARY KEY/i);
  assert.match(migration, /request_count INTEGER NOT NULL CHECK \(request_count > 0\)/i);
  assert.match(migration, /window_started_at_idx/i);
});

test("AL requests consume the shared DB quota instead of a process-local map", () => {
  const source = readFileSync(join(root, "src/lib/game/gm.ts"), "utf8");
  assert.match(source, /claimAlTurnSlot\(rateLimitSql, context\.userId\)/);
  assert.match(source, /getSql\(\)/);
  assert.doesNotMatch(source, /new Map<string, \{ start: number; n: number \}>/);
});


test("database failures reject the quota claim instead of granting a turn", async () => {
  await assert.rejects(
    claimAlTurnSlot({ async query() { throw new Error("database unavailable"); } }, "verified-user-1"),
    /database unavailable/,
  );
});

test("AL fails closed with a controlled message when the shared ledger is unavailable", () => {
  const source = readFileSync(join(root, "src/lib/game/gm.ts"), "utf8");
  assert.match(source, /try\s*\{[\s\S]*claimAlTurnSlot\(rateLimitSql, context\.userId\)[\s\S]*catch/);
  assert.match(source, /cannot verify its shared speaking ledger/);
  assert.doesNotMatch(source, /console\.error\([^)]*(DATABASE_URL|apiKey|secret)/i);
});

test("the rate-limit window is based on database time, not a serverless instance clock", async () => {
  let statement = "";
  await claimAlTurnSlot({ async query(text) { statement = text; return [{ request_count: 2 }]; } }, "verified-user-1");
  assert.match(statement, /now\(\)/i);
  assert.match(statement, /interval '1 hour'/i);
});
