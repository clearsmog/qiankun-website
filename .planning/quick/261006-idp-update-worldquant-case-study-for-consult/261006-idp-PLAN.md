---
quick_id: 261006-idp
slug: update-worldquant-case-study-for-consult
date: 2026-10-06
---

# Update WorldQuant case study for consultant status

Reframe `docs/projects/wq-alpha-research.md` and its card in `docs/projects/index.md` around the
BRAIN research-consultant role (Sep 2026) and the current 14-alpha ACTIVE book (12 US, 2 Asia).

## Tasks

1. Hero metrics, intro and og description: consultant role, 14 ACTIVE, best 10-year-IS Sharpe 2.91, Gold kept as history.
2. ACTIVE book: Sharpe bars and table relabelled by region/theme; alpha IDs removed; US (5-yr IS) vs Asia (10-yr IS) marked.
3. Remove published signal expressions (consultant confidentiality, PROD-correlation exposure); add one-line rationale.
4. New sections: five-step research approach, three qualitative findings, research-platform bullets for a non-technical reader.
5. Project card description and meta updated to match.
6. Verify: `npm run docs:build`, render check of charts, table and card in a browser; grep for leftover IDs/expressions.
