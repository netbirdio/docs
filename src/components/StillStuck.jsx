import { Fragment } from 'react'
import Link from 'next/link'
import { Button } from '@/components/Button'

/**
 * "Still stuck?" call-to-action banner for the bottom of the Troubleshooting
 * hub. Renders a centered title, a row of action buttons with an optional note
 * under each, and an optional row of secondary links.
 *
 * @param {string} [title='Still stuck?']
 * @param {string} [id] - Optional id for the title anchor (listed in "On this page")
 * @param {string} [description]
 * @param {Array<{label: string, href: string, primary?: boolean, note?: string}>} actions
 * @param {string} [separator] - Optional word rendered between buttons (e.g. "or"),
 *   so two equally-weighted actions don't read as a recommended-vs-secondary pair.
 * @param {string} [linksLabel] - Lead-in text, on its own line above the secondary links
 * @param {Array<{label: string, href: string}>} [links] - Secondary text links
 */
export function StillStuck({
  title = 'Still stuck?',
  id,
  description,
  actions = [],
  separator,
  linksLabel,
  links = [],
}) {
  // `not-prose` on the card would also drop the prose layout (left margin and
  // max width), so the outer div keeps it and matches TroubleshootingTiles.
  return (
    <div className="my-12 xl:max-w-none">
      <div className="not-prose rounded-2xl bg-zinc-50 px-4 py-6 text-center ring-1 ring-inset ring-zinc-900/7.5 dark:bg-white/2.5 dark:ring-white/10">
        <h2
          id={id}
          className="scroll-mt-24 text-xl font-semibold text-zinc-900 dark:text-white"
        >
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {description}
          </p>
        )}
        {/* Stacked in reading order on phones. From `sm` up, a two-row grid puts
            each note under its button and keeps the separator level with the
            buttons, not the notes. */}
        <div
          className="mt-5 flex flex-col items-center gap-2 sm:grid sm:items-start sm:justify-center sm:gap-x-4 sm:[grid-template-columns:var(--cols)]"
          style={{
            '--cols': actions.map(() => 'minmax(0, 16rem)').join(' auto '),
          }}
        >
          {actions.map((action, i) => (
            <Fragment key={action.href}>
              {i > 0 && separator && (
                <span
                  className="text-sm text-zinc-500 sm:row-start-1 sm:self-center sm:[grid-column:var(--col)] dark:text-zinc-400"
                  style={{ '--col': 2 * i }}
                >
                  {separator}
                </span>
              )}
              <div
                className="sm:row-start-1 sm:[grid-column:var(--col)]"
                style={{ '--col': 2 * i + 1 }}
              >
                <Button
                  href={action.href}
                  variant={action.primary ? 'primary' : 'secondary'}
                >
                  {action.label}
                </Button>
              </div>
              {action.note && (
                <p
                  className="text-xs text-zinc-500 sm:row-start-2 sm:[grid-column:var(--col)] dark:text-zinc-400"
                  style={{ '--col': 2 * i + 1 }}
                >
                  {action.note}
                </p>
              )}
            </Fragment>
          ))}
        </div>
        {links.length > 0 && (
          <div className="mt-5 text-sm text-zinc-600 dark:text-zinc-400">
            {linksLabel && <p>{linksLabel}</p>}
            <p className={linksLabel ? 'mt-1' : undefined}>
              {links.map((link, i) => (
                <Fragment key={link.href}>
                  {i > 0 && <span aria-hidden="true"> · </span>}
                  <Link
                    href={link.href}
                    className="font-medium text-zinc-900 underline decoration-[#F28C28]/40 underline-offset-2 hover:decoration-[#F28C28] dark:text-white"
                  >
                    {link.label}
                  </Link>
                </Fragment>
              ))}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
