---
title: UK Finance Pay — Premium, Inflation, and Who Captures It
description: An illustrative data-storytelling exercise on UK finance pay — real terms, gender, region, and distribution, tracking published ONS series
date: 2026-07-01
lastUpdated: true
head:
  - - meta
    - property: og:title
      content: UK Finance Pay — Premium, Inflation, and Who Captures It
  - - meta
    - property: og:description
      content: An illustrative data-storytelling exercise on UK finance pay — real terms, gender, region, and distribution, tracking published ONS series
---

<script setup>
const metrics = [
  { label: 'Pay premium', value: '~60%', hint: 'vs whole economy' },
  { label: 'Real median', value: '−4.7%', hint: 'vs 2019 (CPIH)', accent: 'var(--color-negative)' },
  { label: 'Gender gap', value: '~22%', hint: 'finance industry GPG' },
]

const premium = [
  { label: 'Finance median', value: 160, sub: 'indexed whole economy = 100' },
  { label: 'Whole economy', value: 100, sub: 'baseline', color: 'muted' },
]

const realSeries = [
  {
    name: 'Nominal (2019=100)',
    data: [100, 102, 108, 115, 122, 128, 132],
  },
  {
    name: 'Real CPIH (2019=100)',
    data: [100, 99, 101, 98, 96, 95.5, 95.3],
  },
]
const realLabels = ['2019', '2020', '2021', '2022', '2023', '2024', '2025']

const roles = [
  { label: 'Brokers / dealers', value: 8 },
  { label: 'Senior managers', value: 2 },
  { label: 'Actuaries', value: -1, color: 'muted' },
  { label: 'Analysts', value: -4 },
  { label: 'Clerical roles', value: -7 },
  { label: 'Advisers', value: -9 },
]

const region = [
  { label: 'London finance', value: 145, sub: 'relative index' },
  { label: 'Rest of UK finance', value: 100, sub: 'baseline', color: 'muted' },
]

const composition = [
  { label: 'Levels premium', value: 40 },
  { label: 'Real erosion', value: 25 },
  { label: 'Regional skew', value: 20 },
  { label: 'Gender gap', value: 15 },
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

This is a data-storytelling exercise, not a rigorously sourced statistical study: it uses illustrative, schematic figures consistent with published ONS series to argue that UK finance's pay premium has been quietly eroding in real terms since 2019, and is captured very unevenly by gender and region. The eight-panel narrative walks from the headline level premium, through inflation-adjusted (CPIH-deflated) pay, to who actually captures it — drawing on ONS earnings, gender pay gap, and inflation series (ASHE, GPG, RTI, CPIH).

## Snapshot

<HeroMetrics :items="metrics" />

## The headline premium

Finance still commands a large **level** advantage vs the whole economy.

<VizPanel
  badge="Levels"
  title="Finance vs whole-economy median pay"
  subtitle="Schematic index: whole economy = 100. On the order of a ~60% premium in the RTI industry comparison used for the deck."
  source="ONS (ASHE/GPG/RTI/CPIH)"
  as-of="2019–2025 series"
>
  <EBar :items="premium" :max="180" x-name="Index (economy = 100)" />
</VizPanel>

## Real terms — the plot twist

Nominal rose; real sits below 2019.

<VizPanel
  badge="Inflation"
  title="Nominal vs real finance pay (2019 = 100)"
  subtitle="Path consistent with the project narrative (~−4.7% real median). Exact ONS points live in the processed workbook."
  source="ONS (ASHE/GPG/RTI/CPIH)"
  as-of="2019–2025 series"
>
  <ELine :labels="realLabels" :series="realSeries" :height="300" y-name="Index (2019 = 100)" />
</VizPanel>

## Who captures it

<VizGrid :cols="2">
  <VizPanel badge="Occupation" title="Real change by role (illustrative)" subtitle="Aggregate medians hide winners and losers after CPIH." source="ONS (ASHE/GPG/RTI/CPIH)" as-of="2019–2025 series">
    <EBar :items="roles" unit="%" :max="12" x-name="Real change (%)" />
  </VizPanel>
  <VizPanel badge="Geography" title="London vs rest of UK" subtitle="Geographic premium is first-order — not only sector choice." source="ONS (ASHE/GPG/RTI/CPIH)" as-of="2019–2025 series">
    <EBar :items="region" :max="160" x-name="Index (rest UK = 100)" />
  </VizPanel>
</VizGrid>

<VizPanel
  badge="Story weights"
  title="What drives the full narrative"
  subtitle="Levels premium survives; real erosion, region, and gender complete the picture."
  source="ONS (ASHE/GPG/RTI/CPIH)"
  as-of="2019–2025 series"
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
