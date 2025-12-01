import { useCallback, useEffect, useState } from 'react'

export function useLocalStorage(key, initialValue) {
  let [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      let item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      let item = window.localStorage.getItem(key)
      setStoredValue(item ? JSON.parse(item) : initialValue)
    } catch {
      setStoredValue(initialValue)
    }
  }, [initialValue, key])

  let setValue = useCallback(
    (value) => {
      setStoredValue((previousValue) => {
        let valueToStore =
          typeof value === 'function' ? value(previousValue) : value

        if (typeof window !== 'undefined') {
          if (valueToStore === undefined) {
            window.localStorage.removeItem(key)
          } else {
            window.localStorage.setItem(key, JSON.stringify(valueToStore))
          }
        }

        return valueToStore
      })
    },
    [key]
  )

  return [storedValue, setValue]
}
