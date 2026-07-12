<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import {
  Chart,
  BarController,
  LineController,
  DoughnutController,
  RadarController,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'

Chart.register(
  BarController,
  LineController,
  DoughnutController,
  RadarController,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
)

const props = defineProps({
  type: { type: String, default: 'bar' }, // bar | line | doughnut | radar | horizontalBar
  title: { type: String, default: '' },
  caption: { type: String, default: '' },
  labels: { type: Array, required: true },
  datasets: { type: Array, required: true },
  // optional: y/x axis formatting
  ySuffix: { type: String, default: '' },
  yMax: { type: Number, default: undefined },
  height: { type: Number, default: 320 },
  legend: { type: Boolean, default: true },
  stacked: { type: Boolean, default: false },
})

const canvasRef = ref(null)
let chart

const brand = () =>
  getComputedStyle(document.documentElement)
    .getPropertyValue('--vp-c-brand-1')
    .trim() || '#0071e3'

const text2 = () =>
  getComputedStyle(document.documentElement)
    .getPropertyValue('--vp-c-text-2')
    .trim() || '#6e6e73'

const divider = () =>
  getComputedStyle(document.documentElement)
    .getPropertyValue('--vp-c-divider')
    .trim() || 'rgba(0,0,0,0.08)'

const palette = [
  '#0071e3',
  '#34c759',
  '#ff9500',
  '#af52de',
  '#ff3b30',
  '#5ac8fa',
  '#5856d6',
  '#ff2d55',
]

function paintDatasets(raw) {
  return raw.map((ds, i) => {
    const color = ds.color || palette[i % palette.length]
    const base = {
      ...ds,
      borderColor: ds.borderColor || color,
      backgroundColor:
        ds.backgroundColor ||
        (props.type === 'line'
          ? color
          : props.type === 'doughnut' || props.type === 'radar'
            ? undefined
            : color + (ds.alpha === false ? '' : 'cc')),
      borderWidth: ds.borderWidth ?? (props.type === 'line' ? 2.5 : 1),
      tension: ds.tension ?? 0.25,
      fill: ds.fill ?? (props.type === 'radar'),
      pointRadius: ds.pointRadius ?? (props.type === 'line' ? 3 : 0),
      pointHoverRadius: 5,
    }
    if (
      (props.type === 'doughnut' || props.type === 'radar') &&
      !ds.backgroundColor
    ) {
      base.backgroundColor = props.labels.map(
        (_, j) => palette[j % palette.length] + (props.type === 'radar' ? '55' : 'dd'),
      )
      if (props.type === 'radar') {
        base.borderColor = color
        base.backgroundColor = color + '33'
      }
    }
    return base
  })
}

function build() {
  if (!canvasRef.value) return
  if (chart) chart.destroy()

  const horizontal = props.type === 'horizontalBar'
  const type = horizontal ? 'bar' : props.type

  chart = new Chart(canvasRef.value, {
    type,
    data: {
      labels: props.labels,
      datasets: paintDatasets(props.datasets),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: horizontal ? 'y' : 'x',
      interaction: { mode: 'nearest', intersect: false },
      plugins: {
        legend: {
          display: props.legend && props.datasets.length > 1,
          labels: {
            color: text2(),
            boxWidth: 12,
            font: { size: 11, family: 'Inter, system-ui, sans-serif' },
          },
        },
        tooltip: {
          backgroundColor: 'rgba(29,29,31,0.92)',
          titleFont: { size: 12 },
          bodyFont: { size: 12 },
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label(ctx) {
              const v = ctx.parsed.y ?? ctx.parsed.x ?? ctx.parsed
              const num = typeof v === 'object' ? v.r ?? v : v
              return ` ${ctx.dataset.label || ''}: ${num}${props.ySuffix}`
            },
          },
        },
      },
      scales:
        type === 'doughnut'
          ? {}
          : type === 'radar'
            ? {
                r: {
                  beginAtZero: true,
                  max: props.yMax,
                  ticks: { color: text2(), backdropColor: 'transparent', font: { size: 10 } },
                  grid: { color: divider() },
                  pointLabels: { color: text2(), font: { size: 11 } },
                },
              }
            : {
                x: {
                  stacked: props.stacked,
                  ticks: { color: text2(), font: { size: 11 }, maxRotation: 45 },
                  grid: { color: 'transparent' },
                  border: { color: divider() },
                },
                y: {
                  stacked: props.stacked,
                  beginAtZero: true,
                  max: props.yMax,
                  ticks: {
                    color: text2(),
                    font: { size: 11 },
                    callback: (v) => `${v}${props.ySuffix}`,
                  },
                  grid: { color: divider() },
                  border: { display: false },
                },
              },
    },
  })
}

onMounted(() => {
  build()
  // rebuild on theme class changes
  const obs = new MutationObserver(() => build())
  obs.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })
  onBeforeUnmount(() => {
    obs.disconnect()
    chart?.destroy()
  })
})

watch(
  () => [props.labels, props.datasets, props.type],
  () => build(),
  { deep: true },
)
</script>

<template>
  <figure class="project-chart">
    <figcaption v-if="title" class="chart-title">{{ title }}</figcaption>
    <div class="chart-frame" :style="{ height: height + 'px' }">
      <canvas ref="canvasRef" />
    </div>
    <p v-if="caption" class="chart-caption">{{ caption }}</p>
  </figure>
</template>

<style scoped>
.project-chart {
  margin: 1.25rem 0 1.85rem;
  padding: 16px 16px 12px;
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.chart-title {
  font-size: 0.95rem;
  font-weight: 650;
  color: var(--vp-c-text-1);
  margin: 0 0 10px;
  text-align: center;
}

.chart-frame {
  position: relative;
  width: 100%;
}

.chart-caption {
  margin: 10px 0 0;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  text-align: center;
  line-height: 1.45;
}
</style>
