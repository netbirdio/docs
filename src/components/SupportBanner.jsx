/**
 * Audience banner for the "Report bugs and issues" page. Two tones:
 * - "community": neutral, for everyone outside the managed Cloud.
 * - "support": orange/netbird accent, for paying NetBird Cloud customers.
 *
 * @param {'community'|'support'} [tone='community']
 * @param {string} [id] - Optional id so the banner can be a scroll target
 * @param {string} title
 * @param {string} [badge] - Small pill (e.g. "Free", "Cloud customers")
 * @param {string} description
 * @param {Array<{label: string, href: string}>} [links] - Bullet links to the
 *   section's channels / anchors.
 */
export function SupportBanner({
  tone = 'community',
  id,
  title,
  badge,
  description,
  links = [],
}) {
  const isSupport = tone === 'support'
  const accent = isSupport
    ? 'border-[#F28C28]'
    : 'border-zinc-300 dark:border-zinc-600'
  const badgeClass = isSupport
    ? 'bg-[#F28C28]/10 text-[#C2410C] ring-[#F28C28]/30 dark:text-[#FFAC1C] dark:ring-[#F28C28]/40'
    : 'bg-zinc-900/5 text-zinc-600 ring-zinc-900/10 dark:bg-white/5 dark:text-zinc-400 dark:ring-white/10'

  return (
    <div
      id={id}
      className={`not-prose my-6 scroll-mt-24 rounded-2xl border-l-4 ${accent} bg-zinc-50 p-5 ring-1 ring-inset ring-zinc-900/7.5 dark:bg-white/2.5 dark:ring-white/10`}
    >
      {(title || badge) && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {title && (
            <p className="text-lg font-semibold text-zinc-900 dark:text-white">
              {title}
            </p>
          )}
          {badge && (
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${badgeClass}`}
            >
              {badge}
            </span>
          )}
        </div>
      )}
      {description && (
        <p className="mt-1 max-w-3xl text-sm text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
      )}
      {links.length > 0 && (
        <ul className="mt-3 space-y-1">
          {links.map((link) => (
            <li key={link.href} className="flex items-start gap-x-2 text-sm">
              <span
                aria-hidden="true"
                className={isSupport ? 'text-[#F28C28]' : 'text-zinc-400 dark:text-zinc-500'}
              >
                •
              </span>
              <a
                href={link.href}
                className="text-zinc-700 underline-offset-2 transition hover:text-[#F28C28] hover:underline dark:text-zinc-300 dark:hover:text-[#FFAC1C]"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
