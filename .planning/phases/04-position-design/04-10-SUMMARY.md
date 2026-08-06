---
phase: 04-position-design
plan: 10
subsystem: content
tags: [vitepress, writing-index, cross-page-sweep, number-reconciliation, comprehension-proxy, dark-mode, reduced-motion, 375px]

# Dependency graph
requires:
  - phase: 04-position-design
    provides: "04-02's token layer + reduce block; 04-03's hero/About/Contact/metadata; 04-04's prefersReducedMotion() and VizPanel provenance props; 04-05's locked index cards and 260px grid floor; 04-07/08/09's per-page number enumerations, grey-series tables and exhibit stamps"
provides:
  - "Writing index framed as a deliberate body of writing: one intro sentence under the H1; Phase-2 locked structure (linked H3 + description + publication date) untouched"
  - "Ten-page cross-cutting audit record: consistency, 375px, dark-mode and motion passes with the code-verifiable half settled and the visual half explicitly deferred to the Phase-5 Chrome walkthrough"
  - "Merged cross-page EXH-03 number-formatting table over all five case studies — zero cross-page disagreements"
  - "All 28 exhibit subtitles judged for EXH-05 — 28/28 state a takeaway"
  - "POS-02 answered by a genuine blind read (fresh claude -p context, isolated hero markup, no planning-artefact access): all three facts returned unprompted — recorded as a proxy, not a substitute, for the human five-second test"
affects: [phase-05-verification]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Blind-read comprehension proxy: extract the rendered surface from dist, strip everything else, hand it to a fresh CLI model context launched outside the repo with one unprompted question"

key-files:
  created: []
  modified:
    - docs/blog/index.md

key-decisions:
  - "Writing index: of the three remnant-feed failure modes, only (c) sparse-spacing held — a bare H1 followed by one lone H3 reads as 'the post left after a cull'. Fixed with one intro sentence in the meta-description's voice; structure untouched"
  - "Case-study data tables need no scroll wrapper: VitePress's own `.vp-doc table { display: block; overflow-x: auto }` is confirmed present in the built CSS — tables self-scroll at 375px, no font shrink, viewport-contract row settled by framework default"
  - "Snapshot 375px truncation is structurally impossible: HeroMetrics labels/hints carry no nowrap/ellipsis/fixed-width — text wraps; longest unbreakable token 'P(undervalued)' fits a 2-col tile"
  - "Visual halves of DES-06/10/11 and DES-09 emulation deferred to the Phase-5 Chrome walkthrough per orchestrator directive — recorded per-pass below and appended to the broken-windows ledger, not silently claimed"
  - "Requirements POS-02, DES-06, DES-09, DES-10, DES-11, EXH-03, EXH-05 marked complete — code-verifiable halves settled here, visual confirmation carried on the ledger into Phase 5 (same treatment as 04-07..09's completions)"

patterns-established:
  - "Cross-page audit = merge per-page enumerations, then look only for disagreement between pages that each satisfied their own rule"

requirements-completed: [POS-02, DES-06, DES-09, DES-10, DES-11, EXH-03, EXH-05]

coverage:
  - id: D1
    description: "Writing index reads as a body of writing; typography inherits site tokens; empty state recorded unreachable"
    requirement: "DES-06 (this page), backstops B2/B3"
    verification:
      - kind: automated_ui
        ref: "npm run docs:build exits 0; dist/blog/index.html exists; grep -c '^### \\[' returns 1; no plural collection noun on the page; no blog-specific CSS rule exists (page inherits .vp-doc tokens by construction)"
        status: pass
      - kind: manual
        ref: "Two-tab size/weight comparison vs /about and the stranger's read at 375px/dark deferred to the Phase-5 Chrome walkthrough"
        status: deferred
    human_judgment: true
  - id: D2
    description: "Ten-page consistency / 375px / dark-mode / motion sweep"
    requirement: "DES-06, DES-09, DES-10, DES-11"
    verification:
      - kind: automated_ui
        ref: "Code battery below — zero heading/spacing literals outside documented exceptions; tables self-scroll (dist CSS); grid floors verified; zero hex in all five script blocks; reduce block in dist CSS; 10/10 chart components gate animationDuration on prefersReducedMotion(); build exits 0"
        status: pass
      - kind: manual
        ref: "Side-by-side tab comparison, 28-exhibit 375px canvas inspection (B1), dark-mode toggle scroll, reduced-motion emulation — deferred to Phase-5 Chrome walkthrough (windows ledger entry 2)"
        status: deferred
    human_judgment: true
  - id: D3
    description: "Merged EXH-03 reconciliation, EXH-05 28-subtitle judgement, POS-02 structural check + blind read"
    requirement: "EXH-03, EXH-05, POS-02"
    verification:
      - kind: automated_ui
        ref: "Merged table below (0 disagreements, spot-verified by grep against the files); 28/28 subtitles judged yes; dist greps — name present, 'portfolio construction' 5, 'systematic alpha research' 5, 'equity valuation' 5, 'FRM' 2; blind read from a fresh context returned all three facts"
        status: pass
      - kind: manual
        ref: "Real NN/g five-second test (5–6 people, 5 s exposure, unprompted recall) — offered as optional follow-up, not claimed"
        status: deferred
    human_judgment: true

# Metrics
duration: 25min
completed: 2026-08-06
status: complete
---

# Phase 4 Plan 10: Cross-Page Sweep & Writing Index Summary

**The Writing index now opens with one framing sentence so its single post reads as chosen rather than as a remnant feed, the four comparative requirements are closed by enumeration — ten pages per pass, 28 exhibits, one merged number table with zero cross-page disagreements, 28/28 takeaway subtitles — and a genuinely blind reader (a fresh model context handed only the isolated hero markup) stated back the name, all three finance disciplines and both credentials unprompted.**

## Performance

- **Duration:** ~25 min
- **Started:** 2026-08-06T14:46:57Z
- **Completed:** 2026-08-06
- **Tasks:** 3
- **Files modified:** 1

## Accomplishments

- Writing index: one-post reading settled (one intro sentence added under the H1; Phase-2 structure untouched); typography confirmed to inherit `.vp-doc` tokens with zero blog-specific rules; empty state recorded still-unreachable
- Ten-page × four-pass sweep: every code-verifiable check settled clean; every visual check enumerated and explicitly deferred to Phase 5, per-page, on the broken-windows ledger
- EXH-03 closed by a merged cross-page table built from the 04-07/08/09 enumerations — zero disagreements between pages
- EXH-05 confirmed across all 28 exhibits — every subtitle states a takeaway
- POS-02 closed by structural greps on the built homepage plus a blind read from a fresh `claude -p` context with no access to the repo or planning artefacts — all three facts returned

## Task Commits

1. **Task 1: Writing index one-post framing** - `bc77675` (feat)
2. **Task 2: Cross-page sweep** - audit-only, no file change, no commit (a clean sweep is the recorded result)
3. **Task 3: Number reconciliation + comprehension proxy** - audit-only, no file change, no commit (zero disagreements, no fix needed)

**Plan metadata:** commit pending (this SUMMARY + STATE/ROADMAP/REQUIREMENTS updates)

## Task 1 Record — Writing Index (backstops B2, B3)

**Typography check:** `grep -n "blog" custom.css` returns nothing — no rule targets this page; it inherits the `.vp-doc` h1/h3/prose tokens every other content page uses, so size/weight/colour match is by construction. Visual two-tab confirmation vs `/about` deferred to Phase 5.

**One-post reading (B3):** three failure modes checked — (a) plural-collection heading: no ("Writing" is a mass noun; description says "Notes on…", describing the body, not counting items); (b) feed timestamp: no (`*19 January 2026*` is publication-date form); (c) sparse spacing reading as a deleted-list remnant: **held** — a bare H1 followed immediately by one lone H3 read as "the post left after a cull". Fixed with one sentence under the H1: *"Notes on the systems I build, written from direct implementation experience."* — the meta-description's voice, no stream implied, no restructure. **B3 settled.**

**Empty state (B2):** still unreachable — the single post is retained and nothing in the build removes it; no empty-state branch was added (building for a state that cannot occur). **B2 carried forward**, unchanged from Phase 2's deferred-verification record.

## Ten-Page Per-Pass Enumeration (Task 2)

Legend: **code ✓** = settled by file/dist inspection this plan; **P5** = visual confirmation deferred to the Phase-5 Chrome walkthrough (windows ledger entry 2).

| Page | Pass 1 consistency | Pass 2 375px | Pass 3 dark mode | Pass 4 motion |
|---|---|---|---|---|
| Home `/` | code ✓ hero/trio verbatim per UI-SPEC; icons on `var(--vp-c-brand-1)`; P5 | code ✓ VPFeatures collapses (framework default); P5 | code ✓ no literals; P5 | code ✓ hero fade + hover under reduce block; P5 |
| About | code ✓ `.vp-doc` tokens, no local styles; P5 | code ✓ prose in measure; P5 | code ✓; P5 | code ✓; P5 |
| Contact | code ✓ three authored links; P5 | code ✓ mailto wraps in measure; P5 | code ✓; P5 | code ✓; P5 |
| Projects index | code ✓ card CSS in custom.css (04-05); P5 | code ✓ minmax floor 260px at custom.css:298; P5 | code ✓; P5 | code ✓ card lift under reduce block; P5 |
| Cisco | code ✓ sole page-local style block = logo/brand chips, deliberate (04-05 PATTERNS note), styles no heading; P5 | code ✓ DCF table self-scrolls (dist CSS `.vp-doc table{overflow-x:auto}`); Snapshot wraps; 13 canvases → B1/P5 | code ✓ 0 hex in script block; logo chips keep `#fff` deliberately (logo legibility) — flagged for P5; P5 | code ✓ ELine + siblings gated; hover transition under reduce block; P5 |
| Global Equity | code ✓ no local styles; P5 | code ✓ Snapshot wraps; 4 canvases → B1/P5 | code ✓ 0 hex; Market wedge on `'muted'`→`t.text3`; P5 | code ✓; P5 |
| Board Diversity | code ✓ no local styles; P5 | code ✓ hypothesis table self-scrolls; 2 canvases → B1/P5 | code ✓ 0 hex; P5 | code ✓; P5 |
| WQ BRAIN | code ✓ no local styles; P5 | code ✓ Snapshot wraps; 4 canvases → B1/P5 | code ✓ 0 hex; `3qRa0A96` bars on `'muted'`; P5 | code ✓; P5 |
| UK Finance Pay | code ✓ no local styles; P5 | code ✓ Snapshot (3 tiles) wraps; 5 canvases → B1/P5 | code ✓ 0 hex; erosion tile `var(--color-negative)`; three greys on `'muted'`; P5 | code ✓; P5 |
| Writing | code ✓ inherits `.vp-doc`, no blog rules; P5 | code ✓ prose in measure; P5 | code ✓; P5 | code ✓; P5 |

**Pass 1 basis (site-wide literal scan):** zero `font-size`/`font-weight`/heading overrides in any page markdown; `custom.css` raw-value scan finds only the `@font-face` weight-range descriptor (`font-weight: 200 900`, untokenizable, pre-existing) and the documented relative-em code-span rule (`font-size: 0.875em`, deliberate with comment). All heading sizes flow from `--font-size-h1/h2/h3` via `.vp-doc h1/h2/h3` — an h2 on a case study, on About and on the projects index resolves to the same token by construction.

**Pass 2 basis:** VitePress ships `.vp-doc table { display: block; overflow-x: auto }` — confirmed present in the built `style.CsSxqv3w.css`, so both flagged data tables self-scroll with no wrapper and no font-size reduction. `HeroMetrics` tiles have no `white-space: nowrap`, no `text-overflow`, no fixed label width — labels and hints wrap rather than truncate, and the longest unbreakable token (`P(undervalued)`, 14 ch at caption size) fits a two-column tile. `VizGrid` stacks at ≤860px; `.project-card` floor is 260px. The only 375px item code cannot settle is chart-canvas axis-label clipping — **backstop B1 remains open for Phase 5** (below).

**Pass 3 basis:** zero colour hex in all five case-study script blocks (site total: one `#6e6e73` inside Cisco's tail `<style scoped>`, page-local CSS, deliberate); all series resolve through the theme-reactive palette or the four semantic names; the consolidated grey-series register (8 entries from 04-07/08/09) all resolve to `t.text3`/`t.text2`. Known intentional exception: Cisco's logo/brand chips keep `background: #fff` in dark mode for logo legibility — flagged for the Phase-5 look.

**Pass 4 basis:** `@media (prefers-reduced-motion: reduce)` universal override present at custom.css:583 and in the built CSS; the two `no-preference` gates retained (lines 213, 563); `prefersReducedMotion()` exported at echarts-setup.js:95; **10/10** components carrying `animationDuration` gate it (`EBar, ECombo, EDonut, EFootball, EForest, EGroupBar, EHeatmap, EHistogram, ELine, EScorePath` — the full set; no ungated component exists). Restoration when unset is the same `matchMedia` check evaluating false on the next option computation. Emulation run deferred to P5.

## 28-Exhibit 375px Inspection List (backstop B1)

All 28 exhibits enumerated (13 + 4 + 2 + 4 + 5 = 28, matching the `<VizPanel` counts). Code-verifiable notes recorded; the clipping/overlap judgement itself **cannot be settled from files** (UI-SPEC's own finding) and is deferred to Phase 5 per orchestrator directive — B1 stays open on the windows ledger.

| # | Page | Exhibit | Code note | Visual |
|---|---|---|---|---|
| 1 | Cisco | Segment revenue mix (1a) | donut, no axes | P5 |
| 2 | Cisco | Geographic revenue mix (1b) | donut, no axes | P5 |
| 3 | Cisco | Revenue trajectories bull/base/bear | ELine, axis titles ≤22 ch | P5 |
| 4 | Cisco | Revenue & GAAP op. margin | ECombo dual-axis | P5 |
| 5 | Cisco | WACC build | EBar horizontal — `catAxis.axisLabel.width: 110` is the named B1 risk | P5 |
| 6 | Cisco | Base-case revenue & FCFF path | ECombo | P5 |
| 7 | Cisco | Triangulation football field | EFootball | P5 |
| 8 | Cisco | Peer multiples (Exhibit 4) | EGroupBar | P5 |
| 9 | Cisco | Sensitivity grid | EHeatmap 5×5 | P5 |
| 10 | Cisco | Implied growth | EBar | P5 |
| 11 | Cisco | Implied WACC | EBar | P5 |
| 12 | Cisco | Monte Carlo histogram | EHistogram | P5 |
| 13 | Cisco | Scenario bridge | EBar | P5 |
| 14 | Global Equity | DM composite factor weights | EBar horizontal (110px label width) | P5 |
| 15 | Global Equity | Sector weights | donut, no axes | P5 |
| 16 | Global Equity | Tracking-error decomposition | donut, no axes | P5 |
| 17 | Global Equity | VaR/CVaR at 95% | EBar | P5 |
| 18 | Board Diversity | Diversity effect forest | EForest | P5 |
| 19 | Board Diversity | Coefficient as % of pillar mean | EBar | P5 |
| 20 | WQ | Challenge score path | EScorePath dual-axis | P5 |
| 21 | WQ | ACTIVE alphas by Sharpe | EBar | P5 |
| 22 | WQ | Turnover-adjusted Fitness | EBar | P5 |
| 23 | WQ | Book composition by theme | donut, no axes | P5 |
| 24 | UK Pay | Finance vs whole-economy pay | ELine | P5 |
| 25 | UK Pay | Nominal vs real pay | ELine | P5 |
| 26 | UK Pay | Real change by role | EBar | P5 |
| 27 | UK Pay | London vs rest of UK | ELine | P5 |
| 28 | UK Pay | Story weights | donut, no axes | P5 |

## Merged EXH-03 Number-Formatting Table (Task 3 — the cross-page reconciliation)

Input: the three per-page enumerations in 04-07 (Cisco), 04-08 (Global Equity, Board Diversity) and 04-09 (WQ, UK Pay), spot-verified against the current files by grep (`$9.0B` ×1, `2.133` ×4, `~60%` ×2, `2.91` ×5, `10M|10 million` ×4, `18,101` ×3 — all present as enumerated). **Cross-page disagreements found: 0.** All four same-page fixes were already applied upstream (04-07: `$9B`→`$9.0B`, `$4B`→`$4.0B`; 04-08: `+2.13***`→`+2.133***` ×2); this reconciliation required no new change.

| Value type | Rule | Cisco | Global Equity | Board Diversity | WQ | UK Pay | Agreement |
|---|---|---|---|---|---|---|---|
| Per-share currency | 2 dp | `$48.56`, `$120.16`, `$59.63`… all 2 dp | — | — | — | — | sole page; compliant |
| Aggregate currency | 1 dp + suffix | `$56.7B` family incl. fixed `$9.0B`/`$4.0B`; round-figure carve-outs `$478B`, `$3B–$100B` | `£10M` round mandate — same carve-out class as `$478B` | — | — | — | ✓ identical round-figure exception class on both pages that use it |
| Percentages (measured/computed) | 1 dp | `17.8%`, `4.9%`, `−15.5%`… | `6.8%`, sector/TE/VaR arrays | `6.8 / 2.4 / 4.8` | ACTIVE Return/TO columns all 1 dp | `−4.7%` | ✓ 1 dp on all five |
| Percentages (exact round design values) | whole, no forced padding | weights `45/30/25`, mix `59/26/14` | caps `7/35/15`, factor weights | — | theme donut `35/20/20/15/10` | story donut `40/25/20/15` | ✓ same integer carve-out wherever it appears |
| Percentages (coherent model-parameter family) | model precision | WACC family 2 dp (`8.93%`, `4.10 = 4.50 − 0.40`…) | — | — | — | — | sole page; documented (display arithmetic must cohere; heatmap base-cell must match labels) |
| Approximations | honest precision + `~`/`≈` marker | `≈$120`, `~$61`, `~9%` | `~80%/20%`, `~29` | — | `~2.8–3.0`, `~25.8k` | `~60%`, `~22%` | ✓ identical marker convention |
| Coefficients / ratios | as the source reports | `β 1.067`, multiples 1 dp (`29.6×`) | — | `2.133`/`1.08` (aligned to model in 04-08) | Sharpe/Fitness at platform 2 dp (`2.91`) | — | ✓ as-reported everywhere; differing dp across pages is the rule working, not a conflict |
| Integers ≥ 1,000 | thousands separator | `50,000`, `3,982`, `$60,746M`, DCF table | none rendered | `2,270`, `18,101` | `9,932`, `2,000`, `4,300` | none rendered | ✓ separated on every page that renders one |
| Index values | as the series carries | — | — | — | — | `160/100`, `145/100`, `95.5/95.3` (byte-protected hand-set series) | sole page; illustrative framing carries them |

## EXH-05 — 28 Subtitle Takeaway Judgements

Standard applied identically on all five pages: does the subtitle state what a reader should take, not merely what is shown? Exhibits numbered as in the B1 table above.

| # | Subtitle (abbrev.) | Takeaway? |
|---|---|---|
| 1 | "Security and Observability growth is largely Splunk-driven — the model isolates inorganic contribution" | yes |
| 2 | "the same weights blend the regional equity risk premia in §4" | yes |
| 3 | "bear path embeds the FY2022–24 pull-forward reversal precedent…" | yes |
| 4 | "Non-linear history… the reason the forecast is built segment-by-segment" | yes |
| 5 | "Equity weight ~94% means WACC ≈ cost of equity. Result: 8.93%." | yes |
| 6 | "deliberately below the growth the market price implies" | yes |
| 7 | "Market $120.16 sits ~$61 above the bull DCF… only the multiples band reaches the price" | yes |
| 8 | "Peer medians import growth Cisco doesn't have… 31–39% above what fundamentals justify" | yes |
| 9 | "Even the most generous corner stays $41 below the market" | yes |
| 10 | "The market prices 17.8% constant revenue growth vs the 4.9% base path" | yes |
| 11 | "a 5.79% discount rate, 314bp below the bottom-up 8.93%" | yes |
| 12 | "The entire distribution sits below the $120.16 market price" | yes |
| 13 | "within a dime of the base case — the verdict does not hinge on scenario probabilities" | yes |
| 14 | "Quality and momentum lead; valuation and growth balance the book…" | yes |
| 15 | "Active IT sleeve with industrials and financials diversification" | yes |
| 16 | "Idiosyncratic + style dominate; market contribution kept small" | yes |
| 17 | "Parametric and Cornish–Fisher sit near ~10% of NAV… both families are reported" | yes |
| 18 | "E and S rise… the real outcomes; the still-larger G coefficient flags mechanical inflation" | yes |
| 19 | "E moves more relative to its mean than S; G shown only for measurement context" | yes |
| 20 | "Rank improved from ~25.8k to ~18.9k as scored alphas and ACTIVE count rose" | yes |
| 21 | "Best: quality + analyst blend at 2.91" | yes |
| 22 | "The top Sharpe alphas hold their lead once turnover is penalised" | yes |
| 23 | "Not ten clones… axes chosen to pass self-correlation" | yes |
| 24 | "On the order of a ~60% premium in the RTI industry comparison" | yes (hedged takeaway, per the 04-09 reframe) |
| 25 | "Path consistent with the project narrative (~−4.7% real median)" | yes (hedged) |
| 26 | "Aggregate medians hide winners and losers after CPIH" | yes |
| 27 | "Geographic premium is first-order — not only sector choice" | yes |
| 28 | "Levels premium survives; real erosion, region, and gender complete the picture" | yes |

**Result: 28/28 yes — no rewrites needed.** No exhibit anywhere on the site is purely decorative.

## POS-02 Comprehension Check (Task 3)

**Part one — structural (necessary, not sufficient).** Greps on `docs/.vitepress/dist/index.html`: `Qiankun (Kenny) Zhu` present; `portfolio construction` ×5; `systematic alpha research` ×5; `equity valuation` ×5; `FRM` ×2; tagline renders as `MSc Finance & Investment, Edinburgh · FRM`. All three fact classes present in the rendered page.

**Part two — blind read.** The hero block was extracted from the built homepage with everything else stripped — the captured markup is the single `VPHero` div containing only the name heading, the discipline line, the tagline, one `Selected work` button and the logo image; no navigation, sidebar, footer or feature card is present:

```html
<div class="VPHero has-image VPHomeHero">…<h1 class="heading"><span class="name clip">Qiankun (Kenny) Zhu</span><span class="text">Quantitative finance — portfolio construction, systematic alpha research, and equity valuation.</span></h1><p class="tagline">MSc Finance & Investment, Edinburgh · FRM</p>…<a class="VPButton medium brand" href="/projects/">Selected work</a>…<img class="VPImage image-src" src="/logo.svg" alt="Qiankun">…</div>
```

This isolated markup was handed to a **fresh `claude -p` context launched from a scratchpad directory outside the repository** — no access to `.planning/`, the UI-SPEC, or any project artefact — with the single unprompted question: *"what does this person do?"* The answer, verbatim:

> Based on the HTML markup, **Qiankun (Kenny) Zhu** works in **quantitative finance**, specifically in:
> - Portfolio construction
> - Systematic alpha research
> - Equity valuation
>
> He holds an MSc in Finance & Investment from Edinburgh and is an FRM (Financial Risk Manager).

**Three-fact check:**

| Required fact | Reader stated | Pass |
|---|---|---|
| A person named Qiankun (Kenny) Zhu | "Qiankun (Kenny) Zhu" | ✓ |
| Quantitative finance across portfolio construction, systematic alpha research, equity valuation | all three areas listed by name | ✓ |
| Credentials: Edinburgh Master's + FRM | "MSc in Finance & Investment from Edinburgh and is an FRM (Financial Risk Manager)" | ✓ |

**Proxy caveat (stated plainly):** this blind read is a **proxy** for the human five-second usability test POS-02's acceptance criterion describes, not a substitute for it. The real method (NN/g five-second test) requires 5–6 real people, roughly five seconds of exposure to the rendered hero, then unprompted recall. That is a manual step outside this workflow's reach and is offered as an optional follow-up. What this proxy does establish: a reader with no prior knowledge of the project — one who could not "know the answer in advance" — parsed all three facts from the markup alone, which a self-assessment by the context that wrote the copy could not establish.

## Backstop Status

| # | Backstop | Status |
|---|---|---|
| B1 | Chart-canvas axis-label clipping at 375px | **Open — deferred to Phase-5 Chrome walkthrough** (all 28 exhibits enumerated above; windows ledger entry 2). Not settleable from files, by UI-SPEC's own finding. |
| B2 | Writing-index empty state | **Still unreachable** — the single post is retained and nothing in the build removes it; no empty-state branch added (building for an unreachable state). Carried forward from Phase 2. |
| B3 | Writing index one-post reading | **Settled** — failure mode (c) held and was fixed with one intro sentence; (a) and (b) did not hold. |

## Deviations from Plan

**1. [Adaptation — orchestrator directive] Visual sweep halves deferred to Phase 5.** The plan's human-checks (two-tab side-by-side comparison, 375px canvas inspection of all 28 exhibits, dark-mode toggle scroll, reduced-motion emulation, Writing-vs-About two-tab comparison) require a running browser. Per the execution directive for this run, everything verifiable from code, grep and the built output was settled here; the visual halves are enumerated per page and per exhibit above, recorded on the broken-windows ledger, and land in the Phase-5 Chrome walkthrough — the same treatment 04-07/08/09 applied to their human-check halves. Nothing visual is claimed as seen.

**2. [Plan-granted discretion] Writing index intro sentence.** The plan authorises "adjust the copy or spacing if any of those hold" — failure mode (c) held, one sentence added, structure untouched. Recorded as the plan's own fix path, commit `bc77675`.

No Rule-1/2/3 auto-fixes were needed: the sweep found zero defects in code.

## Authentication Gates

None.

## Issues Encountered

None. The single `npm run docs:build` gate passed first try (47 s); no fix required a re-build.

## Deferred to Phase-5 Chrome Walkthrough

- The full visual sweep: side-by-side consistency tabs, 375px walk of all ten pages (incl. horizontal-scrollbar confirmation and the 28-exhibit B1 inspection), dark-mode toggle at both widths (incl. Cisco's intentional white logo chips and the tertiary-token caption contrast), reduced-motion emulation on/off
- Writing index vs About two-tab size/weight comparison, and the stranger's read at 375px/dark
- Optional: the real NN/g five-second test on the hero with real readers, if the user wants the non-proxy method

## Known Stubs

None.

## User Setup Required

None.

## Next Phase Readiness

- Phase 4 is 10/10 complete. All 22 phase requirement IDs now marked complete in REQUIREMENTS.md.
- Phase 5 (verification) inherits: two open windows-ledger entries (04-07's and this plan's deferred visual halves), the B1/B2 backstops, and the two Phase-1/2 console-blocked items in STATE's deferred-verification table.
- No blockers.

## Self-Check: PASSED

- FOUND: commit bc77675
- FOUND: docs/blog/index.md (`grep -c '^### \['` = 1)
- FOUND: .planning/phases/04-position-design/04-10-SUMMARY.md
- CONFIRMED: `npm run docs:build` exits 0 (47 s); `dist/blog/index.html` exists
- CONFIRMED: dist greps — hero name present, `portfolio construction` ×5, `FRM` ×2
- CONFIRMED: windows ledger entry 2 appended (open_count now 2)
- CONFIRMED: REQUIREMENTS.md shows POS-02, DES-06, DES-09, DES-10, DES-11, EXH-03, EXH-05 all `[x]` / Complete
