import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Job } from "./types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NOTIFIED_PATH = path.join(__dirname, "../notified-jobs.json");
const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL ?? process.env.WEBHOOK_URL ?? "";

function normalizeUrl(url: string) {
  try {
    return url.split("?")[0].toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

function loadNotifiedJobs(): Set<string> {
  try {
    if (!fs.existsSync(NOTIFIED_PATH)) {
      return new Set();
    }

    const raw = fs.readFileSync(NOTIFIED_PATH, "utf8");
    const list = JSON.parse(raw) as string[];
    return new Set(list);
  } catch {
    return new Set();
  }
}

function saveNotifiedJobs(urls: Set<string>) {
  try {
    fs.writeFileSync(NOTIFIED_PATH, JSON.stringify([...urls], null, 2), "utf8");
  } catch {
    // no-op
  }
}

async function sendDiscordAlert(job: Job) {
  if (!WEBHOOK_URL) {
    return;
  }

  const payload = {
    username: "Internship Tracker",
    embeds: [
      {
        title: `${job.companyName} — ${job.title}`,
        url: job.url || undefined,
        description: `**Location:** ${job.location ?? "Remote / Flexible"}\n**Source:** ${job.source}\n**Category:** ${job.category}\n**Score:** ${job.score}`,
        color: 0x00b0f4,
        timestamp: new Date().toISOString(),
        fields: [
          {
            name: "Posted",
            value: job.postedAt ? new Date(job.postedAt).toISOString().split("T")[0] : "n/a",
            inline: true,
          },
          {
            name: "Age",
            value: job.ageDays !== null ? `${job.ageDays}d` : "n/a",
            inline: true,
          },
        ],
      },
    ],
  };

  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    // ignore failures so alerts do not break pipeline
  }
}

export async function notifyNewJobs(jobs: Job[]) {
  if (!WEBHOOK_URL) {
    return;
  }

  const notifiedUrls = loadNotifiedJobs();
  let changed = false;

  for (const job of jobs) {
    const normalized = normalizeUrl(job.url || `${job.companyName}-${job.title}`);
    if (notifiedUrls.has(normalized)) {
      continue;
    }

    await sendDiscordAlert(job);
    notifiedUrls.add(normalized);
    changed = true;
  }

  if (changed) {
    saveNotifiedJobs(notifiedUrls);
  }
}
