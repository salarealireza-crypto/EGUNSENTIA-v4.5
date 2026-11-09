import test from "node:test";
import assert from "node:assert/strict";
import { createLatestSaveQueue } from "../src/lib/game/save-queue.ts";

const deferred = () => {
  let resolve;
  const promise = new Promise((done) => { resolve = done; });
  return { promise, resolve };
};

test("remote save writes are serialized and a queued stale snapshot is skipped", async () => {
  const first = deferred();
  const started = deferred();
  const writes = [];
  const queue = createLatestSaveQueue(async (snapshot) => {
    writes.push(snapshot);
    if (snapshot === "old-in-flight") {
      started.resolve();
      await first.promise;
    }
  });

  const a = queue("old-in-flight");
  await started.promise;
  const b = queue("stale-queued");
  const c = queue("latest");
  first.resolve();
  await Promise.all([a, b, c]);

  assert.deepEqual(writes, ["old-in-flight", "latest"]);
});

test("a failed save does not block a later newer snapshot", async () => {
  const writes = [];
  const queue = createLatestSaveQueue(async (snapshot) => {
    writes.push(snapshot);
    if (snapshot === "fails") throw new Error("offline");
  });

  await assert.rejects(queue("fails"), /offline/);
  await queue("recovers");
  assert.deepEqual(writes, ["fails", "recovers"]);
});

test("a skipped stale snapshot is reported as not saved", async () => {
  const first = deferred();
  const started = deferred();
  const queue = createLatestSaveQueue(async (snapshot) => {
    if (snapshot === "older") {
      started.resolve();
      await first.promise;
    }
  });

  const older = queue("older");
  await started.promise;
  const stale = queue("stale");
  const latest = queue("latest");
  first.resolve();

  assert.deepEqual(await Promise.all([older, stale, latest]), [false, false, true]);
});

test("a server response with ok=false rejects instead of appearing saved", async () => {
  const queue = createLatestSaveQueue(async () => ({ ok: false, error: "payload rejected" }));
  await assert.rejects(queue("campaign"), /payload rejected/);
});
