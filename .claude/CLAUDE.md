<!-- GSD:project-start source:PROJECT.md -->

## Project

**qiankun.co.uk — Personal Portfolio Site**

A personal portfolio website at `qiankun.co.uk` presenting Qiankun (Kenny) Zhu's quantitative finance work as a set of case studies. The URL goes on his CV, so the primary audience is finance and energy recruiters, hiring managers, and senior managers arriving cold with no prior context and roughly twenty seconds of patience.

This milestone is a **polish and prune** pass on an existing VitePress site: remove filler and unfinished sections, rewrite the positioning so a stranger immediately understands who this is, rebuild the visual layer to read as simple and professional, and clean up the technical foundations underneath.

**Core Value:** A hiring manager who clicks the URL from the CV forms a favourable, accurate impression of Qiankun's quantitative capability within twenty seconds — and finds nothing that undermines it.

### Constraints

- **Tech stack**: Stay on VitePress + Vue 3 + ECharts — the site works and the component library is a real asset; no framework migration
- **Deployment**: Cloudflare Pages at `qiankun.co.uk` — domain is established and already on materials
- **Audience**: Finance/energy hiring audience, not a developer audience — technical cleverness is invisible to them, presentation is not
- **Disclosure**: Nothing about the ENN trading role goes on a public indexed page
- **Content**: Case study substance stays as-is; this milestone touches framing, not analysis
- **Package manager**: npm (existing `package-lock.json`)

<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->

## Technology Stack

## Languages

- JavaScript (ES Modules) - Used throughout the site for build configuration and Vue components
- Markdown - Content authored in Markdown (.md files)

## Runtime

- Node.js v22 (specified in GitHub Actions)
- npm - Lockfile present: `package-lock.json`

## Frameworks

- VitePress v2.0.0-alpha.18 - Static site generator and documentation framework (`docs/.vitepress/config.js`)
- Vue 3 - JavaScript UI framework (used by VitePress)
- Vite v8.1.4 - Fast build tool and development server

## Key Dependencies

- chart.js v4.5.1 - Simple JavaScript charts
- echarts v6.1.0 - Advanced data visualization and charting
- vue-echarts v8.0.1 - Vue wrapper for ECharts
- vitepress-plugin-mermaid v2.0.17 - Diagram support (flowcharts, sequences, state diagrams)
- vitepress-plugin-tabs v0.9.1 - Tabbed content blocks
- vitepress-plugin-group-icons v1.7.5 - Icon grouping in documentation
- vitepress-plugin-rss v0.4.4 - RSS feed generation (`docs/.vitepress/config.js:14-26`)
- @iconify/json v2.2.430 - Icon library data
- unplugin-icons v23.0.1 - Icon framework integration
- @nolebase/vitepress-plugin-enhanced-readabilities v2.18.2 - Accessibility improvements
- vite-plugin-pwa v1.2.0 - Progressive Web App support with Workbox
- vite-plugin-imagemin v0.6.1 - Image optimization (JPEG, PNG, WebP, GIF)
- mermaid v11.12.2 - Diagram rendering engine

## Configuration

- Site URL: https://qiankun.co.uk (defined in config and deployment scripts)
- Google Analytics: G-4PF046MSJJ (injected via head tags in `docs/.vitepress/config.js:131-142`)
- Cloudflare Account ID: `0a5ceee99ef2f0c3f66bb55ff5adf359` (in `.github/workflows/deploy.yml`)
- Environment variables required at deployment time:
- `docs/.vitepress/config.js` - Main VitePress configuration
- `package.json` - Project metadata and dependencies
- `amplify.yml` - AWS Amplify build configuration
- `.github/workflows/deploy.yml` - GitHub Actions CI/CD pipeline

## Platform Requirements

- Node.js v22+
- npm v10+ (implied by Node.js v22)
- Standard shell (bash/fish) for deploy.sh script
- Static hosting provider:
- Domain: qiankun.co.uk
- Hosting: Cloudflare Pages with AWS Amplify as backup

<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->

## Conventions

## Naming Patterns

- Vue components: PascalCase (e.g., `MetricCards.vue`, `VizEChart.vue`, `ProcessSteps.vue`)
- Data files: kebab-case suffix with `.data.js` (e.g., `blog-posts.data.js`)
- Configuration files: camelCase or kebab-case (e.g., `config.js`, `custom.css`)
- camelCase throughout (e.g., `ensureEcharts()`, `themeTokens()`, `baseTooltip()`)
- Helper/utility functions use descriptive names: `cssVar()`, `baseGrid()`, `createContentLoader()`
- camelCase for local scope (e.g., `tick`, `option`, `labels`, `values`)
- Reactive Vue state: `const state = ref(initialValue)`
- Constants: uppercase with underscores when appropriate (rare in this codebase)
- Vue prop types documented inline with comments showing structure
- Example from `MetricCards.vue:` `// [{ label, value, hint? }]`
- Example from `EBar.vue:` `// [{ label, value, color?, sub? }]`
- kebab-case throughout (e.g., `.metric-cards`, `.metric-card`, `.process-steps`, `.viz-echart`)
- BEM-like structure: `.block__element` pattern used (e.g., `.viz-echart__canvas`)
- State classes: `.dark` for dark mode

## Code Style

- No formal configuration (no `.eslintrc`, `.prettierrc`, or `biome.json`)
- Assumed manual or basic IDE formatting
- 2-space indentation appears to be standard (see `config.js`, Vue components)
- No semicolons at end of statements in Vue/JS files
- No linting tool currently configured
- Recommend adding ESLint + Prettier for consistency if expanding the project
- Modern Vue 3 with `<script setup>` syntax throughout
- All components use reactive composition API: `ref()`, `computed()`, `watch()`, lifecycle hooks
- Props defined with `defineProps()` including type validation
- Scoped styles: `<style scoped>` in every component

## Import Organization

- None currently configured; uses relative paths throughout
- Example: `import DefaultTheme from 'vitepress/theme'`
- Local imports: `./components/MetricCards.vue`, `./echarts-setup.js`
- Located in `docs/.vitepress/theme/index.js`
- Pattern: `app.component('ComponentName', ImportedComponent)`
- All custom components registered globally in `enhanceApp()` hook

## Error Handling

- Defensive prop access with `v-if` conditionals (e.g., `v-if="item.hint"`)
- Optional chaining in computed values: `item?.sub ? '...' : ''`
- Safe DOM queries with optional chaining: `chartRef.value?.resize?.()`
- No try/catch blocks visible in source code (framework handles most errors)
- Vue PropTypes used: `type: Array`, `type: Boolean`, `type: Number`, `type: String`, etc.
- `required: true` flag used for mandatory props
- Computed values validated before rendering

## Logging

- No structured logging framework present
- Debug output would use standard `console.log()`, `console.error()` if needed
- ECharts rendering happens via `vue-echarts` component (abstracts logging)

## Comments

- Prop structure documented inline above `defineProps()` blocks
- Complex computed logic explained (e.g., echarts option calculations)
- Configuration magic numbers explained (e.g., grid padding, animation durations)
- Entry points documented (e.g., `// Tree-shaken ECharts registration`)
- Minimal but used for utility exports
- Example from `echarts-setup.js:` function names are self-documenting (`themeTokens()`, `baseTooltip()`)
- No full JSDoc blocks; comments are inline and terse

## Function Design

- Small, focused functions (5-15 lines typical)
- Example: `baseTooltip()`, `baseGrid()`, `cssVar()` are 5-10 lines each
- Larger functions like `EBar.vue`'s computed option are ~100 lines (complex chart configuration)
- Destructuring used in props: `{ items, horizontal, unit, max, height }` in `EBar.vue`
- Component functions accept `t` (theme tokens) as parameter when needed
- Optional parameters documented via JSDoc comments
- Computed returns reactive objects (echarts options, filtered arrays)
- Helper functions return plain objects or formatted strings
- Vue lifecycle functions return nothing (`onMounted()`, `onBeforeUnmount()`)

## Module Design

- VitePress config uses `export default` for main config object
- Theme setup uses named exports: `export function ensureEcharts()`, `export function themeTokens()`
- Vue components use implicit default export (SFC pattern)
- Data loaders: `export default createContentLoader(...)`
- Not used; each component imported individually in `theme/index.js`
- Single registration point in `docs/.vitepress/theme/index.js` for all global components

## Theme & Styling

- Centralized in `docs/.vitepress/theme/custom.css`
- Organized by category: Brand colors, Neutral grays, Backgrounds, Text, Dividers
- Dark mode variants in `.dark` selector
- Color tokens: `--vp-c-brand-1`, `--vp-c-text-1`, `--vp-c-text-2`, `--vp-c-text-3`, `--vp-c-divider`
- Typography: Inter font stack with fallbacks
- Shadows: Named variables (`--apple-shadow-sm`, `--apple-shadow-md`, `--apple-shadow-lg`)
- Easing functions: `--apple-ease`, `--apple-spring` for animations
- Mobile-first with `@media (max-width: 768px)` queries
- Grid columns adjust based on viewport (e.g., 4 columns → 2 columns on mobile)

<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->

## Architecture

## System Overview

```text

```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| Theme Setup | Registers Vue components, extends VitePress default theme | `docs/.vitepress/theme/index.js` |
| Visualization (ECharts) | Renders interactive charts with theme-aware styling | `docs/.vitepress/theme/components/viz/EBar.vue`, `ELine.vue`, etc. |
| VizEChart Wrapper | Wraps vue-echarts, handles theme switching, auto-resize | `docs/.vitepress/theme/components/viz/VizEChart.vue` |
| Custom Components | Content display (metrics, process steps, project charts) | `docs/.vitepress/theme/components/MetricCards.vue`, `ProcessSteps.vue` |
| Configuration | Site config, plugins, nav, sidebar, SEO metadata | `docs/.vitepress/config.js` |
| Custom Styling | Apple-inspired theme, typography, dark mode support | `docs/.vitepress/theme/custom.css` |
| Content Data | Dynamic blog post loading and sorting | `docs/.vitepress/data/blog-posts.data.js` |

## Pattern Overview

- **Content-as-Code**: Markdown files with embedded Vue components and frontmatter
- **Component-Driven**: Vue components registered globally and embedded in markdown via angle-bracket tags
- **Theme-Aware Visualization**: ECharts charts respond to light/dark mode theme switching via CSS variables
- **Static Generation**: Builds to fully static HTML/JS at `docs/.vitepress/dist/`
- **Progressive Enhancement**: PWA support, image optimization, RSS feeds, sitemap

## Layers

- Purpose: Markdown source content with frontmatter metadata
- Location: `docs/` (root), `docs/blog/`, `docs/projects/`, `docs/ai-workflow/`, `docs/photos/`
- Contains: `.md` files with YAML frontmatter (title, description, date) and embedded Vue components
- Depends on: Theme components for rendering
- Used by: VitePress to generate static HTML pages
- Purpose: Vue components, styling, and VitePress configuration
- Location: `docs/.vitepress/theme/`, `docs/.vitepress/config.js`
- Contains: Vue components (visualization, layout, custom), CSS, theme configuration
- Depends on: ECharts, vue-echarts, VitePress plugins
- Used by: VitePress to render content with styled components
- Purpose: Chart and graph rendering with theme support
- Location: `docs/.vitepress/theme/components/viz/`
- Contains: ECharts wrapper (VizEChart.vue), chart components (EBar, ELine, EDonut, etc.), theme setup (echarts-setup.js)
- Depends on: echarts, vue-echarts, CSS variables for theming
- Used by: Project pages and blog posts to display quantitative data
- Purpose: Site generation and deployment automation
- Location: `docs/.vitepress/config.js`, `deploy.sh`, `.github/workflows/deploy.yml`, `amplify.yml`
- Contains: VitePress config (plugins, nav, sidebar), deployment scripts
- Depends on: npm, Vite, VitePress, GitHub Actions, Cloudflare Pages
- Used by: Development and production workflows

## Data Flow

### Primary Request Path (Blog Post)

### Project Page with Visualization

### Blog Post Discovery

- No persistent state — site is static HTML generated at build time
- Theme state (light/dark) managed via CSS class on `<html>` element, persisted via browser localStorage
- Client-side: theme toggle updates `document.documentElement.classList.toggle('dark')`
- Chart theme tokens computed reactively from CSS variables via `cssVar()` function

## Key Abstractions

- Purpose: Encapsulates vue-echarts instance with theme reactivity and resize handling
- Examples: `docs/.vitepress/theme/components/viz/VizEChart.vue`
- Pattern: Props receive ECharts option object; MutationObserver watches for `.dark` class flip on `<html>` and resizes chart
- Purpose: High-level, domain-specific chart wrappers that generate ECharts options
- Examples: `docs/.vitepress/theme/components/viz/EBar.vue:32-133`
- Pattern: Accept simple data array (items with label, value, color); compute full ECharts option with theme tokens; pass to VizEChart
- Purpose: Centralized, reactive theme values for colors, spacing, typography
- Examples: `docs/.vitepress/theme/components/viz/echarts-setup.js:66-88`
- Pattern: `themeTokens()` reads CSS custom properties and returns object with brand, text1-3, divider, palette
- Purpose: Wrapper for visualization sections with header, badge, title, subtitle
- Examples: `docs/.vitepress/theme/components/viz/VizPanel.vue:25-94`
- Pattern: Slot-based composition; applies gradient background, top border, consistent padding

## Entry Points

- Location: `docs/index.md`
- Triggers: User navigates to `/` or loads site
- Responsibilities: Renders hero section (name, tagline, CTA buttons), feature cards (Projects, Technology, Writing)
- Location: `docs/.vitepress/config.js:160-168`
- Triggers: User clicks nav links
- Responsibilities: Routes to Home (/), About (/about), Projects (/projects/), AI Workflow (/ai-workflow/), Blog (/blog/), Photos (/photos/), Contact (/contact)
- Location: `docs/.vitepress/config.js:171-222`
- Triggers: User enters `/projects/`, `/ai-workflow/`, or `/blog/` sections
- Responsibilities: Displays nested section menus for active path

## Architectural Constraints

- **Static Generation Only**: No server-side rendering or dynamic API calls (RSS feeds generated at build time)
- **Content immutable at build time**: Changes to `.md` files require rebuild and redeploy
- **Theme CSS variables**: All color/spacing values must be CSS custom properties for reactivity
- **ECharts canvas renderer**: All charts use canvas (not SVG) for performance; `CanvasRenderer` configured in `echarts-setup.js:4`
- **No page state persistence**: Navigation is client-side only; no Vuex/Pinia store
- **Build artifact path**: Output always `docs/.vitepress/dist/` (hardcoded in `amplify.yml:11` and deployment scripts)
- **Single-language site**: VitePress config has `lang: 'en-GB'` only; no i18n support

## Anti-Patterns

### Duplicate Chart Implementations

### Hard-coded Color Palette in Multiple Locations

### Component Props Documentation Missing

## Error Handling

- Build-time errors (malformed markdown): VitePress fails build, developer fixes and rebuilds
- Runtime errors (missing image): 404 handled by Cloudflare Pages with default error page
- Theme switching (light/dark): DOM mutation observer handles edge cases; chart resizes on class change
- No try/catch blocks in Vue components (static content assumption)

## Cross-Cutting Concerns

<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->

## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->

## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:

- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->

## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
