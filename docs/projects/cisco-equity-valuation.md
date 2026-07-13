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
const metrics = [
  { label: 'Base intrinsic', value: '$48.56', hint: 'FCFF DCF, per share', accent: '#0071e3' },
  { label: 'Market price', value: '$120.16', hint: '≈2.5× intrinsic (+146%)', accent: '#ff3b30' },
  { label: 'WACC', value: '8.93%', hint: 'Bottom-up CAPM', accent: '#5856d6' },
  { label: 'P(undervalued)', value: '0%', hint: '50,000-trial Monte Carlo', accent: '#af52de' },
]

const ranges = [
  { label: 'Bear DCF', low: 30, high: 40, mid: 34.87, color: '#ff3b30' },
  { label: 'Base DCF', low: 43, high: 54, mid: 48.56, color: '#0071e3' },
  { label: 'Bull DCF', low: 54, high: 66, mid: 59.63, color: '#34c759' },
  { label: 'Naive peer multiples', low: 123, high: 185, mid: 154, color: '#af52de' },
]

const wacc = [
  { label: 'Risk-free (adj.)', value: 4.10, sub: '10Y UST 4.50% − 40 bp sovereign spread', color: '#5ac8fa' },
  { label: 'ERP contribution', value: 5.14, sub: 'β 1.067 × geo-blended ERP 4.82%', color: '#5856d6' },
  { label: 'Cost of equity', value: 9.24, sub: 'CAPM Ke', color: '#0071e3' },
  { label: 'After-tax Kd', value: 3.78, sub: 'Bond YTM 4.64%, tax glide 18.5% → 25%', color: '#34c759' },
  { label: 'WACC', value: 8.93, sub: '94.2% equity / 5.8% debt (market values)', color: '#ff9500' },
]

const pathSeries = [
  {
    name: 'Revenue ($B)',
    color: '#0071e3',
    data: [60.7, 64.8, 72, 80, 88, 97.9],
  },
  {
    name: 'FCFF ($B)',
    color: '#34c759',
    data: [null, 12.7, 13.8, 15.0, 16.2, 17.6],
  },
]
const pathLabels = ['TTM', 'Y1', 'Y3', 'Y5', 'Y7', 'Y10']

const scenarioWeights = [
  { label: 'Base (45%)', value: 45, color: '#0071e3' },
  { label: 'Bull (30%)', value: 30, color: '#34c759' },
  { label: 'Bear (25%)', value: 25, color: '#ff3b30' },
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

Full **buy-side style** valuation of **Cisco Systems (NASDAQ: CSCO)** — FCFF DCF, peer multiples, scenarios, reverse DCF, Monte Carlo — built as a reproducible Python model with a formula-driven Excel audit workbook and a Typst report. This page follows the report section by section, at the same depth.

## Snapshot

<HeroMetrics :items="metrics" />

**Verdict at valuation date: materially overvalued.** The base-case intrinsic value is **$48.56/share** against a market price of **≈$120.16** — the market embeds AI-driven growth beyond even the bull case ($59.63). This is not a denial that AI networking demand is real; it is a finding about what is already priced in.

## 1 · Business overview

Cisco operates five segments — Networking, Security, Collaboration, Observability, Services — with the **Splunk acquisition (March 2024)**, its largest ever, reshaping the mix. FY2025 revenue was **$56.7B**, with the Americas contributing **59%**. Mid-year FY2026 guidance raised cumulative AI-infrastructure orders to **$9B** and AI-related revenue to **$4B**, with product-order growth running ≈**35% YoY**.

<VizPanel
  badge="Exhibit 1"
  title="Segment and geographic revenue mix, FY2025"
  subtitle="Security (+59% → $8.1B) and Observability (+26% → $1.1B) growth is largely Splunk-driven — the model isolates inorganic contribution before forecasting."
>
  <div class="report-fig"><img src="/projects/cisco-equity-valuation/segment_geo_mix.svg" alt="Cisco segment and geographic revenue mix FY2025" loading="lazy" /></div>
</VizPanel>

## 2 · Industry and business risk

The central risk question: how much of the FY2026 order surge is durable? Cisco has been here before — FY2023's 10-K reported quarterly product-order growth "over 30%, the second highest rate in 20 years," and Networking revenue then collapsed from **$34.6B (FY2023) to $29.2B (FY2024)**, a **−15.5%** reversal. Ex-hyperscaler order growth is ≈**19%** (about half the headline), and the CFO attributed **4–5pp** of that to price increases while calling pull-forward "a very modest amount."

Competitors pressure every segment: Arista (AI fabric), Palo Alto and Fortinet (security), HPE/Juniper (enterprise networking), Broadcom (merchant silicon plus post-VMware virtualisation).

<VizPanel
  badge="Exhibit 2"
  title="Product-order trajectory, FY2022–FY2026"
  subtitle="Surge, reversal, and AI-driven re-acceleration. The FY2024 reversal anchors the bear case; the base case treats current demand as structural but moderated."
>
  <div class="report-fig"><img src="/projects/cisco-equity-valuation/ai_order_trajectory.svg" alt="Cisco product order trajectory FY2022 to FY2026" loading="lazy" /></div>
</VizPanel>

## 3 · Financial analysis

FY2025 free cash flow was **$13.3B** on **$56.7B** revenue, with capex of only ≈**1.6%** of revenue — Cisco is a cash machine that returned ~**94% of FCF** ($6.4B dividends + $6.0B buybacks) while also repaying $2.8B of debt. On a TTM basis with **R&D capitalised (3-year life)**, adjusted EBIT is ≈**$15.2B** on revenue of **$60.7B**.

<VizPanel
  badge="Exhibit 3"
  title="Revenue and operating margin, FY2021–FY2025"
  subtitle="Non-linear history: supply-chain surge, order reversal, then stabilisation — the reason the forecast is built segment-by-segment rather than trend-extrapolated."
>
  <div class="report-fig"><img src="/projects/cisco-equity-valuation/revenue_margin_trend.svg" alt="Cisco revenue and operating margin FY2021 to FY2025" loading="lazy" /></div>
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
  title="Base-case revenue and FCFF path"
  subtitle="Revenue $60.7B TTM → $97.9B year 10; FCFF $12.7B → $17.6B. AI demand real but partly front-loaded."
>
  <ELine :labels="pathLabels" :series="pathSeries" y-suffix="" :height="300" />
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
  title="Intrinsic and relative ranges vs market"
  subtitle="Market ≈$120.16 sits above the bull DCF by ~$61. Only naive peer-median multiples reach the price — and §7 shows why they mislead."
>
  <EFootball :ranges="ranges" :market="120.16" market-label="Mkt" unit="$" />
</VizPanel>

## 7 · Relative valuation — multiples

Peers screened on business-mix overlap, revenue scale ($3B–$100B), and US listing: **Arista, Palo Alto, Fortinet, HPE (Juniper), Broadcom** — NVIDIA and Super Micro excluded as median-distorting. Aggregation is median-only; EV/EBITDA is cash-netted.

| Multiple | Peer median (NTM) | Cisco | Damodaran predicted (trailing) |
| --- | --- | --- | --- |
| EV/EBITDA | 30.3× | 29.5× | 22.6× |
| EV/Sales | 14.5× | 8.1× | 7.7× |
| P/E (NTM) | 39.1× | 25.4× | — |
| P/E (GAAP trailing) | — | 46.6× | 34.0× |

Naive peer medians imply **≈$123 (EV/EBITDA)** to **≈$185 (P/E)** per share — but Cisco's blended growth (~9%) is a fraction of peers like Arista (~24%), so peer medians import growth Cisco doesn't have. A **Damodaran 2026 regression cross-check** on fundamentals says Cisco should trade **30–37% below** its actual multiples. The forward-vs-trailing P/E gap (25.4× vs 46.6×) is SBC and acquired-intangible amortisation excluded from consensus EPS.

<VizPanel
  badge="Exhibit 4"
  title="Cisco vs peer-median vs regression-predicted multiples"
  subtitle="The relative story agrees with the DCF once multiples are conditioned on fundamentals rather than taken at face value."
>
  <div class="report-fig"><img src="/projects/cisco-equity-valuation/peer_multiple_comparison.svg" alt="Cisco versus peer median and Damodaran predicted multiples" loading="lazy" /></div>
</VizPanel>

## 8 · Synthesis, sensitivity, and reverse DCF

No credible parameter change bridges the gap: across WACC **8.2–9.7%** and terminal growth **3.5–4.5%**, base value stays **below $63**. The reverse DCF asks the sharper question — *what must be true for $120.16 to be right?* Either perpetual forward revenue growth of ≈**17.8%** (more than 3.5× the base CAGR, forever), or a WACC of **5.79%** — 314bp below the bottom-up rate.

<VizGrid :cols="2">
  <VizPanel
    badge="Exhibit 5"
    title="WACC × terminal-growth sensitivity"
    subtitle="Value below $63 across the entire credible band."
  >
    <div class="report-fig"><img src="/projects/cisco-equity-valuation/sensitivity_heatmap.svg" alt="DCF sensitivity heatmap WACC versus terminal growth" loading="lazy" /></div>
  </VizPanel>
  <VizPanel
    badge="Exhibit 6"
    title="Reverse DCF: market-implied assumptions"
    subtitle="Implied growth ≈17.8% vs base 4.9%; implied WACC 5.79% vs 8.93%."
  >
    <div class="report-fig"><img src="/projects/cisco-equity-valuation/reverse_dcf.svg" alt="Reverse DCF implied growth and implied WACC" loading="lazy" /></div>
  </VizPanel>
</VizGrid>

### Probabilistic valuation

Scenarios weighted **base 45% / bull 30% / bear 25%** give a probability-weighted intrinsic ≈$48. A seeded **50,000-trial Monte Carlo** over the key drivers — with growth×margin correlated via a Gaussian copula (ρ = 0.5) — puts **P(intrinsic > price) at 0%**.

<VizGrid :cols="2">
  <VizPanel
    badge="Exhibit 7"
    title="Monte Carlo intrinsic-value distribution"
    subtitle="50,000 trials; the entire distribution sits below the market price."
  >
    <div class="report-fig"><img src="/projects/cisco-equity-valuation/mc_histogram.svg" alt="Monte Carlo intrinsic value distribution histogram" loading="lazy" /></div>
  </VizPanel>
  <VizPanel
    badge="Exhibit 8"
    title="Scenario-weighted value bridge"
    subtitle="Bull/base/bear probability-weighted contributions to intrinsic value."
  >
    <div class="report-fig"><img src="/projects/cisco-equity-valuation/scenario_bridge.svg" alt="Scenario probability weighted value bridge" loading="lazy" /></div>
  </VizPanel>
</VizGrid>

<VizPanel
  badge="Scenario weights"
  title="Probability weighting"
  subtitle="Weighted intrinsic ≈ $48/share — indistinguishable from the base case."
>
  <EDonut :items="scenarioWeights" center-value="$48" center-label="Weighted" unit="%" :height="280" />
</VizPanel>

## 9 · Conclusion

Two independent routes reach the same place. The DCF says $48.56 under moderated-but-real AI demand; the reverse DCF says the market needs ~17.8% perpetual growth or a 5.79% discount rate. AI networking demand may be large and durable — **but at ≈$120 the market has already priced it beyond the most optimistic credible scenario.** (Presented as an analytical finding on market-implied expectations, not a trading recommendation.)

## Under the hood

<ProcessRail :steps="steps" />

The number you see on any exhibit is computed, never typed. The pipeline is a Python package (`model/`) with a single assumptions module as the source of truth:

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
| `figures.py` | Every exhibit generated as a side-effect of computation (SVG + PNG) |
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

<style scoped>
.report-fig {
  background: #fff;
  border-radius: 10px;
  padding: 8px;
}
.report-fig img {
  width: 100%;
  height: auto;
  display: block;
}
</style>
