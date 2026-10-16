/**
 * Medición: Plausible (sin cookies), Google Analytics 4 y Meta Pixel
 * (con cookies, solo tras el consentimiento). Solo se usa en el cliente.
 */

type Props = Record<string, string | number | boolean>

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    fbq?: ((...args: unknown[]) => void) & { callMethod?: (...a: unknown[]) => void, queue?: unknown[], loaded?: boolean, version?: string, push?: unknown }
    _fbq?: unknown
    plausible?: ((event: string, options?: { props?: Props }) => void) & { q?: unknown[], init?: (o?: unknown) => void, o?: unknown }
  }
}

/** Eventos de negocio y su nombre en cada herramienta. */
const EVENTS = {
  photos_added: { plausible: 'Add Photos', meta: 'AddPhotos' },
  collage_download: { plausible: 'Download Collage', meta: 'CollageDownload' },
  collage_share: { plausible: 'Share Collage', meta: 'CollageShare' },
} as const

export type AnalyticsEvent = keyof typeof EVENTS

export function track(event: AnalyticsEvent, props: Props = {}) {
  if (typeof window === 'undefined') return
  const names = EVENTS[event]
  try {
    window.plausible?.(names.plausible, { props })
    window.gtag?.('event', event, props)
    window.fbq?.('trackCustom', names.meta, props)
  }
  catch { /* la medición nunca debe romper la app */ }
}

function addScript(src: string, attrs: Record<string, string> = {}) {
  const s = document.createElement('script')
  s.async = true
  s.src = src
  for (const [k, v] of Object.entries(attrs)) s.setAttribute(k, v)
  document.head.appendChild(s)
}

export function loadPlausible(scriptUrl: string, domain: string) {
  if (window.plausible) return
  // Igual que el snippet oficial: encola `arguments` hasta que carga el script.
  const fn = function plausible() {
    // eslint-disable-next-line prefer-rest-params
    (fn.q = fn.q || []).push(arguments)
  } as NonNullable<Window['plausible']>
  fn.init = (o?: unknown) => { fn.o = o || {} }
  window.plausible = fn
  // El script nuevo (pa-XXXX.js) se configura con init(); el clásico (script.js) con data-domain.
  if (/\/pa-[\w-]+\.js/.test(scriptUrl)) {
    fn.init()
    addScript(scriptUrl)
  }
  else {
    addScript(scriptUrl, { 'data-domain': domain, 'defer': '' })
  }
}

/** Carga GA4 con Consent Mode v2: sin cookies hasta que haya consentimiento. */
export function loadGoogleAnalytics(id: string, granted: boolean) {
  if (window.gtag) return
  window.dataLayer = window.dataLayer || []
  // gtag debe empujar el objeto `arguments`, no un array.
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments)
  }
  const state = granted ? 'granted' : 'denied'
  window.gtag('consent', 'default', {
    analytics_storage: state,
    ad_storage: state,
    ad_user_data: state,
    ad_personalization: state,
    wait_for_update: 500,
  })
  window.gtag('js', new Date())
  window.gtag('config', id, { send_page_view: false })
  addScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`)
}

export function setGoogleConsent(granted: boolean) {
  const state = granted ? 'granted' : 'denied'
  window.gtag?.('consent', 'update', {
    analytics_storage: state,
    ad_storage: state,
    ad_user_data: state,
    ad_personalization: state,
  })
}

/** Meta Pixel: solo se carga después de que la persona acepta. */
export function loadMetaPixel(id: string) {
  if (window.fbq) {
    window.fbq('consent', 'grant')
    return
  }
  // Igual que el snippet oficial de Meta.
  const n = function fbq() {
    // eslint-disable-next-line prefer-rest-params
    if (n.callMethod) n.callMethod.apply(n, arguments as unknown as unknown[])
    // eslint-disable-next-line prefer-rest-params
    else n.queue!.push(arguments)
  } as NonNullable<Window['fbq']>
  n.push = n
  n.loaded = true
  n.version = '2.0'
  n.queue = []
  window.fbq = n
  window._fbq = n
  addScript('https://connect.facebook.net/en_US/fbevents.js')
  window.fbq('consent', 'grant')
  window.fbq('init', id)
}

export function revokeMetaPixel() {
  window.fbq?.('consent', 'revoke')
}

export function trackPageView() {
  window.gtag?.('event', 'page_view', { page_location: location.href, page_title: document.title })
  window.fbq?.('track', 'PageView')
}
