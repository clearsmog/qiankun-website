---
phase: 04-position-design
plan: 09
subsystem: content
tags: [vitepress, wq-alpha-research, uk-finance-pay, honest-relabel, case-study, provenance, axis-titles, semantic-colors, number-audit]

# Dependency graph
requires:
  - phase: 04-position-design
    provides: "04-04's VizPanel source/asOf props; 04-06's axis-title props (incl. the EScorePath gap-fill) and the four-name semantic colour contract; 04-07/04-08's stamping and grey-series 'muted' patterns"
provides:
  - "WorldQuant BRAIN opens with UI-SPEC's verbatim credential-first lead: Gold tier + 'independently verifiable, externally judged' + ten-strategy book + Sharpe 2.91 glossed inline, all before the pipeline is named"
  - "All 4 WQ VizPanels stamped source=\"WorldQuant BRAIN platform\" · as-of=\"July 2026\" (the competition period the page's own provenance line and score dates state)"
  - "UK Finance Pay states it is an illustrative data-storytelling exercise in the lead's opening clause — before any claim; frontmatter description/og:description reframed off 'ONS-based analysis'"
  - "The Views/8/'ONS-backed panels' tile is deleted; the Snapshot shows three tiles; the real-median erosion tile takes var(--color-negative)"
  - "All 5 UK Finance Pay VizPanels stamped source=\"ONS (ASHE/GPG/RTI/CPIH)\" · as-of=\"2019–2025 series\"; every hedging subtitle byte-identical to its pre-edit value"
  - "Zero colour hex literals in either page's script block (was 24 + 20); five grey series across both pages on 'muted'; hand-set UK series values byte-identical"
affects: [04-10, phase-05-verification]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Illustrative pages take the schematic window as as-of ('2019–2025 series') — stamping the series the shape tracks, not a false observation date; honest only because the lead now says the figures are schematic"
    - "Competition/platform exhibits stamped with the platform as source and the competition period as as-of"

key-files:
  created: []
  modified:
    - docs/projects/wq-alpha-research.md
    - docs/projects/uk-finance-pay.md

key-decisions:
  - "UK frontmatter description + og:description reframed from 'ONS-based analysis' to 'An illustrative data-storytelling exercise… tracking published ONS series' — the meta description is precision-implying phrasing rendered in search results and social cards, squarely inside the task's whole-page sweep"
  - "Only the real-median erosion tile keeps an accent (var(--color-negative)); the amber gender-gap accent was deleted rather than mapped — there is no amber semantic and the plan names the erosion tile as the sole clear case"
  - "Role-breakdown bars (winners green / losers red today) treated as categorical per the plan's explicit listing — the signed axis carries the finding; only the grey Actuaries bar keeps a key ('muted')"
  - "EScorePath axes: x-name 'Snapshot date (2026)', y-name 'Challenge score (pts)' — the one dual-axis exhibit on the WQ page"
  - "Sharpe/Fitness axis titles use '(IS)' as the parenthetical marker — the metrics are dimensionless ratios; in-sample is the honest qualifier the page already uses"
  - "Requirements POS-05, POS-07, EXH-01, EXH-02, EXH-04, DES-03, DES-07 marked complete (all five case studies now hold them); DES-11, EXH-03, EXH-05 stay open — shared with 04-10 which has no SUMMARY yet"

patterns-established:
  - "Honest-relabel pattern: lead states the evidentiary standard first, exhibit stamps say what the shape is consistent with, hedging subtitles survive untouched — reconciling two evidentiary standards by labelling, not lowering or deleting"

requirements-completed: [POS-05, POS-07, EXH-01, EXH-02, EXH-04, DES-03, DES-07]

coverage:
  - id: D1
    description: "WorldQuant BRAIN credential-first lead with Sharpe gloss; 4/4 exhibits stamped; 4 unit-marked axis titles incl. both EScorePath axes; zero hex; number enumeration"
    requirement: "POS-05, POS-07, EXH-01–05, DES-07, DES-11 (this page)"
    verification:
      - kind: automated_ui
        ref: "grep gates — VizPanel 4, source= 4, as-of= 4, subtitle= 4; hex 0; 'Sharpe ratio (' 2; first sentence has Gold/ten-strategy/2.91 and none of pipeline|mining|gates; axis titles 4, zero without unit marker, max 21 chars; build exits 0"
        status: pass
      - kind: manual
        ref: "First-paragraph read (credential before method), caption lines, centred axis labels, dark-mode re-theme, 375px scroll deferred to the Phase-5 Chrome walkthrough"
        status: deferred
    human_judgment: true
  - id: D2
    description: "UK Finance Pay honest relabel: illustrative framing before any claim, panel-count tile deleted, hedges byte-identical, 5/5 exhibits stamped, 4 axis titles, zero hex, series values unchanged"
    requirement: "POS-05, POS-07, EXH-01–05, DES-07, DES-11 (this page)"
    verification:
      - kind: automated_ui
        ref: "grep gates — metrics array 3 entries; 'Views'|'ONS-backed panels' 0; hedge words 6 (≥3); subtitle= values diffed vs HEAD: identical; VizPanel/source=/as-of= all 5; hex 0; var(--color-negative) 1; axis titles 4, zero without unit marker, max 21 chars; git diff shows only colour keys changed in series arrays; build exits 0"
        status: pass
      - kind: manual
        ref: "First-sentence read (illustrative before claim), three-tile Snapshot, cross-page evidentiary comparison vs Cisco, dark-mode re-theme, 375px scroll deferred to the Phase-5 Chrome walkthrough"
        status: deferred
    human_judgment: true

# Metrics
duration: 12min
completed: 2026-08-06
status: complete
---

# Phase 4 Plan 9: WorldQuant BRAIN & UK Finance Pay Quality Bar Summary

**The site's strongest external credential now leads its page — Gold tier in an independently verifiable, externally judged competition, ten-strategy book, Sharpe 2.91 glossed — and its weakest page now tells a stranger it is an illustrative data-storytelling exercise before making a single claim, with the panel-count-dressed-as-a-finding tile deleted, every hedge preserved byte-identical, all nine exhibits across both pages stamped with source + as-of and unit-marked axis titles, and zero colour hex in either script block.**

## Performance

- **Duration:** ~12 min
- **Completed:** 2026-08-06
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- WQ lead replaced verbatim from UI-SPEC §"Per-page lead paragraph replacements" item 3: sentence one carries Gold tier, the external/independently-verifiable framing, the ten-strategy book and the glossed 2.91 Sharpe; the mining pipeline appears only in sentence two
- 4/4 WQ `<VizPanel>` tags stamped `WorldQuant BRAIN platform · July 2026` — the platform is the data origin (an allowed source value) and July 2026 is the competition period the page already states (provenance line "2026", score dates Jul 6–10)
- UK Finance Pay lead replaced verbatim from UI-SPEC item 5: the opening clause declares the data-storytelling / illustrative-schematic nature before the premium claim lands; "inflation-adjusted (CPIH-deflated)" carries the gloss as UI-SPEC writes it
- The `{ label: 'Views', value: '8', hint: 'ONS-backed panels' }` tile deleted whole from the metrics array — Snapshot now three tiles; `grep 'Views'|'ONS-backed panels'` returns 0
- Frontmatter `description` and `og:description` reframed off "ONS-based analysis" (precision-implying phrasing, swept per the whole-page instruction)
- 5/5 UK `<VizPanel>` tags stamped `ONS (ASHE/GPG/RTI/CPIH) · 2019–2025 series`; every hedging subtitle byte-identical before/after (diffed against HEAD)
- 8 axis titles across both pages, all with a unit/parenthetical marker, all ≤21 chars: `Snapshot date (2026)`, `Challenge score (pts)`, `Sharpe ratio (IS)`, `Fitness (IS)`, `Index (economy = 100)`, `Index (2019 = 100)`, `Real change (%)`, `Index (rest UK = 100)`; the two donuts take none
- All 44 colour literals removed across the two script blocks (24 + 20): 1 accent → `var(--color-negative)` on the erosion tile, 5 grey series → `'muted'`, everything else deleted onto the theme-reactive palette
- WQ Fitness subtitle rewritten from a metric definition to a takeaway; the other eight subtitles across both pages confirmed already interpretive (the UK five deliberately untouched)

## Task Commits

Each task was committed atomically:

1. **Task 1: WorldQuant BRAIN — credential-first lead, provenance, axis labels, token colours, number audit** - `31cefc5` (feat)
2. **Task 2: UK Finance Pay — honest relabel, panel-count tile deletion, exhibit bar** - `f908701` (feat)

**Plan metadata:** commit pending (this SUMMARY + STATE.md update)

Note: the Task 2 commit message says "17 colour literals removed"; the correct count is 20 (4 accents + 16 chart colour keys). The file content is correct; only the message undercounts.

## Files Created/Modified

- `docs/projects/wq-alpha-research.md` — lead, 4 VizPanel stamps, 4 axis titles, 24 colour literals removed (2 → `'muted'`), 1 subtitle rewrite
- `docs/projects/uk-finance-pay.md` — frontmatter descriptions, lead, tile deletion, 5 VizPanel stamps, 4 axis titles, 20 colour literals removed (3 → `'muted'`, 1 → `var(--color-negative)`)

## Hand-Set Series Integrity (explicit confirmation)

**The UK Finance Pay hand-set series values were NOT altered.** `git diff` of the Task 2 commit shows every `value:` and `data:` entry in `premium`, `realSeries`, `roles`, `region` and `composition` byte-identical to its pre-edit value — only `color:`/`accent:` keys were removed or converted. Re-plotting from real ONS data remains explicitly deferred (offered and declined); no exhibit was deleted (also offered and declined).

## Grey / Recessive Series Record (for the 04-10 sweep)

| Series | Page | Was | Now | Resolves to |
|---|---|---|---|---|
| `3qRa0A96` (Sharpe bars) | WQ | `#86868b` | `color: 'muted'` | `t.text3` (`--vp-c-text-3`) |
| `3qRa0A96` (Fitness bars) | WQ | `#86868b` | `color: 'muted'` | `t.text3` |
| Whole economy (premium) | UK Pay | `#86868b` | `color: 'muted'` | `t.text3` |
| Actuaries (roles) | UK Pay | `#86868b` | `color: 'muted'` | `t.text3` |
| Rest of UK finance (region) | UK Pay | `#a8b0bd` | `color: 'muted'` | `t.text3` |

No series on either page took `'muted-strong'` (`t.text2`) — `#6e6e73` did not appear, and the lighter `#a8b0bd` baseline still wants the recessive text3 grey per the plan's explicit instruction. The multi-leg composite and the three UK baselines must all read recessive against the data plotted over them in both modes.

## EXH-03 Number Enumeration (the audit deliverable)

### WorldQuant BRAIN (`wq-alpha-research.md`) — numeric changes made: 0

**Ratio-style metrics (Sharpe/Fitness — rule: as the platform reports, no forced padding)**
- Tile `2.91`; sharpeBars data `2.91 / 2.53 / 2.28 / 2.2 / 2.01 / 1.85 / 1.69 / 1.69 / 1.64 / 1.41`; fitnessBars data `2.18 / 1.81 / 1.69 / 1.65 / 1.44 / 1.32 / 1.17 / 1.14 / 1.1 / 1.01`; ACTIVE table Sharpe `2.91–1.41` and Fitness `2.18–1.01` at the platform's 2dp — ✓
- **Documented, not changed:** the chart canvas labels for `d50w58jK` (2.2) and `akn233gw` (1.1) render at JS numeric precision while the ACTIVE table shows the platform's `2.20` / `1.10`. The values are equal; forcing trailing zeros onto canvas labels would need a component formatter change (out of scope) and the rule's "no forced padding" covers the chart rendering.
- Prose: `~2.8–3.0` Sharpe, correlations `0.75–0.90 / ~0.37 / ~0.66`, gate `≥ 0.7` — as reported ✓

**Counts / integers ≥ 1,000 (rule: thousands separators)**
- Tile `9,932` ✓; hint `from 2,000 Bronze` ✓; lead `4,300-field universe` ✓ (separator written into the UI-SPEC verbatim text)
- EScorePath data labels render via `toLocaleString()` (`2,000 / 4,000 / 8,000 / 9,932`) ✓ component-level; its y-axis ticks abbreviate to k-notation (`2k`, `8k`) — k-abbreviation, not a bare unseparated integer ✓
- Subtitle ranks `~25.8k → ~18.9k` and steps `4.3k local fields` — k-notation ✓

**Percentages (rule: 1dp, with the integer round-value carve-out from 04-07/04-08)**
- ACTIVE table Return/TO columns: `10.5 / 18.6 / 10.6 / 20.7 / 6.5 / 9.8 / 10.9 / 18.5 / 5.4 / 6.3 / 8.1 / 20.5 / 9.1 / 12.1 / 5.3 / 6.0 / 9.9 / 20.7 / 6.4 / 3.6` — all 1dp ✓
- Themes donut `35 / 20 / 20 / 15 / 10` — round composition weights summing to 100, kept whole per the documented integer-percentage carve-out ✓

**Other rendered figures**
- `10` ACTIVE (tile + donut centre), universe names (`TOP3000` etc. — identifiers), `5d` reverse, expression constants (`126`, `120`, `0.5`, `0.6`, `0.4`, `pcr_oi_270`) — code block, exempt ✓

**Subtitle takeaway check (EXH-05):** score journey ("Rank improved from ~25.8k to ~18.9k…") ✓; Sharpe ("Best: quality + analyst blend at 2.91") ✓; Fitness **rewritten** from the metric definition ("Fitness rewards return strength without excessive turnover") to a takeaway ("The top Sharpe alphas hold their lead once turnover is penalised — returns aren't bought with churn"); donut ("Not ten clones… axes chosen to pass self-correlation") ✓

### UK Finance Pay (`uk-finance-pay.md`) — numeric changes made: 0

The plan anticipated "real changes" from inconsistent rounding; on enumeration, every rendered value is either 1dp-compliant, an honestly-approximate schematic value, or protected by the plan's own byte-identity gate on the hand-set series. Forcing 1dp onto `~60%`/`~22%` or the illustrative role integers would assert exactly the point-estimate precision this page must not claim.

**Percentages (rule: 1dp; approximate schematic values keep the precision they honestly have)**
- Tile `−4.7%` and subtitle `~−4.7%` — 1dp ✓
- Tiles `~60%` / `~22%`, subtitle `~60%` — order-of-magnitude approximations flagged with `~`; padding to `60.0%` would fabricate precision — documented carve-out consistent with the page's illustrative framing
- roles data `8 / 2 / −1 / −4 / −7 / −9` (%) — hand-set illustrative round values, protected by the series byte-identity gate — documented carve-out
- composition donut `40 / 25 / 20 / 15` (%) — round story-weight design values, integer-percentage carve-out ✓

**Index values (rule: precision as the series carries, no forced padding)**
- premium `160 / 100`; region `145 / 100`; realSeries `100, 102, 108, 115, 122, 128, 132` and `100, 99, 101, 98, 96, 95.5, 95.3` — as carried, byte-identical ✓

**Counts / other**
- Donut centre `4` ("Angles"), year labels `2019–2025`, `2019 = 100` bases — ✓; no integer ≥ 1,000 rendered on this page

**Subtitle takeaway check (EXH-05):** all five confirmed interpretive and honestly qualified — Levels ("On the order of a ~60% premium…"), Inflation ("Path consistent with the project narrative (~−4.7% real median)…"), Occupation ("Aggregate medians hide winners and losers after CPIH"), Geography ("Geographic premium is first-order — not only sector choice"), Story weights ("Levels premium survives; real erosion, region, and gender complete the picture"). A hedged takeaway is still a takeaway; EXH-05 is satisfied by the reframe, none rewritten, none stripped.

## Deviations from Plan

### Auto-fixed / adapted

**1. [Adaptation] WQ Fitness subtitle rewritten (subtitle content change not explicitly ordered)**
- **Found during:** Task 1
- **Issue:** "Fitness rewards return strength without excessive turnover" defines the metric; it states nothing a reader should take from the exhibit, failing the task's own subtitle check.
- **Fix:** Rewritten to "The top Sharpe alphas hold their lead once turnover is penalised — returns aren't bought with churn" (true of the data: the top two alphas lead both rankings).
- **Commit:** 31cefc5

**2. [Rule 2 - Missing critical] UK frontmatter description + og:description reframed**
- **Found during:** Task 2
- **Issue:** `description: "ONS-based analysis of UK finance sector pay…"` (and its og: twin) is precision-implying phrasing — it claims the page is analysis of ONS data, in the string search engines and social cards render, and it sits before the honest lead in every external surface. The task's sweep covers the whole page.
- **Fix:** Both now read "An illustrative data-storytelling exercise on UK finance pay — real terms, gender, region, and distribution, tracking published ONS series".
- **Commit:** f908701

**3. [Interpretation] as-of strings**
- WQ: `July 2026` — the competition period the page already states (provenance line "2026"; score snapshots Jul 6–10). UK: `2019–2025 series` — the window the page's own series cover (realLabels, "2019–2025 story" in the conclusion), following 04-08's window-as-as-of pattern for non-point-date exhibits. Stamping the illustrative exhibits with the series they track is honest only because the lead now says the figures are schematic — the plan's own reasoning, applied.
- **Commits:** 31cefc5, f908701

**4. [Interpretation] Dimensionless axis titles use `(IS)` as the parenthetical marker**
- Sharpe and Fitness carry no unit; `Sharpe ratio (IS)` / `Fitness (IS)` name the metric with the in-sample qualifier the page already uses (badge "IS Sharpe", competency "IS metrics"), satisfying the unit-marker gate without inventing a false unit.
- **Commit:** 31cefc5

**Total deviations:** 4 (1 subtitle adaptation, 1 Rule-2 metadata honesty fix, 2 interpretations within plan-granted discretion). **Impact:** none negative — all four serve the plan's stated intent (takeaway subtitles, whole-page honesty sweep, grounded provenance).

## Authentication Gates

None.

## Issues Encountered

None. Both `npm run docs:build` gates passed first try (42s, 39s). Task 2 commit message undercounts the colour literals (17 vs the actual 20) — content correct, noted above.

## Deferred to Phase-5 Chrome Walkthrough (human-check portions of verifies)

- WQ: read only the first paragraph and confirm tier, book size, best Sharpe and the externally-judged framing land before any method; all four caption lines visible and subordinate; centred axis labels on the score path (both axes) and both bars; dark-mode scroll with every element re-colouring (specifically the palette-fallback bars and the muted `3qRa0A96` staying recessive); 375px pass for clipped/overlapping axis labels
- UK Pay: read only the first sentence — the illustrative statement must land before the premium claim; Snapshot shows three tiles; hedging subtitles still present on scroll; **side-by-side evidentiary read against `/projects/cisco-equity-valuation`** (the cross-page check T-04-28 requires); erosion tile renders the negative token in both modes; dark-mode re-theme of all five exhibits; 375px pass

## Known Stubs

None.

## User Setup Required

None.

## Next Phase Readiness

- 04-10 (sweep) closes out the phase: DES-11, EXH-03, EXH-05 remain open pending its SUMMARY; POS-05, POS-07, EXH-01, EXH-02, EXH-04, DES-03, DES-07 now marked complete — all five case studies hold them
- The grey-series table above now covers all five pages (04-07 Cisco, 04-08 Global Equity, this plan's five entries) for 04-10's site-wide audit
- No blockers

## Self-Check: PASSED

- FOUND: commit 31cefc5
- FOUND: commit f908701
- FOUND: docs/projects/wq-alpha-research.md
- FOUND: docs/projects/uk-finance-pay.md
