import md5 from 'crypto-js/md5'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

const ANNOUNCEMENTS_URL =
  'https://raw.githubusercontent.com/netbirdio/dashboard/main/announcements.json'
const STORAGE_KEY = 'netbird-announcements'
const CACHE_DURATION_MS = 30 * 60 * 1000
const BANNER_HEIGHT = 33

const AnnouncementContext = createContext({
  bannerHeight: 0,
  announcements: undefined,
  closeAnnouncement: () => {},
})

const getAnnouncements = async () => {
  try {
    let stored = null
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      stored = data ? JSON.parse(data) : null
    } catch {}

    const now = Date.now()

    let raw

    if (stored && now - stored.timestamp < CACHE_DURATION_MS) {
      raw = stored.announcements
    } else {
      const response = await fetch(ANNOUNCEMENTS_URL)
      if (!response.ok) return []

      raw = await response.json()
    }

    // Filter announcements - show all for docs site (not cloud-specific)
    const filtered = raw.filter((a) => !a.isCloudOnly)
    const hashes = new Set(filtered.map((a) => md5(a.text).toString()))
    const closed = (stored?.closedAnnouncements ?? []).filter((h) =>
      hashes.has(h)
    )

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          timestamp: now,
          announcements: raw,
          closedAnnouncements: closed,
        })
      )
    } catch {}

    return filtered.map((a) => {
      const hash = md5(a.text).toString()
      return { ...a, hash, isOpen: !closed.includes(hash) }
    })
  } catch {
    return []
  }
}

const saveAnnouncements = (closedAnnouncements) => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    const stored = data ? JSON.parse(data) : null
    if (stored) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...stored, closedAnnouncements })
      )
    }
  } catch {}
}

export function AnnouncementBannerProvider({ children }) {
  const [announcements, setAnnouncements] = useState(undefined)
  const fetchingRef = useRef(false)

  useEffect(() => {
    if (announcements !== undefined || fetchingRef.current) return
    fetchingRef.current = true
    getAnnouncements()
      .then((a) => setAnnouncements(a))
      .finally(() => (fetchingRef.current = false))
  }, [announcements])

  const closeAnnouncement = useCallback(
    (hash) => {
      if (!announcements) return
      const updated = announcements.map((a) =>
        a.hash === hash ? { ...a, isOpen: false } : a
      )
      const closedAnnouncements = updated
        .filter((a) => !a.isOpen)
        .map((a) => a.hash)
      saveAnnouncements(closedAnnouncements)
      setAnnouncements(updated)
    },
    [announcements]
  )

  const bannerHeight = announcements?.some((a) => a.isOpen) ? BANNER_HEIGHT : 0

  return (
    <AnnouncementContext.Provider
      value={{
        bannerHeight,
        announcements,
        closeAnnouncement,
      }}
    >
      {children}
    </AnnouncementContext.Provider>
  )
}

export function useAnnouncements() {
  return useContext(AnnouncementContext)
}