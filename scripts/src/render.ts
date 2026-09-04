import { safeUrl, type Listing, type Snapshot } from "./history";

export function escapeHtml(text: unknown): string {
  return String(text ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);
}
const cell = (value: unknown) => escapeHtml(value).replace(/\|/g, "&#124;").replace(/[\r\n]+/g, " ");
export const categoryLabel = (category: string) => category.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
export const dateLabel = (value: string | null) => value && !Number.isNaN(Date.parse(value)) ? new Date(value).toISOString().slice(0, 10) : "Unknown";
export function listingTable(jobs: Listing[]): string {
  const header = "| Company | Discipline | Position | Location | Status | Posted | First found | Last verified | Link |\n|---|---|---|---|---|---|---|---|---|";
  if (!jobs.length) return `${header}\n| No matching listings yet. | | | | | | | | |`;
  return header + "\n" + jobs.map((j) => {
    const href = safeUrl(j.url);
    const label = href && /\/(?:careers|jobs|careers-home\/jobs)\/?$/.test(new URL(href).pathname) ? "Career page" : "View job";
    return `| ${cell(j.companyName)} | ${cell(categoryLabel(j.category))} | ${cell(j.title)} | ${cell(j.location || "Not specified")} | ${j.status === "unverified" ? "Needs verification" : cell(j.status)} | ${dateLabel(j.postedAt)} | ${dateLabel(j.firstSeenAt)} | ${dateLabel(j.lastSeenAt)} | ${href ? `<a href="${cell(href)}">${label}</a>` : "Unavailable"} |`;
  }).join("\n");
}
export function renderReadme(snapshot: Snapshot): string {
  const active = snapshot.jobs.filter((j) => j.status !== "closed").sort((a, b) => b.score - a.score || (b.lastSeenAt ?? "").localeCompare(a.lastSeenAt ?? "") || a.title.localeCompare(b.title));
  const failed = snapshot.sources.filter((s) => s.status === "failed").length;
  return `Last checked: **${snapshot.updatedAt ?? "Not yet checked"}** · ${failed} failed sources. See [source health](data/sources.md) and [archive](ARCHIVE.md).\n\n### Confirmed 2027 in title\n\n${listingTable(active.filter((j) => j.term === "2027"))}\n\n### Year unspecified — verify the term with the employer\n\n${listingTable(active.filter((j) => j.term === "unspecified"))}\n\nOther-year roles are excluded from these tables and remain available in the browsing page and history. “Last verified” means last seen in a source feed, not a guarantee the employer still accepts applications.`;
}
export function renderSources(snapshot: Snapshot): string {
  return `# Source health\n\nLast attempted update: ${snapshot.updatedAt ?? "Not yet checked"}. “Partial” sources cannot establish that missing jobs are closed. “Unconfigured” companies are targets, not covered sources.\n\n| Company | Source | Result | Matches | Checked | Notes |\n|---|---|---|---|---|---|\n` + snapshot.sources.map((s) => `| ${cell(s.company)} | ${cell(s.source)} | ${s.status} | ${s.count} | ${cell(s.checkedAt)} | ${cell(s.detail)} |`).join("\n") + "\n";
}
export function replaceTable(readme: string, content: string): string {
  const start = "<!-- JOB_TABLE_START -->", end = "<!-- JOB_TABLE_END -->";
  if (readme.split(start).length !== 2 || readme.split(end).length !== 2 || readme.indexOf(start) > readme.indexOf(end)) {
    throw new Error("README requires exactly one ordered pair of job table markers.");
  }
  return readme.slice(0, readme.indexOf(start) + start.length) + "\n" + content + "\n" + readme.slice(readme.indexOf(end));
}
