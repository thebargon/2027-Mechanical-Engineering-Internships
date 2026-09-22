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

Configured sources include Greenhouse, Lever, Ashby, Workday, iCIMS, PhenomPeople, Rippling, and selected company feeds. [Source health](data/sources.md) distinguishes functioning feeds, best-effort adapters, failed requests, and target companies with no scraper. A company in the registry does not necessarily have working coverage. See [verified source configuration](SOURCES.md) for the new boards and adapter details.

GitHub Actions is configured to run daily at 12:00 UTC and on manual dispatch. The schedule runs when the workflow is enabled on the default branch. Requests have 12-second timeouts, at most three attempts, a global four-request-per-second start limit, and three concurrent source tasks. Long Retry-After values defer retries to a later run. Failed scrapes preserve historical listings.

Greenhouse, Lever, and Ashby feeds can establish closure after complete response validation. Ashby excludes unlisted postings. Workday uses verified board addresses and paginated searches for both internships and co-ops, up to 100 pages of 20 results per query. It retains page-one totals when later pages report zero, deduplicates overlapping search results, and preserves earlier pages if later requests fail. Workday keyword search and other best-effort adapters cannot establish closure by absence. Legacy Workday tenant guesses are marked unconfigured rather than issuing requests to fabricated URLs.

Links point to individual descriptions where the source supplies an identifier or URL; generic fallbacks are labeled Career page. Workday relative ages and Ashby last-published dates are not presented as original posting dates. This tracker does not bypass authentication, CAPTCHAs, or access controls. Listings may be outside the United States; check the location before applying.

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

Geographic scope: California and Indiana only, prioritized as Los Angeles/Orange County, the rest of California, then Indiana. Unspecified locations, generic remote roles, and unresolved multi-location postings are excluded.

<!-- JOB_TABLE_START -->
Last checked: **2026-09-22T16:17:09.231Z** · 10 failed sources. See [source health](data/sources.md) and [archive](ARCHIVE.md).

### Confirmed 2027 in title

| Company | Discipline | Position | Location | Status | Posted | First found | Last verified | Link |
|---|---|---|---|---|---|---|---|---|
| Anduril | Mechanical Design | 2027 Mechanical Engineer Intern | Atlanta, Georgia, United States; Boston, Massachusetts, United States; Broomfield, Colorado, United States; Colorado Springs, Colorado, United States; Costa Mesa, California, United States; Fort Collins, Colorado, United States; Irvine, California, United States; Reston, Virginia, United States; Seattle, Washington, United States | open | Unknown | 2026-09-04 | 2026-09-22 | <a href="https://boards.greenhouse.io/andurilindustries/jobs/5153187007?gh_jid=5153187007">View job</a> |
| Hermeus | Mechanical Design | Mechanical Engineering Intern  - Spring/Summer 2027 | Los Angeles, CA | open | 2026-08-31 | 2026-09-09 | 2026-09-22 | <a href="https://jobs.lever.co/hermeus/1bc5c858-1b04-4093-80a0-2ba3491afc60">View job</a> |
| Rocket Lab | Mechanical Design | Mechanical Engineering Intern Spring 2027 | Long Beach, CA | open | Unknown | 2026-09-14 | 2026-09-22 | <a href="https://job-boards.greenhouse.io/rocketlab/jobs/7985634003">View job</a> |
| Rocket Lab | Mechanical Design | Mechanical Engineering Intern Summer 2027 | Long Beach, CA | open | Unknown | 2026-09-14 | 2026-09-22 | <a href="https://job-boards.greenhouse.io/rocketlab/jobs/7991448003">View job</a> |
| General Matter | Mechanical Design | Summer 2027 Internship - Mechanical Engineering | South Bay, Los Angeles  | open | Unknown | 2026-09-04 | 2026-09-22 | <a href="https://job-boards.greenhouse.io/generalmatter/jobs/5377107008">View job</a> |
| General Matter | Mechanical Design | Summer 2027 Internship - Mechanical Engineering (HVAC)  | Los Angeles, CA | open | Unknown | 2026-09-04 | 2026-09-22 | <a href="https://job-boards.greenhouse.io/generalmatter/jobs/5377104008">View job</a> |
| Rocket Lab | Aerospace | Propulsion Design Intern Spring 2027 | Long Beach, CA | open | Unknown | 2026-09-11 | 2026-09-22 | <a href="https://job-boards.greenhouse.io/rocketlab/jobs/7987110003">View job</a> |
| Rocket Lab | Aerospace | Propulsion Design Intern Summer 2027 | Long Beach, CA | open | Unknown | 2026-09-11 | 2026-09-22 | <a href="https://job-boards.greenhouse.io/rocketlab/jobs/7986816003">View job</a> |
| Rocket Lab | Thermal Fluids | Thermal Engineering Intern Spring 2027 | Long Beach, CA | open | Unknown | 2026-09-22 | 2026-09-22 | <a href="https://job-boards.greenhouse.io/rocketlab/jobs/8000951003">View job</a> |
| Rocket Lab | Thermal Fluids | Thermal Engineering Intern Summer 2027 | Long Beach, CA | open | Unknown | 2026-09-22 | 2026-09-22 | <a href="https://job-boards.greenhouse.io/rocketlab/jobs/8000958003">View job</a> |
| Anduril | Manufacturing | 2027 Manufacturing Engineer Intern | Atlanta, Georgia, United States; Boston, Massachusetts, United States; Broomfield, Colorado, United States; Colorado Springs, Colorado, United States; Costa Mesa, California, United States; Fort Collins, Colorado, United States; Irvine, California, United States; Seattle, Washington, United States | open | Unknown | 2026-09-04 | 2026-09-22 | <a href="https://boards.greenhouse.io/andurilindustries/jobs/5153218007?gh_jid=5153218007">View job</a> |
| Rocket Lab | Manufacturing | Additive Manufacturing Intern Spring 2027 | Long Beach, CA | open | Unknown | 2026-09-10 | 2026-09-22 | <a href="https://job-boards.greenhouse.io/rocketlab/jobs/7983576003">View job</a> |
| Rocket Lab | Manufacturing | Additive Manufacturing Intern Summer 2027 | Long Beach, CA | open | Unknown | 2026-09-10 | 2026-09-22 | <a href="https://job-boards.greenhouse.io/rocketlab/jobs/7984600003">View job</a> |
| Hermeus | Manufacturing | Manufacturing Engineering Intern - Spring/Summer/Fall 2027 | Los Angeles, CA | open | 2026-09-02 | 2026-09-09 | 2026-09-22 | <a href="https://jobs.lever.co/hermeus/5f6a6e79-9836-4c33-b40b-a2bb6c27bd06">View job</a> |
| Rocket Lab | Manufacturing | Manufacturing Engineering Intern Spring 2027 | Long Beach, CA | open | Unknown | 2026-09-17 | 2026-09-22 | <a href="https://job-boards.greenhouse.io/rocketlab/jobs/7984943003">View job</a> |
| Rocket Lab | Manufacturing | Manufacturing Engineering Intern Summer 2027 | Long Beach, CA | open | Unknown | 2026-09-17 | 2026-09-22 | <a href="https://job-boards.greenhouse.io/rocketlab/jobs/7984564003">View job</a> |
| General Matter | Manufacturing | Summer 2027 Internship - Manufacturing Engineering | Los Angeles, CA | open | Unknown | 2026-09-04 | 2026-09-22 | <a href="https://job-boards.greenhouse.io/generalmatter/jobs/5376060008">View job</a> |
| Rocket Lab | Manufacturing | Test Engineering Intern - Manufacturing Spring 2027 | Long Beach, CA | open | Unknown | 2026-09-18 | 2026-09-22 | <a href="https://job-boards.greenhouse.io/rocketlab/jobs/7987042003">View job</a> |
| Rocket Lab | Aerospace | Propulsion Analyst Intern Spring 2027 | Long Beach, CA | open | Unknown | 2026-09-17 | 2026-09-22 | <a href="https://job-boards.greenhouse.io/rocketlab/jobs/7986824003">View job</a> |
| Rocket Lab | Aerospace | Propulsion Analyst Intern Summer 2027 | Long Beach, CA | open | Unknown | 2026-09-17 | 2026-09-22 | <a href="https://job-boards.greenhouse.io/rocketlab/jobs/7986820003">View job</a> |
| Hermeus | Aerospace | Propulsion Component Engineering Intern - Spring 2027 | Los Angeles, CA | open | 2026-08-31 | 2026-09-04 | 2026-09-22 | <a href="https://jobs.lever.co/hermeus/2cbb75f7-a040-47b2-a442-d9cc1faedb11">View job</a> |
| Hermeus | Aerospace | Propulsion Engineering Intern - Spring/Summer/Fall 2027 | Los Angeles, CA | open | 2026-07-23 | 2026-09-09 | 2026-09-22 | <a href="https://jobs.lever.co/hermeus/943f51e4-5b26-432c-ae85-de5f43cadb86">View job</a> |
| Rocket Lab | Aerospace | Propulsion Intern Spring 2027 | Long Beach, CA | open | Unknown | 2026-09-11 | 2026-09-22 | <a href="https://job-boards.greenhouse.io/rocketlab/jobs/7986790003">View job</a> |
| Rocket Lab | Aerospace | Propulsion Intern Summer 2027 | Long Beach, CA | open | Unknown | 2026-09-11 | 2026-09-22 | <a href="https://job-boards.greenhouse.io/rocketlab/jobs/7986792003">View job</a> |
| Hermeus | Aerospace | Structures Engineering Intern - Spring/Summer/Fall 2027 | Los Angeles, CA | open | 2026-09-02 | 2026-09-04 | 2026-09-22 | <a href="https://jobs.lever.co/hermeus/6b65768c-a8b2-4c77-8d5f-f407e32bb878">View job</a> |
| Anduril | Aerospace | Winter 2027 Propulsion Engineer Co-op | Costa Mesa, California, United States | open | Unknown | 2026-09-16 | 2026-09-22 | <a href="https://boards.greenhouse.io/andurilindustries/jobs/5236587007?gh_jid=5236587007">View job</a> |
| NVIDIA | Robotics Controls | NVIDIA 2027 Internships: Autonomous Vehicles and Robotics | US, CA, Santa Clara | open | Unknown | 2026-09-05 | 2026-09-22 | <a href="https://nvidia.wd5.myworkdayjobs.com/en-US/NVIDIAExternalCareerSite/job/US-CA-Santa-Clara/NVIDIA-2027-Internships--Autonomous-Vehicles-and-Robotics_JR2023496">View job</a> |
| NVIDIA | Robotics Controls | NVIDIA 2027 Internships: Ph.D. Research Robotics | US, CA, Santa Clara | Needs verification | Unknown | 2026-09-05 | 2026-09-11 | <a href="https://nvidia.wd5.myworkdayjobs.com/en-US/NVIDIAExternalCareerSite/job/US-CA-Santa-Clara/NVIDIA-2027-Internships--PhD-Research-Robotics_JR2023847">View job</a> |
| Stryker | Manufacturing | Summer 2027 Internship - Manufacturing Engineering Intern - San  José | San Jose, California | Needs verification | Unknown | 2026-09-09 | 2026-09-09 | <a href="https://stryker.wd1.myworkdayjobs.com/en-US/StrykerCareers/job/San-Jose-California/Manufacturing-Engineering-Intern_R572749-1">View job</a> |
| Applied Materials | Manufacturing | Summer 2027 Industrial Engineering Intern- Bachelor&#39;s (Santa Clara, CA) | Santa Clara,CA | open | Unknown | 2026-09-05 | 2026-09-22 | <a href="https://amat.wd1.myworkdayjobs.com/en-US/External/job/Santa-ClaraCA/Summer-2027-Industrial-Engineering-Intern--Bachelor-s--Santa-Clara--CA-_R2626710">View job</a> |

### Year unspecified — verify the term with the employer

| Company | Discipline | Position | Location | Status | Posted | First found | Last verified | Link |
|---|---|---|---|---|---|---|---|---|
| Blue Origin | Mechanical Design | Mechanical Engineering Co-Op (Fixed Term) | Los Angeles, CA | open | Unknown | 2026-09-10 | 2026-09-22 | <a href="https://blueorigin.wd5.myworkdayjobs.com/en-US/BlueOrigin/job/Los-Angeles-CA/Mechanical-Engineering-Co-Op--Fixed-Term-_R71542">View job</a> |
| IMEG | Mechanical Design | Mechanical Engineering Intern &#124; Anaheim, CA | Anaheim, CA | open | Unknown | 2026-09-22 | 2026-09-22 | <a href="https://imeg.wd1.myworkdayjobs.com/en-US/Imeg_Careers/job/Anaheim-CA/Mechanical-Engineering-Intern---Anaheim--CA_R-16751">View job</a> |
| Intuitive Surgical | Mechanical Design | Manufacturing/Equipment/Supplier Engineering Intern (Mechanical or Biomedical Engineering Majors) | Sunnyvale, CA, United States | open | Unknown | 2026-09-05 | 2026-09-22 | <a href="https://jobs.smartrecruiters.com/Intuitive/744000147092239">View job</a> |
| Intuitive Surgical | Mechanical Design | Mechanical Engineering Intern | Sunnyvale, CA, United States | open | Unknown | 2026-09-05 | 2026-09-22 | <a href="https://jobs.smartrecruiters.com/Intuitive/744000147091674">View job</a> |
| IMEG | Mechanical Design | Mechanical Engineering Intern &#124; Ontario, CA | Ontario, California | open | Unknown | 2026-09-15 | 2026-09-22 | <a href="https://imeg.wd1.myworkdayjobs.com/en-US/Imeg_Careers/job/Ontario-California/Mechanical-Engineering-Intern---Ontario--CA_R-16414">View job</a> |
| Etched | Thermal Fluids | Mechancial / Thermal Intern | San Jose | open | Unknown | 2026-09-18 | 2026-09-22 | <a href="https://jobs.ashbyhq.com/Etched/f05e3218-5ec7-41d1-bc99-bb7014422229">View job</a> |
| Boston Scientific | Manufacturing | Manufacturing Engineering Associate, Co-op/New Grad | Mississauga, ON, CA | Needs verification | Unknown | 2026-09-15 | 2026-09-21 | <a href="https://jobs.bostonscientific.com/job/Mississauga-Manufacturing-Engineering-Associate%2C-Co-opNew-Grad-ON/1429903300/">View job</a> |
| Stryker | Manufacturing | Manufacturing Engineering Intern | San Jose, California | Needs verification | Unknown | 2026-09-04 | 2026-09-08 | <a href="https://stryker.wd1.myworkdayjobs.com/en-US/StrykerCareers/job/San-Jose-California/Manufacturing-Engineering-Intern_R572749-1">View job</a> |

Other-year roles are excluded from these tables and remain available in the browsing page and history. “Last verified” means last seen in a source feed, not a guarantee the employer still accepts applications.
<!-- JOB_TABLE_END -->
