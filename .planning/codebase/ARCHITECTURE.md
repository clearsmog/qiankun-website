<!-- refreshed: 2026-07-25 -->
# Architecture

**Analysis Date:** 2026-07-25

## System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│              Markdown Content Layer                          │
│  `docs/*.md`, `docs/blog/*.md`, `docs/projects/*.md`        │
│  (Frontmatter + Vue components embedded in markdown)        │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│         VitePress Theme & Component Layer                    │
│  `docs/.vitepress/theme/`                                    │
│  - Layout (JsonLd, NotFound)                                │
│  - Viz Components (EBar, ELine, EDonut, etc.)               │
│  - Custom Components (MetricCards, ProcessSteps)            │
│  - Theme plugins (tabs, icons, mermaid)                     │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│          Visualization & Styling Layer                       │
│  - ECharts (bar, line, pie, heatmap, scatter)               │
│  - SVG fallback charts (legacy)                             │
│  - custom.css (Apple-inspired theme, dark mode)             │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│        Build & Static Generation (Vite/VitePress)            │
│  `docs/.vitepress/config.js`                                │
│  - Markdown plugins (tabs, icons, mermaid)                  │
│  - Vite plugins (PWA, imagemin, RSS, icons)                 │
│  - Sitemap, RSS feed generation                             │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│       Static Output & Deployment                             │
│  `docs/.vitepress/dist/` → Cloudflare Pages                 │
│  GitHub Actions → GitHub Push → Cloudflare Deploy           │
└─────────────────────────────────────────────────────────────┘
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

**Overall:** VitePress static site generator with Vue 3 components + ECharts data visualization library

**Key Characteristics:**
- **Content-as-Code**: Markdown files with embedded Vue components and frontmatter
- **Component-Driven**: Vue components registered globally and embedded in markdown via angle-bracket tags
- **Theme-Aware Visualization**: ECharts charts respond to light/dark mode theme switching via CSS variables
- **Static Generation**: Builds to fully static HTML/JS at `docs/.vitepress/dist/`
- **Progressive Enhancement**: PWA support, image optimization, RSS feeds, sitemap

## Layers

**Content Layer:**
- Purpose: Markdown source content with frontmatter metadata
- Location: `docs/` (root), `docs/blog/`, `docs/projects/`, `docs/ai-workflow/`, `docs/photos/`
- Contains: `.md` files with YAML frontmatter (title, description, date) and embedded Vue components
- Depends on: Theme components for rendering
- Used by: VitePress to generate static HTML pages

**Theme Layer:**
- Purpose: Vue components, styling, and VitePress configuration
- Location: `docs/.vitepress/theme/`, `docs/.vitepress/config.js`
- Contains: Vue components (visualization, layout, custom), CSS, theme configuration
- Depends on: ECharts, vue-echarts, VitePress plugins
- Used by: VitePress to render content with styled components

**Visualization Layer:**
- Purpose: Chart and graph rendering with theme support
- Location: `docs/.vitepress/theme/components/viz/`
- Contains: ECharts wrapper (VizEChart.vue), chart components (EBar, ELine, EDonut, etc.), theme setup (echarts-setup.js)
- Depends on: echarts, vue-echarts, CSS variables for theming
- Used by: Project pages and blog posts to display quantitative data

**Build & Deployment Layer:**
- Purpose: Site generation and deployment automation
- Location: `docs/.vitepress/config.js`, `deploy.sh`, `.github/workflows/deploy.yml`, `amplify.yml`
- Contains: VitePress config (plugins, nav, sidebar), deployment scripts
- Depends on: npm, Vite, VitePress, GitHub Actions, Cloudflare Pages
- Used by: Development and production workflows

## Data Flow

### Primary Request Path (Blog Post)

1. User navigates to `/blog/welcome` → Router resolves `docs/blog/welcome.md` (`docs/blog/welcome.md:1-14`)
2. VitePress loads frontmatter (title, date, author, description) and renders markdown
3. Markdown content is compiled to Vue template by VitePress
4. Any Vue components in markdown (e.g., `<ProcessSteps />`) are rendered with props from script setup
5. Theme wrapper applies `docs/.vitepress/theme/custom.css` styling
6. Fully rendered page served to client as static HTML + JS

### Project Page with Visualization

1. User navigates to `/projects/global-equity-portfolio` → Router resolves `docs/projects/global-equity-portfolio.md`
2. Page's `<script setup>` defines data arrays (metrics, factors, sectors, etc.)
3. Markdown embeds visualization components: `<HeroMetrics :items="metrics" />`
4. `HeroMetrics` component (`docs/.vitepress/theme/components/viz/HeroMetrics.vue`) renders metrics cards
5. Project markdown also embeds `<EBar :items="factors" />` for factor attribution chart
6. `EBar` component computes ECharts option object with theme tokens (`echarts-setup.js:66-88`)
7. `VizEChart` wrapper initializes chart with theme-aware colors and responsive sizing
8. Chart listens to DOM mutation observer for dark mode changes → re-renders with new color scheme

### Blog Post Discovery

1. VitePress loads content loader `docs/.vitepress/data/blog-posts.data.js:1-16`
2. `createContentLoader` scans `blog/*.md` files
3. Each post transformed: extract title, description, url, date from frontmatter
4. Posts sorted by date (newest first)
5. Blog index page (`docs/blog/index.md`) accesses loaded data via `$data`

**State Management:**
- No persistent state — site is static HTML generated at build time
- Theme state (light/dark) managed via CSS class on `<html>` element, persisted via browser localStorage
- Client-side: theme toggle updates `document.documentElement.classList.toggle('dark')`
- Chart theme tokens computed reactively from CSS variables via `cssVar()` function

## Key Abstractions

**VizEChart Wrapper:**
- Purpose: Encapsulates vue-echarts instance with theme reactivity and resize handling
- Examples: `docs/.vitepress/theme/components/viz/VizEChart.vue`
- Pattern: Props receive ECharts option object; MutationObserver watches for `.dark` class flip on `<html>` and resizes chart

**Chart Components (EBar, ELine, EDonut, etc.):**
- Purpose: High-level, domain-specific chart wrappers that generate ECharts options
- Examples: `docs/.vitepress/theme/components/viz/EBar.vue:32-133`
- Pattern: Accept simple data array (items with label, value, color); compute full ECharts option with theme tokens; pass to VizEChart

**Theme Tokens:**
- Purpose: Centralized, reactive theme values for colors, spacing, typography
- Examples: `docs/.vitepress/theme/components/viz/echarts-setup.js:66-88`
- Pattern: `themeTokens()` reads CSS custom properties and returns object with brand, text1-3, divider, palette

**VizPanel Layout:**
- Purpose: Wrapper for visualization sections with header, badge, title, subtitle
- Examples: `docs/.vitepress/theme/components/viz/VizPanel.vue:25-94`
- Pattern: Slot-based composition; applies gradient background, top border, consistent padding

## Entry Points

**Home Page:**
- Location: `docs/index.md`
- Triggers: User navigates to `/` or loads site
- Responsibilities: Renders hero section (name, tagline, CTA buttons), feature cards (Projects, Technology, Writing)

**Navigation:**
- Location: `docs/.vitepress/config.js:160-168`
- Triggers: User clicks nav links
- Responsibilities: Routes to Home (/), About (/about), Projects (/projects/), AI Workflow (/ai-workflow/), Blog (/blog/), Photos (/photos/), Contact (/contact)

**Sidebar Navigation:**
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

**What happens:** Both ECharts components (EBar, ELine, etc.) AND legacy SVG components (SvgAreaChart, SvgHBars, etc.) are registered in theme (`docs/.vitepress/theme/index.js:27-32, 67-72`)

**Why it's wrong:** Maintenance burden; SVG components are legacy and not used in current projects; same logic implemented twice (duplicated data transformation, styling)

**Do this instead:** Remove all `Svg*` component imports and registrations. If SVG rendering is needed for specific use cases, create a single `SvgChartWrapper` that delegates to ECharts with SVG renderer mode.

### Hard-coded Color Palette in Multiple Locations

**What happens:** Brand color `#0071e3` appears in `custom.css:12`, `echarts-setup.js:76`, `config.js:48` (PWA theme color), and individual component styles

**Why it's wrong:** Changing brand color requires edits in 3+ files; single source of truth violated

**Do this instead:** Define palette once in `echarts-setup.js`, export as named constant, import into CSS via PostCSS or CSS variables. Update VitePress config to reference same constant.

### Component Props Documentation Missing

**What happens:** Chart components like `EBar` accept props (items array with shape `{ label, value, color?, sub? }`) but no TypeScript interfaces or JSDoc comments document the shape

**Why it's wrong:** Authors adding new visualizations must guess or read implementation code; easy to pass malformed data

**Do this instead:** Add JSDoc or TypeScript interfaces at top of each component file documenting expected prop shapes and defaults.

## Error Handling

**Strategy:** No error handling — static site assumes valid content

**Patterns:**
- Build-time errors (malformed markdown): VitePress fails build, developer fixes and rebuilds
- Runtime errors (missing image): 404 handled by Cloudflare Pages with default error page
- Theme switching (light/dark): DOM mutation observer handles edge cases; chart resizes on class change
- No try/catch blocks in Vue components (static content assumption)

## Cross-Cutting Concerns

**Logging:** None implemented — static site generates at build time

**Validation:** Markdown frontmatter validated implicitly by VitePress schema; no runtime validation

**Authentication:** None — public site with no user accounts or protected content

**Internationalization:** Not implemented; site is English-only (en-GB locale in config)
