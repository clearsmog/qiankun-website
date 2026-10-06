---
title: WorldQuant BRAIN Alpha Research
description: WorldQuant BRAIN research consultant. Fourteen ACTIVE equity alphas across the US and Asia, built on a tested research platform.
date: 2026-07-01
lastUpdated: true
head:
  - - meta
    - property: og:title
      content: WorldQuant BRAIN Alpha Research
  - - meta
    - property: og:description
      content: WorldQuant BRAIN research consultant. Fourteen ACTIVE equity alphas across the US and Asia, built on a tested research platform.
---

<script setup>
const metrics = [
  { label: 'Role', value: 'Consultant', hint: 'WorldQuant BRAIN, since Sep 2026' },
  { label: 'ACTIVE book', value: '14', hint: 'US and Asia' },
  { label: 'Best Sharpe, 10-yr IS', value: '2.91', hint: 'Asia, consultant standard' },
  { label: 'Challenge', value: 'Gold', hint: 'peak score 9,932' },
]

const scorePoints = [
  { label: 'Jul 6', score: 2000, level: 'Bronze', rank: '25.8k' },
  { label: 'Jul 7', score: 4000, level: 'Bronze', rank: '22.6k' },
  { label: 'Jul 9', score: 8000, level: 'Silver', rank: '19.7k' },
  { label: 'Jul 10', score: 9932, level: 'Silver', rank: '18.9k' },
]

const sharpeBars = [
  { label: 'US 1', value: 3.03, sub: 'Quality + options + reversal', color: 'muted-strong' },
  { label: 'Asia 1', value: 2.91, sub: 'Model forecast blend · 10-yr IS', color: 'positive' },
  { label: 'US 2', value: 2.91, sub: 'Quality + analyst estimates', color: 'muted-strong' },
  { label: 'US 3', value: 2.53, sub: 'Quality + short-term reversal', color: 'muted-strong' },
  { label: 'US 4', value: 2.42, sub: 'Quality + options + reversal · TOP1000', color: 'muted-strong' },
  { label: 'US 5', value: 2.28, sub: 'Quality + options', color: 'muted-strong' },
  { label: 'Asia 2', value: 2.23, sub: 'Forecast + hedge + trend · 10-yr IS', color: 'positive' },
  { label: 'US 6', value: 2.2, sub: 'Cash flow + reversal', color: 'muted-strong' },
  { label: 'US 7', value: 2.01, sub: 'Pure quality', color: 'muted-strong' },
  { label: 'US 8', value: 1.85, sub: 'Quality + analyst · TOP500', color: 'muted-strong' },
  { label: 'US 9', value: 1.69, sub: 'Analyst estimates · TOP2000', color: 'muted-strong' },
  { label: 'US 10', value: 1.69, sub: 'Quality + guidance · TOP1000', color: 'muted-strong' },
  { label: 'US 11', value: 1.64, sub: 'Options + reversal', color: 'muted-strong' },
  { label: 'US 12', value: 1.41, sub: 'Multi-leg composite', color: 'muted-strong' },
]

const themes = [
  { label: 'Quality-anchored blends (US)', value: 57 },
  { label: 'Model-forecast blends (Asia)', value: 14 },
  { label: 'Analyst estimates (US)', value: 7 },
  { label: 'Cash flow + reversal (US)', value: 7 },
  { label: 'Options + reversal (US)', value: 7 },
  { label: 'Multi-leg composite (US)', value: 7 },
]

const steps = [
  { title: 'Survey', detail: 'One plain probe per dataset to find what carries signal on its own' },
  { title: 'Screen recency', detail: 'Split each probe’s daily PnL into early and recent years' },
  { title: 'Combine', detail: 'Pair strong, crowded signals with weaker, unusual ones' },
  { title: 'Neutralise', detail: 'Strip common factor exposure to stand apart from the pool' },
  { title: 'Pre-check, then submit', detail: 'Run the platform’s full check before spending a submission' },
]
</script>

# WorldQuant BRAIN Alpha Research

Systematic equity research · WorldQuant BRAIN research consultant · 2026

After reaching Gold in the WorldQuant BRAIN Challenge, I was accepted as a BRAIN research consultant in September 2026. The book now holds fourteen ACTIVE alphas across the US and Asia. Consultant submissions are held to a stricter standard than the Challenge: a ten-year in-sample window instead of five, and a correlation test against every other consultant’s alphas rather than only my own. The two Asian alphas, both submitted under that standard, reach Sharpe ratios of 2.91 and 2.23.

![WorldQuant Challenge Gold Certificate](/projects/wq-alpha-research/gold-certificate-pdf.png)

## Outcomes

<HeroMetrics :items="metrics" />

<VizPanel
  badge="Challenge"
  title="Challenge score: Bronze to Silver to Gold"
  subtitle="Platform snapshots from the Challenge phase. Rank improved from about 25.8k to 18.9k as scored alphas and the ACTIVE count rose."
  source="WorldQuant BRAIN platform"
  as-of="July 2026"
>
  <EScorePath :points="scorePoints" x-name="Snapshot date (2026)" y-name="Challenge score (pts)" />
</VizPanel>

## ACTIVE book

<VizPanel badge="IS Sharpe" title="ACTIVE alphas ranked by Sharpe" subtitle="US alphas (grey) were scored on the Challenge’s five-year window; the Asian alphas (green) on the consultant ten-year window." source="WorldQuant BRAIN platform" as-of="October 2026">
  <EBar :items="sharpeBars" :max="3.4" :height="460" x-name="Sharpe ratio (IS)" />
</VizPanel>

<VizPanel badge="Diversification" title="Book composition by theme" subtitle="Share of the fourteen ACTIVE alphas. The 2026 additions moved the book beyond US quality factors into Asian forecast-based signals." source="WorldQuant BRAIN platform" as-of="October 2026">
  <EDonut :items="themes" center-value="14" center-label="ACTIVE" unit="%" />
</VizPanel>

| Region | Universe | Theme | Sharpe | Fitness | Turnover | IS window |
|---|---|---|---:|---:|---:|---|
| US | TOP3000 | Quality + options + reversal | **3.03** | **2.50** | 13.5% | 5 years |
| Asia | MINVOL10M | Model forecast blend | **2.91** | **1.66** | 22.7% | 10 years |
| US | TOP3000 | Quality + analyst estimates | **2.91** | **2.18** | 18.6% | 5 years |
| US | TOP3000 | Quality + short-term reversal | **2.53** | **1.81** | 20.7% | 5 years |
| US | TOP1000 | Quality + options + reversal | **2.42** | **1.86** | 13.5% | 5 years |
| US | TOP3000 | Quality + options | **2.28** | **1.65** | 9.8% | 5 years |
| Asia | MINVOL10M | Forecast + hedge + trend | **2.23** | **1.14** | 24.5% | 10 years |
| US | TOP3000 | Cash flow + reversal | **2.20** | **1.69** | 18.5% | 5 years |
| US | TOP3000 | Pure quality | **2.01** | **1.32** | 6.3% | 5 years |
| US | TOP500 | Quality + analyst | **1.85** | **1.17** | 20.5% | 5 years |
| US | TOP2000 | Analyst estimates | **1.69** | **1.44** | 12.1% | 5 years |
| US | TOP1000 | Quality + guidance | **1.69** | **1.10** | 6.0% | 5 years |
| US | TOP3000 | Options + reversal | **1.64** | **1.14** | 20.7% | 5 years |
| US | TOP3000 | Multi-leg composite | **1.41** | **1.01** | 3.6% | 5 years |

Signal definitions are not published: they are the substance of the research, and a public formula is quickly copied, which raises its correlation with the consultant pool.

## Research approach

<ProcessRail :steps="steps" />

**The longer window changed what works.** Re-run on the ten-year window with identical settings, one of the strongest US alphas fell from a Sharpe of 2.28 to 1.37. Every Challenge-era recipe had to be tested again rather than reused.

**The strongest signal was not submittable on its own.** In Asia, the best single signal reached a Sharpe above 3, but it failed the consultant-pool correlation test at 0.78 because other consultants already trade it in plain form. Blending it with less-used signals and neutralising common factor exposure brought that correlation down to 0.51 and lifted the Sharpe to 2.91.

**Recent years decide the last check.** Two otherwise passing blends failed the platform’s two-year stability test. Splitting each ingredient’s daily PnL into 2014–21 and 2022–23 showed which signals were fading and which were strengthening; adding one strengthening signal cleared the test. The local estimate matched the platform’s figure to two decimal places.

## Research platform

The work runs on a research platform I assembled from three open-source projects and extended for the consultant tier:

- a research database that records every candidate, simulation and submission, so no idea is simulated twice
- a scheduler that keeps eight simulations running and recovers from network and platform errors
- field catalogues for nine regions, with validation of every candidate before it reaches the platform
- correlation gates against my own book, and the platform’s full submission check run before each submission, so refused candidates never use one of the four daily submission slots
- about 680 automated tests

## Competencies

Equity factor research · cross-regional signal discovery · factor neutralisation · out-of-sample robustness · portfolio correlation control · research automation and testing

---

[← All projects](/projects/)
