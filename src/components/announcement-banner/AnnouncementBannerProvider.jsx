import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { useLocalStorage } from '@/hooks/useLocalStorage'

const BANNER_ENABLED = true

export const announcement = {
  tag: 'New',
  text: 'Simplified IdP Integration',
  link: '/selfhosted/identity-providers',
  linkText: 'Learn More',
  linkAlt: 'Learn more about the embedded Identity Provider powered by DEX for self-hosted installations',
  isExternal: false,
  closeable: true,
}

const AnnouncementContext = createContext({
  close: () => {},
  isVisible: false,
  bannerHeight: 0,
  reportHeight: () => {},
})

export function AnnouncementBannerProvider({ children }) {
  let [mounted, setMounted] = useState(false)
  let [closedAnnouncement, setClosedAnnouncement] = useLocalStorage(
    'netbird-announcement',
    undefined
  )
  let announcementId = announcement.text
  let [bannerHeight, setBannerHeight] = useState(0)

  let close = () => {
    setClosedAnnouncement(announcementId)
  }

  let isActive = useMemo(() => {
    if (!mounted) return false
    if (!BANNER_ENABLED) return false
    return closedAnnouncement !== announcementId
  }, [announcementId, closedAnnouncement, mounted])

  let isVisible = isActive // Always visible when active, regardless of scroll

  let reportHeight = useCallback((height) => {
    setBannerHeight(height)
  }, [])

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Removed scroll-based hiding to make banner always sticky
  // useEffect(() => {
  //   if (typeof window === 'undefined') {
  //     return
  //   }

  //   function handleScroll() {
  //     setIsHiddenByScroll(window.scrollY > 30)
  //   }

  //   handleScroll()
  //   window.addEventListener('scroll', handleScroll, { passive: true })
  //   return () => window.removeEventListener('scroll', handleScroll)
  // }, [])

  useEffect(() => {
    if (!isVisible && bannerHeight !== 0) {
      setBannerHeight(0)
    }
  }, [bannerHeight, isVisible])

  return (
    <AnnouncementContext.Provider
      value={{ close, isVisible, bannerHeight, reportHeight }}
    >
      {children}
    </AnnouncementContext.Provider>
  )
}

export function useAnnouncements() {
  return useContext(AnnouncementContext)
}
