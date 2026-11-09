import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";
import {
  attachSnapshotAutosave,
  createInFlightSaveDeduper,
} from "../src/lib/game/save-autosave.ts";

function makeStore(initialState) {
  let state = initialState;
  const listeners = new Set();
  return {
    getState: () => state,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    setState(nextState) {
      const previous = state;
      state = nextState;
      for (const listener of listeners) listener(state, previous);
    },
    listenerCount: () => listeners.size,
  };
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

test("snapshot autosave coalesces rapid changes and ignores UI-only state", async () => {
  const store = makeStore({ snapshot: { turn: 0 }, notice: null });
  const writes = [];
  const detach = attachSnapshotAutosave(
    store,
    (state) => state.snapshot,
    async () => { writes.push(store.getState().snapshot.turn); },
    15,
  );

  store.setState({ snapshot: { turn: 0 }, notice: "Opened a panel" });
  await sleep(25);
  assert.deepEqual(writes, [], "notice-only changes are outside the game snapshot");

  store.setState({ snapshot: { turn: 1 }, notice: null });
  await sleep(5);
  store.setState({ snapshot: { turn: 2 }, notice: null });
  await sleep(30);
  assert.deepEqual(writes, [2], "only the latest rapid snapshot is flushed");

  detach();
  assert.equal(store.listenerCount(), 0);
});

test("snapshot autosave cleanup cancels a pending debounce", async () => {
  const store = makeStore({ snapshot: { turn: 0 } });
  let writes = 0;
  const detach = attachSnapshotAutosave(store, (state) => state.snapshot, async () => { writes += 1; }, 15);
  store.setState({ snapshot: { turn: 1 } });
  detach();
  await sleep(30);
  assert.equal(writes, 0);
  assert.equal(store.listenerCount(), 0);
});

test("concurrent flush requests for the same snapshot share one write", async () => {
  const dedupe = createInFlightSaveDeduper();
  let writes = 0;
  let release;
  const gate = new Promise((resolve) => { release = resolve; });
  const work = async () => { writes += 1; await gate; return "saved"; };

  const first = dedupe("snapshot-1", work);
  const second = dedupe("snapshot-1", work);
  await Promise.resolve();
  assert.equal(writes, 1);
  release();
  assert.deepEqual(await Promise.all([first, second]), ["saved", "saved"]);
});

test("different snapshot keys are not incorrectly coalesced", async () => {
  const dedupe = createInFlightSaveDeduper();
  const writes = [];
  const first = dedupe("snapshot-1", async () => { writes.push("one"); return "one"; });
  const second = dedupe("snapshot-2", async () => { writes.push("two"); return "two"; });
  assert.deepEqual(await Promise.all([first, second]), ["one", "two"]);
  assert.deepEqual(writes.sort(), ["one", "two"]);
});

test("an empty account load is not marked as a committed remote snapshot", async () => {
  const source = await readFile(new URL("../src/components/game/GameShell.tsx", import.meta.url), "utf8");
  const branch = source.match(/\} else if \(remote\.ok\) \{([\s\S]*?)\n        \} else \{/);
  assert.ok(branch, "the empty account-load branch remains explicit");
  assert.match(branch[1], /markRemoteSaveBaseline\(null, remote\.storage\)/);
  assert.doesNotMatch(branch[1], /snapshot\(\)/, "a non-persisted local seed must not be treated as the account copy");
  assert.match(branch[1], /setHasServerSave\(false\)/);
});

test("Receipts distinguish ephemeral server storage from a device-only copy", async () => {
  const source = await readFile(new URL("../src/components/platform/Receipt.tsx", import.meta.url), "utf8");
  const model = await readFile(new URL("../src/lib/game/p4-simulation.ts", import.meta.url), "utf8");
  const helper = await readFile(new URL("../src/lib/game/receipt-persistence.mjs", import.meta.url), "utf8");
  assert.match(model, /export type ReceiptPersistence = "pending" \| "account-committed" \| "ephemeral" \| "device-only"/);
  assert.match(source, /import type \{ ReceiptPersistence, ReceiptSlip \}/);
  assert.match(source, /ephemeral local preview database; it will not survive a server restart/);
  assert.match(source, /Device copy only\. A persistent account save was not confirmed/);
  assert.match(helper, /storage === "persistent"/);
  assert.match(helper, /storage === "ephemeral"/);
});

test("restored Receipt status is derived from the authoritative remote load classification", async () => {
  const source = await readFile(new URL("../src/components/game/GameShell.tsx", import.meta.url), "utf8");
  assert.match(source, /loadSnapshot\(remote\.payload\);\s*useGame\.getState\(\)\.setReceiptPersistence\(receiptPersistenceFromStorage\(remote\.payload\.p4\?\.lastReceipt, remote\.storage\)\)/);
  assert.match(source, /loadSnapshot\(saveConflict\.payload\);\s*useGame\.getState\(\)\.setReceiptPersistence\(receiptPersistenceFromStorage\(saveConflict\.payload\.p4\?\.lastReceipt, saveConflict\.storage\)\)/);
});

test("runtime Receipt status is not included in the campaign snapshot or browser persistence allowlist", async () => {
  const source = await readFile(new URL("../src/lib/game/store.ts", import.meta.url), "utf8");
  const persist = source.match(/const persistKeys = \[([\s\S]*?)\] as const/);
  const snapshot = source.match(/snapshot: \(\) => \{([\s\S]*?)\n      \},\n      loadSnapshot:/);
  assert.ok(persist && snapshot);
  assert.doesNotMatch(persist[1], /receiptPersistence/);
  assert.doesNotMatch(snapshot[1], /receiptPersistence/);
});

test("navigating between desks does not downgrade a confirmed Receipt", async () => {
  const source = await readFile(new URL("../src/components/game/CommandDeck.tsx", import.meta.url), "utf8");
  const navigation = source.match(/const openWing = \([\s\S]*?\n  const runOrder/);
  assert.ok(navigation);
  assert.doesNotMatch(navigation[0], /setReceiptPersistence\("device-only"\)/);
  assert.match(source, /setReceiptOpen\(Boolean\(receiptKey\) && p4\.lastReceipt\?\.optionId !== "24-OPT-02"\)/);
});
