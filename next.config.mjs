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
            }
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
