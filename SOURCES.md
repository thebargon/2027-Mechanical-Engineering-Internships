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

## Workday

The public career search uses a JSON POST to `https://{host}/wday/cxs/{tenant}/{site}/jobs` with `limit`, `offset`, `searchText`, and `appliedFacets`. The scraper searches `intern` and `co-op`, filters the returned titles using the existing strict mechanical predicate, and deduplicates URLs across queries. The external job-description link includes `/en-US/{site}` before the returned job path.

The first response supplies the total. Later pages commonly report zero even when more results remain, so the scraper retains the original total. Pagination stops after that total, an empty/repeated page, a failure, or 100 pages per query. Early termination is reported as partial and retains already retrieved jobs. Keyword search is always considered partial for closure purposes, even after every page is read. A failed search never closes previous listings.

Bare legacy tenant guesses are not working configurations. They remain visible as unconfigured until a real host and external site are verified. The discovery utility no longer probes invented Workday boards.

## Ashby

The adapter follows the [official public Job Postings API](https://developers.ashbyhq.com/docs/public-job-posting-api). It uses the board's `jobUrl`, includes additional listed locations, rejects malformed responses, and excludes `isListed: false` postings. Its `publishedAt` field is a last-published time, so it is not used as an original posting date.

## Scope and dates

No eligibility rules were broadened to add these sources. Mechanical and clearly related internship titles are still required. Titles containing 2027, titles with unspecified years, and other-year titles remain separate. Unknown original dates remain unknown. Identical titles with different employer requisition URLs can be distinct openings.
