import assert from "node:assert/strict";
import { test } from "node:test";
import { withMigrationTransaction } from "./migration-transaction.mjs";

function fakeClient() {
  const calls = [];
  return {
    calls,
    async query(text, values) {
      calls.push({ text, values });
      return { rows: [] };
    },
  };
}

test("migration work is protected by a transaction-scoped advisory lock", async () => {
  const client = fakeClient();
  let ran = false;
  const result = await withMigrationTransaction(client, async () => {
    ran = true;
    client.calls.push({ text: "MIGRATION BODY" });
    return "applied";
  });

  assert.equal(result, "applied");
  assert.equal(ran, true);
  assert.deepEqual(client.calls.map((call) => call.text), [
    "BEGIN",
    "SELECT pg_advisory_xact_lock($1, $2)",
    "MIGRATION BODY",
    "COMMIT",
  ]);
  assert.deepEqual(client.calls[1].values, [1162309966, 1397045844]);
});

test("a failed migration rolls back and releases the transaction-scoped lock", async () => {
  const client = fakeClient();
  await assert.rejects(
    withMigrationTransaction(client, async () => { throw new Error("DDL failed"); }),
    /DDL failed/,
  );
  assert.deepEqual(client.calls.map((call) => call.text), [
    "BEGIN",
    "SELECT pg_advisory_xact_lock($1, $2)",
    "ROLLBACK",
  ]);
});

test("a rollback failure does not replace the original migration error", async () => {
  const calls = [];
  const client = {
    async query(text) {
      calls.push(text);
      if (text === "ROLLBACK") throw new Error("connection lost");
      return { rows: [] };
    },
  };
  await assert.rejects(
    withMigrationTransaction(client, async () => { throw new Error("original DDL error"); }),
    /original DDL error/,
  );
  assert.deepEqual(calls, [
    "BEGIN",
    "SELECT pg_advisory_xact_lock($1, $2)",
    "ROLLBACK",
  ]);
});

test("the deploy migrator refreshes the ledger under the advisory lock for every file", async () => {
  const { readFileSync } = await import("node:fs");
  const { projectRoot } = await import("./with-app-env.mjs");
  const source = readFileSync(`${projectRoot()}/scripts/migrate.mjs`, "utf8");
  assert.match(source, /withMigrationTransaction\(client, async \(\) =>/);
  assert.match(source, /SELECT name FROM _migrations/);
  assert.match(source, /if \(applied\.includes\(name\)\) return false/);
  assert.match(source, /pendingMigrations\(entries, \[\]\)/);
});


test("a COMMIT failure triggers rollback and preserves the commit error", async () => {
  const calls = [];
  const client = {
    async query(text, values) {
      calls.push({ text, values });
      if (text === "COMMIT") throw new Error("commit acknowledgement lost");
      return { rows: [] };
    },
  };

  await assert.rejects(
    withMigrationTransaction(client, async () => "migration body complete"),
    /commit acknowledgement lost/,
  );
  assert.deepEqual(calls.map((call) => call.text), [
    "BEGIN",
    "SELECT pg_advisory_xact_lock($1, $2)",
    "COMMIT",
    "ROLLBACK",
  ]);
});

test("an advisory-lock failure prevents migration work and rolls back", async () => {
  const calls = [];
  const client = {
    async query(text, values) {
      calls.push({ text, values });
      if (text.startsWith("SELECT pg_advisory_xact_lock")) {
        throw new Error("lock unavailable");
      }
      return { rows: [] };
    },
  };
  let ran = false;

  await assert.rejects(
    withMigrationTransaction(client, async () => { ran = true; }),
    /lock unavailable/,
  );
  assert.equal(ran, false);
  assert.deepEqual(calls.map((call) => call.text), [
    "BEGIN",
    "SELECT pg_advisory_xact_lock($1, $2)",
    "ROLLBACK",
  ]);
});
