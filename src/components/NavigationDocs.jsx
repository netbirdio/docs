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
                 { title: 'Add Peers', href: '/how-to/add-machines-to-your-network' },
                 { title: 'Approve Peers', href: '/how-to/approve-peers' },
                 { title: 'Setup Keys', href: '/how-to/register-machines-using-setup-keys' },
                 {
                     title: 'Access Infrastructure',
                     isOpen: true,
                     links: [
                         {
                             title: 'Access Remote Webserver',
                             href: '/how-to/secure-remote-webserver-access'
                         },
                         {
                             title: 'Add Servers to the Network',
                             href: '/how-to/setup-keys-add-servers-to-network'
                         },
                         {
                            title: 'Access from Kubernetes',
                            href: '/how-to/access-internal-resources-from-autoscaled-environments'
                        },
                         {
                            title: 'Peer Approval for Remote Access',
                            href: '/how-to/peer-approval-for-remote-worker-access'
                        },
                     ]
                 },
                 {
                     title: 'Connect Site-to-Site',
                     isOpen: true,
                     links: [
                         {
                             title: 'Simplify Workload Migrations',
                             href: '/how-to/db-workload-migration'
                         },
                     ]
                 },
             ]
         },
         {
             title: 'Access Control',
             isOpen: false,
             links: [
                 { title: 'Groups & Policies', href: '/how-to/manage-network-access' },
                 { 
                    title: 'Posture Checks', 
                    href: '/how-to/manage-posture-checks',
                    isOpen: false,
                    links: [
                        { title: 'Disable route when in the office', href: '/how-to/disabling-network-route-when-connecting-from-the-office' },
                    ]
                },
                 {
                     title: 'Integrate EDR',
                     href: '/how-to/endpoint-detection-and-response',
                     isOpen: false, 
                     links: [
                         { title: 'CrowdStrike Falcon', href: '/how-to/crowdstrike-edr' },
                     ]
                 },

             ]
         },
         {
              title: 'Networks (new)',
              isOpen: false,
              links: [
                  { title: 'Concept', href: '/how-to/networks' },
                  { title: 'Routing traffic to multiple IP resources', href: '/how-to/routing-traffic-to-multiple-resources' },
                  { title: 'Accessing restricted website domain resources', href: '/how-to/accessing-restricted-domain-resources' },
                  { title: 'Accessing entire domains within networks', href: '/how-to/accessing-entire-domains-within-networks' },
              ]
         },
         {
             title: 'Network Routes',
             isOpen: false,
             links: [
                 { title: 'Routing traffic to private networks', href: '/how-to/routing-traffic-to-private-networks' },
                 { title: 'Configuring default routes for Internet traffic', href: '/how-to/configuring-default-routes-for-internet-traffic' },
                 { title: 'Configuring routes with access control', href: '/how-to/configuring-routes-with-access-control' },
                 { title: 'Resolve overlapping routes', href: '/how-to/resolve-overlapping-routes' },
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
            title: 'Network Flow Logs',
            isOpen: false,
            links: [
                { title: 'Network Flow Logs', href: '/how-to/netflow' },
            ]
        },
         {
             title: 'Team',
             isOpen: false,
             links: [
                 { title: 'Add users to your network', href: '/how-to/add-users-to-your-network' },
                 {
                     title: 'Provision Users & Groups',
                     href: '/how-to/idp-sync',
                     isOpen: false,
                     links: [
                         { title: 'Microsoft Entra ID', href: '/how-to/microsoft-entra-id-sync' },
                         { title: 'Okta', href: '/how-to/okta-sync' },
                         { title: 'Google Workspace', href: '/how-to/google-workspace-sync'},
                     ]
                 },
                 {
                     title: 'Auto-Offboard Users',
                     href: '/how-to/auto-offboard-users',
                     isOpen: false,
                 },
             ]
         },
         {
             title: 'Activity',
             links: [
                 { title: 'Audit Events Logging', href: '/how-to/audit-events-logging' },
                 { title: 'Traffic Events Logging', href: '/how-to/traffic-events-logging' },
                 {
                     title: 'Stream Activity Events',
                     href: '/how-to/activity-event-streaming',
                     isOpen: false,
                     links: [
                         { title: 'Datadog', href: '/how-to/stream-activity-to-datadog' },
                         { title: 'Amazon S3', href: '/how-to/stream-activity-to-amazon-s3' },
                         { title: 'Amazon Firehose', href: '/how-to/stream-activity-to-amazon-firehose'},
                     ]
                 },
             ],
         },
         {
             title: 'Settings',
             isOpen: false,
             links: [
                 {title: 'Authentication', href: '/how-to/enforce-periodic-user-authentication' },
                 {title: 'Multi-Factor Authentication', href: '/how-to/multi-factor-authentication' },
                 {title: 'Delete account/danger zone', href: '/how-to/delete-account' },
                 {title: 'Plans and billing', href: '/how-to/plans-and-billing' }
                 
             ]
         },
         {
             title: 'Integrations',
             isOpen: false,
             links: [
                 {title: 'Enable post quantum cryptography', href: '/how-to/enable-post-quantum-cryptography' },
                 {title: 'Deploying with Jamf Pro', href: '/how-to/jamf-pro-netbird-integration' },
                 {title: 'Deploying with Kandji', href: '/how-to/kandji-netbird-integration' },


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
         { title: 'Serverless and NetBird', href: '/how-to/netbird-on-faas' },
         { title: 'Routing peers and Kubernetes', href: '/how-to/routing-peers-and-kubernetes'},
         { title: 'NetBird Client on AWS ECS', href: '/how-to/examples'},
         { title: 'Netbird on Mikrotik Router', href: '/how-to/client-on-mikrotik-router' },
     ],
 
 
 },
 {
  title: 'SELF-HOST NETBIRD',
  links: [
      { title: 'Quickstart guide', href: '/selfhosted/selfhosted-quickstart' },
      { title: 'Advanced guide', href: '/selfhosted/selfhosted-guide' },
      { title: 'Management SQLite Store', href: '/selfhosted/sqlite-store'},
      { title: 'Management Postgres Store', href: '/selfhosted/postgres-store'},
      { title: 'Supported IdPs', href: '/selfhosted/identity-providers' },
      { title: 'Management geolocation', href: '/selfhosted/geo-support' },
      { title: 'Troubleshooting', href: '/selfhosted/troubleshooting' },
      { title: 'Self-hosted vs. Cloud-hosted NetBird', href: '/selfhosted/self-hosted-vs-cloud-netbird' },
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
          <TopLevelNavItem href="https://join.slack.com/t/netbirdio/shared_invite/zt-31rofwmxc-27akKd0Le0vyRpBcwXkP0g">Support</TopLevelNavItem>
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
