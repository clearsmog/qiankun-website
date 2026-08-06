<script setup>
import { computed, ref, watch } from 'vue'
import { useData } from 'vitepress'
import VizEChart from './VizEChart.vue'
import { themeTokens, baseTooltip, baseGrid, hexToRgba, prefersReducedMotion } from './echarts-setup.js'

const props = defineProps({
  items: {
    type: Array,
    required: true,
    // [{ label, value, se?, primary?, stars?, color? }] — color: 'negative' | 'positive' | 'muted' | 'muted-strong' | hex | omitted (primary → positive token, else palette orange)
  },
  xName: { type: String, default: '' }, // coefficient-axis title, e.g. "Effect size (SD)"
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
  const labels = props.items.map((i) => i.label).reverse()
  const rows = [...props.items].reverse()
  const pointColor = (it) =>
    it.color === 'negative' ? t.negative
      : it.color === 'positive' ? t.positive
      : it.color === 'muted' ? t.text3
      : it.color === 'muted-strong' ? t.text2
      : (it.color || (it.primary ? t.positive : t.palette[4]))

  return {
    animationDuration: prefersReducedMotion() ? 0 : 700,
    tooltip: {
      ...baseTooltip(t),
      trigger: 'item',
      formatter: (p) => {
        const it = rows[p.dataIndex]
        if (!it) return ''
        const ci =
          it.se != null
            ? `<br/>95% CI ≈ [${(it.value - 1.96 * it.se).toFixed(2)}, ${(it.value + 1.96 * it.se).toFixed(2)}]`
            : ''
        return `<b>${it.label}</b><br/>β = <b>${it.value.toFixed(3)}${it.stars || ''}</b>${ci}`
      },
    },
    grid: { ...baseGrid(), left: 20, right: 36, top: 20, bottom: 20 },
    xAxis: {
      type: 'value',
      name: props.xName,
      nameLocation: 'middle',
      nameGap: 26,
      nameTextStyle: { color: t.text2, fontSize: 11, fontWeight: 600 }, // 600 = semibold token's value as a plain number; ECharts can't read CSS vars
      axisLabel: { color: t.text3, fontSize: 11 },
      splitLine: { lineStyle: { color: t.divider, type: 'dashed' } },
      axisLine: { show: false },
      axisTick: { show: false },
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
        type: 'scatter',
        symbolSize: (val, p) => (rows[p.dataIndex]?.primary ? 16 : 13),
        data: rows.map((it) => ({
          value: it.value,
          itemStyle: {
            color: pointColor(it),
            shadowBlur: 10,
            shadowColor: hexToRgba(pointColor(it), it.primary ? 0.4 : 0.35),
            borderColor: t.bg,
            borderWidth: 2,
          },
        })),
        // custom CI whiskers via markLine per point is awkward; use custom series for error bars
        z: 3,
      },
      {
        type: 'custom',
        renderItem(params, api) {
          const it = rows[params.dataIndex]
          if (!it || it.se == null) return
          const y = api.coord([0, params.dataIndex])[1]
          const x0 = api.coord([it.value - 1.96 * it.se, params.dataIndex])[0]
          const x1 = api.coord([it.value + 1.96 * it.se, params.dataIndex])[0]
          const color = pointColor(it)
          return {
            type: 'group',
            children: [
              {
                type: 'line',
                shape: { x1: x0, y1: y, x2: x1, y2: y },
                style: { stroke: color, lineWidth: 3, opacity: 0.75 },
              },
              {
                type: 'line',
                shape: { x1: x0, y1: y - 6, x2: x0, y2: y + 6 },
                style: { stroke: color, lineWidth: 2 },
              },
              {
                type: 'line',
                shape: { x1: x1, y1: y - 6, x2: x1, y2: y + 6 },
                style: { stroke: color, lineWidth: 2 },
              },
            ],
          }
        },
        data: rows.map((it) => it.value),
        z: 2,
        silent: true,
      },
    ],
    // zero reference
    markLine: undefined,
  }
})

// add zero line via markLine on scatter - restructure option to put markLine on xAxis isn't available
// use graphic or series markLine on scatter
const optionWithZero = computed(() => {
  const o = option.value
  o.series[0].markLine = {
    symbol: 'none',
    label: { show: true, formatter: '0', color: themeTokens().text3, fontSize: 10 },
    lineStyle: { color: themeTokens().text3, type: 'dashed', width: 1.25 },
    data: [{ xAxis: 0 }],
  }
  return o
})
</script>

<template>
  <div>
    <VizEChart :option="optionWithZero" :height="height" />
    <p class="note">
      Points = FE coefficients; whiskers ≈ 95% CI (1.96 × SE). Green = primary outcomes (E, S).
    </p>
  </div>
</template>

<style scoped>
.note {
  margin: 6px 0 0;
  text-align: center;
  font-size: 0.78rem;
  color: var(--vp-c-text-3);
}
</style>
