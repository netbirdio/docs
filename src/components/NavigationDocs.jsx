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
            { title: 'How NetBird Works', href: '/about-netbird/how-netbird-works'},
            { title: 'NetBird vs. Traditional VPN', href: '/about-netbird/netbird-vs-traditional-vpn' },
            { title: 'Why WireGuard with NetBird', href: '/about-netbird/why-wireguard-with-netbird' },
            { title: 'Browser Client Architecture', href: '/about-netbird/browser-client-architecture' },
            { title: 'FAQ', href: '/about-netbird/faq' },
            /*{ title: 'Whats new in version xx', href: '/welcome/how-netbird-works' },
            { title: 'Release notes', href: '/about-netbird/netbird-vs-traditional-vpn' },*/
         
        ],
    },
    {
        title: 'GET STARTED',
        links: [
          { title: 'Quickstart Guide', href: '/how-to/getting-started' },
          {
            title: 'Install NetBird', isOpen: true, href: '/how-to/installation',
            links: [
              { title: 'Linux', href: '/how-to/installation/linux' },
              { title: 'Windows', href: '/how-to/installation/windows' },
              { title: 'MacOS', href: '/how-to/installation/macos' },
              { title: 'Docker', href: '/how-to/installation/docker' },
              { title: 'Synology', href: '/how-to/installation/synology' },
              { title: 'Android/iOS', href: '/how-to/installation/mobile' },
              { title: 'pfSense', href: '/how-to/installation/pfsense' },
              { title: 'OPNsense', href: '/how-to/installation/opnsense' },
            ],
      },
      { title: 'CLI', href: '/how-to/cli' },
    ],
  },
    {
        title: 'MANAGE NETBIRD',
        links: [
            { title: 'Control Center', href: '/how-to/control-center' },
            {
             title: 'Peers',
             isOpen: false,
             links: [
                 { title: 'Add Peers', href: '/how-to/add-machines-to-your-network' },
                 { title: 'Approve Peers', href: '/how-to/approve-peers' },
                 { title: 'Setup Keys', href: '/how-to/register-machines-using-setup-keys' },
                 { title: 'Browser Client', href: '/how-to/browser-client' },
                 { title: 'SSH', href: '/how-to/ssh' },
                 { title: 'Lazy Connections', href: '/how-to/lazy-connection'},
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
                     title: 'Integrate MDM & EDR',
                     href: '/how-to/endpoint-detection-and-response',
                     isOpen: false, 
                     links: [
                         { title: 'CrowdStrike Falcon', href: '/how-to/crowdstrike-edr' },
                         { title: 'Microsoft Intune', href: '/how-to/intune-mdm' },
                         { title: 'SentinelOne Singularity', href: '/how-to/sentinelone-edr' },
                     ]
                 },

             ]
         },
         {
              title: 'Networks',
              isOpen: false,
              links: [
                  { title: 'Concept', href: '/how-to/networks' },
                  { title: 'Route Traffic to Multiple IP resources', href: '/how-to/routing-traffic-to-multiple-resources' },
                  { title: 'Access Restricted Website Domain Resources', href: '/how-to/accessing-restricted-domain-resources' },
                  { title: 'Access Entire Domains Within Networks', href: '/how-to/accessing-entire-domains-within-networks' },
                  {
                      title: 'Homelab',
                      isOpen: true,
                      links: [
                          { title: 'Access Home Network', href: '/how-to/access-home-network' },
                      ]
                  },
              ]
         },
         {
             title: 'Network Routes',
             isOpen: false,
             links: [
                 { title: 'Route Traffic to Private Networks', href: '/how-to/routing-traffic-to-private-networks' },
                 { title: 'Configure Default Routes for Internet Traffic', href: '/how-to/configuring-default-routes-for-internet-traffic' },
                 { title: 'Configure Routes with Access control', href: '/how-to/configuring-routes-with-access-control' },
                 { title: 'Resolve Overlapping Routes', href: '/how-to/resolve-overlapping-routes' },
             ]
         },
         {
             title: 'DNS',
             isOpen: false,
             links: [
                 { title: 'Manage DNS in Your Network', href: '/how-to/manage-dns-in-your-network' },
             ]
         },
         {
             title: 'Team',
             isOpen: false,
             links: [
                 { title: 'Add Users to Your Network', href: '/how-to/add-users-to-your-network' },
                 { title: 'Approve Users', href: '/how-to/approve-users' },
                 {
                     title: 'Provision Users & Groups',
                     href: '/how-to/idp-sync',
                     isOpen: false,
                     links: [
                         { title: 'Microsoft Entra ID', href: '/how-to/microsoft-entra-id-sync' },
                         { title: 'Microsoft Entra ID (SCIM)', href: '/how-to/microsoft-entra-id-scim-sync' },
                         { title: 'Okta', href: '/how-to/okta-sync' },
                         { title: 'Google Workspace', href: '/how-to/google-workspace-sync'},
                         { title: 'JumpCloud', href: '/how-to/jumpcloud-sync'},
                         { title: 'Keycloak', href: '/how-to/keycloak-sync'},
                     ]
                 },
                 {
                     title: 'Auto-Offboard Users',
                     href: '/how-to/auto-offboard-users',
                     isOpen: false,
                 },
                 {
                     title: 'Single Sign-On',
                     href: '/how-to/single-sign-on',
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
                         { title: 'SentinelOne Data Lake', href: '/how-to/stream-activity-to-sentinelone-data-lake'},
                         { title: 'Generic HTTP', href: '/how-to/stream-activity-to-generic-http'},
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
                 {title: 'Delete Account', href: '/how-to/delete-account' },
                 {title: 'Plans and Billing', href: '/how-to/plans-and-billing' }
                 
             ]
         },
         {
             title: 'Integrations',
             isOpen: false,
             links: [
                 {title: 'Enable Post Quantum Cryptography', href: '/how-to/enable-post-quantum-cryptography' },
                 {
                     title: 'MDM for Deployment',
                     isOpen: true,
                     links: [
                         {title: 'Deploy with Jamf Pro', href: '/how-to/jamf-pro-netbird-integration' },
                         {title: 'Deploy with Kandji', href: '/how-to/kandji-netbird-integration' },
                         {title: 'Deploy with Intune', href: '/how-to/intune-netbird-integration' },
                     ]
                 },
                 {
                     title: 'Kubernetes',
                     isOpen: true,
                     links: [
                         {title: 'Operator', href: '/how-to/kubernetes-operator' },
                     ]
                 },
             ]
         },

            {
                title: 'Public API',
                isOpen: false,
                links: [
                    { title: 'Access Public API', href: '/how-to/access-netbird-public-api' },

                ]
            },

            {
                title: 'For Partners',
                isOpen: false,
                links: [
                    { title: 'Managed Service Providers', href: '/how-to/msp-portal' },
                    { title: 'Acronis NetBird integration', href: '/how-to/acronis-netbird-integration' },

                ]
            },
        ],
        
    },
        {
     title: 'CLIENT',
     links: [
         { title: 'Profiles', href: '/how-to/profiles' },
     ],
 
 },
    {
     title: 'USE CASES',
     links: [
         { title: 'Serverless and NetBird', href: '/how-to/netbird-on-faas' },
         { title: 'Routing peers and Kubernetes', href: '/how-to/routing-peers-and-kubernetes'},
         { title: 'NetBird Client on AWS ECS', href: '/how-to/examples'},
         { title: 'NetBird on Mikrotik Router', href: '/how-to/client-on-mikrotik-router' },
         { title: 'Distributed AI on Kubernetes', href: '/use-cases/distributed-multi-cloud-ai-argocd-microk8s-vllm' },
         { title: 'Self-hosted vs. Cloud-hosted NetBird', href: '/selfhosted/self-hosted-vs-cloud-netbird' },
     ],
 
 },
 {
  title: 'SELF-HOST NETBIRD',
  links: [
      { title: 'Quickstart guide', href: '/selfhosted/selfhosted-quickstart' },
      { title: 'Advanced guide', href: '/selfhosted/selfhosted-guide' },
      { title: 'Management SQLite Store', href: '/selfhosted/sqlite-store'},
      { title: 'Management Postgres Store', href: '/selfhosted/postgres-store'},
      { title: 'Activity Events Postgres Store', href: '/selfhosted/activity-postgres-store'},
      { title: 'Supported IdPs', href: '/selfhosted/identity-providers' },
      { title: 'Management geolocation', href: '/selfhosted/geo-support' },
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
          <TopLevelNavItem href="/slack-url">Support</TopLevelNavItem>
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
