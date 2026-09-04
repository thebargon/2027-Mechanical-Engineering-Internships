import { Job } from "./types";
import { Company, COMPANIES } from "./companies";
import { request, requestContext, mapLimited } from "./http";
import type { SourceHealth } from "./history";
import { isMechanicalInternship, getCategory } from "./filters";

function normalizeText(input: string | null | undefined) {
  return (input ?? "").toLowerCase();
}

function scoreJob(title: string): number {
  const text = normalizeText(title);
  let score = 0;

  if (text.includes("mechanical")) score += 5;
  if (text.includes("design")) score += 4;
  if (text.includes("aerospace")) score += 4;
  if (text.includes("thermal")) score += 4;
  if (text.includes("robotics")) score += 4;
  if (text.includes("manufacturing")) score += 2;

  return score;
}

function calculateAgeDays(dateString: string | null): number | null {
  if (!dateString) {
    return null;
  }

  const postedAt = new Date(dateString);
  if (Number.isNaN(postedAt.getTime())) {
    return null;
  }

  const now = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((now.getTime() - postedAt.getTime()) / msPerDay);
}

const fetchJson = (url: string) => request(url, "json");
const fetchText = (url: string) => request(url, "text");

export async function fetchGreenhouseJobs(company: Company): Promise<Job[]> {
  const slug = company.greenhouse;
  if (!slug) {
    return [];
  }

  // Public Job Board API: https://docs.greenhouse.io/job-board.html
  const url = `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs?content=true`;
  const data = await fetchJson(url);
  if (!data?.jobs || !Array.isArray(data.jobs)) {
    throw new Error("Invalid Greenhouse response");
  }
  if (!data.jobs.every((job: any) => typeof job?.title === "string" && typeof job?.absolute_url === "string")) {
    throw new Error("Malformed Greenhouse job");
  }

  return data.jobs
    .map((job: any) => {
      const title = job.title ?? "";
      const description = typeof job.content === "string" ? job.content : job.content?.markdown ?? "";
      const combinedText = `${title} ${description}`;

      if (!isMechanicalInternship(title)) {
        return null;
      }

      const location = job.location?.name ?? null;
      const rawPostedAt = job.created_at ?? null;

      return {
        companyName: company.name,
        companyUrl: `https://boards.greenhouse.io/${slug}`,
        title,
        location,
        url: job.absolute_url ?? "",
        source: "Greenhouse",
        postedAt: rawPostedAt,
        ageDays: calculateAgeDays(rawPostedAt),
        category: getCategory(title) !== "other" ? getCategory(title) : getCategory(combinedText),
        score: scoreJob(title),
      } as Job;
    })
    .filter((job: Job | null): job is Job => job !== null);
}

export async function fetchLeverJobs(company: Company): Promise<Job[]> {
  const slug = company.lever;
  if (!slug) {
    return [];
  }

  const url = `https://api.lever.co/v0/postings/${slug}?mode=json`;
  const data = await fetchJson(url);
  if (!Array.isArray(data)) {
    throw new Error("Invalid Lever response");
  }
  if (!data.every((job: any) => typeof job?.text === "string" && typeof job?.hostedUrl === "string")) {
    throw new Error("Malformed Lever job");
  }

  return data
    .map((job: any) => {
      const title = job.text ?? "";
      const description = job.description ?? "";
      const combinedText = `${title} ${description}`;

      if (!isMechanicalInternship(title)) {
        return null;
      }

      const location = job.categories?.location ?? null;
      const postedAt = job.createdAt ? new Date(job.createdAt).toISOString() : job.postedAt ?? null;

      return {
        companyName: company.name,
        companyUrl: `https://jobs.lever.co/${slug}`,
        title,
        location,
        url: job.hostedUrl ?? "",
        source: "Lever",
        postedAt,
        ageDays: calculateAgeDays(postedAt),
        category: getCategory(title) !== "other" ? getCategory(title) : getCategory(combinedText),
        score: scoreJob(title),
      } as Job;
    })
    .filter((job: Job | null): job is Job => job !== null);
}

export async function fetchWorkdayJobs(company: Company): Promise<Job[]> {
  const tenant = company.workday;
  if (!tenant) {
    return [];
  }

  // Try both wd5 (default) and wd1 endpoints
  const workdayVersions = [
    `https://${tenant}.wd5.myworkdayjobs.com`,
    `https://${tenant}.wd1.myworkdayjobs.com`,
  ];

  for (const baseUrl of workdayVersions) {
    // Try JSON API endpoint first
    const apiUrl = `${baseUrl}/wday/cxs/${tenant}/jobs`;
    const data = await fetchJson(apiUrl);

    if (data?.jobPostings && Array.isArray(data.jobPostings)) {
      return data.jobPostings
        .map((job: any) => {
          const title = job.title ?? "";
          const description = job.description ?? "";
          const combinedText = `${title} ${description}`;

          if (!isMechanicalInternship(title)) {
            return null;
          }

          const locations = Array.isArray(job.locations)
            ? job.locations.map((loc: any) => loc?.name ?? "").filter(Boolean)
            : [];
          const location = locations.length ? locations.join(", ") : null;
          const jobUrl = job.externalPath
            ? new URL(job.externalPath, baseUrl).href
            : `${baseUrl}/wday/cxs/${tenant}/jobs`;
          const postedAt = job.postedDate ?? job.posted_date ?? job.postedAt ?? null;

          return {
            companyName: company.name,
            companyUrl: `${baseUrl}/wday/cxs/${tenant}`,
            title,
            location,
            url: jobUrl,
            source: "Workday",
            postedAt,
            ageDays: calculateAgeDays(postedAt),
            category: getCategory(title) !== "other" ? getCategory(title) : getCategory(combinedText),
            score: scoreJob(title),
          } as Job;
        })
        .filter((job: Job | null): job is Job => job !== null);
    }

    // Try HTML scraping as fallback
    const htmlUrl = `${baseUrl}/wday/cxs/${tenant}/jobs`;
    const html = await fetchText(htmlUrl);
    if (html) {
      const jobs: Job[] = [];
      const regex = new RegExp(`<a[^>]+href=["'](/wday/cxs/${tenant}/job[^"']+)["'][^>]*>([^<]+)<\/a>`, "gi");
      let match: RegExpExecArray | null;

      while ((match = regex.exec(html))) {
        const title = match[2]?.trim() ?? "";
        const combinedText = title;

        if (!isMechanicalInternship(title)) {
          continue;
        }

        const section = html.slice(Math.max(0, match.index - 200), match.index + 400);
        const locationMatch = section.match(/(?:location|job-location|job-locations|data-automation-job-location)[^>]*>([^<]+)</i);
        const location = locationMatch?.[1]?.trim() ?? null;
        const jobUrl = new URL(match[1], baseUrl).href;

        jobs.push({
          companyName: company.name,
          companyUrl: `${baseUrl}/wday/cxs/${tenant}`,
          title,
          location,
          url: jobUrl,
          source: "Workday",
          postedAt: null,
          ageDays: null,
          category: getCategory(title) !== "other" ? getCategory(title) : getCategory(combinedText),
          score: scoreJob(title),
        } as Job);
      }

      if (jobs.length > 0) {
        return jobs;
      }
    }
  }

  return [];
}

export async function fetchICIMSJobs(company: Company): Promise<Job[]> {
  const tenant = company.icims;
  if (!tenant) return [];

  const base = `https://${tenant}.icims.com`;
  const url = `${base}/jobs`;
  const html = await fetchText(url);
  if (!html) return [];

  const jobs: Job[] = [];

  // Try to parse JSON-LD JobPosting blocks first
  const ldJsonRegex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let ldMatch: RegExpExecArray | null;
  while ((ldMatch = ldJsonRegex.exec(html))) {
    try {
      const parsed = JSON.parse(ldMatch[1]);
      const postings = Array.isArray(parsed) ? parsed : [parsed];
      for (const p of postings) {
        if (!p || (p['@type'] !== 'JobPosting' && p['@type'] !== 'jobPosting')) continue;

        const title = p.title ?? p.name ?? '';
        const description = (p.description as string) ?? '';
        const combined = `${title} ${description}`;

        if (!isMechanicalInternship(title)) continue;

        const jobUrl = p.url ? new URL(p.url, base).href : url;
        const postedAt = p.datePosted ?? null;

        jobs.push({
          companyName: company.name,
          companyUrl: base,
          title,
          location: p.jobLocation?.address?.addressLocality ?? null,
          url: jobUrl,
          source: 'iCIMS',
          postedAt,
          ageDays: calculateAgeDays(postedAt),
          category: getCategory(title) !== "other" ? getCategory(title) : getCategory(combined),
          score: scoreJob(title),
        } as Job);
      }
    } catch {
      // ignore JSON parse errors
    }
  }

  if (jobs.length > 0) return jobs;

  // Fallback: find anchor tags that look like job links
  const anchorRegex = /<a[^>]+href=["']([^"']*\/job[^"']*)["'][^>]*>([^<]+)<\/a>/gi;
  let match: RegExpExecArray | null;
  while ((match = anchorRegex.exec(html))) {
    try {
      const href = match[1];
      const title = match[2].trim();
      if (!isMechanicalInternship(title)) continue;

      const jobUrl = new URL(href, base).href;
      jobs.push({
        companyName: company.name,
        companyUrl: base,
        title,
        location: null,
        url: jobUrl,
        source: 'iCIMS',
        postedAt: null,
        ageDays: null,
        category: getCategory(title),
        score: scoreJob(title),
      } as Job);
    } catch {
      continue;
    }
  }

  return jobs;
}

export async function fetchTeslaJobs(): Promise<Job[]> {
  const url = "https://www.tesla.com/cua-api/apps/careers/state?site=US";

  try {
    const data = await fetchJson(url);
    if (!data?.listings || !Array.isArray(data.listings)) {
      console.log("Tesla API unavailable");
      return [];
    }

    const locations = data.lookup?.locations ?? {};
    const departments = data.lookup?.departments ?? {};
    const types = data.lookup?.types ?? {};

    return data.listings
    .map((listing: any) => {
      const title = listing.t ?? "";
      const locationCode = listing.l ?? "";
      const location = locations[locationCode] ?? (locationCode || null);
      const department = departments[listing.dp] ?? "";
      const type = types[listing.f] ?? "";
      const combinedText = `${title} ${department} ${type} ${location}`;

      if (!isMechanicalInternship(title)) {
        return null;
      }

      return {
        companyName: "Tesla",
        companyUrl: "https://www.tesla.com/careers",
        title,
        location,
        url: listing.id ? `https://www.tesla.com/careers/search/job/${listing.id}` : "https://www.tesla.com/careers",
        source: "Tesla Careers",
        postedAt: null,
        ageDays: null,
        category: getCategory(title) !== "other" ? getCategory(title) : getCategory(combinedText),
        score: scoreJob(title),
      } as Job;
    })
    .filter((job: Job | null): job is Job => job !== null);
  } catch (error) {
    console.log("Tesla job fetch failed", error);
    return [];
  }
}

export async function fetchSpaceXJobs(): Promise<Job[]> {
  const url = "https://sxcontent9668.azureedge.us/cms-assets/job_posts_new.json";
  const data = await fetchJson(url);
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map((job: any) => {
      const title = job.title ?? "";
      const description = job.description ?? "";
      const location = job.location ?? null;
      const employmentType = job.employementType ?? job.employmentType ?? "";
      const combinedText = `${title} ${description} ${job.discipline ?? ""} ${job.category ?? ""} ${employmentType}`;

      if (!isMechanicalInternship(title)) {
        return null;
      }

      return {
        companyName: "SpaceX",
        companyUrl: "https://www.spacex.com/careers",
        title,
        location,
        url: job.greenhouseId ? `https://boards.greenhouse.io/spacex/jobs/${job.greenhouseId}` : "https://www.spacex.com/careers/jobs",
        source: "SpaceX Jobs JSON",
        postedAt: null,
        ageDays: null,
        category: getCategory(title) !== "other" ? getCategory(title) : getCategory(combinedText),
        score: scoreJob(title),
      } as Job;
    })
    .filter((job: Job | null): job is Job => job !== null);
}

export async function fetchRivianJobs(): Promise<Job[]> {
  const baseUrl = "https://careers.rivian.com/api/jobs";
  const jobs: Job[] = [];
  let page = 1;
  const maxPages = 5;

  while (page <= maxPages) {
    const url = `${baseUrl}?page=${page}&sortBy=relevance&descending=false&internal=false&keywords=intern&tags2=Rivian%20Automotive&deviceId=undefined&domain=rivian.jibeapply.com`;
    const data = await fetchJson(url);
    if (!data?.jobs || !Array.isArray(data.jobs) || data.jobs.length === 0) {
      break;
    }

    for (const item of data.jobs) {
      const jobData = item?.data;
      if (!jobData) {
        continue;
      }

      const title = jobData.title ?? "";
      const description = jobData.description ?? "";
      const location = jobData.full_location ?? jobData.location_name ?? jobData.location ?? null;
      const combinedText = `${title} ${description} ${jobData.category ?? ""} ${jobData.tags1 ?? ""} ${jobData.tags2 ?? ""}`;

      if (!isMechanicalInternship(title)) {
        continue;
      }

      const urlCandidate = jobData.externalUrl ?? jobData.url ?? jobData.apply_url ?? jobData.applicationUrl ?? `https://careers.rivian.com/careers-home/jobs`;
      const postedAt = jobData.posted_date ?? jobData.create_date ?? null;

      jobs.push({
        companyName: "Rivian",
        companyUrl: "https://careers.rivian.com/careers-home/jobs",
        title,
        location,
        url: urlCandidate,
        source: "Rivian Careers API",
        postedAt,
        ageDays: calculateAgeDays(postedAt),
        category: getCategory(title) !== "other" ? getCategory(title) : getCategory(combinedText),
        score: scoreJob(title),
      });
    }

    if (data.jobs.length < 10) {
      break;
    }

    page += 1;
  }

  return jobs;
}

export async function fetchRiplingJobs(company: Company): Promise<Job[]> {
  const slug = company.name.toLowerCase().replace(/\s+/g, "-");
  const url = `https://ats.rippling.com/${slug}/jobs`;
  const html = await fetchText(url);
  if (!html) {
    return [];
  }

  const jobs: Job[] = [];

  // Rippling typically embeds job data in JSON-LD format
  const ldJsonRegex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let ldMatch: RegExpExecArray | null;
  while ((ldMatch = ldJsonRegex.exec(html))) {
    try {
      const parsed = JSON.parse(ldMatch[1]);
      const postings = Array.isArray(parsed) ? parsed : [parsed];
      for (const p of postings) {
        if (!p || (p['@type'] !== 'JobPosting' && p['@type'] !== 'jobPosting')) continue;

        const title = p.title ?? p.name ?? '';
        const description = (p.description as string) ?? '';
        const combined = `${title} ${description}`;

        if (!isMechanicalInternship(title)) continue;

        const jobUrl = p.url ?? url;
        const postedAt = p.datePosted ?? null;

        jobs.push({
          companyName: company.name,
          companyUrl: url,
          title,
          location: p.jobLocation?.address?.addressLocality ?? null,
          url: jobUrl,
          source: 'Rippling',
          postedAt,
          ageDays: calculateAgeDays(postedAt),
          category: getCategory(title) !== "other" ? getCategory(title) : getCategory(combined),
          score: scoreJob(title),
        } as Job);
      }
    } catch {
      // ignore JSON parse errors
    }
  }

  return jobs;
}

export async function fetchPhenomJobs(company: Company): Promise<Job[]> {
  const slug = company.phenom;
  if (!slug) {
    return [];
  }

  const url = `https://careers.rtx.com/us/en/search-results?keywords=intern`;
  const html = await fetchText(url);
  if (!html) {
    return [];
  }

  const jobs: Job[] = [];

  // Try to extract JSON-LD JobPosting blocks
  const ldJsonRegex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let ldMatch: RegExpExecArray | null;
  while ((ldMatch = ldJsonRegex.exec(html))) {
    try {
      const parsed = JSON.parse(ldMatch[1]);
      const postings = Array.isArray(parsed) ? parsed : [parsed];
      for (const p of postings) {
        if (!p || (p['@type'] !== 'JobPosting' && p['@type'] !== 'jobPosting')) continue;

        const title = p.title ?? p.name ?? '';
        const description = (p.description as string) ?? '';
        const combined = `${title} ${description}`;

        if (!isMechanicalInternship(title)) continue;

        const jobUrl = p.url ?? url;
        const postedAt = p.datePosted ?? null;

        jobs.push({
          companyName: company.name,
          companyUrl: url,
          title,
          location: p.jobLocation?.address?.addressLocality ?? null,
          url: jobUrl,
          source: 'PhenomPeople',
          postedAt,
          ageDays: calculateAgeDays(postedAt),
          category: getCategory(title) !== "other" ? getCategory(title) : getCategory(combined),
          score: scoreJob(title),
        } as Job);
      }
    } catch {
      // ignore JSON parse errors
    }
  }

  return jobs;
}


export async function getSnapshot(): Promise<{ jobs: Job[]; sources: SourceHealth[] }> {
  const tasks: { company: Company; source: string; complete: boolean; run: () => Promise<Job[]> }[] = [];
  const sources: SourceHealth[] = [];
  for (const company of COMPANIES) {
    const add = (source: string, enabled: unknown, complete: boolean, run: () => Promise<Job[]>) => {
      if (enabled) tasks.push({ company, source, complete, run });
    };
    const before = tasks.length;
    add("Greenhouse", company.greenhouse, true, () => fetchGreenhouseJobs(company));
    add("Lever", company.lever, true, () => fetchLeverJobs(company));
    add("Workday", company.workday, false, () => fetchWorkdayJobs(company));
    add("iCIMS", company.icims, false, () => fetchICIMSJobs(company));
    add("PhenomPeople", company.phenom, false, () => fetchPhenomJobs(company));
    add("Rippling", company.custom === "rippling", false, () => fetchRiplingJobs(company));
    add("Tesla Careers", company.custom === "tesla", false, fetchTeslaJobs);
    add("SpaceX Jobs JSON", company.custom === "spacex", false, fetchSpaceXJobs);
    add("Rivian Careers API", company.custom === "rivian", false, fetchRivianJobs);
    if (tasks.length === before) sources.push({ company: company.name, source: "None", checkedAt: new Date().toISOString(), status: "unconfigured", count: 0, detail: "Target company; no scraper configured." });
  }
  const results = await mapLimited(tasks, async (task) => {
    const context = { failures: 0 };
    return requestContext.run(context, async () => {
      let jobs: Job[] = [];
      let status: SourceHealth["status"] = task.complete ? "ok" : "partial";
      let detail = task.complete ? "Complete feed parsed." : "Best-effort source; absence does not establish closure.";
      try {
        jobs = await task.run();
        if (context.failures) { status = jobs.length ? "partial" : "failed"; detail = "One or more requests failed; previous listings retained."; }
      } catch {
        status = "failed";
        detail = "Fetch or response validation failed; previous listings retained.";
      }
      sources.push({ company: task.company.name, source: task.source, checkedAt: new Date().toISOString(), status, count: jobs.length, detail });
      return jobs;
    });
  });
  sources.sort((a, b) => a.company.localeCompare(b.company) || a.source.localeCompare(b.source));
  return { jobs: results.flat(), sources };
}

export async function getJobs(): Promise<Job[]> { return (await getSnapshot()).jobs; }
