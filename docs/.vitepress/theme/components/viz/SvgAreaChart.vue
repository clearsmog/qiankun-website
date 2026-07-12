<script setup>
import { computed } from 'vue'

const props = defineProps({
  series: {
    type: Array,
    required: true,
    // [{ name, color, data: number[] }]
  },
  labels: { type: Array, required: true },
  height: { type: Number, default: 280 },
  ySuffix: { type: String, default: '' },
  yFormat: { type: Function, default: null },
})

const W = 720
const H = computed(() => props.height)
const pad = { t: 24, r: 16, b: 36, l: 48 }

const allVals = computed(() =>
  props.series.flatMap((s) => s.data.filter((v) => v != null && !Number.isNaN(v))),
)

const yMin = computed(() => {
  const m = Math.min(...allVals.value, 0)
  return m < 0 ? m * 1.1 : 0
})
const yMax = computed(() => {
  const m = Math.max(...allVals.value)
  return m <= 0 ? 1 : m * 1.12
})

function x(i) {
  const n = Math.max(props.labels.length - 1, 1)
  return pad.l + (i / n) * (W - pad.l - pad.r)
}
function y(v) {
  const t = (v - yMin.value) / (yMax.value - yMin.value || 1)
  return pad.t + (1 - t) * (H.value - pad.t - pad.b)
}

function linePath(data) {
  let d = ''
  data.forEach((v, i) => {
    if (v == null) return
    d += `${d ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)} `
  })
  return d.trim()
}

function areaPath(data) {
  const pts = data
    .map((v, i) => (v == null ? null : [x(i), y(v)]))
    .filter(Boolean)
  if (!pts.length) return ''
  const base = H.value - pad.b
  let d = `M${pts[0][0].toFixed(1)},${base} `
  pts.forEach(([px, py]) => {
    d += `L${px.toFixed(1)},${py.toFixed(1)} `
  })
  d += `L${pts[pts.length - 1][0].toFixed(1)},${base} Z`
  return d
}

const gridYs = computed(() => {
  const steps = 4
  return Array.from({ length: steps + 1 }, (_, i) => {
    const v = yMin.value + ((yMax.value - yMin.value) * i) / steps
    return { v, y: y(v) }
  })
})

function fmt(v) {
  if (props.yFormat) return props.yFormat(v)
  if (Math.abs(v) >= 1000) return `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k${props.ySuffix}`
  return `${Number.isInteger(v) ? v : v.toFixed(1)}${props.ySuffix}`
}
</script>

<template>
  <div class="svg-chart">
    <svg
      :viewBox="`0 0 ${W} ${H}`"
      class="svg-chart__svg"
      role="img"
      :aria-label="series.map((s) => s.name).join(', ')"
    >
      <defs>
        <linearGradient
          v-for="(s, si) in series"
          :id="`area-grad-${si}`"
          :key="'g' + si"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" :stop-color="s.color" stop-opacity="0.35" />
          <stop offset="100%" :stop-color="s.color" stop-opacity="0.02" />
        </linearGradient>
      </defs>

      <!-- grid -->
      <g class="grid">
        <line
          v-for="(g, i) in gridYs"
          :key="'gy' + i"
          :x1="pad.l"
          :x2="W - pad.r"
          :y1="g.y"
          :y2="g.y"
          class="grid-line"
        />
        <text
          v-for="(g, i) in gridYs"
          :key="'gt' + i"
          :x="pad.l - 8"
          :y="g.y + 3"
          class="tick"
          text-anchor="end"
        >
          {{ fmt(g.v) }}
        </text>
      </g>

      <!-- areas + lines -->
      <g v-for="(s, si) in series" :key="'s' + si">
        <path
          v-if="s.fill !== false"
          :d="areaPath(s.data)"
          :fill="`url(#area-grad-${si})`"
        />
        <path
          :d="linePath(s.data)"
          fill="none"
          :stroke="s.color"
          stroke-width="2.75"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="line"
        />
        <g v-for="(v, i) in s.data" :key="'p' + si + '-' + i">
          <circle
            v-if="v != null"
            :cx="x(i)"
            :cy="y(v)"
            r="4"
            :fill="s.color"
            class="dot"
          />
          <title v-if="v != null">{{ labels[i] }} · {{ s.name }}: {{ fmt(v) }}</title>
        </g>
      </g>

      <!-- x labels -->
      <text
        v-for="(lab, i) in labels"
        :key="'x' + i"
        :x="x(i)"
        :y="H - 10"
        class="tick tick-x"
        text-anchor="middle"
      >
        {{ lab }}
      </text>
    </svg>
    <div class="legend">
      <span v-for="(s, i) in series" :key="i" class="legend-item">
        <i :style="{ background: s.color }" />
        {{ s.name }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.svg-chart {
  width: 100%;
}
.svg-chart__svg {
  width: 100%;
  height: auto;
  display: block;
}
.grid-line {
  stroke: var(--vp-c-divider);
  stroke-dasharray: 3 4;
}
.tick {
  fill: var(--vp-c-text-3);
  font-size: 11px;
  font-family: Inter, system-ui, sans-serif;
}
.tick-x {
  font-size: 11px;
}
.line {
  filter: drop-shadow(0 2px 6px color-mix(in srgb, currentColor 20%, transparent));
}
.dot {
  stroke: var(--vp-c-bg);
  stroke-width: 1.5;
}
.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 18px;
  justify-content: center;
  margin-top: 8px;
}
.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}
.legend-item i {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}
</style>
