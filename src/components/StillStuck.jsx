import { Fragment } from 'react'
import { Button } from '@/components/Button'

/**
 * "Still stuck?" call-to-action banner for the bottom of the Troubleshooting
 * hub. Renders a short prompt and a row of action buttons.
 *
 * @param {string} [title='Still stuck?']
 * @param {string} description
 * @param {Array<{label: string, href: string, primary?: boolean}>} actions
 * @param {string} [separator] - Optional word rendered between buttons (e.g. "or"),
 *   so two equally-weighted actions don't read as a recommended-vs-secondary pair.
 */
export function StillStuck({
  title = 'Still stuck?',
  description,
  actions = [],
  separator,
}) {
  return (
    <div className="not-prose my-12 rounded-2xl bg-zinc-50 p-6 ring-1 ring-inset ring-zinc-900/7.5 dark:bg-white/2.5 dark:ring-white/10">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
        {title}
      </h2>
      {description && (
        <p className="mt-1 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
      )}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        {actions.map((action, i) => (
          <Fragment key={action.href}>
            {i > 0 && separator && (
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {separator}
              </span>
            )}
            <Button
              href={action.href}
              variant={action.primary ? 'primary' : 'secondary'}
            >
              {action.label}
            </Button>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
