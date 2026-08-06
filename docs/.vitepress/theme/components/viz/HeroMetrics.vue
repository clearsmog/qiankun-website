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
  gap: var(--space-3);
  margin: var(--space-3) 0 var(--space-4);
}

.hero-metric {
  position: relative;
  isolation: isolate;
  padding: var(--space-3);
  border-radius: var(--radius-card);
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
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-semibold);
  letter-spacing: -0.03em;
  line-height: var(--line-height-heading);
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
  margin-top: var(--space-2);
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-1);
}

.hero-metric__hint {
  margin-top: var(--space-1);
  font-size: var(--font-size-caption);
  color: var(--vp-c-text-3);
  line-height: var(--line-height-body);
}

@media (max-width: 900px) {
  .hero-metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
