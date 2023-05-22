import nextMDX from '@next/mdx'
import { remarkPlugins } from './mdx/remark.mjs'
import { rehypePlugins } from './mdx/rehype.mjs'
import { recmaPlugins } from './mdx/recma.mjs'
import rehypeSlug from "rehype-slug";

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
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  experimental: {
    scrollRestoration: true,
  },
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/docs/introduction',
        permanent: true,
      },
      {
        source: '/docs',
        destination: '/docs/introduction',
        permanent: true,
      },
      {
        source: '/ipa',
        destination: '/ipa/introduction',
        permanent: true,
      },
    ]
  }
}

export default withMDX(nextConfig)
