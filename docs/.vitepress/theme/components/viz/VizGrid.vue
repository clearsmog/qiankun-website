<script setup>
defineProps({
  cols: { type: Number, default: 2 },
})
</script>

<template>
  <div class="viz-grid" :style="{ '--cols': cols }">
    <slot />
  </div>
</template>

<style scoped>
.viz-grid {
  display: grid;
  grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
  gap: var(--space-3);
  margin: 0 0 var(--space-1);
}

.viz-grid > :deep(.viz-panel) {
  margin: 0;
  height: 100%;
}

@media (max-width: 860px) {
  .viz-grid {
    grid-template-columns: 1fr;
  }
}
</style>
