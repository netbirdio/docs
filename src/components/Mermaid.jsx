import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

let mermaidPromise

function loadMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then((m) => m.default)
  }
  return mermaidPromise
}

function isDarkMode() {
  return (
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('dark')
  )
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

export function Mermaid({ chart, alt = 'Diagram' }) {
  let reactId = useId().replace(/[^a-zA-Z0-9]/g, '')
  let renderCount = useRef(0)
  let [svg, setSvg] = useState('')
  let [error, setError] = useState(null)
  let [zoomed, setZoomed] = useState(false)
  let [closing, setClosing] = useState(false)

  useEffect(() => {
    let cancelled = false
    let lastTheme = null

    async function render() {
      let dark = isDarkMode()
      // Skip redundant re-renders when an unrelated class toggles on <html>.
      if (lastTheme === dark && svg) return
      lastTheme = dark

      try {
        let mermaid = await loadMermaid()
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'loose',
          theme: dark ? 'dark' : 'default',
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        })
        let id = `mermaid-${reactId}-${renderCount.current++}`
        let { svg: out } = await mermaid.render(id, chart)
        if (!cancelled) {
          setError(null)
          setSvg(out)
        }
      } catch (e) {
        if (!cancelled) setError(e?.message || String(e))
      }
    }

    render()

    // Re-render when the user toggles light/dark so the diagram matches the theme.
    let observer = new MutationObserver(() => render())
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => {
      cancelled = true
      observer.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chart])

  let close = useCallback(() => {
    setClosing(true)
    setTimeout(() => {
      setZoomed(false)
      setClosing(false)
    }, 200)
  }, [])

  useEffect(() => {
    if (!zoomed) return
    let onKey = (e) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [zoomed, close])

  if (error) {
    return (
      <pre className="my-6 overflow-x-auto rounded border border-red-500/30 bg-red-50/50 p-4 text-xs text-red-700 dark:bg-red-500/5 dark:text-red-300">
        {`Mermaid render error: ${error}\n\n${chart}`}
      </pre>
    )
  }

  if (!svg) {
    return <div className="not-prose my-6" aria-hidden="true" />
  }

  // Mermaid caps the SVG with `max-width: <px>`; strip it for the zoom copy so the
  // diagram can scale up to fill the lightbox instead of staying at natural size.
  let zoomSvg = svg.replace(/max-width:\s*[\d.]+px;?/g, '')

  return (
    <>
      <div
        className="not-prose my-6 flex justify-center overflow-x-auto [&_svg]:cursor-zoom-in"
        role="button"
        tabIndex={0}
        aria-label={`${alt} — activate to zoom`}
        onClick={() => setZoomed(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setZoomed(true)
          }
        }}
        // svg is produced by mermaid from trusted, in-repo diagram source
        dangerouslySetInnerHTML={{ __html: svg }}
      />

      {zoomed &&
        createPortal(
          <div
            className={`image-zoom-overlay ${closing ? 'closing' : ''}`}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={`Zoomed ${alt}`}
          >
            <button
              className="image-zoom-close"
              onClick={close}
              aria-label="Close zoomed diagram"
            >
              <CloseIcon />
            </button>
            <div
              className={`image-zoom-content ${
                closing ? 'closing' : ''
              } flex items-center justify-center bg-white dark:bg-zinc-900 [&_svg]:!h-auto [&_svg]:!max-h-full [&_svg]:!w-auto [&_svg]:!max-w-full`}
              style={{
                width: '90vw',
                height: '86vh',
                maxWidth: '90vw',
                maxHeight: '86vh',
                padding: '1rem',
                cursor: 'zoom-out',
              }}
              onClick={close}
              dangerouslySetInnerHTML={{ __html: zoomSvg }}
            />
          </div>,
          document.body
        )}
    </>
  )
}
