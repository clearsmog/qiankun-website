# Technology Stack

**Analysis Date:** 2026-07-25

## Languages

**Primary:**
- JavaScript (ES Modules) - Used throughout the site for build configuration and Vue components
- Markdown - Content authored in Markdown (.md files)

## Runtime

**Environment:**
- Node.js v22 (specified in GitHub Actions)

**Package Manager:**
- npm - Lockfile present: `package-lock.json`

## Frameworks

**Core:**
- VitePress v2.0.0-alpha.18 - Static site generator and documentation framework (`docs/.vitepress/config.js`)
- Vue 3 - JavaScript UI framework (used by VitePress)

**Build/Dev:**
- Vite v8.1.4 - Fast build tool and development server

## Key Dependencies

**Data Visualization:**
- chart.js v4.5.1 - Simple JavaScript charts
- echarts v6.1.0 - Advanced data visualization and charting
- vue-echarts v8.0.1 - Vue wrapper for ECharts

**Content & Visualization Plugins:**
- vitepress-plugin-mermaid v2.0.17 - Diagram support (flowcharts, sequences, state diagrams)
- vitepress-plugin-tabs v0.9.1 - Tabbed content blocks
- vitepress-plugin-group-icons v1.7.5 - Icon grouping in documentation
- vitepress-plugin-rss v0.4.4 - RSS feed generation (`docs/.vitepress/config.js:14-26`)

**Icons & Accessibility:**
- @iconify/json v2.2.430 - Icon library data
- unplugin-icons v23.0.1 - Icon framework integration
- @nolebase/vitepress-plugin-enhanced-readabilities v2.18.2 - Accessibility improvements

**Performance & PWA:**
- vite-plugin-pwa v1.2.0 - Progressive Web App support with Workbox
- vite-plugin-imagemin v0.6.1 - Image optimization (JPEG, PNG, WebP, GIF)
- mermaid v11.12.2 - Diagram rendering engine

## Configuration

**Environment:**
- Site URL: https://qiankun.co.uk (defined in config and deployment scripts)
- Google Analytics: G-4PF046MSJJ (injected via head tags in `docs/.vitepress/config.js:131-142`)
- Cloudflare Account ID: `0a5ceee99ef2f0c3f66bb55ff5adf359` (in `.github/workflows/deploy.yml`)
- Environment variables required at deployment time:
  - `CLOUDFLARE_API_TOKEN` - For Cloudflare Pages deployment
  - `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` - Optional, for AWS Amplify (checked at runtime)

**Build:**
- `docs/.vitepress/config.js` - Main VitePress configuration
- `package.json` - Project metadata and dependencies
- `amplify.yml` - AWS Amplify build configuration
- `.github/workflows/deploy.yml` - GitHub Actions CI/CD pipeline

## Platform Requirements

**Development:**
- Node.js v22+
- npm v10+ (implied by Node.js v22)
- Standard shell (bash/fish) for deploy.sh script

**Production:**
- Static hosting provider:
  - Cloudflare Pages (primary) - `npx wrangler pages deploy` via GitHub Actions
  - AWS Amplify (secondary) - Configured via `amplify.yml` with auto-deploy on Git push

**DNS & Domain:**
- Domain: qiankun.co.uk
- Hosting: Cloudflare Pages with AWS Amplify as backup

---

*Stack analysis: 2026-07-25*
