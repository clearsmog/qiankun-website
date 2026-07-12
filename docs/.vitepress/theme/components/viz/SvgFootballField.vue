<script setup>
import { computed } from 'vue'

const props = defineProps({
  ranges: {
    type: Array,
    required: true,
    // [{ label, low, high, mid?, color? }]
  },
  market: { type: Number, required: true },
  marketLabel: { type: String, default: 'Market' },
  unit: { type: String, default: '$' },
})

const W = 720
const rowH = 44
const pad = { t: 36, r: 28, b: 28, l: 120 }
const H = computed(() => pad.t + pad.b + props.ranges.length * rowH + 8)

const all = computed(() => [
  ...props.ranges.flatMap((r) => [r.low, r.high, r.mid].filter((v) => v != null)),
  props.market,
])
const minV = computed(() => Math.min(...all.value) * 0.92)
const maxV = computed(() => Math.max(...all.value) * 1.05)

function x(v) {
  return pad.l + ((v - minV.value) / (maxV.value - minV.value || 1)) * (W - pad.l - pad.r)
}
function y(i) {
  return pad.t + i * rowH + rowH / 2
}

const marketX = computed(() => x(props.market))
const palette = ['#0071e3', '#5856d6', '#af52de', '#34c759', '#ff9500']
</script>

<template>
  <div class="ff">
    <svg :viewBox="`0 0 ${W} ${H}`" class="ff-svg" role="img">
      <!-- market line -->
      <line
        :x1="marketX"
        :x2="marketX"
        :y1="pad.t - 16"
        :y2="H - pad.b + 4"
        class="mkt-line"
      />
      <rect
        :x="marketX - 36"
        :y="pad.t - 30"
        width="72"
        height="18"
        rx="9"
        class="mkt-pill"
      />
      <text :x="marketX" :y="pad.t - 17" text-anchor="middle" class="mkt-lab">
        {{ marketLabel }} {{ unit }}{{ market }}
      </text>

      <g v-for="(r, i) in ranges" :key="i">
        <text :x="pad.l - 12" :y="y(i) + 4" text-anchor="end" class="ylab">
          {{ r.label }}
        </text>
        <!-- track -->
        <line
          :x1="pad.l"
          :x2="W - pad.r"
          :y1="y(i)"
          :y2="y(i)"
          class="track"
        />
        <!-- range bar -->
        <rect
          :x="x(r.low)"
          :y="y(i) - 8"
          :width="Math.max(4, x(r.high) - x(r.low))"
          height="16"
          rx="8"
          :fill="r.color || palette[i % palette.length]"
          class="range"
          :opacity="0.85"
        />
        <circle
          v-if="r.mid != null"
          :cx="x(r.mid)"
          :cy="y(i)"
          r="5.5"
          class="mid"
          :fill="r.color || palette[i % palette.length]"
        />
        <text :x="x(r.high) + 8" :y="y(i) + 4" class="rval">
          {{ unit }}{{ r.low }}–{{ unit }}{{ r.high }}
        </text>
        <title>{{ r.label }}: {{ unit }}{{ r.low }} – {{ unit }}{{ r.high }}{{ r.mid != null ? ` (mid ${unit}${r.mid})` : '' }}</title>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.ff-svg {
  width: 100%;
  height: auto;
  display: block;
}
.mkt-line {
  stroke: #ff3b30;
  stroke-width: 2;
  stroke-dasharray: 5 4;
}
.mkt-pill {
  fill: #ff3b30;
}
.mkt-lab {
  fill: #fff;
  font-size: 10px;
  font-weight: 700;
  font-family: Inter, system-ui, sans-serif;
}
.ylab {
  fill: var(--vp-c-text-1);
  font-size: 12.5px;
  font-weight: 650;
  font-family: Inter, system-ui, sans-serif;
}
.track {
  stroke: var(--vp-c-divider);
  stroke-width: 2;
}
.range {
  filter: drop-shadow(0 2px 8px rgba(0, 113, 227, 0.25));
}
.mid {
  stroke: var(--vp-c-bg);
  stroke-width: 2;
}
.rval {
  fill: var(--vp-c-text-3);
  font-size: 11px;
  font-weight: 600;
  font-family: Inter, system-ui, sans-serif;
  font-variant-numeric: tabular-nums;
}
</style>
