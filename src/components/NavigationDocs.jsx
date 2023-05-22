import { useRouter } from 'next/router'
import clsx from 'clsx'
import {ActivePageMarker, NavLink, TopLevelNavItem, VisibleSectionHighlight} from "@/components/NavigationAPI";
import {AnimatePresence, motion} from "framer-motion";
import {Button} from "@/components/mdx";

export const docsNavigation = [
    {
        title: 'About NetBird',
        links: [
            { title: 'Why WireGuard with NetBird?', href: '/docs/about-netbird/why-wireguard-with-netbird' },
            { title: 'How NetBird works', href: '/docs/about-netbird/how-netbird-works' },
            { title: 'NetBird vs. traditional VPN', href: '/docs/about-netbird/netbird-vs-traditional-vpn' },
            { title: 'Other', href: '/docs/about-netbird/other' },
            { title: 'FAQ', href: '/docs/about-netbird/faq' },
        ],
    },
    {
        title: 'How-to guides',
        links: [
            { title: 'Getting started', href: '/docs/how-to/getting-started' },
            { title: 'Installation', href: '/docs/how-to/installation' },
            { title: 'Use setup keys for automation', href: '/docs/how-to/register-machines-using-setup-keys' },
            { title: 'Manage network access', href: '/docs/how-to/manage-network-access' },
            { title: 'Add users to your network', href: '/docs/how-to/add-users-to-your-network' },
            { title: 'Access NetBird API', href: '/docs/how-to/access-netbird-public-api' },
            { title: 'Enforce periodic authentication', href: '/docs/how-to/enforce-periodic-user-authentication' },
            { title: 'Monitor system and network activity', href: '/docs/how-to/monitor-system-and-network-activity' },
            { title: 'Route traffic to private networks', href: '/docs/how-to/routing-traffic-to-private-networks' },
            { title: 'Manage DNS in your network', href: '/docs/how-to/manage-dns-in-your-network' },
            { title: 'Examples', href: '/docs/how-to/examples' },
            { title: 'CLI', href: '/docs/how-to/cli' },
        ],
    },
    {
        title: 'Self-hosted NetBird',
        links: [
            { title: 'Installation guide', href: '/docs/selfhosted/selfhosted-guide' },
            { title: 'Supported IdPs', href: '/docs/selfhosted/identity-providers' },
        ],
    },

]

export function NavigationDocs({className}) {
  return (
    <nav className={className}>
      <ul role="list">
          <TopLevelNavItem href="https://netbird.io/">Home</TopLevelNavItem>
          <TopLevelNavItem href="/docs/introduction">Docs</TopLevelNavItem>
          <TopLevelNavItem href="/ipa/introduction">API</TopLevelNavItem>
          <TopLevelNavItem href="https://netbird.io/blog/">Blog</TopLevelNavItem>
          <TopLevelNavItem href="https://github.com/netbirdio/netbird">Github</TopLevelNavItem>
          <TopLevelNavItem href="https://join.slack.com/t/netbirdio/shared_invite/zt-vrahf41g-ik1v7fV8du6t0RwxSrJ96A">Support</TopLevelNavItem>
          {docsNavigation.map((group, groupIndex) => (
              <NavigationGroup
                  key={group.title}
                  group={group}
                  className={groupIndex === 0 && 'md:mt-0'}
              />
          ))}
          <li className="sticky bottom-0 z-10 mt-6 min-[416px]:hidden">
              <Button href="https://app.netbird.io/" variant="filled" className="w-full">
                  Sign in
              </Button>
          </li>
      </ul>
    </nav>
  )
}

function NavigationGroup({ group, className }) {
    let router = useRouter()

    let isActiveGroup =
        group.links.findIndex((link) => link.href === router.pathname) !== -1

    return (
        <li className={clsx('relative mt-6', className)}>
            <motion.h2
                layout="position"
                className="text-s font-semibold text-zinc-900 dark:text-white"
            >
                {group.title}
            </motion.h2>
            <div className="relative mt-3 pl-2">
                <AnimatePresence >
                    {isActiveGroup && (
                        <VisibleSectionHighlight group={group} pathname={router.pathname} />
                    )}
                </AnimatePresence>
                <motion.div
                    layout
                    className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/5"
                />
                <AnimatePresence initial={false}>
                    {isActiveGroup && (
                        <ActivePageMarker group={group} pathname={router.pathname} />
                    )}
                </AnimatePresence>
                <ul role="list" className="border-l border-transparent">
                    {group.links.map((link) => (
                        <motion.li key={link.href} layout="position" className="relative">
                            <NavLink href={link.href} active={link.href === router.pathname}>
                                {link.title}
                            </NavLink>
                        </motion.li>
                    ))}
                </ul>
            </div>
        </li>
    )
}
