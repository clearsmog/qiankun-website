---
title: WorldQuant BRAIN Alpha Research
description: WorldQuant BRAIN Gold — ACTIVE equity alphas with Sharpe, Fitness, expressions, and score progression
date: 2026-07-01
lastUpdated: true
head:
  - - meta
    - property: og:title
      content: WorldQuant BRAIN Alpha Research
  - - meta
    - property: og:description
      content: WorldQuant BRAIN Gold — ACTIVE equity alphas with Sharpe, Fitness, expressions, and score progression
---

<script setup>
const metrics = [
  { label: 'Challenge', value: 'Gold', hint: 'WorldQuant certificate', accent: '#e6b422' },
  { label: 'Peak score', value: '9,932', hint: 'from 2,000 Bronze', accent: '#0071e3' },
  { label: 'ACTIVE book', value: '10', hint: 'IS alphas live', accent: '#34c759' },
  { label: 'Best Sharpe', value: '2.91', hint: 'OI/equity + est. EPS', accent: '#af52de' },
]

const scorePoints = [
  { label: 'Jul 6', score: 2000, level: 'Bronze', rank: '25.8k' },
  { label: 'Jul 7', score: 4000, level: 'Bronze', rank: '22.6k' },
  { label: 'Jul 9', score: 8000, level: 'Silver', rank: '19.7k' },
  { label: 'Jul 10', score: 9932, level: 'Silver', rank: '18.9k' },
]

const sharpeBars = [
  { label: 'ZYnG1pV1', value: 2.91, sub: 'OI + est. EPS · TOP3000', color: '#0071e3' },
  { label: 'blq3YEkR', value: 2.53, sub: 'OI + 5d reverse', color: '#5856d6' },
  { label: 'N1roXeEL', value: 2.28, sub: 'OI + PCR options', color: '#af52de' },
  { label: 'd50w58jK', value: 2.2, sub: 'FCF + reverse · diversifier', color: '#34c759' },
  { label: 'd50Lv3Zv', value: 2.01, sub: 'Pure OI/equity', color: '#5ac8fa' },
  { label: 'mLbXoLmE', value: 1.85, sub: 'OI + EPS · TOP500', color: '#64d2ff' },
  { label: 'N1rONo0L', value: 1.69, sub: 'Pure est. EPS · TOP2000', color: '#ff9500' },
  { label: 'akn233gw', value: 1.69, sub: 'OI + guidance · TOP1000', color: '#ff9f0a' },
  { label: 'RR80pQnn', value: 1.64, sub: 'PCR + reverse', color: '#ff2d55' },
  { label: '3qRa0A96', value: 1.41, sub: 'Multi-leg composite', color: '#86868b' },
]

const fitnessBars = [
  { label: 'ZYnG1pV1', value: 2.18, color: '#0071e3' },
  { label: 'blq3YEkR', value: 1.81, color: '#5856d6' },
  { label: 'd50w58jK', value: 1.69, color: '#34c759' },
  { label: 'N1roXeEL', value: 1.65, color: '#af52de' },
  { label: 'N1rONo0L', value: 1.44, color: '#ff9500' },
  { label: 'd50Lv3Zv', value: 1.32, color: '#5ac8fa' },
  { label: 'mLbXoLmE', value: 1.17, color: '#64d2ff' },
  { label: 'RR80pQnn', value: 1.14, color: '#ff2d55' },
  { label: 'akn233gw', value: 1.1, color: '#ff9f0a' },
  { label: '3qRa0A96', value: 1.01, color: '#86868b' },
]

const themes = [
  { label: 'Quality / OI', value: 35 },
  { label: 'Analyst', value: 20 },
  { label: 'Hybrid reverse', value: 20 },
  { label: 'Options / PCR', value: 15 },
  { label: 'FCF', value: 10 },
]

const steps = [
  { title: 'Field → expression', detail: '4.3k local fields; group_rank + ts_rank baselines' },
  { title: 'Simulate & gate', detail: 'Sharpe · Fitness · TO · DD · concentration' },
  { title: 'Daily-return corr', detail: 'Reject clones ≥ 0.7 vs ACTIVE book' },
  { title: 'Submit → ACTIVE', detail: 'Confirm status; climb Bronze → Gold' },
]
</script>

# WorldQuant BRAIN Alpha Research

Independent systematic equity research · WorldQuant BRAIN Challenge · 2026

Mining pipeline on BRAIN: simulate → quality gates → **daily-return correlation** → submit. Account path **Bronze → Silver → Gold** with a diversified **ACTIVE** book across quality, analyst, cash-flow, options, and multi-universe sleeves.

![WorldQuant Challenge Gold Certificate](/projects/wq-alpha-research/gold-certificate-pdf.png)

## Outcomes

<HeroMetrics :items="metrics" />

<VizPanel
  badge="Score journey"
  title="Challenge score: Bronze → Silver → Gold track"
  subtitle="Platform snapshots. Rank improved from ~25.8k to ~18.9k as scored alphas and ACTIVE count rose."
>
  <EScorePath :points="scorePoints" />
</VizPanel>

## ACTIVE book performance

<VizGrid :cols="2">
  <VizPanel badge="IS Sharpe" title="ACTIVE alphas ranked by Sharpe" subtitle="Hover bars for theme. Best: quality + analyst blend at 2.91.">
    <EBar :items="sharpeBars" :max="3.2" />
  </VizPanel>
  <VizPanel badge="Fitness" title="Turnover-adjusted quality (Fitness)" subtitle="Fitness rewards return strength without excessive turnover.">
    <EBar :items="fitnessBars" :max="2.4" />
  </VizPanel>
</VizGrid>

<VizPanel
  badge="Diversification"
  title="Book composition by economic theme"
  subtitle="Not ten clones of the same OI/equity formula — axes chosen to pass self-correlation."
>
  <EDonut :items="themes" center-value="10" center-label="ACTIVE" unit="%" />
</VizPanel>

## Research loop

<ProcessRail :steps="steps" />

**Finding that unlocked submits:** OI/equity clones with Sharpe ~2.8–3.0 often fail SELF_CORRELATION (daily corr 0.75–0.90). Wins change the axis — **FCF + reverse** (~0.37 corr) and **OI + 50% options PCR** (~0.66) — or move to TOP2000/1000/500 after TOP3000 saturates.

## ACTIVE table

| ID | Universe | Sharpe | Fitness | Return | TO | Theme |
|---|---|---:|---:|---:|---:|---|
| `ZYnG1pV1` | TOP3000 | **2.91** | **2.18** | 10.5% | 18.6% | OI/equity + est. EPS |
| `blq3YEkR` | TOP3000 | **2.53** | **1.81** | 10.6% | 20.7% | OI/equity + 5d reverse |
| `N1roXeEL` | TOP3000 | **2.28** | **1.65** | 6.5% | 9.8% | OI/equity + put/call OI |
| `d50w58jK` | TOP3000 | **2.20** | **1.69** | 10.9% | 18.5% | FCF/equity + reverse |
| `d50Lv3Zv` | TOP3000 | **2.01** | **1.32** | 5.4% | 6.3% | Pure OI/equity |
| `mLbXoLmE` | TOP500 | **1.85** | **1.17** | 8.1% | 20.5% | OI + EPS (small univ.) |
| `N1rONo0L` | TOP2000 | **1.69** | **1.44** | 9.1% | 12.1% | Pure est. EPS |
| `akn233gw` | TOP1000 | **1.69** | **1.10** | 5.3% | 6.0% | OI + guidance |
| `RR80pQnn` | TOP3000 | **1.64** | **1.14** | 9.9% | 20.7% | PCR + reverse |
| `3qRa0A96` | TOP3000 | **1.41** | **1.01** | 6.4% | 3.6% | Multi-leg composite |

## Expressions (selected)

```fastexpr
/* Top Sharpe — ZYnG1pV1 */
0.5 * group_rank(ts_rank(operating_income / equity, 126), subindustry)
+ 0.5 * group_rank(ts_rank(est_eps / close, 126), industry)

/* Diversifier — d50w58jK (~0.37 corr vs pure OI) */
0.6 * group_rank(ts_rank(free_cash_flow_reported_value / equity, 126), industry)
+ 0.4 * group_rank(-ts_delta(close, 5), industry)

/* Options hybrid — N1roXeEL */
0.5 * group_rank(ts_rank(operating_income / equity, 126), subindustry)
+ 0.5 * group_rank(-ts_rank(pcr_oi_270, 120), industry)
```

## Competencies

Equity factor research · IS metrics · turnover control · portfolio self-correlation · multi-universe diversification · API automation

---

[← All projects](/projects/)
