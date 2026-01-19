// Qiankun Custom Theme
// Extends VitePress default theme with cosmic styling

import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Register global components here if needed
    // app.component('MyComponent', MyComponent)
  }
}
