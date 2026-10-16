<script setup lang="ts">
import { LANDINGS, type LocaleCode } from '~/data/landings'

const { t, locale } = useI18n()
const localePath = useLocalePath()

const ideas = computed(() => LANDINGS.map(l => ({
  to: localePath({ name: 'slug', params: { slug: l.slugs[locale.value as LocaleCode] } }),
  label: l.content[locale.value as LocaleCode].label,
})))

const year = new Date().getFullYear()

const config = useRuntimeConfig().public
const usesCookies = !!(config.gaId || config.metaPixelId)
const consent = useConsent()
</script>

<template>
  <footer class="mt-24 bg-ink text-white/80">
    <div class="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1.4fr_1fr]">
      <div>
        <NuxtLink :to="localePath('index')" class="flex items-center gap-2.5 font-display text-lg font-bold text-white">
          <LogoMark :size="24" />
          Simple Collage
        </NuxtLink>
        <p class="mt-4 max-w-xs text-sm leading-relaxed text-white/65">
          {{ t('footer.about') }}
        </p>
      </div>

      <nav :aria-label="t('footer.product')">
        <h2 class="font-display text-sm font-semibold text-white">{{ t('footer.product') }}</h2>
        <ul class="mt-4 space-y-2.5 text-sm">
          <li><NuxtLink :to="localePath('editor')" class="hover:text-white">{{ t('nav.create') }}</NuxtLink></li>
          <li><NuxtLink :to="localePath('plantillas')" class="hover:text-white">{{ t('nav.templates') }}</NuxtLink></li>
        </ul>
      </nav>

      <nav :aria-label="t('footer.ideas')">
        <h2 class="font-display text-sm font-semibold text-white">{{ t('footer.ideas') }}</h2>
        <ul class="mt-4 grid grid-cols-1 gap-x-4 gap-y-2.5 text-sm sm:grid-cols-2 md:grid-cols-1">
          <li v-for="idea in ideas" :key="idea.to">
            <NuxtLink :to="idea.to" class="hover:text-white">{{ idea.label }}</NuxtLink>
          </li>
        </ul>
      </nav>

      <nav :aria-label="t('footer.legal')">
        <h2 class="font-display text-sm font-semibold text-white">{{ t('footer.legal') }}</h2>
        <ul class="mt-4 space-y-2.5 text-sm">
          <li><NuxtLink :to="localePath('acerca')" class="hover:text-white">{{ t('footer.aboutLink') }}</NuxtLink></li>
          <li><NuxtLink :to="localePath('contacto')" class="hover:text-white">{{ t('footer.contact') }}</NuxtLink></li>
          <li><NuxtLink :to="localePath('privacidad')" class="hover:text-white">{{ t('footer.privacy') }}</NuxtLink></li>
          <li><NuxtLink :to="localePath('terminos')" class="hover:text-white">{{ t('footer.terms') }}</NuxtLink></li>
          <li v-if="usesCookies">
            <button type="button" class="hover:text-white" @click="consent.reopen">{{ t('footer.cookies') }}</button>
          </li>
        </ul>
      </nav>
    </div>
    <div class="border-t border-white/10">
      <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-5 text-xs text-white/55 sm:px-6">
        <span>© {{ year }} Simple Collage</span>
        <span>
          {{ t('footer.madeBy') }}
          <a href="https://github.com/ehldev" class="text-white/80 hover:text-white" rel="noopener" target="_blank">ehldev</a>
        </span>
      </div>
    </div>
  </footer>
</template>
