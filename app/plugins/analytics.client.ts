import {
  loadGoogleAnalytics, loadMetaPixel, loadPlausible, revokeMetaPixel, setGoogleConsent, trackPageView,
} from '~/utils/analytics'
import type { ConsentState } from '~/composables/useConsent'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig().public
  const plausibleScript = config.plausibleScript as string
  const gaId = config.gaId as string
  const metaPixelId = config.metaPixelId as string
  const router = useRouter()
  const consent = useConsent()

  // Plausible no usa cookies: se carga siempre y cuenta las páginas por su cuenta.
  if (plausibleScript) loadPlausible(plausibleScript, new URL(config.siteUrl as string).hostname)

  // Solo hace falta pedir permiso si hay herramientas con cookies.
  if (!gaId && !metaPixelId) return
  consent.load()

  const granted = consent.state.value === 'granted'
  if (gaId) loadGoogleAnalytics(gaId, granted)
  if (metaPixelId && granted) loadMetaPixel(metaPixelId)

  // Cambio de decisión desde el banner o desde "Preferencias de cookies".
  watch(consent.state, (state: ConsentState, old: ConsentState) => {
    if (state === old) return
    const ok = state === 'granted'
    if (gaId) setGoogleConsent(ok)
    if (!metaPixelId) return
    if (ok) {
      loadMetaPixel(metaPixelId)
      // La página actual no se contó porque el Pixel recién se cargó.
      window.fbq?.('track', 'PageView')
    }
    else {
      revokeMetaPixel()
    }
  })

  // Páginas vistas: una por ruta, incluida la primera.
  let lastPath = ''
  function pageView() {
    const path = router.currentRoute.value.fullPath
    if (path === lastPath) return
    lastPath = path
    // Esperamos a que la página actualice su <title>.
    setTimeout(trackPageView, 50)
  }
  nuxtApp.hook('app:mounted', pageView)
  nuxtApp.hook('page:finish', pageView)
})
