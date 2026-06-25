import Link from 'next/link'

/**
 * "Start here" diagnostics block: a highlighted panel with a short intro and a
 * row of numbered step cards. Each step can link to a section (href) and/or
 * show the relevant command.
 *
 * @param {string} [eyebrow='Start here'] - Small uppercase label
 * @param {string} title - Panel title (e.g. "Collect diagnostics first")
 * @param {string} [id] - Optional id for the title anchor
 * @param {string} [description] - Intro text below the title
 * @param {Array<{label: string, title: string, command?: string, href?: string, hint?: string}>} steps
 */
export function TroubleshootingStart({
  eyebrow = 'Start here',
  title,
  id,
  description,
  steps = [],
}) {
  return (
    <div className="not-prose my-12 overflow-hidden rounded-2xl border-l-4 border-[#F28C28] bg-zinc-50 ring-1 ring-inset ring-zinc-900/7.5 dark:bg-white/2.5 dark:ring-white/10">
      <div className="p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#F28C28]">
          {eyebrow}
        </p>
        {title && (
          <h2
            id={id}
            className="mt-1 scroll-mt-24 text-xl font-semibold text-zinc-900 dark:text-white"
          >
            {title}
          </h2>
        )}
        {description && (
          <p className="mt-2 max-w-3xl text-sm text-zinc-600 dark:text-zinc-400">
            {description}
          </p>
        )}

        {steps.length > 0 && (
          <div
            className={`mt-6 grid grid-cols-1 gap-4 ${
              steps.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'
            }`}
          >
            {steps.map((step) => {
              const content = (
                <>
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {step.label}
                  </p>
                  <p className="mt-1 flex items-center gap-x-1 text-sm font-semibold text-zinc-900 dark:text-white">
                    {step.title}
                    {step.href && (
                      <span aria-hidden="true" className="text-[#F28C28]">
                        →
                      </span>
                    )}
                  </p>
                  {step.command && (
                    <code className="mt-3 block overflow-x-auto rounded-lg bg-zinc-900/5 px-3 py-2 font-mono text-sm text-zinc-800 ring-1 ring-inset ring-zinc-900/10 dark:bg-black/40 dark:text-zinc-200 dark:ring-white/10">
                      {step.command}
                    </code>
                  )}
                  {step.hint && (
                    <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                      {step.hint}
                    </p>
                  )}
                </>
              )

              const base =
                'block rounded-xl bg-white p-4 ring-1 ring-inset ring-zinc-900/7.5 dark:bg-white/5 dark:ring-white/10'

              return step.href ? (
                <Link
                  key={step.title}
                  href={step.href}
                  className={`${base} transition hover:ring-zinc-900/15 hover:shadow-sm dark:hover:ring-white/20`}
                >
                  {content}
                </Link>
              ) : (
                <div key={step.title} className={base}>
                  {content}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
