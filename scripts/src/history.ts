import type { Job } from "./types";
import { isMechanicalInternship } from "./filters";

export const TARGET_YEAR = 2027;
export type Term = "2027" | "unspecified" | "other";
export interface SourceHealth {
  company: string;
  source: string;
  checkedAt: string;
  status: "ok" | "partial" | "failed" | "unconfigured";
  count: number;
  detail: string;
}
export interface Listing extends Job {
  id: string;
  term: Term;
  firstSeenAt: string;
  lastSeenAt: string | null;
  lastCheckedAt: string | null;
  status: "open" | "unverified" | "closed";
  missingChecks: number;
  lastMissingDate: string | null;
  closedAt: string | null;
}
export interface Snapshot { version: 1; updatedAt: string | null; jobs: Listing[]; sources: SourceHealth[] }

export function termFor(title: string): Term {
  const years = title.match(/\b20\d{2}\b/g) ?? [];
  return years.includes(String(TARGET_YEAR)) ? "2027" : years.length ? "other" : "unspecified";
}
export function safeUrl(value: string | null): string | null {
  try { const url = new URL(value ?? ""); return ["https:", "http:"].includes(url.protocol) ? url.href : null; }
  catch { return null; }
}
export function jobId(job: Job): string {
  const url = new URL(job.url);
  url.hash = "";
  for (const key of [...url.searchParams.keys()]) {
    if (/^(utm_|gh_src$|source$|ref$)/i.test(key)) url.searchParams.delete(key);
  }
  url.searchParams.sort();
  // Keep case-sensitive paths and job-identifying query parameters. Title and location
  // distinguish postings when an upstream source only provides a shared board URL.
  return JSON.stringify([job.companyName, job.source, url.href, job.title.trim(), job.location ?? ""]);
}
export function reconcile(previous: Snapshot, jobs: Job[], sources: SourceHealth[], now: string): Snapshot {
  const inScope = (job: Job) => isMechanicalInternship(job.title);
  const records = new Map(previous.jobs.filter(inScope).map((job) => [job.id, { ...job, term: termFor(job.title) }]));
  const observed = new Set<string>();
  for (const job of jobs) {
    if (!safeUrl(job.url) || !inScope(job)) continue;
    const id = jobId(job);
    observed.add(id);
    const old = records.get(id);
    records.set(id, { ...job, id, term: termFor(job.title), firstSeenAt: old?.firstSeenAt ?? now,
      lastSeenAt: now, lastCheckedAt: now, status: "open", missingChecks: 0, lastMissingDate: null, closedAt: null });
  }
  for (const [id, job] of records) {
    if (observed.has(id) || job.status === "closed") continue;
    const health = sources.find((source) => source.company === job.companyName && source.source === job.source);
    job.status = "unverified";
    if (health) job.lastCheckedAt = now;
    // Only complete, validated feeds can establish absence. Two different UTC days
    // protect against transient empty responses and repeated manual runs.
    if (health?.status === "ok" && job.lastMissingDate !== now.slice(0, 10)) {
      job.missingChecks++;
      job.lastMissingDate = now.slice(0, 10);
      if (job.missingChecks >= 2) { job.status = "closed"; job.closedAt = now; }
    }
  }
  return { version: 1, updatedAt: now, jobs: [...records.values()], sources };
}
export function emptySnapshot(): Snapshot { return { version: 1, updatedAt: null, jobs: [], sources: [] }; }

// Reapply changed eligibility rules offline without inventing a fresh check date,
// changing source health, or advancing the closure counters.
export function filterSnapshot(snapshot: Snapshot): Snapshot {
  return { ...snapshot, jobs: snapshot.jobs.filter((job) => isMechanicalInternship(job.title)) };
}

export function readSnapshot(raw: string): Snapshot {
  const data = JSON.parse(raw);
  if (data.version !== 1 || !Array.isArray(data.jobs) || !Array.isArray(data.sources) ||
      !data.jobs.every((j: any) => typeof j.id === "string" && typeof j.title === "string" &&
        typeof j.companyName === "string" && typeof j.source === "string" && safeUrl(j.url) &&
        ["open", "unverified", "closed"].includes(j.status) && typeof j.firstSeenAt === "string" &&
        (j.lastSeenAt === null || typeof j.lastSeenAt === "string") && Number.isInteger(j.missingChecks))) {
    throw new Error("Invalid listing history; refusing to overwrite it.");
  }
  return data;
}
