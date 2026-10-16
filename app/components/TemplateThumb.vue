<script setup lang="ts">
import { getLayout, getRatio, type RatioId } from '~/utils/layouts'

const props = withDefaults(defineProps<{
  layoutId: string
  ratioId?: RatioId
  variant?: 'color' | 'plain'
}>(), { variant: 'color' })

const COLORS = ['#FF4D6D', '#FFC93C', '#16213E', '#8DB0E8', '#F9A8BA', '#33467A']

const geometry = computed(() => {
  const layout = getLayout(props.layoutId)
  const ratio = getRatio(props.ratioId ?? layout.ratio ?? '1:1')
  const w = 100
  const h = Math.round((100 * ratio.h) / ratio.w)
  const gap = 3
  const cells = layout.cells.map(([x, y, cw, ch], i) => {
    const left = x > 0.001 ? gap / 2 : 0
    const top = y > 0.001 ? gap / 2 : 0
    const right = x + cw < 0.999 ? gap / 2 : 0
    const bottom = y + ch < 0.999 ? gap / 2 : 0
    return {
      x: x * w + left,
      y: y * h + top,
      w: cw * w - left - right,
      h: ch * h - top - bottom,
      fill: props.variant === 'plain' ? '#C9D2E3' : COLORS[i % COLORS.length],
    }
  })
  return { w, h, cells }
})
</script>

<template>
  <svg :viewBox="`0 0 ${geometry.w} ${geometry.h}`" class="block h-auto w-full" aria-hidden="true">
    <rect
      v-for="(c, i) in geometry.cells"
      :key="i"
      :x="c.x"
      :y="c.y"
      :width="c.w"
      :height="c.h"
      rx="2.5"
      :fill="c.fill"
    />
  </svg>
</template>
