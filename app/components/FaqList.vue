<script setup lang="ts">
import { Plus } from 'lucide-vue-next'

defineProps<{ items: { q: string, a: string }[] }>()
</script>

<template>
  <div class="divide-y divide-line border-y border-line">
    <details v-for="item in items" :key="item.q" class="group py-1">
      <summary class="flex cursor-pointer list-none items-center justify-between gap-6 py-4 font-display text-lg font-semibold [&::-webkit-details-marker]:hidden">
        <h3 class="text-lg">{{ item.q }}</h3>
        <Plus :size="20" class="shrink-0 text-ink-faint transition-transform duration-200 group-open:rotate-45" aria-hidden="true" />
      </summary>
      <p class="max-w-2xl pb-5 leading-relaxed text-ink-soft">{{ item.a }}</p>
    </details>
  </div>
</template>
