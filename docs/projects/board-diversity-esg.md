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
  { label: 'Firms', value: '2,270', hint: 'US Refinitiv-rated', accent: '#0071e3' },
  { label: 'Firm-years', value: '18,101', hint: '2012–2024 panel', accent: '#5856d6' },
  { label: 'E coefficient', value: '+2.13***', hint: 'per 1 SD diversity', accent: '#34c759' },
  { label: 'S coefficient', value: '+1.08***', hint: 'per 1 SD diversity', accent: '#30d158' },
]

const forest = [
  { label: 'Environmental', value: 2.133, se: 0.307, primary: true, stars: '***' },
  { label: 'Social', value: 1.08, se: 0.225, primary: true, stars: '***' },
  { label: 'Composite ESG', value: 1.756, se: 0.188, primary: false, stars: '***' },
  { label: 'Governance', value: 2.521, se: 0.275, primary: false, stars: '***' },
]

const magnitude = [
  { label: 'E / mean E', value: 6.8, sub: '2.13 ÷ 31.3', color: '#34c759' },
  { label: 'S / mean S', value: 2.4, sub: '1.08 ÷ 45.7', color: '#30d158' },
  { label: 'G / mean G', value: 4.8, sub: 'mechanical inflation check', color: '#ff9500' },
]

const steps = [
  { title: 'Measure', detail: 'Primary = E & S (not mechanical G)' },
  { title: 'Build panel', detail: 'Refinitiv + Compustat + CRSP/CCM' },
  { title: 'Estimate', detail: 'Firm + year FE, clustered SEs' },
  { title: 'Identify', detail: 'Lead–lag · PSM · SB 826 DiD' },
]
</script>

# Do Women Directors Move ESG?

University of Edinburgh · Shareholder Value and ESG (CMSE11621) · July 2026

Does greater female board representation improve **environmental and social** performance? Panel FE plus a California SB 826 quasi-experiment — with a deliberate measurement design that separates real E/S response from mechanical governance inflation.

## Snapshot

<HeroMetrics :items="metrics" />

## Main result — coefficient forest

<VizPanel
  badge="Firm + year FE · N = 18,101"
  title="Effect of lagged board gender diversity (1 SD)"
  subtitle="Green points are primary outcomes (E, S). Orange points show composite and governance — largest G coefficient is the mechanical-inflation check."
>
  <EForest :items="forest" />
</VizPanel>

## Economic magnitude

<VizPanel
  badge="Scale"
  title="Coefficient as % of pillar mean"
  subtitle="E moves more relative to its mean than S; G is shown only for measurement context."
>
  <EBar :items="magnitude" unit="%" :max="8" />
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
