// A horizontal "stepper" that draws the path traffic takes from one peer to a
// resource, hop by hop. Each hop is an icon card on a connecting line, with the
// last hop optionally marked as the destination. Static and SSR-friendly (no
// hooks), responsive, and horizontally scrollable on narrow screens.
//
// Monochrome inline SVG icons use `currentColor` so they inherit the card's
// text color and work in both light and dark mode, matching TroubleshootingTiles.

const icons = {
  laptop: (
    <>
      <rect x="4" y="5" width="16" height="11" rx="1.5" />
      <path d="M2 20h20" />
    </>
  ),
  router: (
    <>
      <rect x="4" y="13" width="16" height="7" rx="1.5" />
      <path d="M7.5 16.5h.01" />
      <path d="M11 16.5h5.5" />
      <path d="M12 13V9" />
      <path d="M9 9a4.2 4.2 0 0 1 6 0" />
    </>
  ),
  cloud: <path d="M7 18a4 4 0 0 1 0-8 5 5 0 0 1 9.6-1.5A3.5 3.5 0 0 1 17 18H7Z" />,
  firewall: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <path d="M3 10h18M3 14h18M9 5v5M15 5v5M6 10v4M12 10v4M18 10v4M9 14v5M15 14v5" />
    </>
  ),
  routingPeer: (
    <>
      <path d="M6 6l6 6-6 6" />
      <path d="M13 6l6 6-6 6" />
    </>
  ),
  server: (
    <>
      <rect x="4" y="4" width="16" height="6" rx="1.5" />
      <rect x="4" y="14" width="16" height="6" rx="1.5" />
      <path d="M8 7h.01M8 17h.01" />
    </>
  ),
  resource: (
    <>
      <path d="M7 5a11 11 0 0 1 0 14" />
      <path d="M11 8a6.5 6.5 0 0 1 0 8" />
      <path d="M15 10.5a2.8 2.8 0 0 1 0 3" />
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

function StepIcon({ name, className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {icons[name] ?? icons.resource}
    </svg>
  )
}

/**
 * A left-to-right path of hops, each a labelled icon card on a connecting line.
 *
 * @param {Array<{
 *   icon: string,            // key into the inline icon set
 *   title: string,
 *   label?: string,          // defaults to "Step N", or "Destination" when destination is true
 *   description?: string,    // hidden in compact mode
 *   destination?: boolean    // orange ring + orange label for the final hop
 * }>} steps
 * @param {string} [caption]  - Optional caption under the flow
 * @param {boolean} [compact] - Smaller cards, titles only (used in the recap)
 */
export function PathFlow({ steps = [], caption, compact = false }) {
  const n = steps.length
  const iconBox = compact ? 'h-11 w-11 rounded-xl' : 'h-14 w-14 rounded-2xl'
  const iconSize = compact ? 'h-5 w-5' : 'h-6 w-6'
  const minW = compact ? 'min-w-[84px]' : 'min-w-[108px]'

  return (
    <figure className="not-prose my-8">
      <div className="overflow-x-auto pb-2">
        <ol className="flex min-w-full items-start">
          {steps.map((step, i) => {
            const isDest = !!step.destination
            return (
              <li
                key={i}
                className={`relative flex flex-1 flex-col items-center px-1.5 text-center ${minW}`}
              >
                <div className="relative flex h-14 w-full items-center justify-center">
                  {i > 0 && (
                    <span
                      className="absolute left-0 top-1/2 h-px w-1/2 -translate-y-1/2 bg-netbird/40"
                      aria-hidden="true"
                    />
                  )}
                  {i < n - 1 && (
                    <span
                      className="absolute right-0 top-1/2 h-px w-1/2 -translate-y-1/2 bg-netbird/40"
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className={`relative z-10 flex items-center justify-center bg-zinc-50 text-netbird ring-1 ring-inset dark:bg-white/5 ${iconBox} ${
                      isDest
                        ? 'ring-netbird/60 dark:ring-netbird/60'
                        : 'ring-zinc-900/10 dark:ring-white/10'
                    }`}
                  >
                    <StepIcon name={step.icon} className={iconSize} />
                  </span>
                </div>

                <span
                  className={`mt-3 text-[0.65rem] font-semibold uppercase tracking-wider ${
                    isDest
                      ? 'text-netbird'
                      : 'text-zinc-400 dark:text-zinc-500'
                  }`}
                >
                  {step.label ?? (isDest ? 'Destination' : `Step ${i + 1}`)}
                </span>
                <span className="mt-1 text-sm font-semibold text-zinc-900 dark:text-white">
                  {step.title}
                </span>
                {!compact && step.description && (
                  <span className="mt-1 text-xs leading-5 text-zinc-600 dark:text-zinc-400">
                    {step.description}
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-xs text-zinc-500 dark:text-zinc-400">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
