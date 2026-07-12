<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
    // [{ label, value, hint?, accent? }]
  },
})
</script>

<template>
  <div class="hero-metrics">
    <div
      v-for="(item, i) in items"
      :key="i"
      class="hero-metric"
      :style="{ '--accent': item.accent || 'var(--vp-c-brand-1)' }"
    >
      <div class="hero-metric__glow" />
      <div class="hero-metric__value">{{ item.value }}</div>
      <div class="hero-metric__label">{{ item.label }}</div>
      <div v-if="item.hint" class="hero-metric__hint">{{ item.hint }}</div>
    </div>
  </div>
</template>

<style scoped>
.hero-metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin: 1.25rem 0 1.75rem;
}

.hero-metric {
  position: relative;
  isolation: isolate;
  padding: 18px 14px 16px;
  border-radius: 16px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  overflow: hidden;
  min-height: 112px;
}

.hero-metric__glow {
  position: absolute;
  width: 140px;
  height: 140px;
  right: -40px;
  top: -50px;
  border-radius: 50%;
  background: radial-gradient(circle, color-mix(in srgb, var(--accent) 28%, transparent), transparent 70%);
  z-index: -1;
  pointer-events: none;
}

.hero-metric__value {
  font-size: clamp(1.35rem, 2.4vw, 1.75rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
  background: linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 40%, #fff));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.dark .hero-metric__value {
  background: linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 55%, #fff));
  -webkit-background-clip: text;
  background-clip: text;
}

.hero-metric__label {
  margin-top: 8px;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-1);
}

.hero-metric__hint {
  margin-top: 4px;
  font-size: 0.78rem;
  color: var(--vp-c-text-3);
  line-height: 1.35;
}

@media (max-width: 900px) {
  .hero-metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
