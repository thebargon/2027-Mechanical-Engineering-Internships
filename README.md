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

<!-- JOB_TABLE_START -->
Last checked: **2026-09-04T23:59:47.963Z** · 27 failed sources. See [source health](data/sources.md) and [archive](ARCHIVE.md).

### Confirmed 2027 in title

| Company | Discipline | Position | Location | Status | Posted | First found | Last verified | Link |
|---|---|---|---|---|---|---|---|---|
| Anduril | Mechanical Design | 2027 Mechanical Engineer Intern | Atlanta, Georgia, United States; Boston, Massachusetts, United States; Broomfield, Colorado, United States; Colorado Springs, Colorado, United States; Costa Mesa, California, United States; Fort Collins, Colorado, United States; Irvine, California, United States; Reston, Virginia, United States; Seattle, Washington, United States | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://boards.greenhouse.io/andurilindustries/jobs/5153187007?gh_jid=5153187007">View job</a> |
| Stryker | Mechanical Design | Biomedical/Mechanical Engineering Co-op 2027 - Cork | 8 Locations | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://stryker.wd1.myworkdayjobs.com/en-US/StrykerCareers/job/Cork-Ireland/Biomedical-Mechanical-Engineering-Co-op-2027---Cork_R569396">View job</a> |
| Stryker | Mechanical Design | Biomedical/Mechanical Engineering Co-op 2027 - Cork (Summer Start) | 8 Locations | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://stryker.wd1.myworkdayjobs.com/en-US/StrykerCareers/job/Cork-Ireland/Biomedical-Mechanical-Engineering-Co-op-2027---Cork--Summer-Start-_R570845">View job</a> |
| Stryker | Mechanical Design | Biomedical/Mechanical Engineering Co-Op Placement 2027 - Limerick | Limerick, Ireland | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://stryker.wd1.myworkdayjobs.com/en-US/StrykerCareers/job/Limerick-Ireland/Biomedical-Mechanical-Engineering-Co-Op-Placement-2027---Limerick_R570851">View job</a> |
| Hermeus | Mechanical Design | Structures/Mechanical Engineering Intern - Spring/Summer 2027 | Atlanta, GA | open | 2026-09-02 | 2026-09-04 | 2026-09-04 | <a href="https://jobs.lever.co/hermeus/60b5d40a-1065-4bd2-8c72-6b2fb69d4761">View job</a> |
| Stryker | Mechanical Design | Summer 2027 Internship - Mechanical Engineer | Not specified | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://stryker.wd1.myworkdayjobs.com/en-US/StrykerCareers/job/Summer-2027-Internship---Mechanical-Engineer_R573345">View job</a> |
| General Matter | Mechanical Design | Summer 2027 Internship - Mechanical Engineering | South Bay, Los Angeles  | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://job-boards.greenhouse.io/generalmatter/jobs/5377107008">View job</a> |
| Stryker | Mechanical Design | Summer 2027 Internship - Mechanical Engineering - Arizona | Tempe, Arizona | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://stryker.wd1.myworkdayjobs.com/en-US/StrykerCareers/job/Tempe-Arizona/Summer-2027-Internship---Mechanical-Engineering---Arizona_R572599">View job</a> |
| Stryker | Mechanical Design | Summer 2027 Internship - Mechanical Engineering - California | 2 Locations | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://stryker.wd1.myworkdayjobs.com/en-US/StrykerCareers/job/San-Jose-California/Summer-2027-Internship---Mechanical-Engineering---California_R572600">View job</a> |
| Stryker | Mechanical Design | Summer 2027 Internship - Mechanical Engineering - Illinois | Cary, Illinois | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://stryker.wd1.myworkdayjobs.com/en-US/StrykerCareers/job/Cary-Illinois/Summer-2027-Internship---Mechanical-Engineering---Illinois_R572602">View job</a> |
| Stryker | Mechanical Design | Summer 2027 Internship - Mechanical Engineering - Michigan | Portage, Michigan | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://stryker.wd1.myworkdayjobs.com/en-US/StrykerCareers/job/Portage-Michigan/Summer-2027-Internship---Mechanical-Engineering---Michigan_R572603">View job</a> |
| Stryker | Mechanical Design | Summer 2027 Internship - Mechanical Engineering - New Jersey | Mahwah, New Jersey | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://stryker.wd1.myworkdayjobs.com/en-US/StrykerCareers/job/Mahwah-New-Jersey/Summer-2027-Internship---Mechanical-Engineering---New-Jersey_R572605-1">View job</a> |
| General Matter | Mechanical Design | Summer 2027 Internship - Mechanical Engineering (HVAC)  | Los Angeles, CA | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://job-boards.greenhouse.io/generalmatter/jobs/5377104008">View job</a> |
| Blue Origin | Mechanical Design | Summer 2027 Structural &amp; Mechanical Engineering Internship - Undergraduate | 6 Locations | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://blueorigin.wd5.myworkdayjobs.com/en-US/BlueOrigin/job/Greater-Seattle-Area/Summer-2027-Structural---Mechanical-Engineering-Internship---Undergraduate_R71444">View job</a> |
| Blue Origin | Mechanical Design | Summer 2027 Structural &amp; Mechanical Systems Engineering Internship - Graduate | 6 Locations | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://blueorigin.wd5.myworkdayjobs.com/en-US/BlueOrigin/job/Greater-Seattle-Area/Summer-2027-Structural---Mechanical-Systems-Engineering-Internship---Graduate_R71445">View job</a> |
| Air Products | Mechanical Design | Summer Intern/Co-op-Mechanical Engineering (2027) | Allentown, Pennsylvania | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://airproducts.wd5.myworkdayjobs.com/en-US/AP0001/job/Allentown-Pennsylvania/Summer-Intern-Co-op-Mechanical-Engineering--2027-_JR-2026-21956">View job</a> |
| Anduril | Manufacturing | 2027 Manufacturing Engineer Intern | Atlanta, Georgia, United States; Boston, Massachusetts, United States; Broomfield, Colorado, United States; Colorado Springs, Colorado, United States; Costa Mesa, California, United States; Fort Collins, Colorado, United States; Irvine, California, United States; Seattle, Washington, United States | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://boards.greenhouse.io/andurilindustries/jobs/5153218007?gh_jid=5153218007">View job</a> |
| Hermeus | Manufacturing | Manufacturing Engineering Intern - Spring/Summer 2027 | Atlanta, GA | open | 2026-09-02 | 2026-09-04 | 2026-09-04 | <a href="https://jobs.lever.co/hermeus/1bdf3754-5649-4a50-913e-b05140cb004f">View job</a> |
| Stryker | Manufacturing | Manufacturing Operations Co-Op Placement 2027 - Cork | 5 Locations | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://stryker.wd1.myworkdayjobs.com/en-US/StrykerCareers/job/Cork-Ireland/Manufacturing-Operations-Co-op-2027---Cork_R570846">View job</a> |
| General Matter | Manufacturing | Summer 2027 Internship - Manufacturing Engineering | Los Angeles, CA | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://job-boards.greenhouse.io/generalmatter/jobs/5376060008">View job</a> |
| Stryker | Manufacturing | Summer 2027 Internship - Manufacturing Engineering - Michigan | 2 Locations | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://stryker.wd1.myworkdayjobs.com/en-US/StrykerCareers/job/Kalamazoo-Michigan/Summer-2027-Internship---Manufacturing-Engineering---Michigan_R572595">View job</a> |
| Blue Origin | Manufacturing | Summer 2027 Manufacturing Engineering Internship - Graduate | 4 Locations | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://blueorigin.wd5.myworkdayjobs.com/en-US/BlueOrigin/job/Huntsville-AL/Summer-2027-Manufacturing-Engineering-Internship---Graduate_R71427">View job</a> |
| Blue Origin | Manufacturing | Summer 2027 Manufacturing Engineering Internship - Undergraduate | 4 Locations | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://blueorigin.wd5.myworkdayjobs.com/en-US/BlueOrigin/job/Space-Coast-FL/Summer-2027-Manufacturing-Engineering-Internship---Undergraduate_R71428">View job</a> |
| Hermeus | Aerospace | Propulsion Component Engineering Intern - Spring 2027 | Los Angeles, CA | open | 2026-08-31 | 2026-09-04 | 2026-09-04 | <a href="https://jobs.lever.co/hermeus/2cbb75f7-a040-47b2-a442-d9cc1faedb11">View job</a> |
| Hermeus | Aerospace | Structures Engineering Intern - Spring/Summer/Fall 2027 | Los Angeles, CA | open | 2026-09-02 | 2026-09-04 | 2026-09-04 | <a href="https://jobs.lever.co/hermeus/6b65768c-a8b2-4c77-8d5f-f407e32bb878">View job</a> |
| Blue Origin | Aerospace | Summer 2027 Fluid Systems &amp; Propulsion Engineering Internship - Graduate | 3 Locations | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://blueorigin.wd5.myworkdayjobs.com/en-US/BlueOrigin/job/Greater-Seattle-Area/Summer-2027-Fluid-Systems---Propulsion-Engineering-Internship---Graduate_R71439">View job</a> |
| Blue Origin | Aerospace | Summer 2027 Fluid Systems &amp; Propulsion Engineering Internship - Undergraduate | 4 Locations | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://blueorigin.wd5.myworkdayjobs.com/en-US/BlueOrigin/job/Greater-Seattle-Area/Summer-2027-Fluid-Systems---Propulsion-Engineering-Internship---Undergraduate_R71441">View job</a> |

### Year unspecified — verify the term with the employer

| Company | Discipline | Position | Location | Status | Posted | First found | Last verified | Link |
|---|---|---|---|---|---|---|---|---|
| Rocket Lab | Mechanical Design | Ground Systems Mechanical Engineering Intern - Neutron | Auckland, NZ | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://job-boards.greenhouse.io/rocketlab/jobs/7821138003">View job</a> |
| Rocket Lab | Mechanical Design | Mechanical Development Intern | Auckland, NZ | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://job-boards.greenhouse.io/rocketlab/jobs/7821134003">View job</a> |
| Stryker | Mechanical Design | Mechanical Engineering Intern | Redmond, Washington | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://stryker.wd1.myworkdayjobs.com/en-US/StrykerCareers/job/Redmond-Washington/Mechanical-Engineering-Intern_R572728">View job</a> |
| Stryker | Mechanical Design | Mechanical Engineering Intern | Massachusetts, Virtual Address | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://stryker.wd1.myworkdayjobs.com/en-US/StrykerCareers/job/Massachusetts-Virtual-Address/Mechanical-Engineering-Intern_R572943-1">View job</a> |
| IMEG | Mechanical Design | Mechanical Engineering Intern &#124; Ann Arbor, MI | Ann Arbor, MI | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://imeg.wd1.myworkdayjobs.com/en-US/Imeg_Careers/job/Ann-Arbor-MI/Mechanical-Engineering-Intern---Ann-Arbor--MI_R-16674">View job</a> |
| IMEG | Mechanical Design | Mechanical Engineering Intern &#124; Columbus, OH | 3 Locations | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://imeg.wd1.myworkdayjobs.com/en-US/Imeg_Careers/job/Columbus--North-High-Street/Mechanical-Engineering-Intern---Columbus--OH_R-16494">View job</a> |
| IMEG | Mechanical Design | Mechanical Engineering Intern &#124; Columbus, OH | Columbus, OH | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://imeg.wd1.myworkdayjobs.com/en-US/Imeg_Careers/job/Columbus-OH/Mechanical-Engineering-Intern---Columbus--OH_R-16523">View job</a> |
| IMEG | Mechanical Design | Mechanical Engineering Intern &#124; Greenwood Village, CO | Denver Metro, CO | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://imeg.wd1.myworkdayjobs.com/en-US/Imeg_Careers/job/Denver-Metro-CO/Mechanical-Engineering-Intern---Greenwood-Village--CO_R-16570-1">View job</a> |
| IMEG | Mechanical Design | Mechanical Engineering Intern &#124; Greenwood Village, CO | Denver Metro, CO | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://imeg.wd1.myworkdayjobs.com/en-US/Imeg_Careers/job/Denver-Metro-CO/Mechanical-Engineering-Intern---Greenwood-Village--CO_R-16558">View job</a> |
| IMEG | Mechanical Design | Mechanical Engineering Intern &#124; Idaho Falls, ID | Idaho Falls, ID | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://imeg.wd1.myworkdayjobs.com/en-US/Imeg_Careers/job/Idaho-Falls-ID/Mechanical-Engineering-Intern---Idaho-Falls--ID_R-16541">View job</a> |
| IMEG | Mechanical Design | Mechanical Engineering Intern &#124; Independence, OH | Cleveland, OH | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://imeg.wd1.myworkdayjobs.com/en-US/Imeg_Careers/job/Cleveland-OH/Mechanical-Engineering-Intern---Independence--OH_R-16694">View job</a> |
| IMEG | Mechanical Design | Mechanical Engineering Intern &#124; Long Island, NY | Long Island | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://imeg.wd1.myworkdayjobs.com/en-US/Imeg_Careers/job/Long-Island/Mechanical-Engineering-Intern---Long-Island--NY_R-16635">View job</a> |
| IMEG | Mechanical Design | Mechanical Engineering Intern &#124; Madison, WI | Madison, WI | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://imeg.wd1.myworkdayjobs.com/en-US/Imeg_Careers/job/Madison-WI/Mechanical-Engineering-Intern---Madison--WI_R-16461">View job</a> |
| IMEG | Mechanical Design | Mechanical Engineering Intern &#124; Minneapolis, MN | Minneapolis, MN | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://imeg.wd1.myworkdayjobs.com/en-US/Imeg_Careers/job/Minneapolis-MN/Mechanical-Engineering-Intern---Minneapolis--MN_R-16463">View job</a> |
| IMEG | Mechanical Design | Mechanical Engineering Intern &#124; Naperville, IL | Naperville, IL | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://imeg.wd1.myworkdayjobs.com/en-US/Imeg_Careers/job/Naperville-IL/Mechanical-Engineering-Intern---Naperville--IL_R-16451">View job</a> |
| IMEG | Mechanical Design | Mechanical Engineering Intern &#124; Naperville, IL | Naperville, IL | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://imeg.wd1.myworkdayjobs.com/en-US/Imeg_Careers/job/Naperville-IL/Mechanical-Engineering-Intern---Naperville--IL_R-16471">View job</a> |
| IMEG | Mechanical Design | Mechanical Engineering Intern &#124; New York, NY | New York, NY | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://imeg.wd1.myworkdayjobs.com/en-US/Imeg_Careers/job/New-York-NY/Mechanical-Engineering-Intern---New-York--NY_R-16661">View job</a> |
| IMEG | Mechanical Design | Mechanical Engineering Intern &#124; New York, NY | Manhattan &#124; Broadway | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://imeg.wd1.myworkdayjobs.com/en-US/Imeg_Careers/job/Manhattan--Broadway/Mechanical-Engineering-Intern---New-York--NY_R-16633">View job</a> |
| IMEG | Mechanical Design | Mechanical Engineering Intern &#124; New York, NY | Manhattan &#124; Broadway | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://imeg.wd1.myworkdayjobs.com/en-US/Imeg_Careers/job/Manhattan--Broadway/Mechanical-Engineering-Intern---New-York--NY_R-16636">View job</a> |
| IMEG | Mechanical Design | Mechanical Engineering Intern &#124; Rock Island, IL | Rock Island, IL | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://imeg.wd1.myworkdayjobs.com/en-US/Imeg_Careers/job/Rock-Island-IL/Mechanical-Engineering-Intern---Rock-Island--IL_R-16375">View job</a> |
| IMEG | Mechanical Design | Mechanical Engineering Intern &#124; Rock Island, IL | Rock Island, IL | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://imeg.wd1.myworkdayjobs.com/en-US/Imeg_Careers/job/Rock-Island-IL/Mechanical-Engineering-Intern---Rock-Island--IL_R-16366">View job</a> |
| IMEG | Mechanical Design | Mechanical Engineering Intern &#124; Rogers, AR | Rogers, AR | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://imeg.wd1.myworkdayjobs.com/en-US/Imeg_Careers/job/Rogers-AR/Mechanical-Engineering-Intern---Rogers--AR_R-16495">View job</a> |
| IMEG | Mechanical Design | Mechanical Engineering Intern &#124; Seattle, WA | 2 Locations | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://imeg.wd1.myworkdayjobs.com/en-US/Imeg_Careers/job/Seattle-WA/Mechanical-Engineering-Intern---Seattle--WA_R-16575">View job</a> |
| IMEG | Mechanical Design | Mechanical Engineering Intern &#124; St. Louis, MO | St. Louis, MO | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://imeg.wd1.myworkdayjobs.com/en-US/Imeg_Careers/job/St-Louis-MO/Mechanical-Engineering-Intern_R-16487">View job</a> |
| IMEG | Mechanical Design | Mechanical Intern Technician &#124; Germantown, MD | Germantown, MD | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://imeg.wd1.myworkdayjobs.com/en-US/Imeg_Careers/job/Germantown-MD/Mechanical-Intern-Technician---Germantown--MD_R-16567">View job</a> |
| Rocket Lab | Mechanical Design | Neutron Mechanical Development Intern | Auckland, NZ | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://job-boards.greenhouse.io/rocketlab/jobs/7821193003">View job</a> |
| Rocket Lab | Mechanical Design | Neutron Mechanical Development Intern | Auckland, NZ | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://job-boards.greenhouse.io/rocketlab/jobs/7821122003">View job</a> |
| Rocket Lab | Thermal Fluids | Development Engineering Intern - Neutron Thermal Protection Systems | Auckland, NZ | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://job-boards.greenhouse.io/rocketlab/jobs/7825281003">View job</a> |
| Etched | Thermal Fluids | Mech / Thermal Intern | San Jose | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://jobs.ashbyhq.com/Etched/f05e3218-5ec7-41d1-bc99-bb7014422229">View job</a> |
| Rocket Lab | Manufacturing | Avionics Manufacturing Engineering Intern | Auckland, NZ | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://job-boards.greenhouse.io/rocketlab/jobs/7819770003">View job</a> |
| Rocket Lab | Manufacturing | Facilities Maintenance Manufacturing Engineering Intern | Auckland, NZ | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://job-boards.greenhouse.io/rocketlab/jobs/7821146003">View job</a> |
| Rocket Lab | Manufacturing | Manufacturing Engineering Intern | Auckland, NZ | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://job-boards.greenhouse.io/rocketlab/jobs/7821115003">View job</a> |
| Stryker | Manufacturing | Manufacturing Engineering Intern | Redmond, Washington | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://stryker.wd1.myworkdayjobs.com/en-US/StrykerCareers/job/Redmond-Washington/Manufacturing-Engineering-Intern_R572846">View job</a> |
| Stryker | Manufacturing | Manufacturing Engineering Intern | San Jose, California | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://stryker.wd1.myworkdayjobs.com/en-US/StrykerCareers/job/San-Jose-California/Manufacturing-Engineering-Intern_R572749-1">View job</a> |
| Stryker | Manufacturing | Manufacturing Engineering Intern | Cary, Illinois | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://stryker.wd1.myworkdayjobs.com/en-US/StrykerCareers/job/Cary-Illinois/Manufacturing-Engineering-Intern_R572922">View job</a> |
| Rocket Lab | Manufacturing | Manufacturing Engineering Intern - Composites | Auckland, NZ | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://job-boards.greenhouse.io/rocketlab/jobs/7882562003">View job</a> |
| Rocket Lab | Manufacturing | Manufacturing Engineering Intern - Composites | Auckland, NZ | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://job-boards.greenhouse.io/rocketlab/jobs/7825144003">View job</a> |
| Rocket Lab | Manufacturing | Manufacturing Engineering Intern - Space Sytems | Auckland, NZ | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://job-boards.greenhouse.io/rocketlab/jobs/7820012003">View job</a> |
| Rocket Lab | Manufacturing | Manufacturing Engineering Intern - Vehicle Integration | Auckland, NZ | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://job-boards.greenhouse.io/rocketlab/jobs/7819745003">View job</a> |
| Rocket Lab | Manufacturing | Manufacturing Engineering Intern- Spacecraft Components | Auckland, NZ | open | Unknown | 2026-09-04 | 2026-09-04 | <a href="https://job-boards.greenhouse.io/rocketlab/jobs/7820014003">View job</a> |
| Rivian | Mechanical Design | UIUC Research Park Intern - Mechanical Modeling | Champaign, Illinois | Needs verification | 2026-07-28 | 2026-09-04 | Unknown | <a href="https://us-careers-rivian.icims.com/jobs/32574/login">View job</a> |

Other-year roles are excluded from these tables and remain available in the browsing page and history. “Last verified” means last seen in a source feed, not a guarantee the employer still accepts applications.
<!-- JOB_TABLE_END -->
