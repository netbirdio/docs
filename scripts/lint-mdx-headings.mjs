#!/usr/bin/env node
/**
 * Lints MDX files for heading-hierarchy violations:
 *   - the first heading on a page must be h1 (the page title)
 *   - heading levels may not jump by more than 1 going down (h1 -> h3 is invalid; h3 -> h1 is fine)
 *
 * Skips src/pages/ipa/resources/ — those are auto-generated from the OpenAPI spec.
 * Headings inside fenced code blocks are ignored.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const PAGES_DIR = path.join(ROOT, 'src/pages')
const SKIP_PREFIX = 'ipa/resources'

function findMdxFiles(dir, basePath = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const results = []
  for (const e of entries) {
    const rel = basePath ? `${basePath}/${e.name}` : e.name
    if (e.isDirectory()) {
      if (rel === SKIP_PREFIX || rel.startsWith(`${SKIP_PREFIX}/`)) continue
      results.push(...findMdxFiles(path.join(dir, e.name), rel))
    } else if (e.name.endsWith('.mdx')) {
      results.push({ relPath: rel, filePath: path.join(dir, e.name) })
    }
  }
  return results
}

function checkHeadings(content) {
  const lines = content.split('\n')
  const violations = []
  let inCodeBlock = false
  let prevLevel = 0
  let prevLine = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (/^```/.test(line)) {
      inCodeBlock = !inCodeBlock
      continue
    }
    if (inCodeBlock) continue

    const match = /^(#{1,6})\s+(.+?)\s*$/.exec(line)
    if (!match) continue

    const level = match[1].length
    const text = match[2]

    if (prevLevel === 0) {
      if (level !== 1) {
        violations.push({
          line: i + 1,
          message: `first heading is h${level} ("${text}"); expected h1`,
        })
      }
    } else if (level > prevLevel + 1) {
      violations.push({
        line: i + 1,
        message: `h${level} ("${text}") skips a level (previous was h${prevLevel} on line ${prevLine})`,
      })
    }

    prevLevel = level
    prevLine = i + 1
  }

  return violations
}

const files = findMdxFiles(PAGES_DIR)
let totalViolations = 0

for (const { relPath, filePath } of files) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const violations = checkHeadings(content)
  if (violations.length > 0) {
    console.error(`\nsrc/pages/${relPath}`)
    for (const v of violations) {
      console.error(`  line ${v.line}: ${v.message}`)
    }
    totalViolations += violations.length
  }
}

if (totalViolations > 0) {
  console.error(`\n${totalViolations} heading hierarchy violation(s) found.`)
  process.exit(1)
}

console.log(`Checked ${files.length} MDX files — no heading hierarchy violations.`)
