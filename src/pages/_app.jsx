import Head from 'next/head'
import { Router, useRouter } from 'next/router'
import { MDXProvider } from '@mdx-js/react'

import * as mdxComponents from '@/components/mdx'
import { useMobileNavigationStore } from '@/components/MobileNavigation'

import '@/styles/tailwind.css'
import 'focus-visible'
import {Layout} from "@/components/Layout";
import {slugifyWithCounter} from "@sindresorhus/slugify";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {dom} from "@fortawesome/fontawesome-svg-core";
import {AnnouncementBannerProvider} from "@/components/announcement-banner/AnnouncementBannerProvider";
import {ImageZoom} from "@/components/ImageZoom";
import {MatomoTagManager} from "@/components/Matomo";
import {CookieConsentProvider, useCookieConsent} from "@/components/cookie-consent/CookieConsentProvider";
import {CookieConsent} from "@/components/cookie-consent/CookieConsent";

function onRouteChange() {
  useMobileNavigationStore.getState().close()
}

Router.events.on('routeChangeStart', onRouteChange)
Router.events.on('hashChangeStart', onRouteChange)

function AppInner({ Component, pageProps }) {
  let router = useRouter()
  let tableOfContents = collectHeadings(pageProps.sections)
  const { isAccepted } = useCookieConsent()

  return (
    <>
      <MatomoTagManager consentGiven={isAccepted} />
      <Head>
        <style>{dom.css()}</style>
        {router.route.startsWith('/ipa') ?
            <title>{`${pageProps.title} - NetBird API`}</title> : <title>{`${pageProps.title} - NetBird Docs`}</title>
        }
        <meta name="description" content={pageProps.description} />
      </Head>
      <AnnouncementBannerProvider>
          <MDXProvider components={mdxComponents}>
              <Layout title={pageProps.title?.toString()} tableOfContents={tableOfContents} {...pageProps}>
                  <Component {...pageProps} />
              </Layout>
          </MDXProvider>
      </AnnouncementBannerProvider>
      <ToastContainer />
      <ImageZoom />
      <CookieConsent />
    </>
  )
}

export default function App(props) {
  return (
    <CookieConsentProvider>
      <AppInner {...props} />
    </CookieConsentProvider>
  )
}

function collectHeadings(sections, slugify = slugifyWithCounter()) {
    let output = []

    if (sections === undefined) {
        return []
    }
    for (let section of sections) {
        if (section.tagName === 'h2' || section.tagName === 'h3') {
            let title = section.title
            let id = section.id
            let tag = section.tag
            if (section.tagName === 'h3') {
                if (!output[output.length - 1]) {
                    throw new Error(
                        'Cannot add `h3` to table of contents without a preceding `h2`'
                    )
                }
                output[output.length - 1].children.push({
                    id,
                    title,
                    tag,
                })
            } else {
                output.push({ id, title, tag, children: [] })
            }
        }

        output.push(...collectHeadings(output.children ?? [], slugify))
    }

    return output
}
