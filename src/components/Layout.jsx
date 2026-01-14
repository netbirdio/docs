import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import clsx from 'clsx'

import { Logo } from '@/components/Logo'
import { Prose } from '@/components/Prose'
import {HeroPattern} from "@/components/HeroPattern";
import {NavigationDocs} from "@/components/NavigationDocs";
import {Header} from "@/components/Header";
import {NavigationAPI} from "@/components/NavigationAPI";
import {motion} from "framer-motion";
import {Footer} from "@/components/Footer";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import {toast} from "react-toastify";
import {AnnouncementBanner} from "@/components/announcement-banner/AnnouncementBanner";
import {useAnnouncements} from "@/components/announcement-banner/AnnouncementBannerProvider";

const navigation = [
  {
    title: 'Introduction',
    links: [
      { title: 'Getting started', href: '/' },
      { title: 'Installation', href: '/installation' },
    ],
  },
  {
    title: 'Core concepts',
    links: [
      { title: 'Understanding caching', href: '/understanding-caching' },
      {
        title: 'Predicting user behavior',
        href: '/predicting-user-behavior',
      },
      { title: 'Basics of time-travel', href: '/basics-of-time-travel' },
      {
        title: 'Introduction to string theory',
        href: '/introduction-to-string-theory',
      },
      { title: 'The butterfly effect', href: '/the-butterfly-effect' },
    ],
  },
  {
    title: 'Advanced guides',
    links: [
      { title: 'Writing plugins', href: '/writing-plugins' },
      { title: 'Neuralink integration', href: '/neuralink-integration' },
      { title: 'Temporal paradoxes', href: '/temporal-paradoxes' },
      { title: 'Testing', href: '/testing' },
      { title: 'Compile-time caching', href: '/compile-time-caching' },
      {
        title: 'Predictive data generation',
        href: '/predictive-data-generation',
      },
    ],
  },
  {
    title: 'API reference',
    links: [
      { title: 'CacheAdvance.predict()', href: '/cacheadvance-predict' },
      { title: 'CacheAdvance.flush()', href: '/cacheadvance-flush' },
      { title: 'CacheAdvance.revert()', href: '/cacheadvance-revert' },
      { title: 'CacheAdvance.regret()', href: '/cacheadvance-regret' },
    ],
  },
  {
    title: 'Contributing',
    links: [
      { title: 'How to contribute', href: '/how-to-contribute' },
      { title: 'Architecture guide', href: '/architecture-guide' },
      { title: 'Design principles', href: '/design-principles' },
    ],
  },
]

function GitHubIcon(props) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" {...props}>
      <path d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" />
    </svg>
  )
}

function useTableOfContents(tableOfContents) {
  let [currentSection, setCurrentSection] = useState(tableOfContents[0]?.id)
  let [showJumpToTop, setShowJumpToTop] = useState(false)

  let getHeadings = useCallback((tableOfContents) => {
    return tableOfContents
      .flatMap((node) => [node.id, ...node.children.map((child) => child.id)])
      .map((id) => {
        let el = document.getElementById(id)
        if (!el) return

        let style = window.getComputedStyle(el)
        let scrollMt = parseFloat(style.scrollMarginTop)

        let top = window.scrollY + el.getBoundingClientRect().top - scrollMt
        return { id, top }
      })
  }, [])

  useEffect(() => {
    if (tableOfContents.length === 0) return
    let headings = getHeadings(tableOfContents)
    function onScroll() {
      let scrollTop = window.scrollY
      setShowJumpToTop(scrollTop > 400)
      
      let top = scrollTop + 10;
      let current = headings[0]?.id
      for (let heading of headings) {
        if (top >= heading?.top) {
          current = heading?.id
        } else {
          break
        }
      }
      setCurrentSection(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [getHeadings, tableOfContents])

  return { currentSection, showJumpToTop }
}

export function Layout({ children, title, tableOfContents }) {
  let router = useRouter()
  let isHomePage = router.pathname === '/'
  let allLinks = navigation.flatMap((section) => section.links)
  let linkIndex = allLinks.findIndex((link) => link.href === router.pathname)
  let previousPage = allLinks[linkIndex - 1]
  let nextPage = allLinks[linkIndex + 1]
  let section = navigation.find((section) =>
    section.links.find((link) => link.href === router.pathname)
  )

  const buttonStyle = {
    display: 'inline',
    minWidth: '90px',
    textAlign: 'left',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const iconStyle = {
    fontSize: '18px',
  };

  const copyToClipboard = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL);
    toast.info('Page URL copied to clipboard!', {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  let { currentSection, showJumpToTop } = useTableOfContents(tableOfContents)

  function isActive(section) {
    if (section.id === currentSection) {
      return true
    }
    if (!section.children) {
      return false
    }
    return section.children.findIndex(isActive) > -1
  }

  let { bannerHeight } = useAnnouncements()

  return (
    <>
      <AnnouncementBanner />
      <HeroPattern/>
      <div
        className="relative mx-auto flex max-w-8xl sm:px-2 lg:px-8 xl:px-12 lg:ml-72 xl:ml-80"
        style={{ paddingTop: bannerHeight }}
      >
        <header
            // layoutScroll
            className="contents lg:pointer-events-none lg:fixed lg:inset-0 lg:z-40 lg:flex"
            style={{ top: bannerHeight }}
        >
          <div className="contents lg:pointer-events-auto lg:block lg:w-72 lg:overflow-y-auto lg:border-r lg:border-zinc-900/10 lg:dark:border-neutral-700/50 lg:px-6 lg:pb-8 lg:pt-4 lg:bg-white/70 lg:dark:bg-[#181A1D]/95 lg:backdrop-blur-lg xl:w-80 lg:overflow-x-visible sidebar-scroll">
            <div className="hidden lg:flex">
              <Link href="/" aria-label="Home">
                <Logo className="h-6" />
              </Link>
            </div>
            {router.route.startsWith("/ipa") ? <NavigationAPI className="hidden lg:mt-10 lg:block" tableOfContents={tableOfContents} /> : <NavigationDocs className="hidden lg:mt-10 lg:block" />}
          </div>
          <Header />
        </header>
        <div className="min-w-0 max-w-2xl flex-auto px-4 py-16 lg:max-w-none lg:pl-8 lg:pr-0 xl:px-5">
          <main className="py-16">
            <Prose as="article">{children}</Prose>
          </main>
          <Footer />
        </div>
        {!router.route.startsWith("/ipa/resources") && <div
            className="hidden xl:sticky xl:top-[4.5rem] xl:-mr-6 xl:block xl:h-[calc(100vh-4.5rem)] xl:flex-none xl:overflow-y-auto xl:py-16 xl:pr-6 pl-12"
            style={{ top: `calc(${bannerHeight}px + 4.5rem)` }}
        >
          <ol role="list" className="mt-4 space-y-3 text-sm mb-8">
            <li key="copy-link">
              <button
                  style={buttonStyle}
                  onClick={copyToClipboard}
                  className="dark:hover:text-slate-300 dark:text-slate-400 text-slate-500 hover:text-slate-700 font-normal'"
              >
                <FontAwesomeIcon icon={faPaperclip} style={iconStyle} className="icon pr-1" />
                <span>Copy link</span>
              </button>
            </li>
            <li key="edit-on-github">
              <Link
                  href={"https://github.com/netbirdio/docs/tree/main/src/pages" + router.pathname + ".mdx"}
                  className="dark:hover:text-slate-300 dark:text-slate-400 text-slate-500 hover:text-slate-700 font-normal'"
                  style={{display: "flex", alignItems: 'center'}}
              >
                <FontAwesomeIcon icon={faGithub} style={iconStyle} className="icon pr-1" />
                <span>Edit on Github</span>
              </Link>
            </li>
          </ol>
          <nav aria-labelledby="on-this-page-title" className="w-80">
            {tableOfContents.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2
                    id="on-this-page-title"
                    className="font-display text-sm font-medium text-slate-900 dark:text-white"
                  >
                    On this page
                  </h2>
                  {showJumpToTop && (
                    <button
                      onClick={scrollToTop}
                      className="text-xs text-slate-500 hover:text-orange-500 dark:text-slate-400 dark:hover:text-orange-400 transition-colors flex items-center gap-1"
                      aria-label="Jump to top"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      Top
                    </button>
                  )}
                </div>
                <ol role="list" className="mt-4 space-y-3 text-sm">
                  {tableOfContents.map((section) => (
                    <li key={section.id}>
                      <h3>
                        <Link
                          href={`#${section.id}`}
                          className={clsx(
                            isActive(section)
                              ? 'text-orange-500'
                              : 'font-normal text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                          )}
                        >
                          {section.title}
                        </Link>
                      </h3>
                      {section.children.length > 0 && (
                        <ol
                          role="list"
                          className="mt-2 space-y-3 pl-5 text-slate-500 dark:text-slate-400"
                        >
                          {section.children.map((subSection) => (
                            <li key={subSection.id}>
                              <Link
                                href={`#${subSection.id}`}
                                className={
                                  isActive(subSection)
                                    ? 'text-orange-500'
                                    : 'hover:text-slate-600 dark:hover:text-slate-300'
                                }
                              >
                                {subSection.title}
                              </Link>
                            </li>
                          ))}
                        </ol>
                      )}
                    </li>
                  ))}
                </ol>
              </>
            )}
          </nav>
        </div>}
      </div>
    </>
  )
}
