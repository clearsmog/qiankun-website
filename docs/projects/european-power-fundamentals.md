---
title: European Power Fundamentals
description: Hourly day-ahead prices, load and renewable output for Germany, Spain and France, 2023 to September 2026 — solar capture rates, negative prices, a baseload-hedge backtest for a solar asset, the merit order and the hour-by-hour economics of a gas plant
date: 2026-10-02
lastUpdated: true
head:
  - - meta
    - property: og:title
      content: European Power Fundamentals
  - - meta
    - property: og:description
      content: Solar capture rates, negative prices, the merit order and gas-plant spark spreads across Germany, Spain and France, 2023 to September 2026, from public hourly data
---

<script setup>
import d from './data/power-fundamentals.json'

const COLORS = { DE: '#0071e3', ES: '#d97706', FR: '#5856d6' }
const NAMES = { DE: 'Germany', ES: 'Spain', FR: 'France' }
const MARKETS = ['DE', 'ES', 'FR']
const row = (mk, y) => d.yearly.find((r) => r.market === mk && r.year === y)
const fmt2 = (v) => v.toFixed(2)

const metrics = [
  { label: 'German solar capture rate', value: fmt2(row('DE', 2025).solar_capture_rate), hint: `2025 · from ${fmt2(row('DE', 2023).solar_capture_rate)} in 2023` },
  { label: 'Spanish negative-price hours', value: String(row('ES', 2026).negative_hours), hint: `Jan–Sep 2026 · ${row('ES', 2023).negative_hours} in 2023` },
  { label: 'Solar revenue risk that is shape', value: `${Math.round(d.hedge.decomposition.shape * 100)}%`, hint: 'Germany · baseload hedges cannot remove it' },
  { label: 'Hours a gas plant makes money', value: `${Math.round(d.cssPositiveShare['2025'] * 100)}%`, hint: `Germany 2025 · €${d.cssPositiveMean['2025']}/MWh in those hours` },
]

const captureSeries = MARKETS.map((mk) => ({ name: NAMES[mk], data: d.solarCapture[mk], color: COLORS[mk], area: false }))

const years = [2023, 2024, 2025, 2026]
const yearLabels = ['2023', '2024', '2025', '2026 (Jan–Sep)']
const negSeries = MARKETS.map((mk) => ({ name: NAMES[mk], color: COLORS[mk], data: years.map((y) => row(mk, y).negative_hours) }))

const hours = Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, '0')}:00`)
const cssSeries = [
  { name: '2023', data: d.cssByHour['2023'], color: 'muted', area: false },
  { name: '2025', data: d.cssByHour['2025'], color: COLORS.DE, area: false },
]

const pct = (v) => Math.round(v * 1000) / 10
const hg = d.hedge
const ratioLabels = hg.sweep.hedge_ratio.map((h) => `${Math.round(h * 100)}%`)
const sweepSeries = [{ name: 'Revenue vs budget, standard deviation', data: hg.sweep.std.map(pct), color: COLORS.DE, area: false }]
const decompItems = [
  { label: 'Shape', value: pct(hg.decomposition.shape), sub: 'capture rate vs expected · not hedgeable with baseload' },
  { label: 'Price', value: pct(hg.decomposition.price), sub: 'baseload vs forward · what a baseload hedge removes', color: 'muted-strong' },
  { label: 'Volume', value: pct(hg.decomposition.volume), sub: 'output vs expected · weather', color: 'muted' },
]
const varianceSeries = [
  { name: 'Unhedged', data: hg.varianceUnhedged.map(pct), color: 'muted', area: false },
  { name: '100% of expected volume hedged', data: hg.varianceHedged.map(pct), color: COLORS.DE, area: false },
]
const bestStd = pct(hg.sensitivity.prev_month.best_std)
const unhedgedStd = pct(hg.sensitivity.prev_month.unhedged_std)

const table = years.flatMap((y) => MARKETS.map((mk) => ({ ...row(mk, y), r2: d.regression[mk][String(y)].r2 })))
</script>

# European Power Fundamentals

Independent energy-market research · Python · October 2026

A renewable asset is paid the price in the hours it produces, not the baseload average. Across Germany, Spain and France from January 2023 to September 2026, that gap has opened fast: **German solar now captures about half of the baseload price** (0.52 in 2025, down from 0.76 in 2023), and Spain went from zero negative-price hours to 747 in nine months. A backtest of a German solar asset hedged with baseload futures shows what that means for an owner: **hedge close to 100% of expected volume, not the capture-weighted share, and accept that about half of the remaining revenue risk is shape, which baseload cannot remove.** The same hourly data shows where gas still sets the price, and why a gas plant's margin now lives in two short daily windows.

*Built from public data only: Fraunhofer ISE's Energy-Charts API (ENTSO-E and SMARD day-ahead prices, load and generation, CC BY 4.0), the Dutch TTF gas front month and an EU carbon (EUA) price proxy. Code, tests and full results: [github.com/clearsmog/power-fundamentals](https://github.com/clearsmog/power-fundamentals).*

## Snapshot

<HeroMetrics :items="metrics" />

## Solar is cannibalising its own price

<VizPanel
  badge="Capture rate · monthly"
  title="Solar capture price ÷ baseload price"
  subtitle="A value of 1 means solar earns the average price. Since spring 2025 all three markets have repeatedly dropped below 0.5, to as low as 0.10 (France, April 2026): the more solar on the system, the cheaper the hours it produces in. Winter readings above 1 reflect thin output in short, high-priced days."
  source="Energy-Charts (ENTSO-E / SMARD); own calculation"
  as-of="Jan 2023 – Sep 2026"
>
  <ELine :labels="d.months" :series="captureSeries" :smooth="false" :symbols="false" y-name="Capture rate (×)" />
</VizPanel>

**What it means for a PPA.** A pay-as-produced solar PPA priced off a baseload forward now carries a shape discount of roughly half the price in Germany and Spain. Wind holds up far better (capture rates of 0.84–0.97, table below) because its output is not concentrated in the same midday hours.

## Negative prices have moved south

<VizPanel
  badge="Day-ahead · hourly"
  title="Hours with a negative day-ahead price"
  subtitle="Germany has had negative hours for years; Spain had none in 2023 and 747 in the first nine months of 2026, more than Germany. Each is an hour a merchant or pay-as-produced asset pays to generate unless it curtails."
  source="Energy-Charts (ENTSO-E / SMARD); own calculation"
  as-of="Jan 2023 – Sep 2026"
>
  <EGroupBar :categories="yearLabels" :series="negSeries" y-name="Negative-price hours" />
</VizPanel>

## The merit order, hour by hour

<VizPanel
  badge="Germany · Q3 2026"
  title="Day-ahead price against residual load"
  subtitle="Residual load is demand minus wind and solar: what thermal plants and imports must cover. Below zero, prices sit at or under zero; above about 45 GW the curve turns steeply upward as the most expensive plants clear. Points are shaded by the gas plant's cost that day (scale above the chart): higher-cost days sit higher at the same residual load."
  source="Energy-Charts; TTF, EUA; own calculation"
  as-of="Jul – Sep 2026, 2,208 hours"
>
  <EScatter :points="d.meritQ3_2026" x-name="Residual load" y-name="Price" color-name="Gas-plant cost" x-unit=" GW" y-unit=" €/MWh" color-unit=" €/MWh" />
</VizPanel>

An hourly regression of price on residual load and the gas plant's short-run cost explains **66–77% of German price variance** in every year from 2023 to 2026. Each extra gigawatt of residual load adds about €3/MWh in Germany and €4.7–6.5/MWh in Spain.

## Hedging a solar asset with baseload futures

A notional 100 MW German solar plant, producing on the national solar profile, sells a baseload forward each month for a share of its expected output. It is judged on revenue against a budget set at the start of the month from last month's price, last year's capacity factor and last year's capture rate, over the 33 months from January 2024 to September 2026.

<VizGrid :cols="2">
  <VizPanel
    badge="Backtest · 33 months"
    title="Revenue risk by hedge ratio"
    subtitle="Standard deviation of monthly revenue vs budget. Risk falls until about 100% of expected volume is hedged; hedging only the capture-weighted share (≈72%) leaves 29% instead of 24%."
    source="Energy-Charts; own backtest"
    as-of="Jan 2024 – Sep 2026"
  >
    <ELine :labels="ratioLabels" :series="sweepSeries" :smooth="false" y-suffix="%" />
  </VizPanel>
  <VizPanel
    badge="Risk decomposition"
    title="Where an unhedged solar asset's revenue risk comes from"
    subtitle="Revenue ÷ budget is exactly volume × price × shape surprise; each bar is that factor's share of the variance."
    source="Energy-Charts; own backtest"
    as-of="Jan 2024 – Sep 2026"
  >
    <EBar :items="decompItems" :max="70" x-name="Share of revenue variance (%)" />
  </VizPanel>
</VizGrid>

<VizPanel
  badge="Month by month"
  title="Revenue vs budget, unhedged and hedged"
  subtitle="The hedge narrows the swings, but several summer months still missed budget by 37–43% (May, June, August and September 2024; June 2025), and June 2026 beat it by 74%. Those misses are capture-rate and volume surprises, which a baseload forward does not touch."
  source="Energy-Charts; own backtest"
  as-of="Jan 2024 – Sep 2026"
>
  <ELine :labels="hg.months" :series="varianceSeries" :smooth="false" :symbols="false" y-suffix="%" />
</VizPanel>

**Hedge volume, not value.** Solar's capture price moves almost one-for-one in euros with baseload (slope 0.95), so the shape discount behaves like a fixed euro amount, not a fixed percentage, and capture surprises rise and fall with price surprises (correlation 0.48). Both push the variance-minimising hedge towards full volume: 80–110% across three different forward-price proxies. **Even the best baseload hedge only cuts revenue risk from {{ unhedgedStd }}% to {{ bestStd }}%**, and the worst month is still 43% below budget. The rest is shape risk, which is why owners turn to shaped products, capture-priced PPAs and co-located batteries.

## A gas plant now earns in two windows

<VizPanel
  badge="Clean spark spread · Germany"
  title="Average clean spark spread by hour of day"
  subtitle="Power price minus a standard gas plant's fuel and carbon cost (49.13% efficiency, 0.202 tCO₂/MWh). Solar has pushed midday deep into loss (2025 at 13:00: −€57/MWh); the margin now sits in the morning and evening ramps (2025 at 19:00: +€33/MWh)."
  source="Energy-Charts; TTF front month; EUA proxy; own calculation"
  as-of="2023 vs 2025, CET"
>
  <ELine :labels="hours" :series="cssSeries" :smooth="false" :symbols="false" y-name="€/MWh" />
</VizPanel>

**Averages mislead here.** The German spread is negative on a baseload average and even on the conventional 08:00–20:00 weekday peak block, yet it was positive in **37% of 2025 hours**, averaging +€28/MWh in those hours. A gas plant, a battery or a hedging desk that prices against block averages misreads the asset; the hourly shape is the trade.

## Results table

2026 YTD = January to September. Regression R² is from the hourly price regression on residual load and gas-plant cost.

<table>
  <thead><tr><th>Market</th><th>Year</th><th>Baseload (€/MWh)</th><th>Solar capture</th><th>Wind capture</th><th>Negative hours</th><th>Regression R²</th></tr></thead>
  <tbody>
    <tr v-for="r in table" :key="r.market + r.year">
      <td>{{ NAMES[r.market] }}</td><td>{{ r.year === 2026 ? '2026 YTD' : r.year }}</td><td>{{ r.baseload.toFixed(1) }}</td><td>{{ r.solar_capture_rate.toFixed(2) }}</td><td>{{ r.wind_capture_rate.toFixed(2) }}</td><td>{{ r.negative_hours }}</td><td>{{ r.r2.toFixed(2) }}</td>
    </tr>
  </tbody>
</table>

## Method

- **Capture rate** = generation-weighted average price ÷ time-weighted (baseload) price, per market and period.
- **Gas-plant cost** (short-run marginal cost) = (TTF + 0.202 × EUA) ÷ 0.4913, the standard clean-spark-spread convention; **clean spark spread** = power price − that cost.
- **Merit-order regression**: hourly OLS of price on gas-plant cost and residual load, by market and year, with Newey-West (HAC, 24-lag) standard errors.
- All three markets are grouped by CET delivery time; 15-minute data is averaged to hourly.

## Honest boundaries

- Since 1 October 2025 the day-ahead market clears in 15-minute periods; hourly averages smooth intra-hour negatives, so negative-hour counts from Q4 2025 can differ from counts on 15-minute data.
- The carbon price is an exchange-traded EUA proxy (SparkChange physical EUA ETC), not the ICE EUA futures settlement; gas is the TTF front month, not day-ahead gas.
- The hedge backtest proxies the month-ahead forward by the previous month's realised baseload (no free history of EEX month futures) and uses the national solar profile, not a single site; 33 months is a short sample. The best ratio holds between 80% and 110% across three forward proxies.
- The clean spark spread uses one standard plant; real fleets differ in efficiency, so the share of profitable hours is a benchmark, not any specific plant's outcome.

## Stack

Python · pandas · statsmodels · Energy-Charts REST API with cached, rate-limited fetches · pytest · uv

## Competencies

European power-market fundamentals · renewable capture and shape risk · hedge-ratio backtesting and risk decomposition · merit order and residual load · gas-to-power economics (clean spark spread) · time-series data pipelines · regression with autocorrelation-robust errors

---

[← All projects](/projects/)
