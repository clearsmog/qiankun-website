<script setup>
import { computed } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
    // [{ label, value, se?, primary? }]
  },
})

const W = 720
const rowH = 52
const pad = { t: 28, r: 24, b: 32, l: 130 }
const H = computed(() => pad.t + pad.b + props.items.length * rowH)

const vals = computed(() =>
  props.items.flatMap((it) => {
    const se = it.se ?? 0
    return [it.value - 1.96 * se, it.value + 1.96 * se, 0]
  }),
)
const xMin = computed(() => Math.min(...vals.value) * 1.15)
const xMax = computed(() => Math.max(...vals.value) * 1.15)

function x(v) {
  return pad.l + ((v - xMin.value) / (xMax.value - xMin.value || 1)) * (W - pad.l - pad.r)
}

function y(i) {
  return pad.t + i * rowH + rowH / 2
}

const zeroX = computed(() => x(0))
</script>

<template>
  <div class="forest">
    <svg :viewBox="`0 0 ${W} ${H}`" class="forest-svg" role="img">
      <!-- zero line -->
      <line
        :x1="zeroX"
        :x2="zeroX"
        :y1="pad.t - 8"
        :y2="H - pad.b + 8"
        class="zero"
      />
      <text :x="zeroX" :y="pad.t - 12" text-anchor="middle" class="zero-lab">0</text>

      <g v-for="(it, i) in items" :key="i">
        <!-- row band -->
        <rect
          v-if="i % 2 === 0"
          :x="pad.l - 8"
          :y="pad.t + i * rowH"
          :width="W - pad.l - pad.r + 16"
          :height="rowH"
          class="band"
        />
        <text :x="pad.l - 14" :y="y(i) + 4" text-anchor="end" class="ylab">
          {{ it.label }}
        </text>
        <!-- CI -->
        <line
          v-if="it.se != null"
          :x1="x(it.value - 1.96 * it.se)"
          :x2="x(it.value + 1.96 * it.se)"
          :y1="y(i)"
          :y2="y(i)"
          class="ci"
          :class="{ primary: it.primary }"
        />
        <!-- point -->
        <circle
          :cx="x(it.value)"
          :cy="y(i)"
          :r="it.primary ? 8 : 6.5"
          class="pt"
          :class="{ primary: it.primary, secondary: !it.primary }"
        />
        <text :x="x(it.value) + 12" :y="y(i) + 4" class="pval">
          {{ it.value.toFixed(2) }}{{ it.stars || '' }}
        </text>
        <title>
          {{ it.label }}: {{ it.value.toFixed(3) }}
          {{ it.se != null ? `± ${ (1.96 * it.se).toFixed(3) } (95% CI)` : '' }}
        </title>
      </g>
    </svg>
    <div class="forest-note">Points = FE coefficients; whiskers ≈ 95% CI (1.96 × SE). Green = primary outcomes.</div>
  </div>
</template>

<style scoped>
.forest-svg {
  width: 100%;
  height: auto;
  display: block;
}
.band {
  fill: color-mix(in srgb, var(--vp-c-bg-soft) 80%, transparent);
}
.zero {
  stroke: var(--vp-c-text-3);
  stroke-dasharray: 4 4;
  stroke-width: 1.25;
}
.zero-lab {
  fill: var(--vp-c-text-3);
  font-size: 11px;
  font-family: Inter, system-ui, sans-serif;
}
.ylab {
  fill: var(--vp-c-text-1);
  font-size: 13px;
  font-weight: 650;
  font-family: Inter, system-ui, sans-serif;
}
.ci {
  stroke: #86868b;
  stroke-width: 3;
  stroke-linecap: round;
}
.ci.primary {
  stroke: #34c759;
}
.pt {
  stroke: var(--vp-c-bg);
  stroke-width: 2;
}
.pt.primary {
  fill: #34c759;
  filter: drop-shadow(0 2px 8px rgba(52, 199, 89, 0.45));
}
.pt.secondary {
  fill: #ff9500;
  filter: drop-shadow(0 2px 8px rgba(255, 149, 0, 0.35));
}
.pval {
  fill: var(--vp-c-text-2);
  font-size: 12px;
  font-weight: 700;
  font-family: Inter, system-ui, sans-serif;
  font-variant-numeric: tabular-nums;
}
.forest-note {
  margin-top: 8px;
  text-align: center;
  font-size: 0.78rem;
  color: var(--vp-c-text-3);
}
</style>
