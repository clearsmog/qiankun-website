<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import VizEChart from './VizEChart.vue'
import { themeTokens, baseTooltip } from './echarts-setup.js'

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  centerLabel: { type: String, default: '' },
  centerValue: { type: String, default: '' },
  unit: { type: String, default: '%' },
  height: { type: Number, default: 320 },
  // 'right' (default) puts the legend beside the pie; 'bottom' stacks it
  // underneath — better in narrow half-width grid cells with long labels.
  legendPos: { type: String, default: 'right' },
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
  const data = props.items.map((it, i) => ({
    name: it.label,
    value: it.value,
    itemStyle: {
      color: it.color || t.palette[i % t.palette.length],
      borderRadius: 6,
      borderColor: t.bg,
      borderWidth: 3,
    },
  }))

  const centerText = [props.centerValue, props.centerLabel]
    .filter(Boolean)
    .join('\n')

  return {
    animationDuration: 800,
    tooltip: {
      ...baseTooltip(t),
      trigger: 'item',
      formatter: (p) =>
        `<b>${p.name}</b><br/>${p.value}${props.unit} · ${p.percent}%`,
    },
    legend: {
      ...(props.legendPos === 'bottom'
        ? { orient: 'horizontal', left: 'center', bottom: 0, itemGap: 12 }
        : { orient: 'vertical', right: 4, top: 'middle', itemGap: 10 }),
      itemWidth: 10,
      itemHeight: 10,
      textStyle: { color: t.text2, fontSize: 11, fontFamily: 'Inter, system-ui, sans-serif' },
      formatter: (name) => {
        const it = props.items.find((x) => x.label === name)
        return it ? `${name}  ${it.value}${props.unit}` : name
      },
    },
    series: [
      {
        type: 'pie',
        radius: props.legendPos === 'bottom' ? ['46%', '68%'] : ['54%', '78%'],
        center: props.legendPos === 'bottom' ? ['50%', '42%'] : ['36%', '50%'],
        avoidLabelOverlap: true,
        data,
        label: {
          show: !!centerText,
          position: 'center',
          formatter: () =>
            props.centerValue
              ? `{v|${props.centerValue}}\n{l|${props.centerLabel || ''}}`
              : '',
          rich: {
            v: {
              fill: t.text1,
              fontSize: 22,
              fontWeight: 800,
              fontFamily: 'Inter, system-ui, sans-serif',
              lineHeight: 28,
            },
            l: {
              fill: t.text3,
              fontSize: 11,
              fontWeight: 600,
              fontFamily: 'Inter, system-ui, sans-serif',
              lineHeight: 18,
            },
          },
        },
        emphasis: {
          scale: true,
          scaleSize: 8,
          label: { show: !!centerText },
          itemStyle: {
            shadowBlur: 16,
            shadowColor: 'rgba(0,0,0,0.18)',
          },
        },
      },
    ],
  }
})
</script>

<template>
  <VizEChart :option="option" :height="height" />
</template>
