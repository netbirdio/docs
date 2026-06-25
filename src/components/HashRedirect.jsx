import { useEffect } from 'react'
import { useRouter } from 'next/router'

/**
 * Client-side redirect for fragment links to sections that have moved to other
 * pages. `next.config` redirects can't act on the URL hash (it never reaches the
 * server), so this catches old deep links like
 * `/selfhosted/troubleshooting#debugging-turn-connections` on mount and forwards
 * them to the new location.
 *
 * @param {Record<string, string>} map - old anchor id -> new path (optionally with #anchor)
 */
export function HashRedirect({ map = {} }) {
  const router = useRouter()
  useEffect(() => {
    const id = window.location.hash.replace(/^#/, '')
    if (id && map[id]) {
      router.replace(map[id])
    }
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}
