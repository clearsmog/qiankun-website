<script setup>
import { computed } from 'vue'

const props = defineProps({
  points: {
    type: Array,
    required: true,
    // [{ label, score, level, rank? }]
  },
})

const W = 720
const H = 220
const pad = { t: 36, r: 28, b: 40, l: 48 }

const maxScore = computed(() => Math.max(...props.points.map((p) => p.score)) * 1.08)

function x(i) {
  const n = Math.max(props.points.length - 1, 1)
  return pad.l + (i / n) * (W - pad.l - pad.r)
}
function y(score) {
  return pad.t + (1 - score / maxScore.value) * (H - pad.t - pad.b)
}

const pathD = computed(() => {
  return props.points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.score).toFixed(1)}`)
    .join(' ')
})

const areaD = computed(() => {
  const base = H - pad.b
  let d = `M${x(0).toFixed(1)},${base} `
  props.points.forEach((p, i) => {
    d += `L${x(i).toFixed(1)},${y(p.score).toFixed(1)} `
  })
  d += `L${x(props.points.length - 1).toFixed(1)},${base} Z`
  return d
})

const levelColor = {
  Bronze: '#cd7f32',
  Silver: '#a8b0bd',
  Gold: '#e6b422',
}
</script>

<template>
  <div class="score-path">
    <svg :viewBox="`0 0 ${W} ${H}`" class="sp-svg" role="img">
      <defs>
        <linearGradient id="score-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0071e3" stop-opacity="0.35" />
          <stop offset="100%" stop-color="#0071e3" stop-opacity="0.02" />
        </linearGradient>
        <linearGradient id="score-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#cd7f32" />
          <stop offset="55%" stop-color="#a8b0bd" />
          <stop offset="100%" stop-color="#e6b422" />
        </linearGradient>
      </defs>

      <path :d="areaD" fill="url(#score-area)" />
      <path
        :d="pathD"
        fill="none"
        stroke="url(#score-line)"
        stroke-width="3.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <g v-for="(p, i) in points" :key="i">
        <circle
          :cx="x(i)"
          :cy="y(p.score)"
          r="9"
          :fill="levelColor[p.level] || '#0071e3'"
          class="node"
        />
        <circle :cx="x(i)" :cy="y(p.score)" r="3.5" fill="#fff" />
        <text :x="x(i)" :y="y(p.score) - 16" text-anchor="middle" class="score">
          {{ p.score.toLocaleString() }}
        </text>
        <text :x="x(i)" :y="H - 18" text-anchor="middle" class="lab">
          {{ p.label }}
        </text>
        <text :x="x(i)" :y="H - 4" text-anchor="middle" class="lvl">
          {{ p.level }}
        </text>
        <title>{{ p.label }} · {{ p.level }} · score {{ p.score }}{{ p.rank ? ` · rank ${p.rank}` : '' }}</title>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.sp-svg {
  width: 100%;
  height: auto;
  display: block;
}
.node {
  stroke: var(--vp-c-bg);
  stroke-width: 2;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
}
.score {
  fill: var(--vp-c-text-1);
  font-size: 12px;
  font-weight: 800;
  font-family: Inter, system-ui, sans-serif;
  font-variant-numeric: tabular-nums;
}
.lab {
  fill: var(--vp-c-text-2);
  font-size: 11px;
  font-weight: 650;
  font-family: Inter, system-ui, sans-serif;
}
.lvl {
  fill: var(--vp-c-text-3);
  font-size: 10px;
  font-weight: 600;
  font-family: Inter, system-ui, sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
</style>
