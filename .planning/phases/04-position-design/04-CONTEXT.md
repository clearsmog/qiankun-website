# Phase 4: Position & Design - Context

**Gathered:** 2026-07-27
**Status:** Ready for planning
**Mode:** Smart discuss (autonomous) — 4 grey areas, all resolved with user sign-off

<domain>
## Phase Boundary

Rewrite the site's positioning copy and rebuild its typographic and visual system, together, in one
phase — because minimal copy only reads as confident when a strong type system is underneath it, and
splitting them means writing the hero twice.

**In scope:** the homepage hero and feature trio, `about.md`, `contact.md`, `projects/index.md`, the
lead paragraph and exhibit furniture of all five case studies, the type system (typeface, scale,
weights, measure), spacing and hierarchy tokens, chart styling derived from those tokens,
`prefers-reduced-motion`, 375px viewport behaviour, and dark-mode correctness.

**Out of scope:** the analysis, methodology, or findings inside any case study — reframing a lead to
put the outcome first is in scope; changing what the analysis concluded is not. No new case study, no
CV PDF, no repositioning around the energy trading career, no framework migration.

**Requirements:** POS-01–07, DES-01–04, DES-06, DES-07, DES-09–12, EXH-01–05 (22 total).
DES-05 and DES-08 were closed in Phase 3.

</domain>

<decisions>
## Implementation Decisions

### Typographic System (DES-01, DES-02, DES-03, DES-04)

- **Typeface: Source Sans 3**, self-hosted as a variable WOFF2. The CV is set in Source Sans Pro;
  Source Sans 3 is Adobe's variable successor, so CV and site read as one identity across the two
  touchpoints a hiring manager sees in the same five minutes. Inter was the considered alternative
  (visual continuity with the site today, strong tabular figures) and was declined.
- **Delivery: a manually-placed variable WOFF2 under `docs/public/fonts/`**, referenced from an
  authored `@font-face` with `font-display: swap`, plus `<link rel="preload" as="font" crossorigin>`
  in the `config.js` head. Latin subset, one file. The `@fontsource-variable/source-sans-3` npm
  route was considered and declined — less subsetting control for no real benefit here.
- **Delete the Google Fonts `@import` at `custom.css:7`.** It is render-blocking (extra DNS + TLS
  round trip before first paint) and ships a UK visitor's IP to a US Google endpoint on every page
  load. After this phase no third-party font request may remain.
- **Set `--vp-font-family-base`** and delete the bare `html { font-family }` declaration at
  `custom.css:94-99`. Today the variable is never set, so VitePress default-theme internals that
  read `var(--vp-font-family-base)` silently disagree with the rest of the page.
- **Type scale as explicit CSS custom properties in `:root`** (`--font-size-h1` … `--font-size-sm`),
  built on a 1.200 minor-third ratio, with `clamp()` for fluid headings. Consumed everywhere; no
  size literal may remain at a point of use. Baseline to replace: ~17 distinct hard-coded sizes
  across `custom.css`, `VizPanel.vue`, `projects/index.md`, and `cisco-equity-valuation.md`.
- **Weight tokens too.** The non-standard `650` weights (`projects/index.md:96`, and the Cisco page)
  are resolved to real scale steps — with a static font they silently render as 700.
- **`font-variant-numeric: tabular-nums`** on chart labels, data tables, and metric cards so columns
  of figures align. This is a finance-reader quality signal, not a nicety.
- **Spacing tokens** follow the same treatment as the type scale — defined once in `:root`, consumed
  everywhere. Today every padding is a literal and eight `!important` rules fight the default theme.

### Positioning & Identity (POS-01, POS-02, POS-03, POS-04, POS-06)

- **Hero is discipline-led.** Chosen shape:

  > Qiankun (Kenny) Zhu
  > Quantitative finance — portfolio construction, systematic alpha research, and equity valuation.
  > MSc Finance & Investment, Edinburgh · FRM
  > [ Selected work ]

  Replaces "Exploring the Universe of Code" and the "Where technology meets creativity — thoughts on
  development, open source…" tagline, which carry zero finance signal and contradict the feature
  cards directly beneath them. Work-led (no credentials) and finance-plus-energy variants were
  offered and declined.
- **No energy or commodities mention in the hero.** Consistent with the standing constraint that
  nothing about the ENN trading role appears on a public indexed page, and with the prior decision
  declining to reposition the site around the trading career. Energy's presence on the site remains
  the ETRM piece under Writing — it should not look absent, but it does not lead.
- **Name: use "Qiankun (Kenny) Zhu" once, in the hero.** The site currently brands as "Qiankun" while
  every external handle reads `KennyZhu` (`github.com/KennyZhu`, `linkedin.com/in/KennyZhu`) and the
  email is a third string — with no surname anywhere on the site. A recruiter cannot currently match
  the site to a CV or LinkedIn profile. Aligning the site to the handles is the cheaper direction.
- **Selected work reachable in one click** from the hero action (POS-03).
- **Contact: make the email a real `mailto:` link.** It is plain unclickable text today. Remove
  "*I typically respond within a few days*" — low urgency on a job-seeking portfolio's contact page.
  Keep GitHub and LinkedIn.
- **About: rewrite around verifiable facts** — degree and institution, FRM, WorldQuant BRAIN Gold,
  and what he actually builds. Cut "I'm passionate about technology, quantitative systems, and
  software development", "Welcome! I'm Qiankun, and this is my personal website", "This site shares
  writing, projects, and learnings", and "*Thanks for visiting!*" — currently the entire
  self-description is unfalsifiable, and the etymology of the name gets more words than the career.
  Reduce the etymology to at most one line.

### Case Study Leads & Jargon (POS-05, POS-07)

- **Outcome-first two-sentence lead template** applied to all five case studies and all five index
  cards: sentence one states what it produced, sentence two states how. Today **0 of 5 lead with the
  outcome** — four lead with method, and Cisco recovers only in its second paragraph.
- **Jargon carries an inline parenthetical translation on first use** in any lead or summary — e.g.
  "tracking error (how far the fund can drift from its benchmark)". Not a glossary block.
- **Index ordering by strength and job-relevance**, not the current sidebar-derived order:
  1. Global Equity Portfolio Construction (£10M mandate, institutional risk reporting)
  2. Cisco Equity Valuation (the only page with an explicit stated verdict)
  3. WorldQuant BRAIN Alpha Research (external, independently verifiable credential)
  4. Board Gender Diversity & ESG (strongest methodology; honest null result)
  5. UK Finance Pay (weakest; see below)
- **Academic framing: cut marks and course codes, keep institution and date.** Remove
  "Mark: 73 (A band)" from the Cisco lead and index card, and course codes (`CMSE11664`,
  `CMSE11621`). "University of Edinburgh · June 2026" stays as provenance. A published mark reads as
  coursework rather than analyst work.
- **`board-diversity-esg.md` has three different titles** (frontmatter, H1 "Do Women Directors Move
  ESG?", and index card). Reconcile to one.

### Exhibit Quality Bar & Restraint (EXH-01–05, DES-06, DES-07, DES-09–12)

- **`VizPanel.vue` gains `source` and `as-of` props**, rendered as a caption line beneath the
  exhibit. Today it accepts only `badge`/`title`/`subtitle`, which makes EXH-02 and EXH-04
  structurally impossible to satisfy without inlining prose. This is the enabling change for the
  whole exhibit bar.
- **Chart components gain axis-title support.** Only `EHeatmap` has `xName`/`yName` today; `EBar`,
  `ELine`, `EDonut`, `EForest`, `EGroupBar`, `EHistogram`, and `ECombo` set tick formatters only, so
  units appear as bare suffixes or not at all.
- **One shared number-formatting convention** across all five case studies: 1dp for percentages, 2dp
  for per-share currency, whole basis points, thousands separators, `tabular-nums` throughout.
- **Every exhibit gets an as-of date and a named data source.** Specifically: the Cisco page's
  `$120.16` market-price anchor — the pivot of its entire claim — is never stamped with an
  observation date; the Global Equity VaR/CVaR exhibit has no estimation window and names its source
  ("Bloomberg equity/ESG") only in a `## Stack` line at the page foot.
- **UK Finance Pay is relabelled honestly, not rebuilt.** Its charts are hand-set figures
  (`realSeries = [100, 102, 108, 115, 122, 128, 132]`) and its own subtitles admit it — "Schematic
  index", "Path consistent with the project narrative", "Real change by role (illustrative)" —
  while the Cisco page claims "The number you see on any exhibit is computed, never typed." Two
  incompatible evidentiary standards under one roof is a direct threat to the Core Value. Actions:
  frame the page explicitly as an illustrative data-storytelling exercise at the top, remove the
  `{ label: 'Views', value: '8', hint: 'ONS-backed panels' }` metric tile (slide count dressed as a
  finding), and strip any phrasing implying ONS-plotted precision. Plotting it from real ONS data
  was offered and declined as out of milestone scope; deletion was offered and declined.
- **`prefers-reduced-motion` is currently handled only permissively** — two `no-preference` gates
  (`custom.css:154`, `custom.css:437`) and **no `reduce` block anywhere**. Everything else keeps
  animating: theme-switch transitions (`custom.css:110-115`), `.VPFeature` hover scale, `.VPButton`
  scale, `.project-card` lift, and all ten ECharts entrance animations (700–900ms), none of which
  consults the query. Add a real `reduce` block and gate the ECharts `animation` option.
- **Restraint (DES-12):** remove the homepage feature-icon `#667eea → #ec4899` purple/pink gradient —
  it belongs to no palette on the site, whose brand is Apple blue.
- **Delete the three registered-but-unused components** — `MetricCards.vue`, `ProjectChart.vue`,
  `ProcessSteps.vue` are globally registered in `theme/index.js` but used in zero markdown files.
  They duplicate the design language of `HeroMetrics`/`VizPanel`/`ProcessRail`.
- **Consolidate the three competing style layers**: tokens in `custom.css`, a page-local `<style>`
  block in `projects/index.md:56-113`, and another at the tail of `cisco-equity-valuation.md`.
  `.project-card` (14px radius) and `.VPFeature` (18px radius) are two card systems on adjacent
  pages — unify them.
- **Chart palettes** are hard-coded hex literals repeated inline across all five markdown files
  (23 occurrences of `#0071e3` alone, plus `#5856d6`, `#af52de`, `#34c759`, `#ff9500`, …). These must
  derive from tokens (DES-07) and re-theme in dark mode (DES-11) — carried forward from Phase 3
  verification, where they were correctly ruled out of DES-05's scope.
- **`custom.css` still expresses the brand as four raw RGB literals** independent of
  `--vp-c-brand-1` (`--vp-c-brand-soft`, and `rgba(0, 113, 227, …)` at lines 429 and 486). Phase 3's
  `assertBrandInSync()` structurally cannot cover these. Fold into this phase's token work.

### Scope Additions Accepted by the User

Both sit just outside Phase 4's 22 mapped requirements and were explicitly folded in:

- **Replace the SVG `og:image` with a PNG** (`config.js:140,147`). LinkedIn, Slack, Twitter/X and
  iMessage do not render SVG OG images, so every share of the CV URL currently previews blank.
  Formally VER-05 (Phase 5), pulled forward because the URL is already in circulation.
- **Replace the site description and footer.** `config.js:57` still reads "Personal website and blog
  - thoughts on technology, development, and more" — this is the Google search-result snippet — and
  the RSS description (`config.js:44`) matches. The footer (`config.js:235`) reads "Built with
  VitePress", advertising the tooling on a page meant to advertise the person. This is positioning
  copy, so it belongs with POS work.

### Claude's Discretion

- Exact wording of every rewritten sentence, within the decided structure and the facts on record.
- The precise type-scale step values, provided they derive from the 1.200 ratio and live in `:root`.
- Spacing token names and granularity.
- The caption layout for `source` / `as-of` on `VizPanel`.
- Commit granularity and plan/wave decomposition, provided each commit builds.
- Whether the OG PNG is authored by hand or generated at build time.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets

- `VizPanel.vue` — exhibit wrapper (`badge`/`title`/`subtitle`); the extension point for provenance.
- `HeroMetrics`, `VizPanel`, `ProcessRail` — the live design language; `MetricCards`, `ProjectChart`,
  `ProcessSteps` are their dead predecessors.
- Twelve ECharts components under `theme/components/viz/`, all converted in Phase 3 to
  `watch(isDark, …, { flush: 'post' })` — theme reactivity is sound and must not regress.
- `theme/tokens.js` — Node-side brand export, guarded by `assertBrandInSync()` in `config.js:24-37`.
- `docs/public/` is served at site root, so `docs/public/fonts/` resolves as `/fonts/…`.
- `config.js:86` already globs `woff2` into the Workbox precache — no woff2 exists yet to match.

### Established Patterns

- Colour tokens live in `custom.css` `:root` with a `.dark` override block; this is the pattern the
  new type and spacing tokens should follow.
- Vue 3 `<script setup>`, scoped styles, props documented in an inline comment above `defineProps`.
- Charts are canvas-rendered at `devicePixelRatio: 2` (`VizEChart.vue:47`).

### Integration Points

- `docs/index.md` frontmatter drives the hero and feature trio (VitePress home layout).
- `config.js` head array — where the font `preload`, OG tags, and description live.
- `custom.css` `:root` / `.dark` — where all new tokens land.
- `theme/index.js` — global component registration; the three dead registrations are removed here.

</code_context>

<specifics>
## Specific Ideas

- The hero shape is fixed as written above — name, one line of substance, credential line, single
  action into selected work. It is deliberately quiet; the work is meant to carry the argument.
- The acceptance test for POS-02 is comprehension, not aesthetics: a reader shown only the hero, with
  no other context, must be able to state back what Qiankun does and his area of expertise. Plan a
  check that actually tests this rather than asserting "looks clean".
- DES-06 and DES-10 both specify *side-by-side* comparison across pages, and DES-10 names 375px
  explicitly. Verification should be a real cross-page sweep at that width and in dark mode, not a
  per-page spot check.
- EXH-03 says formatting consistency is verified "by a per-case-study audit, not spot-checked".

</specifics>

<deferred>
## Deferred Ideas

- **Plotting UK Finance Pay from real ONS data** — offered and declined for this milestone as new
  analysis rather than framing. Revisit in a later milestone if the page is to make data claims.
- **SVG rendering fallback for charts** — canvas at `devicePixelRatio: 2` means no exhibit is
  selectable, searchable, screen-reader accessible, or printable at quality. Real, but a rendering
  architecture change well beyond a polish pass.
- **An energy/commodities case study** — explicitly out of scope for this milestone.
- **Renaming the GitHub/LinkedIn handles** to match "Qiankun" — the cheaper direction was chosen
  (align the site to the handles), so this stays available but unplanned.
- **VER-01/VER-03 link checking and CI** — Phase 5.
- **VER-06 Search Console removal submissions** — Phase 5, and requires console access.

</deferred>
