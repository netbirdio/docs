import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'

const howToGuides = [
  {
    href: '/docs/how-to/add-users-to-your-network',
    name: 'Add Users to your network',
    description: 'Learn how to add users to your network.',
  },
  {
    href: '/docs/how-to/configure-periodic-user-authentication',
    name: 'Configure periodic user authentication',
    description:
      'Learn how to configure periodic user authentication.',
  },
  {
    href: '/docs/how-to/manage-dns-in-your-network',
    name: 'Manage DNS in your network',
    description:
      'Learn how to configure DNS servers for your network.',
  },
  {
    href: '/docs/how-to/monitor-system-and-network-activity',
    name: 'Monitoring system and network activities',
    description:
      'Learn how to keep track of system and network activities in your account.',
  },
]

export function HowToGuides() {
  return (
    <div className="my-16 xl:max-w-none">
      <Heading level={2} id="guides">
        How-To Guides
      </Heading>
      <div className="not-prose mt-4 grid grid-cols-1 gap-8 border-t border-zinc-900/5 pt-10 dark:border-white/5 sm:grid-cols-2 xl:grid-cols-4">
        {howToGuides.map((guide) => (
          <div key={guide.href}>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              {guide.name}
            </h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {guide.description}
            </p>
            <p className="mt-4">
              <Button href={guide.href} variant="text" arrow="right">
                Read more
              </Button>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
