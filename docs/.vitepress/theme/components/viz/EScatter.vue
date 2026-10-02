<script setup>
import { computed, ref, watch } from 'vue'
import { useData } from 'vitepress'
import VizEChart from './VizEChart.vue'
import { themeTokens, baseTooltip, baseGrid, prefersReducedMotion } from './echarts-setup.js'

const props = defineProps({
  points: { type: Array, required: true }, // [[x, y, v]] — v drives a single-hue sequential colour scale
  xName: { type: String, default: '' }, // x-axis title incl. unit
  yName: { type: String, default: '' }, // y-axis title incl. unit
  colorName: { type: String, default: '' }, // colour-scale title incl. unit
  xUnit: { type: String, default: '' },
  yUnit: { type: String, default: '' },
  colorUnit: { type: String, default: '' },
  height: { type: Number, default: 380 },
})

const { isDark } = useData()
const tick = ref(0)
watch(isDark, () => {
  tick.value++
}, { flush: 'post' })

// One hue (brand blue), light to dark for magnitude; on the dark surface the
// ramp runs dark to light so high values still read as "more ink".
const RAMP_LIGHT = ['#cfe3fa', '#7fb3ef', '#0071e3', '#002f5f']
const RAMP_DARK = ['#173f6b', '#2f78d0', '#5aa9ff', '#cfe3fa']

const option = computed(() => {
  void tick.value
  const t = themeTokens()
  const vs = props.points.map((p) => p[2]).filter((v) => v != null)
  const vMin = Math.floor(Math.min(...vs) / 10) * 10
  const vMax = Math.ceil(Math.max(...vs) / 10) * 10
  const axis = (name, unit) => ({
    type: 'value',
    name: unit ? `${name} (${unit.trim()})` : name,
    nameLocation: 'middle',
    nameGap: 30,
    nameTextStyle: { color: t.text2, fontSize: 11, fontWeight: 600 },
    axisLabel: { color: t.text3, fontSize: 11 },
    splitLine: { lineStyle: { color: t.divider, type: 'dashed' } },
    axisLine: { show: false, onZero: false },
    axisTick: { show: false },
    scale: true,
  })

  return {
    animationDuration: prefersReducedMotion() ? 0 : 600,
    tooltip: {
      ...baseTooltip(t),
      trigger: 'item',
      formatter: (p) => {
        const [x, y, v] = p.value
        return `${props.xName}: ${x}${props.xUnit}<br/>${props.yName}: ${y}${props.yUnit}<br/>${props.colorName}: ${v}${props.colorUnit}`
      },
    },
    grid: { ...baseGrid(), top: 44, right: 24, bottom: 24, left: 20 },
    xAxis: axis(props.xName, props.xUnit),
    yAxis: axis(props.yName, props.yUnit),
    visualMap: {
      type: 'continuous',
      dimension: 2,
      min: vMin,
      max: vMax,
      orient: 'horizontal',
      right: 8,
      top: 4,
      itemWidth: 10,
      itemHeight: 100,
      text: [`${vMax}${props.colorUnit}`, `${props.colorName} ${vMin}`],
      textStyle: { color: t.text2, fontSize: 11 },
      calculable: false,
      inRange: { color: isDark.value ? RAMP_DARK : RAMP_LIGHT },
    },
    series: [
      {
        type: 'scatter',
        data: props.points,
        symbolSize: 5,
        itemStyle: { opacity: 0.75 },
        emphasis: { scale: 2, itemStyle: { opacity: 1, borderColor: t.bg, borderWidth: 1 } },
        large: props.points.length > 3000,
      },
    ],
  }
})
</script>

<template>
  <VizEChart :option="option" :height="height + 40" />
</template>
