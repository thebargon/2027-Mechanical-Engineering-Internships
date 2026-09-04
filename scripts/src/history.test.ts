import { expect, test } from "bun:test";
import { emptySnapshot, jobId, readSnapshot, reconcile, termFor, filterSnapshot, type SourceHealth } from "./history";
import type { Job } from "./types";
import { listingTable, replaceTable } from "./render";
import { renderBrowser } from "./site";

const job: Job = { companyName: "Example", companyUrl: null, title: "Mechanical Intern 2027", location: "Boston", url: "https://example.com/job?id=1", source: "Lever", postedAt: null, ageDays: null, category: "mechanical_design", score: 5 };
const health = (status: SourceHealth["status"]): SourceHealth[] => [{ company: "Example", source: "Lever", checkedAt: "2026-09-04T12:00:00Z", status, count: 0, detail: "Test" }];
const first = () => reconcile(emptySnapshot(), [job], health("ok"), "2026-09-04T12:00:00Z");

test("title years distinguish target, other years, and unspecified", () => {
  expect(termFor("Mechanical Intern Fall 2026")).toBe("other");
  expect(termFor("Mechanical Intern 2026/2027")).toBe("2027");
  expect(termFor("Mechanical Intern")).toBe("unspecified");
});
test("identifiers retain meaningful queries, path case, and jobs sharing a board", () => {
  expect(jobId(job)).not.toBe(jobId({ ...job, url: "https://example.com/job?id=2" }));
  expect(jobId(job)).toBe(jobId({ ...job, url: job.url + "&utm_source=tracker" }));
  expect(jobId(job)).not.toBe(jobId({ ...job, url: "https://example.com/Job?id=1" }));
  expect(jobId(job)).not.toBe(jobId({ ...job, title: "Thermal Intern 2027" }));
});
test("failed, partial, and unconfigured sources retain history without establishing closure", () => {
  for (const status of ["failed", "partial", "unconfigured"] as const) {
    let state = first();
    for (let day = 5; day < 8; day++) state = reconcile(state, [], health(status), `2026-09-0${day}T12:00:00Z`);
    expect(state.jobs[0].status).toBe("unverified");
    expect(state.jobs[0].missingChecks).toBe(0);
    expect(state.jobs[0].lastSeenAt).toBe("2026-09-04T12:00:00Z");
  }
});
test("two successful absences on different days close a listing, and reappearance reopens it", () => {
  let state = reconcile(first(), [], health("ok"), "2026-09-05T12:00:00Z");
  state = reconcile(state, [], health("ok"), "2026-09-05T13:00:00Z");
  expect(state.jobs[0].status).toBe("unverified");
  expect(state.jobs[0].missingChecks).toBe(1);
  state = reconcile(state, [], health("ok"), "2026-09-06T12:00:00Z");
  expect(state.jobs[0].status).toBe("closed");
  state = reconcile(state, [job], health("ok"), "2026-09-07T12:00:00Z");
  expect(state.jobs[0].status).toBe("open");
  expect(state.jobs[0].firstSeenAt).toBe("2026-09-04T12:00:00Z");
  expect(state.jobs[0].closedAt).toBeNull();
});
test("unsafe URLs and corrupt state do not enter the history", () => {
  expect(reconcile(emptySnapshot(), [{ ...job, url: "javascript:alert(1)" }], [], "2026-09-04").jobs).toHaveLength(0);
  expect(() => readSnapshot('{"version":2}')).toThrow();
  expect(() => readSnapshot('not json')).toThrow();
  expect(readSnapshot(JSON.stringify(first())).jobs).toHaveLength(1);
});
test("scope changes remove previously admitted non-engineering roles", () => {
  const state = first();
  state.jobs[0].title = "Supply Chain Intern 2027";
  expect(reconcile(state, [], [], "2026-09-05T12:00:00Z").jobs).toHaveLength(0);
});
test("offline filtering removes unrelated saved listings without advancing verification or closure state", () => {
  const state = first();
  const electrical = { ...state.jobs[0], id: "electrical", title: "Electrical Engineer Intern 2027", category: "mechanical_design" };
  state.jobs.push(electrical);
  const filtered = filterSnapshot(state);
  expect(filtered.jobs).toHaveLength(1);
  expect(filtered.jobs[0]).toEqual(state.jobs[0]);
  expect(filtered.updatedAt).toBe(state.updatedAt);
  expect(filtered.sources).toEqual(state.sources);
  expect(reconcile(state, [electrical], health("ok"), "2026-09-05T12:00:00Z").jobs.map((job) => job.title)).toEqual(["Mechanical Intern 2027"]);
});
test("rendering escapes source text and protects README markers", () => {
  const state = first();
  state.jobs[0].title = '</script><script>alert(1)</script> | <img src=x>\nTitle';
  const table = listingTable(state.jobs);
  expect(table).toContain("&#124;");
  expect(table).not.toContain("<img");
  expect(renderBrowser(state)).not.toContain('</script><script>alert(1)');
  expect(() => replaceTable("no markers", "table")).toThrow();
  expect(replaceTable("intro<!-- JOB_TABLE_START -->old<!-- JOB_TABLE_END -->tail", "new")).toContain("intro<!-- JOB_TABLE_START -->\nnew\n<!-- JOB_TABLE_END -->tail");
});
