import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { projectRoot } from "./with-app-env.mjs";

const root = projectRoot();

test("campaign and AL quota rows cascade when their owning account is deleted", () => {
  const migration = readFileSync(join(root, "migrations/0005_user_data_cascade.sql"), "utf8");
  assert.match(migration, /DELETE FROM game_saves[\s\S]*NOT EXISTS[\s\S]*account\.\"id\" = saved\.user_id/i);
  assert.match(migration, /DELETE FROM al_rate_limits[\s\S]*NOT EXISTS[\s\S]*account\.\"id\" = quota\.user_id/i);
  assert.match(migration, /game_saves_user_id_fkey[\s\S]*FOREIGN KEY \(user_id\) REFERENCES \"user\" \(\"id\"\) ON DELETE CASCADE/i);
  assert.match(migration, /al_rate_limits_user_id_fkey[\s\S]*FOREIGN KEY \(user_id\) REFERENCES \"user\" \(\"id\"\) ON DELETE CASCADE/i);
});

test("both account-owned data tables use the same identity key as Better Auth", () => {
  const auth = readFileSync(join(root, "migrations/0001_auth.sql"), "utf8");
  const saves = readFileSync(join(root, "migrations/0002_saves.sql"), "utf8");
  const quota = readFileSync(join(root, "migrations/0004_al_rate_limits.sql"), "utf8");
  assert.match(auth, /CREATE TABLE IF NOT EXISTS \"user\"[\s\S]*\"id\" text not null primary key/i);
  assert.match(saves, /user_id\s+text not null primary key/i);
  assert.match(quota, /user_id TEXT PRIMARY KEY/i);
});
