import { forwardRef } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import { motion } from 'framer-motion'

import { Button } from '@/components/Button'
import { Logo } from '@/components/Logo'
import {
  MobileNavigation,
  useIsInsideMobileNavigation,
} from '@/components/MobileNavigation'
import { useMobileNavigationStore } from '@/components/MobileNavigation'
import { ModeToggle } from '@/components/ModeToggle'
import { MobileSearch, Search } from '@/components/Search'
import { useAnnouncements } from '@/components/announcement-banner/AnnouncementBannerProvider'

function TopLevelNavItem({ href, children }) {
  return (
    <li className="block text-[12px] lg:text-[13.5px] m-0 p-0 leading-none">
      <Link
        href={href}
        className="px-2 lg:px-3 py-1 lg:py-2 opacity-60 hover:opacity-100 hover:bg-zinc-900/5 dark:hover:bg-neutral-900/60 hover:border-zinc-900/10 dark:hover:border-neutral-800 border border-transparent rounded-md leading-none transition-all duration-200 text-zinc-900 dark:text-white inline-flex items-center"
      >
        {children}
      </Link>
    </li>
  )
}

export const Header = forwardRef(function Header({ className }, ref) {
  let { isOpen: mobileNavIsOpen } = useMobileNavigationStore()
  let isInsideMobileNavigation = useIsInsideMobileNavigation()
  let { bannerHeight } = useAnnouncements()

  return (
    <motion.div
      ref={ref}
        className={clsx(
          className,
          'fixed inset-x-0 top-0 z-40 flex items-center justify-between gap-3 px-5 transition h-[64px] lg:left-72 lg:z-50 lg:px-8 xl:left-80 min-h-[64px] lg:pointer-events-auto',
          !isInsideMobileNavigation &&
            'backdrop-blur-lg bg-white/70 dark:bg-[#181A1D]/95 lg:left-72 xl:left-80',
          isInsideMobileNavigation &&
            'bg-white/70 dark:bg-[#181A1D]/95 backdrop-blur-lg'
        )}
      style={{
        top: bannerHeight,
      }}
    >
      <div
        className={clsx(
          'absolute inset-x-0 top-full h-px transition border-b border-transparent',
          !isInsideMobileNavigation && 'border-zinc-900/10 dark:border-neutral-700/50'
        )}
      />
      <Search />
      <div className="flex items-center gap-2 lg:hidden">
        <MobileNavigation />
        <Link href="/" aria-label="Home">
          <Logo className="h-6" />
        </Link>
      </div>
      <div className="flex items-center gap-3 xl:gap-2">
        <nav className="hidden md:block">
          <ul role="list" className="flex items-center gap-3 xl:gap-2 m-0 p-0 list-none">
            <TopLevelNavItem href="https://netbird.io/">Home</TopLevelNavItem>
            <TopLevelNavItem href="/">Docs</TopLevelNavItem>
            <TopLevelNavItem href="/api">API</TopLevelNavItem>
            <TopLevelNavItem href="https://netbird.io/knowledge-hub/">Learn</TopLevelNavItem>
            <TopLevelNavItem href="https://github.com/netbirdio/netbird">Github</TopLevelNavItem>
            <TopLevelNavItem href="/slack-url">Support</TopLevelNavItem>
          </ul>
        </nav>
        <div className="hidden md:block md:h-5 md:w-px md:bg-zinc-900/10 md:dark:bg-neutral-500/20" />
        <div className="flex gap-2">
          <MobileSearch />
          <ModeToggle />
        </div>
        <div className="hidden min-[416px]:contents">
          <Button href="https://app.netbird.io/" target="_blank" className="!py-1.5 !px-3 text-xs">Try NetBird</Button>
        </div>
      </div>
    </motion.div>
  )
})
