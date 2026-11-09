import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultEconomy, stockOutlook } from '../src/lib/game/sim/economy.ts';

test('stock outlook reports balance, days of cover and stable reserves', () => {
  const economy = defaultEconomy();
  const before = structuredClone(economy);
  const result = stockOutlook(economy, 'filters');
  assert.equal(result.stock, 200);
  assert.equal(result.dailyBalance, -7);
  assert.equal(result.daysOfCover, 200 / 15);
  assert.equal(result.status, 'stable');
  assert.deepEqual(economy, before, 'outlook must not mutate the simulation state');
});

test('stock outlook flags strained and critical reserves', () => {
  const economy = defaultEconomy();
  economy.food.stock = 600;
  assert.equal(stockOutlook(economy, 'food').status, 'strained');
  economy.food.stock = 200;
  assert.equal(stockOutlook(economy, 'food').status, 'critical');
});

test('zero-demand goods have no finite days-of-cover estimate', () => {
  const economy = defaultEconomy();
  economy.glass.demand = 0;
  const result = stockOutlook(economy, 'glass');
  assert.equal(result.daysOfCover, null);
  assert.equal(result.status, 'stable');
});
