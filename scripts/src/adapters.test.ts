import { afterEach, expect, test } from "bun:test";
import { fetchAshbyJobs, fetchWorkdayJobs } from "./scraper";
import { requestContext } from "./http";
import type { Company } from "./companies";

const original = globalThis.fetch;
afterEach(() => { globalThis.fetch = original; });
const company: Company = { name: "Example", workday: { host: "example.wd5.myworkdayjobs.com", tenant: "example", site: "External" } };
const mechanical = { title: "Mechanical Engineering Intern 2027", externalPath: "/job/Boston/Mechanical-Intern_R1", locationsText: "Boston, MA", postedOn: "Posted 3 Days Ago" };

test("Workday uses POST and paginates past irrelevant results, deduplicating search queries", async () => {
  const calls: any[] = [];
  globalThis.fetch = (async (url, init) => {
    expect(String(url)).toBe("https://example.wd5.myworkdayjobs.com/wday/cxs/example/External/jobs");
    expect(init?.method).toBe("POST");
    const body = JSON.parse(String(init?.body)); calls.push(body);
    return Response.json({ total: 2, jobPostings: body.offset === 0 ? [{ title: "Software Intern", externalPath: "/job/Boston/Software_R2" }] : [mechanical] });
  }) as typeof fetch;
  const jobs = await fetchWorkdayJobs(company);
  expect(calls.map((c) => [c.searchText, c.offset])).toEqual([["intern", 0], ["intern", 1], ["co-op", 0], ["co-op", 1]]);
  expect(jobs).toHaveLength(1);
  expect(jobs[0].url).toBe("https://example.wd5.myworkdayjobs.com/en-US/External/job/Boston/Mechanical-Intern_R1");
  expect(jobs[0].location).toBe("Boston, MA");
  expect(jobs[0].postedAt).toBeNull();
});
test("Workday retains matching earlier pages if a later request fails", async () => {
  globalThis.fetch = (async (_url, init) => {
    const body = JSON.parse(String(init?.body));
    return body.offset === 0 ? Response.json({ total: 2, jobPostings: [mechanical] }) : new Response("missing", { status: 404 });
  }) as typeof fetch;
  const context: { failures: number; partial?: string } = { failures: 0 };
  const jobs = await requestContext.run(context, () => fetchWorkdayJobs(company));
  expect(jobs).toHaveLength(1);
  expect(context.failures).toBe(1);
  expect(context.partial).toContain("earlier pages retained");
});
test("Workday continues past later pages reporting total zero", async () => {
  const offsets: number[] = [];
  globalThis.fetch = (async (_url, init) => {
    const body = JSON.parse(String(init?.body)); offsets.push(body.offset);
    return Response.json({ total: body.offset === 0 ? 3 : 0, jobPostings: [body.offset === 2 ? mechanical : { title: "Software Intern", externalPath: `/job/Boston/Software_R${body.offset + 2}` }] });
  }) as typeof fetch;
  expect(await fetchWorkdayJobs(company)).toHaveLength(1);
  expect(offsets).toEqual([0, 1, 2, 0, 1, 2]);
});
test("Workday detects repeated pages and reports incomplete coverage", async () => {
  let calls = 0;
  globalThis.fetch = (async () => { calls++; return Response.json({ total: 1000, jobPostings: [mechanical] }); }) as typeof fetch;
  const context: { failures: number; partial?: string } = { failures: 0 };
  const jobs = await requestContext.run(context, () => fetchWorkdayJobs(company));
  expect(jobs).toHaveLength(1);
  expect(calls).toBe(4);
  expect(context.partial).toContain("stopped early");
});
test("legacy Workday guesses cannot issue requests to invented boards", async () => {
  let calls = 0;
  globalThis.fetch = (async () => { calls++; return Response.json({}); }) as typeof fetch;
  await expect(fetchWorkdayJobs({ name: "Example", workday: "example" })).rejects.toThrow("verified");
  expect(calls).toBe(0);
});
test("Ashby uses public listed postings only and keeps secondary locations", async () => {
  globalThis.fetch = (async () => Response.json({ jobs: [
    { title: "Thermal Intern 2027", jobUrl: "https://jobs.ashbyhq.com/example/1", isListed: true, location: "Boston", secondaryLocations: [{ location: "Austin" }], publishedAt: "2026-09-04" },
    { title: "Mechanical Intern", jobUrl: "https://jobs.ashbyhq.com/example/2", isListed: false },
    { title: "Electrical Intern", jobUrl: "https://jobs.ashbyhq.com/example/3", isListed: true },
  ] })) as typeof fetch;
  const jobs = await fetchAshbyJobs({ name: "Example", ashby: "example" });
  expect(jobs).toHaveLength(1);
  expect(jobs[0].location).toBe("Boston; Austin");
  expect(jobs[0].postedAt).toBeNull();
});
test("malformed Ashby responses are failures, not valid empty feeds", async () => {
  globalThis.fetch = (async () => Response.json({ error: "unavailable" })) as typeof fetch;
  await expect(fetchAshbyJobs({ name: "Example", ashby: "example" })).rejects.toThrow("Invalid Ashby");
});
