<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import VizEChart from './VizEChart.vue'
import { themeTokens, baseTooltip, baseGrid } from './echarts-setup.js'

const props = defineProps({
  edges: { type: Array, required: true }, // n+1 bin edges
  counts: { type: Array, required: true }, // n bin counts
  markers: { type: Array, default: () => [] }, // [{ label, value, color, dashed? }]
  band: { type: Array, default: () => [] }, // [lo, hi] shaded band (e.g. P5–P95)
  color: { type: String, default: '#0071e3' },
  unit: { type: String, default: '$' },
  height: { type: Number, default: 320 },
})

const tick = ref(0)
let obs
onMounted(() => {
  obs = new MutationObserver(() => {
    tick.value++
  })
  obs.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })
})
onBeforeUnmount(() => obs?.disconnect())

const option = computed(() => {
  void tick.value
  const t = themeTokens()
  const mids = props.counts.map((_, i) => (props.edges[i] + props.edges[i + 1]) / 2)
  const labels = mids.map((m) => m.toFixed(1))
  const snap = (v) => {
    let best = 0
    mids.forEach((m, i) => {
      if (Math.abs(m - v) < Math.abs(mids[best] - v)) best = i
    })
    return best
  }

  const markLineData = props.markers.map((m) => ({
    xAxis: snap(m.value),
    lineStyle: { color: m.color || t.brand, type: m.dashed ? 'dashed' : 'solid', width: 1.8 },
    label: {
      formatter: `${m.label} ${props.unit}${m.value}`,
      color: m.color || t.brand,
      fontSize: 10,
      fontWeight: 700,
    },
  }))

  const markAreaData = props.band.length === 2
    ? [[{ xAxis: snap(props.band[0]) }, { xAxis: snap(props.band[1]) }]]
    : []

  return {
    animationDuration: 700,
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
              { offset: 0, color: props.color },
              { offset: 1, color: props.color + '66' },
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
          itemStyle: { color: props.color + '14' },
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
