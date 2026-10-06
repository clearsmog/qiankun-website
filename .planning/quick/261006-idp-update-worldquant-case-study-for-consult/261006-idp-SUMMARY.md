---
quick_id: 261006-idp
status: complete
date: 2026-10-06
---

# Summary: Update WorldQuant case study for consultant status

Executed directly in the session that drafted the copy (no planner/executor spawn: the edits were
already written and reviewed by the owner before this task was recorded).

- Case study and project card rewritten for the consultant role and the 14-alpha US + Asia book.
- Alpha IDs, field names and FASTEXPR expressions removed from the page; a sentence explains why.
- Charts: all US bars neutral grey, Asian bars green; theme donut moved to full width with shares in %.
- Verified: `npm run docs:build` passes; Sharpe chart, donut, metrics cards and table render correctly
  in Chrome against the local preview; repo-wide grep finds no alpha IDs or expressions in `docs/`.
- Note: earlier commits in git history still contain the withdrawn expressions.
