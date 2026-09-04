import { useEffect, useRef } from 'react'
import clsx from 'clsx'

/**
 * Looping screen-recording embed for docs pages.
 *
 * Recordings load lazily and play only while on screen: `preload="metadata"`
 * avoids buffering full files up front, and an IntersectionObserver starts
 * playback when the video scrolls into view and pauses it when it leaves.
 * Controls stay visible so the loop can be paused (WCAG 2.2.2), and autoplay
 * is skipped entirely for users who prefer reduced motion.
 *
 * Usage:
 * <Video src="/docs-static/img/manage/example.mp4" label="What the recording shows" />
 */
export function Video({ src, label, className, ...props }) {
  const ref = useRef(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let observer = null

    const observe = () => {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {})
          } else {
            video.pause()
          }
        },
        { threshold: 0.25 }
      )
      observer.observe(video)
    }

    // React to the OS setting changing while the page is open.
    const handleMotionChange = () => {
      if (reducedMotion.matches) {
        observer?.disconnect()
        observer = null
        video.pause()
      } else if (!observer) {
        observe()
      }
    }

    if (!reducedMotion.matches) observe()
    reducedMotion.addEventListener('change', handleMotionChange)

    return () => {
      reducedMotion.removeEventListener('change', handleMotionChange)
      observer?.disconnect()
    }
  }, [])

  return (
    <video
      ref={ref}
      src={src}
      loop
      muted
      playsInline
      controls
      preload="metadata"
      aria-label={label}
      className={clsx('imagewrapper-big', className)}
      {...props}
    />
  )
}
