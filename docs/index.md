---
layout: home
title: Home

hero:
  name: "Qiankun"
  text: "Exploring the Universe of Code"
  tagline: Where technology meets creativity — thoughts on development, open source, and the infinite possibilities in between
  image:
    src: /logo.svg
    alt: Qiankun
  actions:
    - theme: brand
      text: Read the Blog
      link: /blog/
    - theme: alt
      text: About Me
      link: /about

features:
  - icon: |
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="url(#tech-grad)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <defs><linearGradient id="tech-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#667eea"/><stop offset="100%" style="stop-color:#ec4899"/></linearGradient></defs>
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
      </svg>
    title: Technology
    details: Diving deep into software development, exploring cutting-edge tools, frameworks, and the art of writing elegant code.
  - icon: |
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="url(#write-grad)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <defs><linearGradient id="write-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#667eea"/><stop offset="100%" style="stop-color:#ec4899"/></linearGradient></defs>
        <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
        <path d="M2 2l7.586 7.586"></path>
        <circle cx="11" cy="11" r="2"></circle>
      </svg>
    title: Writing
    details: Sharing insights, tutorials, and lessons learned — transforming complex ideas into accessible knowledge.
  - icon: |
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="url(#globe-grad)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <defs><linearGradient id="globe-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#667eea"/><stop offset="100%" style="stop-color:#ec4899"/></linearGradient></defs>
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>
    title: Open Source
    details: Contributing to and learning from the global developer community — because the best code is shared code.
---

## Recent Posts

<div class="recent-posts">
  <a href="/blog/vite-plugins" class="post-card">
    <span class="post-title">Vite Plugins Reference</span>
    <span class="post-desc">A complete guide to all Vite plugins configured for this VitePress site</span>
  </a>
  <a href="/blog/etrm-systems" class="post-card">
    <span class="post-title">ETRM Systems</span>
    <span class="post-desc">A comprehensive report on Energy Trading and Risk Management software</span>
  </a>
  <a href="/blog/welcome" class="post-card">
    <span class="post-title">Welcome to My Blog</span>
    <span class="post-desc">The first post on qiankun.co.uk</span>
  </a>
</div>

<style>
.recent-posts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin: 32px auto;
  max-width: 1152px;
  padding: 0 24px;
}

.post-card {
  display: flex;
  flex-direction: column;
  padding: 24px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
  border-color: var(--vp-c-brand-1);
}

.dark .post-card:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
}

.post-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 8px;
}

.post-desc {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}
</style>
