/**
 * Tree-shaken ECharts registration for VitePress project pages.
 */
import { use } from 'echarts/core'
import { brand } from '../../tokens.js'
import { CanvasRenderer } from 'echarts/renderers'
import {
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  CustomChart,
  HeatmapChart,
} from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  DatasetComponent,
  TransformComponent,
  MarkLineComponent,
  MarkPointComponent,
  MarkAreaComponent,
  VisualMapComponent,
  DataZoomComponent,
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'

let ready = false

export function ensureEcharts() {
  if (ready) return
  use([
    CanvasRenderer,
    BarChart,
    LineChart,
    PieChart,
    ScatterChart,
    CustomChart,
    HeatmapChart,
    GridComponent,
    TooltipComponent,
    LegendComponent,
    TitleComponent,
    DatasetComponent,
    TransformComponent,
    MarkLineComponent,
    MarkPointComponent,
    MarkAreaComponent,
    VisualMapComponent,
    DataZoomComponent,
    LabelLayout,
    UniversalTransition,
  ])
  ready = true
}

export function cssVar(name, fallback) {
  if (typeof document === 'undefined') return fallback
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim()
  return v || fallback
}

export function themeTokens() {
  return {
    brand: cssVar('--vp-c-brand-1', brand),
    text1: cssVar('--vp-c-text-1', '#1d1d1f'),
    text2: cssVar('--vp-c-text-2', '#6e6e73'),
    text3: cssVar('--vp-c-text-3', '#86868b'),
    divider: cssVar('--vp-c-divider', 'rgba(0,0,0,0.08)'),
    bg: cssVar('--vp-c-bg', '#ffffff'),
    bgSoft: cssVar('--vp-c-bg-soft', '#f5f5f7'),
    negative: cssVar('--color-negative', '#ff3b30'),
    positive: cssVar('--color-positive', '#34c759'),
    palette: [
      brand,
      '#5856d6',
      '#af52de',
      '#34c759',
      '#ff9500',
      '#5ac8fa',
      '#ff2d55',
      '#64d2ff',
      '#bf5af2',
      '#ff9f0a',
    ],
  }
}

// Read at option-evaluation time, not live-reactive: an OS-level preference
// change mid-session only applies at a chart's next re-render.
export function prefersReducedMotion() {
  return typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Converts a 6-digit hex colour (with or without leading '#') to an rgba()
// string at the given alpha. `themeTokens().brand` reads a live CSS custom
// property, so it is normally a trimmed 6-digit hex; if the value isn't
// parseable as hex (e.g. a non-hex CSS colour function) it falls back to the
// `brand` token rather than a literal, so callers never emit an invalid
// colour string and the hex never gets a third copy in this file.
function parseHex(value) {
  return String(value).trim().replace(/^#/, '').match(/^([0-9a-fA-F]{6})$/)
}

export function hexToRgba(hex, alpha) {
  const match = parseHex(hex) || parseHex(brand)
  if (!match) return `rgba(0,0,0,${alpha})`
  const r = parseInt(match[1].slice(0, 2), 16)
  const g = parseInt(match[1].slice(2, 4), 16)
  const b = parseInt(match[1].slice(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

export function baseTooltip(t) {
  return {
    backgroundColor: 'rgba(29,29,31,0.92)',
    borderWidth: 0,
    textStyle: { color: '#f5f5f7', fontSize: 12, fontFamily: 'Inter, system-ui, sans-serif' },
    padding: [10, 12],
    extraCssText: 'border-radius:10px;backdrop-filter:blur(8px);',
  }
}

export function baseGrid() {
  return {
    left: 12,
    right: 16,
    top: 28,
    bottom: 8,
    containLabel: true,
  }
}
