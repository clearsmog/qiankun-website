---
phase: 04-position-design
plan: 02
subsystem: ui
tags: [design-tokens, css-custom-properties, spacing-scale, type-scale, color-mix, reduced-motion, tabular-nums]

# Dependency graph
requires:
  - phase: 04-position-design
    plan: 01
    provides: "Source Sans 3 variable font whose weight axis makes the two-weight token set sufficient"
  - phase: 03-foundations-code-health
    provides: "--vp-c-brand-1 single-source token and assertBrandInSync() guard preserved through the :root edits"
provides:
  - "--space-1..8 (4/8/16/24/32/48/64/80px), --font-size-micro..display (1.200 minor third), --font-weight-regular/semibold, --line-height-body/heading, --radius-card, --color-negative/--color-positive declared once in :root"
  - "Brand translucencies (--vp-c-brand-soft, ::selection, custom-block tip) computed via color-mix(in srgb, var(--vp-c-brand-1) N%, transparent) — three .dark twins deleted as redundant"
  - "@media (prefers-reduced-motion: reduce) universal override block (DES-09 CSS half)"
  - "font-variant-numeric: tabular-nums on .hero-metric__value and .vp-doc table"
affects: [04-03, 04-04, 04-05, 04-06, 04-07, 04-08, 04-09, 04-10]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Token-only points of use in custom.css: sizes/weights/line-heights/spacing/card-radius all consumed via var()"
    - "Semantic colours declared in :root only — deliberate exception to the :root+.dark convention (a warning red needs no dark shift the way brand does)"

key-files:
  created: []
  modified:
    - docs/.vitepress/theme/custom.css

key-decisions:
  - "--color-negative/--color-positive get NO .dark entry (UI-SPEC Pitfall 6): fixed semantic hues; adding .dark twins would imply they re-theme when they must not"
  - "Three .dark declarations DELETED rather than added (brand-soft, ::selection, custom-block tip): their light-mode source now derives from --vp-c-brand-1 via color-mix, which already re-themes in dark mode"
  - ".VPHero .text (substance line) sized --font-size-h3, .VPHero .tagline (credential line) --font-size-lead — the one interpretation call Task 2 allowed; substance sits one step above credential, both far below the display-size name"
  - "grep 'important' count is 42 not 37: 37 preserved qualifiers + 4 new in the reduce block + 1 occurrence of the word inside a comment — no qualifier was dropped"
  - "font-weight: 200 900 at custom.css:10 is the @font-face variable-font weight-range descriptor from 04-01, not a point-of-use literal — the single acceptance-grep survivor"

patterns-established:
  - "Reduced-motion is a third, separate media block (universal * override with !important), never merged into the two no-preference gates"
  - "tabular-nums applied only to DOM surfaces (metric tiles, HTML tables); ECharts canvases excluded — canvas text ignores font-variant-numeric"

requirements-completed: [DES-03, DES-06 (foundation), DES-07 (stylesheet half), DES-09 (CSS half), DES-11 (stylesheet half)]

coverage:
  - id: T1
    description: "Token vocabulary declared once; brand RGB literals folded into color-mix"
    requirement: "DES-03, DES-07"
    verification:
      - kind: automated
        ref: "grep gates: 8 spacing + 8 type + 2 weight + 1 radius + 2 semantic tokens present; '0, 113, 227|41, 151, 255' count 0; color-mix(brand) count 3; npm run docs:build exit 0 (assertBrandInSync passes)"
        status: pass
    human_judgment: false
  - id: T2
    description: "Every point-of-use literal migrated onto tokens; 37 !important qualifiers preserved"
    requirement: "DES-03, DES-06"
    verification:
      - kind: automated
        ref: "size/weight/line-height/spacing literal grep -> 1 hit = @font-face descriptor only; committed-version important count 37 preserved"
        status: pass
    human_judgment: false
  - id: T3
    description: "reduce block + tabular-nums added; no styling regression"
    requirement: "DES-09, DES-11"
    verification:
      - kind: automated
        ref: "reduce count 1, no-preference count 2, reduce-block important count 4, tabular-nums count 1, npm run docs:build exit 0"
        status: pass
      - kind: human
        ref: "Browser sweep (reduced-motion emulation, heading hierarchy, feature icons, frosted nav) deferred to the Phase-5 Chrome walkthrough before deploy"
        status: deferred
    human_judgment: true
---

# 04-02: Design-token foundation in custom.css

Declared the full token vocabulary (spacing, type scale on 1.200 minor third, two weights, two
line-heights, card radius, two semantic colours) once in `:root`, migrated every point-of-use
literal in `custom.css` onto `var()` consumption, folded the four raw brand RGB literals into
`color-mix(in srgb, var(--vp-c-brand-1) …)` deleting their three `.dark` twins, added the universal
`prefers-reduced-motion: reduce` override block, and applied `tabular-nums` to metric tiles and
doc tables. Build passes; `assertBrandInSync()` unaffected.
