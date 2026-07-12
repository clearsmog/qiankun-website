---
title: Cisco Systems Equity Valuation
description: Full DCF and multiples valuation of NASDAQ CSCO — WACC, 10-year FCFF forecast, reverse DCF, and relative valuation
date: 2026-06-01
lastUpdated: true
head:
  - - meta
    - property: og:title
      content: Cisco Systems Equity Valuation
  - - meta
    - property: og:description
      content: Full DCF and multiples valuation of NASDAQ CSCO — WACC, 10-year FCFF forecast, reverse DCF, and relative valuation
---

<script setup>
const metrics = [
  { label: 'Base intrinsic', value: '~$49', hint: 'FCFF DCF headline', accent: '#0071e3' },
  { label: 'Market (as-of)', value: '~$120', hint: '~2.5× intrinsic', accent: '#ff3b30' },
  { label: 'WACC', value: '8.9%', hint: 'CAPM + Damodaran', accent: '#5856d6' },
  { label: 'Rev CAGR', value: '4.9%', hint: 'TTM → Year 10', accent: '#34c759' },
]

const ranges = [
  { label: 'Bear DCF', low: 22, high: 34, mid: 28, color: '#ff3b30' },
  { label: 'Base DCF', low: 42, high: 55, mid: 48.6, color: '#0071e3' },
  { label: 'Bull DCF', low: 62, high: 82, mid: 72, color: '#34c759' },
  { label: 'Peer multiples', low: 70, high: 100, mid: 85, color: '#af52de' },
]

const wacc = [
  { label: 'Risk-free (adj.)', value: 4.1, sub: '10Y UST − 40 bp sovereign', color: '#5ac8fa' },
  { label: 'ERP contribution', value: 5.14, sub: 'β × geo-blended ERP', color: '#5856d6' },
  { label: 'Cost of equity', value: 9.24, sub: 'CAPM Ke', color: '#0071e3' },
  { label: 'After-tax Kd', value: 3.78, sub: 'IG debt', color: '#34c759' },
  { label: 'WACC', value: 8.93, sub: '94% equity weight', color: '#ff9500' },
]

const pathSeries = [
  {
    name: 'Revenue ($B)',
    color: '#0071e3',
    data: [60.7, 64.8, 72, 80, 88, 97.9],
  },
  {
    name: 'FCFF ($B)',
    color: '#34c759',
    data: [null, 12.7, 13.8, 15.0, 16.2, 17.6],
  },
]
const pathLabels = ['TTM', 'Y1', 'Y3', 'Y5', 'Y7', 'Y10']

const steps = [
  { title: 'Business', detail: 'AI cycle vs FY24 reverse · Splunk' },
  { title: 'Historicals', detail: '10-K · R&D capitalise · segments' },
  { title: 'WACC', detail: 'Rf · ERP · Hamada β · MV weights' },
  { title: 'FCFF DCF', detail: '10-year · g = Rf · reinvest > 0' },
  { title: 'Stress', detail: 'Scenarios · reverse DCF · MC' },
]
</script>

# Cisco Systems Equity Valuation (CSCO)

University of Edinburgh · Equity Valuation (CMSE11664) · June 2026

Full **buy-side style** valuation of **Cisco Systems (NASDAQ: CSCO)** — FCFF DCF, peer multiples, scenarios, reverse DCF, Monte Carlo — with a reproducible Python model and Excel audit trail.

## Snapshot

<HeroMetrics :items="metrics" />

**Thesis at valuation date:** **overvalued** on fundamentals. Market price embeds AI-driven growth beyond a moderated-demand path — not a denial that AI networking demand is real.

## Value map

<VizPanel
  badge="Football field"
  title="Intrinsic and relative ranges vs market"
  subtitle="Red dashed line = market price (~$120). Base DCF mid ~$49. Even bull and peer bands sit well below the market under credible assumptions."
>
  <EFootball :ranges="ranges" :market="120" market-label="Mkt" unit="$" />
</VizPanel>

## WACC

Equity weight ~94% → WACC close to cost of equity.

<VizPanel
  badge="Cost of capital"
  title="WACC build components"
  subtitle="Rf 4.10% after sovereign spread; Ke ~9.2%; WACC ~8.9%."
>
  <EBar :items="wacc" unit="%" :max="10" />
</VizPanel>

## Growth & cash flows

Base case: TTM ~$61B → Year-10 ~$98B (**~4.9% CAGR**); FCFF ~$12.7B → ~$17.6B.

<VizPanel
  badge="Forecast"
  title="Base-case revenue and FCFF path"
  subtitle="Moderated AI demand: real but partly front-loaded. Terminal g = Rf; terminal reinvestment = g / ROIC > 0."
>
  <ELine :labels="pathLabels" :series="pathSeries" y-suffix="" :height="300" />
</VizPanel>

## Process

<ProcessRail :steps="steps" />

### Peers

Arista · Palo Alto · Fortinet · HPE (Juniper) · Broadcom — primary **EV/EBITDA**, secondary EV/Sales and P/E.

## Stack

Python (`uv`) · openpyxl audit workbook · Typst report · Bloomberg / LSEG / 10-Ks

## Competencies

Equity research · FCFF DCF · WACC · relative valuation · reverse DCF · scenario analysis

---

[← All projects](/projects/)
