<script setup lang="ts">
import { Cookie } from 'lucide-vue-next'

const { t } = useI18n()
const localePath = useLocalePath()
const consent = useConsent()
</script>

<template>
  <Transition
    enter-from-class="translate-y-4 opacity-0"
    enter-active-class="transition duration-300 ease-out"
    leave-to-class="translate-y-4 opacity-0"
    leave-active-class="transition duration-200 ease-in"
  >
    <section
      v-if="consent.bannerOpen.value"
      class="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-[22px] bg-paper p-5 shadow-[0_24px_60px_-20px_rgba(22,33,62,0.55)] ring-1 ring-line sm:bottom-5 sm:p-6"
      role="region"
      aria-labelledby="consent-title"
    >
      <div class="flex gap-4">
        <span class="hidden size-10 shrink-0 items-center justify-center rounded-xl bg-sun text-ink sm:flex" aria-hidden="true">
          <Cookie :size="20" />
        </span>
        <div>
          <h2 id="consent-title" class="font-display text-lg font-bold">{{ t('consent.title') }}</h2>
          <p class="mt-1.5 text-sm leading-relaxed text-ink-soft">
            {{ t('consent.text') }}
            <NuxtLink :to="localePath('privacidad')" class="font-semibold text-ink underline underline-offset-2">{{ t('consent.more') }}</NuxtLink>
          </p>
        </div>
      </div>
      <!-- Rechazar y aceptar con el mismo peso visual, como exige el RGPD -->
      <div class="mt-4 grid grid-cols-2 gap-2">
        <button type="button" class="btn btn-ghost !py-2.5 text-sm" @click="consent.reject">{{ t('consent.reject') }}</button>
        <button type="button" class="btn btn-ink !py-2.5 text-sm" @click="consent.accept">{{ t('consent.accept') }}</button>
      </div>
    </section>
  </Transition>
</template>
