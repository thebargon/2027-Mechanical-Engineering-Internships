# Verified source configuration

These boards were checked against their public feeds on September 4, 2026. Search-engine results are used to locate employer boards, not imported as live vacancies. See `data/sources.md` for the latest run's actual results, including failures and boards with no matching internships.

| Company | Board | Adapter |
|---|---|---|
| Blue Origin | [BlueOrigin](https://blueorigin.wd5.myworkdayjobs.com/en-US/BlueOrigin) | Workday |
| Stryker | [StrykerCareers](https://stryker.wd1.myworkdayjobs.com/en-US/StrykerCareers) | Workday |
| Air Products | [AP0001](https://airproducts.wd5.myworkdayjobs.com/en-US/AP0001) | Workday |
| IMEG | [Imeg_Careers](https://imeg.wd1.myworkdayjobs.com/en-US/Imeg_Careers) | Workday |
| Rocket Lab | [rocketlab](https://job-boards.greenhouse.io/rocketlab) | Greenhouse |
| Archer Aviation | [archer56](https://job-boards.greenhouse.io/archer56) | Greenhouse |
| General Matter | [generalmatter](https://job-boards.greenhouse.io/generalmatter) | Greenhouse |
| Etched | [Etched](https://jobs.ashbyhq.com/Etched) | Ashby |
| Overview Energy | [overviewenergy](https://jobs.ashbyhq.com/overviewenergy) | Ashby |

| Rivian | [Employer board](https://careers.rivian.com/careers-home) | iCIMS Careers API |
| RTX | [Employer board](https://globalhr.wd5.myworkdayjobs.com/en-US/REC_RTX_Ext_Gateway) | Workday |
| Bosch | [Employer board](https://careers.smartrecruiters.com/BoschGroup) | SmartRecruiters |
| John Deere | [Employer board](https://jobs.deere.com/search/?q=intern) | SuccessFactors |
| NVIDIA | [Employer board](https://nvidia.wd5.myworkdayjobs.com/en-US/NVIDIAExternalCareerSite) | Workday |
| Intel | [Employer board](https://intel.wd1.myworkdayjobs.com/en-US/External) | Workday |
| AMD | [Employer board](https://careers.amd.com/careers-home) | iCIMS Careers API |
| Boeing | [Employer board](https://boeing.wd1.myworkdayjobs.com/en-US/INTERN) | Workday |
| GE Aerospace | [Employer board](https://geaerospace.wd5.myworkdayjobs.com/en-US/GE_ExternalSite) | Workday |
| Caterpillar | [Employer board](https://cat.wd5.myworkdayjobs.com/en-US/CaterpillarCareers) | Workday |
| General Motors | [Employer board](https://generalmotors.wd5.myworkdayjobs.com/en-US/Careers_GM) | Workday |
| Lucid | [Employer board](https://job-boards.greenhouse.io/lucidmotors) | Greenhouse |
| Medtronic | [Employer board](https://medtronic.wd1.myworkdayjobs.com/en-US/MedtronicCareers) | Workday |
| Boston Scientific | [Employer board](https://jobs.bostonscientific.com/search/?q=intern) | SuccessFactors |
| Applied Materials | [Employer board](https://amat.wd1.myworkdayjobs.com/en-US/External) | Workday |
| Virgin Galactic | [Employer board](https://careers.virgingalactic.com/search/?q=intern) | SuccessFactors |
| Boston Dynamics | [Employer board](https://bostondynamics.wd1.myworkdayjobs.com/en-US/Boston_Dynamics) | Workday |
| Abbott | [Employer board](https://abbott.wd5.myworkdayjobs.com/en-US/abbottcareers) | Workday |
| Edwards Lifesciences | [Employer board](https://edwards.wd5.myworkdayjobs.com/en-US/EdwardsCareers) | Workday |
| Intuitive Surgical | [Employer board](https://careers.smartrecruiters.com/Intuitive) | SmartRecruiters |

## Workday

The public career search uses a JSON POST to `https://{host}/wday/cxs/{tenant}/{site}/jobs` with `limit`, `offset`, `searchText`, and `appliedFacets`. The scraper searches `intern` and `co-op`, filters the returned titles using the existing strict mechanical predicate, and deduplicates URLs across queries. The external job-description link includes `/en-US/{site}` before the returned job path.

The first response supplies the total. Later pages commonly report zero even when more results remain, so the scraper retains the original total. Pagination stops after that total, an empty/repeated page, a failure, or 100 pages per query. Early termination is reported as partial and retains already retrieved jobs. Keyword search is always considered partial for closure purposes, even after every page is read. A failed search never closes previous listings.

Bare legacy tenant guesses are not working configurations. They remain visible as unconfigured until a real host and external site are verified. The discovery utility no longer probes invented Workday boards.

## Ashby

The adapter follows the [official public Job Postings API](https://developers.ashbyhq.com/docs/public-job-posting-api). It uses the board's `jobUrl`, includes additional listed locations, rejects malformed responses, and excludes `isListed: false` postings. Its `publishedAt` field is a last-published time, so it is not used as an original posting date.

## Scope and dates

No eligibility rules were broadened to add these sources. Mechanical and clearly related internship titles are still required. Titles containing 2027, titles with unspecified years, and other-year titles remain separate. Unknown original dates remain unknown. Identical titles with different employer requisition URLs can be distinct openings.

## SmartRecruiters and public career portals

Bosch and Intuitive use the public [SmartRecruiters Posting API](https://developers.smartrecruiters.com/docs/posting-api). The adapter paginates the full public feed, excludes non-public postings, and deduplicates requisition IDs. Repeated, malformed, missing, or capped pages produce partial coverage and retain earlier results. Release dates are not treated as original posting dates.

AMD and Rivian use their public iCIMS Careers API. The obsolete Rivian tag restriction was removed. John Deere, Boston Scientific, and Virgin Galactic use public SuccessFactors search tables. Both adapters search internships and co-ops, paginate, and retain the strict title filter. SuccessFactors counts rows instead of duplicated desktop/mobile links. Keyword searches remain partial for closure decisions.

RTX results are stored under RTX. Pratt & Whitney, Raytheon, and Collins Aerospace are shown as shared-board coverage with the parent status; jobs are never duplicated or attributed to a subsidiary without evidence. The previous Phenom adapter incorrectly hardcoded RTX for every employer; it has been disabled, and Virgin Galactic now uses its own verified board.

## Remaining coverage gaps

The latest repairs do not establish complete coverage of every target employer. Tesla still rejects the public API request. Qualcomm and Lam Research public career APIs returned HTTP 403 during verification; their old Lever/Greenhouse assignments are not working replacements. Ford, Honeywell (including its Aerospace entry), Cummins, and Lockheed Martin still have failing legacy assignments and require supported adapters for their actual employer portals. These remain visible as failures, not successful empty feeds. No access controls are bypassed.

A verified board can legitimately have zero titles passing the mechanical internship filter. Workday queries can also reach the pagination cap (RTX) or return malformed later pages (NVIDIA); these limitations remain visible in source health. HTTP failures now include the response status when available.
