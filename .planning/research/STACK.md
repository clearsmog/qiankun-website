# Stack Research

**Domain:** Personal quantitative-finance portfolio site (VitePress + Vue 3 + ECharts, brownfield polish milestone)
**Researched:** 2026-07-25
**Confidence:** MEDIUM-HIGH (dependency-conflict findings are HIGH — empirically verified against this repo's actual package.json via `npm install --dry-run`; typography and VitePress-status findings are MEDIUM; general web-search claims are marked LOW per source)

This is not a greenfield stack pick. The stack is fixed (VitePress + Vue 3 + ECharts + Vite, Cloudflare Pages, npm). Every recommendation below is scoped to polishing that existing stack per the five milestone questions.

## Recommended Stack

### Core Technologies (unchanged — confirming fixed choices)

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| VitePress | `2.0.0-alpha.18` (pin exact, do not downgrade) | Static site generator | See Topic 2 below — downgrading to the "stable" 1.6.4 is a net-negative move at this point |
| Vue 3 | (via VitePress) | UI framework | No change — out of scope |
| ECharts + vue-echarts | `^6.1.0` / `^8.0.1` | Charting | No change — out of scope |
| Vite | `^8.1.4` | Build tool | No change — root cause of one dependency conflict, not the fix target (see Topic 4) |

### Supporting Libraries (additions for this milestone)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Self-hosted `Source Sans 3` (variable, WOFF2) | latest on Google Fonts / Fontsource | Primary UI + body typeface | Replace the Google Fonts `@import` of Inter — see Topic 1 |
| `@fontsource-variable/source-sans-3` | latest | npm-installable self-hosted font package (alternative to manual download) | If you want the font managed as a dependency rather than committed static files |
| `lychee-action` (lycheeverse/lychee-action) | latest tag | Broken-link checking in CI | Add to GitHub Actions, run against `dist/` after build |
| `@lhci/cli` (Lighthouse CI) | latest | Performance/SEO/a11y regression checks | Add as a CI step pointed at `docs/.vitepress/dist` |
| `vite-plugin-pwa` | `^1.3.0` (bump from `^1.2.0`) | PWA support | Fixes the vite@8 peer conflict — see Topic 4 |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| Cloudflare Web Analytics | Cookieless first-party analytics | Replace Google Analytics — see Topic 3. Enabled via Cloudflare dashboard toggle or one `<script>` tag in `config.js`; needs no consent banner code |
| `lychee` / Lighthouse CI in GitHub Actions | Proportionate CI checks | See Topic 5 — no Vue unit-testing framework needed |

## Installation

```bash
# Font (if using the Fontsource package route instead of manual WOFF2 files)
npm install @fontsource-variable/source-sans-3

# Dependency-conflict fixes (no --legacy-peer-deps needed after these)
npm install -D vite-plugin-pwa@^1.3.0
npm uninstall vitepress-plugin-mermaid mermaid   # replace with build-time SVG rendering, see Topic 4/5

# CI checks (dev-only, not runtime deps — install in workflow, not package.json, or as devDependencies if run locally too)
npm install -D @lhci/cli
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|--------------------------|
| Source Sans 3 (self-hosted) | Inter (self-hosted) | If visual continuity with the current site matters more than CV-typeface consistency — Inter is equally defensible for a finance audience, just doesn't echo the CV |
| Cloudflare Web Analytics | Plausible / Umami | If you want dashboards with more detail (funnels, custom events) than Cloudflare's basic pageview/referrer view offers — but that's overkill for an 11-page CV-linked site |
| Pin VitePress at current alpha | Downgrade to 1.6.4 stable | Only if a specific 2.0-only feature/plugin becomes a blocker and you're willing to revert config/theme code against a less-documented, dependency-incompatible API surface |
| lychee for link-checking | linkinator | Linkinator is Node-native (no separate binary) if you'd rather not add a Rust binary step to CI; functionally equivalent for this site's size |
| Build-time mermaid→SVG | Keep `vitepress-plugin-mermaid` + `--legacy-peer-deps` | Never, for this repo — the package is dead upstream (see Topic 4) |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|--------------|
| Google Fonts `@import` in CSS | Render-blocking (extra DNS+TLS round trip before first paint), and serving a UK visitor's IP to a US-based Google endpoint on every page load is a GDPR data-transfer consideration worth avoiding for a hiring-facing site | Self-hosted WOFF2 with `font-display: swap` + `<link rel="preload">` |
| Downgrading to VitePress 1.6.4 | Not actually safer — no active maintenance signal on 1.x docs, and this codebase's config/theme already targets 2.0 APIs; reverting is real migration work for a version the project itself is de-emphasizing | Pin `2.0.0-alpha.18` exactly, revisit at next milestone |
| Vue component unit tests (Vitest + Vue Test Utils) for an 11-page static site | Disproportionate — there is no complex client-side logic to unit-test; the actual risk is "does the build succeed and do pages 404" | Build verification + link checking + Lighthouse CI |
| `--legacy-peer-deps` as a permanent fixture in CI/deploy scripts | Silently accepts a broken dependency tree; hides exactly the kind of conflict that causes a working local build to fail once a lockfile is regenerated | Fix the two specific offending packages (Topic 4) so `npm install` resolves cleanly with no flag |
| Sentry / error tracking, bundle-size CI budgets | Explicitly out of scope per PROJECT.md — flagged in the codebase audit but not proportionate for this site | Nothing — not needed |

## Stack Patterns by Variant

**If the mermaid diagrams in `docs/blog/vite-plugins.md` are kept as diagrams (not converted to images):**
- Do not try to force `vitepress-plugin-mermaid` to keep working via `--legacy-peer-deps` — it is unmaintained (last publish September 2024) and has no version compatible with VitePress 2.x
- Pre-render the 5 diagrams to static SVG at build time (or once, committed as assets) using `@mermaid-js/mermaid-cli` (`mmdc`), and embed as plain `<img>`/markdown images
- This also drops the `mermaid` (11.12.2) runtime dependency and its client-side render cost for a single blog post

**If the AI Workflow section deletion (per PROJECT.md) removes most/all mermaid usage:**
- Check first — deleting those 5 pages may remove the only heavy consumer of Mermaid; confirmed via `grep` that only `docs/blog/vite-plugins.md` (a page being KEPT) currently uses ` ```mermaid ` blocks (5 instances), so the dependency problem does not go away with the AI Workflow deletion and must be solved directly

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|------------------|-------|
| `vite@^8.1.4` | `vite-plugin-pwa@^1.3.0` (not `^1.2.0`) | Verified via `npm view vite-plugin-pwa@latest peerDependencies` — 1.3.0 added `^8.0.0` to its peer range; 1.2.0's peer range tops out at `^7.0.0` |
| `vitepress@2.0.0-alpha.18` | `vitepress-plugin-tabs@^0.9.1`, `vitepress-plugin-group-icons@^1.7.5`, `vitepress-plugin-rss@^0.4.4`, `@nolebase/vitepress-plugin-enhanced-readabilities@^2.18.2` | All confirmed compatible via `npm view <pkg>@latest peerDependencies` — none of these are the source of the ERESOLVE conflicts |
| `vitepress@2.0.0-alpha.18` | `vitepress-plugin-mermaid@2.0.17` | **Incompatible.** Peer range is `^1.0.0 \|\| ^1.0.0-alpha` only; package last published 2024-09-24 with no newer release. This is the actual reason `--legacy-peer-deps` currently exists in the deploy scripts |
| `@vitejs/plugin-vue@^6.0.7` (pulled in by VitePress 2.0) | `vite@^8.1.3` | Confirmed compatible — VitePress 2.0's own dependency tree is internally consistent; the conflicts are all from *other* devDependencies not yet updated for Vite 8 / VitePress 2.x |

Verification method: `npm install --package-lock-only --dry-run` against the actual `package.json`, plus `npm view <pkg> peerDependencies/versions/time --json` against the live npm registry (2026-07-25). This is ground-truth for this specific repo, not a general claim — treat these findings as HIGH confidence.

## Topic Deep-Dives

### 1. Typography (highest value)

**Recommendation: self-host Source Sans 3 (the modern variable-font successor to Source Sans Pro) as the primary typeface, replacing Inter.**

Rationale:
- The user's CV is set in Source Sans Pro. Adobe's canonical successor is **Source Sans 3**, a variable font covering the same weight range with better hinting and a smaller single-file footprint than shipping multiple static weights. Using it on the site creates a consistent visual identity between CV and site — the two touchpoints a hiring manager sees, in sequence, within the same five minutes.
- Source Sans is designed for UI/text-heavy contexts and reads as understated and professional rather than "startup SaaS" — the current Inter-via-Google-Fonts choice is not wrong, but it is the single most common choice across every SaaS marketing site and dashboard; Source Sans differentiates slightly while staying conservative. (Confidence: MEDIUM — a design judgment, not a benchmarked fact.)
- Alternative if visual continuity with the current site is preferred over CV continuity: **keep Inter**, self-hosted. Inter has excellent tabular figures (important for a site full of financial data tables/charts) and is well-established for fintech/professional contexts. Either choice is defensible; the CV-consistency argument is what tips it toward Source Sans 3.

**Loading mechanics (the part that actually matters more than which typeface):**

1. Download the variable WOFF2 file(s) — for Source Sans 3, one variable-weight woff2 file covers the full weight range (typically ~40-60KB for a subset including Latin only).
2. Place under `docs/public/fonts/` (VitePress serves `public/` at site root, so reference as `/fonts/source-sans-3-variable.woff2`).
3. Define `@font-face` in `custom.css` (or a new `fonts.css` imported once):
   ```css
   @font-face {
     font-family: 'Source Sans 3';
     src: url('/fonts/source-sans-3-variable.woff2') format('woff2-variations');
     font-weight: 200 900;
     font-style: normal;
     font-display: swap;
   }
   ```
4. Add a `<link rel="preload">` for that single file in `config.js` head config — **only the one file**, not every weight/style:
   ```js
   head: [
     ['link', { rel: 'preload', href: '/fonts/source-sans-3-variable.woff2', as: 'font', type: 'font/woff2', crossorigin: '' }]
   ]
   ```
5. Delete the Google Fonts `@import` line from `custom.css` entirely — this is the actual fix. The `@import` currently forces a blocking round-trip to `fonts.googleapis.com` (CSS) then `fonts.gstatic.com` (font file) before the browser can even start laying out text, on top of sending a UK visitor's request to Google's infrastructure.
6. `font-display: swap` prevents invisible text (FOIT) during the brief load window; with self-hosting + preload the window is small enough that swap rarely triggers visibly.

**Alternative install path:** `npm install @fontsource-variable/source-sans-3` and import its CSS (`@fontsource-variable/source-sans-3`) instead of hand-rolling `@font-face` — Fontsource packages the WOFF2 + correct `@font-face` declarations as an npm dependency, which fits this project's existing pattern of managing everything through npm rather than committed binary assets. Either approach (manual files vs. Fontsource package) is fine; Fontsource is slightly more maintainable since font updates come via `npm update`.

**What NOT to do:** Do not add a second display/heading typeface on top of this. A single well-loaded sans, using its weight range for hierarchy (400 body, 600 subhead, 700+ for the name/hero), is the "simple and professional" brief — a second typeface is exactly the kind of decorative flourish this milestone is pruning away elsewhere on the site.

Confidence: MEDIUM (typeface choice is a design recommendation, not a verifiable fact; the loading-mechanics guidance — WOFF2, font-display:swap, single-file preload, self-hosting over `@import` — is standard, well-established web-performance practice, cross-checked across multiple independent sources).

### 2. VitePress Version

**Recommendation: do NOT downgrade to 1.6.4. Pin the current `2.0.0-alpha.18` as an exact version (drop the `^`), and revisit at the next milestone.**

Verified facts (npm registry, 2026-07-25):
- `npm view vitepress dist-tags` → `{"latest": "1.6.4", "next": "2.0.0-alpha.18"}`. So yes, technically, "stable" per npm's own tagging is still 1.6.4, last published 2025-08-05 (roughly a year old as of this research date).
- The 2.0 alpha line has been running since January 2025 (`2.0.0-alpha.1`) through July 2026 (`2.0.0-alpha.18`) — 18 months in alpha with no numbered beta or release-candidate stage yet.
- GitHub Discussion #5072 ("Timeline for Stable v2 Release") has open community questions asking for a roadmap/checklist with **no maintainer response** as of 2026-07-19 — this is the closest thing to an official statement on timeline, and there isn't one.
- Alpha cadence has been slowing and becoming irregular (alpha.13→14→15 within days in Nov 2025, then a ~2-month gap to alpha.16, ~7-week gap to alpha.17, ~3.5-month gap to alpha.18) — consistent with either late-stage stabilization or reduced maintainer bandwidth; not conclusively either.
- Per community reports (GitHub issue #4945, cross-checked against a 2026 VitePress overview article), the official docs site now primarily documents the 2.0 alpha branch, leaving 1.6.4 relatively under-documented going forward.

Why this changes the PROJECT.md assumption ("move off alpha.18 to a stable release"): that requirement was written assuming a meaningfully more mature stable option exists to move to. It doesn't — 1.6.4 is a year-old release of a documentation line the project itself has been de-prioritizing in its docs, and this site's `config.js`/theme code is already written against 2.0's APIs. A downgrade would be real migration work (reverting APIs, re-verifying every plugin against 1.x peer ranges) in exchange for landing on a version that is arguably *less* actively supported going forward, not more. The actual instability risk in this codebase is not "VitePress itself might break" (it's been running fine on alpha.18) — it's the loose `^2.0.0-alpha.18` semver range in `package.json`, which permits any future alpha (potentially with breaking changes, since alpha releases carry no semver stability guarantee) to be installed silently on the next `npm install`.

**Concrete action for the roadmap:** change `"vitepress": "^2.0.0-alpha.18"` to `"vitepress": "2.0.0-alpha.18"` (exact pin, no caret) in `package.json`. Upgrade deliberately and test, rather than downgrade. Flag this as a deviation from the PROJECT.md wording, with rationale, for the roadmap author to confirm.

Confidence: MEDIUM — the version/dist-tag facts are HIGH confidence (direct npm registry query), but "should the project deviate from its own stated requirement" is a judgment call, presented here for the roadmap to weigh, not a fact.

### 3. Analytics / Consent

**Recommendation: replace Google Analytics with Cloudflare Web Analytics. This removes the consent-banner requirement rather than solving it.**

The PROJECT.md Active section frames this as "add cookie consent gating for Google Analytics." Research suggests a better move available at no extra cost: since the site is already on Cloudflare Pages, Cloudflare Web Analytics is a genuinely free, first-party option that is cookieless by design — it sets no cookies and stores no device-identifying data client-side, which means the ePrivacy Directive's cookie-consent trigger doesn't apply in the first place. That sidesteps building, testing, and maintaining a consent-banner UI entirely, for a metric (pageviews/referrers/countries) that's the only thing a personal portfolio site actually needs.

- Trade-off to be explicit about: Cloudflare Web Analytics' dashboard is materially thinner than GA's (no funnels, no custom events, no audience segmentation). For an 11-page CV-linked site where the only question that matters is "did anyone visit, and from where," this is not a real loss.
- Even a cookieless tool still processes some personal data (IP, user-agent) transiently under GDPR's broader definition — a privacy-policy disclosure is still good practice, but that's a one-paragraph static page, not a banner/consent-management system.
- Plausible and Umami are reasonable alternatives with similar cookieless properties, but both require either a paid SaaS subscription (Plausible) or self-hosting infrastructure (Umami) — neither is justified when Cloudflare Web Analytics is already sitting there, free, on the exact platform this site deploys to.
- Implementation is a single `<script>` tag (Cloudflare provides a beacon snippet keyed to the zone) or a dashboard-only toggle if using Cloudflare's automatic RUM injection for Pages — either way, no client-side consent-management library, no cookie, no banner component needs to be built.

**What to actually remove:** the unconditional GA script tag/gtag config currently injected in `docs/.vitepress/config.js` (`G-4PF046MSJJ`), replaced with the Cloudflare Web Analytics snippet (or dashboard toggle).

Confidence: MEDIUM — the cookieless/no-consent-required characterization of Cloudflare Web Analytics is corroborated across several independent sources (Cloudflare's own trust hub content plus third-party legal/privacy analyses), but this is not the same as formal legal sign-off; if the user wants certainty, a one-line privacy-policy disclosure closes the gap cheaply regardless of which tool is chosen.

### 4. Dependency Hygiene (`--legacy-peer-deps`)

**This was verified empirically against the actual repo, not inferred from general web search.** Running `npm install --package-lock-only --dry-run` against the real `package.json` surfaces exactly two ERESOLVE conflicts:

1. **`vite-plugin-pwa@1.2.0`** peer-depends on `vite@"^3.1.0 || ^4.0.0 || ^5.0.0 || ^6.0.0 || ^7.0.0"` — does not include `^8.0.0`, but the project's own `vite@^8.1.4` (and VitePress 2.0's bundled `@vitejs/plugin-vue@^6.0.7`, which also wants Vite 8) forces Vite 8 into the tree.
   - **Fix:** bump `vite-plugin-pwa` to `^1.3.0`. Verified via `npm view vite-plugin-pwa@latest peerDependencies` — 1.3.0's peer range explicitly adds `^8.0.0`. Confirmed via a clean dry-run install with this one version bump plus mermaid removed (below) that the tree resolves with zero flags.

2. **`vitepress-plugin-mermaid@2.0.17`** peer-depends on `vitepress@"^1.0.0 || ^1.0.0-alpha"` only — incompatible with the installed `vitepress@2.0.0-alpha.18`. This package was last published 2024-09-24 and has had no release since; there is no version of it that supports VitePress 2.x. This is the actual, irreducible reason `--legacy-peer-deps` exists in `deploy.sh` and CI — it cannot be fixed by bumping a version number, because no compatible version exists.
   - **Fix:** stop depending on this package. Only one surviving page (`docs/blog/vite-plugins.md`, confirmed via `grep`, kept post-pruning) uses Mermaid — 5 diagram blocks. Pre-render those 5 diagrams to static SVG once (via `@mermaid-js/mermaid-cli`, the `mmdc` CLI, run locally or as a one-off build step) and embed them as plain images. This removes both `vitepress-plugin-mermaid` and the `mermaid` runtime dependency (11.12.2, a large client-side rendering library) for the sake of 5 static diagrams in one blog post — proportionate for the actual usage.

All other VitePress plugin devDependencies in this project (`vitepress-plugin-tabs@^0.9.1`, `vitepress-plugin-group-icons@^1.7.5`, `vitepress-plugin-rss@^0.4.4`, `@nolebase/vitepress-plugin-enhanced-readabilities@^2.18.2`) were checked against their latest published peer ranges and are all compatible with `vitepress@2.0.0-alpha.18` — they are not contributing to the conflict and need no changes.

**Net result:** after (a) bumping `vite-plugin-pwa` to `^1.3.0` and (b) removing `vitepress-plugin-mermaid`/`mermaid` in favor of pre-rendered SVGs, `npm install` resolves cleanly with no `--legacy-peer-deps` flag anywhere — confirmed via dry-run. Remove the flag from `.github/workflows/*.yml` and `deploy.sh` once these two changes land.

Confidence: HIGH — this is direct, reproducible verification against the actual project files and the live npm registry, not a general claim from search results.

### 5. Proportionate Checks (Right-Sized Testing)

**Recommendation: build verification + link checking + Lighthouse CI in GitHub Actions. No Vue component unit-testing framework.**

For an 11-page static content site with no forms, no auth, no client-side business logic beyond chart rendering and a theme-toggle composable, the failure modes worth guarding against are:
- The build fails outright (caught for free — CI already runs `docs:build`)
- A page 404s after the prune (deleted AI Workflow/Photos/blog post leaves a dangling nav link, sidebar entry, or cross-link)
- A visual/performance regression slips in (unreadable contrast, a huge unoptimized image, a layout shift)

None of these need Vitest + Vue Test Utils rendering components in a jsdom environment — that tooling exists to catch component-logic bugs in interactive applications, and this site doesn't have that shape of risk. Over-testing here (writing unit tests for `EBar.vue` or the theme-toggle composable) is time spent on a check that will not catch the failures that actually occur on a content site, at the cost of ongoing maintenance for a solo-maintained personal project.

**Concrete right-sized layer:**
1. **Build verification** — already implicit (CI must run `vitepress build` before deploy); make it an explicit, separate CI step that fails the workflow on non-zero exit, not folded silently into the deploy script.
2. **Link checking** — `lycheeverse/lychee-action` (or `linkinator` if a pure-Node tool without a separate binary is preferred) run against `docs/.vitepress/dist` post-build, to catch exactly the dangling-link failure mode the prune work is likely to introduce.
3. **Lighthouse CI** (`treosh/lighthouse-ci-action` or `@lhci/cli` directly) run against the built `dist/` directory, checking performance/accessibility/SEO scores — this is also how you'd verify the font-loading change in Topic 1 actually improved (not regressed) load performance, and catch any `prefers-reduced-motion` / contrast issues from the design pass. Use it as a visibility/regression-flagging tool (fail on a large score drop), not as a strict numeric budget gate — PROJECT.md explicitly excludes bundle-size CI budgets, and an overly strict Lighthouse gate is the same anti-pattern in different clothing.

Confidence: LOW-MEDIUM (general industry practice for static sites, corroborated across multiple independent sources, but not specific to this exact codebase the way the dependency findings are).

## Sources

- `npm view vitepress dist-tags/versions/time --json` (npm registry, queried 2026-07-25) — HIGH confidence, direct registry query
- `npm install --package-lock-only --dry-run` against this repo's actual `package.json` (2026-07-25) — HIGH confidence, empirical
- `npm view vite-plugin-pwa@latest peerDependencies`, `npm view vitepress-plugin-mermaid versions/time/peerDependencies`, and equivalent checks for `vitepress-plugin-tabs`, `vitepress-plugin-group-icons`, `vitepress-plugin-rss`, `@nolebase/vitepress-plugin-enhanced-readabilities` (npm registry, 2026-07-25) — HIGH confidence
- Context7 `/vuejs/vitepress` — MEDIUM confidence (official repo docs, but Context7 index freshness not independently verified beyond the registry cross-check above)
- GitHub Discussion `vuejs/vitepress#5072` ("Timeline for Stable v2 Release") — MEDIUM confidence, fetched directly, shows no maintainer response as of query date
- GitHub Issue `vuejs/vitepress#4945` ("Missing VitePress documentation for stable version") — referenced via web search, LOW-MEDIUM confidence, not independently fetched in full
- Web search: self-hosting Google Fonts / font-display / preload best practice — LOW confidence per individual source, but consistent across multiple independent results (corewebvitals.io, phsieh.com, wuxwebtools.com, others)
- Web search: Inter/Source Sans typography for fintech/professional portfolios — LOW confidence, design-judgment sources (fontalternatives.com, thecrit.co, madegooddesigns.com)
- Web search: Cloudflare Web Analytics GDPR/cookie-consent status — LOW confidence per source, cross-checked across ethicaldatahub.com, iubenda.com, Cloudflare's own trust-hub GDPR FAQ, and Cloudflare Community discussion
- Web search: link-checking and Lighthouse CI tooling for static sites — LOW confidence per source (github.com/lycheeverse, github.com/JustinBeckwith/linkinator, github.com/GoogleChrome/lighthouse-ci, github.com/treosh/lighthouse-ci-action), but these are the tools' own repos, effectively primary sources

---
*Stack research for: qiankun.co.uk polish milestone*
*Researched: 2026-07-25*
