import test from "node:test";
import assert from "node:assert/strict";
import { collectTradeReminders } from "../src/lib/game/time.ts";

const offer = (overrides = {}) => ({
  id: "TR-01",
  faction: "Grotsen Dominion",
  representative: "Commissar Anton Dreyer",
  position: "Envoy",
  request: "Exchange rifles for water",
  offered: "Rifles",
  wanted: "Water",
  terms: "North-rail delivery",
  relation: "Cool",
  risk: "Water is politically sensitive",
  deadline: "before Council recess",
  status: "open",
  history: "Armistice trade channel",
  ...overrides,
});

test("an open recess offer receives its first reminder after the opening grace period", () => {
  const result = collectTradeReminders([offer()], 3);
  assert.equal(result.reminders.length, 1);
  assert.equal(result.trades[0].lastReminderDay, 3);
});

test("a recess reminder is not repeated daily and recurs no more than weekly", () => {
  const first = collectTradeReminders([offer()], 3).trades;
  assert.equal(collectTradeReminders(first, 4).reminders.length, 0);
  assert.equal(collectTradeReminders(first, 9).reminders.length, 0);
  const nextWeek = collectTradeReminders(first, 10);
  assert.equal(nextWeek.reminders.length, 1);
  assert.equal(nextWeek.trades[0].lastReminderDay, 10);
});

test("closed offers and offers without recess deadlines do not receive reminders", () => {
  const trades = [offer({ status: "accepted" }), offer({ id: "TR-02", deadline: "Watchday" })];
  const result = collectTradeReminders(trades, 30);
  assert.deepEqual(result.reminders, []);
  assert.deepEqual(result.trades, trades);
});
