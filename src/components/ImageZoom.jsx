import { useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'

export function ImageZoom() {
  const [zoomedImage, setZoomedImage] = useState(null)
  const [isClosing, setIsClosing] = useState(false)

  const closeZoom = useCallback(() => {
    setIsClosing(true)
    setTimeout(() => {
      setZoomedImage(null)
      setIsClosing(false)
    }, 200)
  }, [])

  useEffect(() => {
    const handleImageClick = (e) => {
      const target = e.target
      if (
        target.tagName === 'IMG' &&
        (target.classList.contains('imagewrapper') ||
          target.classList.contains('imagewrapper-big') ||
          target.classList.contains('imagewrapper-medium') ||
          target.closest('.imagewrapper') ||
          target.closest('.imagewrapper-big') ||
          target.closest('.imagewrapper-medium'))
      ) {
        e.preventDefault()
        setZoomedImage(target.src)
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && zoomedImage) {
        closeZoom()
      }
    }

    document.addEventListener('click', handleImageClick)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('click', handleImageClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [zoomedImage, closeZoom])

  if (!zoomedImage) return null

  return createPortal(
    <div
      className={`image-zoom-overlay ${isClosing ? 'closing' : ''}`}
      onClick={closeZoom}
      role="dialog"
      aria-modal="true"
      aria-label="Zoomed image"
    >
      <button
        className="image-zoom-close"
        onClick={closeZoom}
        aria-label="Close zoomed image"
      >
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
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <img
        src={zoomedImage}
        alt="Zoomed view"
        className={`image-zoom-content ${isClosing ? 'closing' : ''}`}
        onClick={closeZoom}
      />
    </div>,
    document.body
  )
}