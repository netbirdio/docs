import { useLayoutEffect, useRef } from 'react'
import Link from 'next/link'

import { useAnnouncements } from '@/components/announcement-banner/AnnouncementBannerProvider'
import { useCustomQueryURL } from '@/hooks/useCustomQueryURL'

function ArrowRightIcon(props) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
      <path
        d="M4.5 2.5l6 5.5-6 5.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function CloseIcon(props) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
      <path
        d="M4 4l8 8M12 4l-8 8"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function AnnouncementItem({ announcement, onClose }) {
  const announcementLink = useCustomQueryURL(announcement.link || '')
  const bannerRef = useRef(null)
  const { setBannerHeight } = useAnnouncements()

  useLayoutEffect(() => {
    const banner = bannerRef.current
    // Text wrapping and viewport changes can make the banner taller on phones.
    const updateHeight = () => setBannerHeight(banner.getBoundingClientRect().height)
    updateHeight()
    const observer = new ResizeObserver(updateHeight)
    observer.observe(banner)

    return () => {
      observer.disconnect()
      setBannerHeight(0)
    }
  }, [setBannerHeight])

  return (
    <div
      id="announcement-banner"
      ref={bannerRef}
      className="fixed inset-x-0 top-0 z-50 flex w-full items-center justify-center border-b border-zinc-800 bg-netbird/95 px-4 py-1.5 text-[11px] font-medium text-black shadow-sm backdrop-blur"
    >
      <div className="pr-8 leading-relaxed md:flex md:items-center md:gap-1 md:leading-snug">
        {announcement.tag ? (
          <span className="mr-2 inline-block whitespace-nowrap rounded-md bg-black/70 px-2 py-1 align-middle text-[9px] font-semibold uppercase tracking-[0.18em] text-white">
            {announcement.tag}
          </span>
        ) : null}
        <span className="mr-2 text-[12px] md:text-[13px]">
          {announcement.text}
        </span>
        {announcement.link ? (
          <Link
            href={announcementLink}
            target={announcement.isExternal ? '_blank' : undefined}
            className="inline-flex items-center gap-1 text-[12px] text-black underline underline-offset-4"
            title={announcement.linkAlt}
          >
            {announcement.linkText}
            <ArrowRightIcon className="h-3 w-3" />
          </Link>
        ) : null}
      </div>
      {announcement.closeable ? (
        <button
          type="button"
          onClick={() => onClose(announcement.hash)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-black transition hover:bg-black/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          aria-label="Dismiss announcement"
        >
          <CloseIcon className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </div>
  )
}

export function AnnouncementBanner() {
  const { announcements, closeAnnouncement } = useAnnouncements()

  if (!announcements) {
    return null
  }

  const openAnnouncements = announcements.filter((a) => a.isOpen)

  if (openAnnouncements.length === 0) {
    return null
  }

  // Show the first open announcement
  const announcement = openAnnouncements[0]

  return (
    <AnnouncementItem
      announcement={announcement}
      onClose={closeAnnouncement}
    />
  )
}
