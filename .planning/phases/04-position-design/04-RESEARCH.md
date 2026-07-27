# Phase 4: Position & Design - Research

**Researched:** 2026-07-27
**Domain:** Self-hosted variable-font typography, VitePress 2.0-alpha theme overrides, ECharts canvas theming/motion, and copy-comprehension verification, for a brownfield VitePress + Vue 3 + ECharts static site
**Confidence:** HIGH on font sourcing, ECharts CSS-var/SSR behaviour, and VitePress override mechanics (all verified directly against this repo's own build output and official docs); MEDIUM on the POS-02 comprehension-verification method (methodology transplanted from a human-subject UX practice into an agentic workflow — the proxy is defensible, not equivalent)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Typographic System (DES-01–04):** Typeface is Source Sans 3, self-hosted as a variable WOFF2 under `docs/public/fonts/`, referenced from an authored `@font-face` with `font-display: swap`, plus `<link rel="preload">` in `config.js`'s head. Latin subset, one file. The `@fontsource-variable/source-sans-3` npm route was considered and declined. Delete the Google Fonts `@import` at `custom.css:7`. Set `--vp-font-family-base` and delete the bare `html { font-family }` declaration at `custom.css:94-99`. Type scale as explicit CSS custom properties in `:root` on a 1.200 minor-third ratio, with `clamp()` for fluid headings — no size literal survives at a point of use. Weight tokens resolve the non-standard `650` weight. `font-variant-numeric: tabular-nums` on chart labels, data tables, metric cards. Spacing tokens follow the same treatment as type scale.

**Positioning & Identity (POS-01–04, POS-06):** Hero is discipline-led (exact copy locked in UI-SPEC). No energy/commodities mention in the hero. Name "Qiankun (Kenny) Zhu" used once, in the hero. Selected work reachable in one click. Contact email becomes a real `mailto:` link; remove the response-time line. About rewritten around verifiable facts only.

**Case Study Leads & Jargon (POS-05, POS-07):** Outcome-first two-sentence lead template on all five case studies and index cards. Jargon carries an inline parenthetical translation on first use. Index ordering locked (Global Equity → Cisco → WQ Alpha → Board Diversity → UK Finance Pay). Academic framing: cut marks and course codes, keep institution and date. `board-diversity-esg.md`'s three titles reconcile to one.

**Exhibit Quality Bar & Restraint (EXH-01–05, DES-06, DES-07, DES-09–12):** `VizPanel.vue` gains `source`/`as-of` props. Chart components gain axis-title support (`xName`/`yName`, mirroring `EHeatmap`'s existing pattern). One shared number-formatting convention across all five case studies. Every exhibit gets an as-of date and named source. UK Finance Pay is relabelled honestly, not rebuilt. `prefers-reduced-motion` gets a real `reduce` block; ECharts animation gated per component. Remove the homepage feature-icon purple/pink gradient. Delete `MetricCards.vue`, `ProjectChart.vue`, `ProcessSteps.vue`. Consolidate the three competing style layers (`custom.css`, `projects/index.md`'s page-local `<style>`, `cisco-equity-valuation.md`'s tail `<style scoped>`). Chart palettes derive from tokens, re-theme in dark mode. `custom.css`'s remaining raw RGB brand literals fold into the token work.

**Scope additions accepted by user:** Replace the SVG `og:image` with a PNG. Replace the site description and footer copy (`config.js`).

### Claude's Discretion

Exact wording of every rewritten sentence, within the decided structure and facts on record. Precise type-scale step values (already resolved in UI-SPEC on the 1.200 ratio). Spacing token names/granularity (already resolved in UI-SPEC). The caption layout for `source`/`as-of` on `VizPanel` (already resolved in UI-SPEC). Commit granularity and plan/wave decomposition, provided each commit builds. Whether the OG PNG is authored by hand or generated at build time.

### Deferred Ideas (OUT OF SCOPE)

Plotting UK Finance Pay from real ONS data. SVG rendering fallback for charts. An energy/commodities case study. Renaming the GitHub/LinkedIn handles to match "Qiankun". VER-01/VER-03 link checking and CI (Phase 5). VER-06 Search Console removal submissions (Phase 5).

**Note:** 04-UI-SPEC.md (approved, checker-signed-off) has already turned every one of the above into exact token values, exact copy, and exact per-component fixes. This research does not re-decide anything UI-SPEC settled — it answers eight open implementation questions UI-SPEC and CONTEXT.md left to the planner: font sourcing mechanics, weight-axis verification, VitePress-alpha override specifics, ECharts/CSS-var/SSR behaviour, reduced-motion mechanics, POS-02 verification method, sequencing/blast-radius, and pitfalls.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| POS-01 | Hero states who Qiankun is and what he does, above the fold | UI-SPEC has exact copy; research confirms no additional investigation needed |
| POS-02 | Comprehension acceptance test, not aesthetics | See "Verifying POS-02" below — concrete, repeatable proxy protocol |
| POS-03 | Selected work reachable in one click | UI-SPEC's single-action hero closes this; no research gap |
| POS-04 | About page specific and verifiable | UI-SPEC has exact copy; no research gap |
| POS-05 | Outcome-first leads | UI-SPEC has exact per-page copy; no research gap |
| POS-06 | Direct email path | UI-SPEC has exact copy (`mailto:` link); no research gap |
| POS-07 | Jargon glossed inline | UI-SPEC has exact gloss table; no research gap |
| DES-01 | Self-hosted variable WOFF2, zero third-party font request | See "Sourcing the Source Sans 3 variable WOFF2" and the `vitepress/theme-without-fonts` pitfall below |
| DES-02 | `preload` + `font-display: swap`, no visible layout shift | See "VitePress head-array serialisation" and font-loading pitfalls below |
| DES-03 | Type scale/weight/measure as tokens | See "font-weight: 200 900 vs axis range" (verified match) |
| DES-04 | `--vp-font-family-base` set correctly | See "VitePress 2.0.0-alpha.18 specifics — CSS layering" below |
| DES-06 | Consistent spacing/hierarchy, side-by-side verified | See "Risk and sequencing" — blast-radius decomposition |
| DES-07 | Chart styling derives from tokens | See "ECharts and CSS custom properties" below |
| DES-09 | Animations disabled under `prefers-reduced-motion` | See "prefers-reduced-motion and ECharts" below |
| DES-10 | 375px readability | Already verified/flagged in UI-SPEC's Viewport Contract; no new research gap |
| DES-11 | Dark-mode correctness including charts | See "ECharts and CSS custom properties" — SSR/build-time gotcha |
| DES-12 | Restrained visual result | UI-SPEC has exact fixes; no research gap |
| EXH-01–05 | Exhibit quality bar (axes, as-of, sourcing, formatting, non-decorative) | UI-SPEC has exact fixes; sequencing addressed below |

</phase_requirements>

## Summary

This phase's technical risk is concentrated in exactly one place: the font-loading swap. Everything
else UI-SPEC specifies is either a mechanical token substitution (low risk, high file count) or a
markdown/copy rewrite (zero build risk, verifiable by reading). The font swap is different because it
touches four things atomically (delete Google Fonts import, add `@font-face`, add `preload`, set
`--vp-font-family-base`) and this research surfaces a fifth thing CONTEXT.md and UI-SPEC did not
name: **VitePress's own default theme entry point (`vitepress/theme`) bundles and self-hosts its own
copy of Inter — 14 WOFF2 files, confirmed present in this repo's own last build output at
`docs/.vitepress/dist/assets/`, totalling roughly 670KB — independent of the Google Fonts `@import`
in `custom.css`.** Setting `--vp-font-family-base` alone does not stop this bundling; VitePress
ships a documented escape hatch (`vitepress/theme-without-fonts`) for exactly this situation, and
`theme/index.js` must switch to it as part of this phase or the build keeps shipping an entire unused
font family. This is the single highest-value finding in this research pass.

The second-highest-value finding is a full, byte-verified sourcing procedure for the WOFF2 file
itself: extracting `@fontsource-variable/source-sans-3`'s npm tarball (without installing it as a
runtime dependency) yields an already-Latin-subsetted, already-variable-format WOFF2 at
`files/source-sans-3-latin-wght-normal.woff2`, 28,740 bytes, built by a reputable, license-clean
(OFL-1.1) packaging pipeline — this satisfies CONTEXT's "manually-placed" delivery decision without
requiring Python font-subsetting tooling this project doesn't otherwise use. The `font-weight: 200
900` value UI-SPEC already specifies is verified correct against Source Sans 3's actual variable axis
— no synthesis risk exists.

Everything ECharts-related (CSS-var-in-canvas, SSR/build-time `getComputedStyle` absence,
`prefers-reduced-motion` gating) is already correctly anticipated by the existing `cssVar()`/
`themeTokens()` pattern in this codebase — this phase extends a proven pattern, it does not invent
one. The one genuine open question there is that ECharts has no first-party reduced-motion support
(confirmed via the Apache ECharts issue tracker) and the load-time `matchMedia().matches` read UI-SPEC
proposes is the correct, standard JS-side mitigation — not a live-reactive one, and that gap is
acceptable for entrance animations specifically (argued below).

**Primary recommendation:** treat the font-loading swap (Google Fonts import deletion + `@font-face` +
`preload` + `--vp-font-family-base` + the `theme-without-fonts` entry-point swap) as one atomic,
independently-verified commit before touching anything else — it is the one change in this phase
that can silently leave the site with no declared font at all if split across commits, and it is also
the one change with a real page-weight payoff (removing ~670KB of dead Inter font data) that nothing
else in this phase touches.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Typeface loading & rendering | Browser / Client | Build/Static | `@font-face`, `preload`, and `font-display` are browser-parsed; the WOFF2 file itself is a static asset resolved at build time via `docs/public/` passthrough |
| Type/spacing/weight tokens | Browser / Client (CSS cascade) | — | Pure CSS custom properties in `:root`/`.dark`; no Node-side consumer needed (unlike the existing brand-colour split documented in ARCHITECTURE.md) |
| Positioning copy (hero, About, Contact, case-study leads) | Static / Build | — | Markdown + frontmatter compiled to static HTML at build time; no runtime component |
| Chart theming (colour, axis titles, motion) | Browser / Client | Build/Static (SSR fallback literals) | ECharts renders to canvas client-side and re-renders on hydration; `themeTokens()`'s `cssVar()` fallback path also executes at build time during VitePress's SSR pass |
| `VizPanel` provenance caption | Browser / Client | Static / Build | New props are plain Vue template bindings; the strings themselves are authored markdown data, resolved at build time |
| Site metadata (description, OG image, footer) | Build/Static | CDN / Static | `config.js` head/meta array is compiled once; the OG PNG is a static asset served by Cloudflare Pages |

## Standard Stack

### Core (all unchanged — this phase adds zero new runtime dependencies)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| VitePress | `2.0.0-alpha.18` (exact-pinned, confirmed in `package.json`) | Static site generator | Fixed by prior phase; not revisited here |
| Vue 3 | via VitePress | UI framework | Fixed |
| ECharts + vue-echarts | `6.1.0` / `8.0.1` (confirmed installed via `npm ls`) | Charting | Fixed |
| Vite | `^8.1.4` | Build tool | Fixed |

### Font source (build-time only — not a runtime/production dependency)

| Source | Version checked | Purpose | Why used |
|--------|------------------|---------|----------|
| `@fontsource-variable/source-sans-3` npm tarball | `5.3.0`, published 2026-07-19 [VERIFIED: npm registry — `npm view` + tarball extraction performed this session] | One-time extraction source for `files/source-sans-3-latin-wght-normal.woff2` (28,740 bytes) | Already Latin-subsetted, already `woff2-variations` format, produced by a maintained packaging pipeline (Fontsource org active since Dec 2020) — avoids hand-subsetting with `fonttools`/`pyftsubset`, a Python toolchain this project does not otherwise use |

**Installation:** none — this is not installed as a project dependency. Extraction procedure:

```bash
npm pack @fontsource-variable/source-sans-3   # downloads the tarball, no install/link
tar -xzf fontsource-variable-source-sans-3-*.tgz
cp package/files/source-sans-3-latin-wght-normal.woff2 docs/public/fonts/source-sans-3-variable.woff2
rm -rf package fontsource-variable-source-sans-3-*.tgz   # discard the package scaffold, keep only the font file
```

Verified this session (tarball downloaded and extracted directly): the package's own generated
`wght.css` declares `font-weight: 200 900;` and `src: url(...) format('woff2-variations');` for this
exact file — matching UI-SPEC's `@font-face` block byte-for-byte on those two properties. The
package's internal `font-family` name (`'Source Sans 3 Variable'`) does not need to match; `@font-face`
`font-family` is an author-chosen CSS alias, not a value read from the font's internal name table.

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Fontsource-tarball-as-source-only | Adobe's own GitHub releases (`github.com/adobe-fonts/source-sans/releases`) [ASSUMED — not independently downloaded this session] | Canonical upstream, but the release assets are unsubsetted (full Unicode coverage) — would require `pyftsubset` (Python/fonttools) to produce an equivalent Latin-only file, adding a toolchain this project doesn't have |
| Fontsource-tarball-as-source-only | Install `@fontsource-variable/source-sans-3` as an actual devDependency and import its CSS | Declined in CONTEXT.md ("less subsetting control for no real benefit here") — noted here only for completeness, not recommended |
| `npm pack` extraction | `google-webfonts-helper` (gwfh.mranftl.com) | **Does not support variable fonts** [CITED: web search, cross-referenced against the tool's own stated limitation] — would only yield static per-weight files, contradicting the "one variable file" decision |

## Package Legitimacy Audit

| Package | Registry | Age | Downloads | Source Repo | Verdict | Disposition |
|---------|----------|-----|-----------|--------------|---------|-------------|
| `@fontsource-variable/source-sans-3` | npm | Latest version published 2026-07-19 (one week old); scope (`@fontsource-variable`) active since 2023, parent org (`@fontsource`) active since Dec 2020 | 57,996/week | `github.com/fontsource/font-files` | **SUS** (`gsd-tools query package-legitimacy check` flags `"too-new"`) | **Not installed as a dependency — used only as a one-time, discard-after-use source for one static binary asset (the WOFF2 file), extracted via `npm pack` and never referenced in `package.json`.** The "too-new" signal is an artifact of Fontsource's automated release cadence (the monorepo re-publishes on every upstream Google-Fonts-metadata sync, verified via `npm view @fontsource/inter time.created` = 2020-12-23) rather than a real provenance risk. If a future maintainer instead chooses to install the package as a real devDependency (rather than extract-and-discard), add `checkpoint:human-verify` before that `npm install` per the SUS verdict. |

**Packages removed due to [SLOP] verdict:** none.
**Packages flagged as suspicious [SUS]:** `@fontsource-variable/source-sans-3` — disposition above; no checkpoint required for the extract-and-discard usage pattern this research recommends, since it never enters the dependency tree. A checkpoint IS required if the planner instead chooses to install it as a devDependency.

No other packages are introduced by this phase — DES-01–12/POS-*/EXH-* are all implemented with the
existing dependency set (VitePress, Vue, ECharts) plus one static font-file asset.

## Architecture Patterns

### System Architecture Diagram — font loading path (the phase's one genuinely new data-flow)

```
build time (Node, no DOM)                    browser (first paint)
──────────────────────────                   ──────────────────────
docs/public/fonts/                            <head>
  source-sans-3-variable.woff2  ──copied──►     <link rel=preload
  (via VitePress public/ passthrough)             href=/fonts/....woff2
                                                   as=font crossorigin>
config.js head[]  ──emits──►                    (font fetch starts
  <link rel=preload ...>                          immediately, parallel
                                                   to CSS parse)
custom.css :root{}  ──emits──►                <style>
  --vp-font-family-base: 'Source Sans 3' ...      @font-face{
                                                     src: url(...)
theme/index.js                                      format('woff2-variations')
  import DefaultTheme                               font-weight:200 900
    from 'vitepress/theme-without-fonts' ─────►      font-display:swap }
  (stops VitePress's OWN bundled Inter          ...
   from being emitted into the build at all)   body text paints using
                                                fallback stack immediately
                                                (font-display:swap) then
                                                swaps to Source Sans 3
                                                once the preloaded file
                                                resolves (imperceptible
                                                window given preload)
```

The critical edge in this diagram is the `theme-without-fonts` import — without it, VitePress's
default theme CSS still declares its own `@font-face` rules for Inter (bundled from
`vitepress/dist/client/theme-default/`) regardless of what `--vp-font-family-base` is set to, and
those files get copied into `dist/assets/` and precached by Workbox's `woff2` glob whether or not any
visible text actually renders in Inter.

### Recommended Project Structure (delta only)

```
docs/
├── public/
│   ├── fonts/
│   │   └── source-sans-3-variable.woff2   # NEW — 28.7KB, Latin subset, variable wght 200-900
│   └── og-image.png                        # NEW — replaces og-image.svg (1200×630)
docs/.vitepress/
├── theme/
│   ├── index.js         # MODIFIED — DefaultTheme import swaps to 'vitepress/theme-without-fonts'
│   ├── custom.css       # MODIFIED — @font-face, --vp-font-family-base, type/spacing/weight tokens,
│   │                       new --color-negative/--color-positive, reduce motion block, color-mix()
│   │                       consolidation, radius/minmax fixes; Google Fonts @import DELETED
│   └── components/viz/
│       ├── echarts-setup.js   # MODIFIED — themeTokens() gains negative/positive slots,
│       │                        prefersReducedMotion() helper added
│       ├── VizPanel.vue       # MODIFIED — source/asOf props + footer
│       ├── EBar.vue, ELine.vue, EDonut.vue, EForest.vue, EGroupBar.vue,
│       │   EHistogram.vue, ECombo.vue, EFootball.vue   # MODIFIED — axis-title props,
│       │                        prefersReducedMotion() wiring, semantic-colour resolution
│       └── EHeatmap.vue       # UNCHANGED — already has xName/yName (the reference pattern)
├── config.js             # MODIFIED — description/keywords/RSS/footer copy, og-image.png reference
docs/
├── index.md, about.md, contact.md, projects/index.md   # REWRITTEN per UI-SPEC copy
└── projects/*.md (5 files)                              # lead rewrites + exhibit wiring
```

### Pattern 1: `theme-without-fonts` for a fully custom typeface

**What:** VitePress ships two theme entry points — `vitepress/theme` (bundles Inter) and
`vitepress/theme-without-fonts` (identical theme, no bundled font). Any site replacing the default
typeface entirely should import the latter.
**When to use:** Any time `--vp-font-family-base` is being overridden to something other than Inter.
**Example:**
```js
// docs/.vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme-without-fonts'   // was: 'vitepress/theme'
import './custom.css'
```
`[VERIFIED: Context7 /vuejs/vitepress — extending-default-theme.md]` — this is VitePress's own
documented pattern for exactly this situation, not an inferred workaround.

### Pattern 2: token-first CSS override, `!important` only for component-class fights

**What:** This codebase already proves two distinct, correct override mechanisms that must not be
conflated: (a) redefining a `--vp-*`/custom CSS variable in `:root` — no `!important` needed, wins by
plain cascade order since `custom.css` loads after VitePress's default-theme CSS — and (b) targeting a
VitePress default-theme class name (`.VPHero`, `.VPButton`, `.VPNav*`) whose own internal selectors
have higher specificity than a simple class rule — `!important` needed, and already used correctly
for this 37 times across 19 rule blocks in `custom.css` `[VERIFIED: grep against custom.css this
session]`.
**When to use:** New `:root` token declarations (the entire type-scale/spacing/weight/semantic-colour
work in this phase) fall under (a) — do not add `!important` to any of them; the existing,
already-working `--vp-c-brand-1` override (Phase 3, verified) is the proof this pattern works without
it. Any NEW rule that instead targets a VitePress class name directly (e.g., the `.project-card`
radius unification, if implemented as a class override rather than a variable) falls under (b) and
should follow the existing `!important` convention rather than trying to win on specificity alone.
**Example:**
```css
/* (a) — no !important, this is how --vp-c-brand-1 already works in this codebase */
:root {
  --vp-font-family-base: 'Source Sans 3', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-size-h1: clamp(2.07rem, 1.4rem + 2.5vw, 2.49rem);
}
/* (b) — !important needed, matches the existing pattern at custom.css:119 etc. */
.VPHero {
  padding: var(--space-8) var(--space-4) var(--space-7) !important;
}
```

### Pattern 3: SSR-safe CSS-var reads already in place — extend, don't redesign

**What:** `echarts-setup.js`'s `cssVar(name, fallback)` already guards `typeof document ===
'undefined'` and returns the literal fallback during VitePress's build-time SSR pass (confirmed by
reading `VizEChart.vue`/`EBar.vue`: charts render with `v-if="ready"` where `ready` defaults `true` —
i.e., `vue-echarts` genuinely executes during the Node-side static-HTML generation, not just
client-side). This is the exact mechanism that must back the two new semantic tokens.
**When to use:** Extending `themeTokens()` for `--color-negative`/`--color-positive`.
**Example:**
```js
// echarts-setup.js — mirrors the existing brand-token pattern exactly
export function themeTokens() {
  return {
    // ...existing...
    negative: cssVar('--color-negative', '#ff3b30'),
    positive: cssVar('--color-positive', '#34c759'),
  }
}
```
No new SSR-safety code is needed — the fallback-literal argument to `cssVar()` is the entire
mechanism, already proven for `brand`/`text1-3`/`divider`/`bg`/`bgSoft`.

### Anti-Patterns to Avoid

- **Assuming `--vp-font-family-base` alone removes Inter from the build:** it changes which font
  *text renders in*, not which font files VitePress *bundles*. Without the `theme-without-fonts` swap,
  the build still emits and precaches 14 unused Inter WOFF2 files.
- **Splitting the font-loading swap across multiple commits:** deleting the Google Fonts `@import`
  before the `@font-face`/`preload`/`--vp-font-family-base` triad is in place (or vice versa) creates
  a real intermediate state where no font is correctly declared. Land all four changes — delete
  import, add `@font-face`, add `preload`, set the variable, delete the bare `html{font-family}`,
  swap the theme entry point — as one atomic commit.
- **Adding `!important` to new `:root` token declarations "to be safe":** unnecessary and contradicts
  the codebase's own proven pattern; only add it when overriding a VitePress class selector directly.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Variable-font Latin subsetting | A `fonttools`/`pyftsubset` pipeline (Python, not otherwise used in this repo) | Extract the already-subsetted file from `@fontsource-variable/source-sans-3`'s published tarball | Fontsource already runs this exact pipeline against Adobe's source files, publishes the result under OFL-1.1, and the resulting file (28.7KB) is smaller than a hand-rolled subset would likely achieve without careful unicode-range tuning |
| Reduced-motion detection for canvas-rendered charts | A custom media-query-observer class per chart component | One shared `prefersReducedMotion()` helper in `echarts-setup.js`, called identically from all ten chart components' `option` computed properties | ECharts has no first-party `prefers-reduced-motion` support [CITED: Apache ECharts issue tracker / handbook, via web search] — the correct fix is exactly the one-line `window.matchMedia(...).matches` check UI-SPEC already proposes; anything more elaborate (a reactive ref + resize-triggering watcher) is unneeded because chart entrance animations play once per mount, not continuously (see Open Questions) |
| Semantic chart colour resolution | A generic "theming abstraction layer" for ECharts | Two named slots (`negative`/`positive`) added to the existing `themeTokens()` function, exactly like `brand`/`text1-3` already are | UI-SPEC already scoped this correctly — two slots, not a general system; a broader abstraction would be solving a problem this site doesn't have (it has exactly two semantic colour needs, not an open-ended palette system) |

**Key insight:** every "don't hand-roll" item above is really "use the pattern this codebase (or its
direct dependency) already has, rather than a fresh abstraction" — this phase is a pure extension of
Phase 3's proven token/theming work, not new architecture.

## Common Pitfalls

### Pitfall 1: VitePress's own bundled Inter survives the font swap unless the theme entry point changes

**What goes wrong:** The build keeps producing 14 unused Inter WOFF2 files (~670KB total, confirmed
present in this repo's own `docs/.vitepress/dist/assets/` from the last local build,
`inter-{roman,italic}-{cyrillic,cyrillic-ext,greek,greek-ext,latin,latin-ext,vietnamese}.*.woff2`),
and Workbox's `woff2` glob (`config.js:86`) precaches all of them alongside the new Source Sans 3
file.
**Why it happens:** `theme/index.js` currently imports `DefaultTheme` from `'vitepress/theme'`, which
bundles VitePress's own font CSS independent of anything `custom.css` does.
**How to avoid:** Change the import to `'vitepress/theme-without-fonts'` in the same commit as the
rest of the font-loading work.
**Warning signs:** After the swap, run `npm run docs:build` and check `docs/.vitepress/dist/assets/`
for any file matching `inter-*.woff2` — if any remain, the theme-entry-point swap didn't take effect
(check for a stale `dist/` from a previous build being reused, or a caching layer).

### Pitfall 2: Splitting the font-loading commit leaves an undeclared-font window

**What goes wrong:** If the Google Fonts `@import` is deleted before `@font-face`/`preload`/
`--vp-font-family-base` land, every page briefly renders in the browser's default sans-serif with no
warning at build time (CSS silently has no matching font-family declaration to fall back cleanly —
the bare `html{font-family:'Inter'...}` at `custom.css:94` is also being deleted in the same change,
so there is no safety net).
**Why it happens:** Four changes (delete import, add `@font-face`, add `preload`, set the variable,
delete the bare selector, swap the theme entry point) are conceptually one change but touch two files
(`custom.css`, `config.js`) plus `theme/index.js` — three files, easy to sequence across commits by
habit.
**How to avoid:** Land all of it atomically; verify with a build + visual check before moving to any
other work in this phase.
**Warning signs:** A `docs:build` succeeds (VitePress does not validate font-family values) but a
visual check shows body text in a system serif/sans-serif rather than the intended typeface.

### Pitfall 3: `docs/public/fonts/` passthrough is already proven, but `vite-plugin-imagemin` is not a risk to it

**What goes wrong:** None, if left alone — flagging this because it's the kind of thing worth
confirming rather than assuming. `vite-plugin-imagemin`'s configured plugins (`gifsicle`, `optipng`,
`mozjpeg`, `svgo`, `webp`) only match image extensions; a `.woff2` file under `docs/public/` is
unaffected by the image-optimisation pipeline `[VERIFIED: read config.js's imagemin plugin config
this session — no font/binary-generic plugin registered]`.
**Why it's listed:** So the planner doesn't spend a verification step confirming something already
established.

### Pitfall 4: existing `!important` count is higher than CONTEXT.md's "eight"

**What goes wrong:** A planner sizing "consolidate `!important` fights" as roughly eight small edits
will undercount the actual surface.
**Why it happens:** `grep -n "important" docs/.vitepress/theme/custom.css` returns 37 matches across
19 distinct rule blocks (hero, nav, sidebar, buttons, mobile media queries, print, reduced-motion),
not eight `[VERIFIED: grep against custom.css this session]`.
**How to avoid:** Treat CONTEXT.md's "eight" as referring to a specific subset (likely
padding/spacing-related declarations only, given the sentence's context: "every padding is a literal
and eight `!important` rules fight the default theme"), not the total `!important` count. The
existing 37 are correct, proven, load-bearing overrides against real VitePress specificity (Pattern 2
above) — this phase's job is to make the *values* inside them token-derived, not to remove the
`!important` qualifiers themselves.
**Warning signs:** A plan step that says "remove `!important`" without also verifying the resulting
rule still wins against VitePress's default theme is a regression risk — verify visually, not just by
reading the diff.

### Pitfall 5: ECharts has no built-in `prefers-reduced-motion` support — and the load-time read has a real (acceptable) gap

**What goes wrong:** Assuming ECharts "just handles" reduced motion, or over-engineering a
live-reactive media-query listener.
**Why it happens:** Some charting libraries (Recharts, per this session's research) auto-detect the
media feature; ECharts does not `[CITED: Apache ECharts issue/handbook discussion, via web search]`.
**How to avoid:** Use the `window.matchMedia('(prefers-reduced-motion: reduce)').matches` check UI-SPEC
already specifies, read once at each chart's `option` computed-property evaluation time (which already
re-runs on every dark-mode toggle via the existing `tick`/`isDark` watch pattern — no new reactive
plumbing is needed for the common case). The one honest gap: if a user changes the OS-level
reduced-motion setting *while the page is already open and no other reactive dependency fires*, the
chart's `animationDuration` won't update until the next unrelated re-render. This is acceptable here
specifically because entrance animations play once per mount — by the time a mid-session OS toggle
could occur, the animation this setting gates has typically already finished playing. Live-reactivity
would matter far more for continuous CSS transitions (hover states, theme-switch fades), and those are
already correctly covered by the native `@media (prefers-reduced-motion: reduce)` CSS block, which
*is* live-reactive by browser default.
**Warning signs:** None expected in practice; note this as a documented, accepted limitation rather
than a defect if raised in review.

### Pitfall 6: the two new semantic chart colours must be declared once (`:root` only), not duplicated into `.dark`

**What goes wrong:** A planner following the existing pattern (`--vp-c-brand-1` has both a `:root` and
a `.dark` value) might assume every new colour token needs a `.dark` override too, and either
duplicate `--color-negative`/`--color-positive` into `.dark` with the same value (harmless but
redundant) or, worse, invent a different dark-mode value that wasn't asked for.
**Why it happens:** Pattern-matching against the existing brand-colour convention without reading
UI-SPEC's explicit note that these two tokens are "kept identical in dark — a warning red does not
need a dark-mode shift the way brand does."
**How to avoid:** Declare `--color-negative`/`--color-positive` in `:root` only; they inherit
unchanged into `.dark` scope by normal CSS cascade — no `.dark` block entry required.

## Code Examples

### Font-loading swap (all four/five pieces, shown together as they should land in one commit)

```js
// docs/.vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme-without-fonts'   // CHANGED from 'vitepress/theme'
import './custom.css'
// Source: https://github.com/vuejs/vitepress/blob/main/docs/en/guide/extending-default-theme.md
```

```css
/* docs/.vitepress/theme/custom.css — @import at line 7 DELETED entirely, replaced with: */
@font-face {
  font-family: 'Source Sans 3';
  src: url('/fonts/source-sans-3-variable.woff2') format('woff2-variations');
  font-weight: 200 900;   /* VERIFIED against Source Sans 3's actual variable axis and against
                             @fontsource-variable/source-sans-3's own generated wght.css — exact match */
  font-style: normal;
  font-display: swap;
}
:root {
  --vp-font-family-base: 'Source Sans 3', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
/* html { font-family: 'Inter', ... } block at lines 94-99 DELETED entirely */
```

```js
// docs/.vitepress/config.js head array — ADD
["link", { rel: "preload", href: "/fonts/source-sans-3-variable.woff2", as: "font", type: "font/woff2", crossorigin: "" }]
// Source: VitePress HeadConfig type is [string, Record<string,string>] — the empty-string value for
// `crossorigin` serialises to the HTML boolean-style attribute `crossorigin=""`, which is the
// correct anonymous-mode CORS request needed for a same-origin font preload to be usable by the
// later @font-face fetch (browsers require the preload's `crossorigin` mode to match the eventual
// font request's mode, and cross-origin-capable resources like fonts always fetch in CORS mode
// regardless of same-origin status). [VERIFIED: Context7 /vuejs/vitepress — the exact
// `crossorigin: ''` pattern appears in VitePress's own documented `transformHead` font-preload
// example]
```

### ECharts reduced-motion helper (add once, call from all ten chart components identically)

```js
// echarts-setup.js — new export
export function prefersReducedMotion() {
  return typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
```
```js
// EBar.vue (and identically in ELine/EDonut/EForest/EGroupBar/EHistogram/ECombo/EFootball/EScorePath/EHeatmap)
return {
  animationDuration: prefersReducedMotion() ? 0 : 700,   // was: animationDuration: 700
  // ...
}
```

### Semantic colour resolution inside a chart component (Cisco/EFootball market-line case)

```js
// EFootball.vue — was hard-coded '#ff3b30' at two call sites (lines ~131, 137)
const t = themeTokens()
// ...
backgroundColor: t.negative,
// ...
lineStyle: { color: t.negative, type: 'dashed', width: 2 },
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|---------------|--------|
| Bundle a full weight family as static font files | Ship one variable-font file spanning the whole weight axis | Variable-font format has been broadly supported since ~2019; this codebase is only now adopting it (currently still on static per-weight Inter via Google Fonts) | One HTTP request instead of N; smaller total bytes than multiple static weights for the range this site actually uses (400/600) |
| Assume a static-site framework's default theme "just" respects a font-family override | Explicit escape hatches (`theme-without-fonts`) exist precisely because CSS variable overrides only change *rendering*, not *bundling* | Documented VitePress 2.x pattern, not new | Directly resolves this phase's font-swap correctness |

**Deprecated/outdated:** the bare `html { font-family: ... }` selector pattern this codebase currently
uses is superseded, for VitePress specifically, by the `--vp-font-family-base` variable — the bare
selector only affects elements that inherit `font-family` normally; it does not affect VitePress
internal components that explicitly reference `var(--vp-font-family-base)`.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Adobe's own GitHub releases (`adobe-fonts/source-sans`) ship the variable font in a form requiring separate subsetting | Standard Stack / Alternatives Considered | Low — this alternative is not the recommended path; if wrong, it only means the alternative is slightly easier than described, not that the recommended Fontsource-tarball path is invalid (that path was independently verified by direct extraction this session) |
| A2 | `google-webfonts-helper` categorically cannot produce variable-font output | Alternatives Considered | Low — sourced from web search cross-referencing the tool's own stated limitation, not independently tested against this tool this session; if wrong, it's a viable alternative sourcing path, not a correctness issue for the recommended approach |
| A3 | ECharts has no first-party `prefers-reduced-motion` detection in the installed version (6.1.0) | Common Pitfalls / Pitfall 5 | Low-medium — if a newer ECharts feature exists and was missed, the manual `prefersReducedMotion()` helper is still correct and harmless (redundant at worst), so no rework needed even if this assumption is wrong |

**If this table is empty:** N/A — three low-risk assumptions logged above; none affect the phase's
critical path (font sourcing and the `theme-without-fonts` finding are both directly verified, not
assumed).

## Open Questions

1. **How rigorously must POS-02's comprehension test be run, and by whom?**
   - What we know: the acceptance test is explicitly "a reader shown only the hero ... can state back
     what this person does" — a comprehension claim, and CONTEXT.md/UI-SPEC both explicitly reject
     "looks clean" as a substitute.
   - What's unclear: this is fundamentally a human-subject usability-testing method (Nielsen Norman
     Group's "5-second test" — show a design for 5 seconds, hide it, ask what was understood
     `[CITED: nngroup.com/videos/5-second-usability-test]`). An agentic workflow has no independent
     human reader to show the hero to blind.
   - Recommendation (concrete, defensible proxy — not equivalent to a real human 5-second test):
     1. **Structural verification (automatable, do this regardless):** grep the rendered hero's
        compiled HTML/frontmatter for the three required facts POS-02 names explicitly — a personal
        name, a finance-specific discipline phrase (not generic "technology"/"development"), and a
        credential string. This is a necessary-but-not-sufficient check — it verifies the words exist,
        not that a reader would parse them correctly.
     2. **LLM-as-blind-reader proxy (the cheapest defensible comprehension proxy in an agentic
        workflow):** render the hero markup in isolation (strip all other page context — nav, sidebar,
        footer, feature cards) and have a fresh, distinct model context (a sub-agent invocation with
        no prior knowledge of this project) read only that isolated HTML/rendered screenshot and
        answer, unprompted: "What does this person do?" Compare the answer against the three POS-02
        facts. This is not a human, so it cannot certify real hiring-manager comprehension — but it is
        a genuine blind-read test (the sub-agent has no access to CONTEXT.md, PROJECT.md, or any
        planning artifact that would let it "know the answer" in advance), which a self-assessment by
        the same context that wrote the copy cannot be.
     3. **State plainly in the plan/verification artifact that step 2 is a proxy, not a substitute for
        an actual human 5-second test** — if the user wants the real NN/g method run (5-6 real people,
        5-second exposure, unprompted recall), that is a manual UAT step outside this agentic
        workflow's reach, and should be offered as an optional human-verification checkpoint rather
        than silently skipped or silently claimed as satisfied.
   - This question cannot be fully closed by research; it is a methodology recommendation for the
     planner to adopt, not a fact to verify further.

2. **Exact byte count / percentage improvement from the font-loading swap.**
   - What we know: the swap removes ~670KB of unused Inter WOFF2 files (14 files, confirmed present
     in this repo's own last build) and replaces the Google Fonts CDN round-trip with one 28.7KB
     same-origin preloaded file.
   - What's unclear: total page-weight delta on a representative page (e.g. a case study with charts)
     wasn't measured this session — Lighthouse CI is out of scope for this phase per REQUIREMENTS.md
     (VER-* items are Phase 5).
   - Recommendation: not a blocker for this phase; a `du -sh docs/.vitepress/dist/assets/*.woff2`
     before/after comparison during execution is a cheap, sufficient sanity check without needing a
     full Lighthouse run.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|--------------|-----------|---------|----------|
| Node.js | Build (`vitepress build`) | Yes | v26.5.0 (repo requires v22+) | — |
| npm | Package extraction (`npm pack`), build | Yes | 11.17.0 | — |
| npm registry access | One-time `npm pack @fontsource-variable/source-sans-3` | Yes (verified this session — tarball downloaded and inspected) | — | If registry access is unavailable at execution time, fall back to Adobe's GitHub releases + manual subsetting (see Alternatives Considered — requires `fonttools`, not currently installed, would need `pip install fonttools` or `uv tool install fonttools` per this environment's Python conventions) |
| ECharts / vue-echarts | Chart theming/motion work | Yes, already installed | `echarts@6.1.0`, `vue-echarts@8.0.1` (confirmed via `npm ls`) | — |

**Missing dependencies with no fallback:** none.
**Missing dependencies with fallback:** font-source registry access has a documented fallback path
(Adobe GitHub releases + `fonttools`) if `npm pack` against the Fontsource tarball is unavailable at
execution time, though this was not needed this session.

## Security Domain

`security_enforcement` is enabled at ASVS level 1 per `.planning/config.json`, but this phase is a
positioning/typography/copy pass on a static site with no authentication, no user input processing, no
forms, and no server-side logic — the applicable ASVS surface is minimal.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-------------------|
| V2 Authentication | No | No login/auth surface exists on this site |
| V3 Session Management | No | No session state anywhere on a static site |
| V4 Access Control | No | No access-controlled resources |
| V5 Input Validation | No | No user-submitted input anywhere in this phase's scope (Contact page is a `mailto:` link, not a form — locked decision explicitly rules out a contact form) |
| V6 Cryptography | No | Nothing in this phase touches cryptographic operations |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|-----------------------|
| Third-party font CDN as a tracking/data-transfer vector | Information Disclosure | This phase's own DES-01 fix (self-hosting, deleting the Google Fonts `@import`) *is* the mitigation — no separate security action needed |
| `mailto:` link content injection | Tampering | Not applicable — the email address is a static, authored string in markdown, not derived from any input |

No new attack surface is introduced by this phase; the font-hosting change is itself a (minor)
privacy improvement (removing one third-party network request that previously sent visitor IPs to
Google's infrastructure on every page load, as already noted in `.planning/research/STACK.md`).

## Sources

### Primary (HIGH confidence)
- Direct extraction of `@fontsource-variable/source-sans-3@5.3.0`'s published npm tarball (this
  session) — inspected `files/source-sans-3-latin-wght-normal.woff2` (28,740 bytes) and the package's
  own generated `wght.css` (`font-weight: 200 900`, `format('woff2-variations')`)
- Direct read of this repo's own `docs/.vitepress/dist/assets/` — confirmed 14 bundled Inter WOFF2
  files present from VitePress's default theme, independent of the Google Fonts `@import`
- Direct read of `docs/.vitepress/theme/custom.css`, `config.js`, `theme/index.js`,
  `echarts-setup.js`, `VizEChart.vue`, `EBar.vue`, `EHeatmap.vue`, `EFootball.vue`, `VizPanel.vue`,
  `package.json`, `.github/workflows/deploy.yml` — this session
- Context7 `/vuejs/vitepress` — `extending-default-theme.md` (default-theme override pattern,
  `theme-without-fonts` variant, `transformHead` font-preload example with `crossorigin: ''`),
  `frontmatter-config.md`/`site-config.md` (`HeadConfig` type definition)
- Context7 `/fontsource/fontsource` — variable-font install pattern, `@font-face` generation code,
  WOFF2 filename convention
- `npm view` against the live registry (`@fontsource-variable/source-sans-3`, `@fontsource/inter`,
  `fontsource`) — version, publish dates, license, tarball URL
- `gsd-tools query package-legitimacy check` — verdict for `@fontsource-variable/source-sans-3`

### Secondary (MEDIUM confidence)
- WebSearch: ECharts + CSS custom properties canvas limitation, cross-referenced against
  `apache/echarts` issue tracker (#16044, #19743) and the official ECharts handbook's Style concepts
  page
- WebSearch: ECharts has no first-party `prefers-reduced-motion` support, cross-referenced against
  Recharts' contrasting built-in support (confirms the gap is ECharts-specific, not universal to
  canvas charting libraries)
- WebSearch: Nielsen Norman Group's 5-second usability test methodology, cross-referenced across
  `nngroup.com` (official) and multiple third-party UX summaries

### Tertiary (LOW confidence)
- WebSearch: `google-webfonts-helper`'s variable-font limitation — not independently tested against
  the tool this session, flagged as `[ASSUMED]` (A2 in Assumptions Log)
- WebSearch: Adobe's GitHub releases page contents (not independently downloaded this session,
  flagged as `[ASSUMED]`, A1 in Assumptions Log)

## Metadata

**Confidence breakdown:**
- Font sourcing & weight-axis verification: HIGH — directly extracted and inspected the actual binary
  and its generated CSS this session, not inferred
- VitePress theme-override mechanics (`theme-without-fonts`, CSS layering/`!important` pattern): HIGH
  — official docs (Context7) plus direct grep/read verification against this repo's own proven
  Phase-3 brand-colour override
- ECharts CSS-var/SSR/motion behaviour: HIGH — confirmed against this repo's existing, already-working
  `cssVar()`/`themeTokens()` implementation, cross-checked against ECharts' own issue tracker
- POS-02 verification methodology: MEDIUM — the proxy protocol is a reasoned adaptation of an
  established human-subject UX method into an agentic workflow context; it is explicitly not claimed
  to be equivalent to the real method

**Research date:** 2026-07-27
**Valid until:** 30 days (stable stack; the one fast-moving element — VitePress alpha releases — is
already pinned exactly per prior-phase decision, so this research doesn't degrade with a routine
`npm install`)
