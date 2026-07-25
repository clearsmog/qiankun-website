# Phase 1: Technical Foundations - Pattern Map

**Mapped:** 2026-07-25
**Files analyzed:** 8 (new/modified)
**Analogs found:** 8 / 8

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `docs/.vitepress/config.js` (edit: unwrap `withMermaid`, remove GA head tags) | config | transform | itself (in-place edit) | exact |
| `package.json` (edit: deps, remove deploy scripts) | config | transform | itself (in-place edit) | exact |
| `.github/workflows/deploy.yml` (edit: drop `--legacy-peer-deps`) | config | batch | itself (in-place edit) | exact |
| `amplify.yml` (delete) | config | n/a | n/a (deletion) | n/a |
| `deploy.sh` (delete) | utility | n/a | n/a (deletion) | n/a |
| `docs/privacy.md` (new) | component (content page) | request-response (static render) | `docs/contact.md` | exact |
| `docs/.vitepress/theme/index.js` (edit: add `layout-bottom` slot) | provider/theme-config | event-driven (slot injection) | itself (in-place edit) | exact |
| `docs/.vitepress/theme/PrivacyFooterLink.vue` (new component) | component | request-response (static render) | `docs/.vitepress/theme/NotFound.vue` (as slot-rendered theme component) | role-match |
| `README.md` (edit: deploy section, plugin list) | config (docs) | transform | itself (in-place edit) | exact |

## Pattern Assignments

### `docs/privacy.md` (content page)

**Analog:** `docs/contact.md` (also compare `docs/about.md`)

**Frontmatter pattern** (`docs/contact.md` lines 1-4):
```markdown
---
title: Contact
description: Get in touch with Qiankun
---
```
Note: `about.md` puts frontmatter first too, but starts its `#` heading two lines after closing `---` (blank line), while `contact.md` has no blank line before the `# Contact` heading — both are valid VitePress rendering, either spacing is fine. Follow `contact.md`'s tighter spacing (no blank line) since privacy.md is a short utility page like contact, not a narrative page like about.

**Prose/structure convention** (from `contact.md` lines 5-21 and `about.md` lines 6-28):
- Single `#`-level page title matching frontmatter `title`
- Short intro sentence, then `##` subsections
- Closes with an italicized one-liner (`*Thanks for visiting!*` / `*I typically respond within a few days.*`) — privacy.md should follow this closing-line convention for stylistic consistency, e.g. `*Last updated: [date].*`
- No components embedded (plain markdown only, unlike project case-study pages) — matches privacy's need for plain prose

**Suggested content shape for `docs/privacy.md`** (following the contact.md template exactly):
```markdown
---
title: Privacy
description: How this site handles analytics and data
---
# Privacy

This site uses [Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics/) for cookieless, aggregate traffic metrics.

## What This Means

- No cookies are set.
- No persistent identifiers are stored.
- No personal data is sold or shared with third parties.

Cloudflare's analytics does transiently process standard request metadata (e.g. IP address, user agent) to produce aggregate counts, as any web analytics service must, but nothing is retained that identifies you individually.

---

*Last updated: [date].*
```
(Wording note carried over from RESEARCH.md security section: avoid the stronger claim "collects no personal data" — say "no cookies or persistent identifiers" instead, since IP/user-agent are transiently processed.)

---

### `docs/.vitepress/theme/index.js` (add `layout-bottom` slot)

**Analog:** itself — the file already has the exact extension point needed; this is additive, not new-pattern.

**Current `Layout()` override** (lines 41-46):
```javascript
Layout() {
  return h(DefaultTheme.Layout, null, {
    'doc-top': () => h(JsonLd),
    'not-found': () => h(NotFound),
  })
},
```

**Required edit** — add a `'layout-bottom'` entry using the same `h(Component)` pattern already used for `doc-top`/`not-found`:
```javascript
Layout() {
  return h(DefaultTheme.Layout, null, {
    'doc-top': () => h(JsonLd),
    'not-found': () => h(NotFound),
    'layout-bottom': () => h(PrivacyFooterLink),
  })
},
```
Add the import alongside the existing `NotFound`/`JsonLd` imports (lines 6-7):
```javascript
import PrivacyFooterLink from './PrivacyFooterLink.vue'
```
No `enhanceApp()` registration needed — this component is only slot-rendered, never used as a markdown tag (same treatment as `JsonLd` and `NotFound`, which are also slot-only and not in `enhanceApp()`'s `app.component(...)` list).

**Why not `themeConfig.footer`:** `themeConfig.footer` (currently set in `config.js` lines 232-235: `{ message: "Built with VitePress", copyright: ... }`) renders via VitePress's shipped `VPFooter.vue`, which sets `display: none` via `.VPFooter.has-sidebar` CSS on every page with a sidebar (all of `/projects/*`, `/blog/*`, `/ai-workflow/*` per the `sidebar` map at `config.js` lines 171-222). The `layout-bottom` slot is emitted unconditionally in VitePress's own `Layout.vue`, bypassing this. Do not touch `themeConfig.footer` for the privacy link — leave the existing `Built with VitePress` footer as-is (it's a separate, cosmetic concern, out of phase scope) and add the privacy link purely via the new slot component.

---

### `docs/.vitepress/theme/PrivacyFooterLink.vue` (new component)

**Analog:** `docs/.vitepress/theme/NotFound.vue` — closest existing example of a small, slot-rendered (not markdown-invoked) theme component with scoped styles reading CSS vars.

**Structural pattern to copy** (from `NotFound.vue` lines 1-5, 37-46 — script setup + scoped style using VitePress CSS var tokens):
```vue
<script setup>
// no router needed for a simple link; keep this file minimal
</script>

<template>
  <div class="privacy-footer-link">
    <a href="/privacy">Privacy</a>
  </div>
</template>

<style scoped>
.privacy-footer-link {
  text-align: center;
  padding: 1rem 0 2rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}

.privacy-footer-link a {
  color: var(--vp-c-text-2);
  text-decoration: none;
}

.privacy-footer-link a:hover {
  color: var(--vp-c-brand-1);
}
</style>
```
This keeps consistent with the codebase's established convention (per CLAUDE.md Conventions section): `<script setup>`, `<style scoped>`, CSS custom-property tokens (`--vp-c-text-2`, `--vp-c-brand-1`) rather than hard-coded colors, kebab-case class names, no semicolon-omission concerns since this is markup-light.

---

### `docs/.vitepress/config.js` (unwrap `withMermaid`, remove GA)

**Analog:** itself, in-place surgical edit — no external analog needed, exact before/after shape already verified in RESEARCH.md.

**Current wrapper** (lines 1-4, 29-30, 253-254):
```javascript
import { withMermaid } from "vitepress-plugin-mermaid";
...
export default withMermaid(
  defineConfig({
    ...
  }),
);
```

**Target shape** (mechanical unwrap — delete import line 4, change line 29-30, remove trailing `)` at line 254, keep everything between `defineConfig({` and its matching `})`):
```javascript
export default defineConfig({
  ...
});
```

**Mermaid config block to delete** (lines 87-90):
```javascript
// Mermaid configuration
mermaid: {
  // Optional: customize mermaid theme
},
```

**GA head tags to delete** (lines 130-142, keep everything above `// Google Analytics` comment and the array's closing `]`):
```javascript
// Google Analytics
[
  "script",
  {
    async: "",
    src: "https://www.googletagmanager.com/gtag/js?id=G-4PF046MSJJ",
  },
],
[
  "script",
  {},
  `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-4PF046MSJJ');`,
],
```
Delete both array entries and the `// Google Analytics` comment; leave the `head: [...]` array's other entries (favicon, RSS alternate, meta tags) untouched — they end at line 129 (`twitter:image` meta) which becomes the new last entry before `]`.

---

### `package.json` (dependency + script edits)

**Analog:** itself, in-place edit.

**Current devDependencies block** (lines 18-31):
```json
"devDependencies": {
  "@iconify/json": "^2.2.430",
  "@nolebase/vitepress-plugin-enhanced-readabilities": "^2.18.2",
  "mermaid": "^11.12.2",
  "unplugin-icons": "^23.0.1",
  "vite": "^8.1.4",
  "vite-plugin-imagemin": "^0.6.1",
  "vite-plugin-pwa": "^1.2.0",
  "vitepress": "^2.0.0-alpha.18",
  "vitepress-plugin-group-icons": "^1.7.5",
  "vitepress-plugin-mermaid": "^2.0.17",
  "vitepress-plugin-rss": "^0.4.4",
  "vitepress-plugin-tabs": "^0.9.1"
}
```
Edits: remove `"mermaid"` and `"vitepress-plugin-mermaid"` lines entirely; change `"vite-plugin-pwa": "^1.2.0"` to `"^1.3.0"`; change `"vitepress": "^2.0.0-alpha.18"` to exact `"2.0.0-alpha.18"` (no caret).

**Scripts block** (lines 6-12) — remove the `deploy` and `deploy:quick` lines:
```json
"scripts": {
  "docs:dev": "vitepress dev docs",
  "docs:build": "vitepress build docs",
  "docs:preview": "vitepress preview docs"
}
```
(drop trailing comma correctly after removing the last two entries).

---

### `.github/workflows/deploy.yml` (drop legacy flag)

**Analog:** itself, single-line edit.

**Current line 21:**
```yaml
      - run: npm ci --legacy-peer-deps
```
**Target:**
```yaml
      - run: npm ci
```

---

### `amplify.yml`, `deploy.sh` (deletion, gated by checkpoint)

No analog needed — pure deletion after the Amplify-disable checkpoint per CONTEXT.md ordering. Confirm `package.json`'s `deploy`/`deploy:quick` scripts (which invoke `./deploy.sh`) are removed in the same commit so no dangling entry-point remains.

---

### `README.md` (stale doc references)

**Analog:** itself — grep-and-replace style edit, not pattern-copy.

Update the "Deploy" section (currently describes AWS Amplify auto-deploy on push) to describe the GitHub Actions → Cloudflare Pages path instead, and remove `vitepress-plugin-mermaid` from the "Plugins" list. No concrete line numbers extracted here (research flagged these as present but this pattern pass did not open README.md — planner should grep `README.md` for "Amplify" and "mermaid" before editing).

## Shared Patterns

### Theme slot-injection pattern (all new theme components)
**Source:** `docs/.vitepress/theme/index.js` lines 41-46 (`Layout()` override), instantiated per-component as `NotFound.vue` / `JsonLd.vue`
**Apply to:** `PrivacyFooterLink.vue`
- Component lives in `docs/.vitepress/theme/`, is imported at the top of `index.js`, and wired into the `Layout()` override's slot map — never registered via `enhanceApp()`'s `app.component(...)` (that list is reserved for components invoked directly inside markdown content, e.g. `MetricCards`, `EBar`).

### VitePress content-page convention (all new markdown pages)
**Source:** `docs/contact.md`, `docs/about.md`
**Apply to:** `docs/privacy.md`
- YAML frontmatter with `title` + `description`
- Single `# Title` heading matching frontmatter title
- Plain prose, `##` subsections, no embedded Vue components
- Closing italicized one-line sign-off

### Config edit safety (all config.js / package.json / deploy.yml edits)
**Source:** RESEARCH.md "Recommended Commit Sequence"
**Apply to:** `config.js`, `package.json`, `.github/workflows/deploy.yml`
- Every edit here is a surgical, in-place transform — no new file, no new abstraction. Verify `npm ci` (no flag) then `npm run docs:build` succeed locally before any commit touching these files.

## No Analog Found

None — every file in scope has either an exact in-place-edit analog (itself, pre-edit) or a clear content/component analog identified above.

## Metadata

**Analog search scope:** `docs/`, `docs/.vitepress/`, `docs/.vitepress/theme/`, repo root (`package.json`, `.github/workflows/`, `amplify.yml`, `deploy.sh`, `README.md`)
**Files scanned:** `docs/.vitepress/config.js`, `docs/.vitepress/theme/index.js`, `docs/.vitepress/theme/NotFound.vue`, `docs/about.md`, `docs/contact.md`, `package.json`, `.github/workflows/deploy.yml`
**Pattern extraction date:** 2026-07-25
