// Qiankun Custom Theme
// Extends VitePress default theme with cosmic styling

import { h } from 'vue'
import DefaultTheme from 'vitepress/theme-without-fonts'
import JsonLd from './JsonLd.vue'
import NotFound from './NotFound.vue'
import VizPanel from './components/viz/VizPanel.vue'
import VizGrid from './components/viz/VizGrid.vue'
import HeroMetrics from './components/viz/HeroMetrics.vue'
import ProcessRail from './components/viz/ProcessRail.vue'
// ECharts suite
import VizEChart from './components/viz/VizEChart.vue'
import EBar from './components/viz/EBar.vue'
import ELine from './components/viz/ELine.vue'
import EDonut from './components/viz/EDonut.vue'
import EForest from './components/viz/EForest.vue'
import EFootball from './components/viz/EFootball.vue'
import EScorePath from './components/viz/EScorePath.vue'
import EHeatmap from './components/viz/EHeatmap.vue'
import EHistogram from './components/viz/EHistogram.vue'
import EGroupBar from './components/viz/EGroupBar.vue'
import ECombo from './components/viz/ECombo.vue'
import './custom.css'

import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'
import 'virtual:group-icons.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-top': () => h(JsonLd),
      'not-found': () => h(NotFound),
    })
  },
  enhanceApp({ app }) {
    enhanceAppWithTabs(app)
    app.component('VizPanel', VizPanel)
    app.component('VizGrid', VizGrid)
    app.component('HeroMetrics', HeroMetrics)
    app.component('ProcessRail', ProcessRail)
    app.component('VizEChart', VizEChart)
    app.component('EBar', EBar)
    app.component('ELine', ELine)
    app.component('EDonut', EDonut)
    app.component('EForest', EForest)
    app.component('EFootball', EFootball)
    app.component('EScorePath', EScorePath)
    app.component('EHeatmap', EHeatmap)
    app.component('EHistogram', EHistogram)
    app.component('EGroupBar', EGroupBar)
    app.component('ECombo', ECombo)
  },
}
