# 2027 Mechanical Engineering Internships

This repository tracks mechanical engineering internship openings from career pages, Greenhouse job boards, and Lever job boards.

- :gear: Sources: Greenhouse, Lever, company careers
- :calendar: Updated daily via GitHub Actions
- :mag: Search terms are defined in scripts/src/config.ts
- :briefcase: Company targets are defined in scripts/src/companies.ts

## How it works

1. scripts/src/scraper.ts fetches jobs from target companies and job boards.
2. scripts/src/generate.ts removes duplicates, sorts by posting age, and updates this README.
3. GitHub Actions runs on a daily schedule and on manual dispatch.

## Run locally

```bash
cd scripts
bun install
bun run generate
```

## Internship Listings

<!-- JOB_TABLE_START -->
| Company | Category | Position | Location | Source | Posted | Age | Link |
|---|---|---|---|---|---|---|---|
| <a href="https://careers.rivian.com/careers-home/jobs"><strong>Rivian</strong></a> | mechanical_design | UIUC Research Park Intern - Mechanical Modeling | Champaign, Illinois | Rivian Careers API | 2026-07-28 | 3d | <a href="https://us-careers-rivian.icims.com/jobs/32574/login"><img src="https://i.imgur.com/JpkfjIq.png" alt="Apply" width="70"/></a> |
| <a href="https://careers.rivian.com/careers-home/jobs"><strong>Rivian</strong></a> | robotics_controls | UIUC Research Park Intern - Computational Methods Development | Champaign, Illinois | Rivian Careers API | 2026-07-22 | 9d | <a href="https://us-careers-rivian.icims.com/jobs/32340/login"><img src="https://i.imgur.com/JpkfjIq.png" alt="Apply" width="70"/></a> |
| <a href="https://careers.rivian.com/careers-home/jobs"><strong>Rivian</strong></a> | mechanical_design | UIUC Research Park Intern - ML AI Motor Controls Algorithm | Champaign, Illinois | Rivian Careers API | 2026-07-22 | 9d | <a href="https://us-careers-rivian.icims.com/jobs/32355/login"><img src="https://i.imgur.com/JpkfjIq.png" alt="Apply" width="70"/></a> |
| <a href="https://www.spacex.com/careers"><strong>SpaceX</strong></a> | automotive | Government Program Development Manager (International) | Washington, DC | SpaceX Jobs JSON | n/a | n/a | <a href="https://www.spacex.com/careers/jobs"><img src="https://i.imgur.com/JpkfjIq.png" alt="Apply" width="70"/></a> |
<!-- JOB_TABLE_END -->
