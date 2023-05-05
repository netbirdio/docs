import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'

const howToGuides = [
  {
    href: '/docs/getting-started',
    name: 'Getting Started',
    description: 'Learn how to start using NetBird.',
  },
  {
    href: '/docs/managing-your-network',
    name: 'Managing your Network',
    description: 'Learn everything you need to know about managing your network.',
  },
  {
    href: '/docs/examples',
    name: 'Examples',
    description:
      'Read some examples of how to use NetBird.',
  },
  {
    href: '/docs/cli',
    name: 'CLI',
    description:
      'Learn how to use the CLI of the NetBird client.',
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
