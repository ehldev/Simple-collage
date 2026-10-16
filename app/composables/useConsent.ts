export type ConsentState = 'unknown' | 'granted' | 'denied'

const STORAGE_KEY = 'sc-consent-v1'

/** Consentimiento de cookies de medición (Google Analytics y Meta Pixel). */
export function useConsent() {
  const state = useState<ConsentState>('consent', () => 'unknown')
  const bannerOpen = useState('consent-banner', () => false)

  function load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved === 'granted' || saved === 'denied') state.value = saved
    }
    catch { /* almacenamiento bloqueado: se vuelve a preguntar */ }
    bannerOpen.value = state.value === 'unknown'
  }

  function set(value: 'granted' | 'denied') {
    state.value = value
    bannerOpen.value = false
    try {
      localStorage.setItem(STORAGE_KEY, value)
    }
    catch { /* almacenamiento bloqueado */ }
  }

  return {
    state,
    bannerOpen,
    load,
    accept: () => set('granted'),
    reject: () => set('denied'),
    reopen: () => { bannerOpen.value = true },
  }
}
