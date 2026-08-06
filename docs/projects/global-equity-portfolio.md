---
title: Global Equity Portfolio Construction
description: GBP 10M long-only global equity fund — multi-factor selection, constrained optimization, and institutional risk management
date: 2026-03-01
lastUpdated: true
head:
  - - meta
    - property: og:title
      content: Global Equity Portfolio Construction
  - - meta
    - property: og:description
      content: GBP 10M long-only global equity fund — multi-factor selection, constrained optimization, and institutional risk management
---

<script setup>
const metrics = [
  { label: 'AUM', value: '£10M', hint: 'Long-only global equity' },
  { label: 'Holdings', value: '~29', hint: '9 sectors · 14+ countries' },
  { label: 'Model TE', value: '6.8%', hint: 'Process cap 8%' },
  { label: 'Max name', value: '7%', hint: 'Sector cap 35%' },
]

const factors = [
  { label: 'Quality', value: 18, sub: 'ROE · margins · ROIC' },
  { label: 'Momentum', value: 15, sub: '12-month price' },
  { label: 'Valuation', value: 12, sub: 'PEG / P/E · P/B' },
  { label: 'Growth', value: 10, sub: 'Sales · fwd EPS' },
  { label: 'Earn. quality', value: 8, sub: 'Accruals · cash conv.' },
  { label: 'EPS revision', value: 8, sub: '3m estimate change' },
  { label: 'Low volatility', value: 8, sub: '260d vol (lower better)' },
  { label: 'ESG', value: 5, sub: 'Bloomberg score' },
  { label: 'Secondary', value: 16, sub: 'Efficiency · conviction · SI · div' },
]

const sectors = [
  { label: 'Information Technology', value: 30 },
  { label: 'Industrials', value: 16.7 },
  { label: 'Financials', value: 15 },
  { label: 'Materials', value: 12.7 },
  { label: 'Communication', value: 8.3 },
  { label: 'Consumer Disc.', value: 7 },
  { label: 'Utilities', value: 7 },
  { label: 'Energy', value: 1.9 },
  { label: 'Staples', value: 1.4 },
]

const teParts = [
  { label: 'Idiosyncratic', value: 54.6 },
  { label: 'Style', value: 30.2 },
  { label: 'Industry', value: 11.5 },
  { label: 'Market', value: 3.7, color: 'muted' },
]

const varItems = [
  { label: 'Parametric VaR', value: 10.2, sub: '95% · 1-month', color: 'negative' },
  { label: 'Cornish–Fisher VaR', value: 10.4, sub: 'skew/kurt adjust', color: 'negative' },
  { label: 'Historical VaR', value: 5.4, sub: 'sample path', color: 'negative' },
  { label: 'Parametric CVaR', value: 12.8, sub: 'tail expectation', color: 'negative' },
]

const steps = [
  { title: 'Mandate', detail: 'MSCI World, TE budget, ESG floor, DM/EM mix' },
  { title: 'Score', detail: '13-factor DM/EM composites, sector-neutral' },
  { title: 'Select', detail: 'Liquidity · free float · veto · greedy caps' },
  { title: 'Optimise', detail: 'Factor cov · MV / CVaR / robust (CVXPY)' },
  { title: 'Risk', detail: 'TE · VaR suite · stress · FX' },
]
</script>

# Global Equity Portfolio Construction

University of Edinburgh · Investment Management · March 2026

This project builds and risk-manages a GBP 10 million long-only global equity portfolio benchmarked against the MSCI World, reporting institutional-grade risk across four separate Value-at-Risk (VaR — the largest loss expected over a set period, at a given confidence level) methodologies. The portfolio is built from a multi-factor stock-selection model, a constrained optimizer that balances return against risk and sector limits, and a Bloomberg-sourced ESG floor applied to every holding.

## Snapshot

<HeroMetrics :items="metrics" />

| | |
|---|---|
| **Benchmark** | MSCI World (iShares IWRD LN) |
| **DM / EM** | ~80% / 20% |
| **ESG** | Name-level Bloomberg floor; portfolio top-quartile of universe |

## Process

<ProcessRail :steps="steps" />

## Factor model

<VizPanel
  badge="Security selection"
  title="DM composite factor weights"
  subtitle="Quality and momentum lead; valuation and growth balance the book; secondary tilts include efficiency, conviction, short interest, and dividend."
  source="Company model output"
  as-of="March 2026"
>
  <EBar :items="factors" unit="%" :max="20" x-name="Factor weight (%)" />
</VizPanel>

## Portfolio structure

<VizGrid :cols="2">
  <VizPanel
    badge="Allocation"
    title="Sector weights"
    subtitle="Active IT sleeve with industrials and financials diversification."
    source="Company model output"
    as-of="March 2026"
  >
    <EDonut :items="sectors" center-value="9" center-label="Sectors" unit="%" />
  </VizPanel>
  <VizPanel
    badge="Active risk"
    title="Tracking-error decomposition"
    subtitle="Idiosyncratic + style dominate; market contribution kept small."
    source="Company model output"
    as-of="March 2026"
  >
    <EDonut :items="teParts" center-value="6.8%" center-label="Model TE" unit="%" />
  </VizPanel>
</VizGrid>

### Mandate constraints

| Constraint | Limit |
|---|---|
| Single name | ≤ 7% |
| Sector | ≤ 35% |
| Sub-industry | ≤ 15% |
| Tracking error | ≤ 8% process / 15% mandate |
| Liquidity | Min market cap & ADV |
| ESG | Minimum Bloomberg ESG per holding |

## Risk analytics

<VizPanel
  badge="Loss estimates"
  title="VaR / CVaR at 95% (1-month, % of NAV)"
  subtitle="Parametric and Cornish–Fisher sit near ~10% of NAV; historical VaR is lower — both families are reported."
  source="Bloomberg equity/ESG"
  as-of="March 2026"
>
  <EBar :items="varItems" unit="%" :max="14" x-name="Loss (% of NAV)" />
</VizPanel>

## Stack

Python · pandas · NumPy · SciPy · CVXPY · scikit-learn · Bloomberg equity/ESG · config-driven pipeline

## Competencies

Investment process · multi-factor selection · constrained optimisation · factor risk · VaR/CVaR · ESG integration

---

[← All projects](/projects/)
