<script setup>
defineProps({
  steps: {
    type: Array,
    required: true,
    // [{ title, detail }]
  },
})
</script>

<template>
  <div class="rail">
    <div class="rail-line" />
    <div
      v-for="(s, i) in steps"
      :key="i"
      class="rail-step"
    >
      <div class="rail-node">{{ i + 1 }}</div>
      <div class="rail-card">
        <div class="rail-title">{{ s.title }}</div>
        <div v-if="s.detail" class="rail-detail">{{ s.detail }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rail {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin: 1.25rem 0 1.75rem;
  padding: 8px 0 4px;
}

.rail-line {
  position: absolute;
  top: 26px;
  left: 8%;
  right: 8%;
  height: 2px;
  background: linear-gradient(90deg, var(--vp-c-brand-1), #af52de, #34c759);
  opacity: 0.35;
  z-index: 0;
}

.rail-step {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
}

.rail-node {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-weight: 800;
  font-size: 0.85rem;
  color: #fff;
  background: linear-gradient(135deg, var(--vp-c-brand-1), #5856d6);
  box-shadow: 0 4px 14px color-mix(in srgb, var(--vp-c-brand-1) 35%, transparent);
}

.rail-card {
  width: 100%;
  padding: 12px 10px;
  border-radius: 14px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  min-height: 96px;
}

.rail-title {
  font-size: 0.86rem;
  font-weight: 750;
  color: var(--vp-c-text-1);
  letter-spacing: -0.01em;
}

.rail-detail {
  margin-top: 6px;
  font-size: 0.76rem;
  color: var(--vp-c-text-2);
  line-height: 1.4;
}

@media (max-width: 700px) {
  .rail-line {
    display: none;
  }
}
</style>
