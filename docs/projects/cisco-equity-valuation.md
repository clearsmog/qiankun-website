---
title: Cisco Systems Equity Valuation
description: Full FCFF DCF and multiples valuation of NASDAQ CSCO — bottom-up WACC, 10-year segment forecast, reverse DCF, Monte Carlo, and a formula-driven Excel audit model
date: 2026-06-22
lastUpdated: true
head:
  - - meta
    - property: og:title
      content: Cisco Systems Equity Valuation
  - - meta
    - property: og:description
      content: Full FCFF DCF and multiples valuation of NASDAQ CSCO — bottom-up WACC, 10-year segment forecast, reverse DCF, Monte Carlo, and a formula-driven Excel audit model
---

<script setup>
// All chart data below is dumped directly from the project's Python model
// (model/forecast.py, model/sensitivity.py, model/probabilistic.py,
// model/multiples.py, data/processed/*.csv) — computed, not transcribed.

const metrics = [
  { label: 'Base intrinsic', value: '$48.56', hint: 'FCFF DCF, per share', accent: '#0071e3' },
  { label: 'Market price', value: '$120.16', hint: '≈2.5× intrinsic (+146%)', accent: '#ff3b30' },
  { label: 'WACC', value: '8.93%', hint: 'Bottom-up CAPM', accent: '#5856d6' },
  { label: 'P(undervalued)', value: '0%', hint: '50,000-trial Monte Carlo', accent: '#af52de' },
]

// §1 — FY2025 segment & geographic mix ($B), data/processed/segment_mix.csv + geo_split.csv
const segmentMix = [
  { label: 'Networking', value: 28.3, color: '#0071e3' },
  { label: 'Services', value: 15.0, color: '#5856d6' },
  { label: 'Security', value: 8.1, color: '#34c759' },
  { label: 'Collaboration', value: 4.2, color: '#ff9500' },
  { label: 'Observability', value: 1.1, color: '#af52de' },
]
const geoMix = [
  { label: 'Americas', value: 33.7, color: '#0071e3' },
  { label: 'EMEA', value: 14.8, color: '#5ac8fa' },
  { label: 'APJC', value: 8.2, color: '#5856d6' },
]

// §2 — bull/base/bear revenue trajectories ($B), model/forecast.py run_forecast()
const scenarioLabels = ['TTM', 'Yr1', 'Yr2', 'Yr3', 'Yr4', 'Yr5', 'Yr6', 'Yr7', 'Yr8', 'Yr9', 'Yr10']
const scenarioSeries = [
  {
    name: 'Bull — sustained AI strength',
    color: '#34c759',
    data: [60.75, 66.71, 72.85, 78.91, 84.71, 90.19, 95.01, 99.87, 104.82, 109.25, 113.73],
  },
  {
    name: 'Base — structural but moderated',
    color: '#0071e3',
    data: [60.75, 64.81, 68.69, 72.27, 75.82, 79.4, 82.98, 86.61, 90.21, 94.02, 97.88],
  },
  {
    name: 'Bear — AI pull-forward reversal',
    color: '#ff3b30',
    data: [60.75, 60.55, 60.91, 62.57, 64.47, 66.71, 68.95, 71.76, 74.67, 77.61, 80.79],
  },
]

// §3 — revenue & GAAP operating margin FY2021–FY2025, data/processed/is_clean.csv
const trendLabels = ['FY2021', 'FY2022', 'FY2023', 'FY2024', 'FY2025']
const trendBars = { name: 'Revenue ($B)', data: [49.8, 51.6, 57.0, 53.8, 56.7], color: '#0071e3', unit: 'B' }
const trendLine = { name: 'GAAP op. margin (%)', data: [25.8, 27.1, 26.4, 22.6, 20.8], color: '#ff9500', unit: '%' }

// §4 — WACC build, model/wacc.py
const wacc = [
  { label: 'Risk-free (adj.)', value: 4.10, sub: '10Y UST 4.50% − 40 bp sovereign spread', color: '#5ac8fa' },
  { label: 'ERP contribution', value: 5.14, sub: 'β 1.067 × geo-blended ERP 4.82%', color: '#5856d6' },
  { label: 'Cost of equity', value: 9.24, sub: 'CAPM Ke', color: '#0071e3' },
  { label: 'After-tax Kd', value: 3.78, sub: 'Bond YTM 4.64%, tax glide 18.5% → 25%', color: '#34c759' },
  { label: 'WACC', value: 8.93, sub: '94.2% equity / 5.8% debt (market values)', color: '#ff9500' },
]

// §5 — base-case revenue & FCFF path ($B), model/forecast.py
const pathSeries = [
  {
    name: 'Revenue ($B)',
    color: '#0071e3',
    data: [60.75, 64.81, 68.69, 72.27, 75.82, 79.4, 82.98, 86.61, 90.21, 94.02, 97.88],
  },
  {
    name: 'FCFF ($B)',
    color: '#34c759',
    data: [null, 12.69, 13.33, 13.9, 14.45, 14.98, 15.5, 16.02, 16.52, 17.04, 17.56],
  },
]

// §6 — football field, model/sensitivity.py build_triangulation()
const ranges = [
  { label: 'DCF scenarios', low: 34.87, high: 59.63, mid: 48.56, color: '#0071e3' },
  { label: 'Multiples range', low: 90.76, high: 123.05, mid: 106.9, color: '#af52de' },
  { label: '52-week range', low: 62.71, high: 121.43, mid: 92.07, color: '#86868b' },
]

// §7 — peer multiples, model/multiples.py (peer medians, Cisco, Damodaran regression)
const multipleCategories = ['EV/EBITDA', 'EV/Sales', 'P/E']
const multipleSeries = [
  { name: 'Cisco', color: '#ff9500', data: [29.6, 8.1, 25.4] },
  { name: 'Peer median (NTM)', color: '#34c759', data: [30.3, 14.4, 39.1] },
  { name: 'Damodaran predicted (trailing)', color: '#0071e3', data: [22.6, 7.7, 33.6] },
]

// §8 — 5×5 WACC × terminal-g grid ($/share), model/sensitivity.py compute_wacc_g_grid()
const sensRows = ['7.43%', '8.18%', '8.93%', '9.68%', '10.43%']
const sensCols = ['3.10%', '3.60%', '4.10%', '4.60%', '5.10%']
const sensValues = [
  [60.75, 63.49, 67.05, 71.86, 78.75],
  [52.41, 54.13, 56.27, 59.0, 62.62],
  [46.06, 47.19, 48.56, 50.25, 52.37],
  [41.03, 41.81, 42.73, 43.83, 45.18],
  [36.81, 37.33, 37.93, 38.64, 39.48],
]

// §8 — reverse DCF, model/sensitivity.py run_reverse_dcf()
const impliedGrowth = [
  { label: 'Market-implied constant growth', value: 17.8, color: '#ff3b30' },
  { label: 'Base-case 10-yr CAGR', value: 4.9, color: '#0071e3' },
]
const impliedWacc = [
  { label: 'Market-implied WACC', value: 5.79, color: '#ff3b30' },
  { label: 'Bottom-up WACC', value: 8.93, color: '#0071e3' },
]

// Probabilistic — 50k-trial MC histogram, model/probabilistic.py run_probabilistic()
const mcEdges = [25.25, 26.94, 28.63, 30.32, 32.01, 33.7, 35.4, 37.09, 38.78, 40.47, 42.16, 43.85, 45.54, 47.23, 48.93, 50.62, 52.31, 54.0, 55.69, 57.38, 59.07, 60.77, 62.46, 64.15, 65.84, 67.53, 69.22, 70.91, 72.6, 74.3, 75.99, 77.68, 79.37, 81.06, 82.75, 84.44, 86.14, 87.83, 89.52, 91.21, 92.9, 94.59, 96.28, 97.97, 99.67, 101.36, 103.05, 104.74, 106.43]
const mcCounts = [24, 57, 136, 293, 583, 922, 1446, 1889, 2570, 2957, 3469, 3672, 3671, 3750, 3524, 3400, 3148, 2742, 2278, 1863, 1622, 1312, 1085, 843, 652, 513, 396, 310, 223, 175, 118, 101, 79, 58, 30, 29, 23, 11, 5, 5, 3, 6, 2, 1, 1, 1, 1, 1]
const mcMarkers = [
  { label: 'Median', value: 48.74, color: '#0071e3' },
  { label: 'P95', value: 66.44, color: '#5856d6', dashed: true },
]

// Scenario-weighted bridge ($/share contribution), probs from model/assumptions.py
const bridge = [
  { label: 'Base 45% × $48.56', value: 21.85, color: '#0071e3' },
  { label: 'Bull 30% × $59.63', value: 17.89, color: '#34c759' },
  { label: 'Bear 25% × $34.87', value: 8.72, color: '#ff3b30' },
  { label: 'Weighted intrinsic', value: 48.46, color: '#af52de' },
]

const steps = [
  { title: 'Historicals', detail: '5-yr 10-K clean-up · R&D capitalised · Splunk split' },
  { title: 'WACC', detail: 'Bottom-up β · geo ERP · bond YTM · MV weights' },
  { title: 'Forecast', detail: '10-yr segment FCFF · bull/base/bear' },
  { title: 'DCF', detail: 'FCFF @ WACC · g = Rf · EV→equity bridge' },
  { title: 'Multiples', detail: 'Peer median · Damodaran regression' },
  { title: 'Stress', detail: 'Sensitivity · reverse DCF · 50k MC' },
  { title: 'Excel', detail: '15 sheets · live formulas · self-verifying' },
  { title: 'Report', detail: 'Typst · 9 sections · 7 exhibits' },
]
</script>

# Cisco Systems Equity Valuation (CSCO)

University of Edinburgh · Equity Valuation (CMSE11664) · June 2026 · **Mark: 73 (A band)**

Full **buy-side style** valuation of **Cisco Systems (NASDAQ: CSCO)** — FCFF DCF, peer multiples, scenarios, reverse DCF, Monte Carlo — built as a reproducible Python model with a formula-driven Excel audit workbook and a Typst report. This page follows the report section by section, at the same depth, and **every chart below is rendered live from the model's own output data**.

## Snapshot

<HeroMetrics :items="metrics" />

**Verdict at valuation date: materially overvalued.** The base-case intrinsic value is **$48.56/share** against a market price of **≈$120.16** — the market embeds AI-driven growth beyond even the bull case ($59.63). This is not a denial that AI networking demand is real; it is a finding about what is already priced in.

## 1 · Business overview

Cisco operates five segments — Networking, Security, Collaboration, Observability, Services — with the **Splunk acquisition (March 2024)**, its largest ever, reshaping the mix. FY2025 revenue was **$56.7B**, with the Americas contributing **59%**. Mid-year FY2026 guidance raised cumulative AI-infrastructure orders to **$9B** and AI-related revenue to **$4B**, with product-order growth running ≈**35% YoY**.

<VizGrid :cols="2">
  <VizPanel
    badge="Exhibit 1a"
    title="Segment revenue mix, FY2025"
    subtitle="Security (+59% → $8.1B) and Observability (+26% → $1.1B) growth is largely Splunk-driven — the model isolates inorganic contribution before forecasting."
  >
    <EDonut :items="segmentMix" center-value="$56.7B" center-label="FY2025" unit="B" :height="320" legend-pos="bottom" />
  </VizPanel>
  <VizPanel
    badge="Exhibit 1b"
    title="Geographic revenue mix, FY2025"
    subtitle="Americas 59% / EMEA 26% / APJC 14% — the same weights blend the regional equity risk premia in §4."
  >
    <EDonut :items="geoMix" center-value="59%" center-label="Americas" unit="B" :height="320" legend-pos="bottom" />
  </VizPanel>
</VizGrid>

## 2 · Industry and business risk

The central risk question: how much of the FY2026 order surge is durable? Cisco has been here before — FY2023's 10-K reported quarterly product-order growth "over 30%, the second highest rate in 20 years," and Networking revenue then collapsed from **$34.6B (FY2023) to $29.2B (FY2024)**, a **−15.5%** reversal. Ex-hyperscaler order growth is ≈**19%** (about half the headline), and the CFO attributed **4–5pp** of that to price increases while calling pull-forward "a very modest amount."

Competitors pressure every segment: Arista (AI fabric), Palo Alto and Fortinet (security), HPE/Juniper (enterprise networking), Broadcom (merchant silicon plus post-VMware virtualisation).

<VizPanel
  badge="Exhibit 2"
  title="Revenue trajectories: bull / base / bear, TTM → year 10"
  subtitle="The bear path embeds the FY2022–24 pull-forward reversal precedent (−20% to −28% product orders, Networking −15.5% YoY); the base case treats AI demand as structural but moderated."
>
  <ELine :labels="scenarioLabels" :series="scenarioSeries" y-suffix="B" :height="320" />
</VizPanel>

## 3 · Financial analysis

FY2025 free cash flow was **$13.3B** on **$56.7B** revenue, with capex of only ≈**1.6%** of revenue — Cisco is a cash machine that returned ~**94% of FCF** ($6.4B dividends + $6.0B buybacks) while also repaying $2.8B of debt. On a TTM basis with **R&D capitalised (3-year life)**, adjusted EBIT is ≈**$15.2B** on revenue of **$60.7B**.

<VizPanel
  badge="Exhibit 3"
  title="Revenue and GAAP operating margin, FY2021–FY2025"
  subtitle="Non-linear history: supply-chain surge, order reversal, then stabilisation — the reason the forecast is built segment-by-segment rather than trend-extrapolated."
>
  <ECombo :labels="trendLabels" :bars="trendBars" :line="trendLine" :height="320" />
</VizPanel>

## 4 · Capital structure and WACC

Every component is built bottom-up, no defaults:

- **Risk-free 4.10%** — 10-year UST 4.50% (28 May 2026) less a 0.40% sovereign default spread.
- **Beta 1.067** — Damodaran sector betas, revenue-mix weighted and cash-corrected (unlevered 1.02), Hamada re-levered to Cisco's capital structure. No Blume adjustment.
- **ERP 4.82%** — GDP-weighted regional total ERPs blended by Cisco's revenue geography (Americas 4.44% / EMEA 5.20% / APJC 5.72% at 59/26/14).
- **Cost of debt** — observed **4.64% YTM** on the CSCO 4.95% Feb-2032 note (G-spread ~41bp), tax glide 18.5% → 25%.
- **Weights** — market values: $478B equity vs $29.6B lease-inclusive debt → **94.2% / 5.8%**.

<VizPanel
  badge="Cost of capital"
  title="WACC build: Ke 9.24% × 94.2% + after-tax Kd 3.78% × 5.8%"
  subtitle="Equity weight ~94% means WACC ≈ cost of equity. Result: 8.93%."
>
  <EBar :items="wacc" unit="%" :max="10" />
</VizPanel>

## 5 · Growth forecast and assumptions

Ten-year explicit horizon from a TTM base of **$60,746M**, built segment by segment: Networking ~6% in year 1 mean-reverting to 4%; Security and Observability decelerating from mid-teens; Collaboration and Services at low single digits. Base-case revenue reaches **$97.9B by year 10 (4.9% CAGR)** — deliberately below the market-implied path.

Discipline choices that drive the answer: **R&D capitalised** over a 3-year amortising life, **SBC treated as a real cost** (no add-back), **reinvestment = g ÷ ROIC** (terminal reinvestment stays positive), and **terminal growth = risk-free = 4.10%**.

<VizPanel
  badge="Forecast"
  title="Base-case revenue and FCFF path, all ten years"
  subtitle="Revenue $60.7B TTM → $97.9B year 10; FCFF $12.7B → $17.6B."
>
  <ELine :labels="scenarioLabels" :series="pathSeries" y-suffix="B" :height="300" />
</VizPanel>

## 6 · Intrinsic valuation — DCF

| Component ($M) | Bear | Base | Bull |
| --- | --- | --- | --- |
| PV of explicit FCFF (10 yr) | 75,869 | 95,452 | 110,469 |
| Enterprise value | 155,200 | 209,736 | 253,815 |
| Terminal value share of PV | 51.1% | 54.5% | 56.5% |
| (+) Cash & investments | 16,640 | 16,640 | 16,640 |
| (−) Gross debt + op leases | 33,001 | 33,001 | 33,001 |
| Equity value | 138,839 | 193,375 | 237,454 |
| Diluted shares (M) | 3,982 | 3,982 | 3,982 |
| **Value per share** | **$34.87** | **$48.56** | **$59.63** |

The EV→equity bridge uses the **Q3-FY2026 Form 10-Q** balance sheet (quarter ended 25 Apr 2026): financial debt $31,303M plus $1,698M operating leases, against $16,640M cash and investments. Terminal value is a healthy but not dominant **54.5%** of base-case PV.

<VizPanel
  badge="Football field"
  title="Triangulation: DCF, multiples, and 52-week range vs market"
  subtitle="Market $120.16 sits ~$61 above the bull DCF and at the top of its own 52-week range. Only the multiples band reaches the price — and §7 shows why it misleads."
>
  <EFootball :ranges="ranges" :market="120.16" market-label="Mkt" unit="$" />
</VizPanel>

## 7 · Relative valuation — multiples

Peers screened on business-mix overlap, revenue scale ($3B–$100B), and US listing: **Arista, Palo Alto, Fortinet, HPE (Juniper), Broadcom** — NVIDIA and Super Micro excluded as median-distorting. Aggregation is median-only; EV/EBITDA is cash-netted.

| Multiple | Peer median (NTM) | Cisco | Damodaran predicted (trailing) |
| --- | --- | --- | --- |
| EV/EBITDA | 30.3× | 29.6× | 22.6× |
| EV/Sales | 14.4× | 8.1× | 7.7× |
| P/E (NTM) | 39.1× | 25.4× | — |
| P/E (GAAP trailing) | — | 46.6× | 33.6× |

Naive peer medians imply **≈$123 (EV/EBITDA)** to **≈$185 (P/E)** per share — but Cisco's blended growth (~9%) is a fraction of peers like Arista (~24%), so peer medians import growth Cisco doesn't have. A **Damodaran 2026 regression cross-check** on fundamentals says Cisco trades **31–39% above** what its own growth, margin, and payout justify. The forward-vs-trailing P/E gap (25.4× vs 46.6×) is SBC and acquired-intangible amortisation excluded from consensus EPS.

<VizPanel
  badge="Exhibit 4"
  title="Cisco vs peer-median vs regression-predicted multiples"
  subtitle="Forward (NTM) basis for Cisco and peer median; trailing basis for the Damodaran regression cross-check — matching Table 4 of the report."
>
  <EGroupBar :categories="multipleCategories" :series="multipleSeries" unit="×" :height="320" />
</VizPanel>

## 8 · Synthesis, sensitivity, and reverse DCF

No credible parameter change bridges the gap: across WACC **8.2–9.7%** and terminal growth **3.5–4.5%**, base value stays **below $63**. The reverse DCF asks the sharper question — *what must be true for $120.16 to be right?* Either perpetual forward revenue growth of ≈**17.8%** (more than 3.5× the base CAGR, forever), or a WACC of **5.79%** — 314bp below the bottom-up rate.

<VizPanel
  badge="Exhibit 5"
  title="Sensitivity: intrinsic value per share, WACC × terminal growth"
  subtitle="The exact 5×5 grid from the model. Outlined cell = base case ($48.56 at WACC 8.93%, g 4.10%). Even the most generous corner stays $41 below the market."
>
  <EHeatmap
    :rows="sensRows"
    :cols="sensCols"
    :values="sensValues"
    :base-cell="['8.93%', '4.10%']"
    unit="$"
    x-name="Terminal growth g"
    y-name="WACC"
    :height="340"
  />
</VizPanel>

<VizGrid :cols="2">
  <VizPanel
    badge="Exhibit 6a"
    title="Implied growth vs base-case CAGR"
    subtitle="The market prices 17.8% constant revenue growth vs the 4.9% base path."
  >
    <EBar :items="impliedGrowth" :horizontal="false" unit="%" :height="260" />
  </VizPanel>
  <VizPanel
    badge="Exhibit 6b"
    title="Implied WACC vs bottom-up WACC"
    subtitle="Alternatively: a 5.79% discount rate, 314bp below the bottom-up 8.93%."
  >
    <EBar :items="impliedWacc" :horizontal="false" unit="%" :height="260" />
  </VizPanel>
</VizGrid>

### Probabilistic valuation

Scenarios weighted **base 45% / bull 30% / bear 25%** give a probability-weighted intrinsic of **$48.46**. A seeded **50,000-trial Monte Carlo** over the key drivers — with growth×margin correlated via a Gaussian copula (ρ = 0.5) — puts **P(intrinsic > price) at 0%**: the distribution's maximum (~$106) never reaches $120.

<VizPanel
  badge="Exhibit 7"
  title="Monte Carlo intrinsic-value distribution, 50,000 trials"
  subtitle="The model's actual histogram: median $48.74, mean $49.63, P5–P95 band $36.01–$66.44. The entire distribution sits below the $120.16 market price."
>
  <EHistogram
    :edges="mcEdges"
    :counts="mcCounts"
    :markers="mcMarkers"
    :band="[36.01, 66.44]"
    unit="$"
    :height="320"
  />
</VizPanel>

<VizPanel
  badge="Exhibit 8"
  title="Scenario-weighted value bridge"
  subtitle="Probability-weighted contributions to the $48.46 weighted intrinsic value."
>
  <EBar :items="bridge" unit="" :height="240" series-name="$/share" />
</VizPanel>

## 9 · Conclusion

Two independent routes reach the same place. The DCF says $48.56 under moderated-but-real AI demand; the reverse DCF says the market needs ~17.8% perpetual growth or a 5.79% discount rate. AI networking demand may be large and durable — **but at ≈$120 the market has already priced it beyond the most optimistic credible scenario.** (Presented as an analytical finding on market-implied expectations, not a trading recommendation.)

## Under the hood

<ProcessRail :steps="steps" />

The number you see on any exhibit is computed, never typed — including on this page: every chart above renders the model's own output data. The pipeline is a Python package (`model/`) with a single assumptions module as the source of truth:

| Module | Role |
| --- | --- |
| `assumptions.py` | Every tunable input in one place — no magic numbers anywhere else |
| `historicals.py` | 5-year 10-K clean-up, segment crosswalk, Splunk-inorganic isolation |
| `wacc.py` | CAPM Ke, Hamada re-levering, tax glide, market-value weights |
| `forecast.py` | Segment-level 10-year FCFF engine → bull/base/bear array |
| `dcf.py` | Discounting, Gordon terminal value, EV→equity bridge |
| `multiples.py` | Median-only peer engine, cash-netted EV/EBITDA, GAAP P/E |
| `sensitivity.py` | 5×5 grids, scenario table, reverse-DCF root-finders (`brentq`) |
| `probabilistic.py` | Scenario weighting + seeded 50k Monte Carlo with Gaussian copula |
| `figures.py` | Every report exhibit generated as a side-effect of computation |
| `export.py` + `writers/` | 15-sheet Excel workbook, one tested writer per sheet |
| `verify.py` | Evaluates the workbook's formulas and asserts they equal the Python engine |

**The Excel model is formula-driven, not a value dump.** Fifteen sheets (`Cover_Index` → `Checks`): six raw terminal-export sheets (Bloomberg financials/estimates/bond, Refinitiv, PitchBook) feed an `Inputs` SSoT sheet with per-row source and pull-date provenance, and the WACC/Forecast/DCF/Multiples chains are live formulas in the blue-input/black-formula convention — change an input and the valuation recomputes in Excel. A `Checks` sheet runs 12 live integrity checks (weights sum to one, WACC > g, terminal-value share in band, bridge ties), and `verify.py` re-evaluates every formula cell against the Python engine on save. **159 tests** cover the engines, the writers, and the report itself.

Built in three milestones: **v1.0** the five-phase valuation (data → WACC/forecast → DCF/multiples → stress → report), **v1.1** live-data refresh plus the probabilistic layer, **v1.2** the fully wired Excel model. A structured self-audit then traced every headline number to a primary source — fetching the actual Q3-FY2026 10-Q, recomputing the ERP from Damodaran's country files, and switching to a cash-corrected beta — moving the base value from $50.14 to the final **$48.56** and strengthening the thesis.

## Assessment

Marked **73** (A band, before late penalty), with A — Excellent on 7 of 10 rubric criteria including clarity of analysis, logic of argument, critical thinking, structure, and use of figures. From the examiner:

> "The scenario analysis, WACC/terminal-growth sensitivity and reverse-DCF are particularly effective because they test the market-implied assumptions directly rather than simply presenting mechanical ranges. […] a well-integrated and analytically logical valuation. Excellent work."

## Stack

Python (`uv`, pandas, numpy, scipy, matplotlib) · openpyxl/xlsxwriter + `formulas` verification · Typst report · Bloomberg / LSEG Workspace / SEC filings / Damodaran datasets

## Competencies

Equity research · FCFF DCF · bottom-up WACC · relative valuation · reverse DCF · scenario & sensitivity analysis · Monte Carlo · financial-model auditability

---

[← All projects](/projects/)
