<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <header class="sticky top-0 z-20 border-b border-line/70 bg-sky/85 backdrop-blur-md">
    <div class="mx-auto flex h-16 max-w-6xl items-center gap-1.5 px-4 sm:gap-3 sm:px-6">
      <NuxtLink :to="localePath('index')" class="mr-auto flex items-center gap-2.5 whitespace-nowrap font-display text-lg font-bold tracking-tight">
        <LogoMark :size="26" />
        <span>Simple Collage</span>
      </NuxtLink>
      <nav class="hidden items-center sm:flex" :aria-label="t('nav.templates')">
        <NuxtLink
          :to="localePath('plantillas')"
          class="rounded-full px-3 py-2 text-sm font-medium text-ink-soft hover:bg-paper hover:text-ink"
          active-class="text-ink"
        >
          {{ t('nav.templates') }}
        </NuxtLink>
      </nav>
      <LangSwitcher />
      <NuxtLink :to="localePath('editor')" class="btn btn-primary !px-4 !py-2 text-sm">
        {{ t('nav.create') }}
      </NuxtLink>
    </div>
  </header>
</template>
