import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { isCurrentSaveRevision, validateExpectedSaveRevision } from "../src/lib/game/save-revision.mjs";
import { projectRoot } from "./with-app-env.mjs";

const root = projectRoot();

test("revision zero is valid for the first account save", () => {
  assert.equal(validateExpectedSaveRevision(0), 0);
  assert.equal(isCurrentSaveRevision(0, 0), true);
});

test("positive integer revisions are accepted without coercion", () => {
  assert.equal(validateExpectedSaveRevision(12), 12);
  assert.equal(isCurrentSaveRevision(12, 12), true);
  assert.equal(isCurrentSaveRevision(12, 13), false);
});

test("negative, fractional, string, and unsafe revisions are rejected", () => {
  for (const value of [-1, 1.5, "3", Number.MAX_SAFE_INTEGER + 1, null, undefined]) {
    assert.throws(() => validateExpectedSaveRevision(value), /revision/);
  }
});

test("invalid current revisions can never authorize an overwrite", () => {
  assert.equal(isCurrentSaveRevision(3, -1), false);
  assert.equal(isCurrentSaveRevision(3, 3.25), false);
  assert.equal(isCurrentSaveRevision(3, Number.MAX_SAFE_INTEGER + 1), false);
});

test("the save endpoint uses a conditional upsert and returns its new revision", () => {
  const source = readFileSync(join(root, "src/lib/game/save.ts"), "utf8");
  assert.match(source, /update game_saves[\s\S]*where user_id = \$\{context\.userId\} and revision = \$\{data\.expectedRevision\}/);
  assert.match(source, /where \$\{data\.expectedRevision\} = 0/);
  assert.match(source, /on conflict \(user_id\) do nothing/);
  assert.match(source, /returning revision/i);
  assert.match(source, /conflict: true as const/);
});

test("the migration adds revision compatibly to existing save rows", () => {
  const sql = readFileSync(join(root, "migrations/0003_save_revisions.sql"), "utf8");
  assert.match(sql, /ADD COLUMN IF NOT EXISTS revision BIGINT NOT NULL DEFAULT 1/i);
});

test("the browser store persists its account revision separately from the campaign snapshot", () => {
  const source = readFileSync(join(root, "src/lib/game/store.ts"), "utf8");
  assert.match(source, /remoteRevision: number \| null/);
  assert.match(source, /"remoteRevision"/);
  assert.match(source, /setRemoteRevision: \(remoteRevision\)/);
  assert.doesNotMatch(source.slice(source.indexOf("snapshot: () => {"), source.indexOf("loadSnapshot: (snap)")), /remoteRevision:/);
});

test("divergent local and account copies require an explicit player choice", () => {
  const shell = readFileSync(join(root, "src/components/game/GameShell.tsx"), "utf8");
  const banner = readFileSync(join(root, "src/components/game/SaveConflictBanner.tsx"), "utf8");
  assert.match(shell, /baseMatchesRemote/);
  assert.match(shell, /blockRemoteSaves\(\)/);
  assert.match(shell, /loadAccountCopy/);
  assert.match(shell, /keepDeviceCopy/);
  assert.match(banner, /Load account copy/);
  assert.match(banner, /Keep this device's campaign/);
});

test("the client sends its last known revision and blocks automatic retries after a conflict", () => {
  const source = readFileSync(join(root, "src/lib/game/play.ts"), "utf8");
  assert.match(source, /expectedRevision = useGame\.getState\(\)\.remoteRevision/);
  assert.match(source, /persistSave\(\{ data: \{ payload, expectedRevision \} \}\)/);
  assert.match(source, /if \(remoteSaveBlocked\) return/);
  assert.match(source, /remoteSaveBlocked = true/);
});


test("a conflict during an active session opens the same version-choice flow", () => {
  const play = readFileSync(join(root, "src/lib/game/play.ts"), "utf8");
  const shell = readFileSync(join(root, "src/components/game/GameShell.tsx"), "utf8");
  assert.match(play, /dispatchEvent\(new Event\("egunsentia:save-conflict"\)\)/);
  assert.match(shell, /addEventListener\("egunsentia:save-conflict"/);
  assert.match(shell, /const remote = await loadSave\(\)/);
  assert.match(shell, /setSaveConflict\(/);
});


test("clearing a campaign requires its current revision and cannot delete a newer save", () => {
  const source = readFileSync(join(root, "src/lib/game/save.ts"), "utf8");
  const clearHandler = source.slice(source.indexOf("export const clearSave"));
  assert.match(clearHandler, /\.validator\(\(input: unknown\)/);
  assert.match(clearHandler, /validateExpectedSaveRevision\(input\.expectedRevision\)/);
  assert.match(clearHandler, /delete from game_saves[\s\S]*where user_id = \$\{context\.userId\} and revision = \$\{data\.expectedRevision\}/);
  assert.match(clearHandler, /conflict: true as const/);
  assert.match(clearHandler, /returning revision/i);
});


test("all save endpoints scope access to the authenticated middleware context", () => {
  const source = readFileSync(join(root, "src/lib/game/save.ts"), "utf8");
  for (const endpoint of ["loadSave", "persistSave", "clearSave"]) {
    const start = source.indexOf(`export const ${endpoint} = createServerFn`);
    assert.ok(start >= 0, `${endpoint} exists`);
    const next = source.indexOf("\nexport const ", start + 1);
    const block = source.slice(start, next < 0 ? source.length : next);
    assert.match(block, /\.middleware\(\[authMiddleware\]\)/, `${endpoint} requires authMiddleware`);
    assert.match(block, /context\.userId/, `${endpoint} uses authenticated user identity`);
  }
});

test("persistSave does not accept a caller-selected account identity", () => {
  const source = readFileSync(join(root, "src/lib/game/save.ts"), "utf8");
  const start = source.indexOf("export const persistSave");
  const end = source.indexOf("\nexport const clearSave", start);
  const block = source.slice(start, end);
  assert.match(block, /return \{ payload: input\.payload as GameSnapshot, expectedRevision \}/);
  assert.match(block, /where user_id = \${context\.userId} and revision = \${data\.expectedRevision}/);
  assert.doesNotMatch(block, /data\.userId|input\.userId/);
});
