import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const migrator = await readFile(new URL("./migrate.mjs", import.meta.url), "utf8");

test("production build is independent from database migration execution", () => {
  assert.equal(packageJson.scripts.build, "node scripts/with-app-env.mjs vite build");
  assert.equal(packageJson.scripts["db:migrate"], "node scripts/migrate.mjs");
  assert.doesNotMatch(packageJson.scripts.build, /migrat/i);
});

test("the explicit migration runner resolves the same fail-closed DB policy", () => {
  assert.match(migrator, /resolveDatabaseRuntime/);
  assert.match(migrator, /databaseRuntime\.source === "pglite"/);
  assert.match(migrator, /const databaseUrl = databaseRuntime\.databaseUrl/);
});
