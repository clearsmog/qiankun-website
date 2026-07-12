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
  gap: 14px;
  margin: 0 0 0.25rem;
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
