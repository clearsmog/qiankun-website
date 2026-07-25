# qiankun.co.uk — Personal Portfolio Site

## What This Is

A personal portfolio website at `qiankun.co.uk` presenting Qiankun (Kenny) Zhu's quantitative finance work as a set of case studies. The URL goes on his CV, so the primary audience is finance and energy recruiters, hiring managers, and senior managers arriving cold with no prior context and roughly twenty seconds of patience.

This milestone is a **polish and prune** pass on an existing VitePress site: remove filler and unfinished sections, rewrite the positioning so a stranger immediately understands who this is, rebuild the visual layer to read as simple and professional, and clean up the technical foundations underneath.

## Core Value

A hiring manager who clicks the URL from the CV forms a favourable, accurate impression of Qiankun's quantitative capability within twenty seconds — and finds nothing that undermines it.

## Requirements

### Validated

<!-- Shipped and confirmed working in the existing codebase. -->

- ✓ VitePress static site building to `docs/.vitepress/dist/` — existing
- ✓ Deployed live at `qiankun.co.uk` (custom domain, Cloudflare Pages) — existing
- ✓ Five quantitative case studies under `/projects/` (global equity portfolio, WorldQuant BRAIN alpha research, board diversity & ESG, Cisco equity valuation, UK finance pay) — existing
- ✓ ECharts visualisation component library with light/dark theme reactivity (EBar, ELine, EDonut, VizEChart, VizPanel, HeroMetrics) — existing
- ✓ Blog with frontmatter-driven content loader and date sorting — existing
- ✓ Dark mode, PWA, RSS feed, sitemap, Google Analytics, SEO metadata — existing

### Active

<!-- Current scope for this milestone. Hypotheses until shipped. -->

**Prune — remove what actively hurts**

- [ ] Delete the AI Workflow section (5 pages of generic LLM explainer carrying a "Work in Progress" badge)
- [ ] Delete the Photos gallery
- [ ] Delete the `welcome` blog post
- [ ] Delete the Vite plugins blog post (developer-audience piece; also the only consumer of the dead Mermaid plugin)
- [ ] Remove the "Technology" and "Writing" homepage feature cards (filler, no links, no substance behind them)
- [ ] Reframe `/blog/` as "Writing" rather than a dated blog feed — one post remains (ETRM), and a dated feed of one reads as abandoned
- [ ] Remove navigation, sidebar, and internal links pointing at deleted pages; verify no 404s
- [ ] Add `docs/public/_redirects` for every deleted URL — the site is live and indexed, so stale links must not dead-end
- [ ] Sitewide grep for residual WIP badges, "coming soon", and staleness signals beyond the named deletions

**Position — fix the twenty-second problem**

- [ ] Replace the homepage hero ("Exploring the Universe of Code") with a minimal treatment: name, one line of substance, straight into selected work
- [ ] Rewrite `about.md` as a real professional bio (currently "I'm passionate about technology" — could belong to anyone)
- [ ] Rewrite `projects/index.md` so each case study leads with what it is and what it produced
- [ ] Review `contact.md` for professional tone and working links

**Design — simple and professional**

- [ ] Establish a considered typographic system (typeface, scale, weights, measure, rhythm); self-host the typeface to kill the render-blocking Google Fonts import
- [ ] Consolidate design tokens to a single source of truth (brand colour is currently hard-coded in four places)
- [ ] Apply consistent spacing, layout, and visual hierarchy across all remaining pages
- [ ] Make chart styling consistent with the site's type and colour system
- [ ] **Finance-domain quality bar**: every chart exhibit has labelled axes with units and an as-of date; number formatting (percentages, currency, basis points) is consistent across all five case studies
- [ ] Verify the result on mobile at a genuinely narrow viewport, and in dark mode

**Technical credibility — nothing embarrassing under the hood**

- [ ] Verify where `qiankun.co.uk` DNS actually points **before** touching either pipeline (currently an assumption, not a checked fact)
- [ ] Consolidate to a single deployment pipeline (Cloudflare Pages via GitHub Actions); decommission AWS Amplify in the AWS console *first*, then delete `amplify.yml` and `deploy.sh`
- [ ] Delete the six unused legacy SVG chart components and their registrations (~50KB dead code) — verify by grepping **tag names** across markdown, not imports
- [ ] Resolve the two real peer conflicts: bump `vite-plugin-pwa` to `^1.3.0`, remove `vitepress-plugin-mermaid` (dead upstream, now unused); drop `--legacy-peer-deps` from CI and deploy scripts
- [ ] Pin VitePress to the exact `2.0.0-alpha.18` rather than a caret range — no stable v2 exists and 1.6.4 is a year old, so the hazard is silent alpha drift, not the alpha itself
- [ ] Replace Google Analytics with cookieless Cloudflare Web Analytics — removes the ePrivacy consent trigger rather than gating around it
- [ ] Delete both theme `MutationObserver`s and use VitePress's `useData().isDark` — they manually re-derive a signal the framework already exposes
- [ ] Audit animations against `prefers-reduced-motion`
- [ ] Add a proportionate check layer: link checking and build verification against `dist/`. Explicitly no Vue unit-testing framework — over-testing an 11-page static site is a real failure mode

### Out of Scope

- **CV PDF hosted on the site** — the CV is tailored per application; a generic one on the site would undercut that
- **ENN Natural Gas trading detail (employer name, notional figures, commercial outcomes)** — the CV carries the professional story to specific people; a Google-indexed page is a different disclosure surface
- **Repositioning the site around the energy trading career** — considered and explicitly declined; the site is a project portfolio, not a career narrative
- **Deeper rewrites of the five case studies** — their content is good enough for this milestone; polish surrounds them rather than replacing them
- **New energy/commodities case study** — no new project work in this milestone
- **Error tracking (Sentry), bundle-size CI budgets, and Vue unit tests** — flagged in the codebase audit, but disproportionate for a ten-page static site; over-testing here is its own failure mode
- **Downgrading VitePress to 1.6.4** — considered and rejected; no meaningfully more stable target exists
- **i18n / multi-language** — English-only audience
- **Blog cadence or new writing** — publishing rhythm is a separate concern from this polish pass

## Context

**Existing stack:** VitePress 2.0.0-alpha.18, Vue 3, ECharts + vue-echarts, Vite 8, deployed to Cloudflare Pages via GitHub Actions. Content is markdown with embedded Vue components. Custom CSS with an Apple-inspired theme and dark mode. A full codebase map exists at `.planning/codebase/` (refreshed 2026-07-25).

**Content after pruning:** homepage, About, Contact, `/projects/` index plus five case studies, and `/blog/` (reframed as "Writing") with the single ETRM piece. Ten pages — deliberately lean.

**Who Qiankun is** (context for writing, not for publication): MSc Finance and Investment at the University of Edinburgh; previously MSc Artificial Intelligence at NTU Singapore and BEng Software Engineering at Xi'an Jiaotong. FRM certified (GARP). WorldQuant BRAIN Challenge Gold. Prior experience in gas and LNG derivatives trading. He has decided the site should not foreground this professional history — see Out of Scope.

**Known issues carried in from the codebase audit** (`.planning/codebase/CONCERNS.md`): two competing deployment pipelines running independently, no test coverage of any kind, Google Analytics injected without consent, unused SVG chart components, VitePress on an alpha release, `--legacy-peer-deps` masking real conflicts.

**Tension to hold:** the site must read as professional without reading as a job application. The minimal homepage treatment was chosen precisely because it lets the work speak rather than making claims.

## Constraints

- **Tech stack**: Stay on VitePress + Vue 3 + ECharts — the site works and the component library is a real asset; no framework migration
- **Deployment**: Cloudflare Pages at `qiankun.co.uk` — domain is established and already on materials
- **Audience**: Finance/energy hiring audience, not a developer audience — technical cleverness is invisible to them, presentation is not
- **Disclosure**: Nothing about the ENN trading role goes on a public indexed page
- **Content**: Case study substance stays as-is; this milestone touches framing, not analysis
- **Package manager**: npm (existing `package-lock.json`)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Site stays a project portfolio, not a career narrative | Qiankun's call after being shown the gap between his CV (gas/LNG derivatives, $1B+ notional) and the site's equity-coursework framing; the CV carries the professional story to specific people | — Pending |
| No CV PDF on the site | CV is tailored per application; a generic hosted version would undercut the tailored ones | — Pending |
| Minimal homepage over credential-led or work-led | Confident and quiet; lets case studies do the talking; ages better than a claims-forward hero | — Pending |
| Finance-first, energy present but not foregrounded | Qiankun's stated priority; energy needs to not look absent rather than lead | — Pending |
| Delete rather than finish the AI Workflow section | Five pages of generic LLM content wearing a "Work in Progress" badge; unfinished sections read worse than absent ones | — Pending |
| Prune Photos gallery from a hiring-facing site | Personal content is neutral at best and a liability at worst when the reader is a hiring manager | — Pending |
| Keep case study content, polish its surroundings | Their substance is already the strongest thing on the site; effort is better spent where the site is weak | — Pending |
| Pin the VitePress alpha rather than "upgrade to stable" | Research found no stable v2 exists and `latest` (1.6.4) is a year old with docs targeting the alpha branch; the real hazard is the caret range allowing silent breaking-alpha installs | — Pending |
| Replace GA with Cloudflare Web Analytics | Cookieless by design, so the ePrivacy consent requirement disappears instead of needing a banner; already on Cloudflare Pages; accepts a thinner dashboard | — Pending |
| Delete theme observers rather than extract a composable | VitePress's `useData().isDark` already is the reactive signal; a composable for a two-line watch at n=2 would be its own anti-pattern | — Pending |
| Cut the Vite plugins post; keep `/blog/` as "Writing" | Developer-audience piece on a finance-facing site, and the only Mermaid consumer — removing it clears a dead dependency for free. One post presented as "Writing" avoids a dated feed of one reading as abandoned | — Pending |
| Design and positioning run together, not in sequence | Research is explicit that minimal content reads as confident only when backed by strong typographic structure — rewriting the hero before the type scale exists means rewriting it twice | — Pending |
| Typeface deferred to the design phase | Real choice between Source Sans 3 (matches the CV, one identity across documents) and self-hosted Inter (visual continuity); decided with the scale and spacing rather than in isolation | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-07-25 after research findings*
