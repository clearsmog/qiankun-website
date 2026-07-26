<script setup>
import { computed, ref, shallowRef, watch } from 'vue'
import { useData } from 'vitepress'
import VChart from 'vue-echarts'
import { ensureEcharts } from './echarts-setup.js'

ensureEcharts()

const props = defineProps({
  option: { type: Object, required: true },
  height: { type: [Number, String], default: 340 },
  loading: { type: Boolean, default: false },
})

const { isDark } = useData()
const chartRef = ref(null)
const ready = shallowRef(true)

const style = computed(() => ({
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  width: '100%',
}))

// Rebuild when light/dark mode flips so axis colors stay correct
watch(isDark, () => {
  // force vue-echarts to re-evaluate if parent rebuilds option via key
  chartRef.value?.resize?.()
}, { flush: 'post' })

watch(
  () => props.option,
  () => {
    // keep reactive
  },
  { deep: true },
)
</script>

<template>
  <div class="viz-echart" :style="style">
    <VChart
      v-if="ready"
      ref="chartRef"
      class="viz-echart__canvas"
      :option="option"
      autoresize
      :loading="loading"
      :init-options="{ renderer: 'canvas', devicePixelRatio: 2 }"
    />
  </div>
</template>

<style scoped>
.viz-echart {
  width: 100%;
  min-height: 200px;
}
.viz-echart__canvas {
  width: 100%;
  height: 100%;
}
</style>
