---
phase: 04-position-design
plan: 08
subsystem: content
tags: [vitepress, global-equity, board-diversity, case-study, provenance, axis-titles, semantic-colors, number-audit, title-reconciliation]

# Dependency graph
requires:
  - phase: 04-position-design
    provides: "04-04's VizPanel source/asOf props; 04-06's axis-title props and the four-name semantic colour contract; 04-05's index card carrying the Board Diversity canonical title; 04-07's stamping pattern (source-set choices, grey-series 'muted' treatment)"
provides:
  - "Global Equity opens with UI-SPEC's verbatim outcome-first lead: GBP 10M portfolio + MSCI World benchmark + the VaR gloss in sentence one; model/optimizer named only in sentence two"
  - "All 4 Global Equity VizPanels stamped: 3x source=\"Company model output\", 1x source=\"Bloomberg equity/ESG\" (the VaR/CVaR exhibit CONTEXT named as a provenance gap), all as-of=\"March 2026\" (the page's stated mandate period)"
  - "Board Diversity carries one title in all four places — frontmatter, og:title, H1, index card — all 'Board Gender Diversity and Corporate ESG'; the question-form H1 is gone; sidebar label untouched"
  - "Board Diversity opens with UI-SPEC's verbatim finding-first lead: 2,270 firms / 18,101 firm-years association and the null causal result in sentence one; fixed effects glossed inline; course code stripped from the provenance line"
  - "Both Board Diversity VizPanels stamped source=\"Refinitiv\" · as-of=\"2012–2024 panel\"; forest and bar exhibits carry unit-bearing axis titles ≤22 chars"
  - "Zero colour hex literals in either page's script block (was 10 + 7); VaR loss bars on 'negative', Market benchmark slice on 'muted'; everything else on the theme-reactive palette fallback"
affects: [04-09, 04-10, phase-05-verification]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Portfolio-construction exhibits (factor weights, sector mix, TE decomposition) stamped source=\"Company model output\" with the mandate month as as-of — same filing-vs-model split 04-07 established"
    - "Panel-study exhibits take the sample window as the as-of string ('2012–2024 panel'), not a point date — the estimation window is the honest observation period for regression output"

key-files:
  created: []
  modified:
    - docs/projects/global-equity-portfolio.md
    - docs/projects/board-diversity-esg.md

key-decisions:
  - "All four VaR/CVaR bars take 'negative' (uniform loss-red): the plan names 'a loss figure in the risk exhibit' as the unfavourable-signal case, and all four items are loss estimates. Colouring Historical VaR 'positive' because its estimate is lower would misread methodological divergence as good news; deleting the keys would hand loss figures saturated palette greens/blues (T-04-27). The old red-amber-green traffic light was decorative, not semantic."
  - "Forest subtitle rewritten from colour-encoding description ('Green points… Orange points…') to a takeaway: after colour-key deletion the encoding description would be wrong (non-primary points render palette[4], primary render t.positive internally), and EXH-05 wants a takeaway anyway"
  - "E coefficient aligned to model precision: tile '+2.13***' → '+2.133***' and magnitude sub '2.13 ÷ 31.3' → '2.133 ÷ 31.3', matching the forest data (2.133) and the tooltip's toFixed(3) display; S stays 1.08 (as the model reports — no forced padding)"
  - "Board Diversity exhibits stamped 'Refinitiv': the ESG outcome variables are Refinitiv scores, the true data origin for what the charts plot; WRDS Compustat supplies controls only"
  - "No requirement marked complete: all ten declared IDs are shared with 04-09/04-10 (same rules on the remaining case studies) which have no SUMMARY yet"

patterns-established:
  - "Uniform semantic colouring of a same-meaning bar family (all-loss exhibits → all 'negative') rather than per-bar traffic-lighting"

requirements-completed: []

coverage:
  - id: D1
    description: "Global Equity outcome-first lead with the VaR gloss; 4/4 exhibits stamped incl. the CONTEXT-named VaR gap; 2 unit-bearing axis titles; zero hex; number enumeration"
    requirement: "POS-05, POS-07, EXH-01–05, DES-07, DES-11 (this page)"
    verification:
      - kind: automated_ui
        ref: "grep gates — VizPanel 4, source= 4, as-of= 4, subtitle= 4; hex 0; 'Value-at-Risk (VaR' 1 with gloss; axis titles 2, zero without unit marker, max 17 chars; risk-exhibit source in Stack line and 'March 2026' in provenance row; build exits 0"
        status: pass
      - kind: manual
        ref: "First-paragraph read, caption lines, centred axis labels, dark-mode re-theme, 375px scroll deferred to the Phase-5 Chrome walkthrough"
        status: deferred
    human_judgment: true
  - id: D2
    description: "Board Diversity one-title reconciliation, finding-first lead with null result, course code out, 2/2 exhibits stamped with unit-bearing axis titles, zero hex, number enumeration"
    requirement: "POS-05, POS-07, EXH-01–05, DES-03, DES-07, DES-11 (this page)"
    verification:
      - kind: automated_ui
        ref: "grep gates — canonical title 3 in-file + index-card match; H1 count 1, no question mark; 'Do Women Directors' 0; CMSE1162 0 with institution/date kept; VizPanel 2, source= 2, as-of= 2, subtitle= 2; hex 0; 'fixed effects (' 1; axis titles 2, zero without unit marker, max 21 chars; build exits 0"
        status: pass
      - kind: manual
        ref: "Card-title vs H1 side-by-side read, first-paragraph check, dark-mode re-theme, 375px scroll deferred to the Phase-5 Chrome walkthrough"
        status: deferred
    human_judgment: true

# Metrics
duration: 14min
completed: 2026-08-06
status: complete
---

# Phase 4 Plan 8: Global Equity & Board Diversity Quality Bar Summary

**The index's lead case study now opens with what it produced (a GBP 10M portfolio risk-managed against the MSCI World across four VaR methodologies, glossed inline), Board Diversity answers to exactly one title everywhere and leads with its finding including the honest null, all six exhibits across the two pages carry source + as-of and unit-bearing axis labels, and neither script block holds a single colour hex — full number enumerations below.**

## Performance

- **Duration:** ~14 min
- **Completed:** 2026-08-06
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Global Equity lead replaced verbatim from UI-SPEC §"Per-page lead paragraph replacements" item 1: sentence one carries the portfolio size, the benchmark and the Value-at-Risk gloss; the multi-factor model, optimizer and ESG floor appear only in sentence two; constrained optimizer left unglossed per the spec's explicit judgment call
- 4/4 Global Equity `<VizPanel>` tags carry `source` + `as-of`: factor weights, sector mix and TE decomposition at `Company model output · March 2026`; the VaR/CVaR exhibit — CONTEXT's second named provenance gap — at `Bloomberg equity/ESG · March 2026`, both values grounded elsewhere in the file (Stack line; provenance row)
- Board Diversity title reconciled: H1 changed from `# Do Women Directors Move ESG?` to the canonical `# Board Gender Diversity and Corporate ESG`, now identical in frontmatter `title`, `og:title`, H1 and the 04-05 index card; the shorter sidebar label ("Board Diversity & ESG") deliberately untouched
- Board Diversity lead replaced verbatim from UI-SPEC item 4: association across 2,270 firms / 18,101 firm-years and the null causal result in the same first sentence; fixed-effects gloss inline; `(CMSE11621)` stripped from the provenance line with institution, module and date kept
- 2/2 Board Diversity `<VizPanel>` tags stamped `Refinitiv · 2012–2024 panel`
- 4 axis titles, all with units, all ≤22 chars: `Factor weight (%)` (17), `Loss (% of NAV)` (15), `Effect (ESG pts / SD)` (21), `% of pillar mean` (16); the two donuts take none
- All 17 colour literals removed across the two script blocks (10 + 7): 12 keys deleted onto the theme-reactive palette, 4 VaR bars → `'negative'`, 1 benchmark slice → `'muted'`
- Forest subtitle rewritten from a colour-encoding description to a takeaway; the other five subtitles confirmed already interpretive

## Task Commits

Each task was committed atomically:

1. **Task 1: Global Equity — lead, provenance, axis labels, token colours, number audit** - `ed1647b` (feat)
2. **Task 2: Board Diversity — title reconciliation, lead, exhibit bar** - `ae314fe` (feat)

**Plan metadata:** commit pending (this SUMMARY + STATE.md update)

## Files Created/Modified

- `docs/projects/global-equity-portfolio.md` — lead, 4 VizPanel stamps, 2 axis titles, 10 colour keys removed/converted
- `docs/projects/board-diversity-esg.md` — H1, provenance line, lead, 2 VizPanel stamps, 2 axis titles, 7 colour keys removed, 1 subtitle rewrite, 2 precision fixes

## Grey / Recessive Series Record (for the 04-10 sweep)

| Series | Was | Now | Resolves to |
|---|---|---|---|
| Market (TE decomposition donut, Global Equity) | `#86868b` literal | `color: 'muted'` | `t.text3` (`--vp-c-text-3`) |

No series on either page took `muted-strong` (`t.text2`); `#6e6e73` did not appear in either file. The Market slice is the benchmark-contribution wedge and must still read recessive against the three palette wedges in both light and dark mode.

## EXH-03 Number Enumeration (the audit deliverable)

### Global Equity Portfolio (`global-equity-portfolio.md`) — changes made: 0

All values confirmed compliant or covered by a documented carve-out (the page was already the site's reference for rigour).

**Percentages — rule: 1 decimal place, with the no-forced-padding carve-out for exact round values**
- 1dp-compliant: `6.8%` (tile, donut centre), sector data `16.7 / 12.7 / 8.3 / 1.9 / 1.4`, teParts `54.6 / 30.2 / 11.5 / 3.7`, varItems `10.2 / 10.4 / 5.4 / 12.8` — ✓
- Exact round constraint/design values kept whole (no forced padding): tile `7%`, hints `Process cap 8%` / `Sector cap 35%`, mandate table `≤ 7% / ≤ 35% / ≤ 15% / ≤ 8% process / 15% mandate`, DM/EM `~80% / 20%`, confidence `95%` (title + sub), sector data `30 / 15 / 7 / 7`, factor weights `18 / 15 / 12 / 10 / 8 / 8 / 8 / 5 / 16` (design weights, the model's own round numbers) — ✓ per the integer-percentage row 04-07 documented
**Aggregate currency — rule: 1 decimal place + unit suffix, round-figure carve-out**
- `£10M` (tile) and `GBP 10 million` (lead) — kept: the stated round mandate size; `£10.0M` would assert a precision the mandate does not have (same exception class as 04-07's `$478B`) — documented exception
**Counts / whole-number metrics — rule: as reported, separators ≥1,000**
- `~29` holdings, `9` sectors (tile hint + donut centre), `14+` countries, `13`-factor, `12`-month, `3m`, `260d`, `1-month`, `:max` props `20 / 14` (chart bounds, not displayed values) — ✓; no integer ≥1,000 rendered on this page

**Subtitle takeaway check (EXH-05):** all four confirmed interpretive — factor weights ("Quality and momentum lead…"), sector mix ("Active IT sleeve…"), TE decomposition ("Idiosyncratic + style dominate; market contribution kept small"), VaR ("Parametric and Cornish–Fisher sit near ~10% of NAV… both families are reported"). No rewrites needed.

### Board Diversity (`board-diversity-esg.md`) — changes made: 2 (`+2.13***`→`+2.133***`, sub `2.13 ÷ 31.3`→`2.133 ÷ 31.3`)

**Coefficients — rule: precision as the source model reports, no forced padding**
- `2.133` (forest data, tile, magnitude sub, forest subtitle) — **CHANGED** at the tile and magnitude sub from the rounded `2.13`; the model reports 2.133 and the chart tooltip already displayed it at 3dp, so the page showed the same coefficient at two precisions
- `1.08` (forest data, tile, magnitude sub, forest subtitle) — ✓ as reported (no forced padding to 1.080)
- `1.756`, `2.521` (forest data), standard errors `0.307 / 0.225 / 0.188 / 0.275` — ✓ as reported
**Percentages — rule: 1 decimal place**
- magnitude data `6.8 / 2.4 / 4.8` — ✓ (arithmetic checks: 2.133÷31.3 = 6.8%, 1.08÷45.7 = 2.4%)
**Counts — rule: separators ≥1,000**
- `2,270` (tile, lead), `18,101` (tile, lead, forest badge `N = 18,101`) — ✓ separators throughout
**Other rendered figures**
- Pillar means `31.3 / 45.7` (magnitude subs) — 1dp as the sample reports — ✓; `1 SD` (hints, forest title, lead), `2012–2024` (hint, as-of), significance stars `***` (tiles, forest, hypotheses table), `SB 826` (statute number) — ✓ not numeric-format items

**Subtitle takeaway check (EXH-05):** forest subtitle rewritten to state the takeaway (real E/S effects vs the mechanical-inflation flag on G); magnitude subtitle ("E moves more relative to its mean than S; G is shown only for measurement context") confirmed already interpretive.

## Deviations from Plan

### Auto-fixed / adapted

**1. [Interpretation] All four VaR/CVaR bars → `'negative'`, not a preserved traffic light**
- **Found during:** Task 1
- **Issue:** UI-SPEC's colour architecture names "the VaR/CVaR red-amber-green triad" a fixed-semantic case, but the semantic contract offers only `negative`/`positive`/`muted`/`muted-strong` — there is no amber, and the old red-amber-green mapping (Historical VaR green because its estimate is lower) reads methodological divergence as a favourable finding, which it is not.
- **Fix:** The plan's own decision rule governs: "a loss figure in the risk exhibit" keeps its key and takes `'negative'`. All four items are loss estimates, so all four take `'negative'` — uniform loss-red, distinguishable by label, re-themes on toggle, and avoids palette greens/blues on loss figures (T-04-27).
- **Commit:** ed1647b

**2. [Adaptation] Forest subtitle rewritten (subtitle content change not explicitly ordered)**
- **Found during:** Task 2
- **Issue:** The existing subtitle described the colour encoding ("Green points… Orange points…"). After the colour work, non-primary points render from the palette (not necessarily orange), so the description would be false; it also described rather than stated a takeaway, failing the task's own subtitle check.
- **Fix:** Rewritten to "E and S rise 2.133 and 1.08 points per 1 SD of diversity — the real outcomes; the still-larger G coefficient flags mechanical inflation, not signal."
- **Commit:** ae314fe

**3. [Observation] Plan described the Global Equity metrics array as "already omits the accent key on some entries"**
- In fact all four entries carried accents. The intent (delete brand-emphasis accents entirely) was unambiguous and applied; noting the discrepancy for the record only.
- **Commit:** ed1647b

**4. [Interpretation] Board Diversity source string `Refinitiv`, panel window as as-of**
- The Stack line names Refinitiv, WRDS Compustat and Stata. The plotted quantities (ESG pillar scores, coefficients on them) originate in Refinitiv data; Compustat supplies controls. Stamped `Refinitiv` on both exhibits with `2012–2024 panel` as the as-of — the estimation window is the observation period the page already states (tile hint), and a point date would be false precision for regression output.
- **Commit:** ae314fe

## Issues Encountered

None. Both `npm run docs:build` gates passed first try (53s, 40s).

## Deferred to Phase-5 Chrome Walkthrough (human-check portions of verifies)

- Global Equity: read only the first paragraph and confirm the outcome is known without scrolling; all four caption lines (date · Source:) visible and subordinate; centred axis labels with units on both EBars; dark-mode scroll with every element re-colouring (specifically the four now-uniform negative VaR bars and the muted Market wedge staying recessive); 375px pass for clipped/overlapping axis labels
- Board Diversity: card title on `/projects/` vs page H1 read as the same string side-by-side; first paragraph delivers association + null result before any method; both caption lines and centred axis labels; dark-mode re-theme of forest points and magnitude bars; 375px pass
- Social-share card: og:title change on Board Diversity renders correctly (T-04-26 residual — visual check only)

## Known Stubs

None.

## User Setup Required

None.

## Next Phase Readiness

- 04-09 (remaining case studies) and 04-10 (sweep) can reuse: the panel-window as-of pattern for regression exhibits, the uniform-`'negative'` loss-family treatment, and the grey-series table above
- Requirements POS-05/POS-07/EXH-01–05/DES-03/DES-07/DES-11 now hold on three of five case studies (Cisco, Global Equity, Board Diversity); marking complete still waits on 04-09/04-10
- No blockers

## Self-Check: PASSED

- FOUND: commit ed1647b
- FOUND: commit ae314fe
- FOUND: docs/projects/global-equity-portfolio.md
- FOUND: docs/projects/board-diversity-esg.md
