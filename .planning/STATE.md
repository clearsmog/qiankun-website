---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
current_phase: 4
current_phase_name: Position & Design
status: executing
stopped_at: Completed 04-01-PLAN.md
last_updated: "2026-07-27T14:37:07.796Z"
last_activity: 2026-07-27
last_activity_desc: Phase 4 execution started
progress:
  total_phases: 4
  completed_phases: 2
  total_plans: 20
  completed_plans: 8
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-07-25)

**Core value:** A hiring manager who clicks the URL from the CV forms a favourable, accurate impression of Qiankun's quantitative capability within twenty seconds — and finds nothing that undermines it.
**Current focus:** Phase 4 — Position & Design

## Current Position

Phase: 4 (Position & Design) — EXECUTING
Plan: 2 of 10
Status: Ready to execute

Phase 3 (Design Token Consolidation) is complete and verified 6/6 — the brand hex now lives in
exactly two files (`theme/tokens.js` for Node, `theme/custom.css` for the browser), kept honest by
an `assertBrandInSync()` build-time assertion in `config.js` that fails the build on drift. All
twelve chart components use `watch(isDark, ..., { flush: 'post' })`; zero `MutationObserver`
remain. Six code-review findings were fixed across two iterations; the final re-review was clean.

Phase 2 (Content Deletion & Redirects) is complete, with two `verification: backstop` truths deferred
to post-deploy (see Deferred Verification below). Phase 1 (Technical Foundations) remains parked at
plan 2 of 4 — see Deferred Verification below. Neither blocks Phase 4.

Last activity: 2026-07-27 — Phase 4 execution started

Progress: [████░░░░░░] 40%

## Performance Metrics

**Velocity:**

- Total plans completed: 3
- Average duration: - min
- Total execution time: 0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 3 | 3 | - | - |

**Recent Trend:**

- Last 5 plans: -
- Trend: -

*Updated after each plan completion*
**Per-Plan Metrics:**

| Plan | Duration | Tasks | Files |
|------|----------|-------|-------|
| Phase 01 P02 | 15 | 2 tasks | 5 files |
| Phase 02 P01 | 16 | 3 tasks | 12 files |
| Phase 02 P02 | 20min | 2 tasks | 9 files |
| Phase 02 P03 | 20min | 2 tasks | 1 files |
| Phase 03 P01 | 20min | 2 tasks | 5 files |
| Phase 03 P02 | 25min | 2 tasks | 12 files |
| Phase 03 P03 | 25min | 2 tasks | 0 files |
| Phase 04 P01 | 25min | 2 tasks | 4 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Roadmap: Research's recommended VitePress pin-vs-downgrade call (pin `2.0.0-alpha.18` exactly, do not downgrade to 1.6.4) and the GA-to-Cloudflare-Web-Analytics swap (removes the need for a consent banner rather than building one) are both carried into Phase 1 scope as written — still flagged in SUMMARY.md as needing explicit human sign-off before execution.
- Roadmap: Position (POS-*) and Design (DES-* typography/layout items) are combined into a single Phase 4 rather than sequenced, per research's explicit finding that minimal copy and typographic system are interdependent.
- Roadmap: Design token consolidation (DES-05, DES-08) kept as its own Phase 3 rather than folded into Phase 4 — small scope, but unblocks Phase 4 so the restyle edits one clean variable set instead of two jobs at once.
- [Phase ?]: 01-02: amplify.yml legacy-peer-deps left intact pending 01-01 Task 3's Amplify console checkpoint; VitePress config unwrapped from withMermaid to bare defineConfig().
- [Phase ?]: 02-01: Redirects ship in the same commit as each deletion group (Photos, AI Workflow, blog posts) per PRUNE-08; docs/public/ passthrough to dist/ confirmed via tracer task.
- [Phase ?]: 02-01: /blog/ relabelled Writing everywhere (nav, sidebar, title, H1); surviving post presented as a standalone H3-linked entry, not a one-item bulleted feed, per UI-SPEC Surface 2.
- [Phase ?]: Feature trio chosen: Projects (unchanged) / About / Contact, per UI-SPEC's named safe default
- [Phase ?]: Six retired Svg components deleted with their theme registrations in one atomic commit, confirmed dead by zero tag usages site-wide
- [Phase ?]: Committed a real bug found during the audit (dangling Svg imports left uncommitted by 02-02's bc7b5d3) as a Rule 1 auto-fix before running the build gate
- [Phase ?]: 03-01: tokens.js exports one named constant, brand, only (no default export, no dark-mode export) — matches CONTEXT.md's discretion clause and RESEARCH.md's finding the dark value has zero JS consumers
- [Phase ?]: 03-01: browser-verified via Claude-in-Chrome pixel fingerprinting (getImageData stride-sampling) against the still-unconverted EDonut control on /projects/global-equity-portfolio — the watch(isDark, ..., { flush: 'post' }) recipe re-themes EBar on the same toggle with a byte-identical round-trip, clearing plan 03-02 to scale it to the remaining eleven components
- [Phase ?]: Imported tokens.js's brand export under alias brandToken in ProjectChart.vue to avoid shadowing its local brand() helper
- [Phase ?]: 03-03: Committed-state audit re-ran every Phase 3 gate inside a git archive HEAD extract with a fresh npm ci — all passed, confirming nothing from 03-01/03-02 was left uncommitted
- [Phase ?]: 03-03: DES-05 and DES-08 marked complete in REQUIREMENTS.md, closing Phase 3 — browser sweep confirmed all eight rendered ECharts types re-theme correctly across a full toggle cycle with a clean console
- [Phase ?]: Font sourced via npm pack extraction (never installed as dependency); vitepress/theme-without-fonts entry point required to stop VitePress bundling its own Inter family

### Pending Todos

**Carried into Phase 4 (found during Phase 3 verification, correctly out of Phase 3 scope):**

- 23 occurrences of the brand hex `#0071e3` are hardcoded in *content* markdown across 5 files
  (`docs/projects/{wq-alpha-research,uk-finance-pay,board-diversity-esg,cisco-equity-valuation,global-equity-portfolio}.md`)
  as chart series/marker colours. These are passed as explicit props, correctly take precedence over
  the token, and therefore do **not** re-theme in dark mode — e.g. the Cisco page's Exhibit 7 "Median"
  marker stays light-brand against re-themed bars. This is DES-07 ("chart styling derives from tokens
  rather than its own hard-coded values") and DES-11 ("every page renders correctly in dark mode,
  including all chart exhibits"), both already mapped to Phase 4.

- `theme/custom.css` still expresses the brand colour as four raw RGB literals independent of
  `--vp-c-brand-1` (`--vp-c-brand-soft`, and `rgba(0, 113, 227, ...)` at lines 429 and 486). The new
  `assertBrandInSync()` guard structurally cannot cover these. Non-blocking for Phase 3; fold into
  the Phase 4 restyle.

### Blockers/Concerns

- REQUIREMENTS.md's own header states "52 total" v1 requirements; a direct count of IDs in the file (INFRA/PRUNE/DES/POS/EXH/VER) yields 51. Roadmap coverage below uses the actual count (51/51 mapped). The header count should be corrected during traceability update.

**Resolved 2026-07-25 (user sign-off during autonomous run):**

- VitePress: pin `2.0.0-alpha.18` exactly. Do not downgrade to 1.6.4.
- Analytics: replace Google Analytics (G-4PF046MSJJ) with Cloudflare Web Analytics (cookieless, no consent banner).
- Deploy autonomy: pipeline changes proceed without per-change pause; local `npm run build` must pass before committing.

## Deferred Verification

| Phase | State | Resume |
|-------|-------|--------|
| 1 | verification_deferred_human | /gsd-autonomous --from 1 |
| 2 | verification_deferred_human | post-deploy `curl` check (see below) |

**Phase 2** is complete and verified in the repository — 33/33 non-backstop must-haves confirmed
against a clean `git archive HEAD` extract, not against the working tree. Two `verification: backstop`
truths remain, both unobservable until the site is deployed:

| Truth | Why it can't be verified now |
|-------|------------------------------|
| The six `_redirects` rules return live 301s | `_redirects` is honoured only by Cloudflare's edge, never by a local build or `vitepress preview`. Nothing has been pushed — `origin/main` is far behind local `HEAD`. Verify post-deploy with `curl -sI https://qiankun.co.uk/photos` etc. and confirm `301` + `Location`. |
| The `/blog/` empty-state | Not reachable while one post is retained; nothing in the build prevents it if that post were ever removed. |

**Phase 1** is blocked on two external console actions that cannot be performed from this
machine. Both are `verification: backstop` truths — no repository evidence can confirm them.

| Plan | Blocked on | Action required |
|------|-----------|-----------------|
| 01-01 Task 3 | AWS Amplify console | Disable auto-build on `main` (App settings → Branch settings → `main` row → Actions → Disable auto build), confirm site still serves, confirm no new build fired. Only then may `amplify.yml`, `deploy.sh`, and the two `package.json` deploy scripts be deleted. |
| 01-03 | Cloudflare dashboard | Enable Web Analytics (Workers & Pages → `qiankun-website` → Metrics → Web Analytics → Enable). Beacon appears on the next deployment. GA removal is committed only after this is on. |
| 01-04 | 01-03 | Privacy page states the site uses cookieless analytics — publishing it while GA is still live would make the page factually wrong. Gated on 01-03, not on a console action of its own. |

## Deferred Items

Items acknowledged and carried forward from previous milestone close:

| Category | Item | Status | Deferred At |
|----------|------|--------|-------------|
| *(none — first milestone)* | | | |

## Session Continuity

Last session: 2026-07-27T14:37:07.789Z
Stopped at: Completed 04-01-PLAN.md
Resume file: None
