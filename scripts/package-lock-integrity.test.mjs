import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { projectRoot } from "./with-app-env.mjs";

const root = projectRoot();
const manifest = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const lock = JSON.parse(readFileSync(join(root, "package-lock.json"), "utf8"));

test("package lock v3 matches the package manifest root", () => {
  assert.equal(lock.lockfileVersion, 3);
  assert.equal(lock.packages?.[""]?.name, manifest.name);
  for (const section of ["dependencies", "devDependencies", "optionalDependencies"]) {
    assert.deepEqual(
      lock.packages?.[""]?.[section] ?? {},
      manifest[section] ?? {},
      `${section} in package-lock.json must exactly match package.json`,
    );
  }
});

test("every direct dependency has a pinned package-lock entry", () => {
  for (const section of ["dependencies", "devDependencies", "optionalDependencies"]) {
    for (const name of Object.keys(manifest[section] ?? {})) {
      const entry = lock.packages?.[`node_modules/${name}`];
      assert.ok(entry?.version, `${name} is missing a locked version`);
    }
  }
});

test("every remote package tarball is protected by an integrity hash", () => {
  const missing = Object.entries(lock.packages ?? {})
    .filter(([path, entry]) => path && /^https?:\/\//.test(entry.resolved ?? "") && !entry.integrity)
    .map(([path]) => path);
  assert.deepEqual(missing, [], "remote lockfile entries without integrity hashes");
});
