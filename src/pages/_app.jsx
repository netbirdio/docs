import Head from 'next/head'
import { Router, useRouter } from 'next/router'
import { MDXProvider } from '@mdx-js/react'

import { LayoutAPI } from '@/components/LayoutAPI'
import * as mdxComponents from '@/components/mdx'
import { useMobileNavigationStore } from '@/components/MobileNavigation'

import '@/styles/tailwind.css'
import 'focus-visible'
import {LayoutDocs} from "@/components/LayoutDocs";
import {slugifyWithCounter} from "@sindresorhus/slugify";

function onRouteChange() {
  useMobileNavigationStore.getState().close()
}

Router.events.on('routeChangeStart', onRouteChange)
Router.events.on('hashChangeStart', onRouteChange)

export default function App({ Component, pageProps }) {
  let router = useRouter()
    let tableOfContents = collectHeadings(pageProps.sections)
  return (
    <>
      <Head>
        {router.pathname === '/' ? (
          <title>NetBird Docs</title>
        ) : (
            router.pathname.startsWith('/docs') ?
          <title>{`${pageProps.title} - NetBird Docs`}</title> : <title>{`${pageProps.title} - NetBird API`}</title>
        )}
        <meta name="description" content={pageProps.description} />
      </Head>
      <MDXProvider components={mdxComponents}>
          <LayoutDocs title={pageProps.title.toString()} tableOfContents={tableOfContents} {...pageProps}>
              <Component {...pageProps} />
          </LayoutDocs>
      </MDXProvider>
    </>
  )
}

function collectHeadings(sections, slugify = slugifyWithCounter()) {
    let output = []

    for (let section of sections) {
        if (section.tagName === 'h2' || section.tagName === 'h3') {
            let title = section.title
            let id = section.id
            if (section.tagName === 'h3') {
                if (!output[output.length - 1]) {
                    throw new Error(
                        'Cannot add `h3` to table of contents without a preceding `h2`'
                    )
                }
                output[output.length - 1].children.push({
                    id,
                    title,
                })
            } else {
                output.push({ id, title, children: [] })
            }
        }

        output.push(...collectHeadings(output.children ?? [], slugify))
    }

    return output
}
