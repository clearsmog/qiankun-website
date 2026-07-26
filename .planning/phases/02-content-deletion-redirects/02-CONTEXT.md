# Phase 2: Content Deletion & Redirects - Context

**Gathered:** 2026-07-26
**Status:** Ready for planning
**Mode:** Smart discuss (autonomous) — four grey areas resolved by user, one area at Claude's discretion

<domain>
## Phase Boundary

The site contains only the pages this milestone intends to keep, no stale pointer to a deleted page survives anywhere on the site, and every deleted URL redirects deliberately instead of dead-ending.

In scope: page deletion, nav/sidebar cleanup, internal link repair, `_redirects`, dead component removal, staleness-language removal, homepage feature-card and Recent-Posts restructuring.

Out of scope: rewriting the hero copy or tagline (Phase 4 — POS-*), any typography or token work (Phases 3–4), the Phase 1 console-gated items.

</domain>

<decisions>
## Implementation Decisions

### Redirect Strategy
- **All deleted URLs return 301 to the nearest relevant page.** No 410s. Preserves inbound link equity and never shows a visitor an error page — the URL is on a CV, so a dead-end is worse than a slightly-off destination.
- Mapping: `/ai-workflow/*` (all five) → `/`; `/photos/` → `/`; `/blog/welcome` → `/blog/`; `/blog/vite-plugins` → `/blog/`.
- `docs/public/_redirects` is Cloudflare Pages' native format: one rule per line, `/source /destination 301`. The file does not exist yet — this phase creates it.
- **Redirects ship in the same commit as the deletions** (PRUNE-08 is explicit). A commit that deletes pages without the redirect file leaves a window of hard 404s.

### Writing Section Presentation
- **Relabel only — keep `/blog/` URLs.** Nav entry and the `/blog/` page heading become "Writing"; the directory stays `docs/blog/` and the surviving post keeps `/blog/etrm-systems`. No renaming, no extra redirects for a page being kept.
- Remove `*More posts coming soon...*` from `docs/blog/index.md:18` (PRUNE-10).
- The `/blog/` index must not present as a dated feed. One post is fine as a body of writing; it is not fine as an abandoned stream.
- Sidebar `/blog/` section drops the "Vite Plugins" and "Welcome Post" entries, leaving "ETRM Systems".

### Homepage Restructuring
- **The features row keeps three cards; the two removed ones are replaced, not left as a hole.** A single card in a three-column grid reads as a rendering bug to a stranger — the exact opposite of this milestone's goal. Replacement cards should point at things that actually exist and matter to a finance reader: Projects, About, Contact is the safe default, but the specific trio is at Claude's discretion so long as every card links somewhere real.
- **The "Recent Posts" block is removed from the homepage entirely**, along with its `<script setup>` import of `./.vitepress/data/blog-posts.data.js` and the now-orphaned `.recent-posts` / `.post-card` / `.post-title` / `.post-desc` CSS in the page's `<style>` block. One post under a heading that implies a stream advertises infrequency.
- Check whether `docs/.vitepress/data/blog-posts.data.js` has any remaining consumer after this removal. If none, it is dead code and goes too.
- Hero copy (`Exploring the Universe of Code`, the tagline, the `Read the Blog` CTA text) is **NOT** touched here — that is Phase 4 POS work. Only the `features:` array and the Recent Posts block change.

### Deletion Inventory
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

</decisions>

<code_context>
## Existing Code Insights

### Verified by scan (2026-07-26)
- **All six `Svg*` components have ZERO tag usages** across every source markdown file — checked by tag name (`<SvgAreaChart` etc.), not import statements, because VitePress registers them globally so imports do not indicate use. PRUNE-09's stated verification method is satisfied: they are genuinely dead.
- Staleness language exists in exactly three places: `docs/ai-workflow/index.md:7` (`<span class="wip-badge">Work in Progress</span>`), `docs/blog/index.md:18` (`*More posts coming soon...*`), `docs/photos/index.md:279` (`::: tip Coming Soon`). Two of the three files are being deleted outright, so only the `blog/index.md` line needs a targeted edit. **The `.wip-badge` CSS rule in `custom.css` becomes orphaned when `ai-workflow/index.md` goes — remove it too, or PRUNE-10 is only cosmetically satisfied.**
- `docs/public/` is 3.2M, effectively all under `docs/public/projects/` — the case-study assets, which stay. There is no large photo-asset directory to remove; `docs/photos/index.md` is a single 291-line file.
- Nav is a flat 7-entry array in `docs/.vitepress/config.js`; sidebar is an object keyed by path prefix with three keys: `/projects/`, `/ai-workflow/`, `/blog/`.

### Files In Scope
- `docs/.vitepress/config.js` — nav array, sidebar object. **Also carries the Google Analytics head tags that Phase 1 plan 01-03 still owns — do not touch those.**
- `docs/index.md` — `features:` frontmatter array, `<script setup>` block, Recent Posts markup, `<style>` block
- `docs/.vitepress/theme/index.js` — `app.component(...)` registrations for the six Svg components
- `docs/.vitepress/theme/custom.css` — orphaned `.wip-badge` rule
- `docs/public/_redirects` — NEW

### Established Patterns
- Components are registered globally in `enhanceApp()` in `docs/.vitepress/theme/index.js`; deleting a component file without removing its registration breaks the build.
- `docs/public/` is static passthrough — files land at the site root unmodified.

</code_context>

<specifics>
## Specific Ideas

- Verify no internal link anywhere resolves to a deleted page (PRUNE-07) by grepping the surviving markdown for `/ai-workflow`, `/photos`, `/blog/welcome`, `/blog/vite-plugins` — including inside the `docs/projects/*` case studies and `about.md`/`contact.md`, not just the obvious nav config.
- After deletion, the site is: Home, About, Projects (index + 5 case studies), Writing (index + 1 post), Contact. Confirm the built `dist/` contains no `ai-workflow` or `photos` output.

</specifics>

<deferred>
## Deferred Ideas

- Hero name/text/tagline rewrite and the "Read the Blog" CTA — Phase 4 (POS-*).
- Design token consolidation — Phase 3.
- Phase 1's console-gated items (Amplify file deletion, GA removal, privacy page) remain outstanding and are tracked in STATE.md under Deferred Verification.

</deferred>
