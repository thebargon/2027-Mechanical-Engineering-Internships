# 2027 Mechanical Engineering Internships

A community tracker for mechanical engineering and closely related internships and co-ops. Independent and unaffiliated with employers; coverage is incomplete. Always confirm eligibility, internship dates, and availability on the employer's job description.

## Mechanical engineering scope

Every source uses the same strict title-based filter. Titles must identify an internship, co-op, or student role and a clear mechanical discipline: mechanical/electromechanical design, manufacturing, industrial/production engineering, tooling, thermal/fluid systems, propulsion, aerodynamics, airframes/structures, robotics/mechatronics, chassis/powertrain, or mechanical CAD/analysis.

Software, firmware, pure electrical/electronics, civil/construction, business, and other unrelated titles are excluded. Generic systems, hardware, validation, or test titles are excluded unless their title also identifies a mechanical discipline. An employer's industry, category label, or a mechanical keyword in its description is not enough. This conservative rule can miss relevant jobs with vague titles; it favors fewer unrelated results.

Eligibility lives in `scripts/src/filters.ts`; `scripts/src/config.ts` supplies category labels only. The filter also applies to saved history, offline builds, and the optional notification helper, so previously misclassified listings cannot reappear through those paths.

## Browse openings

- Read the listings below: confirmed 2027 titles and unspecified years are separated.
- For search and company, discipline, location, and term filters, run the local browsing page (instructions below). The generated page is in [docs/index.html](docs/index.html).
- Review [source health and coverage](data/sources.md), [closed listings](ARCHIVE.md), or the machine-readable [listing history](data/listings.json).
- Suggest a job, correct a broken link, or propose a company through the repository's Issues tab. Read [CONTRIBUTING.md](CONTRIBUTING.md).

## What the labels mean

- **2027 in title:** the employer's title explicitly includes 2027. This is not inferred from the posting date or graduation requirements.
- **Year unspecified:** no four-digit year appears in the title. Confirm the term before applying.
- **Other years:** titles name a different year; hidden by default and available in the browsing page.
- **Open:** seen in the latest source response. **Needs verification:** not re-observed; the source may have failed or may be incomplete.
- **Closed:** absent from a complete validated feed on two different UTC days. Automatically reopens if seen again. Partial sources never close missing jobs automatically.
- **Posted:** original posting date when provided; update dates are not presented as original posting dates. **First found:** date recorded by this tracker. **Last verified:** last seen in a source feed, not a live application-page check.

Old README rows were imported when history was introduced. Their first-found dates reflect import, and unknown verification dates remain unknown. Posting age alone never removes a role that remains in a live feed.

When eligibility rules tighten, out-of-scope roles are removed from stored history rather than being mislabeled as closed internships.

## Coverage and updates

Configured sources include Greenhouse, Lever, Workday, iCIMS, PhenomPeople, Rippling, and selected company feeds. [Source health](data/sources.md) distinguishes functioning feeds, best-effort adapters, failed requests, and target companies with no scraper. A company in the registry does not necessarily have working coverage.

GitHub Actions is configured to run daily at 12:00 UTC and on manual dispatch. The schedule runs when the workflow is enabled on the default branch. Requests have 12-second timeouts, at most three attempts, a global four-request-per-second start limit, and three concurrent source tasks. Long Retry-After values defer retries to a later run. Failed scrapes preserve historical listings.

Greenhouse and Lever feeds can establish closure after complete response validation. Other adapters are best-effort, sometimes capped or dependent on HTML, and cannot establish closure by absence. Links point to individual descriptions where the source supplies an identifier or URL; generic fallbacks are labeled Career page. This tracker does not bypass authentication, CAPTCHAs, or access controls.

## Run locally

Install Bun, then from the repository root:

```sh
cd scripts
bun install --frozen-lockfile
bun test
bun run generate   # Fetch public listings and update history, README, archive, and browsing page
bun run build      # Re-render saved history without network requests
bun run preview    # Open http://127.0.0.1:4173
```

Generated files are committed by the scheduled workflow. Tests also run on pull requests. Generation does not send Discord or other webhook messages.

Personal application notes belong in the ignored `private/` folder or a separate private repository. An empty [application template](APPLICATIONS.example.md) is provided. Never commit resumes, contact details, application statuses, or credentials. See [PUBLICATION.md](PUBLICATION.md) for the outstanding history issue before making this repository public.

## Internship listings

<!-- JOB_TABLE_START -->
Last checked: **2026-09-04T23:40:29.290Z** · 40 failed sources. See [source health](data/sources.md) and [archive](ARCHIVE.md).

### Confirmed 2027 in title

| Company | Discipline | Position | Location | Status | Posted | First found | Last verified | Link |
|---|---|---|---|---|---|---|---|---|
| Anduril | Mechanical Design | 2027 Mechanical Engineer Intern | Atlanta, Georgia, United States; Boston, Massachusetts, United States; Broomfield, Colorado, United States; Colorado Springs, Colorado, United States; Costa Mesa, California, United States; Fort Collins, Colorado, United States; Irvine, California, United States; Reston, Virginia, United States; Seattle, Washington, United States | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://boards.greenhouse.io/andurilindustries/jobs/5153187007?gh_jid=5153187007">View job</a> |
| Hermeus | Mechanical Design | Structures/Mechanical Engineering Intern - Spring/Summer 2027 | Atlanta, GA | open | 2026-09-02 | 2026-09-04 | 2026-09-04 | <a href="https://jobs.lever.co/hermeus/60b5d40a-1065-4bd2-8c72-6b2fb69d4761">View job</a> |
| Anduril | Manufacturing | 2027 Manufacturing Engineer Intern | Atlanta, Georgia, United States; Boston, Massachusetts, United States; Broomfield, Colorado, United States; Colorado Springs, Colorado, United States; Costa Mesa, California, United States; Fort Collins, Colorado, United States; Irvine, California, United States; Seattle, Washington, United States | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://boards.greenhouse.io/andurilindustries/jobs/5153218007?gh_jid=5153218007">View job</a> |
| Hermeus | Manufacturing | Manufacturing Engineering Intern - Spring/Summer 2027 | Atlanta, GA | open | 2026-09-02 | 2026-09-04 | 2026-09-04 | <a href="https://jobs.lever.co/hermeus/1bdf3754-5649-4a50-913e-b05140cb004f">View job</a> |
| Hermeus | Aerospace | Propulsion Component Engineering Intern - Spring 2027 | Los Angeles, CA | open | 2026-08-31 | 2026-09-04 | 2026-09-04 | <a href="https://jobs.lever.co/hermeus/2cbb75f7-a040-47b2-a442-d9cc1faedb11">View job</a> |
| Hermeus | Aerospace | Structures Engineering Intern - Spring/Summer/Fall 2027 | Los Angeles, CA | open | 2026-09-02 | 2026-09-04 | 2026-09-04 | <a href="https://jobs.lever.co/hermeus/6b65768c-a8b2-4c77-8d5f-f407e32bb878">View job</a> |

### Year unspecified — verify the term with the employer

| Company | Discipline | Position | Location | Status | Posted | First found | Last verified | Link |
|---|---|---|---|---|---|---|---|---|
| Rivian | Mechanical Design | UIUC Research Park Intern - Mechanical Modeling | Champaign, Illinois | Needs verification | 2026-07-28 | 2026-09-04 | Unknown | <a href="https://us-careers-rivian.icims.com/jobs/32574/login">View job</a> |

Other-year roles are excluded from these tables and remain available in the browsing page and history. “Last verified” means last seen in a source feed, not a guarantee the employer still accepts applications.
<!-- JOB_TABLE_END -->
