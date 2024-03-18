import { useRouter } from 'next/router'
import clsx from 'clsx'
import {
   ActivePageMarker,
   NavLink,
   TopLevelNavItem,
   VisibleSectionHighlight
} from "@/components/NavigationAPI";
import {AnimatePresence, motion} from "framer-motion";
import {Button} from "@/components/mdx";
import {useState} from "react";
import {NavigationStateProvider, useNavigationState} from "@/components/NavigationState";
import ChevronDownIcon from "@/components/icons/ChevronDownIcon";


export const docsNavigation = [
    {
        title: 'ABOUT',
        links: [
            { title: 'How NetBird works', href: '/about-netbird/how-netbird-works'},
            { title: 'NetBird vs. traditional VPN', href: '/about-netbird/netbird-vs-traditional-vpn' },
            { title: 'Why WireGuard with NetBird', href: '/about-netbird/why-wireguard-with-netbird' },
            { title: 'FAQ', href: '/about-netbird/faq' },
            /*{ title: 'Whats new in version xx', href: '/welcome/how-netbird-works' },
            { title: 'Release notes', href: '/about-netbird/netbird-vs-traditional-vpn' },*/
         
        ],
    },
    {
        title: 'GET STARTED',
        links: [
            { title: 'Quickstart Guide', href: '/how-to/getting-started' },
            {title: 'Install NetBird', href: '/how-to/installation' },
            { title: 'CLI', href: '/how-to/cli' },
           
           /* { title: 'Update NetBird', href: '/how-to/enforce-periodic-user-authentication' },*/
 
 
        ],
    },
    {
        title: 'MANAGE NETBIRD',
        links: [
            {
             title: 'Peers',
             isOpen: false,
             links: [
                 { title: 'Add peers to your network', href: '/how-to/add-machines-to-your-network' },
                 { title: 'Approve peers', href: '/how-to/approve-peers' },
                 { title: 'Setup keys', href: '/how-to/register-machines-using-setup-keys' },
             ]
         },
         {
             title: 'Access Control',
             isOpen: false,
             links: [
                 { title: 'Manage Network Access', href: '/how-to/manage-network-access' },
                 { title: 'Posture Checks', href: '/how-to/manage-posture-checks' },
             ]
         },
         {
             title: 'Network Routes',
             isOpen: false,
             links: [
                 { title: 'Routing traffic to private networks', href: '/how-to/routing-traffic-to-private-networks' },
                 
             ]
         },
         {
             title: 'DNS',
             isOpen: false,
             links: [
                 { title: 'Manage DNS in your network', href: '/how-to/manage-dns-in-your-network' },
             ]
         },
         {
             title: 'Team',
             isOpen: false,
             links: [
                 { title: 'Add users to your network', href: '/how-to/add-users-to-your-network' },
                     
             ]
         },
         {
             title: 'Activity',
             links: [
                 { title: 'Activity Events', href: '/how-to/monitor-system-and-network-activity' }, 
              
             ],
         },
         {
             title: 'Settings',
             isOpen: false,
             links: [
                 {title: 'Authentication', href: '/how-to/enforce-periodic-user-authentication' },
                 {title: 'Delete Account/Danger Zone', href: '/how-to/delete-account' }
                 /*{title: 'Groups', href: '/about-netbird/netbird-vs-traditional-vpn' },
                 {title: 'Plans & Billing', href: '/about-netbird/netbird-vs-traditional-vpn' },*/
                 
             ]
         },
         {
             title: 'Integrations',
             isOpen: false,
             links: [
                 {title: 'Activity Event Streaming', href: '/how-to/activity-event-streaming' },
                 {title: 'Identity Provider', href: '/how-to/idp-sync' },
                 {title: 'Enable Post Quantum Cryptography', href: '/how-to/enable-post-quantum-cryptography' },
                 
             ]
         },

            {
                title: 'Public API',
                isOpen: false,
                links: [
                    { title: 'Access public API', href: '/how-to/access-netbird-public-api' },

                ]
            },
        ],
        
    },
    
    {
     title: 'USE CASES',
     links: [
         { title: 'NetBird on FaaS', href: '/how-to/netbird-on-faas' },
         { title: 'Routing peers and Kubernetes', href: '/how-to/routing-peers-and-kubernetes'},
         { title: 'NetBird Client on AWS ECS', href: '/how-to/examples'},
     ],
 
 
 },
 {
  title: 'SELF-HOST NETBIRD',
  links: [
      { title: 'Quickstart guide', href: '/selfhosted/selfhosted-quickstart' },
      { title: 'Advanced guide', href: '/selfhosted/selfhosted-guide' },
      { title: 'Management SQLite Store', href: '/selfhosted/sqlite-store'},
      { title: 'Supported IdPs', href: '/selfhosted/identity-providers' },
      { title: 'Management Geolocation', href: '/selfhosted/geo-support' },
      { title: 'Troubleshooting', href: '/selfhosted/troubleshooting' },
  ],
  
  
 },
    
    {
     title: 'GET MORE HELP',
     links: [
         { title: 'Troubleshooting client issues', href: '/how-to/troubleshooting-client' },
         { title: 'Report bugs and issues', href: '/how-to/report-bug-issues' },
 
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
          <TopLevelNavItem href="https://netbird.io/knowledge-hub/">Learn</TopLevelNavItem>
          <TopLevelNavItem href="https://github.com/netbirdio/netbird">Github</TopLevelNavItem>
          <TopLevelNavItem href="https://join.slack.com/t/netbirdio/shared_invite/zt-vrahf41g-ik1v7fV8du6t0RwxSrJ96A">Support</TopLevelNavItem>
          {docsNavigation.map((group, groupIndex) => (
              <NavigationStateProvider key={group.title} index={groupIndex}>
                  <NavigationGroup
                      group={group}
                      index={groupIndex}
                      className={groupIndex === 0 && 'md:mt-0'}
                  />
              </NavigationStateProvider>
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
 
 
 const findActiveGroupIndex = (group, pathname) => {
    let activeIndex = -1;
    group.links.forEach((link, index) => {
        if (link.href === pathname) {
            activeIndex = index;
        } else if (link.links) {
            const childIndex = findActiveGroupIndex(link, pathname);
            if (childIndex !== -1) {
                activeIndex = index;
            }
        }
    });
    return activeIndex;
 }
 
 
 
 
 function NavigationGroup({ group, className, hasChildren }) {
    let router = useRouter()
    let isActiveGroup = findActiveGroupIndex(group, router.pathname) !== -1;
    const [isOpen, setIsOpen] = useState(group.isOpen ? group.isOpen :!hasChildren);
    const [, setActiveHighlight] = useNavigationState();
 
    return (
        <li className={clsx('relative', className, hasChildren ? "" : "mt-6")}>
            <motion.h2
                layout={"size"}
                className={clsx(
                    "flex justify-between items-center gap-2 group",
                    hasChildren ? "text-zinc-700 select-none py-1 pr-3 hover:text-zinc-900 dark:text-zinc-300 font-medium dark:hover:text-white text-sm cursor-pointer" : "text-xs font-semibold text-zinc-900 dark:text-white"
                    )}
                onClick={() => {
                    setIsOpen(!isOpen)
                    if(!isOpen) {
                        if(!isActiveGroup) router.push(group.links[0].href)
                        setActiveHighlight()
                    }else {
                        setActiveHighlight(group.title)
                    }
                }}
                data-nb-link={group.title}
                data-nb-active={hasChildren && isActiveGroup ? "1" : "0"}
            >
                {group.title}
                {hasChildren && <ChevronDownIcon className={clsx("fill-zinc-700 group-hover:fill-zinc-900 dark:fill-zinc-300 dark:group-hover:fill-white","transition", isOpen ? "transform rotate-180" : "")} size={10} />}
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
                                <ActivePageMarker group={group} pathname={router.pathname}/>
                            )}
                        </AnimatePresence>
                    </>
                }
 
 
                <AnimatePresence mode={"wait"} initial={false}>
                    {isOpen && <motion.ul
                        role="list"
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: 1,
                            transition: { delay: 0.05 },
                        }}
                        exit={{
                            opacity: 0,
                            transition: { duration: 0.15 },
                        }}
                        className="border-l border-transparent">
                            {group.links.map((link) =>  {
                                return link.href ?
                                    <motion.li key={link.href} layout={"position"} className="relative">
                                        <NavLink href={link.href} active={link.href === router.pathname} links={link.links}>
                                            {link.title}
                                        </NavLink>
                                    </motion.li>
                                    :
                                    <NavigationGroup className={"ml-4"} key={link.title + isOpen} group={link} hasChildren={true} />
                            })}
                    </motion.ul>}
 
 
                </AnimatePresence>
            </div>
        </li>
    )
 }