import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { projectRoot } from "./with-app-env.mjs";

const root = projectRoot();
const read = (path) => readFileSync(join(root, path), "utf8");

test("campaign and AL write endpoints require the authenticated user middleware", () => {
  const gameMaster = read("src/lib/game/gm.ts");
  const saves = read("src/lib/game/save.ts");
  assert.match(gameMaster, /playTurn = createServerFn[\s\S]*?\.middleware\(\[authMiddleware\]\)/);
  for (const name of ["loadSave", "persistSave", "clearSave"]) {
    const start = saves.indexOf(`export const ${name}`);
    assert.notEqual(start, -1, `${name} exists`);
    const next = saves.indexOf("export const ", start + 1);
    const block = saves.slice(start, next === -1 ? undefined : next);
    assert.match(block, /\.middleware\(\[authMiddleware\]\)/, `${name} is authenticated`);
    assert.match(block, /context\.userId/, `${name} scopes operations to the authenticated account`);
  }
});

test("AL status is owner-authenticated and connector readiness rejects scripted cross-site requests", () => {
  const voice = read("src/lib/game/voice.ts");
  assert.match(voice, /\.middleware\(\[authMiddleware\]\)/);
  const readiness = read("src/lib/app-data/readiness.ts");
  assert.match(readiness, /assertSameSiteRequest\(\)/, "connector readiness has a same-site request guard");
});

test("the server authorization boundary enforces the creator allowlist", () => {
  const verify = read("src/lib/auth/verify.server.ts");
  assert.match(verify, /evaluateCreatorAccess\(user, process\.env\)/);
  assert.match(verify, /CreatorAccessDeniedError/);
  const policy = read("src/lib/auth/creator-access.mjs");
  assert.match(policy, /EGUNSENTIA_OWNER_EMAILS/);
  assert.match(policy, /EGUNSENTIA_OWNER_IDS/);
});

test("the root session lookup exposes only the minimum client identity fields", () => {
  const rootRoute = read("src/routes/__root.tsx");
  assert.match(rootRoute, /return u \? \{ id: u\.id, email: u\.email \} : null/);
  assert.doesNotMatch(rootRoute, /accessToken|refreshToken|session\.token|bearerToken/);
});
