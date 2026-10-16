<script setup lang="ts">
const head = useLocaleHead({ dir: true, lang: true, seo: true })

useHead(() => ({
  htmlAttrs: head.value.htmlAttrs,
  link: head.value.link,
  meta: head.value.meta,
  titleTemplate: (title?: string) => (title ? `${title} | Simple Collage` : 'Simple Collage'),
}))

useSeoMeta({
  ogSiteName: 'Simple Collage',
  ogType: 'website',
  ogImage: `${useRuntimeConfig().public.siteUrl}/og-image.png`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <ClientOnly>
    <CookieBanner />
  </ClientOnly>
</template>
