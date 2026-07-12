<script setup>
defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  badge: { type: String, default: '' },
})
</script>

<template>
  <section class="viz-panel">
    <header v-if="title || badge" class="viz-panel__head">
      <div class="viz-panel__titles">
        <div v-if="badge" class="viz-panel__badge">{{ badge }}</div>
        <h3 v-if="title" class="viz-panel__title">{{ title }}</h3>
        <p v-if="subtitle" class="viz-panel__sub">{{ subtitle }}</p>
      </div>
    </header>
    <div class="viz-panel__body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.viz-panel {
  position: relative;
  margin: 1.5rem 0 2rem;
  border-radius: 18px;
  border: 1px solid var(--vp-c-divider);
  background:
    radial-gradient(1200px 400px at 0% 0%, color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent), transparent 55%),
    radial-gradient(900px 360px at 100% 100%, color-mix(in srgb, var(--vp-c-brand-1) 7%, transparent), transparent 50%),
    var(--vp-c-bg);
  overflow: hidden;
  box-shadow:
    0 1px 0 color-mix(in srgb, var(--vp-c-brand-1) 8%, transparent) inset,
    0 12px 40px rgba(0, 0, 0, 0.04);
}

.dark .viz-panel {
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.04) inset,
    0 16px 48px rgba(0, 0, 0, 0.35);
}

.viz-panel::before {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 3px;
  background: linear-gradient(90deg, var(--vp-c-brand-1), #af52de 50%, #34c759);
  opacity: 0.9;
}

.viz-panel__head {
  padding: 18px 20px 0;
}

.viz-panel__badge {
  display: inline-block;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--vp-c-brand-1);
  margin-bottom: 6px;
}

.viz-panel__title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--vp-c-text-1);
  border: none;
  padding: 0;
}

.viz-panel__title::before {
  display: none;
}

.viz-panel__sub {
  margin: 6px 0 0;
  font-size: 0.86rem;
  color: var(--vp-c-text-2);
  line-height: 1.45;
  max-width: 52rem;
}

.viz-panel__body {
  padding: 14px 16px 18px;
}
</style>
