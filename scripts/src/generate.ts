import fs from "node:fs";
import path from "node:path";
import { getSnapshot } from "./scraper";
import { emptySnapshot, readSnapshot, reconcile, filterSnapshot } from "./history";
import { listingTable, renderReadme, renderSources, replaceTable } from "./render";
import { renderBrowser } from "./site";

const root = path.resolve(import.meta.dir, "../..");
const historyPath = path.join(root, "data/listings.json");
const readmePath = path.join(root, "README.md");
const readme = fs.readFileSync(readmePath, "utf8");
replaceTable(readme, "");
const previous = fs.existsSync(historyPath) ? readSnapshot(fs.readFileSync(historyPath, "utf8")) : emptySnapshot();
const offline = process.argv.includes("--offline");
const result = offline ? null : await getSnapshot();
const snapshot = result ? reconcile(previous, result.jobs, result.sources, new Date().toISOString()) : filterSnapshot(previous);
const files = new Map([
  [historyPath, JSON.stringify(snapshot, null, 2) + "\n"],
  [readmePath, replaceTable(readme, renderReadme(snapshot))],
  [path.join(root, "data/sources.md"), renderSources(snapshot)],
  [path.join(root, "ARCHIVE.md"), "# Closed listings\n\nClosed means absent from a complete feed on two different UTC days. Reappearing jobs reopen automatically. Other-year roles are not automatically closed.\n\n" + listingTable(snapshot.jobs.filter((j) => j.status === "closed")) + "\n"],
  [path.join(root, "docs/index.html"), renderBrowser(snapshot)],
]);
for (const [file, content] of files) {
  if (!fs.existsSync(path.dirname(file))) fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file + ".tmp", content);
  fs.renameSync(file + ".tmp", file);
}
console.log(`${offline ? "Rendered stored history" : "Updated history"}: ${snapshot.jobs.length} listings; ${snapshot.sources.filter((s) => s.status === "failed").length} failed sources.`);
// Public generation never sends messages; notifications require a separate opt-in action.
