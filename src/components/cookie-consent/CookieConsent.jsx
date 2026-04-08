import { useCookieConsent } from '@/components/cookie-consent/CookieConsentProvider'
import clsx from 'clsx'
import { useEffect, useState } from 'react'

export function CookieConsent() {
  const { showConsent, acceptCookies, declineCookies } = useCookieConsent()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (showConsent) {
      // Small delay so the CSS transition plays on mount
      const id = setTimeout(() => setVisible(true), 50)
      return () => clearTimeout(id)
    }
    setVisible(false)
  }, [showConsent])

  if (!showConsent) return null

  return (
    <div
      className={clsx(
        'fixed inset-0 z-[999] flex items-center justify-center px-4 transition-opacity duration-300',
        visible ? 'opacity-100' : 'opacity-0'
      )}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Banner */}
      <div className="relative mx-auto max-w-lg rounded-xl border border-neutral-800 bg-black px-8 pb-6 pt-4 shadow-lg">
        <h3 className="text-base font-semibold text-white">
          We are using cookies
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-white/70">
          We use our own cookies as well as third-party cookies on our websites
          to enhance your experience, analyze our traffic, and for security and
          marketing. View our{' '}
          <a
            href="https://netbird.io/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white underline underline-offset-4 transition-colors hover:text-netbird"
          >
            Privacy Policy
          </a>{' '}
          for more information.
        </p>

        <div className="mt-4 flex items-center justify-between gap-8">
          <button
            type="button"
            onClick={declineCookies}
            className="cursor-pointer text-xs text-white/70 underline underline-offset-[6px] transition-colors duration-300 hover:text-netbird"
          >
            Required only cookies
          </button>

          <button
            type="button"
            onClick={acceptCookies}
            className="rounded-md bg-netbird px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-netbird/90"
          >
            Accept all cookies
          </button>
        </div>
      </div>
    </div>
  )
}
