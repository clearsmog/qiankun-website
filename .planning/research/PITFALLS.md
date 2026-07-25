# Pitfalls Research

**Domain:** Personal quantitative-finance portfolio site (VitePress/Vue static site) — brownfield polish of a LIVE, Google-indexed site before the URL goes on a CV to finance/energy hiring audiences
**Researched:** 2026-07-25
**Confidence:** MEDIUM-HIGH (impression/UX pitfalls are HIGH confidence — well-documented portfolio-review and hiring-signal patterns cross-checked against multiple sources; technical pitfalls (VitePress alpha migration specifics, Amplify/Cloudflare interplay) are MEDIUM confidence — general platform behavior is well documented, but this exact combination is project-specific and should be verified against this repo's actual config during planning)

## Critical Pitfalls

### Pitfall 1: The "generic tech portfolio" tell set — specific things read as amateur to a finance reader

**What goes wrong:**
A site can be visually clean and still fail the twenty-second test because finance/energy readers pattern-match on a different set of signals than developers do. The concrete tells, in order of how often they appear on dev-built portfolios:
- Charts with no axis units, no data-as-of date, no source/methodology note ("looks like a screenshot of a toy" rather than "looks like analysis")
- Inconsistent number formatting across case studies (one page shows "12.4%", another "0.124", another "12%" — a finance reader notices this instantly, it's their whole professional vocabulary)
- A bio that reads as a LinkedIn "About" auto-fill ("passionate about technology," "lifelong learner") rather than naming the actual credential stack (MSc Finance, FRM, WorldQuant BRAIN Gold) in plain declarative sentences
- Buzzword density without concrete outputs — "leveraged machine learning to optimize alpha generation" instead of "built N factor signals, backtested against M years of data, ranked in top X% of the BRAIN Challenge"
- Generic stock photography or no imagery discipline (a finance hiring manager has seen a thousand "person typing on laptop" hero images; it reads as templated)
- Missing or wrong social preview (Open Graph image/title) — when the link is pasted into an email or Slack by a recruiter, a broken or generic preview undercuts the click before it happens
- Case studies that read as coursework ("For this assignment...") rather than as decision-useful analysis — the framing verb matters as much as the content

**Why it happens:**
Developers polish what they can see easily (typography, spacing, color) and under-polish what requires domain fluency to notice (units, precision consistency, professional register of language). The two skill sets rarely live in the same person, so this is exactly the gap an engineer-turned-finance-professional site is likely to have — visually competent, financially unlabeled.

**How to avoid:**
Run every chart through a checklist: unit on axis, as-of date, one-line methodology note. Run every page's numbers through a find-all for inconsistent formats (grep for `%` and decimal patterns across `docs/projects/*.md`). Have the About/Contact/projects-index copy read by someone who reads finance CVs professionally, or explicitly benchmark sentence structure against the user's own CV language rather than generic personal-site copy. Set the OG image/title explicitly per page rather than relying on VitePress defaults.

**Warning signs:**
- Any chart where you can't answer "what is the unit and as of when" without reading surrounding prose
- Bio or project copy that could be pasted onto a different person's site unchanged
- Sharing the homepage URL into Slack/iMessage and getting a generic/broken preview card

**Phase to address:**
Position phase (copy/bio rewrite) and Design phase (chart formatting consistency) — this is the single highest-leverage pitfall for Core Value and should have its own explicit review step, not be left implicit in "rewrite framing."

---

### Pitfall 2: The minimal-homepage trap — confident-quiet vs. empty-and-unfinished

**What goes wrong:**
A minimal hero ("name + one line + straight into work") is the right call for this audience, but minimalism fails in a specific, recognizable way: when the "one line" is vague enough that a reader can't tell what they're about to see, or when there's a beat of dead space before the work starts (excess whitespace, a large empty hero block, a scroll-to-discover pattern) that reads as "there's not much here" rather than "this person doesn't need to shout." The failure mode is not "too little content," it's "too little *information density* per pixel." Minimal designs read as confident when every element that remains is doing real work (a precise one-liner, a tight list of case studies with real one-line descriptions); they read as unfinished/content-less when elements are minimal in *effort* rather than minimal in *design* — e.g., a one-liner that's abstract ("Exploring the intersection of markets and code") rather than concrete ("Quantitative finance case studies: portfolio construction, ESG scoring, equity valuation").
A second specific failure: minimal homepages that omit the standard orientation cues recruiters scan for in the first two seconds — current role/status, location/market focus, and what kind of work this is (buy-side research? trading? academic?). Omitting these because "the case studies will make it obvious" fails the 20-second reader, who does not click through before deciding whether to click through.

**Why it happens:**
"Minimal" is treated as a visual instruction (less on the page) rather than an information-design instruction (say more, using fewer words). It's easy to delete the credential-forward hero and just as easy to under-specify what replaces it, because the temptation after deciding "less claims-forward" is to under-write rather than to write tightly.

**How to avoid:**
Write the one-liner as a dense, concrete sentence that answers "who, what kind of work, what domain" in under 15 words — not a mood statement. Test it against the 20-second/cold-reader standard explicitly: could a stranger state back what this person does after reading only the hero? Keep the hero visually tight (no oversized empty hero block that pushes case studies below the fold on a laptop viewport) — minimal in ornamentation, not in scannability.

**Warning signs:**
- The one-liner uses words like "exploring," "passionate," "journey," "universe" — abstraction is doing the work vagueness should not be doing
- A reader cannot say, without scrolling, what category of professional this is
- The hero requires a scroll before any concrete content (case study titles) appears on a standard laptop viewport (~800px height)

**Phase to address:**
Position phase — this is exactly the "Replace the homepage hero" requirement; the acceptance test should be the 15-word/20-second checks above, not just "looks clean."

---

### Pitfall 3: Over-design risk — ECharts and gradient SVG turning the site into a designer's playground

**What goes wrong:**
The opposite failure from Pitfall 2. Because this site has a genuine, above-average asset (a real ECharts visualisation library with theme reactivity), the temptation during a "polish" pass is to lean into what's visually impressive rather than what's informationally appropriate for the audience. Concrete ways this happens: chart chrome (excessive animation on load/hover, decorative gradients on bars/donuts that don't encode data, tooltips styled more elaborately than the data justifies), too many chart *types* used for variety rather than because the data calls for it (a donut where a single number would do, a force-directed or fancy layout where a simple bar chart reads faster), gradient SVG iconography used as generic decoration rather than as a labeling aid, and inconsistent "look at me" flourishes (parallax, scroll-triggered reveals) that a finance reader — who wants to extract information, not be impressed by motion design — reads as time spent on the wrong thing. For this specific audience, restraint itself is a credibility signal: finance professionals' own dashboards (Bloomberg, internal risk tools) are famously utilitarian, and a portfolio that over-indexes on visual flourish can read as *misapplied priorities* to a hiring manager, i.e. "if this is where their attention went, is that the right instinct for a risk/research role?"

**Why it happens:**
Developers with a strong component library naturally want to show its range; "polish" gets conflated with "add more visual sophistication" rather than "remove what doesn't serve the reader." Nobody is the natural voice for "actually, cut that" during a solo polish pass.

**How to avoid:**
Apply a rule during the Design phase: every chart, gradient, or animation must be justified by "does this help a reader extract the number/insight faster," not "does this look good." Default entrance animations to none-or-minimal (a 150–200ms fade, not a staged reveal); reserve emphasis (color, motion) for the one number per case study that matters most. Audit gradient SVG icon usage — icons should disambiguate categories (e.g., "equity" vs "ESG" vs "valuation" case study types), not decorate. When in doubt, prefer the plainest chart type that carries the data.

**Warning signs:**
- Any chart animation lasting >300ms or replaying on every scroll-into-view
- A gradient or color used on a chart element that doesn't map to a data dimension
- More than one visually "showcase" element (an elaborate hero visualization, a parallax section, a decorative full-bleed graphic) on a single page
- Spending more polish time on chart chrome than on the sentence explaining what the chart shows

**Phase to address:**
Design phase — pair the "make chart styling consistent" requirement with an explicit restraint pass, not just a consistency pass.

---

### Pitfall 4: Staleness signals undermine a site that will not be updated for months

**What goes wrong:**
The site ships once and is then likely untouched for months while still being the live link on an active CV. Staleness reads through several concrete, easily-missed signals: a hardcoded copyright year that will go out of date within the current calendar year; "last updated" timestamps on pages that will freeze at ship date and start counting backward in the reader's head ("last updated 4 months ago" reads worse than no date at all); any residual "coming soon" / "work in progress" language (exactly what's being deleted from AI Workflow, but check the rest of the site for the same pattern — WIP badges, "more posts coming," empty placeholder sections); a blog with two posts and an obvious multi-month gap between them and "today," which invites the reader to infer inactivity; and RSS/sitemap feeds that surface a last-build date recruiters could stumble on via view-source. A site that looks actively maintained ages better than one that makes claims about currency it can't keep.
Corollary: over-committing to freshness backfires too — a real "last updated" stamp that isn't kept current is worse than no stamp at all, since it actively demonstrates neglect rather than just being silent about it.

**Why it happens:**
"Last updated" stamps and copyright years are common site conventions copied in without considering the maintenance cadence of this specific project (ship-and-leave, not continuously iterated).

**How to avoid:**
Don't add per-page "last updated" timestamps unless there's a real intent to keep them current (there isn't, per Out of Scope: "blog cadence... is a separate concern"). Use a copyright pattern that doesn't need editing (`© Qiankun Zhu` with no year, or a build-time-injected year via VitePress config rather than a hardcoded string, so at minimum it's never *wrong* even if not actively "fresh"). Remove all "coming soon"/WIP language sitewide, not just in the section being deleted — grep the whole `docs/` tree for "coming soon," "work in progress," "WIP," "under construction," "TBD." For the blog, either frame the two remaining posts so they don't read as an abandoned cadence (no "Part 1 of a series" framing without a Part 2), or consider whether a blog index with only two dated posts several months apart needs a framing adjustment (e.g., presented as "notes" rather than as an implied-recurring blog).

**Warning signs:**
- Any hardcoded 4-digit year outside of a build-time template variable
- Any string containing "coming soon," "WIP," "TBD," "under construction," "more soon"
- A blog index where the gap between the two posts' dates and today's date is conspicuous without narrative framing

**Phase to address:**
Prune phase (remove WIP language sitewide, not just in the deleted section) and Design phase (footer/copyright treatment) — flag as a sitewide grep-and-fix task, not folded silently into the AI Workflow deletion.

---

### Pitfall 5: Consistency failures from a partial rewrite — rewritten homepage next to untouched inner pages

**What goes wrong:**
Because this milestone explicitly keeps case-study *content* as-is while rewriting homepage/About/projects-index *framing* and overhauling *typography/visual design* sitewide, there's a real risk that the visual-design overhaul lands unevenly: a genuinely fresh, tight homepage sitting above case studies that still carry old heading hierarchies, old spacing rhythm, or old chart formatting that wasn't included in the "make chart styling consistent" pass. A reader who lands on the polished homepage and clicks through to a case study that feels visually a half-step behind gets a subtle but real "this was patched, not designed" impression — inconsistency reads as more unprofessional than uniform mediocrity, because it signals incomplete attention rather than a consistent choice.
Concrete places this bites on this codebase: the five case studies plus two blog posts plus About/Contact are markdown files that may each have accumulated slightly different heading levels, callout/admonition usage, or inline chart component configuration (e.g., some using `VizPanel` wrappers and others not, some specifying explicit chart height/theme props and others relying on defaults) — a sitewide typographic system change (new typeface/scale/rhythm) applied only via global CSS will still leave content-level inconsistencies (e.g., an H2 used for what's an H3 elsewhere) untouched.

**Why it happens:**
"Establish a considered typographic system" and "apply consistent spacing/hierarchy across all remaining pages" are treated as CSS-level changes, but markdown content structure (heading levels, component usage patterns) also needs a pass, because a global stylesheet can't fix a page that uses the wrong heading level for its position in the hierarchy.

**How to avoid:**
After the typographic system lands, do one explicit pass over every remaining markdown file's heading structure and chart component invocations (props, wrapper usage) — not just a CSS review. Build a one-page "component/heading usage" checklist (H1 usage, H2/H3 nesting, whether each chart specifies theme/height explicitly or relies on a default that might drift) and check every page against it in one sitting, back-to-back, so drift is visible by direct comparison rather than page-by-page in isolation.

**Warning signs:**
- Viewing two case studies side by side (two browser tabs) and seeing different vertical rhythm, heading sizes, or chart card padding
- A chart on one page that looks visually "louder" (bigger, more color) than an equivalent chart on another page for no data-driven reason
- The homepage feeling like a different site from the case study it links to

**Phase to address:**
Design phase — add "cross-page consistency pass, viewed side by side" as an explicit verification step, distinct from "apply the typographic system," since the latter can pass CSS review while the former still fails.

---

### Pitfall 6: Mobile breakage on data-heavy ECharts pages

**What goes wrong:**
Recruiters and hiring managers routinely open a CV link on a phone (checking a candidate between meetings, on a commute). ECharts and dense financial visualisations have well-known mobile failure patterns: charts rendered at a fixed pixel width that overflow the viewport and force horizontal scroll; touch targets for hover-only tooltips that never appear (desktop hover interactions have no mobile equivalent unless explicitly handled, so key data-point detail becomes undiscoverable, not just harder to reach); legend/label text that's readable at desktop width but overlaps or truncates once the chart's container shrinks to phone width (ECharts doesn't auto-re-lay-out labels on resize unless the component explicitly recalculates `dataZoom`/label rotation at breakpoints); multi-series charts (the board diversity/ESG or factor-research case studies likely have several) becoming an unreadable wall of overlapping color at 360px wide; and slow first paint on mobile connections if ECharts' full bundle plus theme-detection mutation observers all fire before content is visible.
This is a first-impression risk specifically because it's invisible in desktop-only QA — the exact review method ("looks fine, ship it") most likely to be used under time pressure will not catch it.

**Why it happens:**
Chart components are usually built and tested at a developer's desktop resolution; mobile responsiveness for canvas/SVG-based chart libraries requires explicit resize handling (ECharts needs `resize()` calls wired to a container `ResizeObserver` or window resize event, plus responsive option overrides for small widths) that's easy to skip because desktop looks correct.

**How to avoid:**
Explicitly test every case study page at a real narrow viewport (375px, e.g. iPhone SE/mini width) — not just Chrome DevTools' generic "mobile" toggle at a wider simulated width — for every distinct chart type in the library (EBar, ELine, EDonut, HeroMetrics, VizPanel-wrapped charts). Verify: no horizontal scroll on the page from a chart overflowing its container; legends either stack/wrap or the chart switches to a mobile-appropriate config (fewer visible series, rotated or abbreviated labels); tap (not hover) surfaces the same tooltip data hover does on desktop; and initial render doesn't visibly jank while data loads. Wire an actual resize handler if one isn't already present per component (check `VizEChart.vue` and each `E*.vue` component for a resize/ResizeObserver hookup, not just theme-change observers).

**Warning signs:**
- Any chart page that requires horizontal scrolling on a 375px-wide viewport
- Tooltips or key values only accessible via mouse hover with no tap equivalent
- Legend text overlapping or extending past the chart's visible bounds at mobile width

**Phase to address:**
Design phase ("Verify the result on mobile and in dark mode" already listed) — this pitfall means that verification step needs a concrete per-component checklist and testing on an actual narrow viewport, not a cursory phone check of the homepage only.

---

### Pitfall 7: Deleting indexed pages without correct HTTP status handling breaks SEO and live inbound links

**What goes wrong:**
Four content areas are being deleted from a site that's already indexed by Google (AI Workflow — 5 pages, Photos gallery, the `welcome` blog post, plus internal links/nav entries pointing at them). On a VitePress static site, simply removing the markdown source files means the build no longer emits those HTML files — but Cloudflare Pages will then return a plain **404** for any request to the old URL (its own catch-all, not a considered response), and until Google recrawls, those URLs remain in Search Console/the index and can keep surfacing in search results or get clicked from cached links, browser history, or any external site that happened to link them (the "AI Workflow" section in particular is the kind of content that gets picked up by aggregators). A 404 does eventually get the URL dropped from the index, but Google's re-crawl of a low-traffic personal site is not fast or guaranteed on any particular timeline, and a bare 404 with no site navigation is a dead end for a recruiter who followed an old link (from a cached search result, a bookmark, or a previous CV version) — exactly the "finds nothing that undermines it" failure the Core Value calls out. A deliberate **410 Gone** communicates permanent removal more decisively and gets de-indexed meaningfully faster with fewer repeat crawl attempts, but VitePress + Cloudflare Pages static hosting has no default mechanism to serve a custom 410 for specific removed paths — it requires an explicit Cloudflare rule (a Worker, a `_redirects`/`_headers` rule, or Pages Functions) since there's no server-side app to add route-level status codes to.

**Why it happens:**
Static-site deletions are usually treated as "delete the file, done" because there's no server process to configure — the status-code layer is invisible until someone checks what a deleted URL actually returns.

**How to avoid:**
Before deleting, enumerate every URL being removed (AI Workflow's 5 pages, Photos gallery path(s), the `welcome` post's permalink) and decide the handling per URL: if any deleted content has a natural replacement (e.g., a Photos gallery reader might reasonably want the homepage or About instead), add a Cloudflare Pages `_redirects` rule as a 301 to the closest relevant surviving page rather than a dead end — this preserves user journey and passes along any residual link equity. Where there's no sensible redirect target (AI Workflow has no natural replacement), configure an explicit 410 via a Cloudflare Pages `_redirects` file (Cloudflare supports custom status codes in `_redirects`, e.g. `/ai-workflow/* /  410`) rather than relying on the platform's default 404. After deploying, submit the affected URLs for removal in Google Search Console's "Removals" tool (temporary hide, faster than waiting for organic recrawl) and regenerate/resubmit the sitemap so it no longer lists the removed URLs (VitePress's sitemap plugin should regenerate automatically on rebuild, but confirm it doesn't cache a stale list). Finally, grep the entire `docs/` tree (nav config, sidebar config, homepage cards, footer, any cross-links inside case studies or blog posts) for links to the four removed areas — internal 404s are a worse tell than external ones, since they show up on the very click-path a recruiter is on.

**Warning signs:**
- Visiting any of the ~7+ deleted URLs post-deploy and getting the platform's generic 404 rather than a deliberate choice
- `grep -r` across `docs/` still returning references to `/ai-workflow`, `/photos`, or `/blog/welcome` after the deletion commit
- Google Search Console still showing the deleted URLs as indexed weeks after deploy with no removal request filed
- The sitemap.xml (check post-build in `dist/`) still listing removed paths

**Phase to address:**
Prune phase — add "verify HTTP status + redirect/410 handling for every removed URL" and "submit Search Console removal + resubmit sitemap" as explicit, checkable steps, not implied by "delete the page."

---

### Pitfall 8: VitePress alpha → stable migration breaks the live build or changes output unexpectedly

**What goes wrong:**
The site runs `VitePress 2.0.0-alpha.18`. Moving off an alpha pre-release (either to the stable `1.6.4` line or to a later, more mature `2.0` release once one exists) is not a patch bump — alpha releases of a major version commonly carry config-schema changes, plugin-compatibility changes (this site uses `vitepress-plugin-rss`, `vite-plugin-pwa`, `vite-plugin-imagemin`, and Vue components registered globally via the theme's `enhanceApp`), and Vite version alignment requirements (this project is already on Vite 8, itself a very new major version — VitePress's supported Vite range for a given release must be checked, since VitePress and Vite ship on independent timelines and an incompatible pairing can fail at build time or, worse, succeed but change dev-server/build behavior silently). Concretely, a downgrade to `1.6.4` is not guaranteed to be forward-compatible with config or component patterns written against the `2.0.0-alpha` line (theme config shape, markdown extension defaults, and internal APIs used by `enhanceApp`/`Theme` extension points have changed across the 1.x→2.x line), meaning a mechanical version bump can either fail the build outright (safe, loud) or succeed while silently breaking something narrower — a plugin no longer processing frontmatter the same way, the RSS feed's date parsing behaving differently, or PWA manifest generation emitting a different output shape.

**Why it happens:**
Alpha-to-something-else migrations get treated like routine dependency bumps ("just update package.json") because the app builds fine locally; the risk surfaces only when a specific plugin or config path that worked by alpha-specific behavior stops working, and that's easy to miss without deliberately re-testing every subsystem (routing, RSS, sitemap, PWA, dark mode, chart theme reactivity) after the bump, not just confirming `npm run docs:build` exits zero.

**How to avoid:**
Do this migration in isolation from the visual/content changes, on its own branch, before or clearly separated from the design overhaul — so if something breaks, it's obvious which change caused it. Read the actual changelog entries between the current alpha and the target version (VitePress's own CHANGELOG on GitHub, not a summary) for breaking changes specifically flagged, especially around theme config, markdown-it extensions, and the sitemap/PWA plugin interaction points this site depends on. After bumping, don't just build — run the dev server and manually click through every distinct page type (homepage, a case study with charts, blog post, 404 page) checking dark-mode toggle, chart rendering, and RSS/sitemap output (`curl localhost:PORT/feed.rss` and check `sitemap.xml` in the built `dist/`) before merging. Keep the previous working `package-lock.json`/lockfile commit identified and easily revertible (a tagged commit or a documented `git revert` target) so if the live deploy breaks post-migration, rollback is a known single command, not an investigation.

**Warning signs:**
- `npm run docs:build` succeeding but the RSS feed, sitemap, or PWA manifest silently changing shape (fewer entries, missing fields) versus a pre-migration snapshot
- Any console warning during build referencing deprecated theme config keys
- Chart theme-reactivity (light/dark mode swap) breaking only after the migration, since `enhanceApp`/global component registration is exactly the kind of internal API surface that shifts across major versions
- Vite peer-dependency warnings appearing that weren't present before (a sign the VitePress/Vite version pairing isn't the one that combination was tested against)

**Phase to address:**
Technical credibility phase — sequence this migration *before* the typography/design overhaul (so design work lands on the stable base, not on top of a migration that might still need fixing) and treat "manually verified every page type post-migration" as the acceptance criterion, not "build succeeds."

---

### Pitfall 9: "Unused" SVG components deleted while still referenced by markdown-registered global tags

**What goes wrong:**
Six legacy SVG chart components (`SvgAreaChart`, `SvgHBars`, `SvgDonut`, `SvgForest`, `SvgFootballField`, `SvgScorePath`) are believed unused and are globally registered in `docs/.vitepress/theme/index.js`. The trap: a `grep` for the component's *import* or *registration* will only ever find the one place it's globally registered (which is expected and will always show a hit) — it tells you nothing about whether any `.md` file actually *invokes* the component as a Vue tag (e.g., `<SvgForest :data="..." />` written directly in markdown prose). VitePress's markdown-to-Vue compilation treats globally-registered components as available by tag name anywhere in any markdown file, with no import statement in the markdown itself to grep for — so "search for imports of SvgForest" will always come back empty regardless of usage, and is not evidence of anything. The actual risk: deleting a component still referenced in a markdown file breaks that page's build (a missing-component render error) or, worse if VitePress fails soft, renders a blank gap where the chart was — on a page that might not get manually re-reviewed in this same pass if it's not one of the pages otherwise being touched.

**Why it happens:**
"Grep for usage" instinctively means "grep for import/require statements," which is the correct check for JS-only dependencies but is exactly the wrong check for globally-registered Vue components consumed from markdown, since there is no import to find in the markdown source.

**How to avoid:**
Grep for the component tag itself, as it would appear in markdown/JSX, across every `.md` file in `docs/` — both PascalCase and kebab-case forms, since Vue/VitePress markdown accepts either (e.g., search for `SvgAreaChart|svg-area-chart`, `SvgHBars|svg-h-bars`, `SvgDonut|svg-donut`, `SvgForest|svg-forest`, `SvgFootballField|svg-football-field`, `SvgScorePath|svg-score-path`, repeated per component) rather than searching component source files for imports. Run this grep across `docs/**/*.md` specifically, not just `docs/.vitepress/`. Additionally do a full local build (`npm run docs:build`) after removing each component's registration (not just its file) and check for build errors or warnings about unresolved components — VitePress/Vue will typically warn at build or render time if a tag has no matching registered component, which is a second independent verification layer beyond the grep. Delete one component at a time (or in one batch) followed immediately by a full build+visual spot-check of all case study and blog pages, rather than deleting all six and the registration block in a single commit with no intermediate verification point — this makes it trivial to `git revert` the one component that turns out to be used, rather than debugging which of six deletions broke the build.

**Warning signs:**
- Grepping only `docs/.vitepress/theme/index.js` and component source files, not `docs/**/*.md`, and calling that "verified unused"
- A build that succeeds with a console warning like "Failed to resolve component" — VitePress may not hard-fail on this, so it's easy to miss if only checking exit code
- A visual gap or empty space on a page where a chart used to render, discovered only much later because that page wasn't part of the active review set this milestone

**Phase to address:**
Technical credibility phase — the "verify nothing references them" step should be specified as "grep component tag names across all markdown, not import statements" plus "full build with warnings surfaced" — this exact distinction should be written into the phase's acceptance criteria, since it's the one most likely to be silently skipped.

---

### Pitfall 10: Decommissioning one of two live deploy pipelines risks taking down the actual authoritative one

**What goes wrong:**
Two deployment pipelines currently run independently and can both deploy on every push to `main`: Cloudflare Pages via GitHub Actions (the documented primary, serving `qiankun.co.uk` per DNS) and AWS Amplify (secondary/backup, auto-deploying from the same branch, using `npm run docs:build` with `--legacy-peer-deps`). The stated plan is to decommission Amplify and keep Cloudflare Pages. The concrete risks in getting this backward or leaving it half-done: (a) if the custom domain `qiankun.co.uk`'s DNS is *actually* pointed at Amplify (or split — e.g., an old CNAME/A record still resolving to Amplify's endpoint from an earlier setup, with Cloudflare only serving a subdomain or not yet fully cut over), deleting the Amplify app would take the live site down entirely, not just remove a redundant backup; (b) even if DNS is correctly on Cloudflare, deleting Amplify without first confirming *current* DNS records (not "as documented," but as actually configured in the DNS provider/registrar) risks discovering the documentation is stale; (c) Amplify's build artifacts/CDN cache can continue serving a stale cached version of the site for some time after the Amplify app is deleted or the domain is detached, so a "it's still showing the old site" report immediately after cutover doesn't necessarily mean cutover failed — but also might mean exactly that, and the two cases need to be distinguishable; (d) removing `amplify.yml`/`deploy.sh` from the repo before confirming Amplify is fully detached from the domain leaves no way to redeploy to it as an emergency fallback if Cloudflare has an outage during the transition window.

**Why it happens:**
"We have two deploy pipelines, pick one" reads as a config/repo cleanup task, but the actual risk lives in DNS state and CDN cache state, which are external to the repo and not visible from reading `amplify.yml` or the GitHub Actions workflow file — the documentation describing "Cloudflare Pages (Primary)" can be aspirational or outdated relative to what the registrar/DNS actually resolves today.

**How to avoid:**
Before touching any config, independently verify current DNS resolution for `qiankun.co.uk` (e.g., `dig qiankun.co.uk` / `dig www.qiankun.co.uk` or an online DNS checker) and confirm the records point at Cloudflare's Pages endpoint, not an Amplify CloudFront/App Runner domain — do not rely on the CONCERNS.md label of "Primary/Secondary," verify it live. Only after confirming DNS is 100% on Cloudflare: (1) disable Amplify's auto-deploy webhook/branch trigger first (stops new deploys without deleting anything), (2) wait and re-verify the live site is unaffected and still resolves correctly for a period, (3) only then delete the Amplify app itself and remove `amplify.yml`/`deploy.sh` from the repo in a separate, later commit. Keep a rollback note (which Amplify app ID, region, and how it was configured) somewhere outside git history until fully confident, in case a fast rollback is needed inside the transition window. After final cutover, hard-refresh and check the live site from a network that hasn't cached it recently (or use a cache-busting query string / different device) to distinguish "still on old CDN cache, will clear shortly" from "actually broken."

**Warning signs:**
- `dig`/DNS lookup returning anything other than Cloudflare's expected Pages hostnames/IPs before starting decommission
- Amplify console showing a build that ran *more recently* than the last known Cloudflare deploy (a sign Amplify may be doing more than "backup" work)
- The live site showing stale content immediately after Amplify deletion in a way that doesn't resolve after a reasonable cache-clear wait

**Phase to address:**
Technical credibility phase — sequence as its own small, isolated step (verify DNS → disable trigger → observe → delete app → remove repo files) rather than a single "consolidate to one pipeline" commit, specifically because this is the one change in the whole milestone that can take the live site down outright if done in the wrong order.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|-----------------|-----------------|
| Keep `--legacy-peer-deps` instead of resolving actual peer conflicts | Unblocks `npm install`/CI immediately | Masks real incompatibilities that can surface as runtime bugs at the worst moment (e.g., mid-migration); makes future upgrades riskier since nobody knows which conflicts are "real" | Never, for a milestone whose explicit goal is technical credibility — this is called out as a requirement to fix, not defer |
| Ship the VitePress alpha→stable migration in the same commit/PR as the design overhaul | Fewer PRs to manage | If something breaks post-deploy, can't tell whether it's the migration or the redesign that caused it, doubling debugging time on a live site | Never — always separate |
| Leave `deploy.sh`'s interactive prompts in place "for emergencies" after consolidating to one pipeline | Keeps a manual escape hatch | An interactive script that nobody has run in months is exactly the kind of thing that fails silently (stale AWS creds, renamed app) when actually needed in an emergency | Acceptable only if explicitly tested once after consolidation, then documented as untested-after-that-point |
| Add cookie consent banner styling/copy quickly without wiring actual GA script gating | Ships a visible consent UI fast | Cosmetic consent (banner present, tracking already firing regardless of choice) is a worse compliance position than no banner, since it actively misrepresents the site's behavior to the user | Never |
| Defer the "minimal test/check layer" requirement given it's a "nice to have" | Saves setup time this milestone | A build-breaking regression (e.g., from the VitePress migration or component deletion) ships to the live CV-linked site with nobody noticing until a recruiter hits it | Acceptable to keep minimal (e.g., a build-succeeds + link-check CI step) but not to skip entirely, given the migration and deletions happening in the same milestone |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|-----------------|-------------------|
| Google Analytics (GA, tag `G-4PF046MSJJ`) | Adding a consent banner UI but leaving the GA script tag unconditionally injected in `<head>` (current state per `config.js:131-142`) — banner becomes decorative | Gate the GA script injection itself behind consent state (don't render/inject the script tag at all until consent granted, or use Google's Consent Mode v2 with `default` set to `denied` before any other script runs, then `update` on consent) — verify by checking Network tab for GA requests *before* clicking "Accept" |
| Cloudflare Pages `_redirects`/custom status codes | Assuming a static host has no way to serve non-200/404 status codes for specific paths | Cloudflare Pages supports custom status codes and redirects via a `_redirects` file (e.g., `/old-path/* /  410`) — use this for deleted-page handling instead of accepting the platform default 404 |
| VitePress sitemap plugin | Assuming the sitemap auto-updates correctly and not checking the built `dist/sitemap.xml` after removing pages | Always inspect the actual generated `sitemap.xml` post-build after any page deletion — confirm removed URLs are gone and no broken/duplicate entries were introduced |
| AWS Amplify auto-deploy webhook | Deleting the Amplify app directly as the first decommission step | Disable the branch auto-deploy trigger first, observe, then delete the app — see Pitfall 10 |
| `vite-plugin-pwa` / Workbox service worker | Redesigning CSS/assets and expecting visitors to see changes immediately | Service worker caching (`autoUpdate` registerType) can serve a stale cached shell to repeat visitors for a period after deploy; after major visual changes, verify via an incognito window or by checking the SW update lifecycle, not just a fresh browser tab that may have no prior cache |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|-----------------|
| ECharts full bundle + per-component theme-mutation observers loading on every page, even non-chart pages | Slower Time-to-Interactive on mobile/3G, especially first load; duplicate observers per component compound the cost (already flagged as a duplicate-observer issue in CONCERNS.md) | Consolidate theme observation into a single shared composable (already a listed requirement); confirm ECharts modules are tree-shaken to only the chart types actually used (bar/line/donut/heatmap etc.), not the full library | Noticeable on mobile/throttled connections immediately at current scale — this is a first-impression risk today, not a future-scale concern |
| Render-blocking `@import` for Google Fonts in `custom.css:7` | Extra round-trip before text renders; contributes to layout shift if fallback metrics don't match | Self-host the chosen typeface as WOFF2, `<link rel="preload" as="font" crossorigin>` the critical weight, and use `font-display: swap` (or `optional` if willing to accept occasional fallback-only render) rather than a CSS `@import` from Google Fonts | Breaks the first-impression window (LCP/CLS) on every visit, most visibly on mobile — directly relevant since the whole milestone is redoing typography |
| Chart entrance/hover animations replaying or triggering re-render on every dark-mode toggle (compounded by the duplicate mutation-observer issue) | Visible jank when toggling dark mode, worse on lower-powered devices/mobile | Fix in the same pass as the theme-observer consolidation (Pitfall/debt item above); ensure animations don't re-trigger from a theme-class change alone | Same as above — present now, not a future threshold |
| Image optimization only happening at build time via `vite-plugin-imagemin`, with no CI budget/monitoring on output size | Bundle/asset size can creep upward over future edits with nobody noticing (flagged in CONCERNS.md, explicitly Out of Scope for this milestone as "not needed for a site of this size") | Accept as out of scope per PROJECT.md, but do a one-time manual check of `dist/` asset sizes after this milestone's changes land, given a full typography and possibly font-asset change is happening | Only relevant if this site's growth trajectory changes — reasonably deferred per Out of Scope |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Cookie consent banner that visually blocks nothing (GA fires regardless of choice) | GDPR/UK-GDPR non-compliance exposure; misrepresents tracking behavior to the user, which is a worse legal position than no banner at all | Gate the actual script injection/execution behind consent state, verified in DevTools Network tab, not just verified by "the banner renders" |
| Cloudflare Account ID hardcoded in `.github/workflows/deploy.yml` (`0a5ceee99ef2f0c3f66bb55ff5adf359`) | Low risk alone (account ID isn't a credential), but poor secrets hygiene sets a bad precedent, especially on a repo a hiring manager might browse (the CV audience for this site skews toward people who might poke at the linked GitHub repo) | Move to a GitHub Actions secret (`${{ secrets.CLOUDFLARE_ACCOUNT_ID }}`) — cheap fix, and this repo may get more scrutiny than a typical hobby project given its purpose |
| No schema/format validation on blog/case-study frontmatter dates | A malformed date silently breaks sort order or `Invalid Date` renders somewhere on a page that isn't checked before publish | Low priority per CONCERNS.md, but worth a quick manual check of all frontmatter dates during the polish pass, since date-sorting bugs are exactly the kind of "small tell" that undermines a supposedly-polished site |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-------------------|
| Hover-only chart tooltips with no touch equivalent | Mobile visitors (a large share of recruiter first-clicks) silently lose access to the data points that make the chart meaningful, with no visible error — they just see a static chart and assume that's all there is | Explicitly wire tap-to-show-tooltip behavior for touch devices in the shared chart composable |
| Vague, mood-based hero copy ("Exploring the Universe of Code" — the current line being replaced) | Reader can't state what this site is about after reading it; increases bounce risk in the critical first seconds | Concrete, information-dense one-liner naming the actual domain (quant finance case studies) — see Pitfall 2 |
| Inconsistent number/percentage formatting across case studies | A finance-literate reader notices immediately; reads as "didn't proofread for the audience that actually matters" | One formatting convention (decimal places, % vs decimal, currency symbol placement) applied and grep-checked across every case study |
| Sitewide leftover "coming soon"/WIP language outside the section explicitly being deleted | Undermines the "nothing that undermines it" bar even in areas untouched by this milestone's listed prune targets | Sitewide grep for WIP/placeholder language as part of the Prune phase, not scoped only to the four named deletions |
| Animations that don't respect `prefers-reduced-motion` | A subset of visitors get motion they explicitly opted out of at the OS level — accessibility failure that also, for this audience, reads as inattention to detail | Audit and gate all custom transitions/animations behind the media query, as already listed in Active requirements — treat as blocking, not optional |

## "Looks Done But Isn't" Checklist

- [ ] **Deleted pages:** Often missing correct HTTP status handling — verify each removed URL returns a deliberate 410 (or 301 to a sensible replacement) rather than the platform's default 404, and that Search Console removal + sitemap resubmission actually happened
- [ ] **"Unused" component deletion:** Often verified only by grepping import statements — verify instead by grepping the component's tag name across all markdown files, and by a full build with warnings surfaced, not just exit-code-zero
- [ ] **VitePress migration:** Often verified only by "the build succeeds" — verify by manually clicking through every distinct page type (homepage, case study with charts, blog post) checking dark mode, chart theme reactivity, RSS feed, and sitemap output before and after
- [ ] **Deploy pipeline consolidation:** Often verified only by reading `amplify.yml`/workflow files — verify by an actual DNS lookup confirming Cloudflare is authoritative before touching Amplify, and by disabling the Amplify trigger before deleting the app
- [ ] **GA consent gating:** Often verified only by "the banner shows up" — verify by checking the Network tab for analytics requests before any consent choice is made
- [ ] **Mobile chart rendering:** Often verified only on a desktop browser's simulated-mobile mode at a wide breakpoint — verify at an actual narrow width (375px) for every distinct chart component, checking for horizontal overflow and touch-accessible tooltips
- [ ] **Cross-page consistency:** Often verified only against a style guide/CSS review — verify by opening two case studies side by side and comparing heading hierarchy, spacing rhythm, and chart chrome directly
- [ ] **Font loading:** Often verified only by "it looks right once loaded" — verify by checking for FOUT/CLS on a throttled connection (DevTools network throttling) and confirming `font-display` and preload tags are actually present in the built output
- [ ] **Social/link previews:** Often overlooked entirely — verify the Open Graph title/description/image render correctly when the homepage and at least one case study URL are pasted into Slack/iMessage/email

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|----------------|------------------|
| VitePress migration breaks the live build | MEDIUM | Revert to the last known-good commit/lockfile (identify this before starting, per Pitfall 8's prevention); redeploy; retry the migration in isolation with closer per-subsystem verification |
| Deleted SVG component breaks a markdown page's build/render | LOW | `git revert` the single component-deletion commit if deletions were done incrementally (per Pitfall 9's prevention); re-add the component and its registration, then find and fix (or intentionally rewrite) the markdown reference before re-attempting deletion |
| Amplify decommission takes the live site down | HIGH | If DNS was actually pointed at Amplify, re-enable the Amplify app/trigger immediately as a stopgap while re-pointing DNS correctly to Cloudflare Pages; this is why disabling-then-observing before deleting (Pitfall 10) is worth the extra step, since a disabled-but-not-deleted Amplify app can be re-enabled in minutes, while a deleted app cannot |
| Deleted page still gets traffic/complaints post-launch (broken link somewhere external) | LOW | Add a targeted 301 redirect from the specific broken URL to the most relevant surviving page via Cloudflare `_redirects`, rather than leaving it as a dead 410 once real inbound traffic to that specific URL is observed |
| GA consent implementation found to be firing before consent after launch | LOW-MEDIUM | Immediately gate the script (emergency fix, deployable same day on a static site); no user data "recall" is possible, but stopping further non-consented collection promptly limits ongoing exposure |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|-------------------|----------------|
| Generic tech-portfolio tells (units, formatting, buzzwords, bio) | Position phase | Chart-by-chart unit/date/methodology checklist; number-format grep across case studies; bio read against actual CV language |
| Minimal-homepage trap | Position phase | 15-word/20-second concreteness test on the hero one-liner; no-scroll-to-first-content check on laptop viewport |
| Over-design risk (ECharts/gradient SVG) | Design phase | Every animation/gradient justified against "does this help extract the data faster"; entrance animations capped at ~200ms |
| Staleness signals (copyright, WIP language, last-updated stamps) | Prune phase (sitewide WIP grep) + Design phase (footer/copyright treatment) | Sitewide grep for "coming soon"/"WIP"/hardcoded year; confirm no stale "last updated" stamps introduced |
| Cross-page consistency failures | Design phase | Side-by-side comparison of all remaining pages' heading hierarchy, spacing, and chart chrome after the typographic system lands |
| Mobile ECharts breakage | Design phase | Per-component test at 375px width: no horizontal overflow, tap-accessible tooltips, legend doesn't overlap |
| Deleting indexed pages without status/redirect handling | Prune phase | Each removed URL returns a deliberate 410/301, not a default 404; Search Console removal filed; sitemap re-verified post-build |
| VitePress alpha→stable migration | Technical credibility phase | Manual click-through of every page type (chart theme reactivity, RSS, sitemap, dark mode) before/after, done as its own isolated step |
| "Unused" component deletion verification | Technical credibility phase | Grep component tag names (not imports) across all markdown; full build with warnings surfaced; incremental deletion with intermediate builds |
| Deploy pipeline decommission | Technical credibility phase | DNS lookup confirms Cloudflare authoritative before touching Amplify; disable trigger before delete; observe before removing repo files |
| GA/GDPR consent gating | Technical credibility phase | Network tab confirms zero GA requests before consent is granted |
| Font loading CLS/FOUT | Design phase | Throttled-network check for layout shift; confirm `font-display`/preload present in built HTML |

## Sources

- [410 status code: Quickly remove pages from Google | diva-e](https://www.diva-e.com/en/services/digital-marketing/seo/wiki/410-statuscode/) — HIGH confidence, cross-checked against multiple SEO practitioner sources on 410 vs 404 de-indexing speed
- [404 vs 410 - The Technical SEO Experiment - Reboot Online](https://www.rebootonline.com/blog/404-vs-410-the-technical-seo-experiment/) — HIGH confidence, empirical crawl-frequency data
- [The Complete Guide to Redirecting Deleted Pages: 301, 404, or 410? - Intero Digital](https://www.interodigital.com/blog/the-complete-guide-to-redirecting-deleted-pages-301-404-or-410/) — MEDIUM confidence, practitioner guidance
- [Google Consent Mode v2 Troubleshooting: Top 10 Mistakes - CookieScript](https://cookie-script.com/guides/google-consent-mode-v2-troubleshooting-top-10-mistakes) — MEDIUM confidence
- [GDPR Cookie Consent Implementation: What Most Developers Get Wrong - DEV Community](https://dev.to/andreashatlem/gdpr-cookie-consent-implementation-what-most-developers-get-wrong-and-how-to-fix-it-1jpl) — MEDIUM confidence, aligns with well-established GDPR "consent before tracking" principle
- [Best practices for fonts | web.dev](https://web.dev/articles/font-best-practices) — HIGH confidence, official Google web performance guidance
- [The Best Font Loading Strategies and How to Execute Them | CSS-Tricks](https://css-tricks.com/the-best-font-loading-strategies-and-how-to-execute-them/) — HIGH confidence, established reference
- [11 Mistakes That Make a Portfolio Look Unprofessional | Fstoppers](https://fstoppers.com/business/11-mistakes-make-portfolio-look-unprofessional-903158) — MEDIUM confidence, general portfolio-review wisdom (creative-industry framing, adapted here to finance-audience specifics)
- Project-internal sources: `.planning/PROJECT.md`, `.planning/codebase/CONCERNS.md`, `.planning/codebase/INTEGRATIONS.md` (2026-07-25 codebase audit) — HIGH confidence, primary source for this repo's actual configuration
- VitePress alpha-to-stable migration specifics, and the exact DNS/Amplify state for `qiankun.co.uk` — MEDIUM-LOW confidence; these are general platform-behavior patterns (documented in VitePress's own CHANGELOG and standard DNS/CDN cutover practice) rather than verified against this project's actual current DNS records or exact target VitePress version, since that requires live inspection during the Technical credibility phase itself, not desk research

---
*Pitfalls research for: qiankun.co.uk portfolio polish milestone*
*Researched: 2026-07-25*
