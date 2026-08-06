---
phase: 04-position-design
plan: 05
subsystem: ui
tags: [vitepress, design-tokens, project-cards, copywriting, outcome-first, jargon-gloss]

# Dependency graph
requires:
  - phase: 04-position-design
    provides: "04-02's design-token vocabulary in custom.css (--space-N, --font-size-*, --font-weight-semibold, --line-height-*, --radius-card)"
provides:
  - "Site-wide Project Cards section in custom.css (.project-grid, .project-card + hover/dark-hover, .project-tag, .project-title, .project-desc, .project-meta) — fully tokenized, the only card styling source for the projects index"
  - "Projects index in the locked strength order (Global Equity, Cisco, WQ BRAIN, Board Diversity, UK Finance Pay) with outcome-first two-sentence blurbs, VaR/FCFF glossed, no mark or course code"
  - "Grid minmax floor at 260px — real headroom at 375px, one-column collapse below it"
affects: [04-08, 04-10, 04-12]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Card markup in markdown is hand-authored plain anchors styled only by custom.css classes — no nth-child or count-dependent rules, so inserting a new first card (planned 04-12 LNG SPA case study) is a single-block addition"

key-files:
  created: []
  modified:
    - docs/.vitepress/theme/custom.css
    - docs/projects/index.md
  deleted: []

key-decisions:
  - "No requirement marked complete: all five declared IDs (POS-05, POS-07, DES-06, DES-10, DES-12) are shared with plans 04-06 through 04-10 which have no SUMMARY yet — the shared-ID gate blocks marking until the last declaring plan finishes"
  - "Literal-scan gate interpreted by intent: the grep matches @font-face's font-weight: 200 900 variable-font range descriptor (pre-existing, count 1 before and after) — a descriptor, not a style rule, and custom properties are invalid inside @font-face, so it cannot be tokenized; the moved rules introduced zero new literals"
  - "Card-internal flex gap 10px rounded down to --space-2 (8px), the nearest token; meta margin-top 4px onto --space-1 exactly"
  - "VaR gloss and FCFF expansion written into the card blurbs (UI-SPEC's card-copy table carried them unglossed but its gloss table and the plan's acceptance gates require them on the index card) — the two-sentence template is preserved"

patterns-established:
  - "One card system: .project-card and .VPFeature both resolve border-radius to --radius-card (18px); any future card surface adopts the same token"

requirements-completed: []

coverage:
  - id: D1
    description: "Card styling lives in exactly one file — seven tokenized rules in custom.css's Project Cards section, page-local style block deleted, radius unified with .VPFeature, minmax floor 260px"
    requirement: "DES-06, DES-10, DES-12"
    verification:
      - kind: automated_ui
        ref: "grep gates — style> in index.md = 0; .project-card lines in custom.css = 4, .project-grid = 1, Project Cards banner = 1; minmax(260px, 1fr) = 1, minmax(300px = 0; sed extraction shows var(--radius-card) in both .project-card and .VPFeature; literal-scan = 1 (pre-edit baseline, @font-face descriptor only); cisco-equity-valuation.md style count unchanged at 3; npm run docs:build exits 0"
        status: pass
      - kind: manual
        ref: "375px/1440px render check (one column, fully styled, no edge-touching text, radius parity with homepage feature cards, dark mode) deferred to the Phase-5 Chrome walkthrough"
        status: deferred
    human_judgment: true
  - id: D2
    description: "Five cards in the locked order with outcome-first two-sentence blurbs, jargon glossed, no mark or course code, canonical Board Diversity title"
    requirement: "POS-05, POS-07"
    verification:
      - kind: automated_ui
        ref: "grep gates — five hrefs in exact locked order; project-card count = 5; mark/A band/CMSE1166/CMSE1162 = 0; 'Value-at-Risk (VaR' = 1 with inline expansion in the same sentence; 'free-cash-flow-to-firm' = 1; 'Board Gender Diversity and Corporate ESG' = 1; npm run docs:build exits 0 and all five routes exist under dist/projects/"
        status: pass
      - kind: manual
        ref: "Ten-second first-sentence scan and Cisco-blurb 375px fit deferred to the Phase-5 Chrome walkthrough"
        status: deferred
    human_judgment: true

# Metrics
duration: 8min
completed: 2026-08-06
status: complete
---

# Phase 4 Plan 5: Projects Index — Card Consolidation & Outcome-First Copy Summary

**Project-card styling moved from the page-local style block into a tokenized Project Cards section of custom.css (radius unified with feature cards, 260px grid floor), and the five index cards reordered to the locked strength order with outcome-first two-sentence blurbs, glossed jargon, and no academic marks.**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-08-06T13:52:00Z (approx)
- **Completed:** 2026-08-06T13:56:21Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Added a `/* ==================== Project Cards ==================== */` section to `custom.css` immediately after Feature Cards, carrying all seven rules from the deleted page-local block: `.project-grid`, `.project-card`, `.project-card:hover`, `.dark .project-card:hover`, `.project-tag`, `.project-title`, `.project-desc`, `.project-meta`
- Tokenized every moved value: radius 14px → `--radius-card` (now identical to `.VPFeature`), grid gap 20 → `--space-3`, block margin 24/40 → `--space-4`/`--space-5`, card padding 24 → `--space-4`, card gap 10 → `--space-2`, meta margin 4 → `--space-1`; tag/meta → `--font-size-caption`, title → `--font-size-lead`, desc → `--font-size-body`; weights 600/650 → `--font-weight-semibold`; line-heights 1.35/1.55 → `--line-height-heading`/`--line-height-body`. Hover box-shadows left as shadow geometry per plan
- Lowered the grid minimum column width 300px → 260px — at 375px (~327px usable) the old floor fit with zero headroom; the new one gives real margin and a clean one-column collapse
- Deleted the page-local `<style>` block from `docs/projects/index.md` in the same commit as the CSS addition — no intermediate unstyled state was committed
- Reordered the five cards to the locked order: Global Equity, Cisco, WorldQuant BRAIN, Board Diversity, UK Finance Pay — each `href` moved with its own card (T-04-15 gate confirms exact order)
- Replaced all five blurbs with UI-SPEC's outcome-first two-sentence template: each first sentence states what the work produced (a portfolio constructed, an overvaluation verdict, Gold tier reached, an association found and causality not found, a real-pay erosion shown), each second sentence states how
- Glossed Value-at-Risk inline on the Global Equity card and expanded FCFF as free-cash-flow-to-firm on the Cisco card; Monte Carlo and constrained optimizer deliberately left unglossed per UI-SPEC
- Dropped `Mark 73` from the Cisco meta line, keeping institution and date as provenance; no mark, "A band", or course code survives anywhere on the page

## Task Commits

Each task was committed atomically:

1. **Task 1: Move card styling into custom.css and unify with feature cards** - `55a7d3d` (feat)
2. **Task 2: Reorder cards and rewrite blurbs outcome-first** - `4264d00` (feat)

**Plan metadata:** commit pending (this SUMMARY + STATE.md update)

## Files Created/Modified
- `docs/.vitepress/theme/custom.css` - new Project Cards section (57 lines) after Feature Cards; fully tokenized, 260px minmax floor, `--radius-card`
- `docs/projects/index.md` - page-local style block deleted; five cards reordered and rewritten with new blurbs and meta lines; H1, intro, tags, and markup structure unchanged

## Plan-Required Records

**Cisco tail style block deliberately left page-local:** the `<style scoped>` block at the bottom of `docs/projects/cisco-equity-valuation.md` (`.brand-row`, `.logo-chip`) was NOT folded into `custom.css`. Its rules are genuinely page-specific, not general card styling — this is per the plan's explicit instruction and 04-PATTERNS' trap note, not a missed consolidation. Its style count is unchanged (3) before and after this plan.

**Future first-card insertion (04-12 heads-up honoured):** the card markup is five plain `<a class="project-card">` blocks inside `.project-grid` with no nth-child selectors, no count-dependent CSS, and no data-driven generation. Inserting the planned LNG SPA Real-Option Valuation card as a new first card is a single-block addition requiring no style changes.

## Decisions Made
- No requirement marked complete — POS-05/POS-07 are shared with 04-07/08/09 (per-page leads), DES-06/DES-10 with 04-10, DES-12 with 04-06 through 04-09; the last declaring plan closes each ID
- Card-internal 10px flex gap rounded down to `--space-2` (8px) — nearest token (2px away vs 6px to `--space-3`)
- VaR gloss and FCFF expansion added to the card blurbs relative to UI-SPEC's card-copy table text (see Deviations)

## Deviations from Plan

**1. [Plan-internal reconciliation] Glosses written into "verbatim" card copy**
- **Found during:** Task 2
- **Issue:** UI-SPEC's index-table card copy carries `Value-at-Risk (VaR)` unglossed and `FCFF` unexpanded, but the plan's action text, its acceptance criteria (`Value-at-Risk (VaR` with expansion in the same sentence; `free-cash-flow-to-firm` present), the must-have truths, and UI-SPEC's own gloss table all require both glossed on the index card
- **Fix:** inserted the gloss table's VaR parenthetical into the Global Equity blurb and expanded FCFF as `free-cash-flow-to-firm (FCFF)` in the Cisco blurb; everything else verbatim, two-sentence template intact
- **Files modified:** docs/projects/index.md
- **Commit:** 4264d00

**2. [Rule 3 - gate interpretation] Literal-scan acceptance gate returns 1, not 0**
- **Found during:** Task 1 pre-check
- **Issue:** the acceptance grep for size/weight/spacing literals matched `font-weight: 200 900` in the `@font-face` block — a variable-font weight-range *descriptor* present before this plan (pre-edit count already 1). Custom properties are invalid inside `@font-face`, so it cannot be tokenized
- **Fix:** gate applied by its stated intent ("the moved rules introduced no new literals"): post-edit count equals the pre-edit baseline of 1, and the single match is the pre-existing descriptor. Zero new literals introduced
- **Files modified:** none (no change needed)
- **Commit:** n/a

## Issues Encountered

None. Both `npm run docs:build` gates passed first try (37.7s, 36.8s).

## Deferred to Phase-5 Chrome Walkthrough (human-check portions of verifies)

- `/projects/` at 1440px and 375px: cards fully styled (bordered, rounded, padded, brand-blue tag), one column at 375px, no text touching a card edge, no horizontal scrollbar; repeated in dark mode
- Side-by-side radius parity between a project card and a homepage feature card
- Ten-second first-sentence scan: each of the five first sentences answers "what came out of this" without reading sentence two
- The longest blurb (Cisco) fits its card at 375px without pushing the meta line out of view

## Known Stubs

None — no placeholder content, empty data values, or unwired components introduced.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- 04-08 can set the Board Diversity page's frontmatter and H1 to the canonical title the index card now carries ("Board Gender Diversity and Corporate ESG")
- The Project Cards section is the single styling source any future card (including 04-12's planned LNG SPA first card) inherits with no CSS change
- No blockers.

## Self-Check: PASSED

- FOUND: commit 55a7d3d
- FOUND: commit 4264d00
- CONFIRMED: no `<style>` block in docs/projects/index.md; Project Cards section (7 rules) in custom.css
- CONFIRMED: minmax(260px, 1fr) present, minmax(300px absent; both card systems resolve to var(--radius-card)
- CONFIRMED: five hrefs in locked order; mark/course-code grep = 0; VaR gloss and free-cash-flow-to-firm present
- CONFIRMED: npm run docs:build exits 0 twice; all five routes in dist/projects/

---
*Phase: 04-position-design*
*Completed: 2026-08-06*
