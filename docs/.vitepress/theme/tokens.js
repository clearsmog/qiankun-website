// Node-side-only brand colour constant.
//
// Canonical browser-side definition: docs/.vitepress/theme/custom.css (:root --vp-c-brand-1).
// This module exists solely because docs/.vitepress/config.js generates the PWA manifest in
// Node, before any stylesheet is parsed. Keep this value in sync with custom.css by hand.
export const brand = '#0071e3'
