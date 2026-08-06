---
phase: 04-position-design
plan: 03
subsystem: ui
tags: [vitepress, copywriting, positioning, og-image, seo, metadata, playwright]

# Dependency graph
requires:
  - phase: 04-position-design
    provides: "04-01's self-hosted Source Sans 3 WOFF2 (the OG image renders in the site's real typeface via a file:// @font-face reference)"
provides:
  - "Homepage hero with the locked positioning copy: full name, discipline statement, Edinburgh MSc + FRM credential line, single 'Selected work' action into /projects/"
  - "Single-colour brand-stroked feature icons (purple-pink gradient deleted)"
  - "Fact-only About page linking all five case studies; Contact page with a live mailto link"
  - "Site metadata (description, keywords, RSS description, PWA manifest, footer) describing a quantitative finance portfolio"
  - "docs/public/og-image.png — 1200x630 raster social-share image referenced from og:image, twitter:image, and PWA includeAssets"
affects: [04-05, 04-10]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "OG image regeneration: author a 1200x630 HTML file (white bg, Source Sans 3 via absolute file:// @font-face, name at 84px/600 #1d1d1f, positioning line at 38px/400 #6e6e73, 96px side padding), render with `npx playwright screenshot --viewport-size=1200,630 <file-url> docs/public/og-image.png`"

key-files:
  created:
    - docs/public/og-image.png
  modified:
    - docs/index.md
    - docs/about.md
    - docs/contact.md
    - docs/.vitepress/config.js
    - docs/.vitepress/theme/JsonLd.vue
  deleted:
    - docs/public/og-image.svg

key-decisions:
  - "The plan's `grep -ci 'ENN'` disclosure gate matches 'K**enn**y' in the mandated hero name — replaced with a word-boundary check (`grep -icw 'ENN'` = 0) plus the energy/commodities/trading grep (= 0); the gate's intent (no employer disclosure) is satisfied, the literal gate cannot be with the locked copy"
  - "Only POS-01, POS-03, POS-04, POS-06 marked complete in REQUIREMENTS.md — POS-02's comprehension proxy runs in 04-10 and DES-12's remaining halves (VizPanel hairline, project-card styling) land in 04-04/04-05"

patterns-established:
  - "Positioning copy is UI-SPEC-verbatim, never paraphrased — the Copywriting Contract is the single source for hero/About/Contact/metadata strings"

requirements-completed: [POS-01, POS-03, POS-04, POS-06]

coverage:
  - id: D1
    description: "Hero states name, quantitative-finance discipline (portfolio construction, systematic alpha research, equity valuation) and credentials (Edinburgh MSc, FRM); exactly one action into /projects/"
    requirement: "POS-01, POS-02 (structural precondition), POS-03"
    verification:
      - kind: automated_ui
        ref: "grep gates on docs/index.md — name count 1, all three discipline phrases present, Edinburgh + FRM present, exactly one `- theme:` under actions, `theme: alt` count 0, action links /projects/"
        status: pass
    human_judgment: false
  - id: D2
    description: "No purple-pink gradient survives on the homepage; three icons stroked var(--vp-c-brand-1)"
    requirement: "DES-12 (homepage half)"
    verification:
      - kind: automated_ui
        ref: "grep -ci 'defs|lineargradient|667eea|ec4899|url(#' docs/index.md -> 0; stroke=\"var(--vp-c-brand-1)\" count -> 3; npm run docs:build exits 0"
        status: pass
      - kind: manual
        ref: "Browser check (icons visibly blue at 375px/dark) deferred to the Phase-5 Chrome walkthrough"
        status: deferred
    human_judgment: true
  - id: D3
    description: "About contains only verifiable facts, one-line etymology, five case-study links that all resolve in dist/"
    requirement: "POS-04"
    verification:
      - kind: automated_ui
        ref: "grep gates — unfalsifiable phrases 0; FRM/Edinburgh/WorldQuant present; 5 case-study links (grep -c '(/projects/[a-z]'); all five dist/projects/*.html exist after build"
        status: pass
    human_judgment: false
  - id: D4
    description: "Contact has a live mailto and exactly three Connect links, no response-time hedge, no form"
    requirement: "POS-06"
    verification:
      - kind: automated_ui
        ref: "grep gates — mailto:qiankun0908@gmail.com count 1; '- **' count 3; respond/typically/form greps 0"
        status: pass
    human_judgment: false
  - id: D5
    description: "Site metadata describes a quantitative finance portfolio; OG image is a 1200x630 PNG referenced from all three config.js locations"
    requirement: "POS-01 (sitewide story)"
    verification:
      - kind: automated_ui
        ref: "file docs/public/og-image.png -> PNG 1200 x 630; og-image.png count in config.js = 3; og-image.svg refs anywhere = 0; old copy greps 0; dist/og-image.png exists; dist/index.html og:image URL ends .png"
        status: pass
      - kind: manual
        ref: "OG PNG inspected as an image in-session: name + statement fully inside frame, Source Sans 3 glyphs (not system fallback). Legibility-at-300px judgment and footer browser check deferred to the Phase-5 Chrome walkthrough"
        status: deferred
    human_judgment: true

# Metrics
duration: 12min
completed: 2026-08-06
status: complete
---

# Phase 4 Plan 3: Positioning Copy & Site Metadata Summary

**Discipline-led hero (name, quantitative finance statement, Edinburgh MSc + FRM, one "Selected work" action), fact-only About, live-mailto Contact, quantitative-finance site metadata, and a Playwright-rendered 1200x630 og-image.png replacing the blank-rendering SVG.**

## Performance

- **Duration:** ~12 min
- **Started:** 2026-08-06T13:33:50Z
- **Completed:** 2026-08-06T13:45:00Z (approx)
- **Tasks:** 3
- **Files modified:** 7 (1 created, 5 edited, 1 deleted)

## Accomplishments
- Replaced the "Exploring the Universe of Code" hero with UI-SPEC's verbatim positioning block; removed the second (alt) hero action so `/projects/` is the single one-click path
- Finalized the feature-trio copy and re-stroked all three icons in `var(--vp-c-brand-1)`, deleting all three `<defs><linearGradient>` blocks together with their `url(#...)` references (no dangling-fragment partial edit)
- Rewrote About to five short verifiable-fact sections (credentials sentence, what-I-build, background, one-line etymology, portfolio links) — all five case-study routes confirmed present in `dist/` post-build
- Rewrote Contact to a three-link Connect list with a live `mailto:qiankun0908@gmail.com`; response-time hedge and "Let's Chat" filler deleted, no form added
- Rewrote four metadata literals in `config.js` (site description, keywords, RSS description, PWA manifest description), removed `footer.message`, and pointed all three `og-image` references at the new PNG
- Produced `docs/public/og-image.png` (1200x630, Source Sans 3, white background, name + positioning statement only) and deleted the superseded `og-image.svg`

## Task Commits

Each task was committed atomically:

1. **Task 1: Homepage hero, trio, gradient strip** - `2c0a109` (feat)
2. **Task 2: About/Contact rewrite** - `955c2f9` (feat)
3. **Task 3: Site metadata + raster OG image** - `f8f7040` (feat)

**Plan metadata:** commit pending (this SUMMARY + STATE.md update)

## Files Created/Modified
- `docs/index.md` - hero frontmatter, single action, trio copy, brand-stroked icons
- `docs/about.md` - full-body replacement with UI-SPEC verbatim content
- `docs/contact.md` - full-body replacement; live mailto link
- `docs/.vitepress/config.js` - description, keywords, RSS description, PWA manifest description, footer, includeAssets, og:image/twitter:image
- `docs/.vitepress/theme/JsonLd.vue` - structured-data fallback image `og-image.svg` -> `og-image.png` (dangling-reference fix, file not named in plan)
- `docs/public/og-image.png` - new 1200x630 raster social-share asset
- `docs/public/og-image.svg` - deleted

## OG Image Reproduction Recipe (plan-required record)

1. Author a scratch HTML file: `html, body { width:1200px; height:630px }`, background `#ffffff`, `@font-face` pointing at `file:///.../docs/public/fonts/source-sans-3-variable.woff2` (format `woff2-variations`, weight `200 900`), body flex-column-centred with `0 96px` padding
2. Content: `<div class="name">Qiankun (Kenny) Zhu</div>` at 84px/weight 600/`#1d1d1f`, then the hero positioning sentence at 38px/weight 400/`#6e6e73`, `max-width: 960px`
3. Render: `npx playwright screenshot --viewport-size=1200,630 file:///<scratch>/og-image.html docs/public/og-image.png`
4. Confirm: `file docs/public/og-image.png` reports `PNG image data, 1200 x 630`

## About Word Count (plan-required record)

- **Before:** 28 lines, 135 words
- **After:** 40 lines, 203 words
- Note: the plan's acceptance criterion expected the prose body to be *shorter*; the UI-SPEC-verbatim replacement is in fact longer in raw words because it adds the credentials sentence, "What I build" detail, and a Background section absent from the prior page. Every unfalsifiable line the criterion targets is gone (grep gate = 0). The verbatim Copywriting Contract took precedence over the word-count expectation.

## Disclosure Confirmation (plan-required record)

**No ENN or energy-trading reference was introduced on any indexed page.** Verified: `grep -icw 'ENN'` = 0 and `grep -ci 'energy|commodit|trading'` = 0 across `docs/index.md`, `docs/about.md`, `docs/contact.md`. The one string containing the letters "enn" is the name "Kenny" in the mandated hero copy (see Deviations). `RSS_CONFIG.description` mentions "energy trading and risk management systems" per UI-SPEC's explicit instruction — it describes the surviving ETRM *blog post's subject*, not any role, and is the exact locked wording from the Copywriting Contract.

## Decisions Made
- Marked only POS-01, POS-03, POS-04, POS-06 complete in REQUIREMENTS.md. POS-02 (comprehension proxy) completes in 04-10; DES-12's remaining surfaces (VizPanel hairline, project-card unification) land in 04-04/04-05 — marking either now would show them closed while later plans still owe work.
- Used Playwright screenshot (the plan's primary method) for the OG image; no fallback needed.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed dangling og-image.svg reference in JsonLd.vue**
- **Found during:** Task 3 (the "no reference to the old filename survives anywhere" gate)
- **Issue:** `docs/.vitepress/theme/JsonLd.vue:19` uses `og-image.svg` as the JSON-LD structured-data fallback image — a file this task deletes. The plan's action list named only the three `config.js` references.
- **Fix:** Updated the fallback to `og-image.png`.
- **Files modified:** `docs/.vitepress/theme/JsonLd.vue`
- **Commit:** `f8f7040`

**2. [Rule 2 - Missing critical] Updated PWA manifest description not named in the plan's action list**
- **Found during:** Task 3
- **Issue:** The acceptance gate `grep -ci 'Personal website and blog'` = 0 catches `VitePWA.manifest.description` ("Personal website and blog"), but the plan's six-literal action list omits it.
- **Fix:** Set it to "Quantitative finance case studies by Qiankun (Kenny) Zhu".
- **Files modified:** `docs/.vitepress/config.js`
- **Commit:** `f8f7040`

### Acceptance-gate interpretation notes (no content change)

**3. `grep -ci 'ENN'` false positive on "Kenny":** the plan's Task 1 disclosure gate case-insensitively matches the substring "enn" inside "Kenny" — a string the same plan mandates verbatim in the hero name. Satisfied the gate's intent with `grep -icw 'ENN'` = 0 (word boundary) plus zero matches for energy/commodities/trading.

**4. `(/projects/` count is 6, not 5, in about.md:** UI-SPEC's verbatim Portfolio section links the `/projects/` index *and* the five case studies. The five case-study links were verified separately (`grep -c '(/projects/[a-z]'` = 5) and all five routes exist in `dist/`.

**5. About word count grew rather than shrank** — see the word-count section above; verbatim UI-SPEC copy applied as mandated.

---

**Total deviations:** 2 auto-fixed (1 bug, 1 missing critical), 3 gate-interpretation notes
**Impact on plan:** No scope creep — both fixes were single-string edits required by the plan's own acceptance gates.

## Issues Encountered

None beyond the deviations above. Playwright rendered the OG image on the first attempt with the real Source Sans 3 typeface.

## Deferred to Phase-5 Chrome Walkthrough (human-check portions of verifies)

- Homepage: three icons visibly blue (not invisible/black), one hero button, four-line hero shape with the name as largest text — at desktop, 375px, and dark mode
- OG PNG legibility when scaled to ~300px wide (LinkedIn feed-card size)
- Footer no longer names the tooling (rendered check)

## Known Stubs

None — no placeholder content, empty data values, or unwired components introduced.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- The positioning story is now consistent across hero, trio, About, Contact, search snippet, RSS, footer, and share previews — 04-05 (projects index) and 04-07/08/09 (case-study leads) extend the same Copywriting Contract.
- POS-02's comprehension proxy (04-10) has its structural precondition met: all three facts are grep-confirmable in `docs/index.md`.
- No blockers.

## Self-Check: PASSED

- FOUND: docs/public/og-image.png (PNG 1200 x 630)
- FOUND: commit 2c0a109
- FOUND: commit 955c2f9
- FOUND: commit f8f7040
- CONFIRMED: docs/public/og-image.svg deleted
- FOUND: mailto:qiankun0908@gmail.com in docs/contact.md

---
*Phase: 04-position-design*
*Completed: 2026-08-06*
