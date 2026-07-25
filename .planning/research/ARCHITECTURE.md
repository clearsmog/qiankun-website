# Architecture Research

**Domain:** VitePress 2.x + Vue 3 portfolio site — brownfield polish milestone
**Researched:** 2026-07-25
**Confidence:** HIGH (grounded in existing codebase + VitePress official docs; MEDIUM on Cloudflare Pages specifics, LOW-sourced web search claims cross-checked against Cloudflare's own docs page)

This is **not** greenfield ecosystem research. The system already exists and is documented at `.planning/codebase/ARCHITECTURE.md` — read that first. This file answers five specific questions raised in `PROJECT.md`'s Active requirements: token consolidation, theme override surface, observer consolidation, safe deletion, and deploy pipeline consolidation. No framework migration is considered anywhere below.

## Standard Architecture (unchanged — for reference only)

The existing five-layer static-site architecture (Content → Theme/Component → Visualization/Styling → Build/Vite → Static Output/Cloudflare) stays exactly as documented in `.planning/codebase/ARCHITECTURE.md`. This milestone modifies content **within** that architecture (delete pages, restyle, consolidate two sub-systems) — it does not change the shape of the system. Nothing in this document proposes new layers or components beyond what's needed to fix the five flagged problems.

## 1. Design Token Architecture (single source of truth for CSS + JS)

**The core tension:** `#0071e3` (Apple blue) lives in `custom.css:12` (`--vp-c-brand-1`), `echarts-setup.js:68` (fallback in `themeTokens()`), `config.js:48` (PWA manifest `theme_color`, a **build-time Node string**, no DOM available), and is implicitly duplicated again wherever a component hardcodes a color instead of using a CSS var. Two of these four consumers run in a browser (CSS cascade, ECharts canvas) where CSS custom properties are reactive and dark-mode-aware for free. One consumer (`config.js`) runs in Node at build time, before any DOM exists, so it categorically cannot read a CSS custom property — this is the reason the value got duplicated in the first place, not sloppiness.

**Recommendation: CSS custom properties stay canonical for anything that renders in a browser; a plain JS token module becomes canonical for anything that runs in Node.** Do not introduce a build-time CSS-generation pipeline (Style Dictionary, a custom Vite plugin that writes CSS from JS) — for roughly a dozen tokens on a single-maintainer personal site, that's tooling weight the project doesn't need. The right-sized fix is:

```
docs/.vitepress/theme/tokens.js         # NEW — single source for anything needing tokens outside the DOM
docs/.vitepress/theme/custom.css        # EXISTING — :root / .dark blocks stay the canonical browser-side source
docs/.vitepress/config.js               # imports tokens.js (Node context — no DOM at build time)
docs/.vitepress/theme/components/viz/echarts-setup.js  # imports tokens.js ONLY for cssVar() fallback values
```

`tokens.js` is a plain, framework-free ES module (importable from both Node-context `config.js` and the browser bundle) holding **only the values that must exist before/without a DOM**:

```js
// docs/.vitepress/theme/tokens.js
export const tokens = {
  color: {
    brandLight: '#0071e3',
    brandDark: '#2997ff',      // matches .dark override in custom.css
  },
}
```

Then:
- `custom.css` keeps `--vp-c-brand-1: #0071e3;` in `:root` and `#2997ff` in `.dark` — hand-authored, since CSS is what actually drives the cascade and dark-mode swap. Add a one-line comment (`/* keep in sync with theme/tokens.js */`) at each token definition — for ~2-4 values, a comment is proportionate; a generated-file pipeline is not.
- `config.js` replaces the literal `theme_color: "#0071e3"` with `theme_color: tokens.color.brandLight` (import `tokens` at the top of `config.js`).
- `echarts-setup.js`'s `themeTokens()` replaces its hardcoded fallback strings (`cssVar('--vp-c-brand-1', '#0071e3')`) with `cssVar('--vp-c-brand-1', tokens.color.brandLight)` — the **primary** value ECharts reads is still the live CSS var (correct, keeps dark-mode reactivity), only the *fallback-if-CSS-var-missing* literal is deduplicated.

This collapses the duplication from 3 independent literals to 2 places that must agree (`custom.css` and `tokens.js`), with the second constrained to only the handful of values Node genuinely needs pre-DOM. If the token surface grows materially (a full type + spacing scale, multiple brand colors) past what a comment can keep honest, revisit with a generation script at that point — not preemptively.

**Type scale and spacing:** apply the same split. Anything Vue/CSS renders (headings, body copy, card padding) should be CSS custom properties in `custom.css`'s `:root` (e.g. introduce `--font-size-h1: 2.5rem`, `--space-4: 1rem` alongside the existing `--vp-c-*` set) rather than hardcoded magic numbers scattered through component `<style scoped>` blocks (as `vp-doc h1`, `.VPHero .main .name`, etc. currently do with raw `clamp()`/`rem` literals). No JS ever needs the type scale or spacing values in this codebase today — so no `tokens.js` entry is needed for them; CSS custom properties alone are the single source of truth there.

**Confidence: HIGH.** Confirmed via VitePress official docs (Context7, `/vuejs/vitepress`) that `:root { --vp-c-brand-1: ... }` in `custom.css` is the documented, intended override mechanism, and via general web research that `getComputedStyle().getPropertyValue()` (already used in this codebase's `cssVar()`) is the standard bridge for CSS-as-source-of-truth-read-by-JS. The build-time/Node exception (`config.js`) is a fact about this codebase, not something requiring external verification.

## 2. VitePress Theme Override Surface

VitePress's documented, supported extension point is exactly what this codebase already does — import the default theme and layer a custom CSS file after it:

```js
// docs/.vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import './custom.css'
export default DefaultTheme
```

Overriding is done by **redefining `--vp-*` custom properties in `:root`**, not by writing net-new selectors that fight the default theme's own rules. `custom.css` already follows this for color (`--vp-c-brand-1`, `--vp-c-bg`, `--vp-c-text-1/2/3`, `--vp-c-divider`) — that part is correct and should be kept as-is.

**What's inconsistently applied today and should be tightened in the restyle phase:**

| Concern | Correct pattern | What this codebase does instead |
|---|---|---|
| Brand/text/background color | Override `--vp-c-*` vars | Already correct |
| Typography | Override `--vp-font-family-base` / `--vp-font-family-mono` | Not overridden — `custom.css:94` sets `font-family` directly on the `html` selector instead of setting the VitePress variable, so any default-theme component that references `var(--vp-font-family-base)` internally is out of sync with the rest of the page |
| Layout width | Override `--vp-layout-max-width` (1440px default), `--vp-sidebar-width` (272px default) | Not touched — fine to leave alone unless the restyle wants a narrower reading measure, in which case override the variable rather than adding `max-width` overrides to `.vp-doc` by hand |
| Component-specific visual overrides (hero padding, feature card radius, nav blur) | `!important`-qualified selector overrides targeting VitePress's own class names (`.VPHero`, `.VPFeature`, `.VPNav`) — this is VitePress's own documented pattern for anything not exposed as a variable | Already done this way and is correct; keep it |

**Concrete fix for typography:** add to `custom.css`'s `:root` block:
```css
--vp-font-family-base: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif;
```
and delete the duplicate `font-family` declaration on the bare `html` selector at line 94 (or keep both in sync deliberately — but the variable is what VitePress's own default-theme internals read, so setting only the bare selector is a partial fix that happens to look right at the page level while leaving some default-theme-internal elements unaffected).

**Layering rule for the restyle work:** every new rule this milestone adds to `custom.css` should target either (a) a `--vp-*`/custom variable in `:root`/`.dark`, or (b) a VitePress default-theme class name with the same specificity approach already used (class selector + `!important` where VitePress's own theme uses inline-specificity styles). Adding parallel, VitePress-unaware selectors (new custom classes wrapping `.vp-doc` content, for instance) is how theme-fighting starts — the type-scale work in this milestone should extend the existing `:root` variable set, not introduce a second parallel styling system.

**Confidence: HIGH** — direct from VitePress official docs via Context7 (`/vuejs/vitepress`, `extending-default-theme.md`, `vars.css` source).

## 3. Theme Reactivity Consolidation (Vue 3 composable)

**Finding: the MutationObserver in both `VizEChart.vue` and `EBar.vue` is unnecessary — `useData().isDark` already gives reactive dark-mode state, and importing it eliminates both observers entirely rather than merely consolidating them into a shared composable.**

VitePress's own `useData()` composable (importable from `'vitepress'` in any component under the theme, not just page-level components — it works via Vue's provide/inject and is available to any descendant, including globally-registered components like the ECharts wrappers) exposes `isDark` as a reactive ref that already tracks the same `<html class="dark">` toggle both observers are manually watching. There is no need to preserve a "shared composable that wraps MutationObserver" pattern — that would just be consolidating dead code into one place instead of deleting it.

**Current pattern (duplicated, to be removed):**
```js
// VizEChart.vue AND EBar.vue independently do this
let obs
onMounted(() => {
  obs = new MutationObserver(() => { tick.value++ /* or */ chartRef.value?.resize?.() })
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})
onBeforeUnmount(() => obs?.disconnect())
```

**Replacement pattern (per-component, no shared file needed):**
```js
// EBar.vue — replaces the tick/MutationObserver block entirely
import { useData } from 'vitepress'
const { isDark } = useData()

const option = computed(() => {
  void isDark.value // reference to establish the reactive dependency
  const t = themeTokens()
  // ...unchanged
})
```
```js
// VizEChart.vue — replaces the obs/MutationObserver block entirely
import { useData } from 'vitepress'
import { watch } from 'vue'
const { isDark } = useData()
watch(isDark, () => chartRef.value?.resize?.())
```

This is a **deletion**, not a new abstraction: no `useThemeReactive.js` composable file needs to exist, because there is nothing left to wrap once both components import `useData()` directly — a two-line `watch(isDark, …)` per consumer is simpler than a shared composable indirection for a one-liner. If a third or fourth chart component later needs the exact same `watch(isDark, () => chartRef.value?.resize?.())` idiom verbatim, *then* extract a `useChartThemeResize(chartRef)` composable in `docs/.vitepress/theme/composables/` — but don't build that abstraction speculatively for two call sites when the underlying VitePress primitive is already the shared thing.

**Why this is safe:** `isDark` from `useData()` is what VitePress's own dark-mode toggle button mutates — it is the source of truth the `<html class="dark">` mutation is derived *from*, not a parallel signal that might drift from it. Watching `isDark` directly is strictly more correct than watching the DOM class, because it reacts one tick earlier (before the DOM mutation is even applied) and works identically in SSR/hydration contexts where a MutationObserver has no DOM to observe yet.

**Confidence: HIGH** for the existence and behavior of `useData().isDark` (VitePress official docs, cross-checked against community usage in framework-integration docs — shadcn/vue, sigma-ui — which all use the same `useData()` + `isDark.value` idiom). MEDIUM on "no shared composable needed at all" being the *ideal* end-state judgment call — reasonable engineers could argue for extracting the two-line watch into a composable purely for naming/discoverability even at n=2; the recommendation above is the leaner option and matches this project's "don't add abstractions" convention (see `CONVENTIONS.md`, no barrel files, small focused functions).

## 4. Safe Content Deletion in VitePress

Deleting `docs/ai-workflow/*.md` (5 files), `docs/photos/index.md`, and `docs/blog/welcome.md` requires updates in lockstep across these surfaces. None of this needs research beyond VitePress's own generation model — the config surface is compile-time and small enough to reason about directly:

| Surface | File | What must change | Auto-handled? |
|---|---|---|---|
| Nav bar | `config.js:160-168` (`themeConfig.nav`) | Remove `{ text: "AI Workflow", link: "/ai-workflow/" }` and `{ text: "Photos", link: "/photos/" }` entries | No — manual edit required |
| Sidebar | `config.js:200-211` (`themeConfig.sidebar["/ai-workflow/"]`) | Delete the entire `"/ai-workflow/"` key/block. No `"/photos/"` sidebar key exists today (single page, no sidebar needed) | No — manual edit required |
| Sitemap (`sitemap.xml`) | Generated by VitePress's built-in `sitemap: { hostname }` option from whatever `.md` files exist under `docs/` at build time | Nothing to edit — once the `.md` files are deleted, they simply stop appearing in the next build's sitemap | **Yes — fully automatic**, contingent on the files actually being deleted (not just unlinked) |
| RSS feed (`feed.rss`) | `vitepress-plugin-rss`, driven by `docs/.vitepress/data/blog-posts.data.js`'s `createContentLoader` over `blog/*.md` | Nothing to edit — deleting `docs/blog/welcome.md` removes it from the next build's feed automatically; the RSS plugin's `filter` (`config.js:25`) already scopes to `/blog/` only, unaffected by the AI Workflow/Photos deletions | **Yes — fully automatic** |
| PWA precache manifest | `vite-plugin-pwa`'s Workbox `globPatterns` (`config.js:60-62`) globs the **build output** (`**/*.{js,css,html,...}`) at build time | Nothing to edit — the glob re-runs against whatever `dist/` actually contains after the pages are deleted; `registerType: "autoUpdate"` (`config.js:42`) already means returning visitors get the new precache manifest pushed without user action | **Yes — fully automatic**, but note: visitors with an *already-installed* PWA from before this deploy will have the old `ai-workflow/*` and `photos/*` routes precached until the service worker's next `autoUpdate` cycle fires (typically on next page load) — not a blocker, just expect a short tail |
| Internal links | Any `<a href="/ai-workflow/...">` or `<a href="/photos/">` inside `.md` content or `.vue` components | Must grep and fix manually — VitePress does not validate internal links at build time by default (no automatic dead-link check) | No — manual audit required, see command below |
| External/indexed URLs (Google, anyone with the URL bookmarked/on a CV-adjacent page) | N/A — these are outside the repo | Add redirects (below) | No — requires the `_redirects` step |

**Link audit command** (run before deleting, to build the list of files needing edits):
```bash
grep -rn "ai-workflow\|/photos/" docs/ --include="*.md" --include="*.vue" --exclude-dir=".vitepress/cache"
```

**Redirects for already-indexed URLs (Cloudflare Pages `_redirects`):**

The site is live and Google-indexed, so `/ai-workflow/`, `/ai-workflow/concepts`, `/ai-workflow/patterns`, `/ai-workflow/agents`, `/ai-workflow/tools`, `/photos/`, and `/blog/welcome` will all 404 the moment the pages are deleted and redeployed, for anyone arriving via a stale search result, bookmark, or cached link. Cloudflare Pages reads a `_redirects` file (Netlify-style syntax, one rule per line: `/source /destination status-code`) from the **build output root** — for a VitePress site, that means placing it in `docs/public/_redirects`, since everything in `docs/public/` is copied verbatim into `docs/.vitepress/dist/` by VitePress's own static-asset handling; it does not need any special build-script wiring beyond `npm run docs:build` already running.

```
# docs/public/_redirects
/ai-workflow/*   /projects/   301
/photos/         /            301
/blog/welcome    /blog/       301
```
(`/ai-workflow/*` with the trailing splat catches all five deleted sub-pages in one rule; redirecting to `/projects/` rather than `/` is more useful to a visitor who followed an old AI Workflow search result, since it's the closest live equivalent of "substantive work.") Cloudflare's own docs (verified directly) note the file supports up to 2,000 static + 100 dynamic redirect rules and that rule order matters when paths could match more than one line — irrelevant at this scale (7 rules) but worth knowing if more get added later.

**Confidence: MEDIUM-HIGH.** The VitePress-internal mechanics (sitemap/RSS/PWA auto-regeneration from file presence) are derived directly from reading this codebase's actual config (HIGH — not external claims). The Cloudflare `_redirects` placement-in-`public/`-for-VitePress detail and the 2,000-rule limit are corroborated by both a community VitePress discussion and Cloudflare's own docs page, but should be spot-checked against Cloudflare's live docs at implementation time since redirect-file behavior has changed between Cloudflare product iterations.

## 5. Single Deployment Pipeline

Two independent, non-communicating deploy paths exist today:

1. **Cloudflare Pages via GitHub Actions** (`.github/workflows/deploy.yml`) — triggers on push to `main`, runs `npm ci --legacy-peer-deps` → `npm run docs:build` → `npx wrangler pages deploy docs/.vitepress/dist --project-name=qiankun-website`. This is the pipeline actually serving `qiankun.co.uk` per `PROJECT.md`.
2. **AWS Amplify** (`amplify.yml` + `deploy.sh`) — Amplify's own build hook (triggered by Amplify's GitHub integration on the same `main` branch push, independent of the GitHub Actions workflow) runs `npm ci --legacy-peer-deps` → `npm run docs:build`, and `deploy.sh` is a manual convenience script (commit, push, then poll `aws amplify list-jobs` for status) that assumes Amplify is the live target.

Both pipelines build from the same push event, both produce the same static `docs/.vitepress/dist/` artifact, and both currently likely succeed — meaning there are, right now, two separately-billed, separately-configured copies of this site being built and deployed on every commit, with only one (Cloudflare) actually pointed at the custom domain. This is pure waste and a source of confusion (which build log do you check when something's wrong?), not a redundancy that protects anything.

**Decommissioning Amplify — order of operations:**
1. In the AWS Amplify console, disconnect/delete the Amplify app (or at minimum disable auto-build on push) — this stops the GitHub webhook Amplify registered independently of the GitHub Actions workflow. Do this *before* deleting the config files, so there's a window to confirm Cloudflare is serving correctly without Amplify's build acting as an accidental safety net.
2. Delete `amplify.yml` from the repo root.
3. Delete `deploy.sh` — it is Amplify-specific (its `check_amplify_status()` function shells out to `aws amplify list-apps`/`list-jobs`; nothing in it is Cloudflare-aware) and superseded entirely by "push to `main`" already triggering the GitHub Actions → Cloudflare path with zero manual steps. There is no equivalent manual script to write for Cloudflare — that's the point of the GitHub Actions pipeline already in place.
4. Remove any Amplify-specific env vars/secrets from AWS if the account is otherwise unused, and remove the Amplify app from the AWS console to stop any residual billing (Amplify Hosting bills per build-minute and per-GB served; an app with no active domain still consumes build minutes on every push).
5. Confirm `README.md` (if it documents a deploy process) references only the Cloudflare/GitHub Actions path.

**What a correct, minimal Cloudflare Pages + GitHub Actions setup for VitePress looks like (2026):** the existing `.github/workflows/deploy.yml` already matches current best practice almost exactly — `wrangler pages deploy` from a GitHub Actions job is Cloudflare's own documented recommended path for git-connected-via-CI deployments (as opposed to Cloudflare's *native* git integration, which is the alternative but mutually-exclusive approach: connecting the Cloudflare Pages project directly to the GitHub repo in the Cloudflare dashboard, letting Cloudflare build and deploy without any Actions workflow at all). **Do not add a third path** — since `deploy.yml` already exists and works, keep the GitHub-Actions-driven `wrangler pages deploy` approach rather than also connecting the repo natively in the Cloudflare dashboard (which would recreate the exact "two independent pipelines" problem this milestone is fixing, just with Cloudflare on both sides instead of Cloudflare + Amplify).

Minor cleanup worth doing in the same pass since it's touched anyway: the `--legacy-peer-deps` flag in both `deploy.yml` (line 21) and the now-deleted `amplify.yml` is flagged separately in `PROJECT.md`'s Active requirements ("Resolve the `--legacy-peer-deps` dependency conflicts rather than suppressing them") — that's dependency-resolution work, not a pipeline-architecture change, and belongs in whichever phase handles the VitePress alpha→stable upgrade, not this deployment-consolidation phase. Don't conflate the two.

**Confidence: HIGH** on the decommissioning sequence (derived directly from reading `amplify.yml`/`deploy.sh`/`deploy.yml` in this repo — no external claim needed). **MEDIUM** on "wrangler-via-Actions is Cloudflare's current recommended pattern vs. native git integration" — this is a reasonably stable fact about Cloudflare Pages' two supported deploy models, but Cloudflare's product surface changes; worth a quick doc check at implementation time rather than treating as frozen.

## Recommended Project Structure (delta only — additions this milestone introduces)

```
docs/.vitepress/
├── theme/
│   ├── tokens.js                 # NEW — Node-context design tokens (see §1)
│   ├── custom.css                # MODIFIED — add --vp-font-family-base override, type-scale/spacing vars, sync-with-tokens.js comments
│   ├── index.js                  # MODIFIED — remove Svg* component registrations (dead code deletion, separate requirement)
│   └── components/viz/
│       ├── echarts-setup.js      # MODIFIED — import tokens.js for fallback literals only
│       ├── VizEChart.vue         # MODIFIED — replace MutationObserver with useData().isDark (see §3)
│       ├── EBar.vue              # MODIFIED — same
│       └── Svg*.vue              # DELETED — six legacy components (separate requirement, unrelated to tokens/theme work)
├── config.js                     # MODIFIED — import tokens.js for PWA theme_color; remove nav/sidebar entries for deleted sections (see §4)
docs/
├── public/
│   └── _redirects                # NEW — Cloudflare Pages redirect rules (see §4)
├── ai-workflow/                  # DELETED (5 files)
├── photos/                       # DELETED (1 file)
└── blog/welcome.md                # DELETED (1 file)
amplify.yml                        # DELETED (see §5)
deploy.sh                          # DELETED (see §5)
```

No new top-level directories, no new abstraction layers, no state-management library, no build-step tooling addition (no Style Dictionary, no PostCSS plugin) — every change above is a modification to an existing file or a straightforward file deletion. This matches the milestone's "polish, don't rearchitect" framing.

## Architectural Patterns

### Pattern 1: CSS-canonical / JS-mirrors-only-what-Node-needs (token split)

**What:** CSS custom properties remain the single source of truth for anything rendered in a browser (color, type, spacing); a small plain-JS module holds only the subset of values needed in Node build context (currently: one brand color for the PWA manifest).
**When to use:** Static-site generators (VitePress, Astro, Eleventy) where the config file executes in Node before any DOM exists, but the bulk of styling is CSS-variable-driven and dark-mode-reactive.
**Trade-off:** Two files must agree on the shared subset, mitigated by keeping that subset tiny and commented. The alternative (a build-time CSS-from-JS generator) removes that human-sync burden entirely but adds a build step and a dependency for a project with roughly a dozen tokens — disproportionate here.

### Pattern 2: Prefer the framework's own reactive primitive over a manual DOM observer

**What:** `useData().isDark` (VitePress) already is the reactive signal a MutationObserver was reconstructing by watching its side effect (the `<html class="dark">` mutation). Consuming the primitive directly is simpler, one tick faster, and SSR-safe.
**When to use:** Any time framework/library code already exposes a reactive value for state a component is currently deriving by observing the DOM.
**Trade-off:** None significant here — this is a strict improvement, not a trade-off. Watch for cases (rare) where third-party code outside VitePress's reactivity graph mutates the class directly; `useData().isDark` would miss that, a MutationObserver wouldn't. Not applicable in this codebase — only VitePress's own toggle mutates the class.

### Pattern 3: Delete before you redirect, redirect before you deploy

**What:** For a live, indexed site, the safe sequence is: (1) audit and fix all *internal* links to the pages being removed, (2) add the `_redirects` file covering the URLs being removed, (3) delete the content files, (4) deploy — all in one PR/commit so there's never a deployed state where old URLs 404 without a redirect in place.
**When to use:** Any content deletion on a site that's live, indexed by search engines, or linked from external materials (a CV, in this case).
**Trade-off:** None — doing steps out of order (e.g., deleting first, redirecting later) just means a window of live 404s for anyone hitting a stale link, which is exactly the failure mode this milestone's requirement calls out.

## Anti-Patterns

### Anti-Pattern 1: Reaching for a token-generation build pipeline at small scale

**What people do:** Introduce Style Dictionary, a custom Vite plugin, or a CSS-in-JS abstraction to "properly" solve design-token duplication the moment it's noticed.
**Why it's wrong:** For ~4 duplicated values on a single-maintainer site, the tooling and mental overhead of a token pipeline exceeds the cost of the duplication it fixes. It also introduces a new build step that can itself fail, on a site whose current build is already fragile (`--legacy-peer-deps`, alpha VitePress).
**Instead:** The CSS-canonical + tiny-JS-mirror split in §1. Revisit only if the token surface grows an order of magnitude.

### Anti-Pattern 2: Extracting a composable for a single reused two-line `watch()`

**What people do:** See the same small reactive pattern in two components and immediately extract `useThemeReactiveChart.js` or similar, even when the underlying framework primitive (`useData().isDark`) is already the shared thing both components need.
**Why it's wrong:** Adds an indirection layer and a file to navigate for something that's already trivial and already shares its actual source of truth (VitePress's `isDark`). This project's own conventions (no barrel files, small focused functions, "prefer the simplest solution" per its coding conventions) argue against it.
**Instead:** Import `useData()` directly in each of the two components. Extract only if a third distinct chart component needs the exact same multi-line idiom later.

### Anti-Pattern 3: Deleting content before wiring redirects, on a live indexed site

**What people do:** Delete the markdown files and nav/sidebar entries first, deploy, and treat "add redirects" as a follow-up task.
**Why it's wrong:** Creates a real window (from deploy to the follow-up) where Google-indexed URLs and any link on Qiankun's CV-adjacent materials 404 with no redirect — directly undermining the milestone's own stated goal ("finds nothing that undermines" the hiring manager's impression). A 404 from a stale link is exactly the kind of thing that undermines it.
**Instead:** `_redirects` file lands in the same commit/PR as the deletions (Pattern 3 above).

### Anti-Pattern 4: Running two deploy pipelines "just in case"

**What people do:** Keep a secondary deploy path (here, Amplify) around after migrating to a new one, reasoning it's a free fallback.
**Why it's wrong:** It isn't free — it's billed build-minutes on every push, a second place configuration can silently drift (env vars, Node version, build command), and a second place someone might look at stale/misleading build status. It provides no actual redundancy since only one target (Cloudflare) is bound to the live domain.
**Instead:** One pipeline, matching the live domain binding. If disaster recovery is a real concern, that's solved by the fact the source is in git and `wrangler pages deploy` can be re-run from any machine — not by a permanently-running parallel CI system.

## Suggested Build Order (dependencies for the roadmapper)

This is the section the roadmap most directly consumes. Ordered by hard dependency, not by priority:

1. **Deploy pipeline consolidation (§5) — do this first, independent of everything else.** Zero dependency on any other work in this milestone; touches only `amplify.yml`, `deploy.sh`, and AWS console state. Doing it early removes a distraction (two build logs to check) for every subsequent phase's deploys, and it's the lowest-risk change in the whole milestone (deleting unused files + disconnecting an unused AWS integration — the live Cloudflare path is untouched).

2. **Content deletion + redirects (§4) — do this before the visual/typographic restyle (not after).** Reasoning: restyling `custom.css` touches selectors that may apply to `ai-workflow`/`photos` page layouts too (e.g., `.vp-doc h2`, `.VPSidebar` rules) — restyling dead pages that are about to be deleted is wasted verification effort, and the sidebar/nav config that the restyle phase will also be touching visually (`.VPSidebarItem`, `.VPNavBarMenuLink` styling) should be edited once against the *final* nav/sidebar shape, not once now and again after deletion. Order within this phase: link audit → `_redirects` file → delete nav/sidebar entries → delete content files → verify build → deploy, all as one unit (Pattern 3).

3. **Design token consolidation (§1) — must land before the typographic/visual restyle (Design requirements in PROJECT.md), not concurrently with it.** The restyle work ("establish a considered typographic system," "consistent spacing, layout, and visual hierarchy across all remaining pages") is exactly the work that will touch `custom.css`'s `:root` block extensively. Doing the token consolidation first means the restyle phase edits a clean, deduplicated variable set once, rather than the restyle phase both introducing new type-scale variables *and* fighting with three pre-existing duplicated brand-color literals at the same time. Sequencing them the other way (restyle first, tokens after) means re-touching every color-related rule the restyle phase just wrote.

4. **Theme override surface work — typography variable fix, layering rules (§2) — is the restyle phase itself, gated on #3.** This is where `--vp-font-family-base` gets set, the type scale gets defined as CSS variables, and every remaining page gets the consistent spacing/hierarchy pass. Depends on tokens (#3) being in place so brand-color references in new rules use the deduplicated variables, not fresh literals.

5. **Theme reactivity consolidation (§3) — independent of 1-4, can run in parallel with any of them, but must land before/alongside chart restyling if charts are touched in the visual pass.** The `useData().isDark` swap in `VizEChart.vue`/`EBar.vue` is a pure refactor with no visual output change (charts already respond to dark mode correctly today — this fixes *how*, not *whether*). It has zero dependency on tokens, deletions, or deploy consolidation. The only reason to sequence it near the restyle phase rather than fully standalone is convenience — if the restyle phase is already editing `echarts-setup.js`'s color tokens (per §1), doing the observer removal in the same PR avoids touching the visualization layer twice. Recommend bundling it with #3/#4 for that reason, but it is not a hard dependency either direction.

**Summary dependency graph:**
```
Deploy consolidation (§5) ─── no dependencies, do anytime, do first (low risk, unblocks nothing but blocks nothing)

Content deletion + redirects (§4) ──► Design tokens (§1) ──► Restyle / theme override surface (§2)
                                                                      │
                                              Reactivity consolidation (§3) ──(bundle for convenience, not required)
```

Dead-code removal (Svg* components, six files) and the `--legacy-peer-deps`/VitePress-alpha-upgrade work mentioned in `PROJECT.md` are **not** covered by this architecture research (they're dependency/build-tooling concerns, not architecture) — flag those for a separate STACK.md-level research pass if the roadmap wants dedicated phase research there.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Cloudflare Pages | `wrangler pages deploy` from GitHub Actions (`deploy.yml`) | Keep this pattern; do not also connect the repo natively in the Cloudflare dashboard (would recreate the dual-pipeline problem) |
| AWS Amplify | Currently a second, redundant build trigger on the same `main` push | Decommission per §5 — disconnect in AWS console before deleting `amplify.yml`/`deploy.sh` |
| Google Fonts (Inter) | `@import url(...)` in `custom.css:7` | Unaffected by this milestone's token work; if the typographic system phase reconsiders the typeface, this is the line to change alongside the new `--vp-font-family-base` variable |
| Google Analytics | Inline `<script>` tags in `config.js:130-142` | Out of scope for this architecture doc (covered by PROJECT.md's GDPR/cookie-consent requirement, a separate concern) |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `config.js` (Node/build) ↔ `theme/tokens.js` | Direct ES import | New boundary this milestone introduces (§1) |
| `custom.css` (browser/CSS cascade) ↔ `echarts-setup.js` (browser/JS) | `getComputedStyle()` via existing `cssVar()` helper | Existing, correct pattern — preserved, only fallback literals change source |
| `VizEChart.vue`/`EBar.vue` ↔ VitePress core | `useData()` composable (new) replacing `MutationObserver` (removed) | §3 |
| `docs/public/_redirects` ↔ Cloudflare Pages edge | Static file, read at request time by Cloudflare's routing layer, not by VitePress/Vite at all | New boundary this milestone introduces (§4) |

## Sources

- VitePress official documentation, `extending-default-theme.md` and `vars.css` — via Context7 `/vuejs/vitepress` (HIGH confidence, official source)
- VitePress `useData()` / `isDark` composable behavior — cross-checked across VitePress docs, shadcn/vue and sigma-ui dark-mode integration guides (MEDIUM-HIGH confidence, consistent across independent sources)
- Cloudflare Pages `_redirects` syntax and limits — developers.cloudflare.com/pages/configuration/redirects/ (MEDIUM confidence — verify against live docs at implementation time, product surface changes)
- VitePress + Cloudflare Pages `public/_redirects` placement convention — community discussion, cross-referenced against how this codebase's own `docs/public/` assets already get copied to `dist/` (MEDIUM confidence on the community claim, HIGH confidence on the VitePress static-copy mechanism itself, which is standard and verifiable in this repo's existing `public/logo.svg` etc.)
- CSS custom properties as design-token source of truth, read via `getComputedStyle` — general web research, corroborated by this codebase's own pre-existing `cssVar()` implementation already following the pattern (LOW-sourced web claims, but the pattern itself is already proven working in this codebase)
- Direct reading of this repository: `docs/.vitepress/config.js`, `docs/.vitepress/theme/custom.css`, `docs/.vitepress/theme/components/viz/echarts-setup.js`, `VizEChart.vue`, `EBar.vue`, `amplify.yml`, `deploy.sh`, `.github/workflows/deploy.yml`, `.planning/codebase/ARCHITECTURE.md`, `.planning/codebase/STRUCTURE.md`, `.planning/codebase/CONVENTIONS.md`, `.planning/PROJECT.md` (HIGH confidence — primary source)

---
*Architecture research for: VitePress portfolio polish milestone*
*Researched: 2026-07-25*
