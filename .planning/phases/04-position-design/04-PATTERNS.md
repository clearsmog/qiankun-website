# Phase 4: Position & Design — Pattern Map

**Mapped:** 2026-07-27
**Files analyzed:** ~26 (1 new asset, 1 replaced asset, 6 theme-layer files, 3 deletions, 10 content files)
**Analogs found:** 26 / 26 (all files already exist in the codebase or have a direct sibling analog — this phase is entirely modification, no new component types)

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `docs/public/fonts/source-sans-3-variable.woff2` | asset (font) | file-I/O (static asset) | `docs/public/logo.svg`, `docs/public/og-image.svg` | role-match (first font under `public/`, but `public/` layout precedent exists) |
| `docs/public/og-image.png` | asset (image) | file-I/O (static asset) | `docs/public/og-image.svg` (being replaced) | exact (same slot, format swap) |
| `docs/.vitepress/theme/custom.css` | config/style | transform (CSS tokens) | itself (edit in place) | exact |
| `docs/.vitepress/config.js` | config | request-response (build-time head/meta) | itself (edit in place) | exact |
| `docs/.vitepress/theme/index.js` | provider (component registration) | event-driven (Vue app bootstrap) | itself (edit in place) | exact |
| `docs/.vitepress/theme/components/viz/VizPanel.vue` | component | request-response (props → render) | itself; secondary analog `EHeatmap.vue` for prop-doc/naming convention | exact |
| `docs/.vitepress/theme/components/viz/echarts-setup.js` | utility | transform (theme tokens → chart option fragments) | itself (edit in place) | exact |
| `EBar.vue`, `EGroupBar.vue`, `EHistogram.vue`, `EForest.vue`, `EFootball.vue`, `ELine.vue`, `ECombo.vue` (axis-title + reduced-motion) | component (chart) | transform (data → ECharts option) | `EHeatmap.vue` (already has `xName`/`yName`) | exact |
| `EDonut.vue`, `EScorePath.vue` (reduced-motion only, no axis change) | component (chart) | transform | any of the above ten (shared `animationDuration` pattern) | exact |
| `MetricCards.vue`, `ProjectChart.vue`, `ProcessSteps.vue` (deleted) | component | n/a (removal) | — | deletion, no analog needed |
| `docs/index.md` | content (page, hero+features) | CRUD (static content) | itself; `.VPFeature` icon block for SVG stroke pattern | exact |
| `docs/about.md`, `docs/contact.md` | content (prose page) | CRUD | itself | exact |
| `docs/projects/index.md` | content (index/listing page) | CRUD | itself (card grid); target style consolidation into `custom.css` | exact, but see trap below |
| 5 case studies under `docs/projects/` | content (case study page) | CRUD | `global-equity-portfolio.md` (cleanest existing `<script setup>` + `HeroMetrics`/`VizPanel` usage) | exact |

---

## Pattern Assignments

### `docs/.vitepress/theme/custom.css`

**Analog:** itself — extend the existing `:root` / `.dark` block structure, do not introduce a new file or a new sectioning convention.

**Section-comment convention** (lines 6, 9, 64, 93, 117, 154, 192...):
```css
/* ==================== Section Name ==================== */
```
Every logical group (Typography Import, Color Palette, Dark Mode, Global Styles, Hero Section, Feature Cards, ...) is delimited by this exact banner comment style — 20 `=` characters each side. New token groups (type scale, spacing scale, `--color-negative`/`--color-positive`) must add a new banner, e.g. `/* ==================== Type Scale ==================== */`, inserted logically near `Color Palette` (typography/spacing tokens conventionally sit with the other `:root` design tokens, before `Global Styles`).

**`:root` vs `.dark` ordering (critical convention):** every token that has a dark variant is declared in `:root` first (lines 10-62) with a **plain value**, and the *exact same custom property name* is re-declared inside a separate `.dark { }` block (lines 65-91) later in the file, in the **same relative order** as the `:root` declaration. E.g. `--vp-c-brand-1` is line 13 in `:root` and line 66 in `.dark`; `--vp-c-bg` is line 28 and line 71. New semantic colour tokens (`--color-negative`, `--color-positive`) must follow this exact split — declare once in `:root` with the light value, then (per CONTEXT/UI-SPEC) note explicitly that `--color-negative`/`--color-positive` are the **one exception**: UI-SPEC says these do NOT need a `.dark` override (kept "identical in dark" for negative; confirm positive `#34c759` is also identical — it already appears unchanged in the existing palette array in `echarts-setup.js`). Do not add a `.dark` block entry for these two unless a future value actually diverges — this deviates from the split convention deliberately and should be called out with a code comment so a future maintainer doesn't "fix" it into two blocks.

**Traps:**
1. Line 7 `@import url('https://fonts.googleapis...')` must be deleted **entirely**, not commented out (project convention: delete dead code, don't comment it out — matches global CLAUDE.md).
2. Lines 94-99 bare `html { font-family: ... }` — delete this whole rule, replace only via `--vp-font-family-base` in `:root`. Do not leave both (UI-SPEC is explicit that VitePress internals only read the CSS variable).
3. `--vp-c-brand-soft` (line 16 `:root`, line 69 `.dark`) currently needs **two** declarations (one per mode) because it's a raw `rgba()` literal. After the `color-mix()` fix it becomes **one** declaration in `:root` only — remove the `.dark` override entirely, this is a rare case where a `.dark`-block entry needs to be **deleted**, not added.
4. `config.js`'s `assertBrandInSync()` (see below) parses `:root { ... }` for `--vp-c-brand-1` with a regex that strips comments first — do not break this parsing by reformatting the `:root` block structure (e.g. don't move `--vp-c-brand-1` out of the first `:root` block or rename it).
5. Two existing `@media (prefers-reduced-motion: no-preference)` blocks already exist (lines 154, 437) — the new `reduce` block is a **third, separate** media block, not a merge into either existing one; follows the same `!important` pattern as the existing `@media print` block (line 547).

---

### `docs/.vitepress/config.js`

**Analog:** itself.

**Convention:** `head` array entries are `["tag", {attrs}, innerText?]` tuples (see lines 114-163). The font preload entry goes in this array as a new tuple:
```js
["link", { rel: "preload", href: "/fonts/source-sans-3-variable.woff2", as: "font", type: "font/woff2", crossorigin: "" }]
```
Insert near the top of `head` (after the favicon/RSS `link` entries, before `meta` entries) since preload benefits from appearing early in `<head>`.

**Traps:**
1. `og:image`/`twitter:image` (lines 140, 147) both need updating from `og-image.svg` to `og-image.png` — two separate literal strings, easy to update one and miss the other.
2. `VitePWA.includeAssets` (line 68) also references `"og-image.svg"` — a **third** place with the same filename; UI-SPEC explicitly calls this out ("Update every `og-image.svg` reference"). Grep for `og-image` before considering this file done.
3. `assertBrandInSync()` (lines 24-37) reads `custom.css` at build time via `readFileSync` + regex — this function must still pass after `custom.css` edits; it's a good post-edit smoke test (`npm run build` or `node -e` importing config) but do not modify this function as part of Phase 4 — it's out of scope (Phase 3 delivered it).
4. `description` (line 57-58), `RSS_CONFIG.description` (line 44), `keywords` meta (line 129-132), and `footer.message`/`footer.copyright` (lines 235-236) are four separate literal strings that all need the positioning-copy update from CONTEXT — same "grep before declaring done" trap as og-image.

---

### `docs/.vitepress/theme/index.js`

**Analog:** itself.

**Convention:** every component is (1) imported by name near the top in a logical group (dead components first, then `viz/` design-language components, then the ECharts suite, each group preceded by a one-line comment like `// ECharts suite`), and (2) registered in `enhanceApp()` via `app.component('Name', Name)` in the **same order** as the import block.

**Trap:** deleting `MetricCards`, `ProjectChart`, `ProcessSteps` requires removing **both** the import lines (8-10) **and** the three `app.component(...)` calls (42-44) — a partial removal (import only, or registration only) will either break the build (missing import) or silently leave a dead global component registered. Also delete the now-obsolete `.vue` files themselves (`docs/.vitepress/theme/components/MetricCards.vue`, `ProjectChart.vue`, `ProcessSteps.vue`) — confirm zero remaining references with a grep across `docs/**/*.md` before deleting the files (UI-SPEC states this is already confirmed at zero, but re-verify at execution time since content edits happen in the same phase).

---

### `docs/.vitepress/theme/components/viz/VizPanel.vue`

**Analog:** itself (extend in place) — but the **prop-doc-comment convention and axis-title precedent come from `EHeatmap.vue`** (see below), and the **new footer element's styling convention comes from `VizPanel`'s own existing `.viz-panel__sub` rule** (lines 83-89), which is the closest existing "secondary caption text under a heading" pattern in this file.

**`<script setup>` ordering convention (project-wide, confirmed in `VizPanel.vue`, `EBar.vue`, `EHeatmap.vue`):**
1. imports (Vue reactivity fns, `useData` from vitepress, sibling component imports, `echarts-setup.js` named imports) — `VizPanel.vue` has no chart logic so it currently has zero imports; that stays true, the new `source`/`asOf` props need no new imports.
2. `defineProps({...})` — inline comment directly above (or as an inline trailing comment per key) documenting shape, e.g. `EBar.vue:11` `// [{ label, value, color?, sub? }]`. `VizPanel.vue` currently has no such shape comments because its props are all primitive strings — for `source`/`asOf`, a one-line comment per new prop key (as UI-SPEC's own snippet already shows: `// NEW — e.g. "Bloomberg equity/ESG"`) matches this convention.
3. (chart components only) `useData()` + `ref`/`watch` dark-mode tick pattern — not applicable to `VizPanel`, it has no reactive computed option.

**Template convention:** optional content is guarded with `v-if` on the prop itself (`v-if="title || badge"` line 11, `v-if="badge"` line 13, `v-if="subtitle"` line 15) — the new footer must follow exactly this shape: `<footer v-if="source || asOf" class="viz-panel__foot">` with inner `v-if="asOf"` / `v-if="source && asOf"` / `v-if="source"` spans, exactly as UI-SPEC's own snippet specifies. This is already idiomatic to the file, not a new pattern being introduced.

**Style block convention:** BEM-like `.block__element` naming (`.viz-panel__head`, `.viz-panel__titles`, `.viz-panel__badge`, `.viz-panel__title`, `.viz-panel__sub`, `.viz-panel__body`) — the new `.viz-panel__foot` rule slots into this naming scheme directly, placed after `.viz-panel__body` in the `<style scoped>` block (style rules are ordered to roughly match template top-to-bottom order today).

**Traps:**
1. The existing `.viz-panel::before` top hairline (line 51) mixes brand blue with two unrelated hard-coded hex stops — this is a Restraint (DES-12) fix that lands in the *same file* as the new props; don't let the prop addition distract from also fixing this line.
2. `.viz-panel__foot`'s `margin-top` must be `var(--space-2)` per the UI-SPEC snippet, not the bare `10px` a naive copy of `.viz-panel__sub`'s `6px 0 0` pattern might produce — this file is one of the handful with a named literal→token migration in UI-SPEC's own text.
3. `border-radius: 18px` (line 28, `.viz-panel`) is unrelated to the `.project-card`/`.VPFeature` radius unification below, but note it already uses `18px` — i.e. `VizPanel` already agrees with `.VPFeature`, only `.project-card`'s `14px` is the outlier.

---

### `docs/.vitepress/theme/components/viz/echarts-setup.js`

**Analog:** itself — `themeTokens()` (lines 67-89) is the exact place the two new semantic slots (`negative`, `positive`) are added, following the identical `cssVar(name, fallback)` call shape already used for every other token in that object (e.g. line 69 `brand: cssVar('--vp-c-brand-1', brand)`).

**Convention:** every exported helper here is a small (5-15 line), pure, side-effect-free function with a one-line doc comment only where non-obvious (see `hexToRgba`'s comment block, lines 91-96, explaining the parse-fallback behaviour) — terse, not JSDoc. The new `prefersReducedMotion()` helper (per UI-SPEC's own snippet) matches this shape exactly: short, guarded for SSR (`typeof window !== 'undefined'`), no comment needed beyond what UI-SPEC already gives since its name is self-documenting (matches "function names are self-documenting" convention noted in CLAUDE.md's Comments section).

**Trap:** `themeTokens()`'s `palette` array (lines 76-87) already contains `'#af52de'` and `'#34c759'` as plain sequential-palette entries — do not confuse these with the new named `negative`/`positive` semantic slots; they are a different concept (sequential fallback colour vs. fixed-semantic colour) even though `#34c759` happens to be the same hex value as `--color-positive`'s default. Keep them as textually separate object keys (`palette: [...]` vs `negative:`/`positive:`), don't try to derive one from the other.

---

### Axis-title pattern — `EBar`, `EGroupBar`, `EHistogram`, `EForest`, `ECombo`, `EFootball`, `ELine`

**Analog:** `EHeatmap.vue` lines 7-16 (props) and lines 55-75 (axis objects) — this is the **only** existing implementation and must be copied mechanically, not reinvented per component.

**Exact pattern to copy** (from `EHeatmap.vue`):
```js
// props addition
xName: { type: String, default: '' },
yName: { type: String, default: '' },
```
```js
// inside the relevant axis object in the option computed()
xAxis: {
  ...
  name: props.xName,
  nameLocation: 'middle',
  nameGap: 26, // tune 20-28 per component per UI-SPEC
  nameTextStyle: { color: t.text2, fontSize: 11, fontWeight: 600 },
  ...
}
```
Note `EHeatmap` sets `nameTextStyle` on **both** axes but only sets `nameGap`/`nameLocation` on the `xAxis` (its `yAxis`, lines 67-76, has `name: props.yName` and `nameTextStyle` but no `nameGap`/`nameLocation` — category axes with horizontal labels don't need the gap tuning a value axis does). When applying to `EBar`/`EGroupBar` (which swap value-axis vs category-axis based on `horizontal` prop), apply `name`/`nameLocation`/`nameGap` only to whichever axis object is the **value** axis (`valueAxis` in `EBar.vue` lines 35-48), matching UI-SPEC's own instruction ("applied to whichever axis is the value axis given `horizontal`").

**Trap:** `EBar.vue`'s `catAxis` (lines 50-62) already sets `axisLabel.width: 110` for horizontal mode — this is the exact overflow risk UI-SPEC's Backstop B1 flags at 375px; adding `xName` to the value axis doesn't touch this, but don't accidentally add name/nameGap to `catAxis` too since it has no unit-bearing purpose.

---

### Reduced-motion gating — all ten chart components

**Analog:** any one component's `animationDuration: 700` literal (e.g. `EBar.vue:65`, `EHeatmap.vue:45`) — this is a single-line, mechanically identical change across `EBar`, `ELine`, `EDonut`, `ECombo`, `EForest`, `EGroupBar`, `EHistogram`, `EFootball`, `EScorePath`, `EHeatmap`.

**Pattern:**
```js
import { themeTokens, baseTooltip, prefersReducedMotion } from './echarts-setup.js' // add prefersReducedMotion to existing import
...
animationDuration: prefersReducedMotion() ? 0 : 700, // preserve each component's own existing 700/800/900
```
**Trap:** each component currently has its own literal duration (700 in `EBar`/`EHeatmap`, others may be 800/900 per UI-SPEC's own text) — do not normalize all ten to the same duration when motion is *not* reduced; only the reduced-motion path (`0`) is universal. Diff each file's existing literal before editing.

---

### Font-weight `650` fixes — `EForest.vue:54`, `EFootball.vue:61`, `EScorePath.vue:52`

**Analog:** each other's identical `axisLabel.fontWeight: 650` occurrence — same fix (`650` → `600`) with an inline comment `// matches --font-weight-semibold`, per UI-SPEC's exact instruction. These are plain JS numeric literals in ECharts option objects, not CSS — no `var()` possible here (canvas rendering constraint already noted in `echarts-setup.js`'s pattern for colours applies equally to numeric style props).

---

### Case-study markdown (`global-equity-portfolio.md`, `cisco-equity-valuation.md`, `wq-alpha-research.md`, `board-diversity-esg.md`, `uk-finance-pay.md`)

**Analog:** `global-equity-portfolio.md` is the **reference file** UI-SPEC itself names ("already omits `accent` entirely and is the reference example other case studies should match").

**`<script setup>` block convention** (lines 15-68 of `global-equity-portfolio.md`):
- One `const` per data array/object passed to a component, named descriptively (`metrics`, `factors`, `sectors`, `teParts`, `varItems`, `steps`).
- Each array element is a plain object literal; shape is implicit from usage, not commented in markdown (unlike the `.vue` prop-doc-comment convention — markdown data arrays are undocumented inline, matching the project's general terseness).
- Colour literals currently live **directly in these data arrays** as `accent: '#0071e3'` / `color: '#ff3b30'` keys (lines 17-20, 48-51, 55-58) — this is exactly what Phase 4 deletes for the sequential/categorical case, and replaces with the string `'negative'`/`'positive'` for the two fixed-semantic cases.
- `<script setup>` block sits immediately after frontmatter, before the H1 — this ordering is consistent across all five files (verify per-file, but `global-equity-portfolio.md` is the clean baseline).

**`VizPanel` wrapping convention:** `<HeroMetrics :items="metrics" />` (line 78) is used bare (no `VizPanel` wrapper) for the Snapshot metrics row; charts elsewhere in each case study (not shown in this excerpt but confirmed present in Cisco/other files per UI-SPEC's own text) are wrapped as `<VizPanel title="..." subtitle="..." badge="..."><EBar ... /></VizPanel>` — every such wrapper needs `source`/`as-of` added per the Exhibit Contract; grep each file for `<VizPanel` to enumerate all instances requiring the audit (UI-SPEC requires this be exhaustive, not spot-checked).

**Trap:** `board-diversity-esg.md` has three different titles (frontmatter/H1/index card) that must reconcile to one string, `cisco-equity-valuation.md` has a `.brand-row` line with `Mark: 73` and course code to strip, and `uk-finance-pay.md` has a metric tile to delete entirely (`{ label: 'Views', value: '8', ... }`) — these are per-file content traps distinct from the shared colour/axis-title mechanical fixes; do not treat all five files as interchangeable copy-paste targets, only the *mechanical* fixes (colour deletion, axis-title props, number formatting) are uniform.

---

### `docs/projects/index.md`

**Analog:** itself, but the **target state** folds its page-local `<style>` block (lines 56-113) into `custom.css`, following `custom.css`'s existing section-comment convention (a new `/* ==================== Project Cards ==================== */` banner, likely placed near `/* ==================== Feature Cards ==================== */` at line 192 since both are card systems).

**Trap (flagged per objective #6 — two competing systems):**
- `.project-card` (this file, lines 64-80): `border-radius: 14px`, `padding: 24px`, `gap: 10px`, grid `gap: 20px`, minmax floor `300px`.
- `.VPFeature` (`custom.css` lines 197-234, not fully read here but referenced by UI-SPEC): `border-radius: 18px`.
- UI-SPEC locks the unification decision already (`--radius-card: 18px`, minmax floor lowered to `260px`, spacing rounded onto the 8-point scale) — **this is not an open decision for the planner to re-litigate**, it's already resolved in UI-SPEC's Restraint/Viewport sections; PATTERNS.md flags it here only so the executor knows the fold-into-`custom.css` move is itself the "pattern" to follow (move page-local styles to the shared stylesheet, don't leave two files owning card styling).
- `cisco-equity-valuation.md`'s own tail `<style scoped>` block is explicitly **out of scope for this fold** — it stays page-local because its rules (`.brand-row`, `.logo-chip`) are genuinely page-specific, not general card styling. Do not merge that block into `custom.css`.

---

### `docs/index.md`

**Analog:** itself — hero frontmatter (`hero: { name, text, tagline, image, actions }`) is VitePress's own home-layout schema, not a project-specific pattern; the feature trio (`features: [...]`) with inline SVG `icon` blocks is the project's own established pattern (unchanged structurally, only the gradient stroke changes).

**Trap:** the three feature icons each have their own inline `<defs><linearGradient id="{name}-grad">...` block plus a `stroke="url(#{name}-grad)"` reference — both the `<defs>` block and the `url(#...)` reference must be removed together per icon; a partial edit (removing `<defs>` but leaving a dangling `url(#...)` reference, or vice versa) silently breaks the icon's stroke rendering with no build-time error (SVG `url()` references to a missing id just render unstroked, not an error).

---

## Shared Patterns

### Dark-mode reactivity (chart components)
**Source:** `EBar.vue` lines 20-24, identical in every chart component:
```js
const { isDark } = useData()
const tick = ref(0)
watch(isDark, () => { tick.value++ }, { flush: 'post' })
```
and inside the `computed()`: `void tick.value` as the first line, to force recomputation on theme toggle without actually depending on the value.
**Apply to:** no new files need this (it already exists everywhere) — but any edit to the ten chart components' `computed()` blocks (axis-title, reduced-motion) must preserve this exact tick/void pattern; don't refactor it away.

### `themeTokens()` consumption
**Source:** `echarts-setup.js` lines 67-89, called as `const t = themeTokens()` at the top of every chart's `computed()`.
**Apply to:** the two new semantic colour slots (`t.negative`, `t.positive`) are consumed exactly like `t.brand`/`t.text2`/`t.divider` already are — no new access pattern.

### `<script setup>` / prop-doc-comment convention
**Source:** `EBar.vue` lines 7-18 (`defineProps` with inline shape comment on the array prop).
**Apply to:** any new prop added to `VizPanel.vue` or any chart component's `defineProps` block.

### CSS section-banner convention
**Source:** `custom.css`, every major section (Typography Import, Color Palette, Dark Mode, Global Styles, Hero Section, Feature Cards, etc.), `/* ==================== Name ==================== */`.
**Apply to:** new Type Scale, Spacing Scale, and Project Cards sections being added to `custom.css`.

### `color-mix()` for brand-derived translucency
**Source:** `VizPanel.vue`'s existing use is implied by UI-SPEC as "matches the pattern `VizPanel.vue` already uses" — actual existing occurrence is the `radial-gradient(... color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent) ...)` at `VizPanel.vue:31-32`.
**Apply to:** `--vp-c-brand-soft`, `.custom-block.tip` background, `::selection` background in `custom.css` — all three converge on this one existing idiom already present in `VizPanel.vue`, so it's a "promote an existing local pattern to the shared stylesheet" move, not an invented technique.

### Commit-message convention
**Source:** `git log --oneline -15` on this repo:
```
docs(04): UI design contract
docs(04): revise UI design contract - tighten typography/spacing scales, add focal-point statement
docs(04-position-design): UI design contract
docs(04): smart discuss context
fix(03): WR-03 call brand() for ProjectChart default palette entry
fix(03): WR-02 make EHistogram default color reactive to dark mode
fix(03): strip CSS comments before matching brand-sync regex
fix(03): derive hexToRgba fallback from brand token, not a third literal
fix(03): WR-03 add build-time assertion that tokens.js brand matches custom.css
```
**Convention:** `type(scope): short imperative description`, where `type` is `docs`/`fix`/(presumably `feat`/`refactor`/`chore` for phase execution commits) and `scope` is the phase number, sometimes with a task/requirement code prefix in the description (e.g. `WR-03`, matching this project's requirement-ID naming like `DES-06`, `POS-01`). Phase 4 commits should follow `feat(04): ...` / `fix(04): ...` / `docs(04): ...` with UI-SPEC's requirement IDs (`DES-01`, `POS-02`, `EXH-03`, etc.) referenced in the message body where a commit maps to a specific requirement, matching the `fix(03): WR-01 ...` precedent.

---

## No Analog Found

| File | Role | Data Flow | Reason |
|---|---|---|---|
| `docs/public/fonts/source-sans-3-variable.woff2` | asset | file-I/O | No existing font file under `docs/public/` — this is a new asset *type* in the repo (only SVG/ICO/txt exist today under `public/`). No component-level pattern applies; the only precedent is the `public/` directory's flat structure itself (files referenced from site root, e.g. `/logo.svg` → `docs/public/logo.svg`), which the font asset follows directly (`/fonts/source-sans-3-variable.woff2` → `docs/public/fonts/source-sans-3-variable.woff2`). Executor should create the `fonts/` subdirectory fresh; no existing subdirectory convention under `public/` to match against (there is a `docs/public/projects/` subdirectory for project-specific images, so nested subdirectories under `public/` are already an established pattern — `fonts/` follows that same shape).

---

## Metadata

**Analog search scope:** `docs/.vitepress/theme/` (all files), `docs/.vitepress/config.js`, `docs/projects/*.md`, `docs/index.md`, `docs/public/`
**Files scanned:** ~30 (all Vue components under `theme/components/viz/`, `custom.css`, `config.js`, `index.js`, all 5 case studies, `projects/index.md`, `docs/public/` directory listing, git log)
**Pattern extraction date:** 2026-07-27
