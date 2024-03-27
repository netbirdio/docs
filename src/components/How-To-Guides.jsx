import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'

const howToGuides = [
  {
    href: '/how-to/getting-started',
    name: 'Quickstart guide',
    description: 'Start using NetBird in under 5 minutes.',
  },
  {
    href: '/how-to/manage-network-access',
    name: 'Manage network access',
    description:
        'Learn how to use access controls to manage access to your machines.',
  },
  {
    href: '/how-to/add-users-to-your-network',
    name: 'Add users to your network',
    description: 'learn how to add team members to your NetBird network.',
  },
  {
    href: '/how-to/routing-traffic-to-private-networks',
    name: 'Route traffic to private networks',
    description:
      'Learn how to provide access to LANs, VPS, and corporate private networks.',
  },
  {
    href: '/how-to/configuring-default-routes-for-internet-traffic',
    name: 'Configure default routes and traffic for the Internet',
    description: 'Understand how to set up your network for accessing the internet through default routes, also known as "exit nodes".',
  },
  {
    href: '/how-to/monitor-system-and-network-activity',
    name: 'Log and monitor network activity',
    description:
      'Learn how to keep track of system and network activities in your account.',
  },
  {
    href: '/how-to/manage-dns-in-your-network',
    name: 'Manage DNS in your network',
    description:
        'Learn how to configure name servers in your private network.',
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
