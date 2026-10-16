import tailwindcss from '@tailwindcss/vite'

const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://simplecollage.app'

export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  devtools: { enabled: false },

  modules: [
    '@nuxtjs/i18n',
    '@nuxt/fonts',
    'nuxt-site-config',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    'nuxt-schema-org',
  ],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  app: {
    head: {
      htmlAttrs: { lang: 'es' },
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      meta: [
        { name: 'theme-color', content: '#16213E' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
    },
  },

  runtimeConfig: {
    public: {
      siteUrl,
      contactEmail: process.env.NUXT_PUBLIC_CONTACT_EMAIL || '',
      // Medición. Cada herramienta se activa solo si tiene su ID.
      // Plausible: URL del script que da su panel (https://plausible.io/js/pa-XXXX.js).
      plausibleScript: process.env.NUXT_PUBLIC_PLAUSIBLE_SCRIPT || '',
      gaId: process.env.NUXT_PUBLIC_GA_ID || '',
      metaPixelId: process.env.NUXT_PUBLIC_META_PIXEL_ID || '',
    },
  },

  site: {
    url: siteUrl,
    name: 'Simple Collage',
    defaultLocale: 'es',
  },

  i18n: {
    baseUrl: siteUrl,
    defaultLocale: 'es',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false,
    locales: [
      { code: 'es', language: 'es', name: 'Español', file: 'es.json' },
      { code: 'en', language: 'en', name: 'English', file: 'en.json' },
      { code: 'pt', language: 'pt-BR', name: 'Português', file: 'pt.json' },
    ],
    customRoutes: 'config',
    pages: {
      plantillas: { es: '/plantillas', en: '/templates', pt: '/modelos' },
      privacidad: { es: '/privacidad', en: '/privacy', pt: '/privacidade' },
      terminos: { es: '/terminos', en: '/terms', pt: '/termos' },
      acerca: { es: '/acerca', en: '/about', pt: '/sobre' },
      contacto: { es: '/contacto', en: '/contact', pt: '/contato' },
      editor: { es: '/editor', en: '/editor', pt: '/editor' },
    },
  },

  fonts: {
    defaults: { weights: [400, 500, 600, 700, 800], styles: ['normal'] },
  },

  schemaOrg: {
    identity: {
      type: 'Organization',
      name: 'Simple Collage',
      logo: '/apple-touch-icon.png',
    },
  },

  sitemap: {
    exclude: ['/editor', '/en/editor', '/pt/editor'],
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/en', '/pt'],
    },
  },
})
