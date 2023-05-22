import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'

const aboutNetbird = [
  {
    href: '/docs/about-netbird/how-netbird-works',
    name: 'How NetBird works',
    description: 'Concepts, architecture, protocols, and more.',
  },
  {
    href: '/docs/about-netbird/netbird-vs-traditional-vpn',
    name: 'NetBird vs. traditional VPN',
    description:
      'Learn how NetBird compares to traditional VPNs and why it is better.',
  },
  {
    href: '/docs/about-netbird/why-wireguard-with-netbird',
    name: 'Why WireGuard with NetBird',
    description:
      'Learn why and how NetBird uses WireGuard.',
  },
]

export function AboutNetbird() {
  return (
    <div className="my-16 xl:max-w-none">
      <Heading level={2} id="howNetbirdWorks">
        About NetBird
      </Heading>
      <div className="not-prose mt-4 grid grid-cols-1 gap-8 border-t border-zinc-900/5 pt-10 dark:border-white/5 sm:grid-cols-2 xl:grid-cols-4">
        {aboutNetbird.map((guide) => (
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
