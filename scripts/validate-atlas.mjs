import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const taxonomy = JSON.parse(fs.readFileSync(path.join(root, "data/taxonomy.json"), "utf8"));
const reps = JSON.parse(fs.readFileSync(path.join(root, "data/family_representatives.json"), "utf8"));
const images = reps.representatives || [];
if (taxonomy.meta.totalFamilies !== taxonomy.families.length) throw new Error("taxonomy family count is stale");
if (images.length !== taxonomy.meta.totalFamilies) throw new Error("representative count does not match taxonomy");
for (const item of images) {
  if (!item.image || !fs.existsSync(path.join(root, item.image))) throw new Error(`missing image for ${item.familyName}`);
}
console.log(`Validated ${taxonomy.meta.totalNodes} nodes, ${images.length} families, and ${images.length} images.`);
