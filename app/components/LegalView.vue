<script setup lang="ts">
import { LEGAL, REPO_URL, type LegalKey } from '~/data/legal'
import type { LocaleCode } from '~/data/landings'

const props = defineProps<{ pageKey: LegalKey }>()

const { locale } = useI18n()
const config = useRuntimeConfig()

const page = computed(() => LEGAL[props.pageKey][locale.value as LocaleCode])
const contactEmail = computed(() => config.public.contactEmail as string)

const updatedLabel = computed(() => {
  if (!page.value.updated) return ''
  return new Intl.DateTimeFormat(locale.value, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(page.value.updated))
})

useSeoMeta({
  title: () => page.value.title,
  description: () => page.value.description,
  ogTitle: () => page.value.title,
  ogDescription: () => page.value.description,
})
</script>

<template>
  <article class="mx-auto max-w-3xl px-4 pt-10 sm:px-6 sm:pt-14">
    <h1 class="text-4xl font-extrabold sm:text-5xl">{{ page.title }}</h1>
    <p v-if="updatedLabel" class="mt-3 text-sm text-ink-faint">
      <time :datetime="page.updated">{{ updatedLabel }}</time>
    </p>
    <div class="prose-simple mt-6">
      <p class="text-lg">{{ page.intro }}</p>
      <template v-for="section in page.sections" :key="section.h">
        <h2>{{ section.h }}</h2>
        <p v-for="(p, i) in section.p" :key="i">{{ p }}</p>
      </template>

      <template v-if="pageKey === 'contact'">
        <p>
          <a :href="`${REPO_URL}/issues`" rel="noopener" target="_blank">{{ REPO_URL.replace('https://', '') }}/issues</a>
        </p>
        <p v-if="contactEmail">
          <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>
        </p>
      </template>
    </div>
  </article>
</template>
