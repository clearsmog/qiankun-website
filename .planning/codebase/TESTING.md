# Testing Patterns

**Analysis Date:** 2026-07-25

## Test Framework

**Runner:**
- Not detected - no test runner configured (Jest, Vitest, etc.)
- `package.json` contains no testing dependencies
- No `jest.config.*` or `vitest.config.*` files present

**Assertion Library:**
- Not configured

**Run Commands:**
- No test commands in `package.json` scripts
- Available scripts: `docs:dev`, `docs:build`, `docs:preview`, `deploy`, `deploy:quick`

## Test File Organization

**Location:**
- Not applicable - no test files found in codebase
- Recommendation: Co-locate tests with components using `.spec.ts` or `.test.ts` suffix
- Example future structure: `docs/.vitepress/theme/components/MetricCards.spec.ts`

**Naming:**
- Not established
- Recommendation: `ComponentName.spec.ts` for unit tests, `ComponentName.integration.ts` for integration tests

**Structure:**
- Not applicable currently

## Test Structure

**Suite Organization:**
- Not yet implemented

**Patterns:**
- Not established
- When tests are added, follow Vue Test Utils patterns for component testing
- Example future pattern:
```typescript
describe('MetricCards', () => {
  it('renders metrics with correct values', () => {
    // test implementation
  })
})
```

## Mocking

**Framework:**
- Not configured
- Recommendation: Vitest for Vue 3 projects (faster, better ESM support than Jest)

**Patterns:**
- Not established
- Future recommendation for Vue components: Use `vitest` with `@vue/test-utils`
- Mock echarts for chart components: consider mocking `vue-echarts` imports

**What to Mock:**
- Third-party libraries: `vue-echarts`, `vitepress` plugins
- Browser APIs: `MutationObserver` (used in components for theme switching detection)
- External data: blog posts loader, content from `.vitepress/data/`

**What NOT to Mock:**
- Vue composition API utilities (`ref`, `computed`, `watch`)
- Component prop structure validation
- Scoped CSS/styling (test logic, not styles)

## Fixtures and Factories

**Test Data:**
- Not established
- Recommendation: Create `docs/.vitepress/__tests__/fixtures/` for sample data
- Example future fixture structure:
```typescript
// fixtures/metrics.ts
export const mockMetrics = [
  { label: 'AUM', value: '£10M', hint: 'Long-only global equity' },
  { label: 'Holdings', value: '~29', hint: '9 sectors · 14+ countries' },
]
```

**Location:**
- Recommend: `docs/.vitepress/__tests__/fixtures/` or `docs/.vitepress/theme/__tests__/fixtures/`

## Coverage

**Requirements:**
- Not enforced
- Recommendation: Set target of 80%+ for components, especially chart configuration logic

**View Coverage:**
- Not configured
- Future setup: `vitest --coverage` with c8 provider

## Test Types

**Unit Tests:**
- Recommended scope: Individual Vue components and utility functions
- Example: Test `MetricCards.vue` prop rendering, `EBar.vue` computed option generation
- Utilities to test: `echarts-setup.js` functions like `cssVar()`, `themeTokens()`, `baseGrid()`
- Approach: Shallow component mounts, test prop validation and rendered output

**Integration Tests:**
- Recommended scope: Multiple components working together, VitePress plugin integration
- Example: Theme switching affecting chart colors across multiple chart components
- Approach: Mount parent components with child components, test dark/light mode toggle

**E2E Tests:**
- Not currently used
- Framework: Not configured
- Recommendation: Playwright or Cypress for full-page navigation testing if needed
- Example scenarios: Navigation between pages, blog post loading, contact form submission

## Common Patterns

**Async Testing:**
- Recommended pattern (not yet implemented):
```typescript
it('loads chart data', async () => {
  const wrapper = mount(VizEChart, {
    props: { option: chartOption }
  })
  await wrapper.vm.$nextTick()
  expect(wrapper.find('.viz-echart__canvas').exists()).toBe(true)
})
```

**Error Testing:**
- Recommended pattern (not yet implemented):
```typescript
it('handles missing props gracefully', () => {
  const wrapper = mount(MetricCards, {
    props: { items: [] }
  })
  expect(wrapper.find('.metric-cards').exists()).toBe(true)
  expect(wrapper.findAll('.metric-card')).toHaveLength(0)
})
```

**Theme-Aware Testing:**
- Recommended pattern (not yet implemented):
```typescript
describe('dark mode', () => {
  it('applies dark class to themeTokens', () => {
    document.documentElement.classList.add('dark')
    const tokens = themeTokens()
    expect(tokens.brand).toBe('2997ff') // dark mode brand color
  })
})
```

## Recommended Setup

For implementation, consider:

1. **Install dependencies:**
   ```bash
   npm install -D vitest @vue/test-utils happy-dom
   ```

2. **Create `vitest.config.ts`:**
   ```typescript
   import { defineConfig } from 'vitest/config'
   import vue from '@vitejs/plugin-vue'
   
   export default defineConfig({
     plugins: [vue()],
     test: {
       environment: 'happy-dom',
       globals: true,
     }
   })
   ```

3. **Add test script to `package.json`:**
   ```json
   {
     "scripts": {
       "test": "vitest",
       "test:ui": "vitest --ui",
       "test:coverage": "vitest --coverage"
     }
   }
   ```

4. **Test location priority:**
   - Co-locate with components: `MetricCards.spec.ts` next to `MetricCards.vue`
   - Utilities: `docs/.vitepress/theme/__tests__/echarts-setup.spec.ts`
   - Data loaders: `docs/.vitepress/__tests__/data/blog-posts.spec.ts`

## Current Testing Gaps

**Critical areas without test coverage:**
- ECharts option generation in visualization components (`EBar.vue`, `ELine.vue`, `EDonut.vue`)
- Theme token computation and dark mode switching
- Responsive grid behavior on different viewport sizes
- MutationObserver integration for theme detection

**Recommendations:**
- Prioritize tests for chart components (complex computed logic)
- Add tests for `echarts-setup.js` utilities before expanding chart library
- Test theme switching logic (`themeTokens()`, `cssVar()`)

---

*Testing analysis: 2026-07-25*
