import Link from 'next/link'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'

import { GridPattern } from '@/components/GridPattern'
import { Heading } from '@/components/Heading'

// Monochrome inline SVG icons. They use `currentColor` so they inherit the
// card's text color and work in both light and dark mode. These are recreated
// here on purpose — we do not reference the bundled asset IDs from the design
// mock, which would not resolve in this project.
const icons = {
  laptop: (
    <>
      <rect x="4" y="5" width="16" height="11" rx="1.5" />
      <path d="M2 20h20" />
    </>
  ),
  cloud: <path d="M7 18a4 4 0 0 1 0-8 5 5 0 0 1 9.6-1.5A3.5 3.5 0 0 1 17 18H7Z" />,
  server: (
    <>
      <rect x="4" y="4" width="16" height="6" rx="1.5" />
      <rect x="4" y="14" width="16" height="6" rx="1.5" />
      <path d="M8 7h.01M8 17h.01" />
    </>
  ),
  firewall: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <path d="M3 10h18M3 14h18M12 5v5M8 10v4M16 10v4M12 14v5" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
    </>
  ),
  shield: <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" />,
  terminal: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M7 10l3 2-3 2M13 15h4" />
    </>
  ),
  windows: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="0.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="0.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="0.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="0.5" />
    </>
  ),
  android: (
    <>
      <path d="M6 12a6 6 0 0 1 12 0v6a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-6Z" />
      <path d="M8.5 6.5 7.2 4.6M15.5 6.5l1.3-1.9" />
      <path d="M9.5 11.5h.01M14.5 11.5h.01" />
    </>
  ),
  mobile: (
    <>
      <rect x="7" y="3" width="10" height="18" rx="2" />
      <path d="M11 18h2" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
      <path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" />
    </>
  ),
}

function TileIcon({ name }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      {icons[name] ?? icons.gear}
    </svg>
  )
}

function TilePattern({ mouseX, mouseY }) {
  let maskImage = useMotionTemplate`radial-gradient(180px at ${mouseX}px ${mouseY}px, white, transparent)`
  let style = { maskImage, WebkitMaskImage: maskImage }

  return (
    <div className="pointer-events-none">
      <div className="absolute inset-0 rounded-2xl transition duration-300 [mask-image:linear-gradient(white,transparent)] group-hover:opacity-50">
        <GridPattern
          width={72}
          height={56}
          x="50%"
          className="absolute inset-x-0 inset-y-[-30%] h-[160%] w-full skew-y-[-18deg] fill-black/[0.02] stroke-black/5 dark:fill-white/1 dark:stroke-white/2.5"
        />
      </div>
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#FFAC1C] to-[#F28C28] opacity-0 transition duration-300 group-hover:opacity-30 dark:group-hover:opacity-60 dark:from-[#F28C28]/30 dark:to-[#FF7518]/30"
        style={style}
      />
    </div>
  )
}

function TroubleshootingCard({ item }) {
  let mouseX = useMotionValue(0)
  let mouseY = useMotionValue(0)

  function onMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  return (
    // Plain container <div> — NOT an <a>. The title link and each chip are the
    // only interactive elements, which keeps the markup free of nested
    // interactive (link-inside-link) HTML. A card without a dedicated landing
    // page (e.g. NetBird Cloud) simply renders its title as plain text; its
    // chips still link to the relevant docs.
    <div
      onMouseMove={onMouseMove}
      className="group relative flex flex-col rounded-2xl bg-zinc-50 transition-shadow hover:shadow-md hover:shadow-zinc-900/5 dark:bg-white/2.5 dark:hover:shadow-black/5"
    >
      <TilePattern mouseX={mouseX} mouseY={mouseY} />
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-zinc-900/7.5 group-hover:ring-zinc-900/10 dark:ring-white/10 dark:group-hover:ring-white/20" />
      <div className="relative flex flex-1 flex-col p-4">
        <div className="flex items-center gap-x-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-zinc-700 ring-1 ring-inset ring-zinc-900/7.5 dark:bg-white/5 dark:text-zinc-300 dark:ring-white/10">
            <TileIcon name={item.icon} />
          </span>
          <h3 className="text-sm font-semibold leading-7 text-zinc-900 dark:text-white">
            {item.href ? (
              <Link
                href={item.href}
                className="transition hover:text-[#F28C28] dark:hover:text-[#FFAC1C]"
              >
                {item.title}
              </Link>
            ) : (
              item.title
            )}
          </h3>
        </div>

        {item.description && (
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {item.description}
          </p>
        )}

        {item.chips && item.chips.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {item.chips.map((chip) => (
              <Link
                key={chip.href}
                href={chip.href}
                className="inline-flex items-center rounded-full bg-zinc-900/5 px-2.5 py-1 text-xs font-medium text-zinc-700 ring-1 ring-inset ring-zinc-900/10 transition hover:bg-zinc-900/10 hover:text-zinc-900 dark:bg-white/5 dark:text-zinc-300 dark:ring-white/10 dark:hover:bg-white/10 dark:hover:text-white"
              >
                {chip.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Troubleshooting hub grid: richer icon + chip cards.
 *
 * @param {string} [title] - Section heading (e.g. "Find your issue by area")
 * @param {string} [id] - Optional id for the heading anchor
 * @param {string} [description] - Optional description below the title
 * @param {Array<{
 *   title: string,
 *   href?: string,                         // title links here; omit for a "coming soon" card
 *   icon: string,                          // key into the inline icon set
 *   description?: string,
 *   chips?: Array<{label: string, href: string}>
 * }>} items
 */
export function TroubleshootingTiles({ title, id, description, items }) {
  const hasHeader = title || description

  return (
    <div className="my-16 xl:max-w-none">
      {title && (
        <Heading level={2} id={id} anchor={!!id}>
          {title}
        </Heading>
      )}
      {description && (
        <div
          className={`text-sm text-zinc-600 dark:text-zinc-400 ${title ? 'mt-4' : ''}`}
        >
          {description}
        </div>
      )}
      <div
        className={`not-prose grid grid-cols-1 gap-8 sm:grid-cols-2 ${
          hasHeader
            ? 'mt-4 border-t border-zinc-900/5 pt-10 dark:border-white/5'
            : ''
        }`}
      >
        {items.map((item) => (
          <TroubleshootingCard key={item.title} item={item} />
        ))}
      </div>
    </div>
  )
}
