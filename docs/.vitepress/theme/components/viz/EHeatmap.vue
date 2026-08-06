<script setup>
import { computed, ref, watch } from 'vue'
import { useData } from 'vitepress'
import VizEChart from './VizEChart.vue'
import { themeTokens, baseTooltip, prefersReducedMotion } from './echarts-setup.js'

const props = defineProps({
  rows: { type: Array, required: true }, // y-axis labels, top → bottom
  cols: { type: Array, required: true }, // x-axis labels, left → right
  values: { type: Array, required: true }, // 2D array [row][col]
  baseCell: { type: Array, default: () => [] }, // [rowLabel, colLabel] highlighted
  unit: { type: String, default: '' },
  xName: { type: String, default: '' },
  yName: { type: String, default: '' },
  height: { type: Number, default: 340 },
})

const { isDark } = useData()
const tick = ref(0)
watch(isDark, () => {
  tick.value++
}, { flush: 'post' })

const option = computed(() => {
  void tick.value
  const t = themeTokens()
  const flat = props.values.flat()
  const min = Math.min(...flat)
  const max = Math.max(...flat)
  const [baseRow, baseCol] = props.baseCell
  // y-axis category order is bottom → top in ECharts; reverse rows so the
  // first row renders at the top like a table
  const yLabels = [...props.rows].reverse()
  const data = []
  props.values.forEach((rowVals, i) => {
    rowVals.forEach((v, j) => {
      data.push({
        value: [j, props.rows.length - 1 - i, v],
        isBase: props.rows[i] === baseRow && props.cols[j] === baseCol,
      })
    })
  })

  return {
    animationDuration: prefersReducedMotion() ? 0 : 700,
    tooltip: {
      ...baseTooltip(t),
      formatter(p) {
        const row = yLabels[p.value[1]]
        const col = props.cols[p.value[0]]
        return `${props.yName || 'Row'}: <b>${row}</b><br/>${props.xName || 'Col'}: <b>${col}</b><br/>Value: <b>${props.unit}${p.value[2]}</b>`
      },
    },
    grid: { left: 8, right: 16, top: 12, bottom: 40, containLabel: true },
    xAxis: {
      type: 'category',
      data: props.cols,
      name: props.xName,
      nameLocation: 'middle',
      nameGap: 26,
      nameTextStyle: { color: t.text2, fontSize: 11, fontWeight: 600 },
      axisLabel: { color: t.text2, fontSize: 11 },
      axisLine: { lineStyle: { color: t.divider } },
      axisTick: { show: false },
      splitArea: { show: true },
    },
    yAxis: {
      type: 'category',
      data: yLabels,
      name: props.yName,
      nameTextStyle: { color: t.text2, fontSize: 11, fontWeight: 600 },
      axisLabel: { color: t.text2, fontSize: 11 },
      axisLine: { lineStyle: { color: t.divider } },
      axisTick: { show: false },
      splitArea: { show: true },
    },
    visualMap: {
      show: false,
      min,
      max,
      inRange: {
        // red (low) → amber → green (high), matching the report's exhibit
        color: ['#ff3b30', '#ff9500', '#ffd60a', '#a8e05f', '#34c759'],
      },
    },
    series: [
      {
        type: 'heatmap',
        data: data.map((d) => ({
          value: d.value,
          itemStyle: d.isBase
            ? { borderColor: t.text1, borderWidth: 2.5, borderRadius: 4 }
            : { borderColor: t.bg, borderWidth: 1.5, borderRadius: 4 },
        })),
        label: {
          show: true,
          fontSize: 11,
          fontWeight: 700,
          color: '#1d1d1f',
          formatter: (p) => `${props.unit}${p.value[2]}`,
        },
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.35)' },
        },
      },
    ],
  }
})
</script>

<template>
  <VizEChart :option="option" :height="height" />
</template>
