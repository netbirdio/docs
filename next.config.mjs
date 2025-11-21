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


/** @type {import('next').NextConfig} */
const nextConfig = {
    assetPrefix: '/docs-static',
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
                destination: '/how-to/networks',
                permanent: true,
            },
            {
                source: '/docs/getting-started/installation',
                destination: '/how-to/getting-started#installation',
                permanent: true,
            },
            {
                source: '/docs/overview/personal-access-tokens',
                destination: '/how-to/access-netbird-public-api',
                permanent: true,
            },
            {
                source: '/docs/overview/personal-access-tokens',
                destination: '/how-to/access-netbird-public-api',
                permanent: true,
            },
            {
                source: '/docs/overview/acls',
                destination: '/how-to/manage-network-access',
                permanent: true,
            },
            {
                source: '/docs/how-to-guides/nameservers',
                destination: '/how-to/manage-dns-in-your-network',
                permanent: true,
            },
            {
                source: '/docs/how-to-guides/nameservers',
                destination: '/how-to/manage-dns-in-your-network',
                permanent: true,
            },
            {
                source: '/docs/how-to-guides/network-routes',
                destination: '/routing-traffic-to-private-networks',
                permanent: true,
            },
            {
                source: '/docs/overview/setup-keys',
                destination: '/how-to/register-machines-using-setup-keys',
                permanent: true,
            },
            {
                source: '/docs/how-to-guides/activity-monitoring',
                destination: '/how-to/monitor-system-and-network-activity',
                permanent: true,
            },
            {
                source: '/docs/how-to-guides/periodic-authentication',
                destination: '/how-to/enforce-periodic-user-authentication',
                permanent: true,
            },
            {
                source: '/docs/overview/setup-keys',
                destination: '/how-to/register-machines-using-setup-keys',
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
                destination: '/get-started/install/mobile',
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
