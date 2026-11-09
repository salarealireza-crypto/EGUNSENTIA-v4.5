# Size cleanup (2026-10-12)
Removed only regenerable or duplicate files; no source, canon, art, saves or ledger was touched.
- .vercel/output (8.4 MB): build output, recreated by `npm run build`.
- attachments/EGUNSENTIA v4.5 .zip (4.9 MB): older full snapshot of this same project (07:39 Oct 10). Current files are newer.
- screenshots/*.png (2.9 MB): old QA captures; smoke tests recreate them.
Note: the Super Lore file and the V4.5 update prompt are NOT in attachments/ any more. Re-add them if a session needs them (canon JSON in src/lib/canon is the working copy).
Keep when exporting: do not zip node_modules, .vercel, or nested zips.
