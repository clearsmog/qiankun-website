<script setup>
defineProps({
  steps: {
    type: Array,
    required: true,
    // [{ title, detail? }]
  },
})
</script>

<template>
  <ol class="process-steps">
    <li v-for="(s, i) in steps" :key="i" class="process-step">
      <span class="step-n">{{ i + 1 }}</span>
      <div class="step-body">
        <div class="step-title">{{ s.title }}</div>
        <div v-if="s.detail" class="step-detail">{{ s.detail }}</div>
      </div>
    </li>
  </ol>
</template>

<style scoped>
.process-steps {
  list-style: none;
  padding: 0;
  margin: 1.25rem 0 1.75rem;
  display: grid;
  gap: 10px;
}

.process-step {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}

.step-n {
  flex: 0 0 auto;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 0.8rem;
  font-weight: 700;
  color: #fff;
  background: var(--vp-c-brand-1);
}

.step-title {
  font-weight: 650;
  color: var(--vp-c-text-1);
  font-size: 0.95rem;
}

.step-detail {
  margin-top: 2px;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  line-height: 1.45;
}
</style>
