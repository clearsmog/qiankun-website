<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import VizEChart from './VizEChart.vue'
import { themeTokens, baseTooltip, baseGrid } from './echarts-setup.js'

const props = defineProps({
  points: {
    type: Array,
    required: true,
    // [{ label, score, level, rank? }]
  },
  height: { type: Number, default: 280 },
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

const levelColor = {
  Bronze: '#cd7f32',
  Silver: '#a8b0bd',
  Gold: '#e6b422',
}

const option = computed(() => {
  void tick.value
  const t = themeTokens()
  const labels = props.points.map((p) => p.label)
  const scores = props.points.map((p) => p.score)

  return {
    animationDuration: 900,
    tooltip: {
      ...baseTooltip(t),
      trigger: 'axis',
      formatter: (params) => {
        const p = params[0]
        const pt = props.points[p.dataIndex]
        return `<b>${pt.label}</b> · ${pt.level}<br/>Score: <b>${pt.score.toLocaleString()}</b>${
          pt.rank ? `<br/>Rank: ~${pt.rank}` : ''
        }`
      },
    },
    grid: { ...baseGrid(), top: 36, bottom: 28, right: 24 },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: labels,
      axisLabel: { color: t.text2, fontSize: 11, fontWeight: 650 },
      axisLine: { lineStyle: { color: t.divider } },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: t.text3,
        fontSize: 11,
        formatter: (v) =>
          v >= 1000 ? `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k` : String(v),
      },
      splitLine: { lineStyle: { color: t.divider, type: 'dashed' } },
      axisLine: { show: false },
    },
    series: [
      {
        name: 'Score',
        type: 'line',
        data: scores,
        smooth: 0.35,
        symbol: 'circle',
        symbolSize: 14,
        lineStyle: {
          width: 4,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: '#cd7f32' },
              { offset: 0.55, color: '#a8b0bd' },
              { offset: 1, color: '#e6b422' },
            ],
          },
        },
        itemStyle: {
          color: (p) =>
            levelColor[props.points[p.dataIndex]?.level] || t.brand,
          borderColor: t.bg,
          borderWidth: 3,
          shadowBlur: 10,
          shadowColor: 'rgba(0,0,0,0.2)',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(0,113,227,0.28)' },
              { offset: 1, color: 'rgba(0,113,227,0.02)' },
            ],
          },
        },
        label: {
          show: true,
          position: 'top',
          color: t.text1,
          fontWeight: 800,
          fontSize: 11,
          formatter: (p) => p.value.toLocaleString(),
        },
        markPoint: {
          symbol: 'pin',
          symbolSize: 0,
          data: props.points.map((pt, i) => ({
            coord: [i, pt.score],
            value: pt.level,
          })),
          label: { show: false },
        },
      },
    ],
  }
})
</script>

<template>
  <VizEChart :option="option" :height="height" />
</template>
