<script setup lang="ts">
import { Copy, Trash2, Type } from 'lucide-vue-next'
import { TEXT_FONTS, type TextLayer } from '~/utils/collage'

const { t, locale } = useI18n()
const editor = useCollageEditor()
const { state, selectedText } = editor

const layer = computed(() => state.texts.find(tx => tx.id === selectedText.value))

const COLORS = ['#FFFFFF', '#16213E', '#000000', '#FF4D6D', '#FFC93C', '#F9A8BA', '#8DB0E8', '#7BC8A4']
const BACKGROUNDS = ['#FFFFFF', '#16213E', '#FF4D6D', '#FFC93C', '#F9A8BA']
const EMOJIS = ['🎉', '🎂', '🎈', '🥳', '❤️', '😍', '✨', '⭐', '🌸', '💐', '☀️', '🌊', '🏖️', '✈️', '📸', '🐶', '🐱', '🔥', '👏', '🍰']

const FONT_CLASS: Record<string, string> = {
  'Bricolage Grotesque': 'font-opt-bricolage',
  'Instrument Sans': 'font-opt-instrument',
  'Playfair Display': 'font-opt-playfair',
  'DM Serif Display': 'font-opt-dmserif',
  'Bebas Neue': 'font-opt-bebas',
  'Pacifico': 'font-opt-pacifico',
  'Caveat': 'font-opt-caveat',
  'Permanent Marker': 'font-opt-marker',
}

function today() {
  return new Intl.DateTimeFormat(locale.value, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())
}

const PRESETS: { key: string, make: () => Partial<TextLayer> }[] = [
  { key: 'heading', make: () => ({ content: t('editor.text.default'), font: 'Bricolage Grotesque', weight: 800, size: 84, color: '#FFFFFF', shadow: true }) },
  { key: 'label', make: () => ({ content: t('editor.text.default'), font: 'Instrument Sans', weight: 700, size: 44, color: '#16213E', background: '#FFC93C', shadow: false }) },
  { key: 'handwritten', make: () => ({ content: t('editor.text.default'), font: 'Caveat', weight: 700, size: 96, color: '#FFFFFF', shadow: true }) },
  { key: 'date', make: () => ({ content: today(), font: 'Instrument Sans', weight: 600, size: 36, color: '#FFFFFF', background: '#FF4D6D', shadow: false }) },
]

function addEmoji(emoji: string) {
  editor.addText({ content: emoji, size: 140, weight: 400, shadow: false, color: '#000000' })
}

function patch(p: Partial<TextLayer>, save = true) {
  if (layer.value) editor.updateText(layer.value.id, p, save)
}

function fontWeights(family: string) {
  return TEXT_FONTS.find(f => f.family === family)?.weights ?? [400]
}

function setFont(family: string) {
  const weights = fontWeights(family)
  const weight = weights.includes(layer.value?.weight ?? 400) ? layer.value!.weight : weights[weights.length - 1]!
  patch({ font: family, weight })
}

function selectText(id: string) {
  selectedText.value = id
  editor.selectedCell.value = null
}
</script>

<template>
  <div class="space-y-6">
    <section>
      <h2 class="font-display text-base font-bold">{{ t('editor.text.presetsTitle') }}</h2>
      <div class="mt-3 grid grid-cols-2 gap-2">
        <button
          v-for="p in PRESETS"
          :key="p.key"
          type="button"
          class="flex items-center gap-2 rounded-xl bg-sky px-3 py-2.5 text-left text-sm font-semibold hover:bg-sky-deep"
          @click="editor.addText(p.make())"
        >
          <Type :size="16" class="shrink-0 text-tomato-deep" aria-hidden="true" />
          {{ t(`editor.text.presets.${p.key}`) }}
        </button>
      </div>
    </section>

    <section>
      <h2 class="font-display text-base font-bold">{{ t('editor.text.emojis') }}</h2>
      <div class="mt-3 grid grid-cols-10 gap-1">
        <button
          v-for="e in EMOJIS"
          :key="e"
          type="button"
          class="flex aspect-square items-center justify-center rounded-lg text-xl hover:bg-sky"
          :aria-label="e"
          @click="addEmoji(e)"
        >
          {{ e }}
        </button>
      </div>
    </section>

    <div v-if="state.texts.length" class="flex flex-wrap gap-1.5" role="radiogroup" :aria-label="t('editor.tabs.text')">
      <button
        v-for="tx in state.texts"
        :key="tx.id"
        type="button"
        role="radio"
        :aria-checked="selectedText === tx.id"
        class="max-w-[9rem] truncate rounded-full px-3 py-1 text-xs font-semibold"
        :class="selectedText === tx.id ? 'bg-tomato text-white' : 'bg-sky text-ink-soft hover:text-ink'"
        @click="selectText(tx.id)"
      >
        {{ tx.content || '…' }}
      </button>
    </div>

    <p v-if="!layer" class="text-sm text-ink-soft">{{ t('editor.text.noSelection') }}</p>

    <template v-else>
      <div>
        <label for="text-content" class="text-sm font-medium">{{ t('editor.text.content') }}</label>
        <textarea
          id="text-content"
          rows="2"
          class="mt-2 w-full resize-y rounded-xl border border-line bg-paper px-3 py-2 text-base outline-none focus:border-ink"
          :value="layer.content"
          @input="patch({ content: ($event.target as HTMLTextAreaElement).value }, false)"
          @change="editor.commit"
        />
        <p class="mt-1 text-xs text-ink-faint">{{ t('editor.text.hint') }}</p>
      </div>

      <section>
        <h3 class="text-sm font-medium">{{ t('editor.text.font') }}</h3>
        <div class="mt-2 grid grid-cols-2 gap-2">
          <button
            v-for="f in TEXT_FONTS"
            :key="f.family"
            type="button"
            class="truncate rounded-xl px-3 py-2 text-lg transition-colors"
            :class="[FONT_CLASS[f.family], layer.font === f.family ? 'bg-ink text-white' : 'bg-sky hover:bg-sky-deep']"
            :aria-pressed="layer.font === f.family"
            @click="setFont(f.family)"
          >
            {{ f.label }}
          </button>
        </div>
      </section>

      <EditorRangeField
        :label="t('editor.text.size')"
        :model-value="layer.size"
        :min="16"
        :max="260"
        @update:model-value="v => patch({ size: v }, false)"
        @commit="editor.commit"
      />

      <section>
        <h3 class="text-sm font-medium">{{ t('editor.text.color') }}</h3>
        <div class="mt-2">
          <EditorColorSwatches :model-value="layer.color" :colors="COLORS" :label="t('editor.text.color')" @update:model-value="c => patch({ color: c })" />
        </div>
      </section>

      <section>
        <h3 class="text-sm font-medium">{{ t('editor.text.background') }}</h3>
        <div class="mt-2">
          <EditorColorSwatches
            :model-value="layer.background"
            :colors="BACKGROUNDS"
            :label="t('editor.text.background')"
            allow-none
            :none-label="t('editor.text.none')"
            @update:model-value="c => patch({ background: c })"
          />
        </div>
      </section>

      <div class="flex flex-wrap gap-4">
        <label class="flex cursor-pointer items-center gap-2 text-sm font-medium">
          <input type="checkbox" class="size-4 accent-tomato" :checked="layer.outline" @change="patch({ outline: ($event.target as HTMLInputElement).checked })">
          {{ t('editor.text.outline') }}
        </label>
        <label class="flex cursor-pointer items-center gap-2 text-sm font-medium">
          <input type="checkbox" class="size-4 accent-tomato" :checked="layer.shadow" @change="patch({ shadow: ($event.target as HTMLInputElement).checked })">
          {{ t('editor.text.shadow') }}
        </label>
      </div>

      <div class="flex gap-2">
        <button type="button" class="btn btn-ghost flex-1 !py-2 text-sm" @click="editor.duplicateText(layer.id)">
          <Copy :size="16" aria-hidden="true" />{{ t('editor.text.duplicate') }}
        </button>
        <button type="button" class="btn btn-ghost flex-1 !py-2 text-sm hover:!bg-tomato hover:!text-white" @click="editor.removeText(layer.id)">
          <Trash2 :size="16" aria-hidden="true" />{{ t('editor.text.delete') }}
        </button>
      </div>
    </template>
  </div>
</template>
