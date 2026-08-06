<script setup>
defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  badge: { type: String, default: '' },
  source: { type: String, default: '' }, // e.g. "Bloomberg equity/ESG"
  asOf: { type: String, default: '' }, // e.g. "28 May 2026" — written as as-of="..." in markdown
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
      <footer v-if="source || asOf" class="viz-panel__foot">
        <span v-if="asOf">{{ asOf }}</span>
        <span v-if="source && asOf"> · </span>
        <span v-if="source">Source: {{ source }}</span>
      </footer>
    </div>
  </section>
</template>

<style scoped>
.viz-panel {
  position: relative;
  margin: var(--space-4) 0 var(--space-5);
  border-radius: var(--radius-card);
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
  background: linear-gradient(90deg, var(--vp-c-brand-1), color-mix(in srgb, var(--vp-c-brand-1) 40%, transparent));
  opacity: 0.9;
}

.viz-panel__head {
  padding: var(--space-3) var(--space-3) 0;
}

.viz-panel__badge {
  display: inline-block;
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--vp-c-brand-1);
  margin-bottom: var(--space-2);
}

.viz-panel__title {
  margin: 0;
  font-size: var(--font-size-lead);
  font-weight: var(--font-weight-semibold);
  letter-spacing: -0.02em;
  color: var(--vp-c-text-1);
  border: none;
  padding: 0;
}

.viz-panel__title::before {
  display: none;
}

.viz-panel__sub {
  margin: var(--space-2) 0 0;
  font-size: var(--font-size-caption);
  color: var(--vp-c-text-2);
  line-height: var(--line-height-body);
  max-width: 52rem;
}

.viz-panel__body {
  padding: var(--space-3);
}

.viz-panel__foot {
  margin-top: var(--space-2);
  padding-top: var(--space-2);
  border-top: 1px solid var(--vp-c-divider);
  font-size: var(--font-size-caption);
  color: var(--vp-c-text-3);
}
</style>
