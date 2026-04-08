import Script from "next/script";

export function MatomoTagManager({ consentGiven }) {
  return (
    <Script id="matomo-tag-manager" strategy="afterInteractive">
      {`var _paq = window._paq = window._paq || [];
_paq.push(['requireCookieConsent']);
${consentGiven ? "_paq.push(['setCookieConsentGiven']);" : ""}
var _mtm = window._mtm = window._mtm || [];
_mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
(function() {
  var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
  g.async=true; g.src='https://cdn.matomo.cloud/netbird.matomo.cloud/container_hvVzPZGH.js'; s.parentNode.insertBefore(g,s);
})();`}
    </Script>
  );
}
