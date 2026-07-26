---
phase: 02-content-deletion-redirects
verified: 2026-07-26T00:00:00Z
status: human_needed
score: 33/33 must-haves verified (excluding 2 backstop truths, which cannot be verified from the repo)
behavior_unverified: 0
overrides_applied: 0
human_verification:
  - test: "curl -sI against each of the 6 rules in docs/public/_redirects (/photos/, /photos/*, /ai-workflow/, /ai-workflow/*, /blog/welcome, /blog/vite-plugins) on https://qiankun.co.uk after the next deployment"
    expected: "Each request returns HTTP 301 with a Location header matching the destination in docs/public/_redirects (/ or /blog/, per the rule)"
    why_human: "verification: backstop truth. Cloudflare Pages' edge is the only thing that honours _redirects — VitePress's local build and preview server do not implement it, and the site has not been deployed (local main is 35 commits ahead of origin/main; nothing has been pushed). No repository-level command can produce this evidence."
  - test: "If docs/blog/etrm-systems.md (the last surviving post) were ever deleted, build /blog/ and confirm the page still reads as a deliberate, non-broken page rather than an H1 sitting above nothing"
    expected: "The page presents some deliberate empty-state treatment rather than a bare heading with no content beneath it"
    why_human: "verification: backstop truth, explicitly marked 'not reachable this phase' in both 02-01-PLAN.md and 02-03-PLAN.md must_haves — one post is retained by design, so the empty-state code path does not exist yet to inspect. This is forward guidance for whoever next touches /blog/, not a gap in this phase's delivery."
---

# Phase 2: Content Deletion & Redirects Verification Report

**Phase Goal:** The site contains only the pages this milestone intends to keep, no stale pointer to a deleted page survives anywhere on the site, and every deleted URL redirects deliberately instead of dead-ending.
**Verified:** 2026-07-26
**Status:** human_needed
**Re-verification:** No — initial verification

## Verification Method

All checks below were re-run independently against the actual repository, not read from SUMMARY.md claims. Two layers of evidence were used:

1. **Clean-checkout build.** `git status --short` on the working tree returned empty (no uncommitted changes — the SUMMARY's own note about a prior uncommitted-fix incident does not apply to the current HEAD, since that fix (`51b1f69`) is itself committed). `git archive HEAD` was extracted to a scratch directory, `npm install` + `npm run docs:build` were run there from scratch, and the build exited 0 in 67.5s. This proves the **committed** state builds clean, not a possibly-doctored working tree.
2. **Direct grep/diff/file-existence checks** against that same clean-checkout build output, reproducing every gate the three plans' `must_haves` and `<verify>` blocks assert, rather than trusting the SUMMARY's reported numbers.

`git log` confirms all four claimed commits exist (`9607a10`, `0eb14f5`, `7c0a6c2`, `51b1f69`) with the file changes the summaries describe. `git rev-list --count origin/main..HEAD` returns 35 — confirming the site has not been deployed, which is why the two backstop truths below cannot be closed from the repo.

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Photos gallery deleted, no nav pointer, no dist trace | ✓ VERIFIED | `test ! -e docs/photos` OK; `grep -c 'photos' config.js` = 0; `docs/.vitepress/dist/photos` absent |
| 2 | AI Workflow section (5 pages) deleted, nav+sidebar pointers removed, orphaned CSS removed | ✓ VERIFIED | `test ! -e docs/ai-workflow` OK; `grep -c 'ai-workflow' config.js` = 0; `grep -c 'wip-' custom.css` = 0 |
| 3 | Two retired blog posts deleted, etrm-systems.md untouched | ✓ VERIFIED | `welcome.md`/`vite-plugins.md` absent; `etrm-systems.md` present |
| 4 | `/blog/` relabelled "Writing" everywhere (nav, sidebar, title, H1) | ✓ VERIFIED | `grep -c 'text: "Writing"'` config.js = 2, `grep -c 'text: "Blog"'` = 0; `docs/blog/index.md` frontmatter title = Writing, H1 = `# Writing` |
| 5 | `/blog/` presents the single surviving post as a standalone dated entry, not a feed | ✓ VERIFIED | `docs/blog/index.md` full content read: one `### [title](link)`, one paragraph, one italic date, no bullets, no "Recent Posts" heading, no "coming soon" |
| 6 | No nav/sidebar entry points at a deleted page (PRUNE-06) | ✓ VERIFIED | nav array read directly: exactly 5 entries (Home, About, Projects, Writing, Contact); sidebar object read directly: exactly 2 keys (`/projects/`, `/blog/`) |
| 7 | No internal link anywhere resolves to a deleted page (PRUNE-07) | ✓ VERIFIED | `npm run docs:build` exits 0 from a clean checkout (markdown dead-link gate, `ignoreDeadLinks` unset); sitewide `grep -rIl` over `docs/**/*.{md,js,vue}` excluding `dist/` for all 4 deleted route prefixes returns empty |
| 8 | Every deleted URL 301s, shipped in the same commit as its deletion (PRUNE-08) | ✓ VERIFIED | `docs/public/_redirects` holds exactly 6 rules, all ending `301`, all fixed `/`-rooted destinations, no colon/splat-in-destination; `git show --stat` on all 3 deletion commits (`9607a10`, `0eb14f5`, `7c0a6c2`) each independently confirmed to touch `_redirects` in the same commit as the corresponding deletion |
| 9 | `docs/public/` passthrough reaches `dist/` (load-bearing tracer assertion) | ✓ VERIFIED | Clean-checkout build: `docs/.vitepress/dist/_redirects` exists and is byte-identical (`diff -q`) to `docs/public/_redirects` |
| 10 | Homepage features row reduced to 3 cards, all linking to surviving pages (PRUNE-05) | ✓ VERIFIED | `docs/index.md` read directly: 3 `title:` entries (Projects/About/Contact), 3 `link:` entries (`/projects/`, `/about`, `/contact`), 3 unique gradient ids (`proj-grad`, `about-grad`, `contact-grad`) |
| 11 | Homepage has no client-side data dependency; Recent Posts block and its loader gone | ✓ VERIFIED | `docs/index.md` is 48 lines total, ends at the frontmatter delimiter — 0 matches for `script setup` or `<style>`; `docs/.vitepress/data/blog-posts.data.js` absent; build exits 0, proving no dangling import |
| 12 | Hero block untouched (out of scope this phase) | ✓ VERIFIED | `grep -c 'Exploring the Universe of Code'` = 1, `grep -c 'Read the Blog'` = 1 |
| 13 | Six retired Svg chart components deleted with imports/registrations (PRUNE-09) | ✓ VERIFIED | All 6 `.vue` files absent; `theme/index.js` has 18 `app.component(` calls (down from 24) and 25 `^import` lines (down from 31); `viz/*.vue` count = 15; a sitewide tag-name grep (`<SvgAreaChart` etc.) across markdown/vue confirms zero usages, matching the requirement's own verification method |
| 14 | No staleness language survives anywhere (PRUNE-10) | ✓ VERIFIED | Sitewide sweep for `Work in Progress\|Coming Soon\|More posts\|Stay tuned` over all surviving markdown (excluding dist) returns 0 matches |
| 15 | sitemap.xml / feed.rss carry no deleted-route references, feed drops from 3 to 1 item | ✓ VERIFIED | Clean-checkout build: `grep -cE` for deleted-route prefixes over `dist/sitemap.xml` and `dist/feed.rss` both = 0; `grep -c '<item>'` on feed.rss = 1 |
| 16 | Site has exactly 11 surviving markdown pages (down from 19) | ✓ VERIFIED | `find docs -name '*.md' -not -path '*/dist/*' \| wc -l` = 11 |
| 17 | Phase 1's parked/deferred work untouched (regression guard) | ✓ VERIFIED | `amplify.yml` and `deploy.sh` present; `package.json` still has both `deploy`/`deploy:quick` scripts; `grep -c 'G-4PF046MSJJ' config.js` = 2; no file references `/privacy` |
| 18 | Each rule in `_redirects` returns a live 301 on the deployed domain | 🛡 BACKSTOP — not verifiable from repo | Site is undeployed (`origin/main` is 35 commits behind `HEAD`); `_redirects` is Cloudflare-edge-only behaviour. See Human Verification. |
| 19 | `/blog/` still reads deliberately if the last post were ever deleted | 🛡 BACKSTOP — not verifiable from repo | Not reachable this phase by design (one post retained); no code path exists yet to inspect. See Human Verification. |

**Score:** 33/33 non-backstop must-haves verified across all three plans' frontmatter (17 truths tabulated above map to the full set enumerated in 02-01/02-02/02-03-PLAN.md; every individual grep/test/diff assertion in those plans' `must_haves.truths` and `<verify>` blocks was independently re-run and passed). 2 truths are `verification: backstop` and correctly abstain rather than being marked pass or fail.

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `docs/public/_redirects` | 6 well-formed 301 rules | ✓ VERIFIED | Content matches the locked mapping in 02-CONTEXT.md exactly: `/photos/`→`/`, `/photos/*`→`/`, `/ai-workflow/`→`/`, `/ai-workflow/*`→`/`, `/blog/welcome`→`/blog/`, `/blog/vite-plugins`→`/blog/`, all `301` |
| `docs/.vitepress/dist/_redirects` | Byte-identical passthrough of the above | ✓ VERIFIED | `diff -q` against source: no difference, confirmed on a clean-checkout build |
| `docs/blog/index.md` | UI-SPEC Surface 2 contract, exact | ✓ VERIFIED | Frontmatter, H1, H3 link, paragraph, italic date match the spec's markdown block verbatim |
| `docs/index.md` | Frontmatter-only, 3-card trio | ✓ VERIFIED | 48 lines, ends at frontmatter, hero untouched, 3 cards with distinct gradient ids |
| `docs/.vitepress/theme/index.js` | 18 registrations, 25 imports, no Svg references | ✓ VERIFIED | Counts match exactly; `grep -c 'Svg'` = 0 |
| `docs/.vitepress/theme/custom.css` | No orphaned `.wip-*` rules | ✓ VERIFIED | `grep -c 'wip-'` = 0, section header also removed (manual read) |

### Key Link Verification

| From | To | Via | Status | Details |
|------|-----|-----|--------|---------|
| `docs/public/` | `docs/.vitepress/dist/` | static passthrough | ✓ WIRED | Confirmed on a fresh, from-scratch build (not incremental) — `dist/_redirects` present and byte-identical |
| page deletion | `config.js` nav/sidebar | pointer removal | ✓ WIRED | Zero stale entries by direct grep; nav/sidebar entry counts confirmed by manual read |
| `docs/blog/welcome.md` + `vite-plugins.md` deletion | `docs/blog/index.md` inbound links | atomic per-build dead-link check | ✓ WIRED | Both links removed in the same task/commit as the page deletions; build is green |
| six Svg component deletion | `theme/index.js` imports/registrations | atomic registration removal | ✓ WIRED | Confirmed fixed by commit `51b1f69`, itself already committed at current HEAD — re-verified via clean-checkout build, not via the working tree |

### Requirements Coverage

| Requirement | Description | Status | Evidence |
|---|---|---|---|
| PRUNE-01 | AI Workflow section deleted | ✓ SATISFIED | Directory absent, 0 config.js references |
| PRUNE-02 | Photos gallery deleted | ✓ SATISFIED | Directory absent, 0 config.js references |
| PRUNE-03 | `welcome` blog post deleted | ✓ SATISFIED | File absent |
| PRUNE-04 | Vite plugins blog post deleted | ✓ SATISFIED | File absent |
| PRUNE-05 | Homepage feature cards for deleted sections removed | ✓ SATISFIED | 3-card trio, all links resolve to surviving pages |
| PRUNE-06 | Nav/sidebar contain no entries pointing at deleted pages | ✓ SATISFIED | 0 matches; nav=5 entries, sidebar=2 keys |
| PRUNE-07 | No internal link anywhere resolves to a deleted page | ✓ SATISFIED | Green build + sitewide sweep, both independently re-run |
| PRUNE-08 | `_redirects` returns a deliberate 301 for every deleted URL, same commit as deletion | ✓ SATISFIED (redirect-file half); live-301 half is backstop | 6 rules verified in content and commit co-location; live edge behaviour is unverifiable pre-deploy |
| PRUNE-09 | Six unused Svg* components deleted, verified by tag-name grep | ✓ SATISFIED | Files absent, registrations removed, 0 tag-name matches sitewide |
| PRUNE-10 | No WIP/coming-soon/staleness language remains | ✓ SATISFIED | 0 sitewide matches |
| PRUNE-11 | `/blog/` presented as "Writing" not a dated feed | ✓ SATISFIED | Content matches UI-SPEC Surface 2 exactly |

No orphaned requirements found — all 11 PRUNE-* IDs referenced in REQUIREMENTS.md are claimed by one of the three plans and independently confirmed above.

### Anti-Patterns Found

None. Scanned `docs/index.md`, `docs/blog/index.md`, `docs/.vitepress/config.js`, `docs/.vitepress/theme/custom.css`, `docs/.vitepress/theme/index.js`, `docs/public/_redirects` for `TBD|FIXME|XXX|TODO|HACK|PLACEHOLDER` and staleness phrasing — zero matches.

### Cross-Phase Regression Check (Phase 1 parked work)

Per the verification brief, these are tracked in STATE.md's Deferred Verification section and are **not** Phase 2 gaps — confirmed present/untouched, not reported as findings:
- `amplify.yml`, `deploy.sh` — present
- `package.json` `deploy`/`deploy:quick` scripts — both present
- `grep -c 'G-4PF046MSJJ' docs/.vitepress/config.js` — returns 2
- No file references `/privacy`

### UI-SPEC Note (informational, not a gap)

`02-UI-SPEC.md`'s own "Checker Sign-Off" checklist at the bottom of the document is unchecked (`Approval: pending`) — this is the UI-SPEC template's internal sign-off gate, not evidence of a defect. Direct inspection of all three surfaces (E1 homepage trio, E2 `/blog/` index, E3 vacated space) confirms the implementation matches the UI-SPEC contract verbatim, including the load-bearing E2 zero-one-many contract (H3 standalone entry, not a bulleted "recent" list). Recommend the UI-SPEC's own sign-off checklist be ticked as a housekeeping item, but this does not block the phase.

### Human Verification Required

### 1. Live 301 redirect behaviour

**Test:** After the next deployment, run `curl -sI https://qiankun.co.uk/photos/`, `.../photos/anything`, `.../ai-workflow/`, `.../ai-workflow/anything`, `.../blog/welcome`, `.../blog/vite-plugins`.
**Expected:** Each returns HTTP 301 with a `Location` header matching `docs/public/_redirects` (`/` for the first four, `/blog/` for the last two).
**Why human:** `_redirects` is a Cloudflare Pages edge feature with no local equivalent; the site has not yet been deployed (35 commits ahead of `origin/main`, nothing pushed). This is a `verification: backstop` truth in both 02-01-PLAN.md and 02-03-PLAN.md — it cannot be closed by any repository-level check, only by a post-deploy `curl`.

### 2. `/blog/` empty-state resilience

**Test:** If `docs/blog/etrm-systems.md` is ever deleted in a future phase without a replacement post, verify `/blog/` does not render as a bare `# Writing` heading with nothing beneath it.
**Expected:** Some deliberate empty-state treatment (e.g., a short line acknowledging no posts yet) rather than an apparently broken page.
**Why human:** Explicitly marked `verification: backstop` and "not reachable this phase" in both plans — the code path for zero posts does not exist to inspect, since one post is retained by design. This is a forward-looking flag for whoever next edits the Writing section, not a defect in this phase's delivery.

### Gaps Summary

No gaps found. All 17 tabulated observable truths (representing all non-backstop must-haves across the three plans) were independently re-verified against a from-scratch clean-checkout build of the committed `HEAD`, not against SUMMARY.md's reported numbers. The one real risk called out in the verification brief — a plan's own "build exits 0" gate being run against an uncommitted fix — was checked directly: `git status --short` on the working tree is clean, and the fix in question (`51b1f69`) is itself a committed commit that a fresh `git archive HEAD` extraction and from-scratch `npm install && npm run docs:build` confirmed builds green. The two remaining open items are both `verification: backstop` truths that the plans themselves correctly flagged as unobservable pre-deployment — they are routed to human verification rather than silently passed or incorrectly failed.

---

_Verified: 2026-07-26_
_Verifier: Claude (gsd-verifier)_
