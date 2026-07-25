# Project Research Summary

**Project:** qiankun.co.uk — Personal Portfolio Site (Polish & Prune milestone)
**Domain:** Brownfield polish of a live, Google-indexed VitePress/Vue 3/ECharts portfolio site for a finance/energy hiring audience
**Researched:** 2026-07-25
**Confidence:** MEDIUM-HIGH

## Executive Summary

This is not a build-from-scratch project — it's a polish-and-prune pass on a working, live, indexed site with a fixed stack (VitePress 2.0.0-alpha.18 + Vue 3 + ECharts + Vite 8, Cloudflare Pages). All four research streams converge on one structural insight: the typographic/design system and the positioning/content rewrite are interdependent, not sequential. A minimal homepage with vague copy reads as unfinished; the same minimal copy on a rigorous typographic system with strong hierarchy reads as confident restraint. Design work cannot be treated as a coat of paint applied after copy is settled — the two must land together, and design-token consolidation must happen first so the restyle isn't re-touching duplicated color literals while also introducing type-scale variables.

The recommended approach: fix the boring, high-risk technical foundations first and in isolation (deploy pipeline consolidation, VitePress version pin, dependency hygiene) since these are the only parts of the milestone that can take the live site down or corrupt search indexing if sequenced carelessly; then do content deletion/redirects; then design tokens; then the combined typography+positioning rewrite; with a final cross-cutting audit pass. Two things researchers found push back directly on the PROJECT.md brief and need explicit human sign-off before the roadmap locks them in: (1) there is no meaningfully more stable VitePress release to move to — 1.6.4 is a year old and under-documented going forward, so the right move is pinning the current alpha exactly rather than downgrading; (2) Cloudflare Web Analytics (cookieless, already on the deploy platform, free) can replace Google Analytics entirely, which removes the need to build a consent-gating banner rather than solving the consent problem the PROJECT.md brief assumes exists.

The single highest-leverage finding for the actual audience: finance/energy hiring readers pattern-match on domain-specific "tells" — unlabeled chart axes, missing as-of dates, inconsistent percentage/decimal formatting, and buzzword bio copy — far more than they notice typographic refinement. This must be written into the roadmap as a concrete, checkable requirement (a chart unit/date/methodology audit, a number-format grep across all case studies) rather than absorbed into a vague "polish the design" phase, or the highest-value finding in the whole research set gets lost.

## Key Findings

### Recommended Stack

The stack itself is fixed (VitePress, Vue 3, ECharts, Vite, Cloudflare Pages, npm). Research is scoped to five specific technical-debt items from PROJECT.md, empirically verified against this repo's actual `package.json` via `npm install --dry-run` — the highest-confidence research in the whole set.

- VitePress `2.0.0-alpha.18` (pin exact, do NOT downgrade to 1.6.4) — no meaningfully more mature stable release exists; a downgrade is real migration work for a less-documented version
- Self-hosted `Source Sans 3` (variable WOFF2) — replaces the Google Fonts `@import` of Inter; echoes the CV's typeface (design judgment, MEDIUM confidence; self-hosted Inter is an equally defensible fallback)
- `vite-plugin-pwa@^1.3.0` (bump from `^1.2.0`) — verified fix for one of the two `--legacy-peer-deps` conflicts (peer range now includes Vite 8)
- Remove `vitepress-plugin-mermaid` + `mermaid` runtime dep entirely — no version is compatible with VitePress 2.x (unmaintained since Sept 2024); pre-render the 5 diagram blocks in `docs/blog/vite-plugins.md` to static SVG via `mmdc` instead
- Cloudflare Web Analytics — replaces Google Analytics, cookieless, free, already on the deploy platform, removes the need for a consent banner rather than requiring one
- `lychee-action` + `@lhci/cli` in CI — proportionate build/link/performance checks; explicitly NOT Vitest/Vue Test Utils component testing, which is disproportionate for an 11-page static site with no complex client logic

After the two dependency fixes, `npm install` runs clean with zero `--legacy-peer-deps` — confirmed via dry-run against the live registry.

### Expected Features

Sourced from hiring-manager/recruiter portfolio research triangulated with quant-finance-resume-specific guidance (no dedicated literature exists for this exact niche).

**Must have (table stakes):** immediate plain-language identity statement above the fold; work reachable in one click; zero dead links/typos (single most-cited credibility killer); quantified outcomes stated plainly in case studies, not left to inference; direct email/contact path, not form-only; mobile-readable layout; no stale-dated content dominating the hierarchy.

**Should have (differentiators):** outcome-first case study framing (result first, method as supporting detail) — highest-leverage differentiator available without rewriting case-study substance; a one-line "why this matters" translation layer for quant jargon; a genuinely specific, verifiable About page (current version fails entirely); consistent, restrained visual system across all pages — the mechanism that makes minimal read as confident, not absent.

**Defer / reject (anti-features):** WIP badges, photo galleries, skill percentage bars, testimonials, visitor counters, animated hero effects, chatbots, newsletter popups, hamburger nav at this page count, contact-form-only paths, hosted CV PDF. All eleven fail the Core Value test individually — none belong on this site even as future consideration.

### Architecture Approach

The existing five-layer static-site architecture (Content → Theme/Component → Visualization/Styling → Build/Vite → Static Output/Cloudflare) is unchanged; this milestone modifies content within it. Five fixes, each grounded directly in this codebase's actual files (HIGH confidence):

1. **Design tokens** — CSS custom properties stay canonical for anything browser-rendered; a small plain-JS `tokens.js` module is canonical only for values Node needs pre-DOM (currently one brand color for the PWA manifest). No token-generation pipeline — disproportionate for ~4 duplicated values.
2. **Theme override surface** — VitePress's documented pattern (override `--vp-*` vars, target VitePress class names with `!important` for anything not exposed as a variable) is mostly followed; the gap is `--vp-font-family-base` not being set.
3. **Theme reactivity** — delete the duplicated MutationObserver in `VizEChart.vue`/`EBar.vue`, don't consolidate it into a composable — `useData().isDark` from VitePress already provides the same signal, faster and SSR-safe.
4. **Safe content deletion** — sitemap, RSS, PWA precache manifest auto-regenerate from file presence; nav/sidebar entries and internal markdown links do NOT auto-update and require manual grep-and-fix. `_redirects` lands in `docs/public/_redirects`.
5. **Single deploy pipeline** — Cloudflare Pages via GitHub Actions is already correct and matches Cloudflare's recommended pattern; AWS Amplify is a fully redundant, separately-billed second pipeline bound to nothing live.

### Critical Pitfalls

1. **Finance-domain "tells" (highest-leverage finding overall)** — unlabeled chart axes/dates, inconsistent number formatting, buzzword bio copy read as amateur to a finance reader far faster than typographic imperfection does. Must be a concrete, checkable requirement, not folded into generic "polish."
2. **Minimal-homepage trap** — a vague one-liner fails even when visually clean; acceptance test should be "could a stranger state back what this person does," not "looks clean."
3. **Deploy pipeline decommissioning is the single highest-risk step in the whole milestone** — DNS state for qiankun.co.uk must be verified live (`dig`) before touching Amplify; disable the auto-deploy trigger first, observe, then delete.
4. **VitePress alpha migration must be isolated** if attempted — its own branch/PR, fully separate from the design overhaul, so a break is attributable.
5. **"Unused" SVG component deletion requires grepping markdown tag names, not import statements** — VitePress globally-registers these components with no import statement in markdown, so grepping imports returns empty regardless of actual usage.
6. **Deleting indexed pages needs explicit HTTP status handling** — a bare 404 is worse than a deliberate 301/410 via Cloudflare `_redirects`, shipped in the same commit as the deletions.

## Implications for Roadmap

Reconciling ARCHITECTURE.md's dependency graph with PITFALLS.md's risk-based sequencing (the two converge almost entirely) into one recommended build order:

### Phase 1: Technical Foundations (deploy + dependency hygiene)
**Rationale:** These are the two ways this milestone can take the live site down or corrupt the dependency tree if sequenced carelessly — isolate first, before anything else depends on a stable build/deploy path.
**Delivers:** Single deploy pipeline (Amplify decommissioned after live DNS verification); clean `npm install` with no `--legacy-peer-deps`; VitePress version decision resolved and pinned exactly.
**Avoids:** Pitfall 10 (Amplify decommission taking down the live site), Pitfall 8 (migration conflated with design work).
**Human sign-off needed:** the VitePress pin-vs-downgrade decision.

### Phase 2: Content Deletion + Redirects
**Rationale:** Must happen before the visual restyle — restyling pages about to be deleted wastes effort, and nav/sidebar CSS should be edited once against the final page set.
**Delivers:** AI Workflow (5 pages), Photos gallery, `welcome` blog post, filler homepage cards removed; nav/sidebar/internal links audited; `_redirects` shipped in the same commit as deletions; sitewide WIP-language grep; SVG component deletion verified by grepping markdown tag names, one component at a time with intermediate builds.
**Avoids:** Pitfall 7 (indexed-page deletion without status handling), Pitfall 9 (wrong SVG-usage grep), Pitfall 4 (staleness signals sitewide).

### Phase 3: Design Token Consolidation
**Rationale:** Must land before the typographic restyle — the restyle should edit one clean variable set rather than introducing new type-scale variables while untangling duplicated brand-color literals.
**Delivers:** `tokens.js` for Node-context values; theme-reactivity consolidation (delete duplicate MutationObservers in favor of `useData().isDark`) bundled here since `echarts-setup.js` is already being touched.
**Avoids:** Over-engineering a token pipeline for ~4 values; extracting a composable for a 2-line watch at n=2.

### Phase 4: Position + Design (combined — the interdependent core of the milestone)
**Rationale:** This is where the cross-dimension dependency matters most. Homepage/About/Contact/projects-index copy and the typographic system must be planned and executed together, not sequentially — a minimal rewrite without a strong visual system reads as an unfinished stub; a strong system applied to unchanged vague copy doesn't fix the 20-second problem either.
**Delivers:** Self-hosted typeface with correct loading mechanics (preload, font-display:swap, no Google Fonts `@import`); rewritten homepage hero, About, projects-index, Contact; consistent chart styling; the finance-domain quality bar (chart unit/date/methodology audit, number-format grep across case studies) as an explicit sub-requirement; mobile + dark-mode verification at real narrow viewports (375px); cross-page consistency pass done side-by-side; `prefers-reduced-motion` audit; over-design restraint pass on ECharts/gradient SVG.
**Avoids:** Pitfall 1 (finance tells), Pitfall 2 (minimal-homepage trap), Pitfall 3 (over-design), Pitfall 5 (cross-page consistency), Pitfall 6 (mobile ECharts breakage).

### Phase 5: Final Cross-Cutting Audit
**Rationale:** Several verification items cut across all prior phases and are easy to skip if left implicit.
**Delivers:** Anti-feature audit; social/OG preview check; Search Console removal request + sitemap resubmission; minimal CI check layer (build + link-check + Lighthouse, no Vue unit tests).
**Avoids:** The "looks done but isn't" failure mode across every prior phase.

### Phase Ordering Rationale

- Technical-foundation work goes first because it's the only work that can take the live site down or corrupt the dependency tree silently — isolating it means any later breakage is attributable to content/design changes, not infrastructure.
- Content deletion precedes design because restyling soon-to-be-deleted pages is wasted effort.
- Design tokens precede the typography/positioning phase to avoid the restyle doing two jobs (dedup + new tokens) at once.
- Position and Design are combined into one phase, not sequential, because research is explicit that they are interdependent — a deliberate deviation from pure dependency ordering.
- The final audit is separated out because its checklist items are trivially forgotten when treated as sub-tasks of earlier phases.

### Research Flags

Needs deeper research during planning:
- **Phase 1:** VitePress version decision needs human sign-off first; if a genuine migration is chosen over pinning, that sub-task needs its own research pass (changelog review, plugin compatibility). DNS/Amplify state should be re-verified live, not assumed from documentation.
- **Phase 4:** Typeface choice (Source Sans 3 vs. Inter) is a design judgment, not a settled fact — worth a quick gut-check with the user; the finance-domain quality bar checklist should become a concrete per-case-study audit template during phase planning.

Standard patterns (skip research-phase):
- **Phase 2:** Mechanics fully derived from reading this codebase directly — sitemap/RSS/PWA auto-regeneration, `_redirects` syntax, the SVG-grep gotcha are already documented with concrete commands.
- **Phase 3:** Small, bounded scope with an explicit code pattern already specified.
- **Phase 5:** Checklist-driven, no open technical questions.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | MEDIUM-HIGH | Dependency-conflict findings HIGH (empirically verified via `npm install --dry-run` and live registry queries against this repo's actual package.json). Typography/VitePress-status findings MEDIUM. General web-search claims (font-loading, GDPR characterization) LOW per source but consistent across multiple sources. |
| Features | MEDIUM | All sourcing is web search; no dedicated literature exists for "quant-finance portfolio site" as a category. Triangulated from general hiring-manager research, quant-resume-specific research, and portfolio-mistake retrospectives. Strong directional guidance, not validated for this exact segment. |
| Architecture | HIGH | Grounded directly in this codebase's actual files plus official VitePress docs via Context7. Cloudflare `_redirects` specifics MEDIUM — spot-check against live docs at implementation time. |
| Pitfalls | MEDIUM-HIGH | Impression/UX pitfalls HIGH (well-documented, cross-checked). Technical pitfalls (VitePress migration specifics, exact DNS/Amplify state) MEDIUM-LOW — general platform-behavior patterns, not verified against this project's live DNS records, which requires direct inspection during Phase 1 itself. |

**Overall confidence:** MEDIUM-HIGH

### Gaps to Address

- **VitePress version decision (open, requires human sign-off):** PROJECT.md states "move VitePress off `2.0.0-alpha.18` to a stable release." STACK.md's empirical research found no meaningfully more mature stable release exists — 1.6.4 is a year old and under-documented going forward, and this codebase's config/theme already targets 2.0 APIs. Recommendation: pin the current alpha exactly (`"vitepress": "2.0.0-alpha.18"`, drop the `^`) rather than downgrade. This directly contradicts a stated PROJECT.md requirement and should be confirmed with the user before Phase 1's scope locks.
- **Cookie consent / analytics decision (open, requires human sign-off):** PROJECT.md states "add cookie consent gating for Google Analytics (GDPR)." Recommendation: swap to Cloudflare Web Analytics (cookieless, free, already on the deploy platform) instead, removing the need for a consent-banner build entirely. This is a scope change, not just an implementation detail — removes a listed Active requirement (consent gating) and replaces it with a smaller one (swap the analytics script), plus a one-paragraph privacy-policy disclosure as cheap belt-and-suspenders regardless of tool chosen. Needs user confirmation.
- **Typeface choice (Source Sans 3 vs. Inter):** a real, defensible case both ways (CV-consistency vs. visual-continuity-with-current-site). Not blocking, but worth a quick confirmation during Phase 4 planning.
- **DNS state for qiankun.co.uk:** genuinely unverified by desk research — must be checked live (`dig qiankun.co.uk`) before any Amplify decommissioning begins in Phase 1, since existing "Cloudflare = primary" documentation could be stale relative to actual DNS configuration.
- **No finance/energy-portfolio-specific literature exists:** all FEATURES.md findings are triangulated from adjacent research. Directionally strong, not validated for this precise niche — treat the MVP feature list as a strong starting point, not gospel, during Phase 4 discussion.

## Sources

### Primary (HIGH confidence)
- Direct reading of this repository: `docs/.vitepress/config.js`, `custom.css`, `echarts-setup.js`, `VizEChart.vue`, `EBar.vue`, `amplify.yml`, `deploy.sh`, `.github/workflows/deploy.yml`, `.planning/codebase/ARCHITECTURE.md`, `STRUCTURE.md`, `CONVENTIONS.md`, `CONCERNS.md`, `.planning/PROJECT.md`
- `npm view vitepress dist-tags/versions/time --json` and `npm install --package-lock-only --dry-run` against this repo's actual `package.json` (npm registry, 2026-07-25)
- `npm view vite-plugin-pwa@latest peerDependencies`, `vitepress-plugin-mermaid` versions/peerDependencies, and equivalent checks for all other VitePress plugin devDependencies (npm registry, 2026-07-25)
- Context7 `/vuejs/vitepress` — `extending-default-theme.md`, `vars.css` source, `useData()`/`isDark` composable behavior
- Cloudflare Pages `_redirects` documentation — verify against live docs at implementation time

### Secondary (MEDIUM confidence)
- GitHub Discussion `vuejs/vitepress#5072` ("Timeline for Stable v2 Release") — no maintainer response as of query date
- web.dev "Best practices for fonts," CSS-Tricks font-loading strategies
- diva-e and Reboot Online on 410 vs 404 SEO de-indexing behavior — empirical crawl-frequency data
- Fueler, Opendoors Careers, Resumly, Profy.dev 60-hiring-manager survey, Street of Walls quant-resume guidance — convergent recruiter/hiring-manager portfolio research

### Tertiary (LOW confidence)
- Cloudflare Web Analytics GDPR/cookie-consent characterization — cross-checked across multiple sources but not formal legal sign-off
- Typography/typeface design-judgment sources — design opinion, not benchmarked fact
- General technical-writing-for-non-technical-audience guidance supporting "lead with outcome, define jargon"

---
*Research completed: 2026-07-25*
*Ready for roadmap: yes — pending two human sign-off decisions flagged above (VitePress version, analytics/consent approach)*
