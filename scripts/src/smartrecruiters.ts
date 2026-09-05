import type { Company } from "./companies";
import type { Job } from "./types";
import { request, requestContext } from "./http";
import { getCategory, isMechanicalInternship } from "./filters";

export async function fetchSmartRecruitersJobs(company: Company): Promise<Job[]> {
  if (!company.smartRecruiters) return [];
  const slug = encodeURIComponent(company.smartRecruiters);
  const jobs = new Map<string, Job>();
  const seen = new Set<string>();
  let offset = 0;
  let total: number | undefined;
  const partial = (reason: string) => {
    const context = requestContext.getStore();
    if (context) context.partial = reason;
  };
  for (let page = 0; page < 100; page++) {
    const data = await request(`https://api.smartrecruiters.com/v1/companies/${slug}/postings?limit=100&offset=${offset}`, "json");
    if (!data || !Array.isArray(data.content) || !Number.isInteger(data.totalFound) || data.totalFound < 0 ||
        !data.content.every((j: any) => typeof j?.name === "string" && typeof j?.id === "string" && /^\d+$/.test(j.id))) {
      if (!offset) throw new Error("Invalid SmartRecruiters response");
      partial("SmartRecruiters page failed validation; earlier pages retained.");
      return [...jobs.values()];
    }
    total ??= data.totalFound;
    let added = 0;
    for (const raw of data.content) {
      if (seen.has(raw.id)) continue;
      seen.add(raw.id); added++;
      if (raw.visibility !== "PUBLIC" || !isMechanicalInternship(raw.name)) continue;
      const location = raw.location?.fullLocation || [raw.location?.city, raw.location?.region, raw.location?.country].filter(Boolean).join(", ") || null;
      jobs.set(raw.id, { companyName: company.name, companyUrl: `https://careers.smartrecruiters.com/${slug}`,
        title: raw.name, url: `https://jobs.smartrecruiters.com/${slug}/${raw.id}`, location,
        source: "SmartRecruiters", postedAt: null, ageDays: null, category: getCategory(raw.name), score: /mechanical/i.test(raw.name) ? 5 : 2 });
    }
    offset += data.content.length;
    // An empty or repeated page before the advertised total is incomplete, not closed jobs.
    if (seen.size >= total) return [...jobs.values()];
    if (!added) {
      partial("SmartRecruiters returned an empty or repeated page before its total; earlier pages retained.");
      return [...jobs.values()];
    }
  }
  partial("SmartRecruiters reached its pagination cap; earlier pages retained.");
  return [...jobs.values()];
}
