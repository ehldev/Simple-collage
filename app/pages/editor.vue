<script setup lang="ts">
definePageMeta({ layout: 'editor' })

const { t } = useI18n()

useSeoMeta({
  title: () => t('editor.meta.title'),
  description: () => t('editor.meta.description'),
  // Las landing pages compiten por las búsquedas; el editor no aporta contenido indexable.
  robots: 'noindex, follow',
})
</script>

<template>
  <ClientOnly>
    <EditorRoot />
    <template #fallback>
      <div class="flex h-full flex-col items-center justify-center gap-4 text-ink-soft">
        <h1 class="sr-only">{{ t('editor.meta.title') }}</h1>
        <LogoMark :size="40" class="animate-pulse" />
        <p class="text-sm font-medium">{{ t('editor.loading') }}</p>
      </div>
    </template>
  </ClientOnly>
</template>
