import { useMemo } from 'react'
import { useRouter } from 'next/router'

export function useCustomQueryURL(target = '') {
  let router = useRouter()

  return useMemo(() => {
    if (!target) {
      return ''
    }
    if (target.startsWith('http')) {
      return target
    }

    let asPath = router?.asPath ?? ''
    let queryIndex = asPath.indexOf('?')

    if (queryIndex === -1) {
      return target
    }

    let currentQuery = asPath.slice(queryIndex + 1)
    if (!currentQuery) {
      return target
    }

    let separator = target.includes('?') ? '&' : '?'
    return `${target}${separator}${currentQuery}`
  }, [router?.asPath, target])
}
