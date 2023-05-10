import { useRouter } from 'next/router'
import clsx from 'clsx'
import {ActivePageMarker, NavLink, TopLevelNavItem, VisibleSectionHighlight} from "@/components/NavigationAPI";
import {AnimatePresence, motion} from "framer-motion";
import {Button} from "@/components/mdx";

export const docsNavigation = [
    {
        title: 'About NetBird',
        links: [
            { title: 'Why Wireguard with NetBird?', href: '/docs/about-netbird/why-wireguard-with-netbird' },
            { title: 'How Netbird Works', href: '/docs/about-netbird/how-netbird-works' },
            { title: 'NetBird vs. Traditional VPN', href: '/docs/about-netbird/netbird-vs-traditional-vpn' },
            { title: 'Other', href: '/docs/about-netbird/other' },
            { title: 'FAQ', href: '/docs/about-netbird/faq' },
        ],
    },
    {
        title: 'How-to',
        links: [
            { title: 'Getting Started', href: '/docs/how-to/getting-started' },
            { title: 'Register peers using setup keys', href: '/docs/how-to/register-peers-using-setup-keys' },
            { title: 'Restrict access to peers', href: '/docs/how-to/restrict-access-to-peers' },
            { title: 'Add Users to your network', href: '/docs/how-to/add-users-to-you-network' },
            { title: 'Use service users with access token', href: '/docs/how-to/use-service-users-with-access-token' },
            { title: 'Configure periodic user authentication', href: '/docs/how-to/configure-periodic-user-authentication' },
            { title: 'Monitor system and network activity', href: '/docs/how-to/monitor-system-and-network-activity' },
            { title: 'Routing traffic to private networks', href: '/docs/how-to/routing-traffic-to-private-networks' },
            { title: 'Examples', href: '/docs/how-to/examples' },
            { title: 'CLI', href: '/docs/how-to/cli' },
        ],
    },
    {
        title: 'Self-Hosted',
        links: [
            { title: 'Installation Guide', href: '/docs/selfhosted/selfhosted-guide' },
            { title: 'Identity Providers', href: '/docs/selfhosted/identity-providers' },
        ],
    },

]

export function NavigationDocs({className}) {
  return (
    <nav className={className}>
      <ul role="list">
          <TopLevelNavItem href="https://netbird.io/">Home</TopLevelNavItem>
          <TopLevelNavItem href="/docs/introductions">Docs</TopLevelNavItem>
          <TopLevelNavItem href="/ipa/introductions">API</TopLevelNavItem>
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
                className="text-xs font-semibold text-zinc-900 dark:text-white"
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
                            {/*<AnimatePresence mode="popLayout" initial={false}>*/}
                            {/*    {link.href === router.pathname && sections.length > 0 && (*/}
                            {/*        <motion.ul*/}
                            {/*            role="list"*/}
                            {/*            initial={{ opacity: 0 }}*/}
                            {/*            animate={{*/}
                            {/*                opacity: 1,*/}
                            {/*                transition: { delay: 0.1 },*/}
                            {/*            }}*/}
                            {/*            exit={{*/}
                            {/*                opacity: 0,*/}
                            {/*                transition: { duration: 0.15 },*/}
                            {/*            }}*/}
                            {/*        >*/}
                            {/*            {sections.map((section) => (*/}
                            {/*                <li key={section.id}>*/}
                            {/*                    <NavLink*/}
                            {/*                        href={`${link.href}#${section.id}`}*/}
                            {/*                        tag={section.tag}*/}
                            {/*                        isAnchorLink*/}
                            {/*                    >*/}
                            {/*                        {section.title}*/}
                            {/*                    </NavLink>*/}
                            {/*                </li>*/}
                            {/*            ))}*/}
                            {/*        </motion.ul>*/}
                            {/*    )}*/}
                            {/*</AnimatePresence>*/}
                        </motion.li>
                    ))}
                </ul>
            </div>
        </li>
    )
}
