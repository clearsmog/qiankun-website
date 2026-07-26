# Phase 3: Design Token Consolidation - Context

**Gathered:** 2026-07-26
**Status:** Ready for planning
**Mode:** Smart discuss (autonomous) — infrastructure/refactor phase, no grey-area design questions. One scope decision taken to the user.

<domain>
## Phase Boundary

The brand colour and theme-reactivity logic each have exactly one source of truth, so the Phase 4 restyle edits one clean variable set instead of untangling duplicated literals while introducing new type-scale tokens.

In scope: brand-colour deduplication, `tokens.js` creation for Node-side values, replacing every theme `MutationObserver` with `useData().isDark`.

Out of scope: introducing the type scale itself (Phase 4, DES-03), font loading (Phase 4, DES-01/02), any visual restyle, any palette change. **This phase must be visually neutral — the rendered site should look identical before and after.**

</domain>

<decisions>
## Implementation Decisions

### Scope Correction — Observer Count
- **DES-08's text says "Both" theme `MutationObserver`s. There are twelve.** The requirement text preserves an undercount from an earlier audit. The user was shown the discrepancy and chose to **convert all twelve**, because the phase goal ("theme-reactivity logic [has] exactly one source of truth") is categorically not met by converting two and leaving ten identical copies of the same anti-pattern.
- The twelve, all confirmed identical in shape — `new MutationObserver` on `document.documentElement` with `attributeFilter: ['class']`, existing solely to re-theme a chart:
  `viz/VizEChart.vue`, `viz/EBar.vue`, `viz/EDonut.vue`, `viz/ELine.vue`, `viz/ECombo.vue`, `viz/EForest.vue`, `viz/EFootball.vue`, `viz/EGroupBar.vue`, `viz/EHeatmap.vue`, `viz/EHistogram.vue`, `viz/EScorePath.vue`, and `components/ProjectChart.vue`.
- DES-08's wording in REQUIREMENTS.md is left as-is; the user declined the amendment option. The discrepancy is recorded here instead.

### Brand Colour Deduplication (DES-05)
- Canonical definition stays `--vp-c-brand-1` in `docs/.vitepress/theme/custom.css` (`#0071e3` light, `#2997ff` dark). CSS is the source of truth for anything the browser renders.
- **`#0071e3` currently appears in four places, not two** — scan verified 2026-07-26:
  1. `custom.css:12` — `--vp-c-brand-1` (canonical, keep)
  2. `config.js:46` — PWA `theme_color` (Node needs this before the DOM exists)
  3. `echarts-setup.js:68` — the fallback arg in `cssVar('--vp-c-brand-1', '#0071e3')`
  4. `echarts-setup.js` — `palette[0]`, the first chart series colour
- `docs/.vitepress/theme/tokens.js` is NEW and holds **only** values Node needs before the DOM renders. Per DES-05 that is the PWA manifest colour. `config.js` imports from it rather than hard-coding.
- The `echarts-setup.js` fallbacks are a genuine judgement call, flagged for the planner: a `cssVar()` fallback only fires during SSR or before styles resolve. Importing `tokens.js` there is defensible; so is leaving the fallbacks as literals since they are last-resort defaults, not the operative value. Either is acceptable **provided the grep for `#0071e3` resolves to one canonical definition plus explicitly-justified fallbacks** — a silent duplicate is not.

### Theme Reactivity Conversion
- Replace each observer with VitePress's `useData().isDark` and a `watch` on it. The reaction each component performs stays exactly what it is today — `tick.value++` in `EBar` and its siblings, `chartRef.value?.resize?.()` in `VizEChart`, `build()` in `ProjectChart`. **This is a change of trigger, not of behaviour.**
- Delete the matching `onBeforeUnmount(() => obs?.disconnect())` cleanup with each observer — a `watch` inside `setup` unregisters itself.
- `themeTokens()` in `echarts-setup.js` reads live CSS custom properties via `getComputedStyle`. It stays as-is. **Timing is the real risk here:** `isDark` flipping is not necessarily the same tick as the DOM class flip and the resulting CSS-variable recomputation. If a chart re-reads tokens before the class lands, it re-themes with stale colours — which looks like the feature works until you watch closely. The planner must resolve whether `nextTick()` (or equivalent) is required and prove it, not assume it.
- `ProjectChart.vue` registers `onBeforeUnmount` *inside* `onMounted`. It works, but it is non-idiomatic; tidy it while converting since the surrounding lines are being edited anyway.

### Claude's Discretion
- Whether `echarts-setup.js` fallbacks import from `tokens.js` or stay literal (see above).
- `tokens.js` export shape (named vs default) and whether it also exports the dark-mode brand value.
- Commit granularity, provided each commit builds.

</decisions>

<code_context>
## Existing Code Insights

### Verified by scan (2026-07-26)
- `docs/.vitepress/theme/tokens.js` does **not** exist.
- `useData` is currently imported in exactly one file — `docs/.vitepress/theme/JsonLd.vue` — so the import pattern exists in-repo but is not yet used for theme reactivity anywhere.
- `config.js:46-47` carry `theme_color: "#0071e3"` and `background_color: "#000000"` for the PWA manifest.
- `custom.css` defines the brand set at `:root` (lines 8-15) and overrides it under `.dark` (lines 62-70).
- `NotFound.vue:102` uses a `#667eea → #764ba2 → #ec4899` gradient. This is **not** the brand colour — it is the old "Universe of Code" aesthetic and belongs to Phase 4's restyle. Do not touch it here.

### Files In Scope
- `docs/.vitepress/theme/tokens.js` — NEW
- `docs/.vitepress/config.js` — PWA manifest colour only. **The Google Analytics head tags in this file are still Phase 1 plan 01-03's work and must survive untouched.**
- `docs/.vitepress/theme/custom.css` — canonical brand definition, likely unchanged
- `docs/.vitepress/theme/components/viz/echarts-setup.js` — fallbacks and palette
- The twelve chart components listed above

### Established Patterns
- Chart components are `<script setup>`, no semicolons, 2-space indent, scoped styles.
- `themeTokens()` is the single shared accessor for chart colours; components call it inside a `computed`.

</code_context>

<specifics>
## Specific Ideas

- **This phase must be visually neutral.** The strongest available evidence is a build-output diff: build before and after, and confirm the rendered HTML/CSS is materially unchanged apart from the intended token indirection. A chart that silently stops re-theming would still pass a naive "build exits 0" check.
- Verifying "charts re-theme correctly on toggle" cannot be done by grep. It needs the dev server and an actual dark-mode toggle with a chart on screen — `/projects/cisco-equity-valuation` and `/projects/global-equity-portfolio` both carry several. Treat this as a browser-verified item.
- Success criterion 4 ("no duplicate re-renders or console warnings") implies watching the console during a toggle, not just after load.

</specifics>

<deferred>
## Deferred Ideas

- Type scale, weights, line-measure tokens — Phase 4 (DES-03).
- Self-hosted variable font, removing the Google Fonts import — Phase 4 (DES-01/02).
- The `NotFound.vue` gradient and the rest of the old aesthetic — Phase 4.
- RSS feed self-description still reads "Qiankun Blog — Thoughts on technology, development, and more"; contradicts the repositioning. Flagged during Phase 2, belongs to Phase 4.
- Phase 1's console-gated items remain outstanding (STATE.md → Deferred Verification).

</deferred>
