import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const exists = (p) => { const raw = String(p); const rel = raw.startsWith('/art/') ? `public${raw}` : raw.startsWith('/.grok/') ? raw.slice(1) : raw.startsWith('/') ? `public${raw}` : raw; return fs.existsSync(path.join(root, rel)); };
const failures = [];
const fail = (msg) => failures.push(msg);

const registry = read('src/lib/platform/registry.ts');
const lore = read('attachments/EGUNSENTIA_V4.1_SUPER_LORE_MASTER.txt');
const excerpts = JSON.parse(read('src/lib/canon/excerpts.json'));
const manifest = JSON.parse(read('public/art/ART_MANIFEST.json'));
const catalog = read('src/lib/platform/options/catalog.ts');

const numbers = [...registry.matchAll(/"number"\s*:\s*(\d+)/g)].map(m => Number(m[1]));
if (numbers.length !== 65 || new Set(numbers).size !== 65) fail(`expected 65 unique canonical panels, got ${numbers.length}`);
for (let i = 1; i <= 65; i++) if (!numbers.includes(i)) fail(`missing canonical panel [${String(i).padStart(2,'0')}]`);

const canonText = lore + '\n' + JSON.stringify(excerpts);
for (const phrase of [
  '960 ready + 40 in repair = 1,000',
  'total known population baseline: 60,000',
  '15 lost + 27 used/active tracked tunnels = 42'
]) if (!canonText.includes(phrase)) fail(`canon phrase not found: ${phrase}`);

if (manifest.assets.length < 150) fail(`art manifest unexpectedly small: ${manifest.assets.length}`);
for (const a of manifest.assets) if (!exists(a.path)) fail(`missing registered asset: ${a.path}`);
if (!manifest.assets.some(a => a.source === 'preserved')) fail('no preserved V4.1 assets registered');

const ids = [...registry.matchAll(/"id"\s*:\s*"([0-9]{2})"/g)].map(m => m[1]);
if (ids.length !== 65) fail(`expected 65 panel ids, got ${ids.length}`);
for (const id of ids) if (!catalog.includes(`"${id}": [`)) fail(`missing option catalog for panel ${id}`);

if (failures.length) {
  for (const f of failures) console.error(`FAIL: ${f}`);
  process.exitCode = 1;
} else {
  console.log(`PASS: 65-panel canon registry, invariants, ${manifest.assets.length} assets, preserved art, and all option catalogs verified.`);
}
