---
phase: 03-design-token-consolidation
reviewed: 2026-07-26T20:47:01Z
depth: standard
files_reviewed: 16
files_reviewed_list:
  - docs/.vitepress/config.js
  - docs/.vitepress/theme/components/ProjectChart.vue
  - docs/.vitepress/theme/components/viz/EBar.vue
  - docs/.vitepress/theme/components/viz/echarts-setup.js
  - docs/.vitepress/theme/components/viz/ECombo.vue
  - docs/.vitepress/theme/components/viz/EDonut.vue
  - docs/.vitepress/theme/components/viz/EFootball.vue
  - docs/.vitepress/theme/components/viz/EForest.vue
  - docs/.vitepress/theme/components/viz/EGroupBar.vue
  - docs/.vitepress/theme/components/viz/EHeatmap.vue
  - docs/.vitepress/theme/components/viz/EHistogram.vue
  - docs/.vitepress/theme/components/viz/ELine.vue
  - docs/.vitepress/theme/components/viz/EScorePath.vue
  - docs/.vitepress/theme/components/viz/VizEChart.vue
  - docs/.vitepress/theme/custom.css
  - docs/.vitepress/theme/tokens.js
findings:
  critical: 0
  warning: 3
  info: 3
  total: 6
status: issues_found
---

# Phase 3: Code Review Report

**Reviewed:** 2026-07-26T20:47:01Z
**Depth:** standard
**Files Reviewed:** 16
**Status:** issues_found

## Summary

This phase (a) introduced `docs/.vitepress/theme/tokens.js` as a Node-side brand-colour constant and pointed `config.js`'s PWA manifest at it, and (b) replaced every chart component's `MutationObserver` on `<html class>` with `useData().isDark` + `watch(..., { flush: 'post' })`.

The core mechanical change is sound: I verified `grep`-wide that no `MutationObserver` remains anywhere under `docs/.vitepress/theme/`, and every one of the 12 chart components (`EBar`, `ECombo`, `EDonut`, `EFootball`, `EForest`, `EGroupBar`, `EHeatmap`, `EHistogram`, `ELine`, `EScorePath`, `VizEChart`, `ProjectChart`) consistently uses `watch(isDark, ..., { flush: 'post' })`, which is the correct choice — VitePress's internal `useDark()` composable flips the `.dark` class via a default-flush (`pre`) watcher, so a `post`-flush watcher in these components is guaranteed to read `getComputedStyle` **after** the class (and therefore the CSS custom properties) have updated. No stale-CSS-var race was found. Watcher cleanup is handled implicitly and correctly by Vue's `<script setup>` scoping (no leaked observers).

However, the "single source of truth" goal was only partially achieved, and a couple of hardcoded brand-blue literals survived the sweep in files this phase specifically touched. None of these rise to functionality-breaking severity — this is a portfolio site with no user input, no auth, and no data persistence — but they are exactly the class of defect this phase set out to eliminate, and left unaddressed they undermine confidence that the consolidation is complete. I also found some pre-existing dead code adjacent to (and now more visible because of) the areas this phase modified.

## Warnings

### WR-01: Hardcoded brand-blue rgba literal bypasses the token/theme system (EScorePath)

**File:** `docs/.vitepress/theme/components/viz/EScorePath.vue:98-108`
**Issue:** The `areaStyle.color` gradient stops are hardcoded to `'rgba(0,113,227,0.28)'` / `'rgba(0,113,227,0.02)'` — the *light-mode* brand blue (`#0071e3`) — even though this same computed function already derives `const t = themeTokens()` and uses `t.brand` elsewhere in the file (line 92: `levelColor[...] || t.brand`). In dark mode `--vp-c-brand-1` becomes `#2997ff` (custom.css:66), so this area fill will silently stay Apple-blue-light under the dark theme instead of tracking the token, which is precisely the drift this phase's dark-mode/token work aimed to remove.
**Fix:**
```js
areaStyle: {
  color: {
    type: 'linear',
    x: 0, y: 0, x2: 0, y2: 1,
    colorStops: [
      { offset: 0, color: t.brand + '48' },   // ~0x28 alpha as hex suffix
      { offset: 1, color: t.brand + '05' },
    ],
  },
},
```

### WR-02: Hardcoded brand-blue rgba literal in emphasis shadow (EBar)

**File:** `docs/.vitepress/theme/components/viz/EBar.vue:121-123`
**Issue:** `emphasis.itemStyle.shadowColor: 'rgba(0,113,227,0.35)'` is hardcoded to the light-mode brand colour instead of deriving from `t.brand`, which is already in scope in this computed (`const t = themeTokens()` at line 28). Same dark-mode drift as WR-01.
**Fix:**
```js
emphasis: {
  itemStyle: { shadowBlur: 12, shadowColor: hexToRgba(t.brand, 0.35) },
},
```
(or simplest: build the rgba string from `t.brand` with a small hex→rgba helper, matching the pattern already used elsewhere in this file for `color + '99'`/`color + 'cc'` alpha suffixes.)

### WR-03: Brand colour still has two manually-synced sources of truth

**File:** `docs/.vitepress/theme/tokens.js:1-6`, `docs/.vitepress/theme/custom.css:11-13`
**Issue:** `tokens.js`'s own comment admits the real situation: "Canonical browser-side definition: custom.css... Keep this value in sync with custom.css by hand." That means the brand hex still lives in two files, and nothing (no test, no build-time check, no shared JSON/YAML the two files both read) enforces the sync — it only exists because a comment asks a future editor to remember. If `--vp-c-brand-1` in `custom.css` is ever changed for a rebrand (a highly plausible edit for a portfolio site), `tokens.js` will silently retain the stale value, and the PWA manifest `theme_color` / anything else Node-side that imports `brand` will diverge from the site's actual visual brand with no error or warning.
**Fix:** Either (a) generate `custom.css`'s `--vp-c-brand-1` from `tokens.js` at build time (e.g. inject it via a small PostCSS/Vite plugin or a `:root { --vp-c-brand-1: ${brand}; }` snippet appended in `config.js`'s vite config), or (b) add a cheap CI/build assertion that greps both files and fails the build if the hex values disagree. As shipped, this is a documented manual process, not an enforced single source of truth.

## Info

### IN-01: Dead deep watcher in VizEChart.vue

**File:** `docs/.vitepress/theme/components/viz/VizEChart.vue:30-36`
**Issue:** This watcher predates the phase and is unrelated to the `isDark` conversion, but it sits directly beside the new watcher this phase added and is worth flagging while the file is under review:
```js
watch(
  () => props.option,
  () => {
    // keep reactive
  },
  { deep: true },
)
```
The callback body is empty — it does nothing. `vue-echarts` already watches its own `option` prop internally (`node_modules/vue-echarts/dist/index.js:553`, `watch(() => props.option, (option) => {...})`) and calls `setOption` itself, so this watcher is redundant even in intent, and its `deep: true` walks the entire ECharts option tree (axes, series, formatters) on every option change for no observable effect.
**Fix:** Delete the watcher entirely; it serves no purpose.

### IN-02: Always-true `ready` flag makes `v-if="ready"` a dead conditional

**File:** `docs/.vitepress/theme/components/viz/VizEChart.vue:17,42`
**Issue:** `const ready = shallowRef(true)` is declared and never reassigned anywhere in the component, so `<VChart v-if="ready" ...>` always renders — the conditional exists but has no controlling logic. Pre-existing, not introduced by this phase, but visible in a file this phase edited.
**Fix:** Either remove `ready`/`v-if="ready"` entirely, or wire it to something meaningful (e.g. gate first paint until `ensureEcharts()` resolves) if that was the original intent.

### IN-03: `baseTooltip(t)` ignores its theme-token parameter

**File:** `docs/.vitepress/theme/components/viz/echarts-setup.js:91-99`
**Issue:** Every call site passes the current theme tokens (`baseTooltip(t)`), implying the tooltip is meant to react to theme, but the function body never reads `t` — it returns a fixed dark background (`rgba(29,29,31,0.92)`) and fixed light text (`#f5f5f7`) regardless of light/dark mode. This may well be an intentional "always-dark tooltip" design choice (common for chart tooltips), but the unused parameter is misleading about what the function actually does and should either be removed or the design intent documented.
**Fix:** If the always-dark tooltip is intentional, drop the unused `t` parameter (`export function baseTooltip()`) and update call sites, or add a one-line comment noting the tooltip deliberately doesn't follow the page theme.

---

_Reviewed: 2026-07-26T20:47:01Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
