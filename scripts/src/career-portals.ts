import type { Company } from "./companies";
import type { Job } from "./types";
import { request, requestContext } from "./http";
import { getCategory, isMechanicalInternship } from "./filters";

function partial(reason: string) { const c = requestContext.getStore(); if (c) c.partial = reason; }
function makeJob(company: Company, title: string, url: string, location: string | null, source: string, companyUrl: string): Job {
  return { companyName: company.name, companyUrl, title, url, location, source, postedAt: null, ageDays: null,
    category: getCategory(title), score: /mechanical/i.test(title) ? 5 : 2 };
}

export async function fetchJibeJobs(company: Company, host = company.jibeHost, source = "iCIMS Careers API"): Promise<Job[]> {
  if (!host) return [];
  const jobs = new Map<string, Job>();
  for (const keyword of ["intern", "co-op"]) {
    const seen = new Set<string>();
    let complete = false;
    for (let page = 1; page <= 100; page++) {
      const d = await request(`https://${host}/api/jobs?page=${page}&limit=100&keywords=${encodeURIComponent(keyword)}`, "json");
      if (!d || !Array.isArray(d.jobs) || !Number.isInteger(d.totalCount) || d.totalCount < 0 ||
          !d.jobs.every((j: any) => typeof j?.data?.title === "string" && (typeof j.data.slug === "string" || typeof j.data.req_id === "string"))) {
        if (!jobs.size) throw new Error("Invalid iCIMS Careers API response");
        partial("iCIMS Careers API page failed; earlier pages retained."); return [...jobs.values()];
      }
      let added = 0;
      for (const { data: raw } of d.jobs) {
        const id = raw.slug ?? raw.req_id;
        if (seen.has(id)) continue;
        seen.add(id); added++;
        if (raw.meta_data?.icims?.jps_is_public === false || !isMechanicalInternship(raw.title)) continue;
        // Link to the employer description, not the sign-in/application endpoint.
        const url = `https://${host}/jobs/${encodeURIComponent(id)}`;
        jobs.set(id, makeJob(company, raw.title, url, raw.full_location || raw.location_name || null, source, `https://${host}/careers-home`));
      }
      if (seen.size >= d.totalCount) { complete = true; break; }
      if (!added) break;
    }
    if (!complete) partial("iCIMS Careers API pagination ended early; earlier pages retained.");
  }
  return [...jobs.values()];
}

export function decodeText(value: string): string {
  return value.replace(/<[^>]*>/g, " ").replace(/&(?:amp|lt|gt|quot|apos|nbsp);|&#(?:x[0-9a-f]+|\d+);/gi, (entity) => {
    const named: Record<string, string> = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&apos;": "'", "&nbsp;": " " };
    if (named[entity.toLowerCase()]) return named[entity.toLowerCase()];
    const code = entity.toLowerCase().startsWith("&#x") ? parseInt(entity.slice(3, -1), 16) : parseInt(entity.slice(2, -1), 10);
    return code >= 0 && code <= 0x10ffff ? String.fromCodePoint(code) : "";
  }).replace(/\s+/g, " ").trim();
}

// Based on the public SuccessFactors search table, including separate mobile links.
export function parseSuccessFactors(html: string, company: Company): { jobs: Job[]; rows: number; total: number } {
  const totalMatch = html.match(/class=["']paginationLabel["'][^>]*>[\s\S]*?of\s*<b>([\d,]+)<\/b>/i);
  const rows = [...html.matchAll(/<tr\b[^>]*class=["'][^"']*\bdata-row\b[^"']*["'][^>]*>([\s\S]*?)<\/tr>/gi)];
  if (!totalMatch) {
    if (/There are currently no open positions|No jobs found|No matching jobs/i.test(html)) return { jobs: [], rows: 0, total: 0 };
    throw new Error("Unrecognized SuccessFactors search page");
  }
  const jobs: Job[] = [];
  for (const [, row] of rows) {
    const link = [...row.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].find((m) => /class=["'][^"']*\bjobTitle-link\b/.test(m[1]));
    const href = link?.[1].match(/href=["']([^"']+)["']/)?.[1];
    if (!link || !href) throw new Error("Malformed SuccessFactors job row");
    const title = decodeText(link[2]);
    if (!isMechanicalInternship(title)) continue;
    const origin = `https://${company.successFactorsHost}`;
    const url = new URL(decodeText(href), origin);
    if (url.origin !== origin || !url.pathname.includes("/job/")) throw new Error("Unexpected SuccessFactors job URL");
    const locationCell = row.match(/<td\b[^>]*headers=["']hdrLocation["'][^>]*>([\s\S]*?)<\/td>/i)?.[1];
    jobs.push(makeJob(company, title, url.href, locationCell ? decodeText(locationCell) : null, "SuccessFactors", origin));
  }
  return { jobs, rows: rows.length, total: Number(totalMatch[1].replaceAll(",", "")) };
}

export async function fetchSuccessFactorsJobs(company: Company): Promise<Job[]> {
  if (!company.successFactorsHost) return [];
  const jobs = new Map<string, Job>();
  for (const query of ["intern", "co-op"]) {
    const pages = new Set<string>();
    let offset = 0, complete = false;
    for (let page = 0; page < 100; page++) {
      const html = await request(`https://${company.successFactorsHost}/search/?q=${encodeURIComponent(query)}&startrow=${offset}`, "text");
      try {
        if (typeof html !== "string") throw new Error("SuccessFactors request failed");
        const parsed = parseSuccessFactors(html, company);
        // Repeat detection includes every row, even pages with no relevant internships.
        const signature = [...html.matchAll(/<tr\b[^>]*class=["'][^"']*data-row[^"']*["'][^>]*>([\s\S]*?)<\/tr>/gi)].map((m) => m[1].match(/href=["']([^"']+)["']/)?.[1]).join("|");
        if (pages.has(signature) && parsed.rows) break;
        pages.add(signature);
        for (const job of parsed.jobs) jobs.set(job.url, job);
        offset += parsed.rows;
        if (offset >= parsed.total) { complete = true; break; }
        if (!parsed.rows) break;
      } catch (error) {
        if (!offset && !jobs.size) throw error;
        partial("SuccessFactors page failed; earlier pages retained."); return [...jobs.values()];
      }
    }
    if (!complete) partial("SuccessFactors pagination ended early; earlier pages retained.");
  }
  return [...jobs.values()];
}
