<script setup>
import { computed, ref, watch } from 'vue'
import { useData } from 'vitepress'
import VizEChart from './VizEChart.vue'
import { themeTokens, baseTooltip, baseGrid, prefersReducedMotion } from './echarts-setup.js'

const props = defineProps({
  ranges: {
    type: Array,
    required: true,
    // [{ label, low, high, mid?, color? }] — color: 'negative' | 'positive' | 'muted' | 'muted-strong' | hex | omitted (sequential palette)
  },
  market: { type: Number, required: true },
  marketLabel: { type: String, default: 'Market' },
  unit: { type: String, default: '$' },
  xName: { type: String, default: '' }, // value-axis title (price/valuation range) incl. unit
  height: { type: Number, default: 300 },
})

const { isDark } = useData()
const tick = ref(0)
watch(isDark, () => {
  tick.value++
}, { flush: 'post' })

const option = computed(() => {
  void tick.value
  const t = themeTokens()
  const labels = props.ranges.map((r) => r.label).reverse()
  const rows = [...props.ranges].reverse()
  const palette = t.palette

  return {
    animationDuration: prefersReducedMotion() ? 0 : 800,
    tooltip: {
      ...baseTooltip(t),
      trigger: 'item',
      formatter: (p) => {
        const r = rows[p.dataIndex]
        if (!r) return ''
        return `<b>${r.label}</b><br/>${props.unit}${r.low} – ${props.unit}${r.high}${
          r.mid != null ? `<br/>Mid: <b>${props.unit}${r.mid}</b>` : ''
        }`
      },
    },
    grid: { ...baseGrid(), left: 16, right: 28, top: 36, bottom: 16 },
    xAxis: {
      type: 'value',
      min: (v) => Math.min(v.min, props.market) * 0.9,
      max: (v) => Math.max(v.max, props.market) * 1.05,
      name: props.xName,
      nameLocation: 'middle',
      nameGap: 26,
      nameTextStyle: { color: t.text2, fontSize: 11, fontWeight: 600 }, // 600 = semibold token's value as a plain number; ECharts can't read CSS vars
      axisLabel: {
        color: t.text3,
        fontSize: 11,
        formatter: (v) => `${props.unit}${v}`,
      },
      splitLine: { lineStyle: { color: t.divider, type: 'dashed' } },
      axisLine: { show: false },
    },
    yAxis: {
      type: 'category',
      data: labels,
      axisLabel: { color: t.text1, fontSize: 12, fontWeight: 600 }, // matches --font-weight-semibold
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [
      {
        type: 'custom',
        renderItem(params, api) {
          const r = rows[params.dataIndex]
          const y = api.coord([0, params.dataIndex])[1]
          const x0 = api.coord([r.low, params.dataIndex])[0]
          const x1 = api.coord([r.high, params.dataIndex])[0]
          const xm =
            r.mid != null ? api.coord([r.mid, params.dataIndex])[0] : (x0 + x1) / 2
          const color =
            r.color === 'negative' ? t.negative
              : r.color === 'positive' ? t.positive
              : r.color === 'muted' ? t.text3
              : r.color === 'muted-strong' ? t.text2
              : (r.color || palette[params.dataIndex % palette.length])
          const h = 14
          return {
            type: 'group',
            children: [
              {
                type: 'rect',
                shape: {
                  x: x0,
                  y: y - h / 2,
                  width: Math.max(4, x1 - x0),
                  height: h,
                  r: 7,
                },
                style: {
                  fill: color,
                  opacity: 0.88,
                  shadowBlur: 10,
                  shadowColor: color + '55',
                },
              },
              {
                type: 'circle',
                shape: { cx: xm, cy: y, r: 5 },
                style: {
                  fill: t.bg,
                  stroke: color,
                  lineWidth: 2.5,
                },
              },
            ],
          }
        },
        data: rows.map((r) => r.mid ?? (r.low + r.high) / 2),
        encode: { x: 0, y: 1 },
        z: 2,
      },
    ],
    // market markLine needs a series that supports it — attach to custom via graphic line
  }
})

const optionFinal = computed(() => {
  const o = { ...option.value }
  const t = themeTokens()
  // Use markLine on a transparent scatter series for market price
  o.series.push({
    type: 'scatter',
    data: [],
    markLine: {
      symbol: 'none',
      silent: true,
      label: {
        show: true,
        formatter: `${props.marketLabel} ${props.unit}${props.market}`,
        color: '#fff',
        backgroundColor: t.negative, // semantic token: this marker pivots the overvaluation claim
        padding: [4, 8],
        borderRadius: 8,
        fontSize: 10,
        fontWeight: 700,
      },
      lineStyle: { color: t.negative, type: 'dashed', width: 2 },
      data: [{ xAxis: props.market }],
    },
    z: 1,
  })
  return o
})
</script>

<template>
  <VizEChart :option="optionFinal" :height="height" />
</template>
