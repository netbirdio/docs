import clsx from 'clsx'

/**
 * Extracts YouTube video ID from various YouTube URL formats
 */
function extractYouTubeId(url) {
  if (!url) return null

  // If it's already just an ID, return it
  if (!url.includes('youtube.com') && !url.includes('youtu.be') && !url.includes('/')) {
    return url
  }

  // Handle youtu.be short links
  if (url.includes('youtu.be/')) {
    const match = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/)
    return match ? match[1] : null
  }

  // Handle youtube.com/watch?v=...
  if (url.includes('youtube.com/watch')) {
    const match = url.match(/[?&]v=([a-zA-Z0-9_-]+)/)
    return match ? match[1] : null
  }

  // Handle youtube.com/embed/...
  if (url.includes('youtube.com/embed/')) {
    const match = url.match(/embed\/([a-zA-Z0-9_-]+)/)
    return match ? match[1] : null
  }

  return null
}

/**
 * YouTube video embed component
 * 
 * Usage:
 * <YouTube videoId="CFa7SY4Up9k" />
 * <YouTube url="https://www.youtube.com/watch?v=CFa7SY4Up9k" />
 * <YouTube videoId="CFa7SY4Up9k" title="Video Title" />
 * <YouTube videoId="CFa7SY4Up9k" start={175} />
 * <YouTube videoId="CFa7SY4Up9k" color="white" modestbranding={1} />
 */
export function YouTube({ 
  videoId, 
  url, 
  title, 
  start, 
  color = 'white', // 'red' | 'white' - controls progress bar color (default: white)
  modestbranding = 1, // 0 | 1 - reduces YouTube branding (1 = minimal, default: 1 = minimal)
  controls, // 0 | 1 | 2 - show/hide player controls (0 = hide, 1 = show, 2 = delayed)
  rel = 1, // 0 | 1 - show related videos from same channel (0 = hide, 1 = show, default: 1 = show)
  className, 
  ...props 
}) {
  // Extract video ID from URL if provided
  const id = videoId || extractYouTubeId(url)

  if (!id) {
    console.warn('YouTube component: No valid video ID or URL provided')
    return null
  }

  // Extract start time from URL if present
  let startTime = start
  if (!startTime && url) {
    const startMatch = url.match(/[?&]start=(\d+)/)
    if (startMatch) {
      startTime = parseInt(startMatch[1], 10)
    }
  }

  // Build embed URL with parameters
  let embedUrl = `https://www.youtube.com/embed/${id}`
  const params = new URLSearchParams()
  
  if (startTime) {
    params.append('start', startTime.toString())
  }
  
  // Add color parameter - YouTube defaults to 'red', so we need to set 'white' explicitly
  if (color === 'white') {
    params.append('color', 'white')
  }
  if (modestbranding === 1) {
    params.append('modestbranding', '1')
  }
  if (controls !== undefined && controls !== 1) {
    params.append('controls', controls.toString())
  }
  // Only add rel parameter if explicitly set to 0 to hide related videos
  // YouTube's default is 1 (show), so we don't need to add it when rel === 1
  if (rel === 0) {
    params.append('rel', '0')
  }
  
  const queryString = params.toString()
  if (queryString) {
    embedUrl += `?${queryString}`
  }

  return (
    <div
      className={clsx(
        'relative w-full overflow-hidden my-6',
        'ml-[10px] mr-auto',
        'max-w-[40rem] lg:max-w-[50rem]',
        className
      )}
      style={{ aspectRatio: '16 / 9' }}
      {...props}
    >
      <iframe
        src={embedUrl}
        title={title || 'YouTube video player'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full rounded-lg border-0"
      />
    </div>
  )
}
