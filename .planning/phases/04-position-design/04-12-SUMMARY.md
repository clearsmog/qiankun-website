---
phase: 04-position-design
plan: 12 (post-phase extension, user-approved scope override)
subsystem: content
tags: [case-study, lng, energy, real-options, monte-carlo, mip, compliance]

# Dependency graph
requires:
  - phase: 04-position-design
    plan: 04
    provides: "VizPanel source/asOf provenance props"
  - phase: 04-position-design
    plan: 06
    provides: "Axis-title props and semantic colour strings on all chart components"
  - phase: 04-position-design
    plan: 05
    provides: "Project-card grid ready for first-card insertion"
provides:
  - "docs/projects/lng-spa-valuation.md — 9-exhibit energy/derivatives case study, first card on the projects index, sidebar entry after Overview"
affects: []

key-files:
  created:
    - docs/projects/lng-spa-valuation.md
  modified:
    - docs/projects/index.md
    - docs/.vitepress/config.js

key-decisions:
  - "SCOPE OVERRIDE: PROJECT.md v1.0 marked 'new energy/commodities case study' out of scope; the user explicitly requested it on 2026-08-06 — recorded here as the authorising decision."
  - "Contract ANONYMISED by user decision: referred to only as 'a US Gulf Coast FOB LNG SPA — terms taken from a publicly filed SEC exhibit'. No counterparty, terminal, or vessel names."
  - "Freight backtest benchmark cited generically as 'published freight route assessments' — the benchmark series is vendor-published; the series itself is never plotted or tabulated, only aggregate error statistics."
  - "SPA-run numbers (deep ITM: intrinsic $807m / full $1,404m / extrinsic $597m) and stylised ATM waterfall numbers (vol grid, $/MMBtu) kept in separate exhibits with the moneyness flip called out in copy — never mixed."

# COMPLIANCE — READ BEFORE EDITING THE LNG PAGE
compliance:
  - "Content was hand-transcribed from a PRIVATE research repo that must never be linked, quoted by path, or screenshotted."
  - "Banned strings on this page and its integration hunks (verified 0 hits at commit): ENN, Centrica, Cheniere, Sabine, interview, employer, vendor names (Platts/Tullett), private path fragments (Developer/LNG, 6-firsthand, _data/)."
  - "Banned content classes: employer vessel-log comparisons, desk-formula reproduction claims, arb-vs-DOE-flow correlations, any employer-book validation framing."
  - "Verification gates run at commit: banned-string greps CLEAN; no ![ images; histogram counts sum to 3000; freight stack sums to $2.73; npm run docs:build exit 0 with dist/projects/lng-spa-valuation.html emitted."

requirements-completed: []
---

# 04-12: LNG SPA Real-Option Valuation case study

New anonymised energy-derivatives case study built entirely with existing components
(HeroMetrics, VizPanel/VizGrid, EHistogram, EGroupBar, EBar, ELine, EDonut, ProcessRail),
following every Phase-4 convention: source/as-of on all 9 exhibits, unit-bearing axis titles
≤22 chars, semantic colour strings only, takeaway subtitles, outcome-first lead, honest
boundaries section. Inserted as the first project card and first sidebar entry — the only
energy case study on a site aimed at finance/energy hiring managers.
