# Phase 1: Technical Foundations - Research

**Researched:** 2026-07-25
**Domain:** VitePress 2.x dependency resolution, Cloudflare Pages / AWS Amplify deploy-pipeline decommissioning, Cloudflare Web Analytics enablement
**Confidence:** HIGH (dependency resolution and VitePress config shape are empirically verified against this repo and the live npm registry; dashboard click-paths are CITED from official docs; the footer/sidebar interaction is verified by reading VitePress's own shipped component source)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Dependency Resolution**
- VitePress is pinned to exactly `2.0.0-alpha.18` — no caret, no range. Do not downgrade to 1.6.4. User signed off 2026-07-25; downgrading would mean auditing every component and plugin for v2-only APIs, which is migration work that does not belong in a polish milestone.
- `vite-plugin-pwa` bumps to `^1.3.0` — its peer range then includes Vite 8, clearing one of the two conflicts.
- `vitepress-plugin-mermaid` and the `mermaid` runtime dependency are removed entirely — package is dead upstream (last publish Sept 2024), no VitePress 2.x-compatible version exists. This clears the second conflict.
- `--legacy-peer-deps` is removed from `.github/workflows/deploy.yml:21` and from `amplify.yml:6` (the latter dies with the file). No `.npmrc` exists, so nothing to clean there.
- `package-lock.json` must be regenerated from a clean `node_modules` after these changes, and `npm ci` (no flag) must succeed on that lockfile before anything is committed.

**Deploy Pipeline Consolidation**
- Cloudflare is confirmed as the live serving path by direct `dig` on 2026-07-25: `qiankun.co.uk` → `104.21.0.223` / `172.67.128.87`, `www` → same pair. Both are Cloudflare ranges; no Amplify endpoint in the record. INFRA-01 is satisfied by this observation and must be written into the plan/summary as the documented finding.
- No AWS CLI is configured on this machine, so Amplify state cannot be inspected or changed from here. The Amplify disable is an explicit user-action checkpoint — execution stops, the user confirms in the AWS console that auto-build on `main` is disabled and the site is still serving, and only then are `amplify.yml` and `deploy.sh` deleted from the repo.
- Ordering is non-negotiable: verify DNS → user disables Amplify auto-deploy → observe site stable → delete `amplify.yml` and `deploy.sh`. Deleting the repo files first would remove the emergency fallback path.
- `package.json` `deploy` and `deploy:quick` scripts both invoke `./deploy.sh` and must be removed in the same commit as `deploy.sh`, or they become broken entry points.

**Analytics and Privacy**
- Google Analytics (`G-4PF046MSJJ`) is removed from `docs/.vitepress/config.js` — both the `googletagmanager` script tag (line ~135) and the inline `gtag` bootstrap (line ~141).
- Cloudflare Web Analytics is enabled via dashboard auto-injection on the Pages project, not a manual beacon snippet. Zero repo change for the beacon; Cloudflare injects it. This is a user-action checkpoint (one dashboard toggle) paired with the GA removal.
- Privacy disclosure is a footer line linking to a short `/privacy` page. The footer line appears site-wide; the page states plainly that the site uses cookieless Cloudflare Web Analytics, collects no personal data, and sets no cookies.

### Claude's Discretion
- Exact wording of the privacy page and footer line.
- Whether `robots.txt` / sitemap need any adjustment for the new `/privacy` page.
- Commit granularity within each work item, provided the deploy-pipeline ordering above is respected.

### Deferred Ideas (OUT OF SCOPE)
- Adding a test suite — the codebase has no test coverage of any kind. Real gap, but out of scope for this milestone.
- Deleting `docs/blog/vite-plugins.md` — belongs to PRUNE-04 in Phase 2.
- Removing the six unused `Svg*` chart components — PRUNE-09, Phase 2.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| INFRA-01 | DNS verified by direct inspection before any deploy change | Already satisfied per CONTEXT.md — `dig` was run 2026-07-25. Nothing further to research; plan should cite the recorded IPs and note it as a completed fact, not a task to redo. |
| INFRA-02 | Amplify auto-deploy disabled in console, observed stable, before repo files deleted | Precise console click-path verified below (`## Amplify Decommission — Verified Click-Path`). Ordering pitfalls (Pitfall 10 in prior PITFALLS.md research) apply directly. |
| INFRA-03 | Cloudflare Pages via GitHub Actions is the only path that can deploy | Satisfied once INFRA-02's steps complete and `amplify.yml`/`deploy.sh`/`package.json` scripts are deleted — no separate action needed beyond that deletion, see `## Ordering and Safety`. |
| INFRA-04 | `npm install` resolves clean, no `--legacy-peer-deps` anywhere in CI/scripts/docs | Empirically verified below via real `npm install --dry-run` against the exact post-fix dependency set — zero ERESOLVE conflicts, exit code 0. Also found: `README.md` documents the Amplify deploy path and lists `vitepress-plugin-mermaid` as an active plugin — must be updated even though it doesn't contain the literal string `--legacy-peer-deps`, to satisfy "documentation" completely and avoid stale instructions. |
| INFRA-05 | `vite-plugin-pwa` bumped to `^1.3.0` | Verified via `npm view` — 1.3.0's peer range adds `vite@^8.0.0`. Confirmed no other breaking peer changes between 1.2.0 and 1.3.0's peer surface. |
| INFRA-06 | `vitepress-plugin-mermaid` and `mermaid` removed entirely | Confirmed the only two removal sites: `package.json` (both deps) and `docs/.vitepress/config.js` (import line 4, `withMermaid(...)` wrapper at line 29, `mermaid: {}` block at lines 87-90). Config unwrap shape verified against installed VitePress 2.0.0-alpha.18 types and Context7 docs below. |
| INFRA-07 | VitePress pinned to exactly `2.0.0-alpha.18`, no caret | Trivial `package.json` edit (`"vitepress": "^2.0.0-alpha.18"` → `"vitepress": "2.0.0-alpha.18"`); confirmed this doesn't change what's already installed (`node_modules/vitepress/package.json` already reports `2.0.0-alpha.18`). |
| INFRA-08 | Site builds successfully from a clean checkout after all dependency changes | The unwrapped `defineConfig({...})` shape is VitePress's own documented default export shape (Context7-verified) — no structural reason the build should fail from the mermaid removal alone. Full local build (`npm ci && npm run docs:build`) is still the required verification gate before commit (mandated by CONTEXT.md), not something research can substitute for. |
| INFRA-09 | GA removed, Cloudflare Web Analytics active in its place | Dashboard click-path verified below (`## Cloudflare Web Analytics — Verified Click-Path`), plus the proxy-requirement caveat that determines whether auto-injection will actually work on this domain. |
| INFRA-10 | Short privacy note discloses what analytics is collected | Content requirement, Claude's discretion on wording per CONTEXT.md. Placement mechanism (footer link) has a real gotcha documented below — see `## Critical Finding: Footer Hides Itself on Sidebar Pages`. |
</phase_requirements>

## Summary

This phase is almost entirely execution-of-already-researched decisions (STACK.md, ARCHITECTURE.md, PITFALLS.md already cover the "what" and "why"). What this research adds is empirical confirmation that the planned fix actually works end-to-end, plus two findings that change how the plan should be written: (1) the dependency fix has been re-verified with a live `npm install --dry-run` against the exact three-change set — it resolves with **zero** ERESOLVE conflicts and no third conflict was found; (2) VitePress's own default-theme `VPFooter` component sets `display: none` on itself via CSS whenever the page has a sidebar — meaning the standard `themeConfig.footer` approach the CONTEXT.md decision assumes will **silently fail to show the privacy link on every `/projects/*` page**, which is most of this site's content. The plan must route around this, not just wire up `themeConfig.footer`.

**Primary recommendation:** Execute in the order Deploy Pipeline Consolidation → Dependency/Config Fixes → Analytics/Privacy, verifying a local build before every commit that touches shared files, and inject the privacy footer link via a `layout-bottom` slot override (already have a `Layout()` override in `theme/index.js`) rather than relying solely on `themeConfig.footer`, since the latter is invisible on every sidebar-bearing page.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Deploy pipeline (which system pushes `dist/` live) | Build/Deploy (GitHub Actions + Cloudflare Pages) | AWS Amplify (being decommissioned) | Static site — no server tier; deploy tier owns "what serves the domain" |
| Dependency resolution (`npm install`) | Build/Deploy (CI + local dev) | — | Purely a build-time concern; no runtime component |
| VitePress config shape (`defineConfig`, plugin wiring) | Build/Deploy (Node, executes at `vitepress build` time) | — | `config.js` runs in Node before any DOM exists |
| Analytics beacon injection | CDN/Edge (Cloudflare Pages auto-injection) | Browser/Client (the injected script itself runs client-side) | Cloudflare injects the script at the edge on response; execution is client-side |
| Privacy disclosure page + footer link | Browser/Client (VitePress-rendered static page + Vue footer component) | — | Pure content/presentation, no backend |

## Standard Stack

### Core (no new packages — version changes to existing dependencies only)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `vitepress` | `2.0.0-alpha.18` (exact pin) | Static site generator | Already installed; CONTEXT.md locks this — pin removes the caret risk of a silent future-alpha install |
| `vite-plugin-pwa` | `^1.3.0` (bump from `^1.2.0`) | PWA/service worker | [VERIFIED: npm registry] `npm view vite-plugin-pwa@1.3.0 peerDependencies` confirms `vite: "^3.1.0 \|\| ^4.0.0 \|\| ^5.0.0 \|\| ^6.0.0 \|\| ^7.0.0 \|\| ^8.0.0"` — this is the version that fixes the Vite 8 peer conflict |

### Removed this phase
| Library | Reason |
|---------|--------|
| `vitepress-plugin-mermaid` | [VERIFIED: npm registry] Peer range `^1.0.0 \|\| ^1.0.0-alpha` only; last published 2024-09-24; no version supports VitePress 2.x. This is the actual, structural reason `--legacy-peer-deps` exists today. |
| `mermaid` (runtime dep, `^11.12.2`) | Only consumer was `vitepress-plugin-mermaid`'s markdown-it integration; removing the plugin removes the need for the runtime library |

### Package Legitimacy Audit

No new package names are introduced in this phase — `vite-plugin-pwa` is an existing dependency receiving a version bump, and the two removed packages are deletions, not additions. Ran the legitimacy check anyway for due diligence on the version being bumped to:

| Package | Registry | Age | Downloads | Source Repo | Verdict | Disposition |
|---------|----------|-----|-----------|-------------|---------|-------------|
| `vite-plugin-pwa@1.3.0` | npm | Established package (`vite-pwa` org, multi-year history) | High (widely used in Vite ecosystem) | github.com/vite-pwa/vite-plugin-pwa | Not a new install — existing dependency, version bump only | No audit gate required |

**Packages removed due to [SLOP] verdict:** none — the removed packages (`vitepress-plugin-mermaid`, `mermaid`) are legitimate, actively-indexed npm packages; they are being removed for compatibility/maintenance reasons (dead upstream, no v2 support), not because they're illegitimate.
**Packages flagged as suspicious [SUS]:** none.

## Verified Dependency Resolution (empirical, this repo)

Ran the exact post-fix dependency set through npm's real resolver — not a theoretical check.

**Test package.json** (only the three CONTEXT.md-mandated changes applied to the real `devDependencies`/`dependencies`):
```json
{
  "devDependencies": {
    "vite-plugin-pwa": "^1.3.0",
    "vitepress": "2.0.0-alpha.18"
    /* vitepress-plugin-mermaid and mermaid removed */
  }
}
```

**Command and result:**
```bash
$ npm install --dry-run
add @iconify/types 2.0.0
add vue-echarts 8.0.1
add vue 3.5.40
add vitepress-plugin-tabs 0.9.1
add vitepress-plugin-rss 0.4.4
add vitepress-plugin-group-icons 1.7.5
add vite-plugin-pwa 1.3.0
add vite-plugin-imagemin 0.6.1
add vite 8.1.5
add unplugin-icons 23.0.1
add echarts 6.1.0
add chart.js 4.5.1
add vitepress 2.0.0-alpha.18
add @nolebase/vitepress-plugin-enhanced-readabilities 2.18.2
add @iconify/json 2.2.505

added 885 packages in 4s
```
**Exit code: 0. Zero ERESOLVE warnings, zero peer-dependency conflicts.** [VERIFIED: npm registry — direct `npm install --dry-run` execution, 2026-07-25]

**No third conflict found.** Checked every remaining VitePress-adjacent devDependency's peer range against `vitepress@2.0.0-alpha.18` directly:

| Package | Peer range on `vitepress` | Satisfied by `2.0.0-alpha.18`? |
|---------|---------------------------|-------------------------------|
| `@nolebase/vitepress-plugin-enhanced-readabilities@2.18.2` | `^1.5.0 \|\| ^2.0.0-alpha.1` | Yes |
| `vitepress-plugin-tabs@0.9.1` | `^1.0.0 \|\| ^2.0.0-alpha.17` | Yes (alpha.18 ≥ alpha.17 in the same prerelease line) |
| `vitepress-plugin-group-icons@1.7.5` | `>=3` (on `vite`, not `vitepress`) | Yes — n/a to vitepress version |
| `vitepress-plugin-rss@0.4.4` | `^1.0.0-0 \|\| ^2.0.0-0` | Yes |

One incidental note: `npm install --dry-run` (not `--package-lock-only`) resolved `vite` to `8.1.5` (a patch above the `^8.1.4` currently pinned in `package.json`) — this is expected caret-range behavior, not a new conflict, and requires no code change; it's what a fresh `npm ci`/lockfile regeneration will naturally pick up.

**Note on `npm install --package-lock-only --dry-run`:** this variant also completed cleanly with the same zero-conflict result — cross-checked both invocation styles to make sure the dry-run flag itself wasn't masking a real-install-only conflict path.

Confidence: HIGH — this is not a general claim, it is the actual output of running `npm install` against the exact three-change dependency set on 2026-07-25, in an isolated directory seeded with the real `package.json`'s dependency block.

## Architecture Patterns

### VitePress 2.x Config Shape Without `withMermaid` — Verified

The installed VitePress package (`node_modules/vitepress/dist/node/index.d.ts`) exports `defineConfig` directly:
```ts
declare function defineConfig<ThemeConfig = DefaultTheme.Config>(config: UserConfig<NoInfer<ThemeConfig>>): UserConfig<NoInfer<ThemeConfig>>;
```
[VERIFIED: node_modules/vitepress/dist/node/index.d.ts, this repo, 2026-07-25]

Cross-checked against official VitePress docs via Context7 (`/vuejs/vitepress`, `site-config.md`) — the canonical static-config shape is:
```js
// Source: vuejs/vitepress docs/en/reference/site-config.md (via Context7)
import { defineConfig } from 'vitepress'

export default defineConfig({
  // app + theme level config...
})
```
No wrapping function of any kind is required or expected by VitePress itself — `withMermaid()` was purely `vitepress-plugin-mermaid`'s own integration point (it takes a resolved config object, mutates it to inject mermaid's markdown-it plugin and client runtime, and returns it). Removing it is a pure unwrap, not a schema change.

**Concrete edit for `docs/.vitepress/config.js`:**
1. Delete line 4: `import { withMermaid } from "vitepress-plugin-mermaid";`
2. Change line 29 from `export default withMermaid(\n  defineConfig({` to `export default defineConfig({`
3. Remove the matching closing `)` that currently closes the `withMermaid(...)` call (currently at the file's final line, `);` — becomes just the `defineConfig({...})` closing, i.e. the file ends `});` instead of `}),\n);`
4. Delete the `mermaid: { /* ... */ }` config block (lines 87-90) — this key is not part of VitePress's `UserConfig` type; it was only read by `vitepress-plugin-mermaid`'s wrapper and is silently ignored (harmless but dead) if left, so remove it for cleanliness.

`[VERIFIED: node_modules/vitepress/dist/node/index.d.ts + Context7 /vuejs/vitepress]` — this is a mechanical, low-risk edit; the only way it fails the build is a stray bracket/paren mismatch, catchable by the mandatory local build-before-commit step.

### Critical Finding: Footer Hides Itself on Sidebar Pages

**This changes how INFRA-10 must be implemented.** VitePress's shipped `VPFooter.vue` component (`node_modules/vitepress/dist/client/theme-default/components/VPFooter.vue`) contains:
```vue
<footer v-if="theme.footer && frontmatter.footer !== false" class="VPFooter" :class="{ 'has-sidebar': hasSidebar }">
```
```css
.VPFooter.has-sidebar {
  display: none;
}
```
[VERIFIED: node_modules/vitepress/dist/client/theme-default/components/VPFooter.vue, this repo, 2026-07-25]

`hasSidebar` is `true` on any page where a sidebar section applies — per `docs/.vitepress/config.js`'s existing `themeConfig.sidebar` map, that's every page under `/projects/` (five case studies + the projects index), every page under `/ai-workflow/` (being deleted in Phase 2, irrelevant to this phase), and every page under `/blog/`. **The Projects section is the majority of this site's substantive content** — meaning if the privacy link is added purely via `themeConfig.footer.message`, it will render on the homepage, About, and Contact, but silently disappear on every case-study page, via a pure CSS `display: none` that requires reading the shipped component source to discover (confirmed no `.has-sidebar` override exists yet in this repo's `custom.css` — checked directly).

**Two ways to actually get a footer line on every page, ranked:**
1. **(Recommended) Render the privacy link outside `VPFooter` entirely**, via the `layout-bottom` slot — this slot is emitted unconditionally in VitePress's `Layout.vue` (`<VPFooter /><slot name="layout-bottom" />`, confirmed via Context7 doc fetch of `Layout.vue`'s slot list), and this repo's `docs/.vitepress/theme/index.js` **already overrides `Layout()`** with custom slots (`doc-top`, `not-found`) — adding a `'layout-bottom': () => h(PrivacyFooterLink)` entry to the existing `h(DefaultTheme.Layout, null, {...})` call is a same-pattern, low-risk addition that is guaranteed to render regardless of sidebar state.
2. **(Not recommended, will under-deliver)** Set `themeConfig.footer.message` to include the privacy link, and separately override `.VPFooter.has-sidebar { display: block !important; }` in `custom.css` to force it visible. This works but fights VitePress's own theme rather than using its extension point, and is a `!important` override for behavior VitePress deliberately encodes (sidebar pages using `VPFooter` for something else, or intentionally omitting it) — matches the project's own documented anti-pattern list (`ARCHITECTURE.md` Anti-Pattern: "adding parallel, VitePress-unaware selectors" / fighting the theme rather than extending it).

Confidence: HIGH — verified by reading the actual shipped component source in this repo's `node_modules`, not inferred from documentation summaries.

### Amplify Decommission — Verified Click-Path

[CITED: docs.aws.amazon.com/amplify/latest/userguide/edit-build-settings.html] Fetched directly, 2026-07-25:

> "You can configure Amplify to turn off automatic builds on every code commit. To set up, choose **App settings**, **Branch settings**, and then locate the **Branches** section that lists the connected branches. Select a branch, and then choose **Actions**, **Disable auto build**. New commits to that branch will no longer start a new build."

**Precise checkpoint instruction for the user:**
1. Sign in to the AWS Amplify console (`console.aws.amazon.com/amplify`).
2. Select the app serving this site.
3. In the left nav, choose **App settings** → **Branch settings**.
4. In the **Branches** table, locate the `main` branch row.
5. Click the row's **Actions** menu → **Disable auto build**.
6. This does **not** delete the app, disconnect the GitHub integration, or remove the branch — it only stops the webhook-triggered auto-build. The app and its last successful deploy remain intact, satisfying the "observed stable" and "rollback stays possible" requirements from CONTEXT.md — auto-build can be re-enabled from the same menu (**Actions** → **Enable auto build**) in under a minute if something goes wrong during the observation window.
7. After confirming (a few minutes to a day, user's discretion) that `qiankun.co.uk` continues serving correctly with no Amplify build having fired, only then proceed to delete `amplify.yml`, `deploy.sh`, and the `deploy`/`deploy:quick` scripts in `package.json`.

This satisfies INFRA-02 exactly as CONTEXT.md specifies it (disable in console → observe stable → then delete repo files) and directly implements the rollback path PITFALLS.md's Pitfall 10 calls out as the reason not to delete the Amplify app outright.

### Cloudflare Web Analytics — Verified Click-Path

[CITED: developers.cloudflare.com/pages/how-to/web-analytics/] Fetched directly, 2026-07-25:

> "To enable Web Analytics for a Pages project, go to the Workers & Pages page in the Cloudflare dashboard, select your Pages project, go to **Metrics** and select **Enable** under Web Analytics. Cloudflare will automatically add the JavaScript snippet to your Pages site on the next deployment."

**Precise checkpoint instruction for the user:**
1. Log in to the Cloudflare dashboard.
2. Navigate to **Workers & Pages**.
3. Select the `qiankun-website` Pages project.
4. Go to the **Metrics** tab.
5. Under **Web Analytics**, click **Enable**.
6. No repo change is needed — Cloudflare injects the beacon script automatically into the HTML response on the **next deployment** (so this can be done any time before or after the dependency-fix deploy; it takes effect on whichever deploy comes next after enabling).

**Custom domain caveat — verified, and it resolves in this project's favor:** [CITED: developers.cloudflare.com/web-analytics/faq/] Fetched directly, 2026-07-25:

> "You can only use the automatic setup with JS snippet injection if traffic to your domain is proxied through Cloudflare (orange-clouded)." Additional caveat: a `Cache-Control: public, no-transform` response header would block injection, since Cloudflare's edge can no longer rewrite the response body.

Since INFRA-01's `dig` result already shows `qiankun.co.uk` resolving to Cloudflare anycast IP ranges (`104.21.0.223` / `172.67.128.87`) — which is only possible for a proxied ("orange-clouded") domain, not a DNS-only record pointing at an origin — **the proxy precondition is already satisfied**, confirmed by the phase's own INFRA-01 finding rather than a separate lookup. The plan should note this as "auto-injection will work, confirmed via the existing DNS check" rather than treating it as an open question. One item to verify at execution time (not knowable from outside Cloudflare's dashboard): confirm no `Cache-Control: public, no-transform` header is being set anywhere in the Cloudflare Pages project's `_headers` config (none exists in this repo currently — `docs/public/` contains no `_headers` file, confirmed by directory listing) — so there is nothing in this repo blocking injection.

Confidence: MEDIUM-HIGH — the dashboard path itself is directly quoted from current official docs (HIGH); the custom-domain-proxy inference is a correct deduction from two independently-verified facts (Cloudflare's own proxy requirement + this project's own DNS results) rather than a claim found stated together in one source, so flagged one notch down from HIGH.

### Recommended Commit Sequence (Ordering and Safety)

| Step | What | Shared files touched | Rollback |
|------|------|----------------------|----------|
| 1 | (Already done, no action) DNS verified via `dig` — documented fact, not a task | none | n/a |
| 2 | **Checkpoint:** user disables Amplify auto-build in console (see click-path above); observe site stable | none (console-only) | Re-enable auto-build from the same console menu, under a minute |
| 3 | Delete `amplify.yml`, `deploy.sh`; remove `deploy`/`deploy:quick` scripts from `package.json`; update `README.md`'s "Deploy" section to describe the GitHub Actions → Cloudflare Pages path instead of Amplify | `package.json`, `README.md` | `git revert` — no live-site impact since Cloudflare path is untouched |
| 4 | Dependency fixes: bump `vite-plugin-pwa` to `^1.3.0`, remove `vitepress-plugin-mermaid` + `mermaid` from `package.json`, pin `vitepress` to exact `2.0.0-alpha.18`, unwrap `withMermaid(...)` in `config.js` (see verified shape above), remove `mermaid: {}` config block, remove `--legacy-peer-deps` from `.github/workflows/deploy.yml`, regenerate `package-lock.json` from clean `node_modules`, verify `npm ci` (no flag) succeeds, verify `npm run docs:build` succeeds locally | `package.json`, `package-lock.json`, `docs/.vitepress/config.js`, `.github/workflows/deploy.yml`, `README.md` (Plugins list still names `vitepress-plugin-mermaid`) | `git revert` the commit; previous lockfile is the known-good fallback; local build must pass before this commit exists, so a broken build never reaches `main` |
| 5 | GA removal: delete the two GA `head` entries (`googletagmanager` script + inline `gtag` bootstrap) from `config.js` | `docs/.vitepress/config.js` | `git revert` — trivial, no build-shape risk |
| 6 | **Checkpoint:** user enables Cloudflare Web Analytics in dashboard (see click-path above) — paired with step 5 so GA and Cloudflare aren't both active simultaneously | none (dashboard-only) | Disable the toggle in the dashboard; no repo change needed either way |
| 7 | Privacy footer link + `/privacy` page: add `layout-bottom` slot entry in `theme/index.js` (see Critical Finding above), create `docs/privacy.md` | `docs/.vitepress/theme/index.js`, new `docs/privacy.md` | `git revert` |

Steps 4 and 5-7 do not conflict (different regions of `config.js` — plugin/vite block vs. head array), so they can be one commit or several; CONTEXT.md leaves commit granularity to Claude's discretion provided steps 2→3 and 5→6 checkpoint ordering is respected. Recommend keeping dependency work (step 4) as its own isolated commit regardless, per PITFALLS.md Pitfall 8's general principle of never shipping a dependency/build change in the same commit as unrelated work — makes any post-deploy regression trivially attributable.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Cookieless analytics beacon injection | A manual `<script>` tag keyed to a zone/token in `config.js` | Cloudflare Pages dashboard auto-injection (Metrics → Enable) | User's locked decision; also removes a repo-maintained secret/token and a code path that could drift from the dashboard's actual state |
| "Is Amplify still deploying?" verification | A custom polling script (the existing `deploy.sh` already does this via `aws amplify list-jobs`, but it's being deleted) | Manual console check (Amplify console build history) during the observation window in step 2 above | No AWS CLI is configured on this machine per CONTEXT.md; a fresh script would need credentials that don't exist here, and the console UI is definitionally the source of truth being verified anyway |
| Site-wide footer content on VitePress | A custom global footer component from scratch, or fighting `VPFooter`'s CSS | The `layout-bottom` slot on the theme's own already-overridden `Layout()` | VitePress already exposes an unconditional slot for exactly this purpose; the theme override point already exists in this repo (`theme/index.js`), so this is additive, not new infrastructure |

**Key insight:** Every "don't hand-roll" item above is really the same principle — this phase's job is to delete/simplify, not add new machinery. The two dashboard checkpoints (Amplify disable, Cloudflare enable) are correctly kept as manual console actions rather than scripted, since scripting either would require credentials/tokens this phase is explicitly not introducing.

## Common Pitfalls

### Pitfall 1: Relying on `themeConfig.footer` alone for the privacy link
**What goes wrong:** The footer silently doesn't render on any page with a sidebar (`/projects/*`), which is most of the site's content — verified above by reading `VPFooter.vue`'s own shipped CSS.
**Why it happens:** `theme.footer` documentation says "displays only when no sidebar is present" but this reads as a minor caveat, not as "will be invisible on your main content section," until you check which pages actually have sidebars in *this* config.
**How to avoid:** Use the `layout-bottom` slot (see Architecture Patterns above) instead of, or in addition to, `themeConfig.footer`.
**Warning signs:** Visiting any `/projects/*` page after implementing and not seeing the privacy link — check this specifically, not just the homepage.

### Pitfall 2: Deleting `amplify.yml`/`deploy.sh` before confirming Amplify is actually disabled
**What goes wrong:** Already documented in PITFALLS.md Pitfall 10 — covered here only to confirm the mitigation (disable via console, observe, then delete) is the verified-correct AWS-documented sequence, not a project-specific guess.
**How to avoid:** Follow the exact click-path in `## Amplify Decommission — Verified Click-Path` above; do not skip the observation window.

### Pitfall 3: Stale documentation surviving the dependency cleanup
**What goes wrong:** `README.md` line 29 ("Deploys to AWS Amplify automatically via GitHub push") and its "Plugins" section (still lists `vitepress-plugin-mermaid`) are not caught by a grep for the literal string `--legacy-peer-deps`, but they are exactly the kind of stale documentation INFRA-04's "documentation" clause is meant to catch. [VERIFIED: grep across the repo, 2026-07-25 — README.md does not contain the string `--legacy-peer-deps` but does contain both stale references]
**How to avoid:** Update `README.md`'s Deploy section and Plugins list in the same commit as the dependency/pipeline changes (step 3/4 above), not as an afterthought.
**Warning signs:** A grep for `legacy-peer-deps` passing while `README.md` still describes the old pipeline or plugin set.

### Pitfall 4: Treating the `vite` patch bump (8.1.4→8.1.5) picked up during lockfile regeneration as unexpected
**What goes wrong:** Regenerating `package-lock.json` will resolve `vite` to `8.1.5` (confirmed via the dry-run above) even though `package.json` still says `^8.1.4` — this is correct caret-range behavior, not a bug, but could be misread as an unintended change during review.
**How to avoid:** Note in the commit message that the lockfile regeneration naturally picks up compatible patch releases within the existing `^8.1.4` range; no `package.json` edit needed for this.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Local build verification, CI | ✓ | v26.5.0 (local); v22 pinned in CI | CI's pinned Node 22 is what matters for reproducibility; local v26 is fine for the mandated local build-verify step since VitePress/Vite have no v22-specific runtime dependency in this repo |
| npm | Dependency install/lockfile regeneration | ✓ | 11.17.0 | — |
| AWS CLI | Programmatic Amplify inspection | ✗ (per CONTEXT.md, already confirmed absent) | — | Manual AWS console access (user-action checkpoint) — no CLI fallback needed since the checkpoint is designed around console-only steps |
| AWS Amplify console access | INFRA-02 checkpoint | Assumed ✓ (user's own AWS account) | — | None needed — this is the primary path |
| Cloudflare dashboard access | INFRA-09 checkpoint | Assumed ✓ (user already operates Cloudflare Pages for this domain) | — | None needed — this is the primary path |
| `dig` / DNS lookup tooling | INFRA-01 (already completed) | ✓ (already run) | — | — |

**Missing dependencies with no fallback:** none — the one "missing" dependency (AWS CLI) has a designed-around fallback (manual console checkpoint), which is the locked decision, not a gap.

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | Static site, no auth surface introduced or touched this phase |
| V3 Session Management | No | No sessions on a static site |
| V4 Access Control | No | No access-controlled resources |
| V5 Input Validation | No | No user input processed by this phase's changes |
| V6 Cryptography | No | Not applicable |
| V14 Configuration (closest fit) | Yes | Secrets/config hygiene in CI — see below |

### Known Issues for This Stack (not full STRIDE — infra/config phase, minimal attack surface)

| Pattern | Risk | Standard Mitigation |
|---------|------|----------------------|
| Cloudflare Account ID hardcoded in `.github/workflows/deploy.yml` (`0a5ceee99ef2f0c3f66bb55ff5adf359`) | Low — an account ID is not a credential, but poor secrets hygiene on a repo a hiring-facing site's audience may browse | [Already flagged in prior PITFALLS.md research] Move to a GitHub Actions secret (`${{ secrets.CLOUDFLARE_ACCOUNT_ID }}`) — cheap fix, worth doing in the same pass since `deploy.yml` is already being edited to remove `--legacy-peer-deps` |
| GA script removal leaving no residual tracking, but Cloudflare Web Analytics still transmits IP/user-agent transiently (any analytics does, cookieless or not) | Low — GDPR's broader "personal data" definition still technically applies to IP addresses in transit, even with no cookie set | The `/privacy` page (INFRA-10, already planned) accurately discloses this — "collects no personal data, sets no cookies" per CONTEXT.md's own phrasing should be checked for accuracy: Cloudflare Web Analytics is cookieless and stores no persistent identifier, but does process IP/user-agent transiently for aggregation. Recommend the privacy page wording say "does not use cookies or store persistent identifiers" rather than the stronger "collects no personal data," to stay factually precise — flagged as a wording note for whoever writes the page copy (Claude's discretion per CONTEXT.md) |
| Dependency supply chain (removing/adding npm packages) | Low — no new packages added this phase, only a version bump (`vite-plugin-pwa`) and two removals | No action needed; see Package Legitimacy Audit above — no new install to vet |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | AWS Amplify console access is available to the user under the existing account | Environment Availability | If not, INFRA-02's checkpoint cannot be completed and the phase blocks on it — low likelihood since the user is the account owner and CONTEXT.md already establishes Amplify state was inspectable enough to know it exists |
| A2 | Cloudflare dashboard access to the `qiankun-website` Pages project is available | Environment Availability | Same as above — CONTEXT.md already establishes the user operates this Cloudflare Pages project (it's the confirmed live deploy target), so this is very low risk |
| A3 | No `_headers` file or `Cache-Control: public, no-transform` rule exists anywhere in the actual Cloudflare Pages project configuration outside the repo (e.g., set via the dashboard's own Rules/Transform Rules feature, not visible from the repo) | Cloudflare Web Analytics section | If wrong, auto-injection silently fails to add the beacon script even after enabling it in Metrics — the checkpoint instruction should include "verify the beacon script actually appears in page source after enabling" as an explicit verification step, not just "click Enable" |

**If this table is empty:** N/A — three low-risk assumptions logged above, all stemming from console/dashboard access that CONTEXT.md's existing facts make very likely to hold.

## Open Questions

1. **Does the existing Cloudflare Pages project already have any Transform Rules or `_headers` config set via the dashboard (not the repo) that could block Web Analytics auto-injection?**
   - What we know: no `_headers` file exists in the repo's `docs/public/`, and Cloudflare's own FAQ names `Cache-Control: public, no-transform` as the specific blocker.
   - What's unclear: dashboard-only configuration (Transform Rules, Page Rules) isn't visible from the repo and wasn't inspected as part of this research (no dashboard access from this environment).
   - Recommendation: after enabling Web Analytics in the checkpoint, verify by viewing page source on the live site for the injected `<script>` snippet (typically a `beacon.min.js` reference with a token) rather than assuming success from the dashboard toggle alone.

## Sources

### Primary (HIGH confidence)
- Direct execution: `npm install --dry-run` and `npm install --package-lock-only --dry-run` against the exact post-fix dependency set, in an isolated scratch directory seeded with this repo's real `package.json` dependencies (2026-07-25)
- Direct `npm view` queries: `vite-plugin-pwa@1.3.0 peerDependencies`, `vite-plugin-pwa@latest`, `vitepress dist-tags`, `mermaid version`, `vitepress-plugin-mermaid versions`, `@nolebase/vitepress-plugin-enhanced-readabilities@latest peerDependencies`, `vitepress-plugin-tabs@latest peerDependencies`, `vitepress-plugin-group-icons@latest peerDependencies`, `vitepress-plugin-rss@latest peerDependencies` (npm registry, 2026-07-25)
- Direct file reads: `node_modules/vitepress/dist/node/index.d.ts`, `node_modules/vitepress/dist/client/theme-default/components/VPFooter.vue`, `node_modules/vitepress/package.json`, `node_modules/vite/package.json` (this repo's actual installed packages, 2026-07-25)
- Direct repo reads: `package.json`, `docs/.vitepress/config.js`, `docs/.vitepress/theme/index.js`, `docs/.vitepress/theme/custom.css`, `.github/workflows/deploy.yml`, `amplify.yml`, `deploy.sh`, `README.md`, `.gitignore`, `docs/index.md` (2026-07-25)
- Context7 `/vuejs/vitepress` — `defineConfig` usage patterns, `Layout.vue` slot list, Footer configuration reference (official VitePress repo docs, fetched 2026-07-25)

### Secondary (MEDIUM confidence)
- [Enable Web Analytics · Cloudflare Pages docs](https://developers.cloudflare.com/pages/how-to/web-analytics/) — fetched directly, 2026-07-25
- [FAQs · Cloudflare Web Analytics docs](https://developers.cloudflare.com/web-analytics/faq/) — fetched directly, 2026-07-25
- [Editing the build specification - AWS Amplify Hosting](https://docs.aws.amazon.com/amplify/latest/userguide/edit-build-settings.html) — fetched directly, 2026-07-25

### Tertiary (LOW confidence)
- None — every claim in this document is either an empirical command-line result, a direct file read against this repo's installed packages, or a directly-fetched official doc page.

## Metadata

**Confidence breakdown:**
- Dependency resolution: HIGH — empirically re-verified via live `npm install --dry-run`, not inferred
- VitePress config shape: HIGH — verified against installed package's own type declarations plus official docs
- Footer/sidebar interaction: HIGH — verified by reading the shipped component source directly
- Dashboard click-paths (Amplify, Cloudflare): MEDIUM-HIGH — directly quoted from current official docs, but dashboard UIs can shift between doc-publish and execution date
- Cloudflare custom-domain-proxy inference: MEDIUM-HIGH — correct deduction from two verified facts, not a single directly-stated claim

**Research date:** 2026-07-25
**Valid until:** 2026-08-24 (30 days) — shorter validity recommended specifically for the Cloudflare/AWS dashboard click-paths, since console UIs change without a version number; re-verify the click-path visually at execution time even though the documented steps are current as of this research date.
