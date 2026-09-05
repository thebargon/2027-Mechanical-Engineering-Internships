# Contributing

We track mechanical engineering and closely related manufacturing, thermal/fluid, propulsion, structures, robotics/mechatronics, tooling, and vehicle-mechanics internships and co-ops. Titles must establish mechanical relevance; an employer's industry or description alone is insufficient. Pure electrical/electronics, software, business, full-time, and ambiguous engineering roles are outside scope. Use the shared `isMechanicalInternship` filter in every adapter; category keywords must not control eligibility.

## Suggest or correct a listing

Use the issue forms for a missing internship, a broken/closed posting, or a company suggestion. Include the employer's direct job-description URL, title, location, and term if known. Do not include personal application data, emails, or resumes. A listing issue is a suggestion for review, not an automatic publication.

## Add a company or improve an adapter

1. Update `scripts/src/companies.ts` with the real employer and a verified board identifier. Companies without identifiers are targets only.
   For Workday, provide `{ host, tenant, site }` from the employer's external career URL; a tenant name alone is insufficient. For Ashby, copy the case-sensitive board name from the employer's hosted job board. Record the source link in `SOURCES.md`.
2. Add or update the adapter in `scripts/src/scraper.ts`. Register it in `getSnapshot` with the same source name used by its jobs. Use the shared HTTP helper and internship filters. Never add credentials or bypass access controls.
3. Add small, sanitized response fixtures and tests covering positive matches, irrelevant roles, empty results, malformed responses, dates, and direct links. Document fixture provenance. Never commit full downloaded career sites.
4. A source may be marked complete only if its response schema and pagination establish a complete job set. Otherwise keep it partial; partial sources must not close jobs by absence.
5. Run `cd scripts`, `bun install --frozen-lockfile`, `bun test`, and `bun run build`. Include results and known limitations in the pull request.

Do not edit generated README tables, `data/`, `ARCHIVE.md`, or `docs/index.html` manually. Fix the source, filters, history logic, or renderer. `bun run build` is offline; `bun run generate` performs network requests and changes stored verification dates.

The Greenhouse adapter follows the [official Job Board API documentation](https://docs.greenhouse.io/job-board.html). Its public feed uses `boards-api.greenhouse.io/v1/boards/{board_token}/jobs`.

The source-code license is in `LICENSE`. Employer listing text, company names, and third-party content remain subject to their owners' rights.
