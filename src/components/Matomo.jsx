import Script from "next/script";
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

export function MatomoTagManager({ consentGiven }) {
  const router = useRouter()
  const isFirstNavigation = useRef(true)

  useEffect(() => {
    if (!consentGiven) return

    // The container tracks the initial hard load. Subsequent Next.js routes
    // are emitted after the new document title has committed so Matomo does
    // not associate the previous page's title with the new URL.
    if (isFirstNavigation.current) {
      isFirstNavigation.current = false
      return
    }

    const id = window.setTimeout(() => {
      window._mtm = window._mtm || []
      window._mtm.push({
        event: 'mtm.SpaPageView',
        'mtm.pageUrl': window.location.href,
        'mtm.pageTitle': document.title,
      })
    }, 0)

    return () => window.clearTimeout(id)
  }, [consentGiven, router.asPath])

  if (!consentGiven) {
    return null
  }

  return (
    <Script id="matomo-tag-manager" strategy="afterInteractive">
      {`var _paq = window._paq = window._paq || [];
_paq.push(['requireConsent']);
var _mtm = window._mtm = window._mtm || [];
_mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
(function() {
  var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
  g.async=true;
  g.src='https://cdn.matomo.cloud/netbird.matomo.cloud/container_hvVzPZGH.js';
  g.onload=function(){window._paq.push(['setConsentGiven']);};
  s.parentNode.insertBefore(g,s);
})();`}
    </Script>
  );
}
