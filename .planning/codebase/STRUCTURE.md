# Codebase Structure

**Analysis Date:** 2026-07-25

## Directory Layout

```
qiankun-website/
├── docs/                           # VitePress source root
│   ├── .vitepress/                # VitePress configuration & theme
│   │   ├── config.js              # Site config (plugins, nav, sidebar, SEO)
│   │   ├── data/
│   │   │   └── blog-posts.data.js # Dynamic blog post loader
│   │   ├── theme/
│   │   │   ├── index.js           # Theme setup + component registration
│   │   │   ├── custom.css         # Apple-inspired theme & dark mode
│   │   │   ├── JsonLd.vue         # JSON-LD schema component
│   │   │   ├── NotFound.vue       # 404 error page
│   │   │   └── components/
│   │   │       ├── MetricCards.vue      # Metric display component
│   │   │       ├── ProjectChart.vue     # Project overview chart
│   │   │       ├── ProcessSteps.vue     # Process timeline component
│   │   │       └── viz/                 # Data visualization library
│   │   │           ├── echarts-setup.js # ECharts config & theme tokens
│   │   │           ├── VizEChart.vue    # Base ECharts wrapper
│   │   │           ├── VizPanel.vue     # Chart container with header
│   │   │           ├── VizGrid.vue      # Multi-chart grid layout
│   │   │           ├── HeroMetrics.vue  # Hero metrics display
│   │   │           ├── ProcessRail.vue  # Process step visualization
│   │   │           ├── EBar.vue         # Bar chart (ECharts)
│   │   │           ├── ELine.vue        # Line chart (ECharts)
│   │   │           ├── EDonut.vue       # Donut/pie chart (ECharts)
│   │   │           ├── EForest.vue      # Forest plot (ECharts)
│   │   │           ├── EFootball.vue    # Football field visualization
│   │   │           ├── EScorePath.vue   # Score path chart
│   │   │           ├── EHeatmap.vue     # Heatmap (ECharts)
│   │   │           ├── EHistogram.vue   # Histogram (ECharts)
│   │   │           ├── EGroupBar.vue    # Grouped bar chart
│   │   │           ├── ECombo.vue       # Combo chart (bar + line)
│   │   │           ├── SvgAreaChart.vue # Legacy SVG area chart
│   │   │           ├── SvgHBars.vue     # Legacy SVG horizontal bars
│   │   │           ├── SvgDonut.vue     # Legacy SVG donut
│   │   │           ├── SvgForest.vue    # Legacy SVG forest plot
│   │   │           ├── SvgFootballField.vue  # Legacy SVG football field
│   │   │           └── SvgScorePath.vue      # Legacy SVG score path
│   │   ├── cache/                 # VitePress build cache (gitignored)
│   │   └── dist/                  # Generated static output (gitignored)
│   ├── public/                    # Static assets
│   │   ├── logo.svg
│   │   ├── favicon.svg
│   │   ├── og-image.svg
│   │   └── projects/              # Project images & assets
│   │       ├── uk-finance-pay/
│   │       ├── board-diversity-esg/
│   │       ├── global-equity-portfolio/
│   │       ├── cisco-equity-valuation/
│   │       └── wq-alpha-research/
│   ├── photos/                    # Photos section
│   │   └── index.md
│   ├── blog/                      # Blog post content
│   │   ├── index.md               # Blog index
│   │   ├── welcome.md
│   │   ├── vite-plugins.md
│   │   └── etrm-systems.md
│   ├── projects/                  # Project portfolio content
│   │   ├── index.md               # Projects overview
│   │   ├── global-equity-portfolio.md
│   │   ├── wq-alpha-research.md
│   │   ├── board-diversity-esg.md
│   │   ├── cisco-equity-valuation.md
│   │   └── uk-finance-pay.md
│   ├── ai-workflow/               # AI Workflow documentation
│   │   ├── index.md               # Overview
│   │   ├── concepts.md
│   │   ├── patterns.md
│   │   ├── agents.md
│   │   └── tools.md
│   ├── index.md                   # Home page (hero layout)
│   ├── about.md                   # About page
│   └── contact.md                 # Contact page
├── .github/
│   └── workflows/
│       └── deploy.yml             # GitHub Actions → Cloudflare Pages
├── .planning/
│   └── codebase/                  # Codebase analysis documents
│       ├── ARCHITECTURE.md
│       ├── STRUCTURE.md
│       └── (other analysis docs)
├── node_modules/                  # npm packages (gitignored)
├── package.json                   # npm dependencies & scripts
├── package-lock.json              # npm lock file
├── amplify.yml                    # AWS Amplify config (legacy/unused)
├── deploy.sh                      # Manual deployment script
├── README.md                       # Project README
└── .gitignore                      # Git ignore rules
```

## Directory Purposes

**`docs/`:**
- Purpose: VitePress source root — all content and theme files live here
- Contains: Markdown content, Vue components, static assets, configuration
- Key files: `.vitepress/config.js` (config), `index.md` (home page)

**`docs/.vitepress/`:**
- Purpose: VitePress configuration and build output directory
- Contains: config.js, theme/ (Vue components and CSS), data/ (loaders), cache/, dist/ (build output)
- Key files: `config.js` defines site structure, nav, sidebar, plugins

**`docs/.vitepress/theme/`:**
- Purpose: Custom VitePress theme with Vue components and styling
- Contains: Vue component library (visualization, layout, content), custom.css (brand styling)
- Key files: `index.js` (registers all components), `custom.css` (Apple theme)

**`docs/.vitepress/theme/components/viz/`:**
- Purpose: Centralized data visualization component library
- Contains: ECharts wrapper (VizEChart.vue), chart components (EBar, ELine, etc.), theme utilities (echarts-setup.js)
- Key files: `echarts-setup.js` (theme setup, color palette), `VizEChart.vue` (base wrapper)

**`docs/blog/`:**
- Purpose: Blog post markdown files
- Contains: Markdown posts with frontmatter (title, date, description)
- Entry point: `docs/blog/index.md` lists all posts via dynamic loader

**`docs/projects/`:**
- Purpose: Project portfolio markdown files
- Contains: Detailed project case studies with embedded visualizations (ECharts charts, metrics)
- Entry point: `docs/projects/index.md` lists all projects via sidebar config

**`docs/public/`:**
- Purpose: Static assets served as-is (images, logos, project assets)
- Contains: SVG logos (logo.svg, favicon.svg, og-image.svg), project subdirectories with images
- Served at: Root of built site (e.g., `/logo.svg`)

**`.github/workflows/`:**
- Purpose: CI/CD automation
- Contains: GitHub Actions workflow (`deploy.yml`) that builds and deploys to Cloudflare Pages
- Trigger: GitHub push to `main` branch

## Key File Locations

**Entry Points:**
- `docs/index.md`: Home page (hero layout with feature cards)
- `docs/about.md`: About page
- `docs/contact.md`: Contact form page
- `docs/blog/index.md`: Blog listing page
- `docs/projects/index.md`: Projects overview page
- `docs/ai-workflow/index.md`: AI Workflow section overview

**Configuration:**
- `docs/.vitepress/config.js`: VitePress site config (nav, sidebar, plugins, SEO, theme)
- `package.json`: npm scripts, dependencies (VitePress, Vite, ECharts, plugins)
- `.github/workflows/deploy.yml`: CI/CD pipeline (GitHub Actions → Cloudflare Pages)
- `amplify.yml`: AWS Amplify config (legacy; not actively used)

**Core Logic:**
- `docs/.vitepress/theme/index.js`: Registers Vue components into VitePress
- `docs/.vitepress/theme/custom.css`: Brand colors, typography, dark mode CSS variables
- `docs/.vitepress/theme/components/viz/echarts-setup.js`: ECharts initialization, theme tokens, base tooltip/grid configs
- `docs/.vitepress/data/blog-posts.data.js`: Dynamic blog post loader (frontmatter extraction)

**Testing:**
- No test files — static site assumes valid content at build time

## Naming Conventions

**Files:**
- Content: kebab-case (e.g., `global-equity-portfolio.md`)
- Components: PascalCase (e.g., `VizEChart.vue`, `MetricCards.vue`)
- Config: lowercase (e.g., `config.js`, `echarts-setup.js`)
- CSS: lowercase with hyphens (e.g., `custom.css`)

**Directories:**
- Core: lowercase (e.g., `docs/`, `blog/`, `projects/`)
- VitePress config: `.vitepress/` (VitePress convention)
- Components: lowercase (e.g., `theme/components/`)

**Vue Component Props:**
- camelCase for all props (e.g., `seriesName`, `barMaxWidth`)
- Arrays named plural (e.g., `items`, `colors`)
- Booleans prefixed with `is-` or `show-` (e.g., `show: Boolean`)
- Objects named descriptive (e.g., `option: Object` for ECharts option)

**CSS Classes & Variables:**
- Custom properties (CSS variables): kebab-case prefixed with `--vp-` or `--apple-` (e.g., `--vp-c-brand-1`, `--apple-glass-bg`)
- Component classes: BEM convention (e.g., `.viz-panel__head`, `.viz-panel__badge`)

## Where to Add New Code

**New Blog Post:**
1. Create markdown file: `docs/blog/{slug}.md`
2. Add YAML frontmatter: `title`, `description`, `date`, `author` (optional)
3. Write markdown content; embed Vue components via angle brackets (e.g., `<EBar :items="data" />`)
4. No sidebar registration needed — automatically loaded by `blog-posts.data.js`

**New Project:**
1. Create markdown file: `docs/projects/{project-name}.md`
2. Add YAML frontmatter with project metadata
3. Define data in `<script setup>` block (metrics, charts, etc.)
4. Embed visualization components: `<VizPanel>`, `<EBar>`, `<ELine>`, etc.
5. Manually add entry to sidebar config in `docs/.vitepress/config.js:172-198` under `/projects/` section

**New Visualization:**
1. If displaying new chart type (e.g., sankey, tree), create `EChartType.vue` in `docs/.vitepress/theme/components/viz/`
2. Import `VizEChart` and `themeTokens` from `echarts-setup.js`
3. Compute ECharts option object with theme tokens
4. Register component in `docs/.vitepress/theme/index.js:app.component()`
5. Example: See `docs/.vitepress/theme/components/viz/EBar.vue:32-133` for pattern

**New Theme Component:**
1. Create file: `docs/.vitepress/theme/components/{ComponentName}.vue`
2. Use scoped styles with CSS variables for colors (from `custom.css`)
3. Register in `docs/.vitepress/theme/index.js:app.component()`
4. Usage: Embed in markdown as `<ComponentName />`

**New Utility or Data:**
1. Shared utilities: `docs/.vitepress/theme/components/viz/echarts-setup.js` (for chart-related) or new file in `theme/`
2. Dynamic data loaders: Create in `docs/.vitepress/data/` following `blog-posts.data.js` pattern
3. Import into component scripts and use

## Special Directories

**`docs/.vitepress/cache/`:**
- Purpose: VitePress build cache for faster rebuilds
- Generated: Yes (created by VitePress at build time)
- Committed: No (gitignored)

**`docs/.vitepress/dist/`:**
- Purpose: Static HTML/JS output (built site)
- Generated: Yes (created by `npm run docs:build`)
- Committed: No (gitignored)
- Deployed from: This directory is uploaded to Cloudflare Pages via GitHub Actions

**`.planning/codebase/`:**
- Purpose: GSD codebase analysis documents (this directory)
- Contains: ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, TESTING.md, CONCERNS.md (as generated)
- Committed: Yes (tracked in git)

**`node_modules/`:**
- Purpose: npm installed packages
- Generated: Yes (created by `npm install`)
- Committed: No (gitignored)

## Build Output Structure

After `npm run docs:build`, the generated site structure in `docs/.vitepress/dist/` is:

```
dist/
├── index.html              # Home page
├── about/index.html
├── contact/index.html
├── blog/index.html
├── blog/welcome/index.html
├── projects/index.html
├── projects/global-equity-portfolio/index.html
├── projects/[other projects]/index.html
├── ai-workflow/index.html
├── ai-workflow/concepts/index.html
├── photos/index.html
├── feed.rss                # Blog RSS feed
├── sitemap.xml             # Sitemap
├── assets/                 # JavaScript, CSS bundles (hashed filenames)
│   ├── [hash].js
│   ├── [hash].css
│   └── ...
├── logo.svg                # Copied from public/
├── favicon.svg
├── og-image.svg
└── [project assets]/       # Copied from public/projects/
```

The entire `dist/` directory is uploaded to Cloudflare Pages by GitHub Actions.
