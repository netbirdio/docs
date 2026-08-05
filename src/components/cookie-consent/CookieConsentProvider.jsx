import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const STORAGE_KEY = 'cookie-consent'
const CONSENT_EXPIRY_DAYS = 180

const TRACKING_COOKIE_PREFIXES = [
  '_ga',
  '_gid',
  '_hj',
  '_clck',
  '_clsk',
  '_gcl_',
  '_pk_',
  '__hst',
  'hubspotutk',
  'messagesUtk',
]

const CookieConsentContext = createContext({
  isAccepted: false,
  isDeclined: false,
  showConsent: false,
  acceptCookies: () => {},
  declineCookies: () => {},
  openCookieSettings: () => {},
})

function getStoredConsent() {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const { value, expires } = JSON.parse(raw)
    if (Date.now() > expires) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return value
  } catch {
    return null
  }
}

function storeConsent(value, days) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        value,
        expires: Date.now() + days * 24 * 60 * 60 * 1000,
      })
    )
  } catch {}
}

function removeTrackingCookies() {
  const cookieNames = document.cookie
    .split(';')
    .map((cookie) => cookie.split('=')[0].trim())
    .filter(Boolean)

  for (const name of cookieNames) {
    if (!TRACKING_COOKIE_PREFIXES.some((prefix) => name.startsWith(prefix))) {
      continue
    }

    const expiredCookie = `${name}=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`
    document.cookie = expiredCookie
    document.cookie = `${expiredCookie}; domain=${window.location.hostname}`
    if (
      window.location.hostname === 'netbird.io' ||
      window.location.hostname.endsWith('.netbird.io')
    ) {
      document.cookie = `${expiredCookie}; domain=.netbird.io`
    }
  }
}

export function CookieConsentProvider({ children }) {
  const router = useRouter()
  // Resolve browser storage after hydration so the server and the first client
  // render agree. Analytics remains disabled while the choice is loading.
  const [consent, setConsent] = useState(null)
  const [showConsent, setShowConsent] = useState(false)

  useEffect(() => {
    const stored = getStoredConsent()
    setConsent(stored)
    setShowConsent(stored === null)
  }, [])

  useEffect(() => {
    // Hide banner on privacy-related pages
    if (router.pathname.startsWith('/privacy') || router.pathname.startsWith('/terms')) {
      setShowConsent(false)
    }
  }, [router.pathname])

  const acceptCookies = useCallback(() => {
    storeConsent('accepted', CONSENT_EXPIRY_DAYS)
    setConsent('accepted')
    setShowConsent(false)
  }, [])

  const declineCookies = useCallback(() => {
    const trackersWereActive = consent === 'accepted'

    storeConsent('declined', CONSENT_EXPIRY_DAYS)
    setConsent('declined')
    setShowConsent(false)

    removeTrackingCookies()

    // Scripts already loaded by an accepted visitor cannot be reliably
    // unloaded. Reload into the persisted declined state so no optional
    // analytics script is mounted again.
    if (trackersWereActive) {
      window._paq = window._paq || []
      window._paq.push(['forgetConsentGiven'])
      window._paq.push(['deleteCookies'])
      window.location.reload()
    }
  }, [consent])

  const openCookieSettings = useCallback(() => {
    setShowConsent(true)
  }, [])

  return (
    <CookieConsentContext.Provider
      value={{
        isAccepted: consent === 'accepted',
        isDeclined: consent === 'declined',
        showConsent,
        acceptCookies,
        declineCookies,
        openCookieSettings,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  )
}

export function useCookieConsent() {
  return useContext(CookieConsentContext)
}
