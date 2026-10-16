<script setup lang="ts">
import { layoutsByCount, RATIOS, type RatioId } from '~/utils/layouts'

const { t } = useI18n()
const editor = useCollageEditor()
const { state } = editor
const groups = layoutsByCount()

function ratioKey(id: RatioId) {
  return `editor.ratio.${id.replace(':', 'x')}`
}
</script>

<template>
  <div class="space-y-7">
    <section>
      <h2 class="font-display text-base font-bold">{{ t('editor.ratio.label') }}</h2>
      <div class="mt-3 grid grid-cols-4 gap-2" role="radiogroup" :aria-label="t('editor.ratio.label')">
        <button
          v-for="r in RATIOS"
          :key="r.id"
          type="button"
          role="radio"
          :aria-checked="state.ratioId === r.id"
          class="flex flex-col items-center gap-1.5 rounded-xl px-1 py-2.5 text-[11px] font-semibold leading-tight transition-colors"
          :class="state.ratioId === r.id ? 'bg-ink text-white' : 'bg-sky text-ink-soft hover:text-ink'"
          @click="editor.setRatio(r.id)"
        >
          <span class="flex h-7 items-center justify-center">
            <span
              class="block rounded-[3px] border-2"
              :class="state.ratioId === r.id ? 'border-white' : 'border-current'"
              :style="r.w >= r.h ? { width: '26px', height: `${Math.round(26 * r.h / r.w)}px` } : { height: '26px', width: `${Math.round(26 * r.w / r.h)}px` }"
            />
          </span>
          {{ t(ratioKey(r.id)) }}
        </button>
      </div>
    </section>

    <section>
      <h2 class="font-display text-base font-bold">{{ t('editor.layout.title') }}</h2>
      <p class="mt-1 text-sm text-ink-soft">{{ t('editor.layout.hint') }}</p>
      <div v-for="g in groups" :key="g.count" class="mt-5">
        <h3 class="text-xs font-semibold text-ink-faint">{{ t('common.photos', g.count) }}</h3>
        <div class="mt-2 grid grid-cols-4 gap-2">
          <button
            v-for="layout in g.layouts"
            :key="layout.id"
            type="button"
            class="flex aspect-square items-center justify-center rounded-xl p-2 transition-colors"
            :class="state.layoutId === layout.id ? 'bg-tomato/15 ring-2 ring-tomato' : 'bg-sky hover:bg-sky-deep'"
            :aria-pressed="state.layoutId === layout.id"
            :aria-label="t('common.templateLabel', { n: g.count })"
            @click="editor.setLayout(layout.id)"
          >
            <span class="block w-full" :style="{ maxWidth: state.ratioId === '9:16' ? '58%' : state.ratioId === '4:5' || state.ratioId === '3:4' || state.ratioId === '2:3' || state.ratioId === 'a4' ? '78%' : '100%' }">
              <TemplateThumb :layout-id="layout.id" :ratio-id="state.ratioId" :variant="state.layoutId === layout.id ? 'color' : 'plain'" />
            </span>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
