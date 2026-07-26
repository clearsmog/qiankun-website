<script setup>
import { computed, ref, watch } from 'vue'
import { useData } from 'vitepress'
import VizEChart from './VizEChart.vue'
import { themeTokens, baseTooltip, baseGrid } from './echarts-setup.js'

const props = defineProps({
  labels: { type: Array, required: true },
  series: {
    type: Array,
    required: true,
    // [{ name, data, color?, area? }]
  },
  height: { type: Number, default: 320 },
  ySuffix: { type: String, default: '' },
  smooth: { type: Boolean, default: true },
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
    animationDuration: 800,
    tooltip: {
      ...baseTooltip(t),
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: { color: t.text3 },
        lineStyle: { color: t.divider },
      },
      valueFormatter: (v) =>
        v == null ? '—' : `${v}${props.ySuffix}`,
    },
    legend: {
      top: 0,
      textStyle: { color: t.text2, fontSize: 11 },
      icon: 'roundRect',
      itemWidth: 12,
      itemHeight: 8,
    },
    grid: { ...baseGrid(), top: 40, right: 20 },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: props.labels,
      axisLabel: { color: t.text3, fontSize: 11 },
      axisLine: { lineStyle: { color: t.divider } },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: t.text3,
        fontSize: 11,
        formatter: (v) => `${v}${props.ySuffix}`,
      },
      splitLine: { lineStyle: { color: t.divider, type: 'dashed' } },
      axisLine: { show: false },
    },
    series: props.series.map((s, i) => {
      const color = s.color || t.palette[i % t.palette.length]
      const area = s.area !== false
      return {
        name: s.name,
        type: 'line',
        data: s.data,
        smooth: props.smooth,
        symbol: 'circle',
        symbolSize: 8,
        showSymbol: true,
        lineStyle: { width: 3, color },
        itemStyle: { color, borderColor: t.bg, borderWidth: 2 },
        areaStyle: area
          ? {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: color + '55' },
                  { offset: 1, color: color + '05' },
                ],
              },
            }
          : undefined,
        emphasis: { focus: 'series', scale: 1.15 },
      }
    }),
  }
})
</script>

<template>
  <VizEChart :option="option" :height="height" />
</template>
