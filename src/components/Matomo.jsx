import Script from "next/script";

export function MatomoTagManager() {
  return (
    <Script id="matomo-tag-manager" strategy="afterInteractive">
      {`var _mtm = window._mtm = window._mtm || [];
_mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
(function() {
  var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
  g.async=true; g.src='https://cdn.matomo.cloud/netbird.matomo.cloud/container_hvVzPZGH.js'; s.parentNode.insertBefore(g,s);
})();`}
    </Script>
  );
}
