<script setup lang="ts">
import { layoutsByCount } from '~/utils/layouts'

const { t } = useI18n()
const localePath = useLocalePath()

useSeoMeta({
  title: () => t('templatesPage.meta.title'),
  description: () => t('templatesPage.meta.description'),
  ogTitle: () => t('templatesPage.meta.title'),
  ogDescription: () => t('templatesPage.meta.description'),
})

const groups = layoutsByCount()
const filter = ref<number | null>(null)
const visible = computed(() => (filter.value === null ? groups : groups.filter(g => g.count === filter.value)))
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-14">
    <h1 class="text-4xl font-extrabold sm:text-5xl">{{ t('templatesPage.title') }}</h1>
    <p class="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">{{ t('templatesPage.lead') }}</p>

    <div class="mt-8 flex flex-wrap gap-2" role="group" :aria-label="t('templatesPage.filterLabel')">
      <button
        type="button"
        class="rounded-full px-4 py-2 text-sm font-semibold transition-colors"
        :class="filter === null ? 'bg-ink text-white' : 'bg-paper text-ink-soft hover:text-ink'"
        :aria-pressed="filter === null"
        @click="filter = null"
      >
        {{ t('templatesPage.all') }}
      </button>
      <button
        v-for="g in groups"
        :key="g.count"
        type="button"
        class="rounded-full px-4 py-2 text-sm font-semibold transition-colors"
        :class="filter === g.count ? 'bg-ink text-white' : 'bg-paper text-ink-soft hover:text-ink'"
        :aria-pressed="filter === g.count"
        @click="filter = g.count"
      >
        {{ g.count }}
      </button>
    </div>

    <section v-for="g in visible" :key="g.count" class="mt-12" :aria-labelledby="`group-${g.count}`">
      <h2 :id="`group-${g.count}`" class="text-2xl font-bold">{{ t('common.photos', g.count) }}</h2>
      <ul class="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <li v-for="layout in g.layouts" :key="layout.id">
          <NuxtLink
            :to="localePath({ name: 'editor', query: { layout: layout.id } })"
            class="group flex h-full flex-col rounded-2xl bg-paper p-4 transition-shadow hover:shadow-[0_10px_30px_-14px_rgba(22,33,62,0.4)]"
          >
            <div class="flex aspect-square items-center justify-center">
              <div class="w-full" :style="{ maxWidth: layout.ratio === '9:16' ? '56%' : layout.ratio === '4:5' ? '80%' : '100%' }">
                <TemplateThumb :layout-id="layout.id" />
              </div>
            </div>
            <span class="mt-3 text-sm font-semibold text-ink-soft group-hover:text-tomato-deep">
              {{ t('common.useTemplate') }}
            </span>
          </NuxtLink>
        </li>
      </ul>
    </section>
  </div>
</template>
