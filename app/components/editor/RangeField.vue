<script setup lang="ts">
const props = withDefaults(defineProps<{
  label: string
  modelValue: number
  min: number
  max: number
  step?: number
  format?: (v: number) => string
}>(), { step: 1 })

const emit = defineEmits<{
  'update:modelValue': [value: number]
  'commit': []
}>()

const id = useId()
const shown = computed(() => (props.format ? props.format(props.modelValue) : String(Math.round(props.modelValue))))
</script>

<template>
  <div>
    <div class="flex items-center justify-between text-sm">
      <label :for="id" class="font-medium text-ink">{{ label }}</label>
      <output :for="id" class="tabular-nums text-ink-soft">{{ shown }}</output>
    </div>
    <input
      :id="id"
      type="range"
      class="range mt-2"
      :min="min"
      :max="max"
      :step="step"
      :value="modelValue"
      @input="emit('update:modelValue', Number(($event.target as HTMLInputElement).value))"
      @change="emit('commit')"
    >
  </div>
</template>
