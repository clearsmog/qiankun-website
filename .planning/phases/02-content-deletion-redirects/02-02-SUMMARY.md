---
phase: 02-content-deletion-redirects
plan: 02
subsystem: ui
tags: [vitepress, vue3, homepage, dead-code-removal]

requires:
  - phase: 02-content-deletion-redirects (plan 01)
    provides: page/nav/sidebar deletions and _redirects that this plan's link choices assume are in place
provides:
  - Homepage features row reduced from a stale five-section trio to a Projects/About/Contact trio, every link resolving to a surviving page
  - Homepage's only client-side data dependency (Recent Posts block + blog-posts.data.js loader) removed
  - Six dead SvgAreaChart/SvgHBars/SvgDonut/SvgForest/SvgFootballField/SvgScorePath components and their theme registrations removed
affects: [phase-03-token-consolidation, phase-04-position-design]

tech-stack:
  added: []
  patterns: []

key-files:
  created: []
  modified:
    - docs/index.md
    - docs/.vitepress/theme/index.js
  deleted:
    - docs/.vitepress/data/blog-posts.data.js
    - docs/.vitepress/theme/components/viz/SvgAreaChart.vue
    - docs/.vitepress/theme/components/viz/SvgHBars.vue
    - docs/.vitepress/theme/components/viz/SvgDonut.vue
    - docs/.vitepress/theme/components/viz/SvgForest.vue
    - docs/.vitepress/theme/components/viz/SvgFootballField.vue
    - docs/.vitepress/theme/components/viz/SvgScorePath.vue

key-decisions:
  - "Feature card trio is Projects (unchanged) / About / Contact — the UI-SPEC's named safe default, since every link resolves to a page a hiring manager needs and none touches a deleted route"
  - "About card icon uses a person/profile outline; Contact card icon uses an envelope outline, both sharing the existing two-stop #667eea to #ec4899 gradient with distinct ids (about-grad, contact-grad) to avoid DOM id collisions with the surviving proj-grad"
  - "File deletion and registration removal for the six Svg components landed in one commit, per the plan's atomicity requirement — a partial removal breaks the Vite build with an unresolvable module error"

patterns-established: []

requirements-completed:
  - PRUNE-05
  - PRUNE-09

coverage:
  - id: D1
    description: "Homepage features row rebuilt to exactly three cards (Projects, About, Contact), each with a distinct gradient id and a link to a surviving page"
    requirement: "PRUNE-05"
    verification:
      - kind: other
        ref: "grep -c '^    title: ' docs/index.md == 3; grep -c '^    link: ' docs/index.md == 3; grep -cE 'ai-workflow|/photos' docs/index.md == 0"
        status: pass
      - kind: other
        ref: "grep -o 'id=\"[a-z-]*grad\"' docs/index.md | sort -u | wc -l equals total match count (3 == 3)"
        status: pass
      - kind: other
        ref: "npm run docs:build exits 0"
        status: pass
    human_judgment: false
  - id: D2
    description: "Recent Posts block (script setup, markup, orphaned styles) and its blog-posts.data.js loader removed with no replacement section"
    requirement: "PRUNE-05"
    verification:
      - kind: other
        ref: "grep -c 'script setup' docs/index.md == 0; grep -c '<style>' docs/index.md == 0; test ! -e docs/.vitepress/data/blog-posts.data.js"
        status: pass
      - kind: other
        ref: "npm run docs:build exits 0 (proves no consumer of the deleted loader survived)"
        status: pass
    human_judgment: false
  - id: D3
    description: "Six retired Svg chart components deleted along with their imports and app.component() registrations in theme/index.js"
    requirement: "PRUNE-09"
    verification:
      - kind: other
        ref: "grep -c 'app\\.component(' docs/.vitepress/theme/index.js == 18; grep -c '^import' == 25; ls docs/.vitepress/theme/components/viz/*.vue | wc -l == 15"
        status: pass
      - kind: other
        ref: "npm run docs:build exits 0"
        status: pass
    human_judgment: false

duration: 20min
completed: 2026-07-26
status: complete
---

# Phase 02 Plan 02: Homepage Feature Trio and Dead Component Removal Summary

**Homepage features row rebuilt to Projects/About/Contact, Recent Posts block and its data loader deleted, six dead Svg chart components removed with their theme registrations.**

## Performance

- **Duration:** 20 min
- **Started:** 2026-07-26T11:48:00Z
- **Completed:** 2026-07-26T12:08:00Z
- **Tasks:** 2 completed
- **Files modified:** 2 (docs/index.md, docs/.vitepress/theme/index.js), 7 deleted

## Accomplishments
- Homepage `features:` array replaced its stale "Technology"/"Writing" cards with About and Contact cards, all three now linking to pages that survive this milestone (`/projects/`, `/about`, `/contact`)
- Removed the homepage's `<script setup>` data dependency, the Recent Posts markup, and its six orphaned CSS rules; deleted `docs/.vitepress/data/blog-posts.data.js` since the block was its only consumer
- Deleted six unused `Svg*` chart components (`SvgAreaChart`, `SvgHBars`, `SvgDonut`, `SvgForest`, `SvgFootballField`, `SvgScorePath`) and their imports/registrations in `docs/.vitepress/theme/index.js` in a single atomic commit

## Task Commits

Each task was committed atomically:

1. **Task 1: Rebuild the homepage features trio and delete the Recent Posts block and its loader** - `66c9288` (feat)
2. **Task 2: Delete the six retired chart components with their imports and registrations** - `bc7b5d3` (chore)

**Plan metadata:** committed separately after this summary (see final commit below)

## Files Created/Modified
- `docs/index.md` - features array trimmed to Projects/About/Contact trio (with new about-grad/contact-grad icons), script-setup + Recent Posts markup + `<style>` block removed entirely
- `docs/.vitepress/theme/index.js` - six imports and six `app.component()` registrations removed, plus the now-meaningless "Legacy custom SVG" section comment
- `docs/.vitepress/data/blog-posts.data.js` - deleted (dead after Recent Posts removal)
- `docs/.vitepress/theme/components/viz/SvgAreaChart.vue`, `SvgHBars.vue`, `SvgDonut.vue`, `SvgForest.vue`, `SvgFootballField.vue`, `SvgScorePath.vue` - deleted (zero tag usages site-wide, confirmed by RESEARCH.md scan)

## Decisions Made
- Feature trio chosen per UI-SPEC's named safe default: Projects (unchanged), About, Contact — each resolves to a page useful to a hiring manager and none touches a route this milestone deletes.
- About and Contact icons use simple Feather/Lucide-style outlines (person, envelope) matching the existing stroke/gradient contract, with unique gradient ids (`about-grad`, `contact-grad`) to avoid SVG `<defs>` id collisions with the surviving `proj-grad`.
- Card `details` copy is intentionally provisional per the UI-SPEC — Phase 4 owns final homepage prose.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Homepage and theme registration surface are now clean of dead content ahead of Phase 3 (token consolidation) and Phase 4 (positioning/design rewrite). No blockers. Plan 02-03 (remaining phase work) can proceed independently — this plan touched only `docs/index.md`, `docs/.vitepress/data/blog-posts.data.js`, and `docs/.vitepress/theme/index.js` plus the six deleted Svg component files, none of which any other in-flight plan in this phase depends on.

---
*Phase: 02-content-deletion-redirects*
*Completed: 2026-07-26*

## Self-Check: PASSED

All modified files exist, both task commits (66c9288, bc7b5d3) are present in git log, and all
deleted files (blog-posts.data.js, six Svg component files) are confirmed absent from the working
tree.
