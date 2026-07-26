# Phase 2: Content Deletion & Redirects - Research

**Researched:** 2026-07-26
**Domain:** Static-site content pruning (VitePress SSG) + edge-layer redirects (Cloudflare Pages)
**Confidence:** HIGH

## Summary

This phase deletes four content areas from a VitePress 2.0.0-alpha.18 static site, cleans up their nav/sidebar/component/data-loader traces, and ships a `docs/public/_redirects` file so every deleted URL 301s instead of 404ing. The two things that make or break the plan are both confirmed by direct inspection of the installed toolchain rather than by memory or web search:

1. **VitePress's dead-link check is ON by default** (`ignoreDeadLinks: false` is the compiled default in the installed package, and `config.js` never overrides it). This means `npm run docs:build` throws `Error: N dead link(s) found` and hard-fails if any surviving Markdown file still links to a path that no longer resolves to a page. This is a free, mandatory verification gate for PRUNE-07 — but it only catches links inside `.md` content, not `nav`/`sidebar` entries in `config.js` (those are plain JS objects, never parsed for dead-link checking) and not links inside `<script setup>`/Vue templates. PRUNE-06 (nav/sidebar) and any component-embedded links must still be verified by grep.
2. **Cloudflare Pages' `_redirects` format is confirmed via official docs**: one rule per line (`/source /destination 301`), single-splat wildcards supported (`/ai-workflow/* / 301`), 2,100 total rule limit (300x headroom for 8 rules), file must live in the build output root — which `docs/public/_redirects` reaches automatically because `docs/public/` is VitePress's unconfigured default passthrough dir and the CI pipeline deploys `docs/.vitepress/dist` via `wrangler pages deploy`. The one documented custom-domain caveat (`_redirects` cannot redirect `*.pages.dev` → a custom domain) does not apply here — it is irrelevant to redirecting paths within the already-attached `qiankun.co.uk` custom domain.

Sitemap.xml and feed.rss are both regenerated from the actual surviving files on disk at every build (confirmed by reading `generateSitemap()` in the installed VitePress bundle and `getVitePressPages()` in `vitepress-plugin-rss`) — neither requires a manual regeneration step or config change after deletion. The six `Svg*` components have no barrel/index file; they are only ever imported and registered directly in `docs/.vitepress/theme/index.js`, so removal is a matched pair of delete-file + delete-two-lines (import + `app.component()`) per component. `blog-posts.data.js` has exactly one consumer (`docs/index.md`'s Recent Posts `<script setup>`), which this phase removes — after that, the data loader is dead code and should be deleted too, per the context doc's discretion clause.

**Primary recommendation:** Sequence the phase so `docs/blog/index.md`'s two dead links are fixed in the *same task* that deletes `welcome.md`/`vite-plugins.md` (dead-link check is atomic per build, not per file), delete each `Svg*` component together with its two `theme/index.js` lines, and land `docs/public/_redirects` in the same commit as the page deletions (already locked). Run `npm run docs:build` after every task as the sole verification gate for PRUNE-07 — it will fail loudly if anything is missed.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Page deletion / content pruning | CDN / Static | — | VitePress generates static HTML at build time; deleted `.md` files simply produce no output route. No runtime tier is involved. |
| URL redirects (`_redirects`) | CDN / Static | — | Cloudflare Pages parses `_redirects` at the edge before serving static assets — this is Cloudflare's edge/CDN layer, not application code. |
| Nav / sidebar config cleanup | CDN / Static | Browser / Client | `config.js`'s `nav`/`sidebar` objects are baked into generated HTML at build time; VitePress's Vue Router then hydrates client-side for SPA-style in-page navigation. |
| Dead component removal (`Svg*`) | Browser / Client | CDN / Static | `app.component()` registrations execute in the hydrated Vue app; removing unused components also shrinks the build's client JS bundle. |
| Dead-link verification (build-time) | CDN / Static | — | Runs inside the `vitepress build` Node.js SSG process, before any CDN deploy — a compile-time gate, not a runtime one. |
| Sitemap / RSS regeneration | CDN / Static | — | Both are generated as static files (`sitemap.xml`, `feed.rss`) from the on-disk page list at build time and served directly from the CDN; no separate regeneration step exists. |

## User Constraints (from CONTEXT.md)

<user_constraints>

### Locked Decisions

**Redirect Strategy**
- All deleted URLs return 301 to the nearest relevant page. No 410s. Preserves inbound link equity and never shows a visitor an error page — the URL is on a CV, so a dead-end is worse than a slightly-off destination.
- Mapping: `/ai-workflow/*` (all five) → `/`; `/photos/` → `/`; `/blog/welcome` → `/blog/`; `/blog/vite-plugins` → `/blog/`.
- `docs/public/_redirects` is Cloudflare Pages' native format: one rule per line, `/source /destination 301`. The file does not exist yet — this phase creates it.
- Redirects ship in the same commit as the deletions (PRUNE-08 is explicit). A commit that deletes pages without the redirect file leaves a window of hard 404s.

**Writing Section Presentation**
- Relabel only — keep `/blog/` URLs. Nav entry and the `/blog/` page heading become "Writing"; the directory stays `docs/blog/` and the surviving post keeps `/blog/etrm-systems`. No renaming, no extra redirects for a page being kept.
- Remove `*More posts coming soon...*` from `docs/blog/index.md:18` (PRUNE-10).
- The `/blog/` index must not present as a dated feed. One post is fine as a body of writing; it is not fine as an abandoned stream.
- Sidebar `/blog/` section drops the "Vite Plugins" and "Welcome Post" entries, leaving "ETRM Systems".

**Homepage Restructuring**
- The features row keeps three cards; the two removed ones are replaced, not left as a hole. Replacement cards should point at things that actually exist and matter to a finance reader: Projects, About, Contact is the safe default, but the specific trio is at Claude's discretion so long as every card links somewhere real.
- The "Recent Posts" block is removed from the homepage entirely, along with its `<script setup>` import of `./.vitepress/data/blog-posts.data.js` and the now-orphaned `.recent-posts` / `.post-card` / `.post-title` / `.post-desc` CSS in the page's `<style>` block.
- Check whether `docs/.vitepress/data/blog-posts.data.js` has any remaining consumer after this removal. If none, it is dead code and goes too.
- Hero copy (`Exploring the Universe of Code`, the tagline, the `Read the Blog` CTA text) is NOT touched here — that is Phase 4 POS work. Only the `features:` array and the Recent Posts block change.

**Deletion Inventory**
- Pages: `docs/ai-workflow/` (index, concepts, patterns, agents, tools), `docs/photos/index.md`, `docs/blog/welcome.md`, `docs/blog/vite-plugins.md`.
- Nav entries: "AI Workflow" and "Photos" removed; "Blog" relabelled "Writing".
- Sidebar: the entire `"/ai-workflow/"` key removed; `"/blog/"` pruned to one entry.
- Components: the six `Svg*` files under `docs/.vitepress/theme/components/viz/` plus their registrations in `docs/.vitepress/theme/index.js`.
- Any photo assets under `docs/public/` that exist solely for the deleted gallery.

### Claude's Discretion
- The specific trio of homepage feature cards and their card copy (Phase 4 rewrites this prose anyway).
- Whether `blog-posts.data.js` is deleted or retained, based on whether a consumer survives.
- Exact `_redirects` line ordering and whether a catch-all is warranted.
- Commit granularity, provided deletions and `_redirects` land together.

### Deferred Ideas (OUT OF SCOPE)
- Hero name/text/tagline rewrite and the "Read the Blog" CTA — Phase 4 (POS-*).
- Design token consolidation — Phase 3.
- Phase 1's console-gated items (Amplify file deletion, GA removal, privacy page) remain outstanding and are tracked in STATE.md under Deferred Verification.

</user_constraints>

## Phase Requirements

<phase_requirements>

| ID | Description | Research Support |
|----|-------------|------------------|
| PRUNE-01 | The AI Workflow section (index, concepts, patterns, agents, tools) is deleted | Deletion set confirmed 5 files under `docs/ai-workflow/`; nav entry `config.js:157`, sidebar key `config.js:193-204` both reference it and must be removed in the same task to avoid a dangling nav/sidebar pointer. |
| PRUNE-02 | The Photos gallery is deleted | Single file `docs/photos/index.md` (291 lines); nav entry `config.js:159`. No sidebar key exists for `/photos/` (confirmed — sidebar object has only `/projects/`, `/ai-workflow/`, `/blog/` keys), so no sidebar edit needed here. `docs/public/` holds no photo-gallery assets (verified: only `favicon.svg`, `logo.svg`, `og-image.svg`, `robots.txt`, `projects/` — nothing to delete under `public/`). |
| PRUNE-03 | The `welcome` blog post is deleted | `docs/blog/welcome.md`; referenced from `docs/blog/index.md:14` and sidebar `config.js:211` — both must be edited in the same build-safe unit (see Pitfall 1). |
| PRUNE-04 | The Vite plugins blog post is deleted | `docs/blog/vite-plugins.md`; referenced from `docs/blog/index.md:12` and sidebar `config.js:209` — same build-safe unit as PRUNE-03. |
| PRUNE-05 | The "Technology" and "Writing" homepage feature cards are removed | `docs/index.md` `features:` array, entries 2 and 3 (lines 30-47). UI-SPEC.md's approved Surface 1 contract (Projects/About/Contact trio, exact icon/gradient-id contract) is the executable spec — do not re-derive card choice. |
| PRUNE-06 | Nav and sidebar configuration contain no entries pointing at deleted pages | `config.js` nav array (line 153-161) and sidebar object (line 164-215) — see exact line-by-line edits above. **Not caught by the VitePress dead-link build check** (see Pitfall 2) — verify by reading the file after edit, not by relying on a green build. |
| PRUNE-07 | No internal link anywhere on the site resolves to a deleted page | Grep run this session (excluding `dist/` and the files being deleted) found exactly two source locations with dangling references: `config.js` (nav/sidebar, covered by PRUNE-06) and `docs/blog/index.md` (covered by PRUNE-03/04). No references found in `about.md`, `contact.md`, or any `docs/projects/*` case study. VitePress's build-time dead-link check (see Pitfall 2) re-verifies the `docs/blog/index.md` class of link automatically; the `config.js` class needs a manual grep re-check since the build won't catch it. |
| PRUNE-08 | `docs/public/_redirects` returns a deliberate 301 for every deleted URL, shipped in the same commit as the deletions | See "Cloudflare Pages `_redirects`" section below for exact syntax, ordering rules, and file-placement verification. |
| PRUNE-09 | The six unused `Svg*` chart components and their registrations are deleted, verified by grepping tag names | Confirmed no barrel/index file in `viz/` — components are imported and registered only in `docs/.vitepress/theme/index.js` (6 import lines + 6 `app.component()` lines). Deleting a component file without removing its `import` breaks the Vite build immediately (unresolvable module) — this is itself a second, even stricter safety net than the dead-link check, so the two edits must always be paired in the same commit. |
| PRUNE-10 | No "Work in Progress" badge, "coming soon", or equivalent staleness language remains | Three locations confirmed by prior scan: `docs/ai-workflow/index.md:7` (deleted with the section), `docs/photos/index.md:279` (deleted with the section), `docs/blog/index.md:18` (needs a targeted edit — see UI-SPEC Surface 2 exact replacement text). The `.wip-badge`/`.wip-notice` CSS rules in `custom.css:539-576` become orphaned once `ai-workflow/index.md` is gone and must be deleted in the same task, or PRUNE-10 is only cosmetically satisfied. |
| PRUNE-11 | `/blog/` is presented as "Writing" rather than a dated feed | UI-SPEC.md Surface 2 is the exact, approved replacement markdown for `docs/blog/index.md` (frontmatter, H1, H3 post link, description, italic date) — implement it verbatim; this is a design-contract phase output, not open for reinterpretation. |

</phase_requirements>

## Standard Stack

No new libraries are introduced by this phase — it is a deletion/config-editing phase within the existing VitePress 2.0.0-alpha.18 + Vue 3 stack (already pinned per Phase 1 / INFRA-07). No `npm install` is required.

### Package Legitimacy Audit

Not applicable — this phase installs no new packages. `docs/public/_redirects` is a plain-text config file recognized natively by Cloudflare Pages' build pipeline; it is not an npm package and carries no supply-chain surface.

## Architecture Patterns

### System Architecture Diagram

```
  git push (main)
        |
        v
  GitHub Actions (.github/workflows/deploy.yml)
        |
        |  npm ci
        |  npm run docs:build   <-- VitePress SSG build (dead-link check runs here)
        v
  docs/.vitepress/dist/         <-- build output root
        |  includes docs/public/* passthrough, incl. _redirects
        |  includes generated sitemap.xml, feed.rss (fresh, from on-disk pages)
        v
  wrangler pages deploy --project-name=qiankun-website
        |
        v
  Cloudflare Pages edge network (qiankun.co.uk, custom domain)
        |
        |  _redirects rules parsed and applied BEFORE static asset lookup
        v
  Visitor request for a deleted URL --> 301 --> nearest surviving page
  Visitor request for a surviving URL --> served directly, no redirect hop
```

### Recommended Project Structure

No new files or folders are introduced except `docs/public/_redirects`. Existing structure is unchanged; this phase only removes subtrees:

```
docs/
├── ai-workflow/          # DELETE (5 files: index, concepts, patterns, agents, tools)
├── photos/
│   └── index.md          # DELETE
├── blog/
│   ├── index.md          # EDIT — becomes "Writing" per UI-SPEC Surface 2
│   ├── welcome.md         # DELETE
│   ├── vite-plugins.md    # DELETE
│   └── etrm-systems.md    # KEEP, unchanged
├── public/
│   └── _redirects         # NEW — Cloudflare Pages redirect rules
├── index.md               # EDIT — features array (2 of 3 cards) + Recent Posts block removed
└── .vitepress/
    ├── config.js           # EDIT — nav array, sidebar object
    ├── data/
    │   └── blog-posts.data.js  # DELETE (dead after Recent Posts removal — confirmed single consumer)
    └── theme/
        ├── index.js         # EDIT — remove 6 Svg* imports + 6 app.component() calls
        ├── custom.css        # EDIT — remove .wip-badge/.wip-notice rules (custom.css:539-576)
        └── components/viz/
            ├── SvgAreaChart.vue      # DELETE
            ├── SvgHBars.vue          # DELETE
            ├── SvgDonut.vue          # DELETE
            ├── SvgForest.vue         # DELETE
            ├── SvgFootballField.vue  # DELETE
            └── SvgScorePath.vue      # DELETE
```

### Pattern 1: Cloudflare Pages `_redirects` file

**What:** A plain-text file, one rule per line, parsed by Cloudflare Pages at the edge and applied to static asset responses before they're served.

**When to use:** Any URL that no longer resolves to a real page but might still be linked externally (search engines, the CV itself, bookmarks).

**Syntax (verified against official Cloudflare Pages docs, developers.cloudflare.com/pages/configuration/redirects/):**
```
# Source Destination Status
/ai-workflow/*    /    301
/photos/          /    301
/blog/welcome     /blog/    301
/blog/vite-plugins /blog/    301
```

- A splat (`*`) greedily matches all remaining characters and can only appear once per source line; it does not need to be referenced in the destination if the destination is a fixed path (as here — every `/ai-workflow/*` source maps to a fixed `/` destination, no `:splat` needed).
- Rule limit: 2,000 static + 100 dynamic (splat/placeholder) redirects, 2,100 combined, 1,000 characters per line. This phase needs 4 lines — no limit concern.
- Order matters: if two rules could match the same path, the first one listed wins. With only 4 non-overlapping source patterns here, ordering has no practical effect, but `/ai-workflow/*` should still be listed before any more specific future `/ai-workflow/foo` rule if one is ever added.
- **File placement — verified for this project specifically:** VitePress's `srcDir` is `docs` (from `vitepress build docs`), and `config.js` sets no custom `publicDir`, so the default `docs/public/` applies. `docs/public/` already passes through to the build output root unmodified — confirmed by the existing service worker precache manifest in `docs/.vitepress/dist/sw.js`, which lists `favicon.svg`, `logo.svg`, `og-image.svg`, `robots.txt` (all currently in `docs/public/`) at the output root. `docs/public/_redirects` will therefore land at `docs/.vitepress/dist/_redirects`, and the GitHub Actions workflow deploys exactly that directory (`wrangler pages deploy docs/.vitepress/dist`) — placement is correct with no config change.
- **Custom domain applicability:** `_redirects` rules apply normally to a custom domain attached to a Cloudflare Pages project, as long as the domain is a proper Cloudflare zone (required to attach a custom domain to Pages at all, and already true for `qiankun.co.uk` per this project's existing setup). The one documented `_redirects` custom-domain limitation — it cannot redirect the `*.pages.dev` subdomain itself to the custom domain — is unrelated to this phase (we are redirecting paths *within* `qiankun.co.uk`, not redirecting between domains).
- **Caveat found:** `_redirects` rules are not applied to requests served by Pages Functions. This project has no Pages Functions (pure static VitePress output), so this caveat has no effect here — noted for completeness only.

**Example:**
```
# Source: developers.cloudflare.com/pages/configuration/redirects/
/blog/* /posts/:splat
```

### Pattern 2: VitePress build-time dead-link check as a free verification gate

**What:** `vitepress build` collects every relative link found while rendering each `.md` file's content, resolves it against the actual list of pages that will exist in the build, and — unless `ignoreDeadLinks` is configured — throws `Error: N dead link(s) found` at the `renderStart` Rollup hook, failing the build outright (not just a warning).

**When to use:** As the primary automated re-check for PRUNE-07 within `.md` content. Run `npm run docs:build` after any content deletion; a clean exit means no surviving Markdown file links to a deleted page.

**Verified directly from the installed package** (`node_modules/vitepress@2.0.0-alpha.18`), not from docs or memory:
```typescript
// node_modules/vitepress/dist/node/index.d.ts:1864-1867
/**
 * ...
 * @default false
 */
ignoreDeadLinks?: boolean | 'localhostLinks' | (...)[];
```
```javascript
// node_modules/vitepress/dist/node/chunk-Cne7GbZY.js:30764-30772 (build plugin, renderStart hook)
renderStart() {
  if (allDeadLinks.length > 0) {
    logDeadLinks(allDeadLinks, siteConfig.logger);
    siteConfig.logger.info(/* ...points to ignoreDeadLinks docs... */);
    throw new Error(`${allDeadLinks.length} dead link(s) found.`);
  }
}
```
`docs/.vitepress/config.js` has no `ignoreDeadLinks` key at all, so the compiled default (`false`, i.e. checking is ON) is in effect — confirmed by reading the full config file this session.

**Scope limitation (important for planning):** The link collector only runs on `.md` file content (`if (id.endsWith(".md")) { ...deadLinks... }` in the same chunk). It does **not** inspect `config.js`'s `nav`/`sidebar` arrays (plain JS objects, never passed through the Markdown renderer), and does not inspect Vue SFC templates/`<script setup>` blocks. **PRUNE-06 (nav/sidebar) is therefore not covered by a green build and must be verified by direct inspection/grep**, exactly as this research's own grep pass did this session.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Verifying no dead internal links remain in Markdown content | A custom link-crawler script | `npm run docs:build` (VitePress's built-in dead-link check, confirmed ON by default) | It already exists, runs on every build, and fails loudly (`throw new Error`) rather than silently warning — a custom script would duplicate this for free coverage. |
| Regenerating sitemap.xml / feed.rss after deleting pages | A manual "resubmit sitemap" or "purge stale RSS entries" script/step | Nothing — just rebuild | Both `generateSitemap()` (VitePress core) and `getPostsData()` (`vitepress-plugin-rss`, via `getVitePressPages()`) enumerate the actual on-disk page list at build time. Confirmed by reading both packages' installed source this session — there is no cached/stale list to purge. |
| Redirecting deleted URLs | An `onBeforeMount` client-side JS redirect, or a custom Cloudflare Worker | `docs/public/_redirects` (Cloudflare Pages' native redirect engine) | It is edge-layer (faster, works even if JS fails to load, no extra deploy target), free, and already the locked decision in CONTEXT.md. |

**Key insight:** Nearly everything this phase needs already exists in the current toolchain (VitePress's dead-link check, the sitemap/RSS generators, Cloudflare Pages' redirect engine) — the work is almost entirely deletion and two small config edits, not new tooling.

## Common Pitfalls

### Pitfall 1: Deleting a Markdown page before removing its inbound Markdown links
**What goes wrong:** If `welcome.md`/`vite-plugins.md` are deleted in a task that doesn't also edit `docs/blog/index.md`'s two links to them, `npm run docs:build` fails with `2 dead link(s) found` and the build is broken until the next task fixes it.
**Why it happens:** The dead-link check is atomic to the whole build, not per-file — VitePress doesn't know deletion and link-removal are "supposed to" happen together.
**How to avoid:** Make "delete `welcome.md` + `vite-plugins.md`" and "rewrite `docs/blog/index.md` per UI-SPEC Surface 2" a single task (or at minimum, land them in the same commit before any build is expected to pass).
**Warning signs:** `npm run docs:build` output containing `(!) Found dead link ... in file docs/blog/index.md`.

### Pitfall 2: Deleting a `Svg*` component file without removing its import in `theme/index.js`
**What goes wrong:** Vite's module resolver fails at build time (`Failed to resolve import "./components/viz/SvgAreaChart.vue"`) — a harder, earlier failure than the dead-link check, since it happens during bundling, not content rendering.
**Why it happens:** `theme/index.js` imports and registers each component individually; there is no dynamic/glob import that would silently no-op on a missing file.
**How to avoid:** Treat each `Svg*` component as a single atomic edit-pair: delete the `.vue` file and remove both its `import` line and its `app.component(...)` line in the same change.
**Warning signs:** Build error mentioning `Could not resolve` or `Failed to resolve import` referencing a `Svg*` filename.

### Pitfall 3: Assuming the dead-link build check covers `config.js` nav/sidebar entries
**What goes wrong:** A developer sees `npm run docs:build` pass and concludes PRUNE-06/PRUNE-07 are both fully verified — but a stale nav/sidebar entry pointing at a deleted page produces a link that resolves to VitePress's custom 404 page (`NotFound.vue`, already registered in `theme/index.x`) at runtime, which is a real user-facing dead-end the build cannot catch.
**Why it happens:** The dead-link collector only parses `.md` content links, never the theme config object (confirmed by source inspection — the `nav`/`sidebar` config, does not pass through `markdownToVue`).
**How to avoid:** After every nav/sidebar edit, grep `config.js` directly for the deleted path strings (`/ai-workflow`, `/photos`, `/blog/welcome`, `/blog/vite-plugins`) and confirm zero matches, independent of build success.
**Warning signs:** None from the build tool itself — this is a silent gap, which is exactly why it needs an explicit manual check step in the plan.

### Pitfall 4: Forgetting the orphaned `.wip-badge`/`.wip-notice` CSS after deleting `ai-workflow/index.md`
**What goes wrong:** PRUNE-10 is marked done because the visible "Work in Progress" text is gone, but the CSS rules at `custom.css:539-576` remain as dead code — not a user-visible bug, but a repo-hygiene miss that a stricter reading of PRUNE-10 ("no staleness language... remains anywhere") would flag.
**Why it happens:** CSS rule cleanup is easy to forget when the primary attention is on deleting the `.md` file that used the class.
**How to avoid:** Explicitly grep `custom.css` for `wip-` after the `ai-workflow/` deletion task and remove the matched rule blocks in the same task.
**Warning signs:** `grep -n "wip-" docs/.vitepress/theme/custom.css` returning any line after the deletion task claims completion.

## Code Examples

### Cloudflare Pages `_redirects` — the four rules this phase needs
```
# Source: developers.cloudflare.com/pages/configuration/redirects/ (syntax verified)
# Source: 02-CONTEXT.md locked mapping
/ai-workflow/*      /          301
/photos/            /          301
/blog/welcome        /blog/    301
/blog/vite-plugins   /blog/    301
```

### VitePress dead-link check — how to read a failure locally
```bash
# Source: node_modules/vitepress/dist/node/chunk-Cne7GbZY.js (renderStart hook)
npm run docs:build
# On failure, output includes lines like:
#   (!) Found dead link /ai-workflow/ in file docs/blog/index.md:12
#   ... followed by: Error: N dead link(s) found.
```

### Grep check for PRUNE-06/07 (not covered by the build)
```bash
# Run after every deletion + config edit; must return zero matches
grep -rn "/ai-workflow\|/photos\|/blog/welcome\|/blog/vite-plugins" docs/ \
  --include="*.md" --include="*.js" --include="*.vue" \
  --exclude-dir=dist --exclude-dir=node_modules
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|---------------|--------|
| Netlify-style `_redirects` conventions assumed to be identical across static hosts | Cloudflare Pages' `_redirects` shares syntax with Netlify's but has documented divergences (notably: cannot redirect `*.pages.dev` → custom domain; Pages Functions bypass `_redirects` entirely) | Ongoing — Cloudflare's docs explicitly call out the Netlify-similarity-but-not-identical framing | Don't copy a Netlify `_redirects` file assumption wholesale; verify against Cloudflare's own docs page, which this research did. |

**Deprecated/outdated:** None specific to this phase — VitePress 2.0.0-alpha.18 and the current `_redirects` format are both current as installed/documented at research time.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Cloudflare Pages `_redirects` rules apply normally when a custom domain is attached, with the sole exception being the documented `*.pages.dev`→custom-domain case | Pattern 1 / PRUNE-08 | If wrong, the four redirect rules could silently not fire on `qiankun.co.uk`, leaving hard 404s on deleted URLs. Mitigation: this is a routine, widely-documented Cloudflare Pages configuration (not an edge case) and the project's own custom domain is already live and stable per project constraints — but the plan should still include a post-deploy manual check (curl or browser-visit one deleted URL) before considering PRUNE-08 done, since this could not be verified with a live deployment in this research session. |

**If this table is empty:** N/A — one assumption logged above; everything else in this research (VitePress dead-link default, `_redirects` syntax/limits, sitemap/RSS regeneration behavior, component registration structure, `blog-posts.data.js` consumer count, PRUNE-07 link inventory) was verified this session either by reading the installed package source directly or by fetching the specific official Cloudflare documentation page.

## Open Questions

1. **Does the live Cloudflare Pages deployment actually apply the new `_redirects` rules correctly on first deploy?**
   - What we know: The syntax, placement, and general custom-domain behavior are all confirmed against official docs and this project's own build/deploy configuration.
   - What's unclear: Live edge behavior can only be confirmed by an actual deploy + request test, which this research session cannot perform (no ability to deploy).
   - Recommendation: The plan should include a post-deploy manual verification task — visit (or `curl -I`) one URL from each of the four redirect rules against the live `qiankun.co.uk` domain and confirm a `301` with the expected `Location` header, before PRUNE-08 is marked complete.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | `npm run docs:build` verification gate | Yes | v22 (confirmed via `node --version`, matches CI's `actions/setup-node@v4` node-version 22) | — |
| VitePress 2.0.0-alpha.18 | Build/dead-link check | Yes | Confirmed pinned in `package.json`, installed in `node_modules` | — |
| Cloudflare Pages (deploy target) | PRUNE-08 live verification | Indirect — deploy happens via GitHub Actions (`wrangler pages deploy`), not locally in this session | n/a | Manual post-deploy check (see Open Questions) |

**Missing dependencies with no fallback:** None — this phase needs nothing beyond the already-installed toolchain.

**Missing dependencies with fallback:** Live Cloudflare Pages request testing — cannot be performed from this research session; covered by the Open Questions recommendation above (manual post-deploy check).

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-------------------|
| V2 Authentication | No | Static site, no auth surface touched by this phase. |
| V3 Session Management | No | No session state involved. |
| V4 Access Control | No | No access-control logic in a static-content deletion phase. |
| V5 Input Validation | No (marginal) | `_redirects` destinations are all hardcoded internal paths (`/`, `/blog/`) authored by the developer, not derived from user input — no open-redirect surface is introduced. |
| V6 Cryptography | No | Not applicable to this phase. |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|----------------------|
| Open redirect via attacker-controlled `_redirects` destination | Tampering / Spoofing | Not a risk here — all four destinations are static, developer-authored, internal paths (`/`, `/blog/`), never derived from a query string or user input. No mitigation code needed; verify at review time that no destination is ever templated from a request parameter. |

## Sources

### Primary (HIGH confidence)
- `node_modules/vitepress@2.0.0-alpha.18/dist/node/index.d.ts:1864-1867` — `ignoreDeadLinks` type definition and `@default false` JSDoc, read directly from the installed package.
- `node_modules/vitepress@2.0.0-alpha.18/dist/node/chunk-Cne7GbZY.js:26240-26276, 30707-30772` — dead-link collection logic (per-`.md`-file, via `markdownToVue`) and the `renderStart` hook that throws `Error` on any collected dead link.
- `node_modules/vitepress@2.0.0-alpha.18/dist/node/chunk-Cne7GbZY.js:34311-34360` — `generateSitemap()`, confirming sitemap entries are derived from `siteConfig.pages` (the live on-disk page list) at every build.
- `node_modules/vitepress-plugin-rss@0.4.4/dist/index.mjs` — `getPostsData()`/`genFeed()`, confirming RSS entries are derived from `getVitePressPages(config)` (live on-disk page list) at every build, filtered by the existing `RSS_CONFIG.filter`.
- `docs/.vitepress/config.js`, `docs/.vitepress/theme/index.js`, `docs/index.md`, `docs/blog/index.md`, `docs/.vitepress/theme/custom.css`, `docs/.vitepress/data/blog-posts.data.js`, `docs/public/robots.txt`, `package.json`, `.github/workflows/deploy.yml` — all read directly this session.
- Grep of `docs/` (excluding `dist/`, `node_modules/`) for the four deleted-URL path prefixes — confirms exactly two surviving reference locations (`config.js`, `docs/blog/index.md`), matching the code_context claims in `02-CONTEXT.md`.

### Secondary (MEDIUM confidence)
- [Redirects · Cloudflare Pages docs](https://developers.cloudflare.com/pages/configuration/redirects/) [CITED] — `_redirects` syntax, splat/placeholder rules, 2,100 rule limit, file placement, Pages Functions caveat.
- [Custom domains · Cloudflare Pages docs](https://developers.cloudflare.com/pages/configuration/custom-domains/) [CITED] — apex/custom domain zone requirement.

### Tertiary (LOW confidence — per this session's classify-confidence tool, which rates all WebSearch/WebFetch-sourced content LOW regardless of the source being official docs)
- WebSearch summaries referencing the same Cloudflare Pages redirects/custom-domains documentation pages above — used only to locate and corroborate the Secondary sources; the underlying claims are the same official-docs content, but the retrieval method (search snippet vs. direct fetch) is rated lower by the classifier. Treated as consistent with, not contradicting, the Secondary sources.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new packages; existing pinned versions confirmed in `package.json`/`node_modules`.
- Architecture (dead-link check, sitemap/RSS regeneration, component registration): HIGH — all confirmed by direct inspection of installed package source, not documentation or memory.
- Cloudflare Pages `_redirects` behavior: MEDIUM — sourced from official Cloudflare documentation (CITED), but this session could not perform a live deploy to confirm edge behavior end-to-end (see Open Questions / Assumption A1).
- Pitfalls: HIGH — each pitfall traces to a specific, read line of installed source code or a specific grep result from this session, not a general pattern assumed from experience.

**Research date:** 2026-07-26
**Valid until:** 30 days (VitePress is pre-1.0/alpha and Cloudflare Pages' redirect engine is stable infrastructure; re-verify if either the VitePress version or the deploy pipeline changes before Phase 2 executes).
