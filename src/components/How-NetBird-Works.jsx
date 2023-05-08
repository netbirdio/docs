import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'

const howNetbirdWorks = [
  {
    href: 'docs/how-netbird-works#architecture',
    name: 'Architecture',
    description: 'Learn everything there is to know about the general architecture of NetBird.',
  },
  {
    href: '/docs/how-netbird-works#general-flow-overview',
    name: 'General Flow Overview',
    description:
      'Learn how the general communication between components within the NetBird Cloud works.',
  },
  {
    href: '/docs/how-netbird-works#setup-keys',
    name: 'Setup Keys',
    description:
      'Learn about different kinds of setup keys and how to us them to add peers to your network.',
  },
  {
    href: '/docs/how-netbird-works#access-control',
    name: 'Access Control',
    description:
      'Learn how to limit communication between different peer groups inside your network.',
  },
]

export function HowNetbirdWorks() {
  return (
    <div className="my-16 xl:max-w-none">
      <Heading level={2} id="howNetbirdWorks">
        How NetBird Works
      </Heading>
      <div className="not-prose mt-4 grid grid-cols-1 gap-8 border-t border-zinc-900/5 pt-10 dark:border-white/5 sm:grid-cols-2 xl:grid-cols-4">
        {howNetbirdWorks.map((guide) => (
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
