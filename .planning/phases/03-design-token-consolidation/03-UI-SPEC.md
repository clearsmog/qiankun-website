# Phase 3: Design Token Consolidation — UI Design Contract

**Authored:** 2026-07-26
**Status:** Approved
**Mode:** Orchestrator-authored. The full ui-researcher/ui-checker pipeline was not run — this phase's
entire visual contract is *negative* (nothing may change), so there is no design space to research.
Phase 4 owns the actual design work and will carry a full UI-SPEC.

## The Contract

**This phase is visually neutral. The rendered site must look identical before and after.**

Every change here is an indirection change — where a value is *defined* and what *triggers* a
re-theme — not a change to any value or any rendered result. A visible difference of any kind is a
defect, not an improvement, even if the new appearance is arguably nicer. Improvements belong to
Phase 4, where they can be made deliberately and as a set.

## Design System

Unchanged. No new tokens, no new components, no registry (this stack has none — hand-written Vue SFCs
plus VitePress's default theme).

| Axis | Change |
|------|--------|
| Spacing scale | none |
| Typography | none — Phase 4 owns the type scale (DES-03) |
| Colour values | none — `--vp-c-brand-1` keeps `#0071e3` light / `#2997ff` dark |
| Component inventory | none |
| Copy | none |

The only colour-adjacent change is *where* `#0071e3` is written down (a new `tokens.js` for the
Node-side PWA manifest value), not what it is.

## UI Considerations

Resolved for the three surfaces this phase can affect. **9 applicable — 3 covered, 3 backstop,
3 dismissed, 0 unresolved.**

### E1 — The twelve chart components (theme reactivity)

| Category | Status | Resolution / Reason |
|----------|--------|---------------------|
| populated | ✅ covered | Every chart renders identically to its pre-change output in both light and dark mode. Same `themeTokens()` values, same series colours, same axis colours. |
| state-transition (light→dark) | 🛡 backstop | **The load-bearing risk of this phase.** `isDark` flipping is not guaranteed to be the same tick as the DOM class flip and the CSS-variable recomputation that `themeTokens()` reads via `getComputedStyle`. A chart that re-reads too early re-themes with *stale* colours — and this fails silently: the build passes, the page loads, and the bug is only visible to someone watching a chart during a toggle. **Verify by toggling dark mode with charts on screen and confirming every chart's colours actually change**, not merely that the page did. |
| duplicate-render | 🛡 backstop | Success criterion 4 requires no duplicate re-renders and no console warnings from the removed observer logic. Verify by watching the browser console *during* a toggle, not after load. |
| error | ⊘ dismissed | No data source; chart data is authored in the markdown pages. |

### E2 — PWA manifest / browser chrome

| Category | Status | Resolution / Reason |
|----------|--------|---------------------|
| populated | ✅ covered | `theme_color` resolves to `#0071e3` after the `tokens.js` indirection — byte-identical to the current hard-coded value. Assert on built manifest output, not on source. |
| state-transition | ⊘ dismissed | The manifest colour is static; it has no state axis. |
| empty | ⊘ dismissed | A missing import would fail the build loudly, not render empty. |

### E3 — Sitewide rendered output

| Category | Status | Resolution / Reason |
|----------|--------|---------------------|
| populated | ✅ covered | Built CSS still resolves `--vp-c-brand-1` to `#0071e3` at `:root` and `#2997ff` under `.dark`. |
| regression | 🛡 backstop | Whole-site visual neutrality. Strongest available repo-side evidence is a build-output diff across the change; anything beyond that needs eyes on the running site. `/projects/cisco-equity-valuation` and `/projects/global-equity-portfolio` are the highest-value pages to check — both carry several charts. |

## Out of Scope

Explicitly NOT this phase, to prevent collision with Phase 4:
- The `NotFound.vue` `#667eea → #764ba2 → #ec4899` gradient (old "Universe of Code" aesthetic)
- Any typography, font-loading, or type-scale work
- Any palette change, including the ten-colour chart palette in `echarts-setup.js`
- Hero copy, taglines, positioning
