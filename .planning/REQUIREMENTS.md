# Requirements: qiankun.co.uk — Polish & Prune

**Defined:** 2026-07-25
**Core Value:** A hiring manager who clicks the URL from the CV forms a favourable, accurate impression of Qiankun's quantitative capability within twenty seconds — and finds nothing that undermines it.

## v1 Requirements

Requirements for this milestone. Each maps to exactly one roadmap phase.

### Infrastructure

- [ ] **INFRA-01**: Live DNS for `qiankun.co.uk` is verified by direct inspection (`dig`) and the serving pipeline documented, before any deployment change is made
- [ ] **INFRA-02**: AWS Amplify auto-deploy is disabled in the console and observed stable before `amplify.yml` and `deploy.sh` are deleted from the repo
- [ ] **INFRA-03**: Cloudflare Pages via GitHub Actions is the only path that can deploy the site; no second pipeline can trigger independently
- [ ] **INFRA-04**: `npm install` resolves clean with no `--legacy-peer-deps` flag remaining in CI, deploy scripts, or documentation
- [ ] **INFRA-05**: `vite-plugin-pwa` is bumped to `^1.3.0` (its peer range then includes Vite 8)
- [ ] **INFRA-06**: `vitepress-plugin-mermaid` and the `mermaid` runtime dependency are removed entirely
- [ ] **INFRA-07**: VitePress is pinned to exactly `2.0.0-alpha.18` with no caret range, so no future alpha can install silently
- [ ] **INFRA-08**: The site builds successfully from a clean checkout after all dependency changes
- [ ] **INFRA-09**: Google Analytics is removed and cookieless Cloudflare Web Analytics is active in its place
- [ ] **INFRA-10**: A short privacy note discloses what analytics is collected

### Prune

- [ ] **PRUNE-01**: The AI Workflow section (index, concepts, patterns, agents, tools) is deleted
- [ ] **PRUNE-02**: The Photos gallery is deleted
- [ ] **PRUNE-03**: The `welcome` blog post is deleted
- [ ] **PRUNE-04**: The Vite plugins blog post is deleted
- [ ] **PRUNE-05**: The "Technology" and "Writing" homepage feature cards are removed
- [ ] **PRUNE-06**: Nav and sidebar configuration contain no entries pointing at deleted pages
- [ ] **PRUNE-07**: No internal link anywhere on the site resolves to a deleted page
- [ ] **PRUNE-08**: `docs/public/_redirects` returns a deliberate 301 or 410 for every deleted URL, shipped in the same commit as the deletions
- [ ] **PRUNE-09**: The six unused `Svg*` chart components and their registrations are deleted, verified by grepping component **tag names** across all markdown (not import statements — VitePress registers them globally)
- [ ] **PRUNE-10**: No "Work in Progress" badge, "coming soon", or equivalent staleness language remains anywhere on the site
- [ ] **PRUNE-11**: `/blog/` is presented as "Writing" rather than a dated feed, so a single remaining post does not read as an abandoned blog

### Design System

- [ ] **DES-01**: The chosen typeface is self-hosted as variable WOFF2; the Google Fonts `@import` is gone and no third-party font request remains
- [ ] **DES-02**: Fonts load with `preload` and `font-display: swap`, producing no visible layout shift
- [ ] **DES-03**: Type scale, weights, and line-measure are defined once as tokens and consumed everywhere
- [ ] **DES-04**: `--vp-font-family-base` is set, rather than `font-family` on a bare `html` selector, so VitePress internals inherit correctly
- [ ] **DES-05**: The brand colour is defined in exactly one place; a minimal `tokens.js` exists only for values Node needs before the DOM (the PWA manifest colour)
- [ ] **DES-06**: Spacing, heading treatment, and visual hierarchy are consistent across every remaining page, verified by side-by-side comparison rather than page-by-page
- [ ] **DES-07**: Chart styling derives from the site's type and colour tokens rather than its own hard-coded values
- [ ] **DES-08**: Both theme `MutationObserver`s are deleted and `useData().isDark` is used instead
- [ ] **DES-09**: All animations and transitions are disabled under `prefers-reduced-motion`
- [ ] **DES-10**: Every page is readable at a 375px viewport, with no chart overflowing, clipping, or becoming illegible
- [ ] **DES-11**: Every page renders correctly in dark mode, including all chart exhibits
- [ ] **DES-12**: The visual result is restrained — decorative gradients and effects are removed where they do not carry meaning

### Positioning

- [ ] **POS-01**: The homepage hero states, above the fold and in plain language, who Qiankun is and what he does
- [ ] **POS-02**: A reader shown only the hero can state back what this person does — the acceptance test is comprehension, not "looks clean"
- [ ] **POS-03**: Selected work is reachable in one click from the homepage
- [ ] **POS-04**: The About page is specific and verifiable, containing no buzzword or filler copy
- [ ] **POS-05**: `projects/index.md` leads each case study with its outcome, with method as supporting detail
- [ ] **POS-06**: Contact offers a direct email path, not a form-only route
- [ ] **POS-07**: Quantitative jargon carries a one-line plain-language translation wherever it appears in a lead or summary

### Exhibits — Finance Quality Bar

- [ ] **EXH-01**: Every chart exhibit has labelled axes including units
- [ ] **EXH-02**: Every chart exhibit carries an as-of date
- [ ] **EXH-03**: Number formatting (percentages, currency, basis points, decimal places) is consistent within and across all five case studies
- [ ] **EXH-04**: Every case study states the source of its data
- [ ] **EXH-05**: No exhibit is purely decorative — each carries information a finance reader would act on

### Verification

- [ ] **VER-01**: An automated link check reports zero dead links sitewide
- [ ] **VER-02**: Homepage, About, and the projects index are free of typos and grammatical errors
- [ ] **VER-03**: CI runs a build and link check on every push
- [ ] **VER-04**: An anti-feature audit confirms the absence of WIP badges, photo galleries, skill bars, testimonials, visitor counters, animated hero effects, chatbots, newsletter popups, hamburger navigation, form-only contact, and a hosted CV PDF
- [ ] **VER-05**: Social/OG preview renders correctly when the URL is pasted into LinkedIn and a messaging client
- [ ] **VER-06**: Deleted URLs are submitted to Google Search Console for removal and the sitemap is resubmitted

## v2 Requirements

Acknowledged but deferred. Not in this roadmap.

### Content

- **V2-01**: A second piece of writing, so "Writing" reads as an ongoing practice rather than a single artifact
- **V2-02**: An energy or commodities case study, closing the gap between the portfolio and the target sector
- **V2-03**: Deeper rewrites of the five existing case studies' analysis

### Technical

- **V2-04**: Lighthouse CI with performance budgets
- **V2-05**: Migration to a stable VitePress 2.x once one is released
- **V2-06**: Structured data / JSON-LD beyond what already exists

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| CV PDF hosted on the site | CV is tailored per application; a generic hosted version would undercut the tailored ones |
| ENN Natural Gas trading detail (employer, notional, commercial figures) | The CV carries this to specific people; a Google-indexed page is a different disclosure surface |
| Repositioning the site around the energy trading career | Considered and explicitly declined — the site is a project portfolio, not a career narrative |
| New case studies or new project work | This is a polish pass on existing material |
| Rewriting case study analysis | Their substance is already the strongest content on the site |
| Downgrading VitePress to 1.6.4 | No meaningfully more stable target exists; 1.6.4 is a year old and docs have moved on |
| Vue component unit tests (Vitest / Test Utils) | Disproportionate for a ten-page static site with no complex client logic — over-testing is its own failure mode |
| Error tracking (Sentry) | Nothing to observe on a static site of this size |
| Bundle-size CI budgets | Premature for ten pages |
| Cookie consent banner | Made unnecessary by the cookieless analytics swap, rather than built |
| i18n / multi-language | English-only audience |
| Blog publishing cadence | A separate concern from this polish pass |

## Traceability

Populated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| (pending roadmap) | | |

**Coverage:**
- v1 requirements: 52 total
- Mapped to phases: 0
- Unmapped: 52 ⚠️

---
*Requirements defined: 2026-07-25*
*Last updated: 2026-07-25 after initial definition*
