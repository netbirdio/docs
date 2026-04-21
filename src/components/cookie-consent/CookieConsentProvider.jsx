import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const STORAGE_KEY = 'cookie-consent'
const ACCEPT_EXPIRY_DAYS = 90
const DECLINE_EXPIRY_DAYS = 1

const CookieConsentContext = createContext({
  isAccepted: false,
  showConsent: false,
  acceptCookies: () => {},
  declineCookies: () => {},
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

export function CookieConsentProvider({ children }) {
  const router = useRouter()
  const [consent, setConsent] = useState(() => getStoredConsent())
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
    storeConsent('accepted', ACCEPT_EXPIRY_DAYS)
    setConsent('accepted')
    setShowConsent(false)

    // Enable Matomo cookies
    window._paq = window._paq || []
    window._paq.push(['setCookieConsentGiven'])
  }, [])

  const declineCookies = useCallback(() => {
    storeConsent('declined', DECLINE_EXPIRY_DAYS)
    setConsent('declined')
    setShowConsent(false)

    // Tell Matomo to forget consent and delete its cookies
    window._paq = window._paq || []
    window._paq.push(['forgetCookieConsentGiven'])
  }, [])

  return (
    <CookieConsentContext.Provider
      value={{
        isAccepted: consent === 'accepted',
        showConsent,
        acceptCookies,
        declineCookies,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  )
}

export function useCookieConsent() {
  return useContext(CookieConsentContext)
}
