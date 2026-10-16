<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const { t } = useI18n()
const localePath = useLocalePath()

const notFound = computed(() => props.error.statusCode === 404)
useSeoMeta({ title: () => (notFound.value ? t('error.notFound') : t('error.generic')), robots: 'noindex' })
</script>

<template>
  <NuxtLayout>
    <section class="mx-auto flex max-w-xl flex-col items-start px-4 py-24 sm:px-6">
      <p class="font-display text-7xl font-extrabold text-tomato">{{ error.statusCode }}</p>
      <h1 class="mt-4 text-3xl font-bold">{{ notFound ? t('error.notFound') : t('error.generic') }}</h1>
      <p v-if="notFound" class="mt-3 text-lg text-ink-soft">{{ t('error.notFoundText') }}</p>
      <button type="button" class="btn btn-primary mt-8" @click="clearError({ redirect: localePath('index') })">
        {{ t('error.back') }}
      </button>
    </section>
  </NuxtLayout>
</template>
