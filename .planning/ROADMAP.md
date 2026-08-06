# Roadmap: qiankun.co.uk — Polish & Prune

## Overview

This is a polish-and-prune pass on a live, Google-indexed VitePress portfolio site, not a
greenfield build. The five phases below fix the boring, high-risk technical foundations first
(the only work that can take the live site down), delete the content that actively hurts the
Core Value before touching any styling, consolidate design tokens so the restyle edits one
clean variable set, then combine the positioning rewrite with the typographic system rebuild —
deliberately, since research found the two are interdependent and splitting them means rewriting
the hero twice — and close with an explicit cross-cutting audit that catches what's trivially
forgotten when left implicit in earlier phases.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Technical Foundations** - Single deploy pipeline, clean dependencies, pinned VitePress, cookieless analytics — with zero risk to the live site
- [ ] **Phase 2: Content Deletion & Redirects** - Remove what actively hurts, verify no dead links, redirect every deleted URL
- [x] **Phase 3: Design Token Consolidation** - One source of truth for brand colour and theme reactivity, before the restyle touches either (completed 2026-07-27)
- [ ] **Phase 4: Position & Design** - Rewrite the twenty-second story and rebuild the typographic/visual system together
- [ ] **Phase 5: Final Cross-Cutting Audit** - Checklist-driven verification pass across the whole finished site

## Phase Details

### Phase 1: Technical Foundations

**Goal**: The site deploys through exactly one pipeline, on dependency-clean and correctly-pinned versions, with cookieless analytics in place — and at no point during this phase is there risk of the live site going down or search indexing corrupting.
**Depends on**: Nothing (first phase)
**Requirements**: INFRA-01, INFRA-02, INFRA-03, INFRA-04, INFRA-05, INFRA-06, INFRA-07, INFRA-08, INFRA-09, INFRA-10
**Success Criteria** (what must be TRUE):

  1. Live DNS for `qiankun.co.uk` has been inspected directly (`dig`) and the actual serving pipeline documented, before any deploy-pipeline change is made.
  2. AWS Amplify auto-deploy has been disabled in the console and the site observed stable before `amplify.yml` and `deploy.sh` are deleted from the repo — Cloudflare Pages via GitHub Actions is the only path that can trigger a deploy.
  3. `npm install` completes on a clean checkout with no `--legacy-peer-deps` flag remaining anywhere in CI config, deploy scripts, or documentation, and the site builds successfully.
  4. `vite-plugin-pwa` is at `^1.3.0`, `vitepress-plugin-mermaid` and the `mermaid` runtime dependency are gone, and VitePress is pinned to exactly `2.0.0-alpha.18` with no caret range.
  5. The live site serves cookieless Cloudflare Web Analytics instead of Google Analytics, and a short on-site privacy note states what is collected.

**Plans**: 1/4 plans executed

Plans:

- [ ] 01-01-PLAN.md — Verify live DNS, disable Amplify auto-build (human checkpoint), then delete the Amplify pipeline files and correct the README deploy path (wave 1)
- [x] 01-02-PLAN.md — Fix the dependency set, unwrap the mermaid config wrapper, regenerate the lockfile, and remove the install suppression flag from CI (wave 2)
- [ ] 01-03-PLAN.md — Enable Cloudflare Web Analytics (human checkpoint), remove Google Analytics, and confirm the beacon in live page source (wave 3)
- [ ] 01-04-PLAN.md — Publish the privacy page and route its site-wide link through the layout-bottom slot (wave 4)

### Phase 2: Content Deletion & Redirects

**Goal**: The site contains only the pages this milestone intends to keep, no stale pointer to a deleted page survives anywhere on the site, and every deleted URL redirects deliberately instead of dead-ending.
**Depends on**: Phase 1
**Requirements**: PRUNE-01, PRUNE-02, PRUNE-03, PRUNE-04, PRUNE-05, PRUNE-06, PRUNE-07, PRUNE-08, PRUNE-09, PRUNE-10, PRUNE-11
**Success Criteria** (what must be TRUE):

  1. The AI Workflow section, Photos gallery, `welcome` post, and Vite plugins post are absent from the built site (`dist/`), and the homepage no longer shows the "Technology"/"Writing" filler cards.
  2. No nav entry, sidebar entry, or internal markdown link anywhere on the site points at a deleted page, confirmed by an automated link check run against `dist/`.
  3. `docs/public/_redirects` returns a deliberate 301 or 410 for every deleted URL, shipped in the same commit as the corresponding deletion.
  4. Grepping all markdown for the six legacy `Svg*` component tag names (not import statements) returns zero matches, and the components and their registrations are deleted.
  5. A sitewide grep for "Work in Progress," "coming soon," and equivalent staleness language returns zero hits, and `/blog/` presents as "Writing" rather than a dated feed of one.

**Plans**: 3/3 plans executed

Plans:

- [x] 02-01-PLAN.md — Delete Photos, AI Workflow, and the two retired posts; prune nav/sidebar; ship `_redirects`; re-present `/blog/` as Writing (wave 1)
- [x] 02-02-PLAN.md — Rebuild the homepage features trio, remove the Recent Posts block and its data loader, delete the six retired `Svg*` components (wave 2)
- [x] 02-03-PLAN.md — Phase-terminal audit: nav/sidebar and sitewide link sweep, `_redirects` contents, built output, sitemap and feed (wave 3)

**UI hint**: yes

### Phase 3: Design Token Consolidation

**Goal**: The brand colour and theme-reactivity logic each have exactly one source of truth, so the Phase 4 restyle edits one clean variable set instead of untangling duplicated literals while introducing new type-scale tokens.
**Depends on**: Phase 2
**Requirements**: DES-05, DES-08
**Success Criteria** (what must be TRUE):

  1. Grepping the codebase for the brand colour's hex value returns exactly one canonical definition — either a CSS custom property or `tokens.js` — with every other usage referencing it, and no duplicate hard-coded occurrence remains.
  2. `tokens.js` exists and is the only place holding colour values Node needs before the DOM renders (the PWA manifest colour), sourced from the same value as the CSS token rather than hand-copied.
  3. Both theme `MutationObserver`s are deleted from `VizEChart.vue`/`EBar.vue`; theme switching there derives from VitePress's `useData().isDark`, and charts still re-theme correctly on toggle.
  4. Toggling dark mode produces no duplicate re-renders or console warnings from the old observer logic.

**Plans**: 3/3 plans executed

Plans:

- [x] 03-01-PLAN.md — Tracer: create `tokens.js`, wire the PWA manifest through it, convert one chart component's theme trigger, and browser-prove the post-flush recipe before scaling (wave 1)
- [x] 03-02-PLAN.md — Convert the remaining eleven theme triggers to `useData().isDark` with `{ flush: 'post' }`, and reduce the brand hex to two cross-referenced literals (wave 2)
- [x] 03-03-PLAN.md — Phase-terminal: browser sweep across all eight chart types through a full toggle cycle, then audit committed state against every gate and scope guard (wave 3)

**UI hint**: yes

### Phase 4: Position & Design

**Goal**: A reader who lands on the homepage forms an accurate, favourable impression of what Qiankun does within twenty seconds, and every remaining page carries that story through one consistent, restrained, finance-appropriate typographic and visual system.
**Depends on**: Phase 3
**Requirements**: POS-01, POS-02, POS-03, POS-04, POS-05, POS-06, POS-07, DES-01, DES-02, DES-03, DES-04, DES-06, DES-07, DES-09, DES-10, DES-11, DES-12, EXH-01, EXH-02, EXH-03, EXH-04, EXH-05
**Success Criteria** (what must be TRUE):

  1. A reader shown only the homepage hero, with no other context, can correctly state back what Qiankun does and his area of expertise — this is the acceptance test, not "looks clean" — and selected work is reachable from the homepage in one click.
  2. The About page reads as specific and verifiable with no buzzword or filler sentence remaining, and Contact offers a direct email path rather than a form-only route.
  3. `projects/index.md` and each of the five case studies lead with outcome before method, and every quant term appearing in a lead or summary carries a one-line plain-language translation.
  4. Every chart exhibit across all five case studies has labelled axes with units, an as-of date, and a stated data source, and number formatting (percentages, currency, basis points, decimal places) is consistent within and across all five case studies — verified by a per-case-study audit, not spot-checked.
  5. The typeface is self-hosted as variable WOFF2 with no third-party font request remaining; it loads with `preload` and `font-display: swap` producing no visible layout shift; `--vp-font-family-base` is set (not `font-family` on a bare `html` selector); and type scale, weights, and line-measure are defined once as tokens and consumed everywhere.
  6. Checked side-by-side across every remaining page, at a genuinely narrow (375px) viewport, and in dark mode: spacing, heading treatment, and hierarchy are consistent; chart styling derives from the site's type and colour tokens; no decorative gradient or effect survives without carrying meaning; and no animation or transition plays when `prefers-reduced-motion` is set.

**Plans**: 9/10 plans executed

Plans:

- [x] 04-01-PLAN.md — Tracer: self-hosted Source Sans 3 wired end-to-end (font swap, atomic)
- [x] 04-02-PLAN.md — Token foundation in custom.css: type, spacing, weight, semantic colour, reduced-motion
- [x] 04-03-PLAN.md — Positioning copy: hero, feature trio, About, Contact, site metadata, OG PNG
- [x] 04-04-PLAN.md — Exhibit chrome: VizPanel provenance props, chart theme slots, dead-component removal
- [x] 04-05-PLAN.md — Projects index: card unification into custom.css, locked order, outcome-first blurbs
- [x] 04-06-PLAN.md — Ten chart components: axis titles, reduced-motion gating, semantic colour resolution
- [x] 04-07-PLAN.md — Cisco case study: lead, 13 exhibits, colour removal, number audit
- [x] 04-08-PLAN.md — Global Equity + Board Diversity case studies
- [x] 04-09-PLAN.md — WorldQuant BRAIN + UK Finance Pay case studies (incl. honest relabel)
- [ ] 04-10-PLAN.md — Writing index + cross-page sweep: 375px, dark mode, EXH-03 audit, POS-02 proxy

**UI hint**: yes

### Phase 5: Final Cross-Cutting Audit

**Goal**: The finished site passes an explicit, checklist-driven verification pass — the items that are trivially forgotten when treated as sub-tasks of earlier phases.
**Depends on**: Phase 4
**Requirements**: VER-01, VER-02, VER-03, VER-04, VER-05, VER-06
**Success Criteria** (what must be TRUE):

  1. An automated link checker run against `dist/` reports zero dead links sitewide, and CI runs this build-and-link-check on every push.
  2. The homepage, About page, and projects index contain no typos or grammatical errors on a careful read-through.
  3. Pasting the site URL into LinkedIn and a messaging client renders the correct title, description, and preview image.
  4. An anti-feature checklist confirms none of the following are present anywhere on the site: WIP badges, photo gallery, skill percentage bars, testimonials, visitor counters, animated hero effects, chatbots, newsletter popups, hamburger navigation, form-only contact, or a hosted CV PDF.
  5. Every deleted URL has been submitted to Google Search Console for removal and the sitemap has been resubmitted.

**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Technical Foundations | 1/4 | In Progress|  |
| 2. Content Deletion & Redirects | 3/3 | In Progress|  |
| 3. Design Token Consolidation | 3/3 | Complete    | 2026-07-27 |
| 4. Position & Design | 9/10 | In Progress|  |
| 5. Final Cross-Cutting Audit | 0/TBD | Not started | - |
