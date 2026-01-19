import { useRouter } from 'next/router'
import clsx from 'clsx'
import {
    ActivePageMarker,
    NavLink,
    TopLevelNavItem,
    VisibleSectionHighlight
} from '@/components/NavigationAPI'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/mdx'
import { useState } from 'react'
import { NavigationStateProvider, useNavigationState } from '@/components/NavigationState'
import ChevronDownIcon from '@/components/icons/ChevronDownIcon'

export const docsNavigation = [
    {
        title: 'ABOUT',
        links: [
            { title: 'How NetBird Works', href: '/about-netbird/how-netbird-works' },
            { title: 'NetBird vs. Traditional VPN', href: '/about-netbird/netbird-vs-traditional-vpn' },
            { title: 'Understanding NAT and Connectivity', href: '/about-netbird/understanding-nat-and-connectivity' },
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
            { title: 'Quickstart Guide', href: '/get-started' },
            {
              title: 'Install NetBird', isOpen: true, href: '/get-started/install',
              links: [
                { title: 'Linux', href: '/get-started/install/linux' },
                { title: 'Windows', href: '/get-started/install/windows' },
                { title: 'MacOS', href: '/get-started/install/macos' },
                { title: 'Docker', href: '/get-started/install/docker' },
                { title: 'iOS', href: '/get-started/install/ios' },
                { title: 'Android', href: '/get-started/install/android' },
              ],
            },
            {
              title: 'Platforms', isOpen: false,
              links: [
                { title: 'Proxmox VE', href: '/get-started/install/proxmox-ve' },
                { title: 'Synology', href: '/get-started/install/synology' },
                { title: 'pfSense', href: '/get-started/install/pfsense' },
                { title: 'OPNsense', href: '/get-started/install/opnsense' },
                { title: 'Raspberry Pi', href: '/get-started/install/raspberrypi' },
              ]
            },
            { title: 'CLI', href: '/get-started/cli' },
        ],
    },
    {
        title: 'MANAGE NETBIRD',
        links: [
            { title: 'Control Center', href: '/manage/control-center' },
            {
                title: 'Peers',
                isOpen: false,
                links: [
                    { title: 'Add Peers', href: '/manage/peers/add-machines-to-your-network' },
                    { title: 'Approve Peers', href: '/manage/peers/approve-peers' },
                    { title: 'Setup Keys', href: '/manage/peers/register-machines-using-setup-keys' },
                    { title: 'Browser Client', href: '/manage/peers/browser-client' },
                    { title: 'SSH', href: '/manage/peers/ssh' },
                    { title: 'Lazy Connections', href: '/manage/peers/lazy-connection' },
                    {
                        title: 'Access Infrastructure',
                        isOpen: true,
                        links: [
                            {
                                title: 'Access Remote Webserver',
                                href: '/manage/peers/access-infrastructure/secure-remote-webserver-access'
                            },
                            {
                                title: 'Add Servers to the Network',
                                href: '/manage/peers/access-infrastructure/setup-keys-add-servers-to-network'
                            },
                            {
                                title: 'Access from Kubernetes',
                                href: '/manage/peers/access-infrastructure/access-internal-resources-from-autoscaled-environments'
                            },
                            {
                                title: 'Peer Approval for Remote Access',
                                href: '/manage/peers/access-infrastructure/peer-approval-for-remote-worker-access'
                            },
                        ]
                    },
                    {
                        title: 'Connect Site-to-Site',
                        isOpen: true,
                        links: [
                            {
                                title: 'Simplify Workload Migrations',
                                href: '/manage/peers/site-to-site/db-workload-migration'
                            },
                        ]
                    },
                    { title: 'Auto Update', href: '/manage/peers/auto-update' },
                ]
            },
            {
                title: 'Access Control',
                isOpen: false,
                links: [
                    { title: 'Groups & Policies', href: '/manage/access-control' },
                    { title: 'Manage Access', href: '/manage/access-control/manage-network-access' },
                    {
                        title: 'Posture Checks',
                        href: '/manage/access-control/posture-checks',
                        isOpen: false,
                        links: [
                            { title: 'Disable route when in the office', href: '/manage/access-control/posture-checks/connecting-from-the-office' },
                        ]
                    },
                    {
                        title: 'Integrate MDM & EDR',
                        href: '/manage/access-control/endpoint-detection-and-response',
                        isOpen: false,
                        links: [
                            { title: 'CrowdStrike Falcon', href: '/manage/access-control/endpoint-detection-and-response/crowdstrike-edr' },
                            { title: 'Microsoft Intune', href: '/manage/access-control/endpoint-detection-and-response/intune-mdm' },
                            { title: 'SentinelOne Singularity', href: '/manage/access-control/endpoint-detection-and-response/sentinelone-edr' },
                            { title: 'Huntress', href: '/manage/access-control/endpoint-detection-and-response/huntress-edr' },
                        ]
                    },
                ]
            },
            {
                title: 'Networks',
                isOpen: false,
                links: [
                    { title: 'Concept', href: '/manage/networks' },
                    { title: 'Route Traffic to Multiple IP resources', href: '/manage/networks/routing-traffic-to-multiple-resources' },
                    { title: 'Access Restricted Website Domain Resources', href: '/manage/networks/accessing-restricted-domain-resources' },
                    { title: 'Access Entire Domains Within Networks', href: '/manage/networks/accessing-entire-domains-within-networks' },
                    {
                        title: 'Homelab',
                        isOpen: true,
                        links: [
                            { title: 'Access Home Network', href: '/manage/networks/homelab/access-home-network' },
                        ]
                    },
                ]
            },
            {
                title: 'Network Routes',
                isOpen: false,
                links: [
                    { title: 'Route Traffic to Private Networks', href: '/manage/network-routes/routing-traffic-to-private-networks' },
                    { title: 'Configure Default Routes for Internet Traffic', href: '/manage/network-routes/configuring-default-routes-for-internet-traffic' },
                    { title: 'Configure Routes with Access control', href: '/manage/network-routes/configuring-routes-with-access-control' },
                    { title: 'Resolve Overlapping Routes', href: '/manage/network-routes/resolve-overlapping-routes' },
                ]
            },
            {
                title: 'DNS',
                isOpen: false,
                links: [
                    { title: 'Overview', href: '/manage/dns' },
                    { title: 'Configuring Nameservers', href: '/manage/dns/nameserver-groups' },
                    { title: 'DNS Settings', href: '/manage/dns/dns-settings' },
                    { title: 'Custom Zones', href: '/manage/dns/custom-zones' },
                    { title: 'DNS Aliases for Routed Networks', href: '/manage/dns/dns-aliases-for-routed-networks' },
                    { title: 'DNS Troubleshooting', href: '/manage/dns/troubleshooting' },
                ]
            },
            {
                title: 'Team',
                isOpen: false,
                links: [
                    { title: 'Add Users to Your Network', href: '/manage/team/add-users-to-your-network' },
                    { title: 'Approve Users', href: '/manage/team/approve-users' },
                    {
                        title: 'Provision Users & Groups',
                        href: '/manage/team/idp-sync',
                        isOpen: false,
                        links: [
                            { title: 'Microsoft Entra ID (API)', href: '/manage/team/idp-sync/microsoft-entra-id-sync' },
                            { title: 'Microsoft Entra ID (SCIM)', href: '/manage/team/idp-sync/microsoft-entra-id-scim-sync' },
                            { title: 'Okta', href: '/manage/team/idp-sync/okta-sync' },
                            { title: 'Google Workspace', href: '/manage/team/idp-sync/google-workspace-sync' },
                            { title: 'JumpCloud', href: '/manage/team/idp-sync/jumpcloud-sync' },
                            { title: 'Keycloak', href: '/manage/team/idp-sync/keycloak-sync' },
                        ]
                    },
                    {
                        title: 'Auto-Offboard Users',
                        href: '/manage/team/auto-offboard-users',
                        isOpen: false,
                    },
                    {
                        title: 'Single Sign-On',
                        href: '/manage/team/single-sign-on',
                        isOpen: false,
//                        links: [
//                            { title: 'Authentik', href: '/manage/team/single-sign-on/authentik' },
//                            { title: 'Keycloak', href: '/manage/team/single-sign-on/keycloak' },
//                            { title: 'Auth0', href: '/manage/team/single-sign-on/auth0' },
//                            { title: 'JumpCloud', href: '/manage/team/single-sign-on/jumpcloud' },
//                        ]
                    },
                ]
            },
            {
                title: 'Activity',
                links: [
                    { title: 'Audit Events Logging', href: '/manage/activity' },
                    { title: 'Traffic Events Logging', href: '/manage/activity/traffic-events-logging' },
                    {
                        title: 'Stream Activity Events',
                        href: '/manage/activity/event-streaming',
                        isOpen: false,
                        links: [
                            { title: 'Datadog', href: '/manage/activity/event-streaming/datadog' },
                            { title: 'Amazon S3', href: '/manage/activity/event-streaming/amazon-s3' },
                            { title: 'Amazon Firehose', href: '/manage/activity/event-streaming/amazon-firehose' },
                            { title: 'SentinelOne Data Lake', href: '/manage/activity/event-streaming/sentinelone-data-lake' },
                            { title: 'Generic HTTP', href: '/manage/activity/event-streaming/generic-http' },
                        ]
                    },
                ],
            },
            {
                title: 'Settings',
                isOpen: false,
                links: [
                    { title: 'Authentication', href: '/manage/settings/enforce-periodic-user-authentication' },
                    { title: 'Multi-Factor Authentication', href: '/manage/settings/multi-factor-authentication' },
                    { title: 'Delete Account', href: '/manage/settings/delete-account' },
                    { title: 'Plans and Billing', href: '/manage/settings/plans-and-billing' },
                    { title: 'Auto Update', href: '/manage/peers/auto-update' },
                    { title: 'Lazy Connections', href: '/manage/peers/lazy-connection' },
                ]
            },
            {
                title: 'Integrations',
                isOpen: false,
                links: [
                    { title: 'Enable Post Quantum Cryptography', href: '/manage/integrations/enable-post-quantum-cryptography' },
                    {
                        title: 'MDM for Deployment',
                        isOpen: true,
                        links: [
                            { title: 'Deploy with Jamf Pro', href: '/manage/integrations/mdm-deployment/jamf-pro-netbird-integration' },
                            { title: 'Deploy with Kandji', href: '/manage/integrations/mdm-deployment/kandji-netbird-integration' },
                            { title: 'Deploy with Intune', href: '/manage/integrations/mdm-deployment/intune-netbird-integration' },
                        ]
                    },
                    {
                        title: 'Kubernetes',
                        isOpen: true,
                        links: [
                            { title: 'Operator', href: '/manage/integrations/kubernetes' },
                        ]
                    },
                ]
            },

            {
                title: 'Public API',
                isOpen: false,
                links: [
                    { title: 'Access Public API', href: '/manage/public-api' },
                ]
            },
            {
                title: 'For Partners',
                isOpen: false,
                links: [
                    { title: 'Managed Service Providers', href: '/manage/for-partners/msp-portal' },
                    { title: 'Acronis NetBird integration', href: '/manage/for-partners/acronis-integration' },
                ]
            },
        ],
    },
    {
        title: 'CLIENT',
        links: [
            { title: 'Profiles', href: '/client/profiles' },
        ],
    },
    {
        title: 'SELF-HOST NETBIRD',
        links: [
            { title: 'Quickstart Guide', href: '/selfhosted/selfhosted-quickstart' },
            {
                title: 'Authentication',
                isOpen: false,
                links: [
                    { title: 'Authentication and IdPs', href: '/selfhosted/identity-providers' },
                    { title: 'Local User Management', href: '/selfhosted/identity-providers/local' },
                    {
                        title: 'Self-hosted IdPs',
                        isOpen: true,
                        links: [
                            { title: 'Zitadel', href: '/selfhosted/identity-providers/zitadel' },
                            { title: 'Authentik', href: '/selfhosted/identity-providers/authentik' },
                            { title: 'Keycloak', href: '/selfhosted/identity-providers/keycloak' },
                            { title: 'PocketID', href: '/selfhosted/identity-providers/pocketid' },
                        ]
                    },
                    {
                        title: 'Managed IdPs',
                        isOpen: true,
                        links: [
                            { title: 'Google Workspace', href: '/selfhosted/identity-providers/managed/google-workspace' },
                            { title: 'Microsoft Entra ID', href: '/selfhosted/identity-providers/managed/microsoft-entra-id' },
                            { title: 'JumpCloud', href: '/selfhosted/identity-providers/managed/jumpcloud' },
                            { title: 'Auth0', href: '/selfhosted/identity-providers/managed/auth0' },
                            { title: 'Okta', href: '/selfhosted/identity-providers/managed/okta' },
                        ]
                    },
                ]
            },
            { title: 'Reverse Proxy', href: '/selfhosted/reverse-proxy' },
            { title: 'Advanced Guide', href: '/selfhosted/selfhosted-guide' },
            { title: 'Management SQLite Store', href: '/selfhosted/sqlite-store' },
            { title: 'Management Postgres Store', href: '/selfhosted/postgres-store' },
            { title: 'Activity Events Postgres Store', href: '/selfhosted/activity-postgres-store' },
            { title: 'Management geolocation', href: '/selfhosted/geo-support' },
            { title: 'Troubleshooting', href: '/selfhosted/troubleshooting' },
        ],
    },
    {
        title: 'USE CASES',
        links: [
            { title: 'Site-to-Site and Site-to-VPN', href: '/use-cases/setup-site-to-site-access' },
            { title: 'Serverless and NetBird', href: '/use-cases/netbird-on-faas' },
            { title: 'Routing peers and Kubernetes', href: '/use-cases/routing-peers-and-kubernetes' },
            { title: 'NetBird Client on AWS ECS', href: '/use-cases/examples' },
            { title: 'NetBird on Mikrotik Router', href: '/use-cases/client-on-mikrotik-router' },
            { title: 'Distributed AI on Kubernetes', href: '/use-cases/distributed-multi-cloud-ai-argocd-microk8s-vllm' },
            { title: 'Self-hosted vs. Cloud-hosted NetBird', href: '/selfhosted/self-hosted-vs-cloud-netbird' },
        ],
    },
    {
        title: 'GET MORE HELP',
        links: [
            { title: 'Troubleshooting client issues', href: '/help/troubleshooting-client' },
            { title: 'Report bugs and issues', href: '/help/report-bug-issues' },
        ],
    },
]
 
export function NavigationDocs({ className }) {
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
    let activeIndex = -1
    group.links.forEach((link, index) => {
        if (link.href === pathname) {
            activeIndex = index
        } else if (link.links) {
            const childIndex = findActiveGroupIndex(link, pathname)
            if (childIndex !== -1) {
                activeIndex = index
            }
        }
    })
    return activeIndex
}

function NavigationGroup({ group, className, hasChildren }) {
    let router = useRouter()
    let isActiveGroup = findActiveGroupIndex(group, router.pathname) !== -1
    const [isOpen, setIsOpen] = useState(group.isOpen ? group.isOpen : !hasChildren)
    const [, setActiveHighlight] = useNavigationState()

    return (
        <li className={clsx('relative', className, hasChildren ? '' : 'mt-6')}>
            <motion.h2
                // layout={"size"}
                className={clsx(
                    'flex justify-between items-center gap-2 group',
                    hasChildren ? 'text-zinc-700 select-none py-1 pr-3 hover:text-zinc-900 dark:text-zinc-300 font-medium dark:hover:text-white text-sm cursor-pointer' : 'text-xs font-semibold text-zinc-900 dark:text-white'
                )}
                onClick={() => {
                    setIsOpen(!isOpen)
                    if (!isOpen) {
                        if (!isActiveGroup) router.push(group.links[0].href)
                        setActiveHighlight()
                    } else {
                        setActiveHighlight(group.title)
                    }
                }}
                data-nb-link={group.title}
                data-nb-active={hasChildren && isActiveGroup ? '1' : '0'}
            >
                {group.title}
                {hasChildren && <ChevronDownIcon className={clsx('fill-zinc-700 group-hover:fill-zinc-900 dark:fill-zinc-300 dark:group-hover:fill-white', 'transition', isOpen ? 'transform rotate-180' : '')} size={10} />}
            </motion.h2>
            <div className={clsx('relative', hasChildren ? '' : 'mt-3 pl-2')}>
                {!hasChildren &&
                    <>
                        <AnimatePresence>
                            {isActiveGroup && (
                                <VisibleSectionHighlight group={group} pathname={router.pathname} />
                            )}
                        </AnimatePresence>
                        <motion.div
                            // layout
                            className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/5"
                        />
                        <AnimatePresence initial={false}>
                            {isActiveGroup && (
                                <ActivePageMarker group={group} pathname={router.pathname} />
                            )}
                        </AnimatePresence>
                    </>
                }

                <AnimatePresence mode={'wait'} initial={false}>
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
                        {group.links.map((link) => {
                            return link.href ?
                                <motion.li key={link.href} className="relative">
                                    <NavLink href={link.href} active={link.href === router.pathname} links={link.links}>
                                        {link.title}
                                    </NavLink>
                                </motion.li>
                                :
                                <NavigationGroup className={'ml-4'} key={link.title + isOpen} group={link} hasChildren={true} />
                        })}
                    </motion.ul>}
                </AnimatePresence>
            </div>
        </li>
    )
}