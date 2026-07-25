# Codebase Concerns

**Analysis Date:** 2026-07-25

## Framework Stability

**VitePress at alpha version:**
- Issue: Running VitePress 2.0.0-alpha.18 when stable 1.6.4 is available (`docs/.vitepress/config.js:29`)
- Files: `package.json`, `.github/workflows/deploy.yml:23`
- Impact: Alpha versions are unstable and may have breaking changes, security issues, or data corruption bugs
- Fix approach: Plan migration to VitePress 1.6.4 (LTS) or wait for 2.0 stable release; test thoroughly before upgrade
- Priority: High - Affects entire site stability

## Dependency Management Issues

**Legacy peer dependencies flag:**
- Issue: Using `--legacy-peer-deps` in both CI and deploy scripts (`amplify.yml:6`, `.github/workflows/deploy.yml:21`)
- Files: `amplify.yml`, `.github/workflows/deploy.yml`, `deploy.sh`
- Impact: Masks peer dependency conflicts that may cause runtime errors; makes dependency conflicts invisible
- Fix approach: Resolve actual peer dependency conflicts rather than suppressing warnings; audit all transitive dependencies
- Priority: High

**Outdated dependencies:**
- Issue: Multiple dependencies have available updates (`npm outdated` shows):
  - `@iconify/json`: 2.2.430 → 2.2.505
  - `mermaid`: 11.12.2 → 11.16.0
  - `vite`: 8.1.4 → 8.1.5
  - `vite-plugin-pwa`: 1.2.0 → 1.3.0
- Files: `package.json`, `package-lock.json`
- Impact: Missing security patches, bug fixes, and performance improvements
- Fix approach: Run `npm update` and test thoroughly; set up Dependabot for automated updates
- Priority: Medium

## Code Quality & Technical Debt

**Unused component duplication:**
- Issue: Legacy SVG chart components registered but not used in any markdown file
  - `docs/.vitepress/theme/components/viz/SvgAreaChart.vue`
  - `docs/.vitepress/theme/components/viz/SvgHBars.vue`
  - `docs/.vitepress/theme/components/viz/SvgDonut.vue`
  - `docs/.vitepress/theme/components/viz/SvgForest.vue`
  - `docs/.vitepress/theme/components/viz/SvgFootballField.vue`
  - `docs/.vitepress/theme/components/viz/SvgScorePath.vue`
- Files: `docs/.vitepress/theme/index.js:27-33`, components in `docs/.vitepress/theme/components/viz/`
- Impact: Increases bundle size (~50KB+ of dead code), maintenance burden, slower app initialization
- Fix approach: Remove all unused SVG chart components and their registrations; keep only active ECharts implementation
- Priority: Medium

**Duplicate mutation observers for theme changes:**
- Issue: Both `VizEChart.vue` and `EBar.vue` independently watch for dark mode class changes (`docs/.vitepress/theme/components/viz/VizEChart.vue:22-33`, `docs/.vitepress/theme/components/viz/EBar.vue:20-30`)
- Files: `docs/.vitepress/theme/components/viz/VizEChart.vue`, `docs/.vitepress/theme/components/viz/EBar.vue`, and likely other E* chart components
- Impact: Multiple observers watching the same DOM mutations causes unnecessary re-renders and performance degradation on every theme toggle
- Fix approach: Create a shared composable for theme observation; use it in all chart components instead of individual observers
- Priority: Medium

## Testing & Quality Assurance

**No automated testing:**
- Issue: Project has no test framework, test files, or test CI pipeline
- Files: No `*.test.js`, `*.spec.js`, or test configuration files in project root
- Impact: Cannot catch regressions in build process, component rendering, or content loading; manual testing only
- Fix approach: Add Jest/Vitest; create tests for: blog post data loader, chart component rendering, markdown content structure
- Priority: High

**No build output monitoring:**
- Issue: No bundle size analysis, asset size tracking, or build performance metrics
- Files: No `.github/workflows/` steps for size reporting
- Impact: Stylesheet and JavaScript bundle can grow unbounded without visibility; performance degradation goes undetected
- Fix approach: Add build size reporting in CI; set size budgets for `.js` and `.css` bundles
- Priority: Medium

## Deployment & CI/CD

**Dual deployment systems creating confusion:**
- Issue: Two competing deployment pipelines configured:
  1. **Primary**: Cloudflare Pages via GitHub Actions (`.github/workflows/deploy.yml`)
  2. **Secondary**: AWS Amplify auto-deploy (`amplify.yml`, `deploy.sh`)
- Files: `.github/workflows/deploy.yml`, `amplify.yml`, `deploy.sh`, `package.json:10-11`
- Impact: Both systems trigger independently; unclear which is authoritative; potential for conflicting deployments or stale site state
- Fix approach: Choose single deployment target; decommission secondary system
- Priority: High - Can cause production issues

**Manual deployment script with user interaction:**
- Issue: `deploy.sh` (lines 66-85) prompts for commit message and reads user input interactively
- Files: `deploy.sh:74-85`
- Impact: Cannot be easily automated; requires manual intervention; error-prone for CI/CD
- Fix approach: Migrate all deployments to GitHub Actions; remove local deploy.sh or make it read-only for emergency use
- Priority: Medium

**Hardcoded AWS Amplify app detection logic:**
- Issue: `deploy.sh` (lines 100-114) tries to detect Amplify app ID via AWS CLI name search
- Files: `deploy.sh:102`
- Impact: Logic is fragile; depends on app name matching "qiankun-website" or "Qiankun"; breaks if app is renamed
- Fix approach: Use environment variable for Amplify app ID instead of auto-detection
- Priority: Low - Does not break deployment

## Observability & Monitoring

**No error tracking or logging:**
- Issue: Static site relies only on Google Analytics (`docs/.vitepress/config.js:131-142`)
- Files: `docs/.vitepress/config.js`
- Impact: Cannot detect runtime errors, broken links, asset loading failures, or service worker errors
- Fix approach: Add Sentry or similar error tracking; add console error monitoring via Google Analytics
- Priority: Medium

**Google Analytics without privacy consent:**
- Issue: GA script injected unconditionally in head (`docs/.vitepress/config.js:131-142`); no cookie consent banner
- Files: `docs/.vitepress/config.js:131-142`
- Impact: GDPR/CCPA compliance risk; users not informed of tracking; potential legal exposure
- Fix approach: Add cookie consent banner; delay GA initialization until consent is granted
- Priority: High - Legal/compliance risk

## Security

**Cloudflare Account ID in public repository:**
- Issue: Account ID (`0a5ceee99ef2f0c3f66bb55ff5adf359`) hardcoded in workflow file
- Files: `.github/workflows/deploy.yml:28`
- Impact: Account ID is now public; low risk (account ID alone cannot authorize deployments), but violates secrets hygiene
- Fix approach: Move to GitHub Actions secret; reference via `${{ secrets.CLOUDFLARE_ACCOUNT_ID }}`
- Priority: Low - Account ID is non-sensitive, but improves security posture

**No content validation:**
- Issue: Blog post frontmatter parsing has no schema validation (`docs/.vitepress/data/blog-posts.data.js:8-12`)
- Files: `docs/.vitepress/data/blog-posts.data.js`, markdown files in `docs/blog/` and `docs/projects/`
- Impact: Missing/invalid dates will silently fail; sorting behavior undefined for malformed dates
- Fix approach: Add validation in data loader; throw clear errors for invalid frontmatter
- Priority: Low

## Accessibility

**Custom animations without comprehensive testing:**
- Issue: Custom CSS animations and transitions throughout (`docs/.vitepress/theme/custom.css:152-177`)
- Files: `docs/.vitepress/theme/custom.css`
- Impact: Some users have `prefers-reduced-motion: reduce`; incomplete coverage (e.g., VizEChart theme observer causes re-renders that trigger animations)
- Fix approach: Audit all transitions against `prefers-reduced-motion`; disable all animations when set
- Priority: Medium - WCAG 2.1 compliance concern

## Performance

**Unused Google Fonts import (optional):**
- Issue: Imports Inter font from Google Fonts regardless of system font availability
- Files: `docs/.vitepress/theme/custom.css:7`
- Impact: Extra network request on first load; adds latency and data usage
- Fix approach: Use `font-display: swap`; consider system fonts as fallback; load fonts only if needed
- Priority: Low - Minor performance impact

## Progressive Web App

**No PWA functionality testing:**
- Issue: PWA configured (`docs/.vitepress/config.js:41-63`) but no tests for service worker or offline functionality
- Files: `docs/.vitepress/config.js:41-63`, `vite-plugin-pwa`
- Impact: Service worker may fail silently; offline mode may not work; users unaware of PWA capabilities
- Fix approach: Add Lighthouse CI checks; test service worker installation and cache behavior; document PWA features
- Priority: Low

## Maintenance & Operations

**No documentation for deployment process:**
- Issue: Deployment knowledge scattered between `deploy.sh`, `amplify.yml`, `.github/workflows/`, and CI scripts
- Files: `deploy.sh`, `amplify.yml`, `.github/workflows/deploy.yml`
- Impact: New maintainers cannot easily understand deployment flow; difficult to debug issues
- Fix approach: Create DEPLOYMENT.md documenting full flow: local → GitHub → Cloudflare → live site
- Priority: Low

---

*Concerns audit: 2026-07-25*
