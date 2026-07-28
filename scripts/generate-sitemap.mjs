#!/usr/bin/env node
/**
 * Generates public/sitemap.xml by scanning src/pages for .mdx files.
 * Routes under src/pages/ipa/ are emitted as /api/* to match the rewrite
 * in next.config.mjs. Last-modified dates come from git history.
 *
 * Run automatically with dev and build.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { buildGitDateMap } from './git-dates.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const PAGES_DIR = path.join(ROOT, 'src/pages')
const OUT_PATH = path.join(ROOT, 'public/sitemap.xml')

const BASE_URL = 'https://docs.netbird.io'

function findMdxFiles(dir, basePath = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const results = []
  for (const e of entries) {
    if (e.name.startsWith('_')) continue
    const rel = basePath ? `${basePath}/${e.name}` : e.name
    if (e.isDirectory()) {
      results.push(...findMdxFiles(path.join(dir, e.name), rel))
    } else if (e.name.endsWith('.mdx')) {
      const filePath = path.join(dir, e.name)
      const route =
        e.name === 'index.mdx'
          ? basePath
            ? `/${basePath}`
            : '/'
          : `/${rel.replace(/\.mdx$/, '')}`
      results.push({ route, filePath })
    }
  }
  return results
}

function toPublicUrl(route) {
  if (route === '/ipa') return '/api'
  if (route.startsWith('/ipa/')) return `/api/${route.slice(5)}`
  return route
}

function escapeXml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

const gitDates = buildGitDateMap()
const entries = findMdxFiles(PAGES_DIR)
  .map(({ route, filePath }) => ({
    url: toPublicUrl(route),
    lastmod: gitDates.get(path.relative(ROOT, filePath)) ?? null,
  }))
  .sort((a, b) => a.url.localeCompare(b.url))

const seen = new Set()
const unique = entries.filter((e) => {
  if (seen.has(e.url)) return false
  seen.add(e.url)
  return true
})

const urls = unique
  .map(({ url, lastmod }) => {
    const loc = escapeXml(`${BASE_URL}${url}`)
    const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''
    return `  <url>\n    <loc>${loc}</loc>${lastmodTag}\n  </url>`
  })
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true })
fs.writeFileSync(OUT_PATH, xml, 'utf8')
console.log('Generated', OUT_PATH, 'with', unique.length, 'URLs')
