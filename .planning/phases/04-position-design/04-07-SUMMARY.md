---
phase: 04-position-design
plan: 07
subsystem: content
tags: [vitepress, cisco, case-study, provenance, axis-titles, semantic-colors, number-audit]

# Dependency graph
requires:
  - phase: 04-position-design
    provides: "04-04's VizPanel source/asOf props and --color-negative/--color-positive tokens; 04-06's axis-title props (x-name/y-name/y-name-right) and the four-name semantic colour contract in the chart components"
provides:
  - "Cisco page opens with UI-SPEC's verbatim verdict-first lead ($48.56 vs ~$120 in sentence one); FCFF and reverse DCF glossed inline; Monte Carlo deliberately unglossed"
  - "Provenance row reduced to institution · module · date; mark/band/course code survive only inside ## Assessment (single grep hit, line 419 > heading line 417)"
  - "All 13 VizPanels stamped: 12x source=\"Company model output\", 1x source=\"Bloomberg equity/ESG\" (Exhibit 4 peer multiples); as-of on all 13"
  - "Market-price anchor dated 28 May 2026 at both appearances: Snapshot tile hint and football-field as-of (same string as the cost-of-capital risk-free observation)"
  - "14 axis-title strings across the 11 axis-bearing exhibits, every one carrying a unit marker, none >22 chars; donuts take none"
  - "Zero colour hex literals outside the tail <style scoped> block (was 41); fixed-meaning elements on semantic names; ELine now resolves the semantic contract like its siblings"
affects: [04-10, phase-05-verification]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Filing-derived exhibits (segment/geo mix, revenue-margin history) stamped source=\"Company model output\" — the allowed set has no SEC-filings string and the plotted values are literally data/processed model artifacts; the fiscal period (FY2025) is the as-of"
    - "Model-run exhibits carry the valuation observation date (28 May 2026) as as-of, anchored to the page's own risk-free observation"

key-files:
  created: []
  modified:
    - docs/projects/cisco-equity-valuation.md
    - docs/.vitepress/theme/components/viz/ELine.vue

key-decisions:
  - "ELine.vue given the identical semantic-colour resolution expression as the seven 04-06 components — the bear/bull scenario lines needed 'negative'/'positive' and ELine would otherwise pass the strings to ECharts as invalid colours (Rule 2 deviation)"
  - "Bridge 'Weighted intrinsic' bar takes 'muted-strong' (t.text2): deleting its key would have handed it palette[3] = #34c759, identical to the bull bar's positive green — a misleading favourable read on the exhibit's takeaway bar (T-04-22 class)"
  - "Heatmap axis names changed to 'Terminal growth (%)' / 'WACC (%)' despite the plan's 'needs no change': the existing strings carried no unit marker and would fail both the unit grep and EXH-01's literal text"
  - "Number audit closes with two diffs ($9B→$9.0B, $4B→$4.0B); WACC-family 2dp parameters, integer scenario weights/mix shares, $478B and the $3B–$100B screen kept under the rule table's model-precision/no-forced-padding rows — carve-outs enumerated below"
  - "No requirement marked complete: all ten declared IDs are shared with plans 04-08..10 (same rules on the other case studies) which have no SUMMARY yet"

patterns-established:
  - "Grey recessive series keep a colour key with 'muted' (t.text3) rather than falling to a saturated palette hue — on this page the 52-week range; recorded for the 04-10 sweep"

requirements-completed: []

coverage:
  - id: D1
    description: "Verdict-first lead with glosses, mark/course code out of the title block, Assessment intact, market-price anchor dated on the Snapshot tile"
    requirement: "POS-05, POS-07 (this page)"
    verification:
      - kind: automated_ui
        ref: "grep gates — mark-ref count 1 inside Assessment; 'free-cash-flow-to-firm' and 'reverse DCF (' present; first sentence carries 48.56 + $120 and none of model/built/simulation/cross-checked; '28 May 2026' x2+; build exits 0"
        status: pass
      - kind: manual
        ref: "Read-only-first-paragraph check and provenance-row visual deferred to the Phase-5 Chrome walkthrough"
        status: deferred
    human_judgment: true
  - id: D2
    description: "13/13 exhibits stamped with allowed-set source + as-of; 14 unit-bearing axis titles ≤22 chars; football-field date equals tile date"
    requirement: "EXH-01, EXH-02, EXH-04 (this page)"
    verification:
      - kind: automated_ui
        ref: "grep gates — <VizPanel 13, source= 13, as-of= 13; sources ∈ allowed set (12+1); axis-title count 14, zero without unit marker, zero >22 chars; build exits 0"
        status: pass
      - kind: manual
        ref: "Caption line beneath each chart, centred axis labels without tick collisions, 375px re-scroll (backstop B1) deferred to the Phase-5 Chrome walkthrough"
        status: deferred
    human_judgment: true
  - id: D3
    description: "Zero hex outside the tail style block; semantic names on fixed-meaning elements; number enumeration; every subtitle states a takeaway"
    requirement: "EXH-03, EXH-05, DES-07, DES-11 (this page)"
    verification:
      - kind: automated_ui
        ref: "grep gates — hex count before <style scoped> is 0; semantic colour lines 6 (≥2); var(--color-negative) exactly 1 (tile accent, not a chart colour); subtitle= 13, none empty; build exits 0"
        status: pass
      - kind: manual
        ref: "Dark-mode full-page re-theme scroll (overvaluation markers, football market line) deferred to the Phase-5 Chrome walkthrough"
        status: deferred
    human_judgment: true

# Metrics
duration: 16min
completed: 2026-08-06
status: complete
---

# Phase 4 Plan 7: Cisco Case Study Quality Bar Summary

**The site's heaviest case study now leads with its verdict ($48.56 intrinsic vs ~$120 market in the first sentence), carries no academic mark or course code in its title block, stamps all thirteen exhibits with an allowed-set source and an as-of date (the market-price anchor dated 28 May 2026 at both its appearances), labels every axis with its unit, and holds zero colour literals outside its tail style block — with the full EXH-03 number enumeration below.**

## Performance

- **Duration:** ~16 min
- **Started:** 2026-08-06T14:11:03Z
- **Completed:** 2026-08-06T14:27:00Z (approx)
- **Tasks:** 3
- **Files modified:** 2

## Accomplishments
- Lead replaced verbatim from UI-SPEC §"Per-page lead paragraph replacements" item 2: sentence one states the verdict and both numbers; sentence two names the four methods, with the FCFF expansion and the reverse-DCF parenthetical; Monte Carlo left unglossed per the spec's explicit judgment call
- Provenance row now `University of Edinburgh · Equity Valuation · June 2026`; `Mark: 73 (A band)` and `(CMSE11664)` removed; the `## Assessment` section (examiner quote + mark) untouched — the single surviving mark reference sits below that heading
- Snapshot market-price tile hint: `≈2.5× intrinsic (+146%) · as of 28 May 2026` — the same date string as the cost-of-capital section's 10Y UST observation and the football-field `as-of`
- 13/13 `<VizPanel>` tags carry `source` + `as-of`: model-run exhibits (WACC, forecast, football field, sensitivity, reverse DCF, Monte Carlo, bridge, scenarios) at `28 May 2026`; filing-derived exhibits (1a, 1b, 3) at `FY2025`; Exhibit 4 (peer multiples) on `Bloomberg equity/ESG`
- 14 axis titles, all with units, all ≤22 chars: `Revenue ($B)` ×2, `Op. margin (%)`, `Weighted cost (%)`, `Revenue & FCFF ($B)`, `Value per share ($)` ×2, `Multiple (×)`, `Terminal growth (%)`, `WACC (%)` ×2, `Growth rate (%)`, `Trials (count)`, `Contribution ($/sh)`
- All 41 colour literals removed from the script block: 30 keys deleted onto the theme-reactive sequential palette; 6 semantic keys (`negative` ×3, `positive` ×2, `muted-strong` ×1) plus `muted` on the 52-week range; the market-price tile accent is the one `var(--color-negative)` reference (CSS-custom-property path, never a canvas colour)
- Three descriptive subtitles rewritten to state takeaways (Forecast, Exhibit 4, Exhibit 8); the other ten confirmed already interpretive

## Task Commits

Each task was committed atomically:

1. **Task 1: Lead rewrite, provenance strip, market-price date stamp** - `959e0ae` (feat)
2. **Task 2: Provenance + axis titles on all 13 exhibits** - `e2c0f92` (feat)
3. **Task 3: Colour literal removal, number audit, subtitle takeaways** - `ba89f85` (feat)

**Plan metadata:** commit pending (this SUMMARY + STATE.md update)

## Files Created/Modified
- `docs/projects/cisco-equity-valuation.md` - lead, provenance row, 13 VizPanel stamps, 14 axis titles, colour-key removal/semantic conversion, two number fixes, three subtitle rewrites
- `docs/.vitepress/theme/components/viz/ELine.vue` - semantic-colour resolution added to series colours (deviation, see below)

## Grey / Recessive Series Record (for the 04-10 sweep)

| Series | Was | Now | Resolves to |
|---|---|---|---|
| 52-week range (football field) | `#86868b` literal | `color: 'muted'` | `t.text3` (`--vp-c-text-3`) |
| Weighted intrinsic (bridge, Exhibit 8) | `#af52de` literal | `color: 'muted-strong'` | `t.text2` (`--vp-c-text-2`) — collision-avoidance choice, not a grey conversion; see Deviations |

No series on this page took `muted-strong` as a grey-literal replacement (`#6e6e73` appears only inside the tail style block, where it stays page-local CSS).

## EXH-03 Number Enumeration (the audit deliverable)

Every numeric value the page renders, grouped by the convention's type rows. **Changes made: 2** (`$9B`→`$9.0B`, `$4B`→`$4.0B`). Everything else confirmed compliant or covered by a documented carve-out.

### Per-share currency — rule: 2 decimal places
- `$48.56` (lead, verdict, tile, DCF table, Exhibit 5 subtitle, bridge label, ranges data) — ✓
- `$120.16` (tile, verdict, football subtitle + `:market` prop, Exhibit 7 subtitle, §8 prose) — ✓
- `$59.63`, `$34.87` (verdict/table/bridge labels/ranges) — ✓
- `$48.46` (probabilistic prose, Exhibit 8 subtitle), `$48.74`, `$49.63`, `$36.01`, `$66.44` (Exhibit 7 subtitle + band/markers), `$50.14` (self-audit prose) — ✓
- Chart data arrays: `ranges` (34.87–123.05, mid 106.9), `sensValues` (36.81–78.75), `mcEdges`, `bridge` values — model-precision data rendered by component formatters; `106.9` and `59.0` are the model's own values (tooltip display is component-owned, not markdown text) — ✓ as-reported
- Prose approximations exempt by their own markers: `about $120`, `≈$120`, `~$61`, `≈$123`, `≈$185`, `below $63`, `$41 below`, `~$106` — ✓ (approximation, not measurement)

### Aggregate currency — rule: 1 decimal place + unit suffix
- `$56.7B` (×4), `$8.1B`, `$1.1B`, `$13.3B`, `$6.4B`, `$6.0B`, `$2.8B`, `$15.2B`, `$60.7B` (×2), `$97.9B` (×2), `$12.7B`, `$17.6B`, `$29.6B`, `$34.6B`, `$29.2B` — ✓
- **`$9.0B`, `$4.0B` — CHANGED** from `$9B`/`$4B` (exact stated guidance figures; padding is faithful)
- `$478B` — kept: a rounded market-value figure; writing `$478.0B` would assert a tenth-of-a-billion precision the number does not have. Documented exception.
- `$3B–$100B` — kept: peer-screen bounds (criteria, not measurements). Documented exception.
- `$60,746M` TTM base — ✓ separator + unit
- DCF table (header states `$M`): `75,869`, `95,452`, `110,469`, `155,200`, `209,736`, `253,815`, `16,640` (×3), `33,001` (×3), `138,839`, `193,375`, `237,454`, `31,303`, `1,698` — ✓ separators throughout

### Percentages — rule: 1 decimal place, with the model-precision carve-out
- 1dp-compliant: `17.8%` (×3 incl. chart data), `4.9%` (×3), `−15.5%` (×2), `1.6%`, `18.5%`, `94.2%` (×2), `5.8%` (×2), `51.1%`, `54.5%` (×2), `56.5%`, margin chart data `25.8/27.1/26.4/22.6/20.8`, `8.2–9.7%`, `3.5–4.5%` — ✓
- 2dp model parameters, kept at model precision (carve-out): the WACC family — `8.93%` (×6 incl. grid row + base-cell), `9.24%`, `3.78%`, `4.10%` (×4), `4.50%`, `0.40%`, `4.64%` (×2), `4.82%` (×2), `4.44%`, `5.20%`, `5.72%`, `5.79%` (×3), `5.14`, sensitivity axes `7.43–10.43%` / `3.10–5.10%`. Rationale: (a) display arithmetic must cohere — `4.50 − 0.40 = 4.10`; (b) the heatmap's `:base-cell="['8.93%', '4.10%']"` must literally match its row/col labels; (c) `314bp` and `−40 bp` derive from the second decimal. Rounding these breaks the page's "computed, never typed" contract.
- `4.95%` (CSCO Feb-2032 note) — the security's coupon identifier, not a computed figure. Exempt.
- Integer percentages kept whole (no-forced-padding row): mix shares `59%` (×3), `26%`, `14%`, growth/order figures `35%`, `19%`, `~9%`, `~24%`, `94%`, `+59%`, `+26%`, `6%`, `4%`, scenario weights `45%`/`30%`/`25%` (×2 each), `P(undervalued) 0%` (×2), `+146%`, `31–39%` (×2), `4–5pp` — exact round model/reported values; `45.0%` would be forced padding.

### Whole-number metrics, coefficients, counts — rule: as the source model reports, separators ≥1,000
- `50,000` (×3) ✓ separator, `50k` (×2, prose shorthand), `3,982` (×3) ✓, `159` tests, `15` sheets (×2), `12` checks, `10`-year, `5×5` (×2), `β 1.067`, unlevered `1.02`, `ρ = 0.5`, `2.5×` (tile), `3.5×`, `7 of 10`, `9` sections, `7` exhibits, mark `73` (×2, Assessment only) — ✓
- Multiples (1dp ratios as the model reports): `29.6×`, `8.1×`, `25.4×`, `30.3×`, `14.4×`, `39.1×`, `22.6×`, `7.7×`, `46.6×`, `33.6×` — ✓
- `mcCounts` raw array (24…3,750…1): chart-internal frequency data; tooltip formatting is component-owned — ✓ as data

## Deviations from Plan

### Auto-fixed / adapted

**1. [Rule 2 - Missing capability] ELine.vue lacked the semantic-colour contract**
- **Found during:** Task 3 pre-edit component read
- **Issue:** The plan's key_links route `'negative'`/`'positive'` into "this page's data arrays," but 04-06 wired the resolution into seven components and ELine was not one of them — `s.color || palette[i]` would pass the semantic string to ECharts as an invalid colour. The bear/bull scenario lines (Exhibit 2) need exactly that contract; deleting their keys instead would render bull/base/bear as blue/purple/purple, destroying the scenario semantics.
- **Fix:** Added the identical five-branch resolution expression and item-shape doc comment used by the seven siblings. `ELine.vue` was not in the plan's `files_modified` — recorded here for that reason.
- **Files modified:** docs/.vitepress/theme/components/viz/ELine.vue
- **Commit:** ba89f85

**2. [Adaptation] Heatmap axis names changed despite "needs no change"**
- **Found during:** Task 2
- **Issue:** The plan's prose says the heat map "already has its axis names and needs no change," but its existing strings (`Terminal growth g`, `WACC`) carry no unit marker — failing both the plan's own zero-tolerance unit grep and EXH-01's "unit inside the label" wording.
- **Fix:** `x-name="Terminal growth (%)"`, `y-name="WACC (%)"`. The machine-checked criterion wins over the prose aside.
- **Commit:** e2c0f92

**3. [Adaptation] Bridge "Weighted intrinsic" bar → `'muted-strong'` instead of key deletion**
- **Found during:** Task 3
- **Issue:** Case-one deletion would give the bar `palette[3] = #34c759` — the same green as the bull bar's `positive`, making the exhibit's takeaway bar read as a favourable-signal duplicate of the bull scenario (the colour-misapplication failure T-04-22 names).
- **Fix:** `color: 'muted-strong'` (`t.text2`) — reads as the neutral "total" row, re-themes, adds no new token. Recorded in the grey-series table above for 04-10.
- **Commit:** ba89f85

**4. [Interpretation] Source strings for filing-derived exhibits**
- Exhibits 1a/1b/3 originate in 10-K data, but the allowed set has no SEC-filings string and the plotted values are literally `data/processed/*.csv` artifacts of the model's historicals pipeline (the page's own script comment: "computed, not transcribed"). Stamped `Company model output` with the fiscal period (`FY2025`) as as-of. Exhibit 4 (peer/market data) takes the allowed set's Bloomberg spelling, `Bloomberg equity/ESG` — the `/ESG` qualifier is the set's fixed string, inherited from the Global Equity page's feed descriptor.
- **Commit:** e2c0f92

**5. [Interpretation] MC markers both fall back to brand**
- Median (`#0071e3`) and P95 (`#5856d6`) marker keys deleted; both resolve to `t.brand`, distinguished by the P95's existing `dashed: true` and their labels. The UI-SPEC's named defect (Median marker stuck light-brand in dark mode) is resolved by the fallback being theme-reactive.
- **Commit:** ba89f85

## Issues Encountered

None. All three `npm run docs:build` gates passed first try.

## Deferred to Phase-5 Chrome Walkthrough (human-check portions of verifies)

- Read only to the end of the first paragraph: verdict and both numbers known without scrolling; provenance row shows institution/module/date with no mark or course code; Assessment still shows mark + quote
- All 13 exhibits show the caption line (date · Source:) beneath the chart, visually subordinate; every axis label centred with its unit, no tick collisions; 375px re-scroll for clipped/colliding axis labels (backstop B1)
- Dark-mode full-page scroll: every chart element re-colours — specifically the overvaluation markers (implied growth/WACC bars), the football-field market line, and the formerly-stuck Median marker
- Snapshot tile hint length (`≈2.5× intrinsic (+146%) · as of 28 May 2026`) wraps acceptably at 375px two-column collapse

## Known Stubs

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- 04-08/04-09 can copy this page's stamping pattern (source-set choices, valuation-date vs fiscal-period as-of split, grey-series `'muted'` treatment).
- 04-10's sweep contracts: the grey/recessive table above; ELine now part of the eight-component semantic set.
- No blockers.

## Self-Check: PASSED

- FOUND: commit 959e0ae
- FOUND: commit e2c0f92
- FOUND: commit ba89f85
- CONFIRMED: mark-ref grep count 1, inside Assessment (line > heading line)
- CONFIRMED: 13 VizPanels / 13 source= / 13 as-of=; sources ∈ allowed set
- CONFIRMED: 14 axis titles, 0 without unit marker, 0 over 22 chars
- CONFIRMED: 0 hex literals before the tail `<style scoped>`; 6 semantic colour lines; exactly 1 `var(--color-negative)`
- CONFIRMED: 13 non-empty subtitles
- CONFIRMED: `npm run docs:build` exits 0 (three gates)

---
*Phase: 04-position-design*
*Completed: 2026-08-06*
