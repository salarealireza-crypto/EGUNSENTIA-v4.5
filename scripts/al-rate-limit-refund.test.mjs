import test from "node:test";
import assert from "node:assert/strict";
import { releaseAlTurnSlot } from "../src/lib/game/al-rate-limit.mjs";

test("failed AL operation releases only a still-active reservation", async () => {
  const statements = [];
  const sql = { async query(text, params) {
    statements.push({ text, params });
    return statements.length === 1 ? [] : [{ released: true }];
  } };
  assert.equal(await releaseAlTurnSlot(sql, "verified-user"), true);
  assert.equal(statements.length, 2);
  assert.match(statements[0].text, /request_count = request_count - 1/);
  assert.match(statements[0].text, /request_count > 1/);
  assert.match(statements[0].text, /interval '1 hour'/);
  assert.match(statements[1].text, /DELETE FROM al_rate_limits/i);
  assert.deepEqual(statements[0].params, ["verified-user"]);
});

test("AL refund rejects unverified identities without touching storage", async () => {
  await assert.rejects(releaseAlTurnSlot({ async query() { throw new Error("should not run"); } }, " "), /verified user id/);
});
