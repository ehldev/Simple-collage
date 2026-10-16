<script setup lang="ts">
import { Lightbulb } from 'lucide-vue-next'
import { getLayout } from '~/utils/layouts'
import { findLanding, LANDINGS, type LocaleCode } from '~/data/landings'

const route = useRoute()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const setI18nParams = useSetI18nParams()

const landing = computed(() => findLanding(locale.value, String(route.params.slug)))
if (!landing.value) {
  throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })
}

const content = computed(() => landing.value!.content[locale.value as LocaleCode])
const layouts = computed(() => landing.value!.layouts.map(id => getLayout(id)))

setI18nParams({
  es: { slug: landing.value.slugs.es },
  en: { slug: landing.value.slugs.en },
  pt: { slug: landing.value.slugs.pt },
})

function editorLink(layoutId: string) {
  const query: Record<string, string> = { layout: layoutId }
  if (landing.value?.ratio) query.ratio = landing.value.ratio
  return localePath({ name: 'editor', query })
}

const related = computed(() => LANDINGS
  .filter(l => l.key !== landing.value?.key)
  .map(l => ({
    key: l.key,
    label: l.content[locale.value as LocaleCode].label,
    to: localePath({ name: 'slug', params: { slug: l.slugs[locale.value as LocaleCode] } }),
  })))

useSeoMeta({
  title: () => content.value.metaTitle,
  description: () => content.value.description,
  ogTitle: () => content.value.metaTitle,
  ogDescription: () => content.value.description,
})

useSchemaOrg([
  defineWebPage({ '@type': ['WebPage', 'FAQPage'] }),
  defineHowTo({
    name: content.value.h1,
    step: (['s1', 's2', 's3'] as const).map(s => ({ name: t(`home.steps.${s}.title`), text: t(`home.steps.${s}.text`) })),
  }),
  ...content.value.faq.map(f => defineQuestion({ name: f.q, acceptedAnswer: f.a })),
])
</script>

<template>
  <article class="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-14">
    <header class="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
      <div>
        <h1 class="text-4xl font-extrabold sm:text-5xl">{{ content.h1 }}</h1>
        <p v-for="(p, i) in content.intro" :key="i" class="mt-4 max-w-xl text-lg leading-relaxed text-ink-soft">{{ p }}</p>
        <NuxtLink :to="editorLink(layouts[0]!.id)" class="btn btn-primary mt-8 text-base">
          {{ t('landing.cta') }}
        </NuxtLink>
      </div>
      <div class="mx-auto w-full max-w-sm rounded-[28px] bg-paper p-6 sm:p-8">
        <TemplateThumb :layout-id="layouts[0]!.id" :ratio-id="landing!.ratio" />
      </div>
    </header>

    <section class="mt-20" aria-labelledby="landing-templates">
      <h2 id="landing-templates" class="text-3xl font-bold">{{ t('landing.templatesTitle') }}</h2>
      <ul class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <li v-for="layout in layouts" :key="layout.id">
          <NuxtLink
            :to="editorLink(layout.id)"
            class="group flex h-full flex-col rounded-2xl bg-paper p-4 transition-shadow hover:shadow-[0_10px_30px_-14px_rgba(22,33,62,0.4)]"
          >
            <div class="flex aspect-square items-center justify-center">
              <div class="w-full" :style="{ maxWidth: (landing!.ratio ?? layout.ratio) === '9:16' ? '56%' : (landing!.ratio ?? layout.ratio) === '4:5' ? '80%' : '100%' }">
                <TemplateThumb :layout-id="layout.id" :ratio-id="landing!.ratio" />
              </div>
            </div>
            <span class="mt-3 text-sm font-semibold text-ink-soft group-hover:text-tomato-deep">
              {{ t('common.photos', layout.cells.length) }}
            </span>
          </NuxtLink>
        </li>
      </ul>
    </section>

    <div class="mt-20 grid gap-14 lg:grid-cols-2">
      <section aria-labelledby="landing-steps">
        <h2 id="landing-steps" class="text-3xl font-bold">{{ t('landing.stepsTitle') }}</h2>
        <ol class="mt-6 space-y-6">
          <li v-for="(s, i) in (['s1', 's2', 's3'] as const)" :key="s" class="flex gap-4">
            <span class="font-display text-4xl font-extrabold leading-none text-tomato" aria-hidden="true">{{ i + 1 }}</span>
            <div>
              <h3 class="text-lg font-bold">{{ t(`home.steps.${s}.title`) }}</h3>
              <p class="mt-1 leading-relaxed text-ink-soft">{{ t(`home.steps.${s}.text`) }}</p>
            </div>
          </li>
        </ol>
      </section>

      <section aria-labelledby="landing-tips" class="rounded-[28px] bg-paper p-8">
        <h2 id="landing-tips" class="flex items-center gap-3 text-2xl font-bold">
          <Lightbulb :size="24" class="text-tomato-deep" aria-hidden="true" />
          {{ t('landing.tipsTitle') }}
        </h2>
        <ul class="mt-5 space-y-4">
          <li v-for="(tip, i) in content.tips" :key="i" class="border-l-4 border-sun pl-4 leading-relaxed text-ink-soft">
            {{ tip }}
          </li>
        </ul>
      </section>
    </div>

    <section class="mt-20 max-w-3xl" aria-labelledby="landing-faq">
      <h2 id="landing-faq" class="mb-6 text-3xl font-bold">{{ t('landing.faqTitle') }}</h2>
      <FaqList :items="content.faq" />
    </section>

    <nav class="mt-20" aria-labelledby="landing-related">
      <h2 id="landing-related" class="text-2xl font-bold">{{ t('landing.related') }}</h2>
      <ul class="mt-5 flex flex-wrap gap-2">
        <li v-for="r in related" :key="r.key">
          <NuxtLink :to="r.to" class="inline-block rounded-full bg-paper px-4 py-2 text-sm font-semibold text-ink-soft hover:text-ink">
            {{ r.label }}
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </article>
</template>
