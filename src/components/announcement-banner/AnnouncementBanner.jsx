import { useEffect, useRef } from 'react'
import clsx from 'clsx'
import Link from 'next/link'

import {
  announcement,
  useAnnouncements,
} from '@/components/announcement-banner/AnnouncementBannerProvider'
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

export function AnnouncementBanner() {
  let { isVisible, close, reportHeight } = useAnnouncements()
  let announcementLink = useCustomQueryURL(announcement.link || '')
  let bannerRef = useRef(null)

  useEffect(() => {
    if (!isVisible) {
      reportHeight(0)
      return
    }

    function updateHeight() {
      if (bannerRef.current) {
        reportHeight(bannerRef.current.offsetHeight || 0)
      } else {
        reportHeight(0)
      }
    }

    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => {
      window.removeEventListener('resize', updateHeight)
    }
  }, [isVisible, reportHeight])

  if (!isVisible) {
    return null
  }

  return (
    <div
      ref={bannerRef}
      id="announcement-banner"
      className={clsx(
        'sticky top-0 z-50 flex w-full items-center justify-center border-b border-zinc-800 bg-netbird/95 px-4 py-1.5 text-[11px] font-medium text-black shadow-sm backdrop-blur'
      )}
    >
      <div className="flex flex-col items-start gap-1 pr-8 leading-snug md:flex-row md:items-center">
        {announcement.tag ? (
          <div className="mr-2 inline rounded-md bg-black/70 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-white">
            {announcement.tag}
          </div>
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
          onClick={close}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-black transition hover:bg-black/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          aria-label="Dismiss announcement"
        >
          <CloseIcon className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </div>
  )
}
