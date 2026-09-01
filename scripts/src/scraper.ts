import { Job } from "./types";
import { Company, COMPANIES } from "./companies";
import { CATEGORIES } from "./config";
import { KEYWORDS } from "./keywords";

function normalizeText(input: string | null | undefined) {
  return (input ?? "").toLowerCase();
}

function matchesKeywords(text: string): boolean {
  const normalized = normalizeText(text);
  return KEYWORDS.some((keyword) => normalized.includes(keyword.toLowerCase()));
}

function matchesTitle(title: string): boolean {
  const text = normalizeText(title);
  const blocked = [
    "software",
    "frontend",
    "backend",
    "full stack",
    "data science",
    "machine learning",
  ];

  if (blocked.some((keyword) => text.includes(keyword))) {
    return false;
  }

  return KEYWORDS.some((keyword) => text.includes(keyword.toLowerCase()));
}

function isInternship(title: string) {
  const text = normalizeText(title);
  return (
    text.includes("intern") ||
    text.includes("co-op") ||
    text.includes("coop") ||
    text.includes("student")
  );
}

function getCategory(text: string) {
  const normalized = normalizeText(text);

  for (const [category, keywords] of Object.entries(CATEGORIES)) {
    if (keywords.some((keyword) => normalized.includes(keyword.toLowerCase()))) {
      return category;
    }
  }

  return "other";
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

async function fetchJson(url: string): Promise<any | null> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/json",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
      },
    });

    if (!response.ok) {
      // console.log(`[API] ${url} returned ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (err) {
    // console.log(`[API Error] ${url}:`, err instanceof Error ? err.message : String(err));
    return null;
  }
}

async function fetchText(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
      },
    });

    if (!response.ok) {
      return null;
    }

    return await response.text();
  } catch {
    return null;
  }
}

export async function fetchGreenhouseJobs(company: Company): Promise<Job[]> {
  const slug = company.greenhouse;
  if (!slug) {
    return [];
  }

  const url = `https://boards.greenhouse.io/api/v1/boards/${slug}/jobs?content=true`;
  const data = await fetchJson(url);
  if (!data?.jobs || !Array.isArray(data.jobs)) {
    return [];
  }

  return data.jobs
    .map((job: any) => {
      const title = job.title ?? "";
      const description = job.content?.markdown ?? "";
      const combinedText = `${title} ${description}`;

      if (!matchesKeywords(combinedText) || !isInternship(title)) {
        return null;
      }

      const location = job.location?.name ?? null;
      const rawPostedAt = job.updated_at ?? job.created_at ?? null;

      return {
        companyName: company.name,
        companyUrl: `https://boards.greenhouse.io/${slug}`,
        title,
        location,
        url: job.absolute_url ?? "",
        source: "Greenhouse",
        postedAt: rawPostedAt,
        ageDays: calculateAgeDays(rawPostedAt),
        category: getCategory(combinedText),
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
    return [];
  }

  return data
    .map((job: any) => {
      const title = job.text ?? "";
      const description = job.description ?? "";
      const combinedText = `${title} ${description}`;

      if (!matchesKeywords(combinedText) || !isInternship(title)) {
        return null;
      }

      const location = job.categories?.location ?? null;
      const postedAt = job.postedAt ?? null;

      return {
        companyName: company.name,
        companyUrl: `https://jobs.lever.co/${slug}`,
        title,
        location,
        url: job.hostedUrl ?? "",
        source: "Lever",
        postedAt,
        ageDays: calculateAgeDays(postedAt),
        category: getCategory(combinedText),
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

          if (!matchesTitle(title) || !isInternship(title)) {
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
            category: getCategory(combinedText),
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

        if (!matchesTitle(title) || !isInternship(title)) {
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
          category: getCategory(combinedText),
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

        if (!matchesKeywords(combined) || !isInternship(title)) continue;

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
          category: getCategory(combined),
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
      if (!isInternship(title) || !matchesKeywords(title)) continue;

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

      if (!matchesTitle(title) || !isInternship(title)) {
        return null;
      }

      return {
        companyName: "Tesla",
        companyUrl: "https://www.tesla.com/careers",
        title,
        location,
        url: "https://www.tesla.com/careers",
        source: "Tesla Careers",
        postedAt: null,
        ageDays: null,
        category: getCategory(combinedText),
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

      if (!matchesTitle(title) || !isInternship(title)) {
        return null;
      }

      return {
        companyName: "SpaceX",
        companyUrl: "https://www.spacex.com/careers",
        title,
        location,
        url: "https://www.spacex.com/careers/jobs",
        source: "SpaceX Jobs JSON",
        postedAt: null,
        ageDays: null,
        category: getCategory(combinedText),
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

      if (!matchesTitle(title) || !isInternship(title)) {
        continue;
      }

      const urlCandidate = jobData.apply_url ?? jobData.applicationUrl ?? jobData.externalUrl ?? jobData.url ?? `https://careers.rivian.com/careers-home/jobs`;
      const postedAt = jobData.posted_date ?? jobData.create_date ?? jobData.update_date ?? null;

      jobs.push({
        companyName: "Rivian",
        companyUrl: "https://careers.rivian.com/careers-home/jobs",
        title,
        location,
        url: urlCandidate,
        source: "Rivian Careers API",
        postedAt,
        ageDays: calculateAgeDays(postedAt),
        category: getCategory(combinedText),
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

        if (!matchesKeywords(combined) || !isInternship(title)) continue;

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
          category: getCategory(combined),
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

        if (!matchesKeywords(combined) || !isInternship(title)) continue;

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
          category: getCategory(combined),
          score: scoreJob(title),
        } as Job);
      }
    } catch {
      // ignore JSON parse errors
    }
  }

  return jobs;
}

async function fetchCompanyJobs(company: Company): Promise<Job[]> {
  const greenhouseJobs = await fetchGreenhouseJobs(company);
  const leverJobs = await fetchLeverJobs(company);
  const workdayJobs = await fetchWorkdayJobs(company);
  const icimsJobs = await fetchICIMSJobs(company);
  const phenomJobs = await fetchPhenomJobs(company);
  const riplingJobs = company.custom === "rippling" ? await fetchRiplingJobs(company) : [];
  const teslaJobs = company.custom === "tesla" ? await fetchTeslaJobs() : [];
  const spacexJobs = company.custom === "spacex" ? await fetchSpaceXJobs() : [];
  const rivianJobs = company.custom === "rivian" ? await fetchRivianJobs() : [];

  console.log(
    company.name,
    greenhouseJobs.length,
    leverJobs.length,
    workdayJobs.length,
    icimsJobs.length,
    phenomJobs.length,
    riplingJobs.length,
    teslaJobs.length,
    spacexJobs.length,
    rivianJobs.length,
  );

  return [
    ...greenhouseJobs,
    ...leverJobs,
    ...workdayJobs,
    ...icimsJobs,
    ...phenomJobs,
    ...riplingJobs,
    ...teslaJobs,
    ...spacexJobs,
    ...rivianJobs,
  ];
}

export async function getJobs(): Promise<Job[]> {
  const jobs = await Promise.all(
    COMPANIES.map((company) => fetchCompanyJobs(company)),
  );

  return jobs.flat();
}
