---
phase: 04-position-design
plan: 01
subsystem: ui
tags: [vitepress, fonts, self-hosted, woff2, css-custom-properties, source-sans-3]

# Dependency graph
requires:
  - phase: 03-foundations-code-health
    provides: "--vp-c-brand-1 token pattern and assertBrandInSync() build-time guard this plan's :root edit had to preserve"
provides:
  - "Self-hosted Source Sans 3 variable WOFF2 at /fonts/source-sans-3-variable.woff2, declared via @font-face + font-display:swap + head preload"
  - "--vp-font-family-base as the single site-wide typeface declaration"
  - "vitepress/theme-without-fonts entry point, removing VitePress's own bundled Inter font family from the build"
affects: [04-02, 04-03, 04-04, 04-05, 04-06, 04-07, 04-08, 04-09, 04-10]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Font sourced by npm pack + tarball extraction, never installed as a dependency (extract-and-discard pattern for SUS-flagged packages)"
    - "VitePress theme-without-fonts entry point required whenever --vp-font-family-base overrides the default Inter typeface"

key-files:
  created:
    - docs/public/fonts/source-sans-3-variable.woff2
  modified:
    - docs/.vitepress/theme/custom.css
    - docs/.vitepress/theme/index.js
    - docs/.vitepress/config.js

key-decisions:
  - "Sourced the WOFF2 from @fontsource-variable/source-sans-3's published npm tarball via npm pack + extraction, never installed as a dependency — confirmed package.json/package-lock.json unchanged"
  - "Switched theme/index.js to vitepress/theme-without-fonts (not named in CONTEXT.md or UI-SPEC) — without it VitePress keeps bundling and precaching 14 unused Inter WOFF2 files regardless of --vp-font-family-base"

patterns-established:
  - "Font-loading swap landed as one atomic commit (asset + @font-face + preload + --vp-font-family-base + theme-entry-point swap) per the plan's tracer objective — no intermediate undeclared-font state existed at any commit boundary"

requirements-completed: [DES-01, DES-02, DES-04]

coverage:
  - id: D1
    description: "Source Sans 3 variable WOFF2 self-hosted at docs/public/fonts/, declared via @font-face with font-weight 200 900, font-display swap, and a byte-identical head preload"
    requirement: "DES-01"
    verification:
      - kind: automated_ui
        ref: "npm run docs:build && grep checks for source-sans-3-variable.woff2 count, font-display:swap count, --vp-font-family-base count — all returned 1 as required"
        status: pass
      - kind: e2e
        ref: "playwright:check-dup-prod.mjs against docs:preview (production build) — single 200 request to /fonts/source-sans-3-variable.woff2, zero requests to googleapis/gstatic"
        status: pass
    human_judgment: false
  - id: D2
    description: "VitePress's own bundled Inter (14 WOFF2 files, ~670KB) no longer emitted into the build; theme-without-fonts entry point in place"
    requirement: "DES-01"
    verification:
      - kind: automated_ui
        ref: "ls docs/.vitepress/dist/assets/ | grep -ci inter -> 0; ls docs/.vitepress/dist/assets/*.woff2 -> 0 files; ls docs/.vitepress/dist/fonts/*.woff2 -> 1 file"
        status: pass
    human_judgment: false
  - id: D3
    description: "Font swap produces zero layout shift — fallback stack is metric-compatible with Source Sans 3"
    requirement: "DES-02"
    verification:
      - kind: e2e
        ref: "playwright:check-reflow.mjs — .VPHero .name bounding box identical (253.4375 x 75.59375) with font blocked (fallback stack) vs font loaded (Source Sans 3)"
        status: pass
      - kind: automated_ui
        ref: "playwright:verify-font.mjs — body font resolves to \"Source Sans 3\", ... on / and /projects/cisco-equity-valuation, at desktop and 375px, light and dark, zero console errors"
        status: pass
    human_judgment: false
  - id: D4
    description: "package.json and package-lock.json unchanged by font sourcing"
    requirement: "DES-01"
    verification:
      - kind: unit
        ref: "git diff --stat package.json package-lock.json (before final commit) — empty output"
        status: pass
    human_judgment: false

# Metrics
duration: 25min
completed: 2026-07-27
status: complete
---

# Phase 4 Plan 1: Font-Loading Swap Summary

**Self-hosted Source Sans 3 variable WOFF2 (28,740 bytes) replaces Google-Fonts-hosted Inter, with VitePress's own bundled Inter family (~670KB, 14 files) removed via the `vitepress/theme-without-fonts` entry point.**

## Performance

- **Duration:** ~25 min
- **Started:** 2026-07-27T14:10:00Z (approx)
- **Completed:** 2026-07-27T14:36:00Z
- **Tasks:** 2 (1 tracer + build/edit, 1 verification)
- **Files modified:** 4 (1 new asset, 3 edited)

## Accomplishments
- Extracted the Latin-subsetted, variable-format Source Sans 3 WOFF2 (28,740 bytes, `wght` axis 200–900) from `@fontsource-variable/source-sans-3`'s published npm tarball via `npm pack`, without installing it as a dependency
- Authored `@font-face` in `custom.css` with `font-display: swap`, replacing the render-blocking Google Fonts `@import`; set `--vp-font-family-base` as the single typeface declaration and deleted the bare `html { font-family }` rule (keeping its font-smoothing declarations)
- Added a `<link rel="preload">` in `config.js`'s `head` array, `href` byte-identical to the `@font-face` `src`
- Switched `theme/index.js`'s `DefaultTheme` import to `vitepress/theme-without-fonts`, which stops VitePress from bundling and precaching its own 14 Inter WOFF2 files
- Verified via a production build (`docs:build`) and a production preview server (`docs:preview`) that: exactly one font file is emitted (`docs/.vitepress/dist/fonts/source-sans-3-variable.woff2`), zero Inter files remain, zero `googleapis`/`gstatic` references survive anywhere in `dist/`, and the browser issues exactly one same-origin font request
- Confirmed zero layout shift: the hero name's bounding box is pixel-identical whether the font is blocked (rendering in the fallback stack) or loaded (rendering in Source Sans 3)

## Task Commits

Each task was committed atomically:

1. **Task 1: Self-hosted Source Sans 3 wired end-to-end** - `3bffb1f` (feat) — asset, `@font-face`, preload, `--vp-font-family-base`, `theme-without-fonts` swap, all in one commit
2. **Task 2: Confirm the swap is visually clean and the page-weight payoff is real** — no code changes; pure verification task, no commit (see Verification below)

**Plan metadata:** commit pending (this SUMMARY + STATE.md update)

## Files Created/Modified
- `docs/public/fonts/source-sans-3-variable.woff2` - new self-hosted variable WOFF2 asset (28,740 bytes)
- `docs/.vitepress/theme/custom.css` - `@font-face` block, `--vp-font-family-base` token, deleted Google Fonts `@import` and bare `html { font-family }` rule
- `docs/.vitepress/theme/index.js` - `DefaultTheme` import switched to `vitepress/theme-without-fonts`
- `docs/.vitepress/config.js` - added `<link rel="preload">` tuple to `head` array

## Decisions Made
- Extract-and-discard sourcing for `@fontsource-variable/source-sans-3` (flagged SUS by `gsd-tools query package-legitimacy check` for being "too-new"): the tarball is fetched with `npm pack`, one file is copied out, and the tarball/extraction directory are discarded — the package never enters `package.json` or the lockfile, matching the threat model's disposition (T-04-SC) and avoiding the checkpoint that would be required if it were installed as a real devDependency.
- Adopted `vitepress/theme-without-fonts` — a finding from 04-RESEARCH.md not named in CONTEXT.md or UI-SPEC. Without it, `--vp-font-family-base` correctly changes *rendering* but VitePress's default theme still bundles and Workbox-precaches its own 14 Inter WOFF2 files (~670KB) regardless. Future readers should not remove this import thinking it's redundant with the CSS token — the two serve different purposes (rendering vs. bundling).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Restarted a stale dev server to complete Task 2's visual verification**
- **Found during:** Task 2 (visual/network verification)
- **Issue:** A `vitepress dev` process was already running on port 5173 from a prior session (started the previous evening, before this plan's edits). Vite's dependency-optimizer cache was stale relative to the current source, and the page failed to render — `document.body`'s computed font resolved to `Times` (a broken/unstyled page) with two `504 Outdated Optimize Dep` console errors per page load, making genuine verification impossible.
- **Fix:** Killed the stale process, cleared `docs/.vitepress/cache/`, and started a fresh `docs:dev` process in the background on the same port. Left it running afterward (future Phase 4 plans will likely reuse it).
- **Verification:** Fresh server rendered `body` font as `"Source Sans 3", -apple-system, "system-ui", "Segoe UI", Roboto, sans-serif` on every checked page/viewport/theme combination, with zero console errors.
- **Committed in:** n/a (no source change — infrastructure-only fix, dev server process is not a repo artifact)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** No scope creep; the fix was purely operational (restarting a stale local dev server) and required no source-code change.

## Issues Encountered
- **Dev-mode double font fetch (not a defect, documented for future readers):** Playwright's network trace against the `vitepress dev` server (port 5173) showed the font file fetched twice (two `200` responses, both full 28,740-byte downloads) despite the preload `href` matching the `@font-face` `src` byte-for-byte. Investigation against the **production build** (`npm run docs:preview`, port 4173 — what Cloudflare Pages actually serves) showed exactly **one** font request. The dev-mode double-fetch is attributable to Vite's dev server sending `cache-control: no-cache` on static assets, which defeats the preload-reuse optimization that works correctly once real cache headers are present in production. No fix was needed or applied; this is a dev-server-only artifact, not a production regression, and is recorded here so a future reader investigating a "font fetched twice" report in dev mode doesn't mistake it for the DES-02 double-fetch failure mode the plan explicitly warns about.

## Font Payload Measurement (Task 2 acceptance criterion)

- **Pre-swap baseline:** ~670KB across 14 default-theme Inter WOFF2 files (per 04-RESEARCH.md, confirmed present in this repo's prior build output)
- **Post-swap:** 28,740 bytes (28.07KB) — one file, `du -ch docs/.vitepress/dist/fonts/*.woff2` reports `32K` (block-size rounding of the 28,740-byte file)
- **Result:** well under the 40KB acceptance threshold; a ~96% reduction in font payload

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- The typeface is settled site-wide: every one of the nine downstream Phase 4 plans (04-02 through 04-10) can rely on `--vp-font-family-base` resolving to Source Sans 3 with zero third-party font requests.
- The type-scale/spacing/weight token work in subsequent plans builds directly on top of this plan's `:root` edit — no further font-loading changes are anticipated in this phase.
- No blockers.

## Self-Check: PASSED

- FOUND: docs/public/fonts/source-sans-3-variable.woff2
- FOUND: commit 3bffb1f
- FOUND: --vp-font-family-base in docs/.vitepress/theme/custom.css
- FOUND: vitepress/theme-without-fonts in docs/.vitepress/theme/index.js

---
*Phase: 04-position-design*
*Completed: 2026-07-27*
