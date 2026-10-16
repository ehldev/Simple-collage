<script setup lang="ts">
import { Ban } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  modelValue: string
  colors: string[]
  label: string
  allowNone?: boolean
  noneLabel?: string
}>(), { allowNone: false, noneLabel: '' })

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const { t } = useI18n()

const isCustom = computed(() => !!props.modelValue && !props.colors.some(c => c.toLowerCase() === props.modelValue.toLowerCase()))
</script>

<template>
  <div role="radiogroup" :aria-label="label" class="flex flex-wrap gap-2">
    <button
      v-if="allowNone"
      type="button"
      role="radio"
      :aria-checked="!modelValue"
      :aria-label="noneLabel"
      :title="noneLabel"
      class="flex size-8 items-center justify-center rounded-full bg-sky text-ink-faint ring-offset-2 transition-shadow"
      :class="!modelValue ? 'ring-2 ring-ink' : 'ring-1 ring-line'"
      @click="emit('update:modelValue', '')"
    >
      <Ban :size="16" aria-hidden="true" />
    </button>
    <button
      v-for="c in colors"
      :key="c"
      type="button"
      role="radio"
      :aria-checked="modelValue.toLowerCase() === c.toLowerCase()"
      :aria-label="c"
      :title="c"
      class="size-8 rounded-full ring-offset-2 transition-shadow"
      :class="modelValue.toLowerCase() === c.toLowerCase() ? 'ring-2 ring-ink' : 'ring-1 ring-black/10'"
      :style="{ background: c }"
      @click="emit('update:modelValue', c)"
    />
    <label
      class="relative size-8 cursor-pointer overflow-hidden rounded-full ring-offset-2"
      :class="isCustom ? 'ring-2 ring-ink' : 'ring-1 ring-black/10'"
      :title="t('editor.style.customColor')"
      :style="{ background: isCustom ? modelValue : 'conic-gradient(#FF4D6D, #FFC93C, #6EE7B7, #60A5FA, #A78BFA, #FF4D6D)' }"
    >
      <span class="sr-only">{{ t('editor.style.customColor') }}</span>
      <input
        type="color"
        class="absolute inset-0 size-full cursor-pointer opacity-0"
        :value="modelValue || '#ffffff'"
        @change="emit('update:modelValue', ($event.target as HTMLInputElement).value.toUpperCase())"
      >
    </label>
  </div>
</template>
