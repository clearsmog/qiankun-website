<script setup>
import { computed } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
    // [{ label, value, color? }]
  },
  centerLabel: { type: String, default: '' },
  centerValue: { type: String, default: '' },
  unit: { type: String, default: '%' },
})

const palette = [
  '#0071e3',
  '#5856d6',
  '#af52de',
  '#34c759',
  '#ff9500',
  '#5ac8fa',
  '#ff2d55',
  '#64d2ff',
  '#bf5af2',
]

const total = computed(() => props.items.reduce((a, b) => a + b.value, 0) || 1)

const R = 78
const CX = 100
const CY = 100
const STROKE = 28
const C = 2 * Math.PI * R

const arcs = computed(() => {
  let offset = 0
  return props.items.map((item, i) => {
    const frac = item.value / total.value
    const len = frac * C
    const a = {
      ...item,
      color: item.color || palette[i % palette.length],
      dash: `${len} ${C - len}`,
      offset: -offset + C * 0.25, // start at top
      pct: frac * 100,
    }
    offset += len
    return a
  })
})
</script>

<template>
  <div class="donut-wrap">
    <div class="donut-svg-box">
      <svg viewBox="0 0 200 200" class="donut-svg" role="img">
        <circle
          :cx="CX"
          :cy="CY"
          :r="R"
          fill="none"
          class="donut-track"
          :stroke-width="STROKE"
        />
        <circle
          v-for="(a, i) in arcs"
          :key="i"
          :cx="CX"
          :cy="CY"
          :r="R"
          fill="none"
          :stroke="a.color"
          :stroke-width="STROKE"
          :stroke-dasharray="a.dash"
          :stroke-dashoffset="a.offset"
          stroke-linecap="butt"
          class="donut-arc"
        >
          <title>{{ a.label }}: {{ a.value }}{{ unit }}</title>
        </circle>
        <text v-if="centerValue" :x="CX" :y="CY - 4" text-anchor="middle" class="center-v">
          {{ centerValue }}
        </text>
        <text v-if="centerLabel" :x="CX" :y="CY + 16" text-anchor="middle" class="center-l">
          {{ centerLabel }}
        </text>
      </svg>
    </div>
    <ul class="donut-legend">
      <li v-for="(a, i) in arcs" :key="i">
        <span class="swatch" :style="{ background: a.color }" />
        <span class="lab">{{ a.label }}</span>
        <span class="val">{{ a.pct.toFixed(a.pct >= 10 ? 0 : 1) }}{{ unit }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.donut-wrap {
  display: grid;
  grid-template-columns: minmax(180px, 240px) 1fr;
  gap: 18px 24px;
  align-items: center;
  padding: 4px 4px 8px;
}

.donut-svg-box {
  display: flex;
  justify-content: center;
}

.donut-svg {
  width: 100%;
  max-width: 220px;
  height: auto;
}

.donut-track {
  stroke: color-mix(in srgb, var(--vp-c-divider) 90%, transparent);
}

.donut-arc {
  transition: stroke-dashoffset 0.5s ease;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.08));
}

.center-v {
  fill: var(--vp-c-text-1);
  font-size: 22px;
  font-weight: 800;
  font-family: Inter, system-ui, sans-serif;
  letter-spacing: -0.03em;
}

.center-l {
  fill: var(--vp-c-text-3);
  font-size: 11px;
  font-weight: 600;
  font-family: Inter, system-ui, sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.donut-legend {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.donut-legend li {
  display: grid;
  grid-template-columns: 10px 1fr auto;
  gap: 10px;
  align-items: center;
  font-size: 0.86rem;
}

.swatch {
  width: 10px;
  height: 10px;
  border-radius: 3px;
}

.lab {
  color: var(--vp-c-text-1);
  font-weight: 550;
}

.val {
  color: var(--vp-c-text-2);
  font-variant-numeric: tabular-nums;
  font-weight: 700;
}

@media (max-width: 640px) {
  .donut-wrap {
    grid-template-columns: 1fr;
  }
}
</style>
