# Coding Conventions

**Analysis Date:** 2026-07-25

## Naming Patterns

**Files:**
- Vue components: PascalCase (e.g., `MetricCards.vue`, `VizEChart.vue`, `ProcessSteps.vue`)
- Data files: kebab-case suffix with `.data.js` (e.g., `blog-posts.data.js`)
- Configuration files: camelCase or kebab-case (e.g., `config.js`, `custom.css`)

**Functions:**
- camelCase throughout (e.g., `ensureEcharts()`, `themeTokens()`, `baseTooltip()`)
- Helper/utility functions use descriptive names: `cssVar()`, `baseGrid()`, `createContentLoader()`

**Variables:**
- camelCase for local scope (e.g., `tick`, `option`, `labels`, `values`)
- Reactive Vue state: `const state = ref(initialValue)`
- Constants: uppercase with underscores when appropriate (rare in this codebase)

**Types/Props:**
- Vue prop types documented inline with comments showing structure
- Example from `MetricCards.vue:` `// [{ label, value, hint? }]`
- Example from `EBar.vue:` `// [{ label, value, color?, sub? }]`

**CSS Classes:**
- kebab-case throughout (e.g., `.metric-cards`, `.metric-card`, `.process-steps`, `.viz-echart`)
- BEM-like structure: `.block__element` pattern used (e.g., `.viz-echart__canvas`)
- State classes: `.dark` for dark mode

## Code Style

**Formatting:**
- No formal configuration (no `.eslintrc`, `.prettierrc`, or `biome.json`)
- Assumed manual or basic IDE formatting
- 2-space indentation appears to be standard (see `config.js`, Vue components)
- No semicolons at end of statements in Vue/JS files

**Linting:**
- No linting tool currently configured
- Recommend adding ESLint + Prettier for consistency if expanding the project

**Vue Structure:**
- Modern Vue 3 with `<script setup>` syntax throughout
- All components use reactive composition API: `ref()`, `computed()`, `watch()`, lifecycle hooks
- Props defined with `defineProps()` including type validation
- Scoped styles: `<style scoped>` in every component

## Import Organization

**Order:**
1. Vue imports (`import { ref, computed, onMounted } from 'vue'`)
2. Third-party libraries (`import VChart from 'vue-echarts'`)
3. Local components (`import MetricCards from './components/MetricCards.vue'`)
4. Utilities and helpers (`import { ensureEcharts } from './echarts-setup.js'`)
5. CSS/style files (`import './custom.css'`)

**Path Aliases:**
- None currently configured; uses relative paths throughout
- Example: `import DefaultTheme from 'vitepress/theme'`
- Local imports: `./components/MetricCards.vue`, `./echarts-setup.js`

**Plugin Registration:**
- Located in `docs/.vitepress/theme/index.js`
- Pattern: `app.component('ComponentName', ImportedComponent)`
- All custom components registered globally in `enhanceApp()` hook

## Error Handling

**Patterns:**
- Defensive prop access with `v-if` conditionals (e.g., `v-if="item.hint"`)
- Optional chaining in computed values: `item?.sub ? '...' : ''`
- Safe DOM queries with optional chaining: `chartRef.value?.resize?.()`
- No try/catch blocks visible in source code (framework handles most errors)

**Validation:**
- Vue PropTypes used: `type: Array`, `type: Boolean`, `type: Number`, `type: String`, etc.
- `required: true` flag used for mandatory props
- Computed values validated before rendering

## Logging

**Framework:** Console not explicitly used; VitePress/Vue handles most output

**Patterns:**
- No structured logging framework present
- Debug output would use standard `console.log()`, `console.error()` if needed
- ECharts rendering happens via `vue-echarts` component (abstracts logging)

## Comments

**When to Comment:**
- Prop structure documented inline above `defineProps()` blocks
- Complex computed logic explained (e.g., echarts option calculations)
- Configuration magic numbers explained (e.g., grid padding, animation durations)
- Entry points documented (e.g., `// Tree-shaken ECharts registration`)

**JSDoc/TSDoc:**
- Minimal but used for utility exports
- Example from `echarts-setup.js:` function names are self-documenting (`themeTokens()`, `baseTooltip()`)
- No full JSDoc blocks; comments are inline and terse

**Example from codebase:**
```javascript
/**
 * Tree-shaken ECharts registration for VitePress project pages.
 */
```

## Function Design

**Size:** 
- Small, focused functions (5-15 lines typical)
- Example: `baseTooltip()`, `baseGrid()`, `cssVar()` are 5-10 lines each
- Larger functions like `EBar.vue`'s computed option are ~100 lines (complex chart configuration)

**Parameters:**
- Destructuring used in props: `{ items, horizontal, unit, max, height }` in `EBar.vue`
- Component functions accept `t` (theme tokens) as parameter when needed
- Optional parameters documented via JSDoc comments

**Return Values:**
- Computed returns reactive objects (echarts options, filtered arrays)
- Helper functions return plain objects or formatted strings
- Vue lifecycle functions return nothing (`onMounted()`, `onBeforeUnmount()`)

## Module Design

**Exports:**
- VitePress config uses `export default` for main config object
- Theme setup uses named exports: `export function ensureEcharts()`, `export function themeTokens()`
- Vue components use implicit default export (SFC pattern)
- Data loaders: `export default createContentLoader(...)`

**Barrel Files:**
- Not used; each component imported individually in `theme/index.js`
- Single registration point in `docs/.vitepress/theme/index.js` for all global components

## Theme & Styling

**CSS Variables:**
- Centralized in `docs/.vitepress/theme/custom.css`
- Organized by category: Brand colors, Neutral grays, Backgrounds, Text, Dividers
- Dark mode variants in `.dark` selector
- Color tokens: `--vp-c-brand-1`, `--vp-c-text-1`, `--vp-c-text-2`, `--vp-c-text-3`, `--vp-c-divider`
- Typography: Inter font stack with fallbacks
- Shadows: Named variables (`--apple-shadow-sm`, `--apple-shadow-md`, `--apple-shadow-lg`)
- Easing functions: `--apple-ease`, `--apple-spring` for animations

**Responsive Design:**
- Mobile-first with `@media (max-width: 768px)` queries
- Grid columns adjust based on viewport (e.g., 4 columns → 2 columns on mobile)

---

*Convention analysis: 2026-07-25*
