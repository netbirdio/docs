import { Head, Html, Main, NextScript } from 'next/document'
import {GoogleTageManagerBodyScript, GoogleTagManagerHeadScript} from "@/components/GoogleTagManager";

const modeScript = `
  let darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  updateMode()
  darkModeMediaQuery.addEventListener('change', updateModeWithoutTransitions)
  window.addEventListener('storage', updateModeWithoutTransitions)

  function updateMode() {
    let isSystemDarkMode = darkModeMediaQuery.matches
    let isDarkMode = window.localStorage.isDarkMode === 'true' || (!('isDarkMode' in window.localStorage) && isSystemDarkMode)

    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    if (isDarkMode === isSystemDarkMode) {
      delete window.localStorage.isDarkMode
    }
  }

  function disableTransitionsTemporarily() {
    document.documentElement.classList.add('[&_*]:!transition-none')
    window.setTimeout(() => {
      document.documentElement.classList.remove('[&_*]:!transition-none')
    }, 0)
  }

  function updateModeWithoutTransitions() {
    disableTransitionsTemporarily()
    updateMode()
  }
`

export default function Document() {
  return (
    <Html lang="en">
      <Head>
          <GoogleTagManagerHeadScript />
          <script dangerouslySetInnerHTML={{ __html: modeScript }} />
          <link rel="shortcut icon" href="/docs-static/img/favicon.ico" />
      </Head>
      <body className="bg-white antialiased dark:bg-[#181A1D]">
        <GoogleTageManagerBodyScript />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
