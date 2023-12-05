import { useRouter } from 'next/router'
import clsx from 'clsx'
import {ActivePageMarker, NavLink, TopLevelNavItem, VisibleSectionHighlight} from "@/components/NavigationAPI";
import {AnimatePresence, motion} from "framer-motion";
import {Button} from "@/components/mdx";

export const docsNavigation = [
    {
        title: 'About NetBird',
        links: [
            { title: 'Why WireGuard with NetBird?', href: '/about-netbird/why-wireguard-with-netbird' },
            { title: 'How NetBird works', href: '/about-netbird/how-netbird-works' },
            { title: 'NetBird vs. traditional VPN', href: '/about-netbird/netbird-vs-traditional-vpn' },
            { title: 'Other', href: '/about-netbird/other' },
            { title: 'FAQ', href: '/about-netbird/faq' },
        ],
    },
    {
        title: 'How-to guides',
        links: [
            { title: 'Getting started', href: '/how-to/getting-started' },
            { title: 'Installation', href: '/how-to/installation'},

            /*
            Nested Navigation items example
            {
                title: 'Nested Nav Item',
                links: [
                    { title: 'Test 1', href: '/test-1' },
                    { title: 'Test 2', href: '/test-2' },
                    { title: 'Test 3', href: '/test-3' },
                    {
                        title: 'Deeply Nested Nav Item',
                        links: [
                            { title: 'Test 1', href: '/test-1' },
                            { title: 'Test 2', href: '/test-2' },
                            { title: 'Test 3', href: '/test-3' },
                        ]
                    },
                ]
            },*/

            { title: 'Add machines to your network', href: '/how-to/add-machines-to-your-network' },
            { title: 'Add users to your network', href: '/how-to/add-users-to-your-network' },
            { title: 'Use setup keys for automation', href: '/how-to/register-machines-using-setup-keys' },
            { title: 'Manage network access', href: '/how-to/manage-network-access' },
            { title: 'Enforce periodic authentication', href: '/how-to/enforce-periodic-user-authentication' },
            { title: 'Route traffic to private networks', href: '/how-to/routing-traffic-to-private-networks' },
            { title: 'Manage DNS in your network', href: '/how-to/manage-dns-in-your-network' },
            { title: 'Monitor system and network activity', href: '/how-to/monitor-system-and-network-activity' },
            { title: 'Access NetBird API', href: '/how-to/access-netbird-public-api' },
            { title: 'Examples', href: '/how-to/examples' },
            { title: 'CLI', href: '/how-to/cli' },
        ],
    },
    {
        title: 'Self-hosting NetBird',
        links: [
            { title: 'Quickstart guide', href: '/selfhosted/selfhosted-quickstart' },
            { title: 'Advanced guide', href: '/selfhosted/selfhosted-guide' },
            { title: 'Management SQLite Store', href: '/selfhosted/sqlite-store'},
            { title: 'Supported IdPs', href: '/selfhosted/identity-providers' },
        ],
    },

]

export function NavigationDocs({className}) {
  return (
    <nav className={className}>
      <ul role="list">
          <TopLevelNavItem href="https://netbird.io/">Home</TopLevelNavItem>
          <TopLevelNavItem href="/">Docs</TopLevelNavItem>
          <TopLevelNavItem href="/api">API</TopLevelNavItem>
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

function NavigationGroup({ group, className,hasChildren }) {
    let router = useRouter()
    let isActiveGroup =
        group.links.findIndex((link) => link.href=== router.pathname) !== -1;

    return (
        <li className={clsx('relative', className, hasChildren ? "mt-2" : "mt-6")}>
            <motion.h2
                layout="position"
                className="text-xs font-semibold text-zinc-900 dark:text-white"
            >
                {group.title}
            </motion.h2>
            <div className={clsx("relative", hasChildren ? "" : "mt-3 pl-2")}>
                {!hasChildren &&
                    <>
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
                    </>
                }

                <ul role="list" className="border-l border-transparent">
                    {group.links.map((link) =>  {
                        return link.href ?
                            <motion.li key={link.href} layout="position" className="relative">
                                <NavLink href={link.href} active={link.href === router.pathname} links={link.links}>
                                    {link.title}
                                </NavLink>
                            </motion.li>
                            :
                            <NavigationGroup className={"ml-4"} key={link.title} group={link} hasChildren={true} />
                    })}
                </ul>


            </div>
        </li>
    )
}
