<script setup lang="ts">
const { t } = useI18n()
const editor = useCollageEditor()
const { state } = editor

const SOLIDS = ['#FFFFFF', '#F4F1EC', '#EEF1F6', '#16213E', '#000000', '#FF4D6D', '#FFC93C', '#F9A8BA', '#8DB0E8', '#7BC8A4']
const GRADIENTS: [string, string][] = [
  ['#FF4D6D', '#FFC93C'],
  ['#8DB0E8', '#F9A8BA'],
  ['#16213E', '#6E4C9A'],
  ['#7BC8A4', '#8DB0E8'],
  ['#FFE29A', '#FF9A8B'],
  ['#FFFFFF', '#DDE3EE'],
]

function setBg(patch: Partial<typeof state.background>) {
  Object.assign(state.background, patch)
  editor.commit()
}

const px = (v: number) => `${Math.round(v)}`
</script>

<template>
  <div class="space-y-6">
    <EditorRangeField :label="t('editor.style.spacing')" v-model="state.gap" :min="0" :max="80" :format="px" @commit="editor.commit" />
    <EditorRangeField :label="t('editor.style.padding')" v-model="state.padding" :min="0" :max="100" :format="px" @commit="editor.commit" />
    <EditorRangeField :label="t('editor.style.radius')" v-model="state.radius" :min="0" :max="80" :format="px" @commit="editor.commit" />

    <section>
      <h2 class="font-display text-base font-bold">{{ t('editor.style.background') }}</h2>
      <div class="mt-3 inline-flex rounded-full bg-sky p-1" role="radiogroup" :aria-label="t('editor.style.background')">
        <button
          v-for="type in (['solid', 'gradient'] as const)"
          :key="type"
          type="button"
          role="radio"
          :aria-checked="state.background.type === type"
          class="rounded-full px-4 py-1.5 text-sm font-semibold transition-colors"
          :class="state.background.type === type ? 'bg-paper text-ink shadow-sm' : 'text-ink-soft'"
          @click="setBg({ type })"
        >
          {{ t(`editor.style.${type}`) }}
        </button>
      </div>

      <div v-if="state.background.type === 'solid'" class="mt-4">
        <EditorColorSwatches
          :model-value="state.background.color"
          :colors="SOLIDS"
          :label="t('editor.style.background')"
          @update:model-value="color => setBg({ color })"
        />
      </div>

      <div v-else class="mt-4 space-y-4">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="([a, b], i) in GRADIENTS"
            :key="i"
            type="button"
            class="size-10 rounded-xl ring-offset-2"
            :class="state.background.color === a && state.background.color2 === b ? 'ring-2 ring-ink' : 'ring-1 ring-black/10'"
            :style="{ background: `linear-gradient(135deg, ${a}, ${b})` }"
            :aria-label="`${a} → ${b}`"
            @click="setBg({ color: a, color2: b })"
          />
        </div>
        <div class="flex gap-4">
          <label class="flex items-center gap-2 text-sm font-medium">
            <input type="color" class="size-9 cursor-pointer rounded-lg border border-line bg-paper p-0.5" :value="state.background.color" @change="setBg({ color: ($event.target as HTMLInputElement).value.toUpperCase() })">
            {{ t('editor.style.color1') }}
          </label>
          <label class="flex items-center gap-2 text-sm font-medium">
            <input type="color" class="size-9 cursor-pointer rounded-lg border border-line bg-paper p-0.5" :value="state.background.color2" @change="setBg({ color2: ($event.target as HTMLInputElement).value.toUpperCase() })">
            {{ t('editor.style.color2') }}
          </label>
        </div>
        <EditorRangeField :label="t('editor.style.angle')" v-model="state.background.angle" :min="0" :max="360" :step="5" :format="v => `${v}°`" @commit="editor.commit" />
      </div>
    </section>
  </div>
</template>
