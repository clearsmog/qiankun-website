<script setup>
import { computed, ref, watch } from 'vue'
import { useData } from 'vitepress'
import VizEChart from './VizEChart.vue'
import { themeTokens, baseTooltip, baseGrid } from './echarts-setup.js'

const props = defineProps({
  categories: { type: Array, required: true },
  series: { type: Array, required: true }, // [{ name, color?, data: [] }]
  unit: { type: String, default: '' },
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

  return {
    animationDuration: 700,
    animationEasing: 'cubicOut',
    tooltip: {
      ...baseTooltip(t),
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      valueFormatter: (v) => `${v}${props.unit}`,
    },
    legend: {
      top: 0,
      textStyle: { color: t.text2, fontSize: 11, fontWeight: 600 },
      itemWidth: 14,
      itemHeight: 9,
    },
    grid: { ...baseGrid(), top: 40, bottom: 8 },
    xAxis: {
      type: 'category',
      data: props.categories,
      axisLabel: { color: t.text2, fontSize: 11, fontWeight: 600 },
      axisLine: { lineStyle: { color: t.divider } },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: t.text3,
        fontSize: 11,
        formatter: (v) => `${v}${props.unit}`,
      },
      splitLine: { lineStyle: { color: t.divider, type: 'dashed' } },
    },
    series: props.series.map((s, idx) => {
      const color = s.color || t.palette[idx % t.palette.length]
      return {
        name: s.name,
        type: 'bar',
        data: s.data,
        barMaxWidth: 26,
        itemStyle: {
          borderRadius: [6, 6, 0, 0],
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color },
              { offset: 1, color: color + '99' },
            ],
          },
        },
        label: {
          show: true,
          position: 'top',
          color: t.text2,
          fontSize: 10,
          fontWeight: 700,
          formatter: (p) => `${p.value}${props.unit}`,
        },
      }
    }),
  }
})
</script>

<template>
  <VizEChart :option="option" :height="height" />
</template>
