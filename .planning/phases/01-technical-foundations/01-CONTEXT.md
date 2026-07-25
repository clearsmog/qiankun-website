# Phase 1: Technical Foundations - Context

**Gathered:** 2026-07-25
**Status:** Ready for planning
**Mode:** Smart discuss (autonomous) — infrastructure phase, decisions captured from user sign-off rather than grey-area tables

<domain>
## Phase Boundary

The site deploys through exactly one pipeline, on dependency-clean and correctly-pinned versions, with cookieless analytics in place — and at no point during this phase is there risk of the live site going down or search indexing corrupting.

In scope: DNS verification, Amplify decommission, dependency conflict resolution, VitePress pinning, analytics swap, privacy note.

Out of scope: any content deletion (Phase 2), any styling or token work (Phases 3–4), any copy rewriting (Phase 4).

</domain>

<decisions>
## Implementation Decisions

### Dependency Resolution
- VitePress is pinned to exactly `2.0.0-alpha.18` — no caret, no range. **Do not downgrade to 1.6.4.** User signed off 2026-07-25; downgrading would mean auditing every component and plugin for v2-only APIs, which is migration work that does not belong in a polish milestone.
- `vite-plugin-pwa` bumps to `^1.3.0` — its peer range then includes Vite 8, clearing one of the two conflicts.
- `vitepress-plugin-mermaid` and the `mermaid` runtime dependency are removed entirely — package is dead upstream (last publish Sept 2024), no VitePress 2.x-compatible version exists. This clears the second conflict.
- `--legacy-peer-deps` is removed from `.github/workflows/deploy.yml:21` and from `amplify.yml:6` (the latter dies with the file). No `.npmrc` exists, so nothing to clean there.
- `package-lock.json` must be regenerated from a clean `node_modules` after these changes, and `npm ci` (no flag) must succeed on that lockfile before anything is committed.

### Deploy Pipeline Consolidation
- Cloudflare is confirmed as the live serving path by direct `dig` on 2026-07-25: `qiankun.co.uk` → `104.21.0.223` / `172.67.128.87`, `www` → same pair. Both are Cloudflare ranges; no Amplify endpoint in the record. INFRA-01 is satisfied by this observation and must be written into the plan/summary as the documented finding.
- No AWS CLI is configured on this machine, so Amplify state cannot be inspected or changed from here. **The Amplify disable is an explicit user-action checkpoint** — execution stops, the user confirms in the AWS console that auto-build on `main` is disabled and the site is still serving, and only then are `amplify.yml` and `deploy.sh` deleted from the repo.
- Ordering is non-negotiable: verify DNS → user disables Amplify auto-deploy → observe site stable → delete `amplify.yml` and `deploy.sh`. Deleting the repo files first would remove the emergency fallback path.
- `package.json` `deploy` and `deploy:quick` scripts both invoke `./deploy.sh` and must be removed in the same commit as `deploy.sh`, or they become broken entry points.

### Analytics and Privacy
- Google Analytics (`G-4PF046MSJJ`) is removed from `docs/.vitepress/config.js` — both the `googletagmanager` script tag (line ~135) and the inline `gtag` bootstrap (line ~141).
- Cloudflare Web Analytics is enabled via **dashboard auto-injection on the Pages project**, not a manual beacon snippet. Zero repo change for the beacon; Cloudflare injects it. This is a user-action checkpoint (one dashboard toggle) paired with the GA removal.
- Privacy disclosure is a **footer line linking to a short `/privacy` page**. The footer line appears site-wide; the page states plainly that the site uses cookieless Cloudflare Web Analytics, collects no personal data, and sets no cookies.

### Claude's Discretion
- Exact wording of the privacy page and footer line.
- Whether `robots.txt` / sitemap need any adjustment for the new `/privacy` page.
- Commit granularity within each work item, provided the deploy-pipeline ordering above is respected.

</decisions>

<code_context>
## Existing Code Insights

### Files In Scope
- `package.json` — 3 deps, 12 devDeps; `deploy`/`deploy:quick` scripts point at `deploy.sh`
- `.github/workflows/deploy.yml` — Cloudflare Pages via wrangler; `npm ci --legacy-peer-deps` at line 21; account ID `0a5ceee99ef2f0c3f66bb55ff5adf359`, token from `secrets.CLOUDFLARE_API_TOKEN`
- `amplify.yml` — 18 lines, Amplify build spec; to be deleted after checkpoint
- `deploy.sh` — bash script that commits, pushes, then polls `aws amplify list-jobs`; assumes Amplify is the live target; to be deleted after checkpoint
- `docs/.vitepress/config.js` — wraps the whole export in `withMermaid(...)` at line 29, imports it at line 4, `mermaid: {}` config block at lines 87–90, GA head tags at lines ~131–142

### Established Patterns
- Config is a single `export default withMermaid({...})` — removing mermaid means unwrapping to a plain `export default defineConfig({...})` (or bare object), not just deleting the import
- `docs/public/` holds static passthrough assets (`robots.txt`, `favicon.svg`, `og-image.svg`, `logo.svg`, `projects/`); no `_redirects` file exists yet — Phase 2 creates it
- Build output is `docs/.vitepress/dist/`, hardcoded in `amplify.yml` and the GitHub Actions deploy step

### Known Ordering Conflict (accepted)
- `docs/blog/vite-plugins.md` is the only source file containing a ` ```mermaid ` fence. Removing the plugin in this phase makes that diagram render as a plain code block rather than a diagram. The post is deleted by PRUNE-04 in Phase 2, so the degraded state lasts one phase and is on a page already slated for removal. **This does not break the build** — an unrecognised fence renders as a code block. Accepted rather than pulling PRUNE-04 forward into Phase 1.

</code_context>

<specifics>
## Specific Ideas

- The build must be proven locally (`npm ci` with no flag, then `npm run docs:build`) before any commit that touches dependencies or CI config. User granted autonomy on deploy-affecting changes on the condition that local builds are verified first.
- Do not touch DNS records. The `dig` verification is read-only; the domain is established and on published materials.

</specifics>

<deferred>
## Deferred Ideas

- Adding a test suite — the codebase has no test coverage of any kind. Real gap, but out of scope for this milestone.
- Deleting `docs/blog/vite-plugins.md` — belongs to PRUNE-04 in Phase 2.
- Removing the six unused `Svg*` chart components — PRUNE-09, Phase 2.

</deferred>
