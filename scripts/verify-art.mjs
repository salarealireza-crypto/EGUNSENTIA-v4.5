// Art manifest verifier (A9.4 / A9.10).
//   node scripts/verify-art.mjs            strict: also requires every A9.4 group to be filled with real generated raster art
//   node scripts/verify-art.mjs --structure  structure only: paths exist, budgets hold, no generated entry is an SVG; reports art completeness without failing
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const structureOnly = process.argv.includes("--structure");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "public/art/ART_MANIFEST.json"), "utf8"));
const file = (p) => path.join(root, p.startsWith("/.grok/") ? p.slice(1) : `public${p}`);

// [label, id regex, required count, size budget KB]
const GROUPS = [
  ["gate states", /^gate\./, 16, 350], ["film posters", /^film\.poster/, 12, 150], ["film stills", /^film\.still/, 6, 350],
  ["evening hall tableaux", /^(hall|evening)\.tableau/, 8, 350], ["household rooms", /^(household|room)\./, 6, 350], ["wing banners", /^wing\./, 8, 350],
  ["panel heroes", /^hero\./, 25, 350], ["ministries", /^ministry\./, 9, 150], ["districts", /^district\./, 10, 150],
  ["factions", /^faction\./, 20, 150], ["envoys", /^envoy\./, 4, 150], ["NPC dossiers", /^npc\./, 24, 150], ["news mastheads", /^news\./, 5, 150],
  ["relic cards", /^relic\./, 20, 150], ["fragments", /^fragment\./, 7, 150], ["ceremonies", /^ceremony\./, 12, 350], ["moments", /^moment\./, 12, 350],
  ["chapters", /^chapter\./, 12, 350], ["bestiary", /^bestiary\./, 5, 150], ["atlas domains", /^atlas\./, 7, 150], ["expeditions", /^expedition\./, 4, 350],
  ["mini-games", /^minigame\./, 3, 150], ["boot/loading", /^boot\./, 4, 350],
];
const isRaster = (p) => /\.(webp|jpe?g|png|avif)$/i.test(p);
const problems = [];
const incomplete = [];
let totalBytes = 0;
const seen = new Set();
for (const a of manifest.assets) {
  if (seen.has(a.id)) problems.push(`duplicate id ${a.id}`);
  seen.add(a.id);
  const f = file(a.path);
  if (!fs.existsSync(f)) { problems.push(`missing file for ${a.id}: ${a.path}`); continue; }
  const size = fs.statSync(f).size;
  totalBytes += size;
  if (a.source === "generated" && !isRaster(a.path)) problems.push(`${a.id}: "generated" entry points at a non-raster file`);
  if (a.source === "generated" && !a.promptHash) problems.push(`${a.id}: generated entry has no promptHash`);
  if (a.source !== "preserved") {
    const g = GROUPS.find(([, re]) => re.test(a.id));
    const budget = (g?.[3] ?? 350) * 1024;
    if (size > budget) problems.push(`${a.id}: ${(size / 1024).toFixed(0)} KB exceeds ${budget / 1024} KB budget`);
  }
}
if (totalBytes > 60 * 1024 * 1024) problems.push(`public/art total ${(totalBytes / 1048576).toFixed(1)} MB exceeds 60 MB`);

console.log("group".padEnd(24), "real".padStart(5), "placeholder".padStart(12), "required".padStart(9));
for (const [label, re, need] of GROUPS) {
  const items = manifest.assets.filter((a) => re.test(a.id));
  const real = items.filter((a) => a.source === "generated" && isRaster(a.path)).length;
  console.log(label.padEnd(24), String(real).padStart(5), String(items.length - real).padStart(12), String(need).padStart(9));
  if (real < need) incomplete.push(`${label}: ${real}/${need} real generated assets`);
}
const gen = manifest.assets.filter((a) => a.source === "generated").length;
console.log(`\nassets: ${manifest.assets.length} total, ${gen} generated raster, ${manifest.assets.filter((a) => a.source === "code").length} code-drawn, ${manifest.assets.filter((a) => a.source === "preserved").length} preserved; ${(totalBytes / 1048576).toFixed(2)} MB`);
for (const p of problems) console.error("FAIL", p);
if (!structureOnly) for (const p of incomplete) console.error("INCOMPLETE", p);
const fail = problems.length > 0 || (!structureOnly && incomplete.length > 0);
console.log(fail ? "\nverify-art: FAIL" : structureOnly ? `\nverify-art: structure PASS (${incomplete.length} groups not yet filled with real art)` : "\nverify-art: PASS");
process.exit(fail ? 1 : 0);
