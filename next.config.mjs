import nextMDX from '@next/mdx'
import {remarkPlugins} from './mdx/remark.mjs'
import {rehypePlugins} from './mdx/rehype.mjs'
import {recmaPlugins} from './mdx/recma.mjs'

const withMDX = nextMDX({
    options: {
        remarkPlugins,
        // rehypeSlug,
        rehypePlugins,
        recmaPlugins,
        providerImportSource: '@mdx-js/react',
    },
})


const isProd = process.env.NODE_ENV === 'production'

/** @type {import('next').NextConfig} */
const nextConfig = {
    assetPrefix: isProd ? '/docs-static' : undefined,
    reactStrictMode: true,
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
    experimental: {
        scrollRestoration: true,
    },
    redirects: async () => {
        return [
            {
                source: '/slack-url',
                destination: 'https://join.slack.com/t/netbirdio/shared_invite/zt-3i1ppsk7o-pJUUiC1ZcxcjNR_A3EUr6w',
                permanent: false,
            },
            {
                source: '/how-to/networks-concept',
                destination: '/manage/networks',
                permanent: true,
            },
            {
                source: '/docs/getting-started/installation',
                destination: '/get-started/install',
                permanent: true,
            },
            {
                source: '/docs/overview/personal-access-tokens',
                destination: '/manage/public-api',
                permanent: true,
            },
            {
                source: '/docs/overview/acls',
                destination: '/manage/access-control/manage-network-access',
                permanent: true,
            },
            {
                source: '/docs/how-to-guides/nameservers',
                destination: '/manage/dns/nameserver-groups',
                permanent: true,
            },
            {
                source: '/how-to/manage-dns-in-your-network',
                destination: '/manage/dns',
                permanent: true,
            },
            {
                source: '/docs/how-to-guides/network-routes',
                destination: '/manage/network-routes/routing-traffic-to-private-networks',
                permanent: true,
            },
            {
                source: '/docs/overview/setup-keys',
                destination: '/manage/peers/register-machines-using-setup-keys',
                permanent: true,
            },
            {
                source: '/docs/how-to-guides/activity-monitoring',
                destination: '/manage/activity/traffic-events-logging',
                permanent: true,
            },
            {
                source: '/docs/how-to-guides/periodic-authentication',
                destination: '/manage/settings/enforce-periodic-user-authentication',
                permanent: true,
            },
            {
                source: '/docs/overview/setup-keys',
                destination: '/manage/peers/register-machines-using-setup-keys',
                permanent: true,
            },
            {
                source: '/docs',
                destination: '/',
                permanent: true,
            },
            {
                source: '/docs/:path*',
                destination: '/:path*',
                permanent: true,
            },
            {
                source: '/ipa/:path*',
                destination: '/api/:path*',
                permanent: true
            },
            // documentation redirects for access control
            {
                source: '/how-to/manage-network-access',
                destination: '/manage/access-control/manage-network-access',
                permanent: true,
            },
            {
                source: '/how-to/manage-posture-checks',
                destination: '/manage/access-control/posture-checks',
                permanent: true,
            },
            {
                source: '/how-to/disabling-network-route-when-connecting-from-the-office',
                destination: '/manage/access-control/posture-checks/connecting-from-the-office',
                permanent: true,
            },
            {
                source: '/how-to/endpoint-detection-and-response',
                destination: '/manage/access-control/endpoint-detection-and-response',
                permanent: true,
            },
            {
                source: '/how-to/crowdstrike-edr',
                destination: '/manage/access-control/endpoint-detection-and-response/crowdstrike-edr',
                permanent: true,
            },
            {
                source: '/how-to/sentinelone-edr',
                destination: '/manage/access-control/endpoint-detection-and-response/sentinelone-edr',
                permanent: true,
            },
            {
                source: '/how-to/huntress-edr',
                destination: '/manage/access-control/endpoint-detection-and-response/huntress-edr',
                permanent: true,
            },
            {
                source: '/how-to/intune-mdm',
                destination: '/manage/access-control/endpoint-detection-and-response/intune-mdm',
                permanent: true,
            },
            // documentation redirects for get-started
            {
                source: '/how-to/getting-started',
                destination: '/get-started',
                permanent: true,
            },
            {
                source: '/how-to/installation',
                destination: '/get-started/install',
                permanent: true,
            },
            {
                source: '/how-to/installation/linux',
                destination: '/get-started/install/linux',
                permanent: true,
            },
            {
                source: '/how-to/installation/windows',
                destination: '/get-started/install/windows',
                permanent: true,
            },
            {
                source: '/how-to/installation/macos',
                destination: '/get-started/install/macos',
                permanent: true,
            },
            {
                source: '/how-to/installation/docker',
                destination: '/get-started/install/docker',
                permanent: true,
            },
            {
                source: '/how-to/installation/synology',
                destination: '/get-started/install/synology',
                permanent: true,
            },
            {
                source: '/how-to/installation/mobile',
                destination: '/get-started/install',
                permanent: true,
            },
            {
                source: '/how-to/installation/pfsense',
                destination: '/get-started/install/pfsense',
                permanent: true,
            },
            {
                source: '/how-to/installation/opnsense',
                destination: '/get-started/install/opnsense',
                permanent: true,
            },
            {
                source: '/how-to/cli',
                destination: '/get-started/cli',
                permanent: true,
            },
            // documentation redirects for peers
            {
                source: '/how-to/add-machines-to-your-network',
                destination: '/manage/peers/add-machines-to-your-network',
                permanent: true,
            },
            {
                source: '/how-to/approve-peers',
                destination: '/manage/peers/approve-peers',
                permanent: true,
            },
            {
                source: '/how-to/register-machines-using-setup-keys',
                destination: '/manage/peers/register-machines-using-setup-keys',
                permanent: true,
            },
            {
                source: '/how-to/browser-client',
                destination: '/manage/peers/browser-client',
                permanent: true,
            },
            {
                source: '/how-to/ssh',
                destination: '/manage/peers/ssh',
                permanent: true,
            },
            {
                source: '/how-to/lazy-connection',
                destination: '/manage/peers/lazy-connection',
                permanent: true,
            },
            {
                source: '/how-to/secure-remote-webserver-access',
                destination: '/manage/peers/access-infrastructure/secure-remote-webserver-access',
                permanent: true,
            },
            {
                source: '/how-to/setup-keys-add-servers-to-network',
                destination: '/manage/peers/access-infrastructure/setup-keys-add-servers-to-network',
                permanent: true,
            },
            {
                source: '/how-to/access-internal-resources-from-autoscaled-environments',
                destination: '/manage/peers/access-infrastructure/access-internal-resources-from-autoscaled-environments',
                permanent: true,
            },
            {
                source: '/how-to/peer-approval-for-remote-worker-access',
                destination: '/manage/peers/access-infrastructure/peer-approval-for-remote-worker-access',
                permanent: true,
            },
            {
                source: '/how-to/db-workload-migration',
                destination: '/manage/peers/site-to-site/db-workload-migration',
                permanent: true,
            },
            // documentation redirects for use-cases
            {
                source: '/how-to/examples',
                destination: '/use-cases/examples',
                permanent: true,
            },
            {
                source: '/how-to/netbird-on-faas',
                destination: '/use-cases/netbird-on-faas',
                permanent: true,
            },
            {
                source: '/how-to/routing-peers-and-kubernetes',
                destination: '/use-cases/routing-peers-and-kubernetes',
                permanent: true,
            },
            {
                source: '/how-to/client-on-mikrotik-router',
                destination: '/use-cases/client-on-mikrotik-router',
                permanent: true,
            },
            {
                source: '/how-to/distributed-multi-cloud-ai-argocd-microk8s-vllm',
                destination: '/use-cases/distributed-multi-cloud-ai-argocd-microk8s-vllm',
                permanent: true,
            },
            // documentation redirects for networks
            {
                source: '/how-to/networks',
                destination: '/manage/networks',
                permanent: true,
            },
            {
                source: '/how-to/routing-traffic-to-multiple-resources',
                destination: '/manage/networks/routing-traffic-to-multiple-resources',
                permanent: true,
            },
            {
                source: '/how-to/accessing-restricted-domain-resources',
                destination: '/manage/networks/accessing-restricted-domain-resources',
                permanent: true,
            },
            {
                source: '/how-to/accessing-entire-domains-within-networks',
                destination: '/manage/networks/accessing-entire-domains-within-networks',
                permanent: true,
            },
            {
                source: '/how-to/access-home-network',
                destination: '/manage/networks/homelab/access-home-network',
                permanent: true,
            },
            // documentation redirects for network-routes
            {
                source: '/how-to/routing-traffic-to-private-networks',
                destination: '/manage/network-routes/routing-traffic-to-private-networks',
                permanent: true,
            },
            {
                source: '/how-to/configuring-default-routes-for-internet-traffic',
                destination: '/manage/network-routes/configuring-default-routes-for-internet-traffic',
                permanent: true,
            },
            {
                source: '/how-to/configuring-routes-with-access-control',
                destination: '/manage/network-routes/configuring-routes-with-access-control',
                permanent: true,
            },
            {
                source: '/how-to/resolve-overlapping-routes',
                destination: '/manage/network-routes/resolve-overlapping-routes',
                permanent: true,
            },
            {
                source: '/how-to/control-center',
                destination: '/manage/control-center',
                permanent: true,
            },
            // documentation redirects for activity
            {
                source: '/how-to/audit-events-logging',
                destination: '/manage/activity',
                permanent: true,
            },
            {
                source: '/how-to/traffic-events-logging',
                destination: '/manage/activity/traffic-events-logging',
                permanent: true,
            },
            {
                source: '/how-to/activity-event-streaming',
                destination: '/manage/activity/event-streaming',
                permanent: true,
            },
            {
                source: '/how-to/stream-activity-to-datadog',
                destination: '/manage/activity/event-streaming/datadog',
                permanent: true,
            },
            {
                source: '/how-to/stream-activity-to-amazon-s3',
                destination: '/manage/activity/event-streaming/amazon-s3',
                permanent: true,
            },
            {
                source: '/how-to/stream-activity-to-amazon-firehose',
                destination: '/manage/activity/event-streaming/amazon-firehose',
                permanent: true,
            },
            {
                source: '/how-to/stream-activity-to-sentinelone-data-lake',
                destination: '/manage/activity/event-streaming/sentinelone-data-lake',
                permanent: true,
            },
            {
                source: '/how-to/stream-activity-to-generic-http',
                destination: '/manage/activity/event-streaming/generic-http',
                permanent: true,
            },
            {
                source: '/how-to/monitor-system-and-network-activity',
                destination: '/manage/activity/traffic-events-logging',
                permanent: true,
            },
            // documentation redirects for team
            {
                source: '/how-to/idp-sync',
                destination: '/manage/team/idp-sync',
                permanent: true,
            },
            {
                source: '/how-to/add-users-to-your-network',
                destination: '/manage/team/add-users-to-your-network',
                permanent: true,
            },
            {
                source: '/how-to/approve-users',
                destination: '/manage/team/approve-users',
                permanent: true,
            },
            {
                source: '/how-to/auto-offboard-users',
                destination: '/manage/team/auto-offboard-users',
                permanent: true,
            },
            {
                source: '/how-to/single-sign-on',
                destination: '/manage/team/single-sign-on',
                permanent: true,
            },
            {
                source: '/how-to/microsoft-entra-id-sync',
                destination: '/manage/team/idp-sync/microsoft-entra-id-sync',
                permanent: true,
            },
            {
                source: '/how-to/okta-sync',
                destination: '/manage/team/idp-sync/okta-sync',
                permanent: true,
            },
            {
                source: '/how-to/google-workspace-sync',
                destination: '/manage/team/idp-sync/google-workspace-sync',
                permanent: true,
            },
            {
                source: '/how-to/jumpcloud-sync',
                destination: '/manage/team/idp-sync/jumpcloud-sync',
                permanent: true,
            },
            {
                source: '/how-to/keycloak-sync',
                destination: '/manage/team/idp-sync/keycloak-sync',
                permanent: true,
            },
            // documentation redirects for settings
            {
                source: '/how-to/enforce-periodic-user-authentication',
                destination: '/manage/settings/enforce-periodic-user-authentication',
                permanent: true,
            },
            {
                source: '/how-to/multi-factor-authentication',
                destination: '/manage/settings/multi-factor-authentication',
                permanent: true,
            },
            {
                source: '/how-to/delete-account',
                destination: '/manage/settings/delete-account',
                permanent: true,
            },
            {
                source: '/how-to/plans-and-billing',
                destination: '/manage/settings/plans-and-billing',
                permanent: true,
            },
            // documentation redirects for integrations
            {
                source: '/how-to/enable-post-quantum-cryptography',
                destination: '/manage/integrations/enable-post-quantum-cryptography',
                permanent: true,
            },
            {
                source: '/how-to/jamf-pro-netbird-integration',
                destination: '/manage/integrations/mdm-deployment/jamf-pro-netbird-integration',
                permanent: true,
            },
            {
                source: '/how-to/kandji-netbird-integration',
                destination: '/manage/integrations/mdm-deployment/kandji-netbird-integration',
                permanent: true,
            },
            {
                source: '/how-to/intune-netbird-integration',
                destination: '/manage/integrations/mdm-deployment/intune-netbird-integration',
                permanent: true,
            },
            {
                source: '/how-to/kubernetes-operator',
                destination: '/manage/integrations/kubernetes',
                permanent: true,
            },
            // documentation redirects for public-api
            {
                source: '/how-to/access-netbird-public-api',
                destination: '/manage/public-api',
                permanent: true,
            },
            // documentation redirects for for-partners
            {
                source: '/how-to/msp-portal',
                destination: '/manage/for-partners/msp-portal',
                permanent: true,
            },
            {
                source: '/how-to/acronis-netbird-integration',
                destination: '/manage/for-partners/acronis-integration',
                permanent: true,
            },
            // documentation redirects for client
            {
                source: '/how-to/profiles',
                destination: '/client/profiles',
                permanent: true,
            },
            // documentation redirects for help
            {
                source: '/how-to/troubleshooting-client',
                destination: '/help/troubleshooting-client',
                permanent: true,
            },
            {
                source: '/how-to/report-bug-issues',
                destination: '/help/report-bug-issues',
                permanent: true,
            },
        ]
    },
    rewrites: async () => {
        return [
            {
                source: '/',
                destination: '/introduction',
            },
            {
                source: '/api',
                destination: '/ipa/introduction',
            },
            {
                source: '/api/:path*',
                destination: '/ipa/:path*',
            }
        ]
    }
}

export default withMDX(nextConfig)
