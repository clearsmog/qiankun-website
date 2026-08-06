---
phase: 04-position-design
plan: 04
subsystem: ui
tags: [vitepress, vue, echarts, design-tokens, viz-panel, provenance, reduced-motion, dead-code]

# Dependency graph
requires:
  - phase: 04-position-design
    provides: "04-02's design-token vocabulary in custom.css (:root spacing/type/weight/line-height/radius tokens, --color-negative/--color-positive)"
provides:
  - "VizPanel source/asOf props rendering a guarded .viz-panel__foot provenance caption beneath the exhibit body — backward compatible (empty defaults render nothing)"
  - "themeTokens().negative / .positive semantic colour slots resolved from --color-negative/--color-positive with literal fallbacks, SSR-safe"
  - "prefersReducedMotion() named export from echarts-setup.js, typeof-window guarded, for plan 04-06's animationDuration gating"
  - "Brand-only two-stop VizPanel hairline (purple/green stops deleted)"
  - "VizPanel, VizGrid, HeroMetrics fully token-resolved (zero absolute size/weight/spacing/radius literals)"
  - "MetricCards.vue, ProjectChart.vue, ProcessSteps.vue deleted with their theme/index.js registrations"
affects: [04-06, 04-07, 04-08, 04-09]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Semantic chart colours: markdown writes color: 'negative'/'positive' (from 04-06 on), resolved inside component computed() via t.negative/t.positive — never a CSS var() string into ECharts canvas options"
    - "Reduced-motion gating for canvas charts: animationDuration: prefersReducedMotion() ? 0 : <existing>, read at option-evaluation time"

key-files:
  created: []
  modified:
    - docs/.vitepress/theme/components/viz/echarts-setup.js
    - docs/.vitepress/theme/components/viz/VizPanel.vue
    - docs/.vitepress/theme/components/viz/VizGrid.vue
    - docs/.vitepress/theme/components/viz/HeroMetrics.vue
    - docs/.vitepress/theme/index.js
  deleted:
    - docs/.vitepress/theme/components/MetricCards.vue
    - docs/.vitepress/theme/components/ProjectChart.vue
    - docs/.vitepress/theme/components/ProcessSteps.vue

key-decisions:
  - "No requirement marked complete: all five declared IDs (EXH-02, EXH-04, DES-03, DES-07, DES-12) are shared with plans 04-05 through 04-09 which have no SUMMARY yet — the shared-ID gate blocks marking until the last declaring plan finishes"
  - "6px gaps (badge margin-bottom, subtitle margin-top) rounded UP to --space-2 (8px), not down to --space-1 (4px): equidistant on the scale, resolved by UI-SPEC's usage table which reserves --space-1 for icon gaps/badge internals and assigns compact text gaps to --space-2"
  - "Metric-tile radius moved 16px -> 18px onto --radius-card — minimal extension of UI-SPEC's card-radius unification, per plan instruction"
  - "chart.js dependency now has zero source consumers (ProjectChart.vue was the only importer) but stays in package.json — the uninstall is not in this plan's scope; flagged for a later plan"

patterns-established:
  - "Provenance caption contract: <VizPanel source=\"...\" as-of=\"...\"> renders 'date · Source: name' as a divider-topped caption row inside the panel body — the shape 28 call sites adopt in 04-07/08/09"

requirements-completed: []

coverage:
  - id: D1
    description: "themeTokens() exposes negative/positive semantic slots; prefersReducedMotion() exported and SSR-safe; sequential palette untouched"
    requirement: "DES-07 (chart-theme half), DES-09 precondition for 04-06"
    verification:
      - kind: automated_ui
        ref: "grep gates (slot shapes = 1 each, export = 1, typeof window guard = 1, palette 10 entries) + Node-only import asserting prefersReducedMotion() === false and t.negative/t.positive fall back to #ff3b30/#34c759 with no DOM; npm run docs:build exits 0"
        status: pass
    human_judgment: false
  - id: D2
    description: "VizPanel carries a backward-compatible provenance caption (source/asOf props, guarded footer, tokenized .viz-panel__foot rule)"
    requirement: "EXH-02, EXH-04 (structural enablement)"
    verification:
      - kind: automated_ui
        ref: "grep gates — source:/asOf: props with default '' (1 each), viz-panel__foot count 2 (template + style), 4 v-if guards in the footer block; build exits 0"
        status: pass
      - kind: manual
        ref: "Render check (caption subordinate beneath chart with test props; no caption on unmodified exhibits) deferred to the Phase-5 Chrome walkthrough"
        status: deferred
    human_judgment: true
  - id: D3
    description: "Exhibit hairline is brand-derived only — two-stop brand gradient, no purple/green stop"
    requirement: "DES-12 (exhibit half)"
    verification:
      - kind: automated_ui
        ref: "grep -ci 'af52de|34c759' VizPanel.vue = 0; color-mix(in srgb, var(--vp-c-brand-1) 40% present in ::before rule = 1; build exits 0"
        status: pass
      - kind: manual
        ref: "Visual check (single blue fading to transparent on every exhibit) deferred to the Phase-5 Chrome walkthrough"
        status: deferred
    human_judgment: true
  - id: D4
    description: "Every size, weight, line-height, spacing and card-radius value in VizPanel, VizGrid, HeroMetrics resolves to a custom.css token"
    requirement: "DES-03 (component-layer extension)"
    verification:
      - kind: automated_ui
        ref: "literal-scan grep across all three files (font-size/weight/line-height/padding/margin/gap/border-radius with px/rem/clamp/bare numbers, border-radius:50% excluded) = 0; build exits 0"
        status: pass
      - kind: manual
        ref: "Visual regression (three distinct title/badge/sub levels, metric tiles aligned, no clipped values) deferred to the Phase-5 Chrome walkthrough"
        status: deferred
    human_judgment: true
  - id: D5
    description: "MetricCards, ProjectChart, ProcessSteps deleted from repository and registry with zero usages before and after"
    requirement: "DES-12 (housekeeping), UI-SPEC Deletions"
    verification:
      - kind: automated_ui
        ref: "pre-deletion grep across docs/ in both tag-case forms = 0 (and 0 after); three files absent; MetricCards|ProjectChart|ProcessSteps refs in index.js = 0; imports 25->22 and app.component 18->15 (each exactly -3); font-weight:650 in components 2->0; build exits 0"
        status: pass
      - kind: manual
        ref: "Browser-console check for 'failed to resolve component' warnings on the two case-study routes deferred to the Phase-5 Chrome walkthrough"
        status: deferred
    human_judgment: true

# Metrics
duration: 8min
completed: 2026-08-06
status: complete
---

# Phase 4 Plan 4: Exhibit Chrome & Component Layer Summary

**VizPanel provenance props (source/as-of caption row), semantic negative/positive chart-colour slots plus an SSR-guarded prefersReducedMotion() helper, a brand-only exhibit hairline, full token migration across the three layout components, and deletion of the three dead components with their registrations.**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-08-06T13:44:27Z
- **Completed:** 2026-08-06T13:52:30Z (approx)
- **Tasks:** 3
- **Files modified:** 8 (5 edited, 3 deleted)

## Accomplishments
- Extended `themeTokens()` with `negative: cssVar('--color-negative', '#ff3b30')` and `positive: cssVar('--color-positive', '#34c759')` — placed after `bgSoft`, textually separate from the sequential palette (which keeps all 10 entries, including the coincidentally-identical green)
- Added `prefersReducedMotion()` as a named export, `typeof window` guarded so the build-time server render returns `false` instead of throwing — verified by a Node-only import with no DOM
- Gave `VizPanel` `source`/`asOf` props (both `{ type: String, default: '' }`) and a `v-if`-guarded `<footer class="viz-panel__foot">` after the slot: as-of date, conditional `·` separator, `Source:`-prefixed source — exhibits without the props render byte-identically to before
- Replaced the three-stop brand/purple/green hairline with `linear-gradient(90deg, var(--vp-c-brand-1), color-mix(in srgb, var(--vp-c-brand-1) 40%, transparent))`
- Tokenized every spacing/size/weight/line-height/radius literal in `VizPanel.vue`, `VizGrid.vue`, `HeroMetrics.vue` (head/body padding onto `--space-3`, badge/subtitle onto `--font-size-caption`, title onto `--font-size-lead`, all weights onto `--font-weight-semibold`, metric value onto `--font-size-h3`) — the literal-scan grep across all three files returns zero
- Deleted `MetricCards.vue`, `ProjectChart.vue`, `ProcessSteps.vue` and both halves of each registration in `theme/index.js` (imports 25→22, `app.component` calls 18→15), after re-confirming zero usages across `docs/` in both tag-case forms

## Task Commits

Each task was committed atomically:

1. **Task 1: Chart theme layer — semantic slots + reduced-motion helper** - `d5b168d` (feat)
2. **Task 2: VizPanel provenance, hairline fix, token migration** - `aa15289` (feat)
3. **Task 3: Delete three dead components** - `2827cbd` (feat)

**Plan metadata:** commit pending (this SUMMARY + STATE.md update)

## Files Created/Modified
- `docs/.vitepress/theme/components/viz/echarts-setup.js` - negative/positive slots in themeTokens(); prefersReducedMotion() export with non-reactivity comment
- `docs/.vitepress/theme/components/viz/VizPanel.vue` - source/asOf props, guarded footer, .viz-panel__foot rule, brand-only hairline, full tokenization
- `docs/.vitepress/theme/components/viz/VizGrid.vue` - gap and margin tokenized (--space-3, --space-1)
- `docs/.vitepress/theme/components/viz/HeroMetrics.vue` - grid/tile spacing, radius (16→18 onto --radius-card), value/label/hint typography tokenized; weight 800→semibold
- `docs/.vitepress/theme/index.js` - three imports and three registrations removed, order convention preserved
- `docs/.vitepress/theme/components/{MetricCards,ProjectChart,ProcessSteps}.vue` - deleted

## Plan-Required Records

**Metric-tile radius 16px → 18px:** the HeroMetrics tiles previously sat 2px below the card radius; they now share `--radius-card` (18px) with `VizPanel` and `.VPFeature`. This is a minimal extension of UI-SPEC's card-radius unification (which named only `.project-card`'s 14px as the outlier), applied per the plan's explicit instruction.

**`prefersReducedMotion()` non-reactivity (documented limitation, not a defect):** the helper is read at option-evaluation time, not live-reactive — an OS-level preference change mid-session does not update a chart until its next re-render. Acceptable because entrance animations play once per mount; continuous CSS transitions are covered live by the universal `reduce` media block from plan 04-02. A one-line comment in `echarts-setup.js` records this for reviewers.

## Decisions Made
- Marked **no** requirement complete: EXH-02, EXH-04, DES-03, DES-07 and DES-12 are all also declared by plans 04-05 through 04-09, none of which has a SUMMARY yet. This plan is the structural enabler; the last declaring plan closes each ID.
- 6px gaps rounded up to `--space-2` (8px) rather than down to `--space-1` (4px): equidistant candidates, resolved by UI-SPEC's usage table (`--space-1` is for icon gaps and badge *internal* padding; compact text gaps belong to `--space-2`).
- Metric value `line-height: 1.1` → `--line-height-heading` (1.2) and hint `line-height: 1.35` → `--line-height-body` (1.5) — nearest declared steps; both are the semantically correct token for their role (display value vs. reading text).
- `chart.js` left in `package.json` despite now having zero source consumers — dependency removal is outside this plan's task list; flagged for a later housekeeping plan rather than deviating.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None. All three `npm run docs:build` gates passed first try (37s, 37s, 51s).

## Deferred to Phase-5 Chrome Walkthrough (human-check portions of verifies)

- Exhibit hairlines render as a single blue fading to transparent (no purple/green stop) on `/projects/cisco-equity-valuation`
- No caption row appears under any exhibit before markdown supplies the props; a temporary `source="Test" as-of="1 Jan 2026"` renders as a subordinate line beneath the chart, not in the header
- Panel titles, badges and subtitles remain three visually distinct levels; Snapshot metric tiles align with no clipped values
- No Vue "failed to resolve component" console warning on `/projects/cisco-equity-valuation` and `/projects/global-equity-portfolio`

## Known Stubs

None — no placeholder content, empty data values, or unwired components introduced. The new props intentionally render nothing until plans 04-07/08/09 supply them from markdown; that is the designed backward-compatibility contract, not a stub.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Plan 04-06 can now gate all ten chart components' `animationDuration` on `prefersReducedMotion()` and resolve `'negative'`/`'positive'` item colours via `t.negative`/`t.positive`.
- Plans 04-07/08/09 can stamp all 28 `VizPanel` call sites with `source`/`as-of` using the caption contract established here.
- No blockers.

## Self-Check: PASSED

- FOUND: commit d5b168d
- FOUND: commit aa15289
- FOUND: commit 2827cbd
- CONFIRMED: MetricCards.vue, ProjectChart.vue, ProcessSteps.vue deleted
- FOUND: prefersReducedMotion export + negative/positive slots in echarts-setup.js
- FOUND: viz-panel__foot (template + style) in VizPanel.vue
- CONFIRMED: literal-scan grep = 0 across VizPanel/VizGrid/HeroMetrics
- CONFIRMED: npm run docs:build exits 0

---
*Phase: 04-position-design*
*Completed: 2026-08-06*
