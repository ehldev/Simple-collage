<script setup lang="ts">
import { ShieldCheck, Ratio, Move, Type, SlidersHorizontal, LayoutGrid, Save } from 'lucide-vue-next'
import { getLayout } from '~/utils/layouts'
import { LANDINGS, type LocaleCode } from '~/data/landings'

const { t, locale } = useI18n()
const localePath = useLocalePath()

useSeoMeta({
  title: () => t('home.meta.title'),
  description: () => t('home.meta.description'),
  ogTitle: () => t('home.meta.title'),
  ogDescription: () => t('home.meta.description'),
})

const POPULAR = ['grid-4', 'trio-left-big', 'duo-cols', 'six-feature', 'four-top-big', 'grid-9', 'four-strip', 'five-left-big']
const popular = POPULAR.map(id => getLayout(id))

const steps = ['s1', 's2', 's3'] as const

const features = [
  { key: 'formats', icon: Ratio },
  { key: 'frame', icon: Move },
  { key: 'text', icon: Type },
  { key: 'filters', icon: SlidersHorizontal },
  { key: 'style', icon: LayoutGrid },
  { key: 'autosave', icon: Save },
] as const

const faq = computed(() => [1, 2, 3, 4, 5, 6].map(n => ({ q: t(`home.faq.q${n}`), a: t(`home.faq.a${n}`) })))

const ideas = computed(() => LANDINGS.map(l => ({
  key: l.key,
  layoutId: l.layouts[0]!,
  ratio: l.ratio,
  label: l.content[locale.value as LocaleCode].label,
  to: localePath({ name: 'slug', params: { slug: l.slugs[locale.value as LocaleCode] } }),
})))

useSchemaOrg([
  defineWebSite({ name: 'Simple Collage' }),
  defineWebPage({ '@type': ['WebPage', 'FAQPage'] }),
  defineSoftwareApp({
    name: 'Simple Collage',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    offers: { price: 0, priceCurrency: 'USD' },
  }),
  ...faq.value.map(f => defineQuestion({ name: f.q, acceptedAnswer: f.a })),
])
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="mx-auto grid max-w-6xl items-end gap-8 px-4 pt-8 pb-16 sm:px-6 sm:pt-12 lg:grid-cols-[1.35fr_1fr] lg:gap-14 lg:pb-24">
      <HeroCollage />
      <div class="lg:pb-2">
        <p class="max-w-md text-lg leading-relaxed text-ink-soft">
          {{ t('home.hero.lead') }}
        </p>
        <div class="mt-7 flex flex-wrap gap-3">
          <NuxtLink :to="localePath('editor')" class="btn btn-primary text-base">
            {{ t('home.hero.cta') }}
          </NuxtLink>
          <NuxtLink :to="localePath('plantillas')" class="btn btn-ghost text-base">
            {{ t('home.hero.secondary') }}
          </NuxtLink>
        </div>
        <p class="mt-6 flex items-center gap-2 text-sm font-medium text-ink-soft">
          <ShieldCheck :size="18" class="text-tomato-deep" aria-hidden="true" />
          {{ t('home.hero.private') }}
        </p>
      </div>
    </section>

    <!-- Plantillas populares -->
    <section class="mx-auto max-w-6xl px-4 sm:px-6" aria-labelledby="templates-title">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="templates-title" class="text-3xl font-bold sm:text-4xl">{{ t('home.templates.title') }}</h2>
          <p class="mt-3 max-w-xl text-ink-soft">{{ t('home.templates.lead') }}</p>
        </div>
        <NuxtLink :to="localePath('plantillas')" class="font-semibold text-tomato-deep underline decoration-2 underline-offset-4 hover:text-ink">
          {{ t('home.templates.all') }}
        </NuxtLink>
      </div>
      <ul class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        <li v-for="layout in popular" :key="layout.id">
          <NuxtLink
            :to="localePath({ name: 'editor', query: { layout: layout.id } })"
            class="group block rounded-2xl bg-paper p-3 transition-colors hover:bg-white focus-visible:outline-offset-4"
            :aria-label="`${t('common.useTemplate')}: ${t('common.templateLabel', { n: layout.cells.length })}`"
          >
            <div class="flex aspect-square items-center justify-center">
              <div class="w-full" :style="{ maxWidth: layout.ratio === '9:16' ? '56%' : layout.ratio === '4:5' ? '80%' : '100%' }">
                <TemplateThumb :layout-id="layout.id" />
              </div>
            </div>
            <p class="mt-2.5 text-center text-sm font-medium text-ink-soft group-hover:text-ink">
              {{ t('common.photos', layout.cells.length) }}
            </p>
          </NuxtLink>
        </li>
      </ul>
    </section>

    <!-- Cómo funciona: es una secuencia real, por eso va numerada -->
    <section class="mx-auto mt-24 max-w-6xl px-4 sm:px-6" aria-labelledby="steps-title">
      <h2 id="steps-title" class="text-3xl font-bold sm:text-4xl">{{ t('home.steps.title') }}</h2>
      <ol class="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
        <li v-for="(step, i) in steps" :key="step" class="relative">
          <span class="font-display text-6xl font-extrabold leading-none text-tomato" aria-hidden="true">{{ i + 1 }}</span>
          <h3 class="mt-4 text-xl font-bold">{{ t(`home.steps.${step}.title`) }}</h3>
          <p class="mt-2 max-w-sm leading-relaxed text-ink-soft">{{ t(`home.steps.${step}.text`) }}</p>
        </li>
      </ol>
    </section>

    <!-- Funcionalidades -->
    <section class="mx-auto mt-24 max-w-6xl px-4 sm:px-6" aria-labelledby="features-title">
      <h2 id="features-title" class="text-3xl font-bold sm:text-4xl">{{ t('home.features.title') }}</h2>
      <ul class="mt-10 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="f in features" :key="f.key" class="flex gap-4">
          <span class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-paper text-ink">
            <component :is="f.icon" :size="20" aria-hidden="true" />
          </span>
          <div>
            <h3 class="text-lg font-bold">{{ t(`home.features.${f.key}.title`) }}</h3>
            <p class="mt-1.5 leading-relaxed text-ink-soft">{{ t(`home.features.${f.key}.text`) }}</p>
          </div>
        </li>
      </ul>
    </section>

    <!-- Privacidad -->
    <section class="mx-auto mt-24 max-w-6xl px-4 sm:px-6" aria-labelledby="privacy-title">
      <div class="grid items-center gap-8 rounded-[28px] bg-paper p-8 sm:p-12 md:grid-cols-[auto_1fr]">
        <div class="flex size-20 items-center justify-center rounded-3xl bg-sun text-ink" aria-hidden="true">
          <ShieldCheck :size="40" :stroke-width="1.75" />
        </div>
        <div>
          <h2 id="privacy-title" class="text-2xl font-bold sm:text-3xl">{{ t('home.privacy.title') }}</h2>
          <p class="mt-3 max-w-2xl text-lg leading-relaxed text-ink-soft">{{ t('home.privacy.text') }}</p>
        </div>
      </div>
    </section>

    <!-- Ideas (enlaces a landings) -->
    <section class="mx-auto mt-24 max-w-6xl px-4 sm:px-6" aria-labelledby="ideas-title">
      <h2 id="ideas-title" class="text-3xl font-bold sm:text-4xl">{{ t('home.ideas.title') }}</h2>
      <ul class="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="idea in ideas" :key="idea.key">
          <NuxtLink :to="idea.to" class="flex items-center gap-4 rounded-2xl p-3 transition-colors hover:bg-paper">
            <span class="w-14 shrink-0">
              <TemplateThumb :layout-id="idea.layoutId" ratio-id="1:1" />
            </span>
            <span class="font-semibold">{{ idea.label }}</span>
          </NuxtLink>
        </li>
      </ul>
    </section>

    <!-- FAQ -->
    <section class="mx-auto mt-24 max-w-3xl px-4 sm:px-6" aria-labelledby="faq-title">
      <h2 id="faq-title" class="mb-8 text-3xl font-bold sm:text-4xl">{{ t('home.faq.title') }}</h2>
      <FaqList :items="faq" />
    </section>

    <!-- CTA final -->
    <section class="mx-auto mt-24 max-w-6xl px-4 sm:px-6">
      <div class="flex flex-col items-start justify-between gap-6 rounded-[28px] bg-tomato px-8 py-10 text-white sm:flex-row sm:items-center sm:px-12">
        <div>
          <h2 class="text-3xl font-bold sm:text-4xl">{{ t('home.final.title') }}</h2>
          <p class="mt-2 text-lg text-white/85">{{ t('home.final.text') }}</p>
        </div>
        <NuxtLink :to="localePath('editor')" class="btn bg-white text-base text-ink hover:bg-sun">
          {{ t('home.hero.cta') }}
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
