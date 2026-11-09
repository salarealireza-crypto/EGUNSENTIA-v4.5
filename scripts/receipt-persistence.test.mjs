import test from "node:test";
import assert from "node:assert/strict";
import {
  receiptFingerprint,
  receiptPersistenceFromStorage,
} from "../src/lib/game/receipt-persistence.mjs";

const slip = {
  optionId: "24-OPT-02",
  title: "Council decree",
  done: ["Decree recorded."],
  spent: ["2 marks"],
  hear: ["A report will follow."],
  written: ["Council ledger"],
};

test("receipt fingerprint is stable for an unchanged persisted receipt", () => {
  assert.equal(receiptFingerprint(slip), receiptFingerprint({ ...slip }));
});

test("receipt fingerprint changes when authoritative receipt content changes", () => {
  assert.notEqual(receiptFingerprint(slip), receiptFingerprint({ ...slip, title: "Changed" }));
});

test("empty or invalid receipt has no fingerprint", () => {
  assert.equal(receiptFingerprint(null), "");
  assert.equal(receiptFingerprint("not-a-receipt"), "");
  const circular = {};
  circular.self = circular;
  assert.equal(receiptFingerprint(circular), "");
});

test("persistent storage is the only source of account-committed receipt status", () => {
  assert.equal(receiptPersistenceFromStorage(slip, "persistent"), "account-committed");
  assert.equal(receiptPersistenceFromStorage(slip, "ephemeral"), "ephemeral");
  assert.equal(receiptPersistenceFromStorage(slip, null), "device-only");
  assert.equal(receiptPersistenceFromStorage(slip, undefined), "device-only");
});

test("missing receipt never displays a committed persistence claim", () => {
  assert.equal(receiptPersistenceFromStorage(null, "persistent"), "device-only");
  assert.equal(receiptPersistenceFromStorage(undefined, "ephemeral"), "device-only");
});
