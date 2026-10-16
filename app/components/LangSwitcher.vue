<script setup lang="ts">
import { Globe } from 'lucide-vue-next'
import { findLanding, type LocaleCode } from '~/data/landings'

const { locale, locales, t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const details = ref<HTMLDetailsElement>()

const current = computed(() => locales.value.find(l => l.code === locale.value))

// Las landing pages tienen un slug distinto por idioma. La cabecera se renderiza
// antes que la página, así que no podemos depender de useSetI18nParams aquí.
const landing = computed(() => (route.params.slug ? findLanding(locale.value, String(route.params.slug)) : undefined))

function pathFor(code: string) {
  if (landing.value) return localePath({ name: 'slug', params: { slug: landing.value.slugs[code as LocaleCode] } }, code as LocaleCode)
  return switchLocalePath(code as LocaleCode)
}

function close() {
  if (details.value) details.value.open = false
}
</script>

<template>
  <details ref="details" class="group relative">
    <summary
      class="flex cursor-pointer list-none items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-ink-soft hover:bg-paper hover:text-ink [&::-webkit-details-marker]:hidden"
      :aria-label="t('nav.language')"
    >
      <Globe :size="16" aria-hidden="true" />
      <span class="hidden sm:inline">{{ current?.name }}</span>
    </summary>
    <ul class="absolute right-0 z-30 mt-2 min-w-40 rounded-2xl bg-paper p-1.5 shadow-[0_12px_32px_-12px_rgba(22,33,62,0.35)]">
      <li v-for="l in locales" :key="l.code">
        <NuxtLink
          :to="pathFor(l.code)"
          :hreflang="l.language"
          class="block rounded-xl px-3 py-2 text-sm hover:bg-sky"
          :class="l.code === locale ? 'font-semibold text-ink' : 'text-ink-soft'"
          @click="close"
        >
          {{ l.name }}
        </NuxtLink>
      </li>
    </ul>
  </details>
</template>
