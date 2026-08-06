<script setup>
import { computed, ref, watch } from 'vue'
import { useData } from 'vitepress'
import VizEChart from './VizEChart.vue'
import { themeTokens, baseTooltip, baseGrid, prefersReducedMotion } from './echarts-setup.js'

const props = defineProps({
  edges: { type: Array, required: true }, // n+1 bin edges
  counts: { type: Array, required: true }, // n bin counts
  markers: { type: Array, default: () => [] }, // [{ label, value, color?, dashed? }] — color: 'negative' | 'positive' | 'muted' | 'muted-strong' | hex | omitted (brand)
  band: { type: Array, default: () => [] }, // [lo, hi] shaded band (e.g. P5–P95)
  color: { type: String, default: undefined }, // bar colour: 'negative' | 'positive' | 'muted' | 'muted-strong' | hex | omitted (brand)
  unit: { type: String, default: '$' },
  xName: { type: String, default: '' }, // bin-axis title incl. unit
  yName: { type: String, default: '' }, // frequency-axis title, e.g. "Trials"
  height: { type: Number, default: 320 },
})

const { isDark } = useData()
const tick = ref(0)
watch(isDark, () => {
  tick.value++
}, { flush: 'post' })

const option = computed(() => {
  void tick.value
  const t = themeTokens()
  const barColor =
    props.color === 'negative' ? t.negative
      : props.color === 'positive' ? t.positive
      : props.color === 'muted' ? t.text3
      : props.color === 'muted-strong' ? t.text2
      : (props.color || t.brand)
  const mids = props.counts.map((_, i) => (props.edges[i] + props.edges[i + 1]) / 2)
  const labels = mids.map((m) => m.toFixed(1))
  const snap = (v) => {
    let best = 0
    mids.forEach((m, i) => {
      if (Math.abs(m - v) < Math.abs(mids[best] - v)) best = i
    })
    return best
  }

  const markLineData = props.markers.map((m) => {
    const color =
      m.color === 'negative' ? t.negative
        : m.color === 'positive' ? t.positive
        : m.color === 'muted' ? t.text3
        : m.color === 'muted-strong' ? t.text2
        : (m.color || t.brand)
    return {
      xAxis: snap(m.value),
      lineStyle: { color, type: m.dashed ? 'dashed' : 'solid', width: 1.8 },
      label: {
        formatter: `${m.label} ${props.unit}${m.value}`,
        color,
        fontSize: 10,
        fontWeight: 700,
      },
    }
  })

  const markAreaData = props.band.length === 2
    ? [[{ xAxis: snap(props.band[0]) }, { xAxis: snap(props.band[1]) }]]
    : []

  return {
    animationDuration: prefersReducedMotion() ? 0 : 700,
    tooltip: {
      ...baseTooltip(t),
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter(params) {
        const p = Array.isArray(params) ? params[0] : params
        const i = p.dataIndex
        return `${props.unit}${props.edges[i]} – ${props.unit}${props.edges[i + 1]}<br/>Trials: <b>${p.value.toLocaleString()}</b>`
      },
    },
    grid: { ...baseGrid(), top: 32, bottom: 24 },
    xAxis: {
      type: 'category',
      data: labels,
      name: props.xName,
      nameLocation: 'middle',
      nameGap: 26,
      nameTextStyle: { color: t.text2, fontSize: 11, fontWeight: 600 }, // 600 = semibold token's value as a plain number; ECharts can't read CSS vars
      axisLabel: {
        color: t.text3,
        fontSize: 10,
        interval: Math.ceil(labels.length / 10),
        formatter: (v) => `${props.unit}${Math.round(Number(v))}`,
      },
      axisLine: { lineStyle: { color: t.divider } },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      name: props.yName,
      nameLocation: 'middle',
      nameGap: 28,
      nameTextStyle: { color: t.text2, fontSize: 11, fontWeight: 600 }, // 600 = semibold token's value as a plain number; ECharts can't read CSS vars
      axisLabel: { color: t.text3, fontSize: 10 },
      splitLine: { lineStyle: { color: t.divider, type: 'dashed' } },
    },
    series: [
      {
        type: 'bar',
        data: props.counts,
        barCategoryGap: '12%',
        itemStyle: {
          borderRadius: [3, 3, 0, 0],
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: barColor },
              { offset: 1, color: barColor + '66' },
            ],
          },
        },
        markLine: {
          symbol: 'none',
          animation: false,
          data: markLineData,
        },
        markArea: {
          silent: true,
          itemStyle: { color: barColor + '14' },
          data: markAreaData,
        },
      },
    ],
  }
})
</script>

<template>
  <VizEChart :option="option" :height="height" />
</template>
