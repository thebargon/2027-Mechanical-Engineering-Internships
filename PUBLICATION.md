# Before publishing

The application tracker was moved to ignored `private/APPLICATIONS.md`; the public working tree contains only an empty example. Ignoring or deleting a file does not remove prior Git versions.

**Outstanding:** commit `069ba05` contains personal application statuses in `APPLICATIONS.md`. Do not change this repository's visibility until you have chosen how to handle that history. A clean public repository created from reviewed current files avoids publishing the old history; rewriting an existing remote requires coordination with other clones. No history rewrite or visibility change was performed by these improvements.

Review the current files and history for personal information and credentials before publication. Automated pattern scans are limited and cannot guarantee that a repository is free of sensitive information. If a credential was ever committed, rotate it before removing it from history.

A local scan of 1,044 reachable commit diffs on September 4, 2026 found no matches for the checked GitHub-token, AWS-access-key, private-key-header, or Discord-webhook patterns. This limited scan does not clear the known application-history issue or replace manual review.

The MIT license covers this project's code. Verify the provenance and permission for any inherited third-party code before release; employer content is not relicensed by this repository.

The searchable page is generated at `docs/index.html` and works locally without accounts or external assets. No website has been deployed. When ready, publish only that generated page through your chosen static host; keep the private folder and Git history out of the site bundle.

After publication, enable the daily update workflow on the default branch and verify its first successful run. Check `data/sources.md` for actual coverage rather than counting every company in the target registry.
