<script setup>
import { computed, ref, watch } from 'vue'
import { useData } from 'vitepress'
import VizEChart from './VizEChart.vue'
import { themeTokens, baseTooltip, baseGrid } from './echarts-setup.js'

const props = defineProps({
  labels: { type: Array, required: true },
  bars: { type: Object, required: true }, // { name, data, color?, unit? }
  line: { type: Object, required: true }, // { name, data, color?, unit? }
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
  const barColor = props.bars.color || t.palette[0]
  const lineColor = props.line.color || '#ff9500'
  const barUnit = props.bars.unit || ''
  const lineUnit = props.line.unit || ''

  return {
    animationDuration: 700,
    animationEasing: 'cubicOut',
    tooltip: {
      ...baseTooltip(t),
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    legend: {
      top: 0,
      textStyle: { color: t.text2, fontSize: 11, fontWeight: 600 },
      itemWidth: 14,
      itemHeight: 9,
    },
    grid: { ...baseGrid(), top: 40, bottom: 8, right: 44 },
    xAxis: {
      type: 'category',
      data: props.labels,
      axisLabel: { color: t.text2, fontSize: 11, fontWeight: 600 },
      axisLine: { lineStyle: { color: t.divider } },
      axisTick: { show: false },
    },
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          color: barColor,
          fontSize: 11,
          formatter: (v) => `${v}${barUnit}`,
        },
        splitLine: { lineStyle: { color: t.divider, type: 'dashed' } },
      },
      {
        type: 'value',
        axisLabel: {
          color: lineColor,
          fontSize: 11,
          formatter: (v) => `${v}${lineUnit}`,
        },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: props.bars.name,
        type: 'bar',
        data: props.bars.data,
        barMaxWidth: 34,
        itemStyle: {
          borderRadius: [6, 6, 0, 0],
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: barColor },
              { offset: 1, color: barColor + '99' },
            ],
          },
        },
        label: {
          show: true,
          position: 'top',
          color: t.text2,
          fontSize: 10,
          fontWeight: 700,
          formatter: (p) => `${p.value}${barUnit}`,
        },
      },
      {
        name: props.line.name,
        type: 'line',
        yAxisIndex: 1,
        data: props.line.data,
        smooth: true,
        symbol: 'circle',
        symbolSize: 7,
        lineStyle: { color: lineColor, width: 2.5 },
        itemStyle: { color: lineColor },
        label: {
          show: true,
          position: 'top',
          color: lineColor,
          fontSize: 10,
          fontWeight: 700,
          formatter: (p) => `${p.value}${lineUnit}`,
        },
      },
    ],
  }
})
</script>

<template>
  <VizEChart :option="option" :height="height" />
</template>
