---
title: UK Finance Pay — Premium, Inflation, and Who Captures It
description: ONS-based analysis of UK finance sector pay — real terms, gender, region, and distribution
date: 2026-07-01
lastUpdated: true
head:
  - - meta
    - property: og:title
      content: UK Finance Pay — Premium, Inflation, and Who Captures It
  - - meta
    - property: og:description
      content: ONS-based analysis of UK finance sector pay — real terms, gender, region, and distribution
---

<script setup>
const metrics = [
  { label: 'Pay premium', value: '~60%', hint: 'vs whole economy', accent: '#0071e3' },
  { label: 'Real median', value: '−4.7%', hint: 'vs 2019 (CPIH)', accent: '#ff3b30' },
  { label: 'Gender gap', value: '~22%', hint: 'finance industry GPG', accent: '#ff9500' },
  { label: 'Views', value: '8', hint: 'ONS-backed panels', accent: '#5856d6' },
]

const premium = [
  { label: 'Finance median', value: 160, sub: 'indexed whole economy = 100', color: '#0071e3' },
  { label: 'Whole economy', value: 100, sub: 'baseline', color: '#86868b' },
]

const realSeries = [
  {
    name: 'Nominal (2019=100)',
    color: '#0071e3',
    data: [100, 102, 108, 115, 122, 128, 132],
  },
  {
    name: 'Real CPIH (2019=100)',
    color: '#ff9500',
    data: [100, 99, 101, 98, 96, 95.5, 95.3],
  },
]
const realLabels = ['2019', '2020', '2021', '2022', '2023', '2024', '2025']

const roles = [
  { label: 'Brokers / dealers', value: 8, color: '#34c759' },
  { label: 'Senior managers', value: 2, color: '#30d158' },
  { label: 'Actuaries', value: -1, color: '#86868b' },
  { label: 'Analysts', value: -4, color: '#ff9500' },
  { label: 'Clerical roles', value: -7, color: '#ff3b30' },
  { label: 'Advisers', value: -9, color: '#ff2d55' },
]

const region = [
  { label: 'London finance', value: 145, sub: 'relative index', color: '#5856d6' },
  { label: 'Rest of UK finance', value: 100, sub: 'baseline', color: '#a8b0bd' },
]

const composition = [
  { label: 'Levels premium', value: 40, color: '#0071e3' },
  { label: 'Real erosion', value: 25, color: '#ff9500' },
  { label: 'Regional skew', value: 20, color: '#5856d6' },
  { label: 'Gender gap', value: 15, color: '#ff2d55' },
]

const steps = [
  { title: 'Pull ONS', detail: 'ASHE · GPG · RTI · CPIH' },
  { title: 'Clean', detail: 'Sheet-per-series workbook' },
  { title: 'Slice', detail: 'Level · real · role · region · gender' },
  { title: 'Narrate', detail: 'Eight-panel story deck' },
]
</script>

# UK Finance Pay: Premium, Inflation, and Who Captures It

Data Skills · July 2026

Does “finance pays best” survive once **inflation, region, gender, and the distribution** enter the picture? ONS-based data storytelling for the UK labour market.

## Snapshot

<HeroMetrics :items="metrics" />

## The headline premium

Finance still commands a large **level** advantage vs the whole economy.

<VizPanel
  badge="Levels"
  title="Finance vs whole-economy median pay"
  subtitle="Schematic index: whole economy = 100. On the order of a ~60% premium in the RTI industry comparison used for the deck."
>
  <EBar :items="premium" :max="180" />
</VizPanel>

## Real terms — the plot twist

Nominal rose; real sits below 2019.

<VizPanel
  badge="Inflation"
  title="Nominal vs real finance pay (2019 = 100)"
  subtitle="Path consistent with the project narrative (~−4.7% real median). Exact ONS points live in the processed workbook."
>
  <ELine :labels="realLabels" :series="realSeries" :height="300" />
</VizPanel>

## Who captures it

<VizGrid :cols="2">
  <VizPanel badge="Occupation" title="Real change by role (illustrative)" subtitle="Aggregate medians hide winners and losers after CPIH.">
    <EBar :items="roles" unit="%" :max="12" />
  </VizPanel>
  <VizPanel badge="Geography" title="London vs rest of UK" subtitle="Geographic premium is first-order — not only sector choice.">
    <EBar :items="region" :max="160" />
  </VizPanel>
</VizGrid>

<VizPanel
  badge="Story weights"
  title="What drives the full narrative"
  subtitle="Levels premium survives; real erosion, region, and gender complete the picture."
>
  <EDonut :items="composition" center-value="4" center-label="Angles" unit="%" />
</VizPanel>

## Conclusion

“Finance pays best” **holds as a snapshot of levels**, not as a complete 2019–2025 story: real median **down**, growth **lagged**, gains **uneven** by gender, region, and percentile.

## Process

<ProcessRail :steps="steps" />

## Stack

ONS ASHE · GPG · PAYE RTI · CPIH · Python (pandas) · presentation deck

## Competencies

Official statistics · real vs nominal · distributional thinking · data storytelling

---

[← All projects](/projects/)
