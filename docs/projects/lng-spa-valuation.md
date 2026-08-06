---
title: LNG SPA Real-Option Valuation
description: Monte Carlo valuation of a 20-year US Gulf Coast FOB LNG SPA from a publicly filed SEC exhibit — intrinsic vs extrinsic value, destination and cancellation flex, MIP cargo scheduling with shadow prices, and a freight model backtested out-of-sample against 383 days of published assessments
date: 2026-08-06
lastUpdated: true
head:
  - - meta
    - property: og:title
      content: LNG SPA Real-Option Valuation
  - - meta
    - property: og:description
      content: Monte Carlo valuation of a 20-year US Gulf Coast FOB LNG SPA from a publicly filed SEC exhibit — intrinsic vs extrinsic value, destination and cancellation flex, MIP cargo scheduling, and an out-of-sample-validated freight model
---

<script setup>
const metrics = [
  { label: 'Intrinsic NPV', value: '$807m', hint: 'vs today’s curve · 5-yr window' },
  { label: 'Full value (MC)', value: '$1,404m', hint: '3,000 correlated paths' },
  { label: 'Extrinsic', value: '$597m', hint: 'full − intrinsic · 43% of value' },
  { label: 'Avg lift rate', value: '91.1%', hint: 'optimal exercise under MC' },
]

const npvEdges = [600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000]
const npvCounts = [2, 5, 17, 66, 149, 292, 467, 524, 528, 408, 271, 133, 75, 32, 14, 9, 5, 0, 1, 1, 0, 0, 0, 1]
const npvMarkers = [
  { label: 'Intrinsic', value: 806.9, color: 'muted-strong', dashed: true },
  { label: 'P50', value: 1396.0 },
]
const npvBand = [1050.7, 1788.8]

const flexCompareCats = ['Intrinsic', 'Full (MC mean)', 'Extrinsic']
const flexCompareSeries = [
  { name: 'Destination flex + cancel', data: [806.9, 1404.0, 597.1] },
  { name: 'Cancel only (fixed destination)', data: [570.7, 672.8, 102.1], color: 'muted' },
]

const extrinsicSplit = [
  { label: 'Cancellation only', value: 102.1, sub: 'no destination flex', color: 'muted' },
  { label: 'Destination flex', value: 495.0, sub: 'max(EU, Asia) netback per cargo' },
  { label: 'Total extrinsic', value: 597.1, sub: 'full − intrinsic', color: 'positive' },
]

const volLabels = ['30%', '45%', '55%', '70%', '90%']
const volSeries = [
  { name: 'Total extrinsic', data: [1.02, 1.51, 1.84, 2.33, 2.96], area: true },
  { name: 'Cancellation increment', data: [0.72, 0.95, 1.1, 1.31, 1.58] },
  { name: 'Reroute increment', data: [0.3, 0.56, 0.74, 1.02, 1.38] },
]

const mipCompare = [
  { label: 'Greedy', value: -4.24, sub: 'infeasible — breaches EU slots in Q2 & Q3', color: 'negative' },
  { label: 'MIP optimum', value: -4.94, sub: 'feasible · CBC solver' },
]

const shadowPrices = [
  { label: 'ToP cancel quota', value: 1.46, sub: 'one more cancellation right' },
  { label: 'EU regas slot · Q2', value: 0.4, sub: 'one more slot' },
  { label: 'EU regas slot · Q1', value: 0.3, sub: 'one more slot' },
]

const freightStack = [
  { label: 'Charter hire', value: 2.03 },
  { label: 'Fuel / boil-off', value: 0.3 },
  { label: 'Canal', value: 0.2 },
  { label: 'Ports', value: 0.09, color: 'muted' },
  { label: 'Insurance', value: 0.07, color: 'muted' },
  { label: 'Broker 2%', value: 0.04, color: 'muted-strong' },
]

const oosCats = ['US Gulf → NW Europe', 'US Gulf → NE Asia']
const oosSeries = [
  { name: 'Uncalibrated', data: [0.204, 0.475], color: 'muted' },
  { name: 'Pooled-regression calibration', data: [0.424, 1.439], color: 'negative' },
  { name: 'Quarterly-median calibration', data: [0.071, 0.207], color: 'positive' },
]

const steps = [
  { title: 'Map the contract', detail: 'Public SEC exhibit → CSP = 1.15 × HH + fee; ACQ → 26 cargoes/yr; cancel = fee sunk' },
  { title: 'Build curves', detail: 'Illustrative HH/TTF/JKM/freight forwards, seasonal shape, vols + correlation matrix' },
  { title: 'Intrinsic', detail: 'Per-cargo optimal decision vs today’s curve; destination = max(EU, Asia) netback' },
  { title: 'MC extrinsic', detail: '3,000 correlated paths, pathwise optimal lift/cancel; extrinsic = full − intrinsic' },
  { title: 'MIP cross-check', detail: 'ToP, regas slots, ship-days as constraints; LP duals = shadow prices' },
  { title: 'Validate freight', detail: 'Out-of-sample vs 383 days of published assessments; quarterly-median calibration' },
]
</script>

# LNG SPA Real-Option Valuation

Independent energy-derivatives research · Python Monte Carlo + MIP · August 2026

A long-term LNG contract is a strip of real options, not an annuity. Valuing a 20-year US Gulf Coast FOB LNG SPA — terms taken from a publicly filed SEC exhibit (contract sales price = 1.15 × Henry Hub + fixed liquefaction fee; ~91.25M MMBtu per contract year; an economic right not to lift) — a static NPV misses **$597m of extrinsic value, 43% of the contract's full mark**. That value only appears when the model prices the right to choose destination and the right to cancel a cargo.

*All figures come from my own runnable models. Contract terms are from the public filing; forward curves are illustrative, market-shaped levels — the engine is config-driven, so re-running on a live tape is the intended workflow. That split (public terms, illustrative curves) is standard practice for valuing a publicly filed contract.*

## Snapshot

<HeroMetrics :items="metrics" />

## What the option is worth

<VizPanel
  badge="Monte Carlo · 3,000 paths"
  title="Path NPV distribution"
  subtitle="Correlated GBM shocks to HH / TTF / JKM / freight with pathwise optimal lift/cancel. The whole P5–P95 band ($1,051m–$1,789m) sits above the intrinsic mark — optionality is not a tail story."
  source="Own model output"
  as-of="August 2026"
>
  <EHistogram :edges="npvEdges" :counts="npvCounts" :markers="npvMarkers" :band="npvBand" unit="$" x-name="Path NPV ($m)" y-name="Paths" />
</VizPanel>

<VizPanel
  badge="Flex ablation"
  title="Same engine, destination flex toggled off"
  subtitle="Destination choice adds $731m of full value ($236m intrinsic + $495m extrinsic); the average lift rate rises from 83.4% to 91.1%."
  source="Own model output"
  as-of="August 2026"
>
  <EGroupBar :categories="flexCompareCats" :series="flexCompareSeries" y-name="NPV ($m)" />
</VizPanel>

## Where the extrinsic comes from

<VizGrid :cols="2">
  <VizPanel
    badge="Decomposition"
    title="Extrinsic value by flex layer"
    subtitle="On today's deep in-the-money curves the cancellation right alone is worth $102m; adding destination flex contributes another $495m."
    source="Own model output"
    as-of="August 2026"
  >
    <EBar :items="extrinsicSplit" :max="650" x-name="Extrinsic value ($m)" />
  </VizPanel>
  <VizPanel
    badge="Vol sensitivity"
    title="Extrinsic vs volatility, stylised contract"
    subtitle="Stylised at-the-money 11-cargo FOB contract, 40,000 paths, fixed seed. Extrinsic is nearly linear in vol — the flex valuation is a framework, not a single number."
    source="Own model output"
    as-of="August 2026"
  >
    <ELine :labels="volLabels" :series="volSeries" :smooth="false" y-name="$/MMBtu" />
  </VizPanel>
</VizGrid>

**The ordering of the flex layers is moneyness-dependent, not universal.** This contract is deep in-the-money on today's shaped curves, so the cancellation right is nearly worthless and destination flex dominates. In the stylised at-the-money case the ranking flips — cancellation becomes the biggest layer. Quoting either number without its cost level attached is how flex value gets mis-sold.

## From valuation to scheduling

<VizGrid :cols="2">
  <VizPanel
    badge="MIP · CBC"
    title="Greedy beats the optimum — until constraints bind"
    subtitle="Per-cargo greedy netback maximisation looks $0.70/MMBtu better but breaches the EU regas-slot limits; the gap is the priced cost of the constraint set (≈$2.5m/yr on this stylised book)."
    source="Own model output"
    as-of="August 2026"
  >
    <EBar :items="mipCompare" x-name="Margin ($/MMBtu)" />
  </VizPanel>
  <VizPanel
    badge="LP duals"
    title="What one more unit of each constraint is worth"
    subtitle="The cancellation quota is the binding constraint that matters — $1.46/MMBtu per extra right. Ship-days sat slack at 375 of 700, shadow price zero."
    source="Own model output"
    as-of="August 2026"
  >
    <EBar :items="shadowPrices" :max="1.6" x-name="Shadow price ($/MMBtu)" />
  </VizPanel>
</VizGrid>

The optimiser's schedule is not the greedy schedule with the worst months lopped off: it flips two summer cargoes from Europe to North-East Asia and spends the three cancellation rights on the worst winter months — the quota goes to the *worst* months, not the first negative one. Duals give direction; integer-feasible finite differences give the attainable increments — the difference between the two is itself worth understanding before quoting either.

## The freight leg — built, then backtested

<VizGrid :cols="2">
  <VizPanel
    badge="Cost stack"
    title="US Gulf → NE Asia voyage cost, $/MMBtu"
    subtitle="Bottom-up from open-source route distances and a published academic cost stack at an $80k/day charter rate; the daily charter rate is the only live input."
    source="Own model output"
    as-of="August 2026"
  >
    <EDonut :items="freightStack" center-value="$2.73" center-label="per MMBtu" unit=" $/MMBtu" legend-pos="bottom" />
  </VizPanel>
  <VizPanel
    badge="Backtest"
    title="Out-of-sample error by calibration method"
    subtitle="Vs 383 days of published freight route assessments (Dec 2024 – Jul 2026), trained on the first 191 days. Pooled regression doubles the error out of sample; a quarterly median cuts it by 56–65%."
    source="Published freight assessments"
    as-of="Dec 2024 – Jul 2026"
  >
    <EGroupBar :categories="oosCats" :series="oosSeries" y-name="OOS MAE ($/MMBtu)" />
  </VizPanel>
</VizGrid>

The negative result is the finding: pooled regression *worsens* the uncalibrated model by 108–203% out of sample, because freight carries level drift that has nothing to do with charter rates — emissions allowances, canal fees, vessel-benchmark changes — and a pooled slope absorbs it. The published Pacific assessment also implies ~86 round-trip days against the model's theoretical 48.6 — near double the vessel occupation. Calibrating voyage days by quarterly median fixes both, and the calibration flips a live diversion signal from +$0.53 "go" to −$0.28 "no-go". **Model error here is sign-level, not decimal-level.**

## Process

<ProcessRail :steps="steps" />

## Honest boundaries

- Contract terms are from the publicly filed SEC exhibit; forward curves are illustrative, market-shaped levels, not a live tape. The engine is YAML-config-driven — swapping in live curves and re-running is the intended use.
- The headline run values a 5-year window of the 20-year term (26 cargoes/yr); the engine extends to the full term.
- Cancellation is modelled economically: the legal form is shortfall or suspension; the economic mark is a strip of options on (netback − 1.15 × HH) with the fixed fee as the sunk leg.
- The vol-sensitivity grid and the MIP schedule use a stylised contract and stylised constraint parameters; their numbers are never mixed with the SPA-run numbers above.
- The freight model needs quarterly-median calibration to be decision-grade; long-haul waiting and repositioning days are not modelled.

## Stack

Python · NumPy / pandas Monte Carlo engine (correlated GBM, fixed seeds) · PuLP + CBC mixed-integer optimisation · searoute open-source route distances · YAML-configured, fully reproducible runs

## Competencies

Real-option valuation (intrinsic / extrinsic) · correlated Monte Carlo & optimal exercise · LP/MIP optimisation and duality · LNG SPA contract mechanics · freight & netback economics · out-of-sample model validation

---

[← All projects](/projects/)
