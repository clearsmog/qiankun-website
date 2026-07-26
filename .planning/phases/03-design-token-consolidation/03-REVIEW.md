---
phase: 03-design-token-consolidation
reviewed: 2026-07-26T21:12:40Z
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
  warning: 0
  info: 6
  total: 6
status: issues_found
---

# Phase 03: Code Review Report (Iteration 3 — final fix re-review)

**Reviewed:** 2026-07-26T21:12:40Z
**Depth:** standard
**Files Reviewed:** 16
**Status:** issues_found (Info only — no Critical or Warning findings)

## Summary

All three warnings from iteration 2 were independently re-verified against the current source (not assumed correct from the commit descriptions) and are correctly and completely fixed:

- **WR-01** (`config.js` `assertBrandInSync`, fixed in `4799167`): line 26 now runs `css.replace(/\/\*[\s\S]*?\*\//g, "")` before the `:root` block is matched, stripping block comments. Re-ran the exact decoy-comment scenario from the iteration-2 finding by hand: with the comment stripped first, `rootBlock.match(/--vp-c-brand-1:\s*(#[0-9a-fA-F]{3,8})/)` can only match the real (uncommented) declaration, so a stale/decoy comment ahead of the live value can no longer produce a false-positive pass. Confirmed fixed.
- **WR-02** (`EHistogram.vue`, fixed in `31825e4`): `color` prop default is now `undefined` (line 12); `barColor = props.color || t.brand` (line 26) is resolved *inside* the `option` computed, which depends on `tick` (bumped by the `isDark` watcher, `watch(isDark, ..., { flush: 'post' })`, lines 18-21) and re-reads `themeTokens()` on every evaluation. Traced both branches: an explicit `:color="..."` prop still wins (short-circuit `||` evaluates `props.color` first, unconditionally on every recompute), and the fallback correctly re-derives `t.brand` on each theme flip since it's read inside the reactive computed rather than captured once at prop-default time. No other code in the file reads the old static default — `props.color` isn't referenced anywhere else, and `barColor` is used consistently at both the bar gradient (line ~96) and the markArea band (line ~108). The only production usage (`docs/projects/cisco-equity-valuation.md:346-353`) doesn't pass `color`, so it exercises exactly the fallback path that was fixed. Confirmed fixed.
- **WR-03** (`ProjectChart.vue`, fixed in `2be9d93`): the static module-scope `palette` array is gone; `paletteFor()` (lines 73-75) reads `brand()` — which itself calls `getComputedStyle` live — and is invoked fresh inside `paintDatasets(raw)` (line 78) on every call. `paintDatasets` is only called from `build()` (line 124), and `build()` runs on mount (line 193), on the `isDark` watch (`flush: 'post'`, line 201), and on the deep `labels`/`datasets`/`type` watch (lines 203-207). So `paletteFor()` is genuinely re-invoked — not captured once — on every theme change. Confirmed fixed.

Both Info items carried from iteration 2 were independently re-verified and still stand, as detailed in IN-01 and IN-02 below. While tracing the mutation pattern behind IN-01, an analogous instance was found in a file iteration 2's findings didn't cover (`EForest.vue`, IN-03) — noted for completeness since it's the same anti-pattern family within this review's file scope. A few additional pre-existing Info-level items surfaced during this pass (IN-04 through IN-06); none relate to the brand-token consolidation work this phase delivers, and none rise above Info per the "pre-existing/out-of-scope issues recorded as info" instruction.

No Critical or Warning findings remain. Nothing below blocks shipping this phase.

## Info

### IN-01 (carried from iteration 2, still present): `EFootball.vue`'s `optionFinal` mutates the array cached inside `option`'s computed result

**File:** `docs/.vitepress/theme/components/viz/EFootball.vue:117-143`
**Issue:** `optionFinal` does `const o = { ...option.value }` (line 118) — a shallow spread, so `o.series` is the *same array reference* as `option.value.series`, not a copy. It then does `o.series.push({...})` (lines 121-141) to append the market markLine series. Because `option` is a Vue `computed`, its cached return value (including that `series` array) persists across re-evaluations of `optionFinal` as long as `option`'s own dependencies (`tick`, `props.ranges`) haven't changed. `optionFinal` has its own independent dependency on `props.market`/`marketLabel`/`unit` (read directly at lines 129 and 138). If any of those props ever change without `option` also invalidating (e.g. a future interactive control that updates `market` reactively), each `optionFinal` re-evaluation pushes another scatter series onto the same underlying array, and duplicate market-line series accumulate indefinitely.
Verified this does not currently manifest: the only production usage (`docs/projects/cisco-equity-valuation.md:267`) passes `:market="120.16"` as a static literal, so `market` never changes independently of `option`'s own deps after mount — but the underlying impurity (mutating a cached computed's return value from a sibling computed) is a real, reachable bug pattern, not just a style nit, which is why it's still worth recording rather than dropping.
**Fix:**
```js
const optionFinal = computed(() => {
  const o = { ...option.value, series: [...option.value.series] } // clone the array too
  const t = themeTokens()
  o.series.push({ /* ... */ })
  return o
})
```

### IN-02 (carried from iteration 2, still present): `custom.css` raw brand-RGB literals not covered by the build-time sync assertion

**File:** `docs/.vitepress/theme/custom.css:429, 433, 486, 491`
**Issue:** `assertBrandInSync()` in `config.js` only validates `--vp-c-brand-1`'s hex value against `tokens.js`. It does not — and structurally cannot, as currently written — catch the raw `rgba(...)` brand-colour literals embedded elsewhere in the same file: `::selection` (`rgba(0, 113, 227, 0.2)` light / `rgba(41, 151, 255, 0.3)` dark) and `.custom-block.tip` (`rgba(0, 113, 227, 0.06)` light / `rgba(41, 151, 255, 0.1)` dark). These are currently correctly in sync with the hex values (0,113,227 = `#0071e3`; 41,151,255 = `#2997ff`), so there's no active drift today — but a future rebrand that only updates `--vp-c-brand-1` (exactly the scenario `assertBrandInSync` exists to guard against) would silently leave these four literals stale, and the build would still pass.
**Fix:** Either derive these from `var(--vp-c-brand-1)` via `color-mix()` where browser support allows, or extend the comment at the top of `custom.css`/near `assertBrandInSync` to explicitly flag these four literals as a third, unchecked copy that must be updated by hand alongside the two locations the assertion does check.

### IN-03 (new this iteration): `EForest.vue`'s `optionWithZero` mutates the object returned by `option`'s computed cache — same anti-pattern family as IN-01

**File:** `docs/.vitepress/theme/components/viz/EForest.vue:119-128`
**Issue:** `const o = option.value` (line 120, not even a shallow spread) followed by `o.series[0].markLine = {...}` (lines 121-126) writes directly into the object cached by the `option` computed rather than into a copy. Here the mutation happens to be idempotent — it overwrites the same `markLine` property with an equivalent value on every evaluation rather than pushing/growing an array like IN-01 — so it doesn't currently produce an observable rendering bug. It is nonetheless the same violation of computed purity: `option.value` is not actually the object `option`'s own definition describes once `optionWithZero` has run at least once, which would surprise any future consumer or test that reads `option.value` directly.
**Fix:**
```js
const optionWithZero = computed(() => {
  const o = { ...option.value, series: [...option.value.series] }
  o.series[0] = { ...o.series[0], markLine: { /* ... */ } }
  return o
})
```

### IN-04 (new this iteration, pre-existing code): `VizEChart.vue` — dead reactive state and no-op watcher

**File:** `docs/.vitepress/theme/components/viz/VizEChart.vue:17, 30-36, 42`
**Issue:** `const ready = shallowRef(true)` (line 17) is never set to `false` anywhere in the file, so `v-if="ready"` (line 42) is always true — the ref adds indirection without ever changing template behaviour. Separately, `watch(() => props.option, () => { /* keep reactive */ }, { deep: true })` (lines 30-36) has an empty callback body; the comment implies it does something to preserve reactivity, but a no-op watcher has no effect — `:option="option"` passed to `<VChart>` is already reactive without it, and this watcher only adds an unnecessary deep traversal of a potentially large ECharts option object on every change. Confirmed via `git log` that this phase's touch to this file (`fe534ae`, "convert remaining eleven theme triggers to isDark watchers") only added lines 25-28; both dead blocks predate the phase and are unrelated to the brand-token work.
**Fix:** Remove both — drop the `ready` ref and the `v-if="ready"` guard, and delete the no-op `watch` block entirely.

### IN-05 (new this iteration, pre-existing pattern): hex + alpha-suffix string concatenation is fragile against non-hex custom colours

**File:** `docs/.vitepress/theme/components/viz/EBar.vue:101`, `ECombo.vue:86`, `EGroupBar.vue:73`, `ProjectChart.vue:90, 102, 106`, `EHistogram.vue` (barColor usage), and similar
**Issue:** Several components build translucent fills by string-concatenating a hex-alpha suffix onto a colour, e.g. `color + '99'` or `barColor + '66'`. This assumes `color` — which can come from `t.palette`/`t.brand` (both guaranteed 6-digit hex) but can also come from an author-supplied `item.color`/`ds.color` prop — is always a bare 6-digit hex string. If a content author ever passes a named CSS colour (`"red"`), an `rgb()`/`rgba()` string, or a 3-digit hex, the concatenation produces an invalid CSS colour (`"red99"`, `"rgba(255,0,0,1)66"`) that ECharts/Chart.js will silently fail to parse, typically falling back to a default or transparent fill rather than erroring visibly. Pre-existing across the whole viz kit, not introduced by this phase's brand-token consolidation; no current content passes non-hex custom colours, so recording as Info per the pre-existing/out-of-scope guidance.
**Fix:** Not required for this phase. If addressed later, prefer `hexToRgba()` (already exported from `echarts-setup.js` and used correctly elsewhere, e.g. `EBar.vue:122`, `EScorePath.vue:106-107`) over string concatenation, since it already fails safe.

### IN-06 (new this iteration): `assertBrandInSync` matches the first `--vp-c-brand-1` declaration in `:root`, not the cascade-winning last one

**File:** `docs/.vitepress/config.js:27-28`
**Issue:** `rootBlock.match(/--vp-c-brand-1:\s*(#[0-9a-fA-F]{3,8})/)` uses a non-global `.match()`, which returns the *first* occurrence of the custom property inside the `:root` block. CSS custom properties follow normal cascade rules — if `:root` ever contained two `--vp-c-brand-1` declarations (e.g. left behind mid-edit), the browser applies the *last* one, but the assertion would validate against the *first*, potentially passing the build while the site actually renders a different, unvalidated brand colour. Not currently triggered — `custom.css` declares `--vp-c-brand-1` exactly once inside `:root` (line 13) today.
**Fix:** If worth guarding against, capture all matches and use the last one: `[...rootBlock.matchAll(/--vp-c-brand-1:\s*(#[0-9a-fA-F]{3,8})/g)].pop()?.[1]`.

---

_Reviewed: 2026-07-26T21:12:40Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
