---
schema_version: 1
open_count: 2
waived_count: 0
fixed_count: 0
total_count: 2
last_updated: 2026-08-06T14:56:45.643Z
---

# Broken Windows Ledger

> Cross-phase defect register. `/gsd-ship` blocks while `open_count > 0`.
> Waive with `gsd-tools windows waive <id> "<reason>"` (reason required).
> Mark fixed with `gsd-tools windows fixed <id>`.

| id | phase | kind | file | line | description | status | reason | recorded_at | resolved_at |
|----|-------|------|------|------|-------------|--------|--------|-------------|-------------|
| 1 | 04 | unrun-verify | docs/projects/cisco-equity-valuation.md |  | 04-07 human-check halves deferred to Phase-5 Chrome walkthrough: 13 exhibit captions, axis labels at 375px, dark-mode re-theme sweep, tile hint wrap | open |  | 2026-08-06T14:25:38.500Z |  |
| 2 | 04 | unrun-verify | docs/projects |  | 04-10 visual sweep halves deferred to Phase-5 Chrome walkthrough: ten-page side-by-side consistency, 375px walk incl. 28-exhibit B1 canvas inspection, dark-mode toggle at both widths, reduced-motion emulation on/off | open |  | 2026-08-06T14:56:45.643Z |  |

````json
[
  {
    "id": 1,
    "kind": "unrun-verify",
    "phase": "04",
    "file": "docs/projects/cisco-equity-valuation.md",
    "line": null,
    "description": "04-07 human-check halves deferred to Phase-5 Chrome walkthrough: 13 exhibit captions, axis labels at 375px, dark-mode re-theme sweep, tile hint wrap",
    "status": "open",
    "reason": "",
    "recorded_at": "2026-08-06T14:25:38.500Z",
    "resolved_at": null
  },
  {
    "id": 2,
    "kind": "unrun-verify",
    "phase": "04",
    "file": "docs/projects",
    "line": null,
    "description": "04-10 visual sweep halves deferred to Phase-5 Chrome walkthrough: ten-page side-by-side consistency, 375px walk incl. 28-exhibit B1 canvas inspection, dark-mode toggle at both widths, reduced-motion emulation on/off",
    "status": "open",
    "reason": "",
    "recorded_at": "2026-08-06T14:56:45.643Z",
    "resolved_at": null
  }
]
````
