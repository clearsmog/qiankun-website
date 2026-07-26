---
phase: 03-design-token-consolidation
fixed_at: 2026-07-26T21:06:32Z
review_path: .planning/phases/03-design-token-consolidation/03-REVIEW.md
iteration: 2
findings_in_scope: 3
fixed: 3
skipped: 0
status: all_fixed
---

# Phase 3: Code Review Fix Report

**Fixed at:** 2026-07-26T21:06:32Z
**Source review:** .planning/phases/03-design-token-consolidation/03-REVIEW.md
**Iteration:** 2

**Summary:**
- Findings in scope: 3 (WR-01, WR-02, WR-03 — Info findings IN-01/IN-02 out of scope for `critical_warning`)
- Fixed: 3
- Skipped: 0

## Fixed Issues (iteration 2)

### WR-01: `assertBrandInSync()` regex can be bypassed by a decoy comment

**Files modified:** `docs/.vitepress/config.js`
**Commit:** `4799167`
**Applied fix:** Strip CSS comments (`/\*[\s\S]*?\*\//g`) from the `custom.css` source before extracting the `:root` block and matching `--vp-c-brand-1`, so a decoy comment mentioning an old/correct hex ahead of the real (drifted) declaration can no longer be matched instead of the live value. Verified against both the exploit from the review (a `/* --vp-c-brand-1: #0071e3 */` decoy comment immediately followed by a desynced `--vp-c-brand-1: #ff0000;` declaration) and a plain desync with no decoy — both now correctly throw `Brand colour out of sync: ...` and fail the build; a control run with the file unmodified builds clean. `custom.css` was restored to its original content after each adversarial test (confirmed via `git diff` showing no changes).

### WR-02: `EHistogram.vue`'s default bar/band colour is a static, non-reactive brand hex

**Files modified:** `docs/.vitepress/theme/components/viz/EHistogram.vue`
**Commit:** `31825e4`
**Applied fix:** Dropped the `color` prop's static `brand`-import default (`default: undefined`) and removed the now-unused `import { brand } from '../../tokens.js'`. Added `const barColor = props.color || t.brand` inside the `option` computed (after `const t = themeTokens()`, which re-runs on every `tick.value` bump from the `isDark` watcher), and replaced both `props.color` usages — the bar-fill gradient stops (was line 96) and the P5–P95 `markArea` fill (was line 108) — with `barColor`. An explicitly-passed `color` prop still wins (`props.color ||`); only the *default* is now theme-reactive. This matches the pattern already used for `markLineData` (`m.color || t.brand`) elsewhere in the same file. Fixes the live regression on `docs/projects/cisco-equity-valuation.md` (Exhibit 7, Monte Carlo histogram) where bars/band stayed pinned to light-mode blue in dark mode.

### WR-03: `ProjectChart.vue`'s default series palette uses a static brand hex; reactive `brand()` helper never called

**Files modified:** `docs/.vitepress/theme/components/ProjectChart.vue`
**Commit:** `2be9d93`
**Applied fix:** Replaced the module-scope `palette` constant (whose first entry was the static `brandToken` import) with a `paletteFor()` function that calls the existing reactive `brand()` helper (`getComputedStyle(...).getPropertyValue('--vp-c-brand-1')`) for its first entry. `paintDatasets()` — which is invoked fresh inside `build()` on every call, including the `isDark` watcher's rebuild — now computes `const palette = paletteFor()` at the top of the function instead of closing over a module-scope constant, so the default series colour is re-resolved on every theme toggle. The `brandToken` import is retained, as `brand()` still uses it as its non-browser fallback.

**Build verification:** `npm run docs:build` was run against the fully patched worktree (all three commits applied) and completed successfully (`build complete in 36.66s`).

**Negative test (WR-01, required gate):** Deliberately desynced `tokens.js` from `custom.css` two ways — (1) a plain hex mismatch, (2) the decoy-comment bypass the review demonstrated — and confirmed `assertBrandInSync()` threw in both cases (`Brand colour out of sync: theme/tokens.js exports brand="#0071e3" but theme/custom.css :root --vp-c-brand-1 is "#ff0000"`). Restored `custom.css` to its original content after each test; `git diff` confirmed no residual changes before committing.

## Skipped Issues (iteration 2)

None — all in-scope findings were fixed.

---

## Iteration 1 record (preserved)

**Fixed at:** 2026-07-26T21:15:00Z
**Findings in scope:** 3 (WR-01, WR-02, WR-03 from iteration-1 REVIEW.md — Info findings IN-01/IN-02/IN-03 out of scope)
**Fixed:** 3 | **Skipped:** 0 | **Status:** all_fixed

### WR-01 (iter 1): Hardcoded brand-blue rgba literal bypasses the token/theme system (EScorePath)

**Files modified:** `docs/.vitepress/theme/components/viz/EScorePath.vue`, `docs/.vitepress/theme/components/viz/echarts-setup.js`
**Commit:** `21b87c9`
**Applied fix:** Added a shared `hexToRgba(hex, alpha)` helper to `echarts-setup.js`. `EScorePath.vue`'s `areaStyle.color` gradient stops now call `hexToRgba(t.brand, 0.28)` / `hexToRgba(t.brand, 0.02)` instead of the hardcoded `rgba(0,113,227,...)` literals.

### WR-02 (iter 1): Hardcoded brand-blue rgba literal in emphasis shadow (EBar)

**Files modified:** `docs/.vitepress/theme/components/viz/EBar.vue`
**Commit:** `3b2c44f`
**Applied fix:** Imported the `hexToRgba` helper and replaced `emphasis.itemStyle.shadowColor: 'rgba(0,113,227,0.35)'` with `hexToRgba(t.brand, 0.35)`.

### WR-03 (iter 1): Brand colour still has two manually-synced sources of truth

**Files modified:** `docs/.vitepress/config.js`
**Commit:** `5f241b1`
**Applied fix:** Added `assertBrandInSync()` to `config.js`, running at module load, reading `theme/custom.css`, extracting `--vp-c-brand-1` from the `:root { ... }` block via regex, and throwing if it doesn't match `tokens.js`'s exported `brand` constant. (This regex is the one hardened further in iteration 2 above, per WR-01 iteration 2.)

**Iteration 1 build verification:** `npm run docs:build` completed successfully (`build complete in 64.47s`).

---

_Fixed: 2026-07-26T21:06:32Z_
_Fixer: Claude (gsd-code-fixer)_
_Iteration: 2_
