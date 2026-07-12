// Qiankun Custom Theme
// Extends VitePress default theme with cosmic styling

import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import JsonLd from './JsonLd.vue'
import NotFound from './NotFound.vue'
import MetricCards from './components/MetricCards.vue'
import ProjectChart from './components/ProjectChart.vue'
import ProcessSteps from './components/ProcessSteps.vue'
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
// Legacy custom SVG (kept available if needed)
import SvgAreaChart from './components/viz/SvgAreaChart.vue'
import SvgHBars from './components/viz/SvgHBars.vue'
import SvgDonut from './components/viz/SvgDonut.vue'
import SvgForest from './components/viz/SvgForest.vue'
import SvgFootballField from './components/viz/SvgFootballField.vue'
import SvgScorePath from './components/viz/SvgScorePath.vue'
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
    app.component('MetricCards', MetricCards)
    app.component('ProjectChart', ProjectChart)
    app.component('ProcessSteps', ProcessSteps)
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
    app.component('SvgAreaChart', SvgAreaChart)
    app.component('SvgHBars', SvgHBars)
    app.component('SvgDonut', SvgDonut)
    app.component('SvgForest', SvgForest)
    app.component('SvgFootballField', SvgFootballField)
    app.component('SvgScorePath', SvgScorePath)
  },
}
