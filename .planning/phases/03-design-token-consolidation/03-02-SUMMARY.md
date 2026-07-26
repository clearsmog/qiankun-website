---
phase: 03-design-token-consolidation
plan: 02
subsystem: ui
tags: [vitepress, vue3, echarts, chart.js, theme-tokens, reactivity]

# Dependency graph
requires:
  - phase: 03-design-token-consolidation (plan 01)
    provides: "tokens.js brand export; proven MutationObserver -> watch(isDark, ..., { flush: 'post' }) recipe, browser-verified on EBar.vue"
provides:
  - "All twelve chart components (nine tick-nudge, VizEChart's resize, ProjectChart's build) driven by useData().isDark with { flush: 'post' } watchers — zero DOM class observers remain under docs/.vitepress/theme"
  - "Brand hex reduced to two cross-referenced literals across all of docs/.vitepress: custom.css (canonical) and tokens.js (Node-side copy) — echarts-setup.js, ProjectChart.vue, and EHistogram.vue now import the token"
affects: [03-03-design-token-consolidation, 04-restyle-typography]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Uniform isDark-watcher conversion applied verbatim across nine near-identical Shape-A components, one Shape-B (resize trigger, behaviour untouched), and one Shape-C (build() trigger, with top-level onBeforeUnmount teardown lifted out of onMounted)"
    - "Brand token import aliased (brandToken) in ProjectChart.vue to avoid shadowing its own local brand() getComputedStyle helper of the same name"

key-files:
  created: []
  modified:
    - docs/.vitepress/theme/components/viz/EDonut.vue
    - docs/.vitepress/theme/components/viz/ELine.vue
    - docs/.vitepress/theme/components/viz/ECombo.vue
    - docs/.vitepress/theme/components/viz/EForest.vue
    - docs/.vitepress/theme/components/viz/EFootball.vue
    - docs/.vitepress/theme/components/viz/EGroupBar.vue
    - docs/.vitepress/theme/components/viz/EHeatmap.vue
    - docs/.vitepress/theme/components/viz/EHistogram.vue
    - docs/.vitepress/theme/components/viz/EScorePath.vue
    - docs/.vitepress/theme/components/viz/VizEChart.vue
    - docs/.vitepress/theme/components/ProjectChart.vue
    - docs/.vitepress/theme/components/viz/echarts-setup.js

key-decisions:
  - "ProjectChart.vue imports tokens.js's brand export under the local alias brandToken, because the file already defines a local brand() helper (a getComputedStyle reader) of the same name — a plain `import { brand }` would have shadowed it"
  - "requirements-completed left empty here as well, matching 03-01's precedent: DES-05 and DES-08 are declared across all three plans in this phase and 03-03 owns the final neutrality re-assertion step; marking either complete before that closes would misrepresent traceability"

patterns-established: []

requirements-completed: []  # See key-decisions — DES-05/DES-08 traceability closes at 03-03

coverage:
  - id: D1
    description: "Nine Shape-A chart components (EDonut, ELine, ECombo, EForest, EFootball, EGroupBar, EHeatmap, EHistogram, EScorePath) converted from MutationObserver to watch(isDark, () => tick.value++, { flush: 'post' }), reaction body unchanged"
    requirement: "DES-08"
    verification:
      - kind: unit
        ref: "grep -rc MutationObserver docs/.vitepress/theme --include='*.vue' == 0; grep -rc \"flush: 'post'\" docs/.vitepress/theme --include='*.vue' == 12"
        status: pass
    human_judgment: false
  - id: D2
    description: "VizEChart.vue's resize() trigger converted to watch(isDark, ..., { flush: 'post' }); chartRef.value?.resize?.() reaction left unchanged (vestigial but harmless, per RESEARCH.md Pitfall 2)"
    requirement: "DES-08"
    verification:
      - kind: unit
        ref: "grep -c 'resize?.()' docs/.vitepress/theme/components/viz/VizEChart.vue == 1; grep -c MutationObserver VizEChart.vue == 0"
        status: pass
    human_judgment: false
  - id: D3
    description: "ProjectChart.vue's build() trigger converted to watch(isDark, () => build(), { flush: 'post' }); onBeforeUnmount lifted to top level holding only chart?.destroy(), decoupled from the removed observer disconnect"
    requirement: "DES-08"
    verification:
      - kind: unit
        ref: "grep -rl onBeforeUnmount docs/.vitepress/theme --include='*.vue' == ProjectChart.vue only; grep -c 'chart?.destroy' ProjectChart.vue == 1"
        status: pass
    human_judgment: false
  - id: D4
    description: "Brand hex deduplicated to two cross-referenced literals: echarts-setup.js's cssVar fallback and palette[0], ProjectChart.vue's brand() fallback and palette[0], and EHistogram.vue's color prop default all now import brand from tokens.js"
    requirement: "DES-05"
    verification:
      - kind: unit
        ref: "grep -c 0071e3 on each of the three files == 0; summed grep -rc 0071e3 across docs/.vitepress (excl dist/cache) == 2"
        status: pass
    human_judgment: false
  - id: D5
    description: "Visual neutrality preserved: npm run docs:build exits 0, built manifest theme_color/background_color and built stylesheet --vp-c-brand-1 set unchanged from the 03-01 baseline; both non-brand palette hex sets unchanged; NotFound.vue gradient and Phase 1 deploy artifacts untouched"
    verification:
      - kind: unit
        ref: "npm run docs:build; node -e assert manifest.webmanifest theme_color === '#0071e3' && background_color === '#000000'; grep --vp-c-brand-1 in dist/assets/style.*.css == #0071e3 and #2997ff only"
        status: pass
    human_judgment: false

# Metrics
duration: ~25min
completed: 2026-07-26
status: complete
---

# Phase 3 Plan 2: Scale-out isDark conversion and brand-hex dedup finish Summary

**Applied the plan-03-01-proven `useData().isDark` + `watch(..., { flush: 'post' })` recipe to the remaining eleven chart components (zero `MutationObserver` left anywhere in `docs/.vitepress/theme`) and reduced the brand hex `#0071e3` to two cross-referenced literals across all of `docs/.vitepress`, with the built manifest and stylesheet proven byte-identical to baseline.**

## Performance

- **Duration:** ~25 min
- **Started:** 2026-07-26T20:13:00+01:00 (approx.)
- **Completed:** 2026-07-26T20:20:49Z
- **Tasks:** 2
- **Files modified:** 12 (9 Shape-A components, VizEChart.vue, ProjectChart.vue, echarts-setup.js; EHistogram.vue and ProjectChart.vue touched by both tasks)

## Accomplishments
- Nine Shape-A chart components (`EDonut`, `ELine`, `ECombo`, `EForest`, `EFootball`, `EGroupBar`, `EHeatmap`, `EHistogram`, `EScorePath`) converted from `MutationObserver` to `watch(isDark, () => tick.value++, { flush: 'post' })`, each file's own reaction body left byte-for-byte unchanged
- `VizEChart.vue`'s trigger converted; its `chartRef.value?.resize?.()` reaction left exactly as-is (vestigial per RESEARCH.md, redesigning it was explicitly out of scope)
- `ProjectChart.vue`'s trigger converted to `watch(isDark, () => build(), { flush: 'post' })`; `onBeforeUnmount` lifted out of its former nested position inside `onMounted` to top level, now holding only `chart?.destroy()` — the observer's `disconnect()` that used to share that teardown is gone, the Chart.js teardown is not
- Zero `MutationObserver` occurrences remain anywhere under `docs/.vitepress/theme`; `flush: 'post'` count is exactly 12; `useData` import count is exactly 13 (twelve converted components + pre-existing `JsonLd.vue`)
- Brand hex `#0071e3` eliminated from `echarts-setup.js` (cssVar fallback + `palette[0]`), `ProjectChart.vue` (`brand()` helper fallback + `palette[0]`), and `EHistogram.vue` (`color` prop default) — all three now import `brand` from `tokens.js`
- Summed `#0071e3` count across all `.vue`/`.js`/`.css` under `docs/.vitepress` (excluding `dist`/`cache`) is exactly 2 — `custom.css`'s canonical declaration and `tokens.js`'s Node-side copy
- Both non-brand palette hex sets (the ten-colour ECharts palette's other nine entries, the eight-colour Chart.js palette's other seven entries) verified unchanged, confirming the substitutions were spelling changes only
- `npm run docs:build` exits 0 (twice, once per task); built `manifest.webmanifest` still declares `theme_color: '#0071e3'`, `background_color: '#000000'`; built stylesheet's `--vp-c-brand-1` set is exactly `#0071e3` and `#2997ff`, no third value
- Phase 1's parked work confirmed intact: `G-4PF046MSJJ` count 2 in `config.js`, `amplify.yml` and `deploy.sh` both present
- `NotFound.vue`'s `#667eea` gradient (Phase 4's scope) untouched

## Task Commits

Each task was committed atomically:

1. **Task 1: Convert the remaining eleven theme triggers to isDark with post-flush watchers** - `fe534ae` (feat)
2. **Task 2: Reduce the brand hex to two cross-referenced literals and re-assert visual neutrality** - `17fff7f` (feat)

**Plan metadata:** (recorded below, this commit)

## Files Created/Modified
- `docs/.vitepress/theme/components/viz/EDonut.vue` - MutationObserver -> watch(isDark, ..., { flush: 'post' })
- `docs/.vitepress/theme/components/viz/ELine.vue` - same conversion
- `docs/.vitepress/theme/components/viz/ECombo.vue` - same conversion
- `docs/.vitepress/theme/components/viz/EForest.vue` - same conversion
- `docs/.vitepress/theme/components/viz/EFootball.vue` - same conversion
- `docs/.vitepress/theme/components/viz/EGroupBar.vue` - same conversion
- `docs/.vitepress/theme/components/viz/EHeatmap.vue` - same conversion
- `docs/.vitepress/theme/components/viz/EHistogram.vue` - trigger conversion (Task 1) + color prop default now imports brand token (Task 2)
- `docs/.vitepress/theme/components/viz/EScorePath.vue` - same conversion
- `docs/.vitepress/theme/components/viz/VizEChart.vue` - trigger conversion; resize() reaction preserved unchanged
- `docs/.vitepress/theme/components/ProjectChart.vue` - trigger conversion + onBeforeUnmount lifted to top level (Task 1); brand() fallback and palette[0] now import brand token as brandToken (Task 2)
- `docs/.vitepress/theme/components/viz/echarts-setup.js` - cssVar brand fallback and palette[0] now import brand token from tokens.js

## Decisions Made
- Imported `tokens.js`'s `brand` export under the alias `brandToken` in `ProjectChart.vue` because that file already defines a local `brand()` getComputedStyle helper — a same-name default import would have shadowed it silently.
- Left `requirements-completed` empty, matching 03-01's precedent: DES-05/DES-08 traceability closes only when 03-03's final neutrality re-assertion completes the phase.

## Deviations from Plan

None - plan executed exactly as written. All eleven components got the mandatory `{ flush: 'post' }` option; no bare `watch(isDark, cb)` was introduced. The brand-hex substitutions touched exactly the five occurrences the plan named, no more, no less.

## Issues Encountered
None. Every count-based gate in both tasks' `<verify>` blocks matched the plan's stated expected values on the first attempt.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Plan 03-03 is cleared to perform its final neutrality re-assertion and close out DES-05/DES-08 in REQUIREMENTS.md.
- Two findings carried forward per the plan's `<output>` instruction:
  1. `ProjectChart.vue` is registered globally in `theme/index.js` but referenced by zero markdown files — dead code. Deleting it belongs to a later cleanup audit, not this token-consolidation phase.
  2. `custom.css` expresses the brand colour a second time as an rgba soft variant that no `#0071e3` hex grep will catch — worth a look before Phase 4's restyle assumes the brand colour has exactly one CSS expression.
- No blockers identified for 03-03.

---
*Phase: 03-design-token-consolidation*
*Completed: 2026-07-26*

## Self-Check: PASSED

All twelve modified source files and this SUMMARY confirmed present on disk. Both task commits
(`fe534ae`, `17fff7f`) confirmed present in `git log --oneline --all`.
