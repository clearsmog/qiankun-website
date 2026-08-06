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
  { label: 'Challenge', value: 'Gold', hint: 'WorldQuant certificate' },
  { label: 'Peak score', value: '9,932', hint: 'from 2,000 Bronze' },
  { label: 'ACTIVE book', value: '10', hint: 'IS alphas live' },
  { label: 'Best Sharpe', value: '2.91', hint: 'OI/equity + est. EPS' },
]

const scorePoints = [
  { label: 'Jul 6', score: 2000, level: 'Bronze', rank: '25.8k' },
  { label: 'Jul 7', score: 4000, level: 'Bronze', rank: '22.6k' },
  { label: 'Jul 9', score: 8000, level: 'Silver', rank: '19.7k' },
  { label: 'Jul 10', score: 9932, level: 'Silver', rank: '18.9k' },
]

const sharpeBars = [
  { label: 'ZYnG1pV1', value: 2.91, sub: 'OI + est. EPS · TOP3000' },
  { label: 'blq3YEkR', value: 2.53, sub: 'OI + 5d reverse' },
  { label: 'N1roXeEL', value: 2.28, sub: 'OI + PCR options' },
  { label: 'd50w58jK', value: 2.2, sub: 'FCF + reverse · diversifier' },
  { label: 'd50Lv3Zv', value: 2.01, sub: 'Pure OI/equity' },
  { label: 'mLbXoLmE', value: 1.85, sub: 'OI + EPS · TOP500' },
  { label: 'N1rONo0L', value: 1.69, sub: 'Pure est. EPS · TOP2000' },
  { label: 'akn233gw', value: 1.69, sub: 'OI + guidance · TOP1000' },
  { label: 'RR80pQnn', value: 1.64, sub: 'PCR + reverse' },
  { label: '3qRa0A96', value: 1.41, sub: 'Multi-leg composite', color: 'muted' },
]

const fitnessBars = [
  { label: 'ZYnG1pV1', value: 2.18 },
  { label: 'blq3YEkR', value: 1.81 },
  { label: 'd50w58jK', value: 1.69 },
  { label: 'N1roXeEL', value: 1.65 },
  { label: 'N1rONo0L', value: 1.44 },
  { label: 'd50Lv3Zv', value: 1.32 },
  { label: 'mLbXoLmE', value: 1.17 },
  { label: 'RR80pQnn', value: 1.14 },
  { label: 'akn233gw', value: 1.1 },
  { label: '3qRa0A96', value: 1.01, color: 'muted' },
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

This project reached Gold tier in the WorldQuant BRAIN Challenge — an independently verifiable, externally judged systematic-alpha competition — building a ten-strategy ACTIVE book with a best Sharpe ratio (a strategy's return per unit of risk taken) of 2.91. Each alpha is produced by a repeatable mining pipeline: generate a candidate signal from a 4,300-field universe, pass it through quality gates (Sharpe, fitness, turnover, drawdown, concentration), reject anything too similar to an existing strategy, then submit for ACTIVE status.

![WorldQuant Challenge Gold Certificate](/projects/wq-alpha-research/gold-certificate-pdf.png)

## Outcomes

<HeroMetrics :items="metrics" />

<VizPanel
  badge="Score journey"
  title="Challenge score: Bronze → Silver → Gold track"
  subtitle="Platform snapshots. Rank improved from ~25.8k to ~18.9k as scored alphas and ACTIVE count rose."
  source="WorldQuant BRAIN platform"
  as-of="July 2026"
>
  <EScorePath :points="scorePoints" x-name="Snapshot date (2026)" y-name="Challenge score (pts)" />
</VizPanel>

## ACTIVE book performance

<VizGrid :cols="2">
  <VizPanel badge="IS Sharpe" title="ACTIVE alphas ranked by Sharpe" subtitle="Hover bars for theme. Best: quality + analyst blend at 2.91." source="WorldQuant BRAIN platform" as-of="July 2026">
    <EBar :items="sharpeBars" :max="3.2" x-name="Sharpe ratio (IS)" />
  </VizPanel>
  <VizPanel badge="Fitness" title="Turnover-adjusted quality (Fitness)" subtitle="The top Sharpe alphas hold their lead once turnover is penalised — returns aren't bought with churn." source="WorldQuant BRAIN platform" as-of="July 2026">
    <EBar :items="fitnessBars" :max="2.4" x-name="Fitness (IS)" />
  </VizPanel>
</VizGrid>

<VizPanel
  badge="Diversification"
  title="Book composition by economic theme"
  subtitle="Not ten clones of the same OI/equity formula — axes chosen to pass self-correlation."
  source="WorldQuant BRAIN platform"
  as-of="July 2026"
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
