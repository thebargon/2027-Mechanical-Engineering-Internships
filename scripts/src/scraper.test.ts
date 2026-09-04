import { afterEach, expect, test } from "bun:test";
import { fetchGreenhouseJobs, fetchLeverJobs, fetchSpaceXJobs } from "./scraper";
import { mapLimited, request, requestContext } from "./http";
const originalFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = originalFetch; });
function respond(body: unknown) { globalThis.fetch = (async () => Response.json(body)) as typeof fetch; }

test("Greenhouse requires a mechanical title despite description keywords, and does not use updated_at as posted date", async () => {
  respond(await Bun.file(new URL("./fixtures/greenhouse.json", import.meta.url)).json());
  const jobs = await fetchGreenhouseJobs({ name: "Example", greenhouse: "example" });
  expect(jobs).toHaveLength(1);
  expect(jobs[0].title).toBe("Mechanical Engineering Intern 2027");
  expect(jobs[0].postedAt).toBeNull();
  expect(jobs[0].category).toBe("mechanical_design");
});
test("malformed feeds cannot be mistaken for a healthy empty feed", async () => {
  respond({ jobs: [{ wrongField: "Mechanical Intern" }] });
  await expect(fetchGreenhouseJobs({ name: "Example", greenhouse: "example" })).rejects.toThrow();
  respond({ error: "blocked" });
  await expect(fetchLeverJobs({ name: "Example", lever: "example" })).rejects.toThrow();
});
test("Lever accepts a valid empty feed", async () => {
  respond([]);
  expect(await fetchLeverJobs({ name: "Example", lever: "example" })).toEqual([]);
});
test("Lever rejects electrical and generic roles despite mechanical keywords in descriptions", async () => {
  respond(["Electrical Engineer Intern", "Systems Engineering Intern", "Mechanical Engineer Intern"].map((text, id) => ({ text, hostedUrl: `https://example.com/${id}`, description: "We build mechanical hardware using CAD and robotics." })));
  const jobs = await fetchLeverJobs({ name: "Example", lever: "example" });
  expect(jobs.map((job) => job.title)).toEqual(["Mechanical Engineer Intern"]);
});
test("saved SpaceX fixture does not admit international or software roles", async () => {
  respond(await Bun.file(new URL("./fixtures/spacex.json", import.meta.url)).json());
  expect(await fetchSpaceXJobs()).toEqual([]);
});
test("SpaceX creates distinct job description links from upstream IDs", async () => {
  respond([{ title: "Mechanical Intern 2027", greenhouseId: 123 }, { title: "Thermal Intern 2027", greenhouseId: 456 }]);
  const jobs = await fetchSpaceXJobs();
  expect(jobs.length).toBeGreaterThan(0);
  for (const job of jobs) expect(job.url).toMatch(/^https:\/\/boards.greenhouse.io\/spacex\/jobs\/\d+$/);
  expect(new Set(jobs.map((job) => job.url)).size).toBe(jobs.length);
});
test("HTTP 404 records a source failure and does not retry", async () => {
  let calls = 0;
  globalThis.fetch = (async () => { calls++; return new Response("missing", { status: 404 }); }) as typeof fetch;
  const context = { failures: 0 };
  await requestContext.run(context, async () => expect(await request("https://example.com/missing", "json")).toBeNull());
  expect(calls).toBe(1);
  expect(context.failures).toBe(1);
});
test("transient server errors retry with a timeout signal and recover", async () => {
  let calls = 0;
  globalThis.fetch = (async (_url, options) => {
    expect(options?.signal).toBeInstanceOf(AbortSignal);
    return ++calls === 1 ? new Response("temporary", { status: 503 }) : Response.json({ jobs: [] });
  }) as typeof fetch;
  const context = { failures: 0 };
  await requestContext.run(context, async () => expect(await request("https://example.com/retry", "json")).toEqual({ jobs: [] }));
  expect(calls).toBe(2);
  expect(context.failures).toBe(0);
});
test("long Retry-After defers retries instead of hammering a rate-limited source", async () => {
  let calls = 0;
  globalThis.fetch = (async () => { calls++; return new Response("limited", { status: 429, headers: { "Retry-After": "120" } }); }) as typeof fetch;
  expect(await request("https://example.com/limited", "json")).toBeNull();
  expect(calls).toBe(1);
});
test("worker pool preserves order and caps simultaneous work", async () => {
  let active = 0, peak = 0;
  const result = await mapLimited([1, 2, 3, 4, 5], async (value) => {
    active++; peak = Math.max(peak, active);
    await Bun.sleep(5); active--; return value * 2;
  }, 2);
  expect(result).toEqual([2, 4, 6, 8, 10]);
  expect(peak).toBe(2);
});
