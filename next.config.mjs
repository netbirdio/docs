import nextMDX from '@next/mdx'
import { remarkPlugins } from './mdx/remark.mjs'
import { rehypePlugins } from './mdx/rehype.mjs'
import { recmaPlugins } from './mdx/recma.mjs'

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
  rewrites: async () => {
    return [
      {
        source: '/',
        destination: '/docs/introduction',
      },
      {
        source: '/docs',
        destination: '/docs/introduction',
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
