import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getJobs } from "./scraper";
import { Job } from "./types";
import { notifyNewJobs } from "./notify";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const README_PATH = path.join(__dirname, "../../README.md");
const TABLE_START = "<!-- JOB_TABLE_START -->";
const TABLE_END = "<!-- JOB_TABLE_END -->";

function normalizeUrl(url: string) {
  try {
    return url.split("?")[0].toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

function dedupeJobs(jobs: Job[]) {
  const seen = new Set<string>();
  return jobs.filter((job) => {
    const key = `${normalizeUrl(job.url)}|${job.companyName}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function formatDate(dateString: string | null) {
  if (!dateString) {
    return "n/a";
  }
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "n/a";
  }
  return date.toISOString().split("T")[0];
}

function buildTable(jobs: Job[]) {
  if (jobs.length === 0) {
    return `| Company | Category | Position | Location | Source | Posted | Age | Link |
|---|---|---|---|---|---|---|---|
| _No jobs available yet. Run \`bun run generate\` in the scripts directory to populate this table._ | | | | | | |`;
  }

  const rows = jobs.map((job) => {
    const company = job.companyUrl
      ? `<a href="${job.companyUrl}"><strong>${job.companyName}</strong></a>`
      : `<strong>${job.companyName}</strong>`;
    const link = job.url
      ? `<a href="${job.url}"><img src="https://i.imgur.com/JpkfjIq.png" alt="Apply" width="70"/></a>`
      : "";
    const age = job.ageDays !== null ? `${job.ageDays}d` : "n/a";
    const postedAt = formatDate(job.postedAt);

    return `| ${company} | ${job.category} | ${job.title} | ${job.location ?? "Remote / Flexible"} | ${job.source} | ${postedAt} | ${age} | ${link} |`;
  });

  return `| Company | Category | Position | Location | Source | Posted | Age | Link |
|---|---|---|---|---|---|---|---|
${rows.join("\n")}`;
}

function updateReadme(tableContent: string) {
  const readme = fs.readFileSync(README_PATH, "utf8");
  const before = readme.split(TABLE_START)[0];
  const after = readme.split(TABLE_END)[1] ?? "";
  const updated = `${before}${TABLE_START}\n${tableContent}\n${TABLE_END}${after}`;
  fs.writeFileSync(README_PATH, updated, "utf8");
}

const MAX_JOB_AGE_DAYS = 120;

function isFreshJob(job: Job) {
  return job.ageDays === null || job.ageDays <= MAX_JOB_AGE_DAYS;
}

async function main() {
  const jobs = await getJobs();
  const uniqueJobs = dedupeJobs(jobs);
  const freshJobs = uniqueJobs.filter(isFreshJob);
  const sortedJobs = freshJobs.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    if (a.ageDays === null) return 1;
    if (b.ageDays === null) return -1;
    return a.ageDays - b.ageDays;
  });

  const table = buildTable(sortedJobs);
  updateReadme(table);
  await notifyNewJobs(sortedJobs);
  console.log(`Updated README with ${sortedJobs.length} fresh unique jobs.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
