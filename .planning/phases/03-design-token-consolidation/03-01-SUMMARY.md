---
phase: 03-design-token-consolidation
plan: 01
subsystem: ui
tags: [vitepress, vue3, vite, echarts, theme-tokens, reactivity]

# Dependency graph
requires:
  - phase: 01-technical-foundations
    provides: "VitePress 2.0.0-alpha.18 pin, config.js Google Analytics head tags (untouched, verified intact)"
provides:
  - "docs/.vitepress/theme/tokens.js — Node-side brand colour constant, single named export `brand`"
  - "config.js PWA manifest theme_color sourced from tokens.js instead of a hard-coded literal"
  - "Proven MutationObserver -> watch(isDark, ..., { flush: 'post' }) conversion recipe (Shape A), browser-verified on EBar.vue"
affects: [03-02-design-token-consolidation, 03-03-design-token-consolidation, 04-restyle-typography]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Node-side-only token module (tokens.js) cross-referenced with browser-side CSS canonical source via reciprocal comments, rather than a single shared source (CSS cannot export to Node)"
    - "Theme-reactivity trigger: watch(useData().isDark, cb, { flush: 'post' }) replaces MutationObserver on document.documentElement — flush:'post' is mandatory, not optional, per RESEARCH.md's Vue scheduler proof"

key-files:
  created:
    - docs/.vitepress/theme/tokens.js
  modified:
    - docs/.vitepress/config.js
    - docs/.vitepress/theme/custom.css
    - docs/.vitepress/theme/components/viz/EBar.vue

key-decisions:
  - "tokens.js exports exactly one named constant, brand — no default export, no dark-mode export (dark value has zero JS consumers, per CONTEXT.md)"
  - "requirements-completed left empty for DES-05/DES-08 in this SUMMARY: both requirements are declared in all three plans (03-01/03-02/03-03) frontmatter because the phase splits one requirement's proof across a tracer (03-01), a scale-out (03-02), and a final neutrality re-assertion (03-03). Marking either complete here would be false — 11 of 12 MutationObservers remain, and echarts-setup.js's two remaining #0071e3 literals are still unresolved. Completion will be recorded at whichever plan closes out the last open truth."

patterns-established:
  - "Pattern: tick-nudge Shape-A conversion (delete tick's MutationObserver+onMounted+onBeforeUnmount trio, add const { isDark } = useData() and watch(isDark, () => tick.value++, { flush: 'post' })) — applies verbatim to the remaining 9 Shape-A components in 03-02 (EDonut, ELine, ECombo, EForest, EFootball, EGroupBar, EHeatmap, EHistogram, EScorePath)"

requirements-completed: []  # See key-decisions above — DES-05/DES-08 partially satisfied, not closed by this plan alone

coverage:
  - id: D1
    description: "tokens.js created as the sole Node-side brand-colour source; config.js's PWA manifest theme_color now imports it instead of hard-coding #0071e3"
    requirement: "DES-05"
    verification:
      - kind: unit
        ref: "grep -c '0071e3' docs/.vitepress/config.js == 0; node -e assert manifest.webmanifest theme_color === '#0071e3'"
        status: pass
    human_judgment: false
  - id: D2
    description: "EBar.vue's MutationObserver replaced with watch(isDark, () => tick.value++, { flush: 'post' }); browser-verified to re-theme on the same toggle with no stale-colour frame, matching the unconverted EDonut control"
    requirement: "DES-08"
    verification:
      - kind: unit
        ref: "grep -c MutationObserver EBar.vue == 0; grep -c \"flush: 'post'\" EBar.vue == 1"
        status: pass
      - kind: automated_ui
        ref: "Claude-in-Chrome getImageData pixel-fingerprint of EBar canvases 0/3 vs EDonut canvases 1/2 on /projects/global-equity-portfolio, both toggle directions, npm run docs:dev"
        status: pass
    human_judgment: false

# Metrics
duration: 20min
completed: 2026-07-26
status: complete
---

# Phase 3 Plan 1: End-to-end token indirection plus one converted observer Summary

**Created `tokens.js` as the single Node-side brand-colour source feeding the PWA manifest, and proved the `MutationObserver` → `watch(isDark, ..., { flush: 'post' })` conversion recipe correct in a real browser on `EBar.vue`, clearing plan 03-02 to scale it to the remaining eleven chart components.**

## Performance

- **Duration:** ~20 min (code + build ~15 min; browser verification handoff to orchestrator ~5 min)
- **Started:** 2026-07-26T19:00:00Z (approx.)
- **Completed:** 2026-07-26T19:12:44Z
- **Tasks:** 2 (Task 1 code+build, Task 2 browser verification via orchestrator handoff)
- **Files modified:** 4 (1 created, 3 modified)

## Accomplishments
- `docs/.vitepress/theme/tokens.js` created: dependency-free ES module, single named export `brand`, no DOM reference, consumed by Vite's Node-side config loader
- `config.js` PWA manifest `theme_color` now sourced from `tokens.js` — `grep -c '0071e3' config.js` returns `0`
- `custom.css`'s `:root` brand declaration carries a reciprocal one-line comment naming `tokens.js` as the Node-side copy to keep in sync — value itself unchanged (`#0071e3` light / `#2997ff` dark untouched)
- `EBar.vue` converted from `MutationObserver` to `watch(isDark, () => tick.value++, { flush: 'post' })`; `onMounted`/`onBeforeUnmount` removed (the observer was their only consumer)
- Recipe browser-verified via Claude-in-Chrome pixel fingerprinting against a built-in control (the still-unconverted `EDonut` on the same page) — see Browser Verification below
- Build-output neutrality proven by diff against a captured pre-change baseline: `npm run docs:build` exit 0, manifest and stylesheet brand values byte-identical before/after
- Phase 1's parked deploy work confirmed intact: `G-4PF046MSJJ` count 2 in `config.js`, `amplify.yml`/`deploy.sh` present, `package.json` `deploy`/`deploy:quick` scripts present

## Browser Verification (Task 2 — performed by orchestrator via Claude in Chrome)

Method: pixel-fingerprinted each chart canvas's `getImageData` stride-sampled colours, before and after each toggle, rather than eyeballing screenshots. The verification page (`/projects/global-equity-portfolio`, served via `npm run docs:dev`) carries 2 `EBar` (converted, canvases 0/3) and 2 `EDonut` (still on `MutationObserver`, canvases 1/2) as a built-in control group.

- **Baseline (light):** `--vp-c-brand-1: #0071e3`, `--vp-c-text-1: #1d1d1f`. EBar canvas 0 top colours `232,232,237(11353)`, `110,110,115(127)`; canvas 3 `232,232,237(4765)`, `110,110,115(92)`.
- **After light→dark** (real `.VPSwitchAppearance` click, not a synthetic class flip): `--vp-c-brand-1: #2997ff`, `--vp-c-text-1: #f5f5f7`. Both EBars re-themed on the **same** toggle — `232,232,237` (light divider/bg) gone, axis/text moved `110,110,115` (#6e6e73, light text-2) → `161,161,166` (#a1a1a6, dark text-2). No stale-colour frame; no second toggle needed. Timing and resulting colours indistinguishable from the two unconverted `EDonut` controls.
- **After dark→light:** EBar canvas 0 returned to `232,232,237(11353)`, `110,110,115(127)`; canvas 3 to `232,232,237(4765)`, `110,110,115(92)` — byte-identical to baseline, count for count. Perfect round-trip.
- **Console:** zero messages captured during either toggle direction (cleared immediately before the first toggle).
- **Note for the record:** `0,113,227` (`#0071e3`) persists in the `EDonut` canvases in dark mode. This is **not** a stale brand read — it is `palette[0]` from `echarts-setup.js`, the fixed ten-colour series palette, which is theme-independent by design and explicitly out of scope for this phase per `03-CONTEXT.md`. Recorded here so a later reader doesn't mistake it for a defect.
- **Source confirmation:** `EBar.vue` has `import { useData } from 'vitepress'`, `const { isDark } = useData()`, and `watch(isDark, () => {...}, { flush: 'post' })`, with zero `MutationObserver`.

**Conclusion: the recipe — `useData().isDark` + `watch(..., { flush: 'post' })` — is verified correct and safe to scale to the remaining eleven components in plan 03-02.**

## Task Commits

Each task was committed atomically:

1. **Task 1: End-to-end token indirection plus one converted observer** - `a769f1c` (feat)
2. **Task 2: Browser-prove the tracer path** - no source changes (verification-only task; evidence recorded above, performed by orchestrator via Claude in Chrome)

**Plan metadata:** (recorded below, this commit)

## Files Created/Modified
- `docs/.vitepress/theme/tokens.js` - NEW; exports `brand`, the Node-side-only PWA manifest colour
- `docs/.vitepress/config.js` - imports `brand` from `tokens.js`; `theme_color` now references it instead of a literal
- `docs/.vitepress/theme/custom.css` - added a reciprocal sync comment above `:root`'s `--vp-c-brand-1`; no value changed
- `docs/.vitepress/theme/components/viz/EBar.vue` - `MutationObserver` → `watch(isDark, ..., { flush: 'post' })`; `onMounted`/`onBeforeUnmount` removed

## Decisions Made
- `tokens.js` exports one named constant, `brand`, only — no default export, no dark-mode export, matching CONTEXT.md's discretion clause and RESEARCH.md's finding that the dark value has zero JavaScript consumers.
- Left `requirements-completed` empty rather than marking DES-05/DES-08 complete: both requirements are declared across all three plans in this phase (03-01/03-02/03-03), and this plan only closes the PWA-manifest slice of DES-05 and 1-of-12 of DES-08. Marking them complete now would misrepresent phase state in REQUIREMENTS.md's traceability table.

## Deviations from Plan

None - plan executed exactly as written. The mandatory `{ flush: 'post' }` option was applied as specified; no bare `watch(isDark, cb)` was introduced at any point.

## Issues Encountered
None. Baseline build (captured before any edit) matched the plan's stated pre-change expected values exactly, confirming a clean working tree before execution began.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Plan 03-02 is cleared to apply the proven Shape-A recipe verbatim to the remaining 9 tick-nudge components (`EDonut`, `ELine`, `ECombo`, `EForest`, `EFootball`, `EGroupBar`, `EHeatmap`, `EHistogram`, `EScorePath`), plus the `resize()` shape (`VizEChart`) and the `build()` shape (`ProjectChart`).
- Plan 03-02 also owns the remaining `#0071e3` literals in `echarts-setup.js` (the `cssVar()` fallback arg and `palette[0]`) — Claude's discretion per CONTEXT.md whether they import `tokens.js` or stay literal with justification.
- DES-05 and DES-08 remain open in REQUIREMENTS.md until 03-02 (and possibly 03-03's neutrality re-assertion) close the remaining scope.
- No blockers identified for 03-02.

---
*Phase: 03-design-token-consolidation*
*Completed: 2026-07-26*

## Self-Check: PASSED

All created/modified files confirmed present on disk (`tokens.js`, `config.js`, `custom.css`,
`EBar.vue`, this SUMMARY). Task 1 commit `a769f1c` confirmed present in `git log --oneline --all`.
