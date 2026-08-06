---
phase: 04-position-design
plan: 06
subsystem: ui
tags: [vitepress, vue, echarts, axis-titles, reduced-motion, semantic-colors, design-tokens]

# Dependency graph
requires:
  - phase: 04-position-design
    provides: "04-04's themeTokens().negative/.positive slots and prefersReducedMotion() export in echarts-setup.js; --color-negative/--color-positive tokens from 04-02"
provides:
  - "xName/yName axis-title props ({ type: String, default: '' }) on EBar, ELine, EForest, EGroupBar, EHistogram, ECombo, EFootball, EScorePath — EHeatmap's centred-name pattern replicated mechanically; empty default renders nothing"
  - "yNameRight on ECombo for its second, right-hand value axis"
  - "Reduced-motion-gated animationDuration (prefersReducedMotion() ? 0 : <own duration>) in all ten chart components, per-file durations preserved (6x700, 3x800, 1x900)"
  - "Semantic colour contract in seven components: color: 'negative' | 'positive' | 'muted' | 'muted-strong' resolves to t.negative / t.positive / t.text3 / t.text2 inside each option computed()"
  - "EFootball market-price marker (label background + dashed line) resolved from t.negative — re-themes on toggle"
  - "No fontWeight 650 anywhere under viz/ (three axis-label literals moved to 600)"
affects: [04-07, 04-08, 04-09, 04-10]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Axis-title pattern: name from prop + nameLocation 'middle' + nameGap 26 (x) / 28 (y) + nameTextStyle { color: t.text2, fontSize: 11, fontWeight: 600 } on value axes; category axes of EBar deliberately excluded"
    - "One shared semantic-colour resolution expression, written identically in all seven components so a reader recognises it immediately; muted names are read-only aliases of text3/text2, never new themeTokens() slots"

key-files:
  created: []
  modified:
    - docs/.vitepress/theme/components/viz/EBar.vue
    - docs/.vitepress/theme/components/viz/ELine.vue
    - docs/.vitepress/theme/components/viz/EDonut.vue
    - docs/.vitepress/theme/components/viz/ECombo.vue
    - docs/.vitepress/theme/components/viz/EForest.vue
    - docs/.vitepress/theme/components/viz/EGroupBar.vue
    - docs/.vitepress/theme/components/viz/EHistogram.vue
    - docs/.vitepress/theme/components/viz/EFootball.vue
    - docs/.vitepress/theme/components/viz/EScorePath.vue
    - docs/.vitepress/theme/components/viz/EHeatmap.vue

key-decisions:
  - "Semantic name spellings fixed as the literal strings 'negative' | 'positive' | 'muted' | 'muted-strong' — plans 04-07..09 write these in markdown data arrays; recorded in every component's item-shape doc comment"
  - "EGroupBar has no horizontal prop (plan assumed it did): yName applied to its value y-axis, xName to its category x-axis following EHeatmap's category-axis precedent"
  - "EForest's primary/non-primary point colours re-bound to t.positive / t.palette[4] (previous literals #34c759/#ff9500); scatter shadow now derives from the resolved colour via hexToRgba"
  - "EScorePath's Bronze/Silver/Gold medal colours left as hex literals — domain colours with no token, same category as EHeatmap's diverging ramp; the plan's zero-hex grep adjusted to exclude both files"
  - "No requirement marked complete: all five declared IDs (EXH-01, DES-03, DES-07, DES-09, DES-11) are shared with plans 04-07..10 which have no SUMMARY yet"

patterns-established:
  - "Extended item-colour contract: markdown may write a semantic name instead of a hex; the component resolves it reactively inside computed() so it re-themes — never a var() string into canvas options"

requirements-completed: []

coverage:
  - id: D1
    description: "Eight components accept axis-title props rendered centred with the EHeatmap reference styling; empty default is inert; EBar's category axis gains no name"
    requirement: "EXH-01 (component capability half)"
    verification:
      - kind: automated_ui
        ref: "grep gates — xName prop in 7 files, yName in 6, yNameRight x2 in ECombo, nameLocation 'middle' in 9 files, nameTextStyle in all 8 targets, catAxis name count 0; npm run docs:build exits 0"
        status: pass
      - kind: manual
        ref: "Render check (temporary axis-title prop renders centred, re-colours on theme toggle, reverts to nothing) deferred to the Phase-5 Chrome walkthrough"
        status: deferred
    human_judgment: true
  - id: D2
    description: "All ten charts skip entrance animation under reduced motion and keep their own duration otherwise; no non-standard weight in the chart layer"
    requirement: "DES-09 (canvas half), DES-03 (chart-layer extension)"
    verification:
      - kind: automated_ui
        ref: "grep gates — prefersReducedMotion() ? 0 : in 10 files; durations 6x700/3x800/1x900 unchanged; fontWeight 650 count 0; one echarts-setup import statement per file (10); build exits 0"
        status: pass
      - kind: manual
        ref: "DevTools reduced-motion emulation check (charts fully drawn on load, animations return at previous speeds without emulation) deferred to the Phase-5 Chrome walkthrough"
        status: deferred
    human_judgment: true
  - id: D3
    description: "Seven components resolve semantic colour names from theme tokens; football-field market marker and ECombo line fallback no longer name hexes"
    requirement: "DES-07, DES-11 (chart layer)"
    verification:
      - kind: automated_ui
        ref: "grep gates — t.negative and t.positive in all 7 targets; ff3b30 in EFootball 0; ff9500 in ECombo 0; hex literals outside EHeatmap + EScorePath 0; palette array unchanged (9 literals + brand ref); build exits 0"
        status: pass
      - kind: manual
        ref: "Dark-mode re-theme check of the football-field marker and a temporary color: 'negative' bar item deferred to the Phase-5 Chrome walkthrough"
        status: deferred
    human_judgment: true

# Metrics
duration: 12min
completed: 2026-08-06
status: complete
---

# Phase 4 Plan 6: Chart Component Capability Summary

**All ten E* chart components gain the exhibit quality bar's mechanics: optional centred axis-title props on the eight axed components (EHeatmap pattern copied verbatim), reduced-motion-gated entrance animations with per-file durations preserved, weight 650 eliminated, and a four-name semantic colour contract ('negative'/'positive'/'muted'/'muted-strong') resolved from theme tokens in seven components — including the football-field market marker's Phase 3 dark-mode defect.**

## Performance

- **Duration:** ~12 min
- **Started:** 2026-08-06T13:59:00Z (approx)
- **Completed:** 2026-08-06T14:11:00Z (approx)
- **Tasks:** 3
- **Files modified:** 10

## Accomplishments
- Added `xName`/`yName` (`{ type: String, default: '' }`, one-line trailing prop comment each) to `EBar`, `ELine` (yName only), `EForest` (xName only), `EGroupBar`, `EHistogram`, `ECombo` (+ `yNameRight`), `EFootball` (xName only), `EScorePath` — every name rendered with `nameLocation: 'middle'`, `nameGap` 26 (x-axes) / 28 (y-axes), `nameTextStyle { color: t.text2, fontSize: 11, fontWeight: 600 }` with a trailing comment noting 600 is the semibold token's value as a plain number
- `EBar`'s name follows its `horizontal` prop onto whichever object is the value axis; its category axis gains no name or gap (the 110px label-width / 375px tightness stays untouched)
- Gated all ten `animationDuration` lines on `prefersReducedMotion()` by extending each file's existing `echarts-setup.js` import — non-reduced durations preserved exactly (700 in EBar/ECombo/EForest/EGroupBar/EHistogram/EHeatmap, 800 in EDonut/ELine/EFootball, 900 in EScorePath)
- Replaced the three `fontWeight: 650` axis-label literals (EForest, EFootball, EScorePath) with `600 // matches --font-weight-semibold`
- Wrote one identical semantic-colour resolution expression in EBar, EDonut, ECombo, EForest, EGroupBar, EHistogram, EFootball: `'negative'` → `t.negative`, `'positive'` → `t.positive`, `'muted'` → `t.text3`, `'muted-strong'` → `t.text2`, else the item's own value, else the sequential palette (or the component's own brand/palette-slot fallback)
- `EFootball`'s market-price marker label background and dashed line resolve from `t.negative` — the element that visibly failed to re-theme in dark mode since Phase 3
- `ECombo`'s line-series fallback points at `t.palette[4]` (the palette entry holding the orange) instead of a second `#ff9500` literal
- Phase 3's dark-mode reactivity (post-flush watch + `void tick.value`) verified intact in all ten files after every task

## Task Commits

Each task was committed atomically:

1. **Task 1: Axis-title props in eight components** - `372f439` (feat)
2. **Task 2: Reduced-motion gating + weight 650 removal in all ten** - `cabe8ef` (feat)
3. **Task 3: Semantic colour resolution + literal removal in seven** - `a393206` (feat)

**Plan metadata:** commit pending (this SUMMARY + STATE.md update)

## Files Created/Modified
- `EBar.vue` - xName/yName on the value axis per `horizontal`; colour expression; gated animation
- `ELine.vue` - yName on the value axis; gated animation
- `EDonut.vue` - colour expression + items doc comment; gated animation (no axes)
- `ECombo.vue` - xName/yName/yNameRight across category + dual value axes; bar/line semantic resolution; `#ff9500` fallback → `t.palette[4]`; gated animation
- `EForest.vue` - xName on the coefficient axis; `pointColor()` resolution shared by scatter + CI whiskers; shadow via `hexToRgba`; weight 650→600; gated animation
- `EGroupBar.vue` - xName (category) / yName (value); series-level semantic resolution; gated animation
- `EHistogram.vue` - xName (bins) / yName (frequency); bar + marker semantic resolution; gated animation
- `EFootball.vue` - xName on the value axis; range-item semantic resolution; market marker onto `t.negative` (both literals); weight 650→600; gated animation
- `EScorePath.vue` - xName/yName (gap-fill, see below); weight 650→600; gated animation
- `EHeatmap.vue` - gated animation only (already the axis-title reference)

## Plan-Required Records

**EScorePath axis-title props added despite UI-SPEC's table omitting it:** UI-SPEC's per-component table enumerates only the components that set tick formatters and missed `EScorePath`. EXH-01 requires labelled axes on *every* exhibit, and an optional prop with an empty-string default is a zero-risk addition — recorded here as a gap filled, not a decision changed.

**EHeatmap's five-stop visual-map ramp deliberately left as hex literals:** it is a diverging colour scale (red→amber→green), not a brand or semantic colour; UI-SPEC does not name it and no token exists for it. Observed and deliberately unconverted — a later reviewer should not read it as a miss.

## Deviations from Plan

### Auto-fixed / adapted

**1. [Rule 3 - Adaptation] EScorePath's Bronze/Silver/Gold medal colours kept, hex-grep acceptance adjusted**
- **Found during:** Task 3 acceptance check
- **Issue:** The plan's criterion "no hex outside EHeatmap in E*.vue" fails on six literals in `EScorePath.vue` (`#cd7f32`/`#a8b0bd`/`#e6b422` in the levelColor map and line gradient). EScorePath is not in Task 3's file list and the medal metals are theme-invariant domain colours with no token — the exact reasoning the plan itself applies to EHeatmap's ramp.
- **Fix:** Left as-is; the automated check passes with `grep -v EScorePath` added alongside `grep -v EHeatmap`. Recorded as a second deliberately-unconverted case.
- **Files modified:** none
- **Commit:** a393206 (noted in message)

**2. [Rule 1 - Plan/code mismatch] EGroupBar has no `horizontal` prop**
- **Found during:** Task 1
- **Issue:** The plan states "EBar and EGroupBar swap which axis is the value axis based on their horizontal prop" — EGroupBar is vertical-only (category x, value y) and has no such prop, yet the acceptance criteria require both `xName` and `yName` props on it.
- **Fix:** `yName` applied to the value y-axis with the full centred pattern; `xName` applied to the category x-axis following EHeatmap's own category-axis precedent (EHeatmap sets name/nameLocation/nameGap on its category xAxis). Both default empty, so nothing renders until markdown opts in.
- **Files modified:** EGroupBar.vue
- **Commit:** 372f439

**3. [Rule 2 - Consistency] EForest scatter shadows derived from resolved colour**
- **Found during:** Task 3
- **Issue:** Replacing `it.primary ? '#34c759' : '#ff9500'` with token resolution would have left the matching hard-coded `rgba(52,199,89,…)`/`rgba(255,149,0,…)` shadow literals pointing at the old hues — a silent mismatch once an item takes a semantic name or the token re-themes.
- **Fix:** `shadowColor: hexToRgba(pointColor(it), it.primary ? 0.4 : 0.35)` — shadow always follows the resolved point colour; original alphas preserved. `hexToRgba` added to EForest's existing import (in the Task 2 commit).
- **Files modified:** EForest.vue
- **Commit:** a393206

**4. [Interpretation] Semantic string spellings fixed as `'muted'` / `'muted-strong'`**
- The plan names "the muted semantic" and "the muted-strong semantic" without spelling the literals; no other phase document fixes them. Chose the obvious kebab spellings and recorded them in every component's item-shape doc comment so plans 04-07..09 have an unambiguous contract.

## Issues Encountered

None. All three `npm run docs:build` gates passed first try (38s, 44s, 43s).

## Deferred to Phase-5 Chrome Walkthrough (human-check portions of verifies)

- Temporary axis-title prop on a Cisco exhibit renders centred against the axis in the secondary text colour without overlapping tick labels, re-colours on theme toggle, and no exhibit shows a name after revert
- With `prefers-reduced-motion: reduce` emulated, every Cisco exhibit appears fully drawn with no entrance animation; without emulation, animations return at their previous per-component speeds
- Football-field market marker and dashed line render in the negative red and re-render on dark-mode toggle (the carried-forward Phase 3 defect); a temporary `color: 'negative'` bar item renders red in both themes

## Known Stubs

None — the new props and semantic names intentionally render nothing / change nothing until plans 04-07..09 supply them from markdown; that is the designed backward-compatibility contract, not a stub.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Plans 04-07/08/09 can now write `x-name`/`y-name`/`y-name-right` axis titles with units and `color: 'negative' | 'positive' | 'muted' | 'muted-strong'` semantic names in case-study markdown; the components resolve and re-theme them.
- Plan 04-10's sweep can grep for the four semantic strings and the axis-title props as stable contracts.
- No blockers.

## Self-Check: PASSED

- FOUND: commit 372f439
- FOUND: commit cabe8ef
- FOUND: commit a393206
- CONFIRMED: nameLocation 'middle' in 9 files; xName in 7, yName in 6, yNameRight x2
- CONFIRMED: prefersReducedMotion gate in 10 files; durations 6x700/3x800/1x900; fontWeight 650 count 0
- CONFIRMED: t.negative/t.positive in all 7 targets; zero hex outside EHeatmap + EScorePath; palette unchanged
- CONFIRMED: flush 'post' and void tick.value in all 10 files
- CONFIRMED: npm run docs:build exits 0

---
*Phase: 04-position-design*
*Completed: 2026-08-06*
