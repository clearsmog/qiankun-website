<script setup>
import { computed } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
    // [{ label, value, color?, sub? }]
  },
  max: { type: Number, default: null },
  unit: { type: String, default: '' },
  showValue: { type: Boolean, default: true },
})

const maxVal = computed(() => {
  if (props.max != null) return props.max
  const m = Math.max(...props.items.map((i) => Math.abs(i.value)))
  return m <= 0 ? 1 : m * 1.08
})

function widthPct(v) {
  return Math.min(100, (Math.abs(v) / maxVal.value) * 100)
}

function color(item, i) {
  if (item.color) return item.color
  if (item.value < 0) return '#ff3b30'
  const palette = ['#0071e3', '#5856d6', '#af52de', '#34c759', '#ff9500', '#5ac8fa']
  return palette[i % palette.length]
}

function fmt(v) {
  const sign = v > 0 && props.unit === '%' ? '' : ''
  const n = Number.isInteger(v) ? String(v) : v.toFixed(Math.abs(v) < 10 ? 2 : 1)
  return `${n}${props.unit}`
}
</script>

<template>
  <div class="hbars">
    <div v-for="(item, i) in items" :key="i" class="hbar-row">
      <div class="hbar-meta">
        <span class="hbar-label">{{ item.label }}</span>
        <span v-if="item.sub" class="hbar-sub">{{ item.sub }}</span>
      </div>
      <div class="hbar-track">
        <div
          class="hbar-fill"
          :class="{ neg: item.value < 0 }"
          :style="{
            width: widthPct(item.value) + '%',
            background: `linear-gradient(90deg, ${color(item, i)}, color-mix(in srgb, ${color(item, i)} 65%, #fff))`,
          }"
        />
      </div>
      <div v-if="showValue" class="hbar-val" :style="{ color: color(item, i) }">
        {{ fmt(item.value) }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.hbars {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 4px 2px 2px;
}

.hbar-row {
  display: grid;
  grid-template-columns: minmax(88px, 140px) 1fr minmax(52px, 72px);
  gap: 10px;
  align-items: center;
}

.hbar-meta {
  min-width: 0;
}

.hbar-label {
  display: block;
  font-size: 0.84rem;
  font-weight: 650;
  color: var(--vp-c-text-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hbar-sub {
  display: block;
  font-size: 0.72rem;
  color: var(--vp-c-text-3);
  margin-top: 1px;
}

.hbar-track {
  height: 14px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--vp-c-divider) 80%, transparent);
  overflow: hidden;
  position: relative;
}

.hbar-fill {
  height: 100%;
  border-radius: 999px;
  min-width: 4px;
  transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  box-shadow: 0 0 12px color-mix(in srgb, var(--vp-c-brand-1) 25%, transparent);
}

.hbar-val {
  font-size: 0.86rem;
  font-weight: 750;
  font-variant-numeric: tabular-nums;
  text-align: right;
  letter-spacing: -0.02em;
}

@media (max-width: 600px) {
  .hbar-row {
    grid-template-columns: 1fr auto;
    grid-template-areas:
      'label val'
      'track track';
  }
  .hbar-meta {
    grid-area: label;
  }
  .hbar-val {
    grid-area: val;
  }
  .hbar-track {
    grid-area: track;
  }
}
</style>
