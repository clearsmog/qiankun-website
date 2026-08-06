<script setup>
import { useRouter } from 'vitepress'

const { go } = useRouter()
</script>

<template>
  <div class="not-found-page">
    <p class="error-code">404</p>
    <h1 class="error-title">Page not found</h1>
    <p class="error-detail">This page doesn't exist or has moved.</p>

    <div class="actions">
      <a class="link-btn primary" href="/" @click.prevent="go('/')">Home</a>
      <a class="link-btn" href="/projects/" @click.prevent="go('/projects/')">Projects</a>
      <a class="link-btn" href="/blog/" @click.prevent="go('/blog/')">Writing</a>
    </div>
  </div>
</template>

<style scoped>
.not-found-page {
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-5);
  text-align: center;
}

.error-code {
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.08em;
  color: var(--vp-c-text-3);
  margin: 0 0 var(--space-2);
}

.error-title {
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-heading);
  color: var(--vp-c-text-1);
  margin: 0 0 var(--space-2);
}

.error-detail {
  font-size: var(--font-size-body);
  line-height: var(--line-height-body);
  color: var(--vp-c-text-2);
  margin: 0 0 var(--space-5);
}

.actions {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
  justify-content: center;
}

.link-btn {
  padding: var(--space-2) var(--space-4);
  border-radius: 9999px;
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
  transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
}

.link-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.link-btn.primary {
  background: var(--vp-c-brand-1);
  color: white;
  border-color: var(--vp-c-brand-1);
}

.link-btn.primary:hover {
  background: var(--vp-c-brand-3);
  border-color: var(--vp-c-brand-3);
  color: white;
}

@media (max-width: 640px) {
  .actions {
    flex-direction: column;
    width: 100%;
    max-width: 280px;
  }
}
</style>
