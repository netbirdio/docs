import Head from 'next/head'
import { Router, useRouter } from 'next/router'
import { MDXProvider } from '@mdx-js/react'

import * as mdxComponents from '@/components/mdx'
import { useMobileNavigationStore } from '@/components/MobileNavigation'

import '@/styles/tailwind.css'
import 'focus-visible'
import {Layout} from "@/components/Layout";
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
        {router.route.startsWith('/ipa') ?
            <title>{`${pageProps.title} - NetBird API`}</title> : <title>{`${pageProps.title} - NetBird Docs`}</title>
        }
        <meta name="description" content={pageProps.description} />
      </Head>
      <MDXProvider components={mdxComponents}>
          <Layout title={pageProps.title?.toString()} tableOfContents={tableOfContents} {...pageProps}>
              <Component {...pageProps} />
          </Layout>
      </MDXProvider>
    </>
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
