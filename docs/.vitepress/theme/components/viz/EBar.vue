<script setup>
import { computed, ref, watch } from 'vue'
import { useData } from 'vitepress'
import VizEChart from './VizEChart.vue'
import { themeTokens, baseTooltip, baseGrid, hexToRgba } from './echarts-setup.js'

const props = defineProps({
  items: {
    type: Array,
    required: true,
    // [{ label, value, color?, sub? }]
  },
  horizontal: { type: Boolean, default: true },
  unit: { type: String, default: '' },
  max: { type: Number, default: undefined },
  height: { type: Number, default: 360 },
  seriesName: { type: String, default: 'Value' },
})

const { isDark } = useData()
const tick = ref(0)
watch(isDark, () => {
  tick.value++
}, { flush: 'post' })

const option = computed(() => {
  void tick.value
  const t = themeTokens()
  const labels = props.items.map((i) => i.label)
  const values = props.items.map((i) => i.value)
  const colors = props.items.map(
    (i, idx) => i.color || t.palette[idx % t.palette.length],
  )

  const valueAxis = {
    type: 'value',
    max: props.max,
    axisLabel: {
      color: t.text3,
      fontSize: 11,
      formatter: (v) => `${v}${props.unit}`,
    },
    splitLine: {
      lineStyle: { color: t.divider, type: 'dashed' },
    },
    axisLine: { show: false },
    axisTick: { show: false },
  }

  const catAxis = {
    type: 'category',
    data: labels,
    axisLabel: {
      color: t.text2,
      fontSize: 11,
      fontWeight: 600,
      width: props.horizontal ? 110 : undefined,
      overflow: 'truncate',
    },
    axisLine: { lineStyle: { color: t.divider } },
    axisTick: { show: false },
  }

  return {
    animationDuration: 700,
    animationEasing: 'cubicOut',
    tooltip: {
      ...baseTooltip(t),
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter(params) {
        const p = Array.isArray(params) ? params[0] : params
        const item = props.items[p.dataIndex]
        const sub = item?.sub ? `<br/><span style="opacity:.75">${item.sub}</span>` : ''
        return `<b>${p.name}</b><br/>${p.seriesName}: <b>${p.value}${props.unit}</b>${sub}`
      },
    },
    grid: {
      ...baseGrid(),
      left: props.horizontal ? 8 : 12,
      top: 16,
      bottom: props.horizontal ? 8 : 24,
    },
    xAxis: props.horizontal ? valueAxis : catAxis,
    yAxis: props.horizontal ? catAxis : valueAxis,
    series: [
      {
        name: props.seriesName,
        type: 'bar',
        data: values.map((v, i) => ({
          value: v,
          itemStyle: {
            color: {
              type: 'linear',
              x: props.horizontal ? 0 : 0,
              y: props.horizontal ? 0 : 1,
              x2: props.horizontal ? 1 : 0,
              y2: props.horizontal ? 0 : 0,
              colorStops: [
                { offset: 0, color: colors[i] },
                { offset: 1, color: colors[i] + '99' },
              ],
            },
            borderRadius: props.horizontal ? [0, 8, 8, 0] : [8, 8, 0, 0],
          },
        })),
        barMaxWidth: 22,
        showBackground: true,
        backgroundStyle: {
          color: t.divider,
          borderRadius: props.horizontal ? [0, 8, 8, 0] : [8, 8, 0, 0],
        },
        label: {
          show: true,
          position: props.horizontal ? 'right' : 'top',
          color: t.text2,
          fontSize: 11,
          fontWeight: 700,
          formatter: (p) => `${p.value}${props.unit}`,
        },
        emphasis: {
          itemStyle: { shadowBlur: 12, shadowColor: hexToRgba(t.brand, 0.35) },
        },
      },
    ],
  }
})
</script>

<template>
  <VizEChart :option="option" :height="height" />
</template>
