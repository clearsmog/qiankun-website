# Phase 3: Design Token Consolidation - Research

**Researched:** 2026-07-26
**Domain:** Vue 3 / VitePress reactivity internals, theme-token architecture, Vite config-loading
**Confidence:** HIGH — the load-bearing question (timing) was resolved by reading installed package source (`vue@3.5.39`, `@vueuse/core@14.3.0`, `vitepress@2.0.0-alpha.18`), not by inference or training-data recall.

## Summary

This phase has one real risk and four supporting questions, all now closed. The timing risk — whether replacing twelve `MutationObserver`s with `watch(isDark, ...)` could read stale CSS custom-property values — is real with the **default** `watch()` flush mode and is eliminated by adding `{ flush: 'post' }`. This was verified by reading `vue`'s scheduler source directly, not assumed.

VitePress's `isDark` (from `useData()`) is `@vueuse/core`'s `useDark()`, which is a `computed` wrapping `useColorMode()`. The actual DOM class mutation happens inside `useColorMode`'s own internal watcher, registered with `{ flush: 'post' }` (`@vueuse/core/dist/index.js:2080-2083`). Vue's default watch flush is `'pre'` — pre-flush watchers run in the main synchronous job queue, which is fully drained *before* `flushPostFlushCbs` runs (`@vue/runtime-core/dist/runtime-core.cjs.js:424`). This means **a plain `watch(isDark, cb)` in a chart component is guaranteed to run before the DOM class flips**, and any `getComputedStyle()` read inside that callback returns pre-toggle colours. This is precisely the silent bug CONTEXT.md warned about, now confirmed rather than merely suspected.

The fix is mechanical: every converted watcher must pass `{ flush: 'post' }`. Because Vue sorts pending post-flush callbacks by `job.id`, and post-flush watchers never get a `job.id` assigned (`runtime-core.cjs.js:900-910`, `isPre` branch only), all post watchers share `getId() === Infinity` and fall back to a **stable sort**, preserving insertion order. `useColorMode`'s class-flipping watcher is created once at app boot (`initData()` runs in `createApp()`, before `app.mount()` — `vitepress/dist/client/app/index.js:59`), strictly before any page-level chart component mounts. So within the same flush pass, VitePress's own class-flip watcher is queued first and a chart's `{ flush: 'post' }` watcher — created later, when the chart mounts — runs after it. Ordering is correct by construction, not by luck.

**Primary recommendation:** Convert every one of the twelve observers to `watch(isDark, cb, { flush: 'post' })` (import `isDark` from `useData()`). Do not use bare `watch(isDark, cb)` (default `flush: 'pre'` reads stale colours) and do not reach for `nextTick()` as the primary fix (it works but is unnecessary ceremony once `flush: 'post'` is used correctly) — reserve `nextTick()` only as a documented fallback if a future finding contradicts this analysis in browser testing.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Brand colour canonical value | Browser / Client (CSS) | Build (Node, PWA manifest) | `--vp-c-brand-1` in `custom.css` is what the browser renders; `tokens.js` exists solely because the Node-side PWA manifest step runs before any DOM/CSS exists |
| Theme-reactivity trigger (dark/light toggle) | Browser / Client | — | `useData().isDark` is a client-only reactive ref; there is no server or API tier in this static site |
| Chart re-theming (colour re-read) | Browser / Client | — | `themeTokens()` reads `getComputedStyle` on `document.documentElement`, purely client-side |
| PWA manifest colour | Build / Static generation | — | `vite-plugin-pwa` generates `manifest.webmanifest` at build time in Node; `tokens.js` import happens in `config.js`, executed by Vite's Node-side config loader |

There is no API/backend tier in this project (fully static site); this map exists to confirm none of this phase's work should be pushed to a server tier that doesn't exist.

## User Constraints (from CONTEXT.md)

<user_constraints>

### Locked Decisions

- **All twelve** theme `MutationObserver`s are converted (not the two implied by DES-08's stale wording): `viz/VizEChart.vue`, `viz/EBar.vue`, `viz/EDonut.vue`, `viz/ELine.vue`, `viz/ECombo.vue`, `viz/EForest.vue`, `viz/EFootball.vue`, `viz/EGroupBar.vue`, `viz/EHeatmap.vue`, `viz/EHistogram.vue`, `viz/EScorePath.vue`, `components/ProjectChart.vue`. DES-08's REQUIREMENTS.md text is left as-is per user's explicit choice; the discrepancy is recorded in CONTEXT.md, not corrected there.
- Canonical brand colour stays `--vp-c-brand-1` in `custom.css` (`#0071e3` light / `#2997ff` dark). CSS is the source of truth for anything the browser renders.
- `#0071e3` appears in 4 places (not 2): `custom.css:12` (canonical), `config.js:46` (PWA `theme_color`), `echarts-setup.js:68` (`cssVar` fallback arg), `echarts-setup.js` `palette[0]`.
- `docs/.vitepress/theme/tokens.js` is NEW, holds **only** values Node needs before the DOM exists (PWA manifest colour per DES-05). `config.js` imports from it instead of hard-coding.
- Replace each observer with `useData().isDark` + a `watch`. **The reaction each component performs stays exactly what it is today** — `tick.value++` in ten components, `chartRef.value?.resize?.()` in `VizEChart`, `build()` in `ProjectChart`. This is a change of trigger, not of behaviour.
- Delete matching `onBeforeUnmount(() => obs?.disconnect())` — a `watch` inside `setup()` self-unregisters.
- `themeTokens()` in `echarts-setup.js` stays as-is (still reads live CSS vars via `getComputedStyle`). **Timing risk is real and must be resolved and proven, not assumed** — this research closes that question (see Common Pitfalls, Pitfall 1).
- `ProjectChart.vue` registers `onBeforeUnmount` *inside* `onMounted` today — works, but non-idiomatic; tidy it while the surrounding lines are already being edited.
- **This phase must be visually neutral.** No palette change, no type-scale, no font-loading, no restyle — those are Phase 4.

### Claude's Discretion

- Whether `echarts-setup.js`'s `cssVar()` fallback arguments and `palette[0]` import from `tokens.js` or stay literal — either is acceptable **provided the grep for `#0071e3` resolves to one canonical definition plus explicitly-justified fallbacks**, not a silent duplicate.
- `tokens.js` export shape (named vs default) and whether it also exports the dark-mode brand value.
- Commit granularity, provided each commit builds.

### Deferred Ideas (OUT OF SCOPE)

- Type scale, weights, line-measure tokens — Phase 4 (DES-03).
- Self-hosted variable font, removing Google Fonts import — Phase 4 (DES-01/02).
- `NotFound.vue`'s `#667eea → #764ba2 → #ec4899` gradient (old "Universe of Code" aesthetic) — Phase 4. Confirmed NOT the brand colour; do not touch here.
- RSS feed self-description contradicts repositioning — Phase 4.
- Phase 1's console-gated items — remain in STATE.md → Deferred Verification.
- The ten-colour chart palette in `echarts-setup.js` — no palette change this phase.

</user_constraints>

## Phase Requirements

<phase_requirements>

| ID | Description | Research Support |
|----|-------------|------------------|
| DES-05 | The brand colour is defined in exactly one place; a minimal `tokens.js` exists only for values Node needs before the DOM (the PWA manifest colour) | See "tokens.js and the Vite/Node boundary" below — confirmed `import { X } from './tokens.js'` from `config.js` works under Vite's config-bundling with no special handling needed. Package Legitimacy Audit N/A (no new packages). |
| DES-08 | Both theme `MutationObserver`s are deleted and `useData().isDark` is used instead (scope corrected to all twelve per CONTEXT.md) | See "Pitfall 1: The Post-Flush Timing Trap" and Code Examples below — exact `watch(..., { flush: 'post' })` pattern per reaction shape, verified against Vue/VueUse source. |

</phase_requirements>

## Standard Stack

No new dependencies. This phase only uses APIs already present in the installed toolchain:

### Core (already installed, verified versions)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| vue | 3.5.39 [VERIFIED: read from node_modules/vue/package.json] | `watch`, `computed`, reactivity core | Already the project's UI framework |
| vitepress | 2.0.0-alpha.18 [VERIFIED: read from node_modules/vitepress/package.json] | `useData()` — supplies `isDark` | Already the project's SSG |
| @vueuse/core | 14.3.0 [VERIFIED: read from node_modules/@vueuse/core/package.json] | Backs `isDark` internally (`useDark`/`useColorMode`) — not imported directly by this phase's code, but its behaviour governs the timing fix | Transitive dependency of vitepress; understanding it is required to get the timing right |

**No `npm install` needed for this phase.** All required APIs (`useData`, `watch`, `{ flush: 'post' }`) are already available in the installed toolchain.

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `watch(isDark, cb, { flush: 'post' })` | `watch(isDark, async cb) { await nextTick(); ... }` | Also correct (verified: `nextTick()` chains onto the currently-executing flush promise, resolving after `flushPostFlushCbs` completes) but adds `async`/`await` ceremony to callbacks that are today synchronous one-liners (`tick.value++`). Prefer `flush: 'post'` for a smaller diff. |
| `watch(isDark, cb, { flush: 'post' })` | `watchPostEffect(() => { ... })` | Equivalent semantics to `watch(source, cb, { flush: 'post' })` but as a `watchEffect`-style dependency-tracking callback; not a good fit here because the callback needs the specific "did dark mode change" trigger, not auto-tracked deps, and existing code already threads a getter/ref-style `watch`. Stick with explicit `watch(isDark, ...)` to match the codebase's existing style (EBar etc. all use `computed` + explicit dependency, not auto-tracking effects). |

## Package Legitimacy Audit

**Not applicable — this phase introduces zero new npm packages.** `tokens.js` is a hand-written local ES module with no dependencies. No `npm install` step exists in this phase's plan. Skip the legitimacy gate.

## Architecture Patterns

### System Architecture Diagram

```text
User toggles dark/light (click on VPSwitchAppearance)
        |
        v
isDark.value = !isDark.value   (useDark's computed setter)
        |
        v
underlying `store` ref (localStorage-backed) changes
        |
        +---------------------------------------------+
        |                                               |
        v                                               v
useColorMode's internal watch(state, onChanged,   Any chart's watch(isDark, cb,
  { flush: 'post', immediate: true })                { flush: 'post' })
  [registered ONCE at app boot, before ANY            [registered per-chart, at
   page component mounts]                              chart component mount time --
        |                                               always later than app boot]
        v                                               |
document.documentElement.classList                      |
  add/remove('dark')                                    |
  --> browser recomputes CSS custom properties           |
        |                                               |
        +--------------- SAME "post" flush pass ---------+
                          (stable sort, insertion order preserved
                           because both watchers' job.id === undefined
                           --> getId() === Infinity for both --> ties
                           resolved by original queue order)
                                    |
                                    v
                    chart's cb runs AFTER class flip:
                    getComputedStyle() now returns POST-toggle values
                                    |
                                    v
                    tick.value++ / resize() / build() --
                    re-render with correct colours
```

### Recommended Project Structure

```
docs/.vitepress/theme/
├── tokens.js                     # NEW — Node-side-only values (PWA manifest colour)
├── custom.css                    # unchanged — canonical --vp-c-brand-1 definition
├── components/
│   ├── ProjectChart.vue          # convert MutationObserver -> watch(isDark, build, {flush:'post'})
│   └── viz/
│       ├── echarts-setup.js      # unchanged logic; optional: import tokens.js for fallback/palette[0]
│       ├── VizEChart.vue         # convert -> watch(isDark, () => chartRef.value?.resize?.(), {flush:'post'})
│       ├── EBar.vue              # convert -> watch(isDark, () => tick.value++, {flush:'post'})
│       ├── EDonut.vue            # same tick.value++ pattern
│       ├── ELine.vue             # same
│       ├── ECombo.vue            # same
│       ├── EForest.vue           # same
│       ├── EFootball.vue         # same
│       ├── EGroupBar.vue         # same
│       ├── EHeatmap.vue          # same
│       ├── EHistogram.vue        # same
│       └── EScorePath.vue        # same
```

### Pattern 1: Replacing a `MutationObserver` with `useData().isDark`

**What:** Every one of the twelve components currently runs an identical `MutationObserver` on `document.documentElement` watching `attributeFilter: ['class']`. Replace with VitePress's already-tracked `isDark` ref.

**When to use:** Any component that needs to react to the light/dark toggle.

**Example — the "tick nudge" shape (10 of 12 components: EBar, EDonut, ELine, ECombo, EForest, EFootball, EGroupBar, EHeatmap, EHistogram, EScorePath):**

```vue
<!-- BEFORE (EBar.vue:1-30) -->
<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
// ...
const tick = ref(0)
let obs
onMounted(() => {
  obs = new MutationObserver(() => {
    tick.value++
  })
  obs.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })
})
onBeforeUnmount(() => obs?.disconnect())
</script>
```

```vue
<!-- AFTER -->
<script setup>
import { computed, ref, watch } from 'vue'
import { useData } from 'vitepress'
// ...
const { isDark } = useData()
const tick = ref(0)
watch(isDark, () => {
  tick.value++
}, { flush: 'post' })
</script>
```

`onMounted`/`onBeforeUnmount` imports are removable if nothing else in the file needs them — check each file individually (some may still need `onMounted` for other purposes; none of the twelve appear to, based on the grep below, but verify per-file during planning).

**Example — the `resize()` shape (VizEChart.vue only):**

```vue
<!-- BEFORE (VizEChart.vue:22-35) -->
let obs
onMounted(() => {
  obs = new MutationObserver(() => {
    chartRef.value?.resize?.()
  })
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})
onBeforeUnmount(() => obs?.disconnect())
```

```vue
<!-- AFTER -->
import { useData } from 'vitepress'
const { isDark } = useData()
watch(isDark, () => {
  chartRef.value?.resize?.()
}, { flush: 'post' })
```

**Example — the `build()` shape (ProjectChart.vue only), also tidying the non-idiomatic nested `onBeforeUnmount`:**

```vue
<!-- BEFORE (ProjectChart.vue:195-207) -->
onMounted(() => {
  build()
  const obs = new MutationObserver(() => build())
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  onBeforeUnmount(() => {
    obs.disconnect()
    chart?.destroy()
  })
})
```

```vue
<!-- AFTER -->
import { useData } from 'vitepress'
const { isDark } = useData()

onMounted(() => {
  build()
})

watch(isDark, () => build(), { flush: 'post' })

onBeforeUnmount(() => {
  chart?.destroy()
})
```

Note the chart-destroy cleanup moves to a top-level `onBeforeUnmount` (idiomatic placement) instead of being nested inside `onMounted`.

### Pattern 2: `tokens.js` as the Node-side-only source

**What:** A minimal ESM module holding only the PWA manifest colour, importable from `config.js` (Node/build time) without pulling in anything DOM-dependent.

**Example:**
```javascript
// docs/.vitepress/theme/tokens.js
export const brand = '#0071e3'
```
```javascript
// docs/.vitepress/config.js
import { brand } from './theme/tokens.js'
// ...
manifest: {
  // ...
  theme_color: brand,
  // ...
}
```

Export-shape decision (named vs default, whether to also export the dark value) is explicitly Claude's discretion per CONTEXT.md — either is acceptable.

### Anti-Patterns to Avoid

- **Bare `watch(isDark, cb)` with no `flush` option:** Default flush is `'pre'`, which is guaranteed to run *before* the DOM class attribute flips (see Pitfall 1). This silently reintroduces the exact bug the phase is meant to fix, and it will pass every automated check.
- **Deleting `onBeforeUnmount` for non-observer cleanup:** Only the `obs?.disconnect()` calls are safe to delete outright. `ProjectChart.vue`'s `chart?.destroy()` must be preserved (Chart.js instances still need explicit teardown — `watch()` self-cleanup only applies to the watcher itself, not to unrelated resources allocated in the same lifecycle hook).
- **Reaching for `nextTick()` as the default fix:** Works, but only for callbacks that can be made `async`. Since none of the three reaction shapes here need to be async, `{ flush: 'post' }` is the more minimal, more idiomatic change matching what the codebase already does for the reaction itself.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Detecting the light/dark toggle | A `MutationObserver` on `document.documentElement`'s class attribute (the exact thing being removed) | `useData().isDark` from VitePress | VitePress already tracks this reactively and exposes it; the twelve observers were reinventing something the framework provides |
| Waiting for a DOM mutation before re-reading computed styles | Manual `requestAnimationFrame` polling, `setTimeout(0)`, or double-`nextTick()` chains | `watch(source, cb, { flush: 'post' })` | Vue's built-in flush-queue ordering already guarantees post-render (and, per the ordering proof above, post the class-flip watcher too) timing without any manual scheduling code |

**Key insight:** The entire "twelve identical MutationObservers" anti-pattern existed because nobody had traced how `isDark` and the DOM class flip are actually sequenced. Once that sequencing is understood (see Pitfall 1), the fix is a one-line options-object change per component, not new machinery.

## Runtime State Inventory

This is a code-level refactor (trigger mechanism + colour-definition location), not a rename/rebrand/ID migration. Checked each category explicitly:

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None — no database, no user-scoped IDs. `useDark`'s `localStorage` key (`vitepress-theme-appearance`, from `APPEARANCE_KEY`) is unchanged by this phase; no key rename occurs. | None |
| Live service config | None — this is a static site; no external service (n8n, Datadog, Cloudflare Tunnel, etc.) references chart-reactivity code or the brand colour by name. | None |
| OS-registered state | None — no Task Scheduler, pm2, launchd, or systemd artifacts in this project. | None |
| Secrets/env vars | None — no secret or env var references `#0071e3`, `tokens.js`, or the observer/watch pattern by name. | None |
| Build artifacts | `docs/.vitepress/dist/` and `docs/.vitepress/cache/` are build output, regenerated on every `npm run docs:build`; no stale artifact carries the old pattern forward since the build is fully reproducible from source. | None — rebuild after the change (already required for the visual-diff verification below) |

**Nothing found in any category** — verified by grep for `#0071e3`, `MutationObserver`, `tokens.js`, and by inspection of `.gitignore` (confirms `dist/` is not committed).

## Common Pitfalls

### Pitfall 1: The Post-Flush Timing Trap (the load-bearing risk of this phase)

**What goes wrong:** A chart re-themes with the *previous* mode's colours immediately after a toggle — the chart's own `computed`/reaction fires, but reads `getComputedStyle()` before the browser has recomputed the CSS custom properties, because the DOM class hasn't flipped yet.

**Why it happens — traced through source, not assumed:**

1. `useData().isDark` is VitePress's `initData()` result (`node_modules/vitepress/dist/client/app/data.js:12-22`). Given this project's config has no explicit `appearance` key, VitePress defaults `appearance: userConfig.appearance ?? true` (`node_modules/vitepress/dist/node/chunk-Cne7GbZY.js:6459`), so `isDark` resolves to `useDark({ storageKey: APPEARANCE_KEY, initialValue: () => 'auto' })` from `@vueuse/core`.
2. `useDark()` (`node_modules/@vueuse/core/dist/index.js:2324-2349`) is a `computed` wrapping `useColorMode()`. Its setter (`isDark.value = true/false`) writes to `useColorMode`'s underlying `store` ref.
3. `useColorMode()` (`node_modules/@vueuse/core/dist/index.js:2026-2098`) registers **its own internal watcher** that performs the actual DOM mutation: `watch(state, onChanged, { flush: 'post', immediate: true })` (line 2080-2083). `onChanged` → `defaultOnChanged` → `updateHTMLAttrs` (lines 2041-2071) is what calls `el.classList.add/remove('dark')`.
4. This internal watcher is created once, when `initData()` runs inside `createApp()` — **before `app.mount()`, before any page component's `setup()` runs** (`node_modules/vitepress/dist/client/app/index.js:53-59`). Every chart component's own watcher, by contrast, is created later, when that chart mounts on a page.
5. Vue's default `watch()` flush is `'pre'` (confirmed via Context7 / official Vue docs: "By default, watchers run before component rendering ... setting flush to 'post' defers execution until after rendering," `vuejs.org/api/reactivity-core`). Pre-flush watcher jobs are pushed into the main `queue` and processed by `flushJobs`'s main loop; `flushPostFlushCbs()` is only called **after** that main loop completes (`node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:390-424`, specifically line 424: `flushPostFlushCbs(seen);` runs after the primary `for` loop). So **any plain `watch(isDark, cb)` (default `flush: 'pre'`) is structurally guaranteed to execute before `useColorMode`'s class-flipping `flush: 'post'` watcher runs.** This reads stale (pre-toggle) computed-style values every single time, not intermittently.
6. When a chart's own watcher is *also* given `{ flush: 'post' }`, both it and `useColorMode`'s watcher land in the same `pendingPostFlushCbs` array. `flushPostFlushCbs` sorts this array by `getId(a) - getId(b)` before running it (`runtime-core.cjs.js:360-364`). `getId` (`runtime-core.cjs.js:389`) returns `job.id` if set, else `Infinity` for non-pre jobs. Post-flush watcher jobs never get a `job.id` assigned — that assignment only happens in the `isPre` branch of `doWatch`'s `augmentJob` (`runtime-core.cjs.js:900-910`). So **every post-flush watcher's `getId()` is `Infinity`**, meaning the sort is a tie for all of them, and JavaScript's `Array.prototype.sort` is spec-guaranteed stable (ES2019+) — ties preserve original insertion order. Because `useColorMode`'s watcher was registered (and thus first triggered/queued) before any chart's watcher even exists, it is queued first and runs first within the same post-flush pass.

**How to avoid:** Always pass `{ flush: 'post' }` on every converted `watch(isDark, ...)` call. Do not omit the options object.

**Warning signs:** The build passes, the page loads, dark mode toggles the background/text correctly (those come from CSS `:root`/`.dark` selectors applied directly by the browser, unrelated to any watcher) — but a chart's bars/lines/axis colours look like they belong to the *previous* mode for one toggle, or need a second toggle-back-and-forth to "catch up" to the current mode. This is the exact silent failure mode CONTEXT.md and the UI-SPEC both flag as a backstop item requiring browser verification — automated checks (build exit code, unit tests, hash diffs) cannot detect it.

**Verification beyond source-reading:** This document traces the mechanism from source and is HIGH confidence, but the UI-SPEC's own backstop requirement stands: toggle dark mode with a chart on screen (`/projects/cisco-equity-valuation` or `/projects/global-equity-portfolio`) and visually confirm colours update on the *same* toggle, with no flash of stale colour. Treat this as a mandatory human-verify / browser-automation step regardless of how confident the source analysis is — per CONTEXT.md's explicit instruction to prove it, not assume it.

### Pitfall 2: `VizEChart.vue`'s `resize()` reaction doesn't actually re-read colours — and doesn't need to

**What goes wrong (pre-existing, not introduced by this phase):** `VizEChart.vue`'s theme reaction is `chartRef.value?.resize?.()`. `resize()` recalculates the chart's pixel dimensions — it does not cause ECharts to re-read the `option` object's colour values. Taken in isolation, this looks like a bug: toggling the theme should recolour the chart, but `resize()` doesn't do that.

**Why it happens to be harmless:** `VizEChart` is never used directly in any markdown page (confirmed: `grep -rl "<VizEChart" docs --include="*.md"` returns nothing). It is only ever used internally by the ten `tick.value++`-style wrapper components (`EBar`, `ELine`, `EDonut`, etc. — confirmed via `grep -rl "VizEChart" docs/.vitepress/theme/components/viz/*.vue`). Those wrappers already recompute their `option` object (with fresh `themeTokens()` colours) inside their own `computed`, which is re-triggered by their own `tick.value++` watcher. The new `option` object is passed down as a prop, and `vue-echarts`'s `<VChart :option="option">` reacts to `option` prop changes on its own, independent of `VizEChart`'s internal resize call. So the actual recolouring is already handled elsewhere; `VizEChart`'s own observer/resize is vestigial.

**How to avoid:** Per CONTEXT.md's explicit instruction ("the reaction each component performs stays exactly what it is today... this is a change of trigger, not of behaviour"), **do not fix or remove this** — convert the trigger to `watch(isDark, () => chartRef.value?.resize?.(), { flush: 'post' })` and leave the behaviour as-is. Flag it in the plan/commit message as a known pre-existing quirk so a future phase doesn't need to re-discover it, but do not silently "improve" it here — that would violate visual neutrality by changing behaviour under cover of a mechanical trigger swap (in this case, no visual difference results either way, but the principle applies).

**Warning signs:** None — this is informational, not a defect to fix in this phase.

## Code Examples

### `useData()` availability check across all twelve components

Verified pattern already in use: `JsonLd.vue` imports `useData` from `vitepress` today (only current usage in the repo). All twelve chart components are registered globally via `app.component(...)` in `enhanceApp()` (`docs/.vitepress/theme/index.js:42-59`) and rendered exclusively inside markdown content, which renders inside `<Content />` inside the themed `Layout`, itself mounted under the same Vue `app` where `app.provide(dataSymbol, data)` was called in `createApp()` (`vitepress/dist/client/app/index.js:59-60`). Since `useData()` is just `inject(dataSymbol)` (`data.js:47-53`) and `provide`/`inject` resolves through the component ancestor chain regardless of how deeply nested inside markdown-rendered content a component is, **`useData()` is valid in every one of the twelve components** — there is no code path where any of them renders outside the VitePress app tree.

```javascript
// Source: node_modules/vitepress/dist/client/app/data.js:47-53
export function useData() {
    const data = inject(dataSymbol);
    if (!data) {
        throw new Error('vitepress data not properly injected in app');
    }
    return data;
}
```

If this ever throws in practice, it means a component is being unit-tested or rendered in isolation outside a VitePress-mounted app — not a concern for this codebase's current usage (no test harness exists; see Environment Availability below).

### `tokens.js` import from `config.js` — the Vite/Node boundary

Confirmed: `package.json` has `"type": "module"`, and Vite's config loader includes a `bundleConfigFile` step (`node_modules/vite/dist/node/chunks/node.js:35983`) that bundles the config file together with its local relative imports via esbuild before executing it in Node. A plain relative ESM import of a dependency-free local file is exactly the case this bundling step is designed for — this is standard, widely-used Vite/VitePress config-authoring practice (importing shared constants into `vite.config.js`/`config.js`), not a special case requiring extra tooling.

```javascript
// docs/.vitepress/config.js
import { brand } from './theme/tokens.js'
// ... later
manifest: {
  theme_color: brand,
  // ...
}
```

**Constraint:** `tokens.js` must not import anything DOM-dependent (no CSS imports, no `document`/`window` references) since it is evaluated in Node at build time as well as potentially in the browser bundle if also imported client-side. A plain `export const brand = '#0071e3'` has no such risk.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|---------------|--------|
| `new MutationObserver(...)` on `document.documentElement` per chart component | `watch(useData().isDark, cb, { flush: 'post' })` | This phase | Twelve duplicated, hand-rolled DOM-watching implementations collapse to VitePress's own reactive primitive; removes manual `disconnect()` cleanup entirely |
| Brand colour hard-coded as a literal in 4 files | Single canonical `--vp-c-brand-1` (CSS) + single `tokens.js` (Node-only PWA value) | This phase | A future colour change touches at most two files instead of four, with the CSS/Node split matching the actual render-time boundary |

**Deprecated/outdated:** Nothing framework-level is deprecated here — `MutationObserver` remains a valid browser API in general, it's simply the wrong tool when the framework already exposes the state reactively.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `tokens.js` export shape (named vs default, whether it also exports the dark-mode value) has no functional consequence either way | Pattern 2 / Standard Stack | None — this is explicitly Claude's discretion per CONTEXT.md, not a claim requiring confirmation |

**This table is intentionally near-empty.** Every claim about the timing mechanism (Pitfall 1) was verified by reading the installed package source at specific file/line locations (`vue@3.5.39`, `@vueuse/core@14.3.0`, `vitepress@2.0.0-alpha.18`) plus cross-checked against official Vue API docs via Context7. No package-legitimacy claims apply (no new packages). The one open item is the mandatory browser-toggle verification called out in Pitfall 1 and the UI-SPEC — that is a verification *step*, not an unverified *claim*.

## Open Questions

1. **Does the post-flush ordering proof hold under React-like Suspense/async component edge cases in this codebase?**
   - What we know: `queuePostRenderEffect` (used by `flush: 'post'` watchers per `runtime-core.cjs.js:886-889`) can special-case a `Suspense` boundary (`instance.suspense`), and if the boundary is still pending, its jobs are held until the boundary resolves.
   - What's unclear: None of these chart components appear to be used inside a `<Suspense>` boundary in this codebase (VitePress's own root component tree doesn't use one for prerendered content), but this wasn't independently confirmed by grepping the entire `docs/` tree for `<Suspense>`.
   - Recommendation: Low risk — grep `docs/` for `Suspense` during planning/execution as a 10-second sanity check; if absent (expected), no action needed.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build (`npm run docs:build`), Vite config loading | Yes [VERIFIED: `node --version`] | v26.5.0 | — |
| npm | Package scripts | Yes [VERIFIED: `npm --version`] | 11.17.0 | — |
| `npm run docs:build` | Visual-neutrality verification (build-output diff) | Yes — confirmed by running it during this research; completes in ~48s, exit 0, produces `docs/.vitepress/dist/` | — | — |

No missing dependencies. This phase requires no new tools, services, or packages.

## Validation Architecture

Skipped — `.planning/config.json` has `workflow.nyquist_validation: false` explicitly.

## Security Domain

`security_enforcement: true`, `security_asvs_level: 1` per `.planning/config.json`. This phase touches only client-side theme-reactivity wiring and a build-time colour constant on a static site with no authentication, no user input, no server, and no session state. Most ASVS categories are structurally not applicable.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | No auth system exists on this static site |
| V3 Session Management | No | No sessions; `localStorage` theme-preference key is a UX preference, not a security boundary |
| V4 Access Control | No | No access-controlled resources |
| V5 Input Validation | No | This phase introduces no new user-input handling. `tokens.js` values are static string literals defined by the developer, not parsed from any external or user-supplied input |
| V6 Cryptography | No | No cryptographic operations |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| None identified specific to this phase | — | This phase changes only (a) which client-side event triggers a chart re-render, and (b) where a hex colour string is defined. Neither introduces a new attack surface — no new network calls, no new data flows, no new script execution paths beyond what `vue`/`vue-echarts`/`chart.js` already perform. |

## Sources

### Primary (HIGH confidence — verified by reading installed package source)
- `node_modules/vue/package.json` — version 3.5.39
- `node_modules/@vue/runtime-core/dist/runtime-core.cjs.js:303-424, 839-912` — `queueJob`, `queuePostFlushCb`, `flushPostFlushCbs`, `getId`, `doWatch`/`augmentJob` — the entire flush-ordering proof
- `node_modules/@vueuse/core/dist/index.js:2018-2098, 2324-2349` — `useColorMode`/`useDark` implementation, confirms the class-flip watcher's `{ flush: 'post', immediate: true }` registration
- `node_modules/@vueuse/core/package.json` — version 14.3.0
- `node_modules/vitepress/dist/client/app/data.js:1-53` — `initData`/`useData` implementation, confirms `isDark` wiring and `appearance` branch logic
- `node_modules/vitepress/dist/client/app/index.js:53-89` — confirms `initData()` runs in `createApp()`, before `app.mount()`, before any page component setup
- `node_modules/vitepress/dist/node/chunk-Cne7GbZY.js:6459` — confirms `appearance: userConfig.appearance ?? true` default
- `node_modules/vitepress/package.json` — version 2.0.0-alpha.18
- `node_modules/vite/dist/node/chunks/node.js:35983` — confirms `bundleConfigFile` exists for config-loading
- Live grep of all twelve component files (`viz/*.vue`, `components/ProjectChart.vue`) — confirms observer shape and exact line locations, and confirms `VizEChart` is only used internally (never directly in markdown)
- Actual `npm run docs:build` run during this research (48s, exit 0) — confirms build succeeds and produces `manifest.webmanifest` with `theme_color: "#0071e3"` and CSS asset with `--vp-c-brand-1:#0071e3` / `--vp-c-brand-1:#2997ff`, giving concrete diff targets

### Secondary (MEDIUM confidence)
- Context7 `/websites/vuejs_api` (vuejs.org/api/reactivity-core) — confirms default `flush: 'pre'`, and that `flush: 'post'` "defers execution until after rendering" — corroborates the source-level finding rather than being the primary evidence for it

### Tertiary (LOW confidence)
- None used. All claims in this document trace to source code read directly, cross-checked against official docs.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new packages, all APIs already in use/available, versions read directly from installed `package.json` files
- Architecture (timing fix): HIGH — traced through actual scheduler source at specific file/line numbers, cross-checked against official Vue docs
- Pitfalls: HIGH for Pitfall 1 (source-verified); the residual risk is explicitly called out as requiring a browser-verified toggle test, per CONTEXT.md's own instruction not to assume even a rigorous-looking proof

**Research date:** 2026-07-26
**Valid until:** Tied to the installed versions of `vue`, `@vueuse/core`, `vitepress` in `package-lock.json` — re-verify if any of these three packages is upgraded before this phase executes (a scheduler-internals refactor in a Vue minor/patch release is unlikely but not impossible; the public API contract — default `flush: 'pre'`, `'post'` runs after render — is stable and documented, so even a Vue patch bump is unlikely to invalidate the recommendation).
