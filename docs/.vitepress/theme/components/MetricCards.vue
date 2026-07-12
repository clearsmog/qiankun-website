<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
    // [{ label, value, hint? }]
  },
})
</script>

<template>
  <div class="metric-cards" :style="{ '--cols': Math.min(items.length, 4) }">
    <div v-for="(item, i) in items" :key="i" class="metric-card">
      <div class="metric-value">{{ item.value }}</div>
      <div class="metric-label">{{ item.label }}</div>
      <div v-if="item.hint" class="metric-hint">{{ item.hint }}</div>
    </div>
  </div>
</template>

<style scoped>
.metric-cards {
  display: grid;
  grid-template-columns: repeat(var(--cols, 4), minmax(0, 1fr));
  gap: 12px;
  margin: 1.25rem 0 1.75rem;
}

.metric-card {
  padding: 16px 14px;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  text-align: center;
}

.metric-value {
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--vp-c-brand-1);
  line-height: 1.2;
}

.metric-label {
  margin-top: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.metric-hint {
  margin-top: 4px;
  font-size: 0.72rem;
  color: var(--vp-c-text-3);
  line-height: 1.35;
}

@media (max-width: 768px) {
  .metric-cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
