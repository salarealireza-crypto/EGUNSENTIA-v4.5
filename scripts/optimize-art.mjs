import fs from "node:fs";
import path from "node:path";
const root=path.resolve("public/art");
let svg=0;
for (const name of fs.readdirSync(root,{recursive:true})){ if(String(name).endsWith(".svg")) svg++; }
console.log(`V4.5 demo art audit: ${svg} SVG assets. Preserved V4.1 rasters are intentionally not recompressed.`);
