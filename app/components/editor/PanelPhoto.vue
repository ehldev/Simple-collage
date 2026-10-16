<script setup lang="ts">
import { RotateCw, FlipHorizontal2, ArrowLeftRight, ImageUp, Trash2, Undo2, ImagePlus } from 'lucide-vue-next'
import { DEFAULT_FILTERS, FILTER_PRESETS, type PhotoFilters } from '~/utils/collage'
import { filterString } from '~/utils/render'

const { t } = useI18n()
const editor = useCollageEditor()
const ui = useEditorUi()
const { state, selectedCell, swapFrom, thumbs } = editor

const cell = computed(() => (selectedCell.value !== null ? state.cells[selectedCell.value] : undefined))
const thumb = computed(() => (cell.value?.imageId ? thumbs[cell.value.imageId] : undefined))

function setZoom(v: number) {
  if (selectedCell.value !== null) editor.updateCell(selectedCell.value, { zoom: v })
}

function setFilter(key: keyof PhotoFilters, v: number) {
  if (selectedCell.value === null || !cell.value) return
  editor.updateCell(selectedCell.value, { filters: { ...cell.value.filters, [key]: v } })
}

function applyPreset(name: string) {
  if (selectedCell.value === null) return
  editor.updateCell(selectedCell.value, { filters: { ...FILTER_PRESETS[name]! } }, true)
}

function isPreset(name: string) {
  const f = cell.value?.filters
  const p = FILTER_PRESETS[name]
  return !!f && !!p && (Object.keys(p) as (keyof PhotoFilters)[]).every(k => f[k] === p[k])
}

const filtersChanged = computed(() => {
  const f = cell.value?.filters
  return !!f && (Object.keys(DEFAULT_FILTERS) as (keyof PhotoFilters)[]).some(k => f[k] !== DEFAULT_FILTERS[k])
})

function selectCell(i: number) {
  selectedCell.value = i
  editor.selectedText.value = null
}

function startSwap() {
  swapFrom.value = swapFrom.value === selectedCell.value ? null : selectedCell.value
}

const percent = (v: number) => `${Math.round(v)}%`
</script>

<template>
  <div class="space-y-6">
    <!-- Selector de celda accesible desde teclado -->
    <div class="flex flex-wrap gap-1.5" role="radiogroup" :aria-label="t('editor.tabs.photo')">
      <button
        v-for="(c, i) in state.cells"
        :key="i"
        type="button"
        role="radio"
        :aria-checked="selectedCell === i"
        class="flex size-8 items-center justify-center rounded-lg text-xs font-semibold tabular-nums transition-colors"
        :class="selectedCell === i ? 'bg-tomato text-white' : c.imageId ? 'bg-sky-deep text-ink' : 'bg-sky text-ink-faint'"
        @click="selectCell(i)"
      >
        {{ i + 1 }}
      </button>
    </div>

    <p v-if="!cell" class="text-sm text-ink-soft">{{ t('editor.cell.noSelection') }}</p>

    <div v-else-if="!cell.imageId" class="rounded-2xl bg-sky p-5 text-center">
      <p class="text-sm text-ink-soft">{{ t('editor.cell.empty') }}</p>
      <button type="button" class="btn btn-primary mt-3" @click="ui.openPicker(selectedCell)">
        <ImagePlus :size="18" aria-hidden="true" />
        {{ t('editor.cell.choose') }}
      </button>
    </div>

    <template v-else>
      <p v-if="swapFrom !== null" class="rounded-xl bg-sun/40 px-3 py-2 text-sm font-medium" role="status">
        {{ t('editor.cell.swapHint') }}
      </p>

      <EditorRangeField
        :label="t('editor.cell.zoom')"
        :model-value="cell.zoom"
        :min="1"
        :max="4"
        :step="0.01"
        :format="v => `${v.toFixed(1)}×`"
        @update:model-value="setZoom"
        @commit="editor.commit"
      />

      <div class="grid grid-cols-3 gap-2">
        <button type="button" class="tool" @click="editor.rotateCell(selectedCell!)">
          <RotateCw :size="18" aria-hidden="true" />{{ t('editor.cell.rotate') }}
        </button>
        <button type="button" class="tool" @click="editor.updateCell(selectedCell!, { flipX: !cell.flipX }, true)">
          <FlipHorizontal2 :size="18" aria-hidden="true" />{{ t('editor.cell.flip') }}
        </button>
        <button type="button" class="tool" :class="swapFrom === selectedCell ? '!bg-sun' : ''" :aria-pressed="swapFrom === selectedCell" @click="startSwap">
          <ArrowLeftRight :size="18" aria-hidden="true" />{{ t('editor.cell.swap') }}
        </button>
        <button type="button" class="tool" @click="ui.openPicker(selectedCell)">
          <ImageUp :size="18" aria-hidden="true" />{{ t('editor.cell.replace') }}
        </button>
        <button type="button" class="tool" @click="editor.resetCellFrame(selectedCell!)">
          <Undo2 :size="18" aria-hidden="true" />{{ t('editor.cell.reset') }}
        </button>
        <button type="button" class="tool hover:!text-tomato-deep" @click="editor.clearCell(selectedCell!)">
          <Trash2 :size="18" aria-hidden="true" />{{ t('editor.cell.clear') }}
        </button>
      </div>
      <p class="text-xs leading-relaxed text-ink-faint">{{ t('editor.cell.dragHint') }}</p>

      <section>
        <h2 class="font-display text-base font-bold">{{ t('editor.cell.filters') }}</h2>
        <div class="mt-3 grid grid-cols-4 gap-2">
          <button
            v-for="(preset, name) in FILTER_PRESETS"
            :key="name"
            type="button"
            class="group text-center"
            :aria-pressed="isPreset(name)"
            @click="applyPreset(name)"
          >
            <span
              class="block aspect-square overflow-hidden rounded-xl ring-offset-2"
              :class="isPreset(name) ? 'ring-2 ring-tomato' : 'ring-1 ring-line'"
            >
              <img v-if="thumb" :src="thumb" alt="" class="size-full object-cover" :style="{ filter: filterString(preset) }">
            </span>
            <span class="mt-1 block text-[11px] font-semibold text-ink-soft group-hover:text-ink">{{ t(`editor.cell.presets.${name}`) }}</span>
          </button>
        </div>
      </section>

      <section class="space-y-4">
        <h2 class="font-display text-base font-bold">{{ t('editor.cell.adjust') }}</h2>
        <EditorRangeField :label="t('editor.cell.brightness')" :model-value="cell.filters.brightness" :min="50" :max="150" :format="percent" @update:model-value="v => setFilter('brightness', v)" @commit="editor.commit" />
        <EditorRangeField :label="t('editor.cell.contrast')" :model-value="cell.filters.contrast" :min="50" :max="150" :format="percent" @update:model-value="v => setFilter('contrast', v)" @commit="editor.commit" />
        <EditorRangeField :label="t('editor.cell.saturate')" :model-value="cell.filters.saturate" :min="0" :max="200" :format="percent" @update:model-value="v => setFilter('saturate', v)" @commit="editor.commit" />
        <button v-if="filtersChanged" type="button" class="text-sm font-semibold text-tomato-deep underline underline-offset-4" @click="editor.resetCellFilters(selectedCell!)">
          {{ t('editor.cell.resetFilters') }}
        </button>
      </section>
    </template>
  </div>
</template>

<style scoped>
.tool {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  border-radius: 0.85rem;
  background: var(--color-sky);
  padding: 0.65rem 0.25rem;
  font-size: 0.72rem;
  font-weight: 600;
  line-height: 1.15;
  text-align: center;
  color: var(--color-ink);
  transition: background-color 0.15s;
}
.tool:hover { background: var(--color-sky-deep); }
</style>
