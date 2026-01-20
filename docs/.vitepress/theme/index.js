// Qiankun Custom Theme
// Extends VitePress default theme with cosmic styling

import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import JsonLd from './JsonLd.vue'
import NotFound from './NotFound.vue'
import './custom.css'

// Content & DX plugins
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'
import 'virtual:group-icons.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-top': () => h(JsonLd),
      'not-found': () => h(NotFound)
    })
  },
  enhanceApp({ app }) {
    enhanceAppWithTabs(app)
  }
}
