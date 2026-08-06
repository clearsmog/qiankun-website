---
title: Board Gender Diversity and Corporate ESG
description: Empirical study of whether women on boards raise environmental and social performance — measurement, fixed effects, and California SB 826
date: 2026-07-01
lastUpdated: true
head:
  - - meta
    - property: og:title
      content: Board Gender Diversity and Corporate ESG
  - - meta
    - property: og:description
      content: Empirical study of whether women on boards raise environmental and social performance — measurement, fixed effects, and California SB 826
---

<script setup>
const metrics = [
  { label: 'Firms', value: '2,270', hint: 'US Refinitiv-rated' },
  { label: 'Firm-years', value: '18,101', hint: '2012–2024 panel' },
  { label: 'E coefficient', value: '+2.133***', hint: 'per 1 SD diversity' },
  { label: 'S coefficient', value: '+1.08***', hint: 'per 1 SD diversity' },
]

const forest = [
  { label: 'Environmental', value: 2.133, se: 0.307, primary: true, stars: '***' },
  { label: 'Social', value: 1.08, se: 0.225, primary: true, stars: '***' },
  { label: 'Composite ESG', value: 1.756, se: 0.188, primary: false, stars: '***' },
  { label: 'Governance', value: 2.521, se: 0.275, primary: false, stars: '***' },
]

const magnitude = [
  { label: 'E / mean E', value: 6.8, sub: '2.133 ÷ 31.3' },
  { label: 'S / mean S', value: 2.4, sub: '1.08 ÷ 45.7' },
  { label: 'G / mean G', value: 4.8, sub: 'mechanical inflation check' },
]

const steps = [
  { title: 'Measure', detail: 'Primary = E & S (not mechanical G)' },
  { title: 'Build panel', detail: 'Refinitiv + Compustat + CRSP/CCM' },
  { title: 'Estimate', detail: 'Firm + year FE, clustered SEs' },
  { title: 'Identify', detail: 'Lead–lag · PSM · SB 826 DiD' },
]
</script>

# Board Gender Diversity and Corporate ESG

University of Edinburgh · Shareholder Value and ESG · July 2026

Across 2,270 US firms and 18,101 firm-years, greater board gender diversity is robustly associated with higher environmental and social (E&S) performance — but a California-law natural experiment finds no evidence the relationship is causal. The panel uses firm and year fixed effects (statistical controls that strip out anything constant within a firm or a year, isolating the year-to-year relationship) with clustered standard errors to isolate the association, then tests causality with a lead-lag design, propensity-score matching, and California SB 826's board-diversity mandate as a quasi-experiment.

## Snapshot

<HeroMetrics :items="metrics" />

## Main result — coefficient forest

<VizPanel
  badge="Firm + year FE · N = 18,101"
  title="Effect of lagged board gender diversity (1 SD)"
  subtitle="E and S rise 2.133 and 1.08 points per 1 SD of diversity — the real outcomes; the still-larger G coefficient flags mechanical inflation, not signal."
  source="Refinitiv"
  as-of="2012–2024 panel"
>
  <EForest :items="forest" x-name="Effect (ESG pts / SD)" />
</VizPanel>

## Economic magnitude

<VizPanel
  badge="Scale"
  title="Coefficient as % of pillar mean"
  subtitle="E moves more relative to its mean than S; G is shown only for measurement context."
  source="Refinitiv"
  as-of="2012–2024 panel"
>
  <EBar :items="magnitude" unit="%" :max="8" x-name="% of pillar mean" />
</VizPanel>

## Hypotheses

| | Prediction | Result |
|---|---|---|
| **H1** | Diversity ↑ → E, S ↑ | **Supported** (both **\*\*\***) |
| **H2** | G / composite inflated vs E, S | **Supported** (G largest) |
| **H3** | If causal, SB 826 raises E, S | **Not supported** (diversity ↑; E/S RF n.s.) |

**Reading:** robust **conditional association** on E and S; diversity is better read as a **marker** of stakeholder-oriented firms than a stand-alone causal lever. Lead–lag flags reverse causality; SB 826 first stage is strong while reduced form on E/S is insignificant.

## Process

<ProcessRail :steps="steps" />

## Design note

Board gender is an **input to the governance pillar**. Primary outcomes are **E** and **S** only. Composite and G are reported to make mechanical inflation visible — not as the main claim.

## Stack

Python / Refinitiv Codebook · WRDS Compustat (SAS) · Stata `reghdfe` · Typst write-up

## Competencies

ESG measurement · panel FE · quasi-experiments · research integrity · Refinitiv/Compustat

---

[← All projects](/projects/)
