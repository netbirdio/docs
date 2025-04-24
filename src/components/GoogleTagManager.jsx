import * as React from "react";
import Script from "next/script";

// Google Tag Manager ID
const GTM_ID = "GTM-PGWDPDN3";

export const GoogleTagManagerHeadScript = () => {
    return (
        <Script id="gtm-script" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': 
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
       })(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
    );
};

export const GoogleTageManagerBodyScript = () => {
    return (
        <noscript>
            <iframe
                title={"Google Tag Manager"}
                src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
            />
        </noscript>
    );
};
