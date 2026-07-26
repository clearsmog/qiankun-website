---
phase: 01-technical-foundations
plan: 02
subsystem: infra
tags: [npm, vitepress, vite, dependency-resolution, ci, github-actions]

# Dependency graph
requires:
  - phase: 01-technical-foundations (plan 01)
    provides: "DNS verification and Amplify decommission ordering (not yet executed at time of this plan's run)"
provides:
  - "package.json with vite-plugin-pwa ^1.3.0, vitepress pinned exact 2.0.0-alpha.18, no mermaid packages"
  - "docs/.vitepress/config.js unwrapped from withMermaid(defineConfig({...})) to a bare export default defineConfig({...})"
  - "package-lock.json regenerated from a clean install, npm ci verified self-consistent"
  - ".github/workflows/deploy.yml with no --legacy-peer-deps flag"
  - "README.md Plugins list corrected to match actual dependency set"
affects: [01-01, 01-03, 01-04]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "VitePress config uses VitePress's own defineConfig() directly rather than a plugin wrapper"

key-files:
  created: []
  modified:
    - package.json
    - package-lock.json
    - docs/.vitepress/config.js
    - .github/workflows/deploy.yml
    - README.md

key-decisions:
  - "Did not touch amplify.yml despite the plan's Task 2 acceptance grep expecting zero repo-wide legacy-peer-deps hits — that file is explicitly owned by plan 01-01 Task 3, gated on a human confirming Amplify auto-deploy is disabled. Deleting it here to satisfy a grep would violate the executor's explicit critical constraint and the documented ordering (Amplify disable -> observe stable -> delete repo files)."
  - "vite resolved to 8.1.4 on lockfile regeneration, not the 8.1.5 RESEARCH.md predicted from its dry-run a day earlier — harmless registry-state drift, still within the declared ^8.1.4 range, no manifest edit needed."

patterns-established: []

requirements-completed: [INFRA-04, INFRA-05, INFRA-06, INFRA-07, INFRA-08]

coverage:
  - id: D1
    description: "vite-plugin-pwa bumped to ^1.3.0, vitepress pinned to exact 2.0.0-alpha.18, mermaid packages removed"
    requirement: "INFRA-05, INFRA-06, INFRA-07"
    verification:
      - kind: other
        ref: "node -p checks against package.json + grep -ci mermaid package.json (returned 0)"
        status: pass
    human_judgment: false
  - id: D2
    description: "docs/.vitepress/config.js unwrapped to bare defineConfig(), mermaid config key removed, GA head tags left untouched for plan 01-03"
    requirement: "INFRA-06"
    verification:
      - kind: other
        ref: "grep -ci mermaid docs/.vitepress/config.js (returned 0); npm run docs:build (exit 0)"
        status: pass
    human_judgment: false
  - id: D3
    description: "package-lock.json regenerated from a clean node_modules and proven self-consistent with npm ci"
    requirement: "INFRA-04, INFRA-08"
    verification:
      - kind: other
        ref: "rm -rf node_modules && npm ci (exit 0, zero ERESOLVE) then npm run docs:build (exit 0, produced docs/.vitepress/dist/index.html)"
        status: pass
    human_judgment: false
  - id: D4
    description: "--legacy-peer-deps removed from CI workflow and stale mermaid reference removed from README"
    requirement: "INFRA-04"
    verification:
      - kind: other
        ref: "grep -cx '      - run: npm ci' .github/workflows/deploy.yml (returned 1); grep -ci mermaid README.md (returned 0)"
        status: pass
    human_judgment: false

duration: 15min
completed: 2026-07-26
status: complete
---

# Phase 1 Plan 02: Dependency Cleanup & VitePress Config Unwrap Summary

**Removed the dead `vitepress-plugin-mermaid`/`mermaid` dependency pair, bumped `vite-plugin-pwa` to clear its Vite 8 peer conflict, pinned VitePress to an exact version, and proved the whole fix with a real clean `npm ci` + `npm run docs:build` before dropping `--legacy-peer-deps` from CI.**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-07-26T11:00:00+01:00 (approx.)
- **Completed:** 2026-07-26T11:13:24+01:00
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- `package.json`: `vite-plugin-pwa` bumped `^1.2.0` → `^1.3.0`; `vitepress` pinned to exact `2.0.0-alpha.18` (no caret); `vitepress-plugin-mermaid` and `mermaid` deleted
- `docs/.vitepress/config.js`: unwrapped `withMermaid(defineConfig({...}))` to a bare `export default defineConfig({...})`, dedented the body, removed the dead `mermaid: {}` config key; GA head tags deliberately left in place (owned by plan 01-03)
- `package-lock.json` regenerated from a clean `node_modules`, and re-verified self-consistent via a second clean `npm ci`
- Confirmed no third peer conflict beyond the two CONTEXT.md already identified — `npm ci` exits 0 with zero ERESOLVE output, `npm run docs:build` exits 0 and emits `docs/.vitepress/dist/index.html`
- `.github/workflows/deploy.yml`: `npm ci --legacy-peer-deps` → `npm ci`
- `README.md`: removed the stale `vitepress-plugin-mermaid` bullet from the Plugins list

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix the dependency set end-to-end and prove it with a clean install and local build** - `7cfae82` (fix)
2. **Task 2: Remove the install flag from CI and correct the stale README plugin list** - `817f60c` (chore)

**Plan metadata:** (this commit, follows)

## Files Created/Modified
- `package.json` - dependency version changes (no script changes; `deploy`/`deploy:quick` untouched, owned by 01-01)
- `package-lock.json` - regenerated from a clean tree
- `docs/.vitepress/config.js` - mermaid unwrap, mermaid config key removed
- `.github/workflows/deploy.yml` - install step no longer carries `--legacy-peer-deps`
- `README.md` - Plugins list corrected

## Decisions Made
- Left `vite` at `8.1.4` in the lockfile (registry resolved the same patch as already pinned, rather than the `8.1.5` RESEARCH.md's dry-run had picked up the day before) — no manifest change needed, still within the declared `^8.1.4` range.
- Kept `amplify.yml`'s `--legacy-peer-deps` untouched — see Deviations below.

## Deviations from Plan

### Documented Gap (not auto-fixed — explicit executor constraint)

**1. Task 2's repo-wide `legacy-peer-deps` grep acceptance criterion cannot pass yet — `amplify.yml` still contains the flag**
- **Found during:** Task 2 verification
- **Issue:** The plan's acceptance criteria and automated `<verify>` both assert `grep -rIl 'legacy-peer-deps' --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=.planning . | wc -l` returns `0`. It currently returns `1` because `amplify.yml` (18 lines, `npm ci --legacy-peer-deps` at line ~6) still exists in the repo — no `01-01-SUMMARY.md` exists yet, meaning plan 01-01's Amplify-decommission checkpoint (disable auto-build in AWS console → observe stable → delete `amplify.yml`/`deploy.sh`) has not run.
- **Why not fixed:** The executor's explicit critical constraints for this run state: "Do NOT touch `amplify.yml` or `deploy.sh`... Plan 01-01 Task 3 owns their deletion, and it is parked pending a human checkpoint." Deleting `amplify.yml` here to satisfy the grep would violate that constraint and the CONTEXT.md-mandated ordering (Amplify disable observed stable *before* repo files are deleted) — deleting the emergency fallback file before the console confirms the fallback is no longer needed is exactly the risk that ordering exists to prevent.
- **Files not modified:** `amplify.yml` (left as-is, `--legacy-peer-deps` intact), `package.json` `deploy`/`deploy:quick` scripts (left as-is, still point at `deploy.sh`)
- **Resolution path:** Plan 01-01 Task 3 completes the Amplify console checkpoint and deletes `amplify.yml`/`deploy.sh`/the two `package.json` scripts in one commit. Once that lands, the repo-wide grep this plan's Task 2 specifies will return `0` as originally intended. This is an inter-plan ordering artifact (01-02 was written with `depends_on: ["01-01"]`, assuming 01-01 completes first), not a defect in this plan's own scope (`.github/workflows/deploy.yml` and `README.md`), both of which are flag-free and mermaid-free as required.
- **Committed in:** N/A (deliberately not committed — this is a gap, not a fix)

---

**Total deviations:** 1 documented gap (expected, resolved by a later plan)
**Impact on plan:** Everything in this plan's actual file scope (`package.json`, `package-lock.json`, `docs/.vitepress/config.js`, `.github/workflows/deploy.yml`, `README.md`) is complete and passes its own file-scoped acceptance checks. The one failing whole-repo grep is a cross-plan ordering dependency, not new scope creep or an unresolved bug in this plan's work.

## Issues Encountered
None beyond the documented gap above.

## User Setup Required
None - no external service configuration required by this plan. (Plan 01-01 carries the Amplify console checkpoint; plan 01-03 carries the Cloudflare Web Analytics dashboard checkpoint.)

## Next Phase Readiness
- `npm ci` (no flag) and `npm run docs:build` are both proven clean on the current `main` — any future plan touching dependencies inherits a known-good baseline.
- `docs/.vitepress/config.js` is now a plain `defineConfig({...})` export with no plugin wrapper — plan 01-03 (GA removal, Cloudflare Web Analytics, privacy page) can edit the `head` array and `theme/index.js` without dealing with the `withMermaid` wrapper.
- Blocker carried forward: `amplify.yml`'s `--legacy-peer-deps` and `deploy.sh`'s existence remain until plan 01-01 Task 3's human checkpoint completes — INFRA-04's "documentation and scripts" clause is only fully satisfied once that lands.

---
*Phase: 01-technical-foundations*
*Completed: 2026-07-26*
