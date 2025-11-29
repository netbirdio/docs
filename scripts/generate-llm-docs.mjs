#!/usr/bin/env node
/**
 * LLM Documentation Generator
 *
 * Generates clean markdown files from MDX pages for LLM indexing.
 * Creates:
 * - public/llms/*.md - Clean markdown versions of each page
 * - public/llms.txt - Index file linking to all pages
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');
const PAGES_DIR = path.join(ROOT_DIR, 'src/pages');
const OUTPUT_DIR = path.join(ROOT_DIR, 'public/llms');
const LLMS_TXT_PATH = path.join(ROOT_DIR, 'public/llms.txt');

// Base URL for the docs site
const BASE_URL = 'https://docs.netbird.io';

/**
 * Strip JSX/React components from MDX content, keeping clean markdown
 */
function stripJsx(content) {
  let result = content;

  // Remove import statements
  result = result.replace(/^import\s+.*?[;\n]/gm, '');

  // Remove export statements (but keep the content if it's a description)
  result = result.replace(/^export\s+const\s+description\s*=\s*(['"`])(.+?)\1;?\s*$/gm, '');
  result = result.replace(/^export\s+.*?[;\n]/gm, '');

  // Remove JSX self-closing tags like <Note />, <Button />, etc.
  result = result.replace(/<[A-Z][a-zA-Z]*\s*\/>/g, '');

  // Remove JSX components with children like <Note>...</Note>
  // Handle multi-line JSX blocks
  result = result.replace(/<([A-Z][a-zA-Z]*)[^>]*>[\s\S]*?<\/\1>/g, (match, tagName) => {
    // For Note components, try to extract the text content
    if (tagName === 'Note' || tagName === 'Warning' || tagName === 'Info') {
      const innerContent = match.replace(/<[^>]+>/g, '').trim();
      if (innerContent) {
        return `> **Note:** ${innerContent}\n`;
      }
    }
    return '';
  });

  // Remove remaining JSX tags but keep inner text for simple cases
  result = result.replace(/<([a-z][a-zA-Z]*)[^>]*>([\s\S]*?)<\/\1>/g, '$2');

  // Remove self-closing HTML/JSX tags with attributes
  result = result.replace(/<[a-zA-Z]+[^>]*\/>/g, '');

  // Remove div tags with className (common in MDX)
  result = result.replace(/<div[^>]*className[^>]*>[\s\S]*?<\/div>/g, '');

  // Remove iframe embeds (videos, etc.)
  result = result.replace(/<iframe[\s\S]*?<\/iframe>/g, '[Video content]');
  result = result.replace(/<iframe[^>]*\/>/g, '[Video content]');

  // Remove Button components but note the link
  result = result.replace(/<Button[^>]*href="([^"]*)"[^>]*>([^<]*)<\/Button>/g, '[$2]($1)');
  result = result.replace(/<Button[^>]*children="([^"]*)"[^>]*href="([^"]*)"[^>]*\/>/g, '[$1]($2)');
  result = result.replace(/<Button[^>]*href="([^"]*)"[^>]*children="([^"]*)"[^>]*\/>/g, '[$2]($1)');

  // Clean up excessive newlines
  result = result.replace(/\n{3,}/g, '\n\n');

  // Clean up leading/trailing whitespace
  result = result.trim();

  return result;
}

/**
 * Extract title from MDX content
 */
function extractTitle(content) {
  // Try to find # heading
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match) {
    return h1Match[1].trim();
  }
  return null;
}

/**
 * Get all MDX files recursively
 */
function getMdxFiles(dir, baseDir = dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip api/ipa directories if you want (they're auto-generated)
      files.push(...getMdxFiles(fullPath, baseDir));
    } else if (entry.name.endsWith('.mdx')) {
      const relativePath = path.relative(baseDir, fullPath);
      files.push({
        fullPath,
        relativePath,
        slug: relativePath.replace(/\.mdx$/, '').replace(/\/index$/, ''),
      });
    }
  }

  return files;
}

/**
 * Main generation function
 */
async function generate() {
  console.log('Generating LLM documentation...\n');

  // Ensure output directory exists
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true });
  }
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Get all MDX files
  const mdxFiles = getMdxFiles(PAGES_DIR);
  console.log(`Found ${mdxFiles.length} MDX files\n`);

  const pages = [];

  for (const file of mdxFiles) {
    const content = fs.readFileSync(file.fullPath, 'utf-8');
    const cleanContent = stripJsx(content);
    const title = extractTitle(cleanContent) || file.slug.split('/').pop();

    // Create output path maintaining directory structure
    const outputPath = path.join(OUTPUT_DIR, `${file.slug}.md`);
    const outputDir = path.dirname(outputPath);

    // Ensure directory exists
    fs.mkdirSync(outputDir, { recursive: true });

    // Add metadata header
    const finalContent = `# ${title}\n\nSource: ${BASE_URL}/${file.slug}\n\n---\n\n${cleanContent}`;

    fs.writeFileSync(outputPath, finalContent);

    pages.push({
      title,
      slug: file.slug,
      path: `/llms/${file.slug}.md`,
    });

    console.log(`  Generated: ${file.slug}.md`);
  }

  // Generate llms.txt
  const llmsTxt = generateLlmsTxt(pages);
  fs.writeFileSync(LLMS_TXT_PATH, llmsTxt);
  console.log(`\nGenerated llms.txt with ${pages.length} pages`);

  console.log('\nDone!');
}

/**
 * Generate llms.txt content
 */
function generateLlmsTxt(pages) {
  // Group pages by section
  const sections = {};
  for (const page of pages) {
    const parts = page.slug.split('/');
    const section = parts[0] || 'root';
    if (!sections[section]) {
      sections[section] = [];
    }
    sections[section].push(page);
  }

  let content = `# NetBird Documentation

> NetBird is an open-source WireGuard-based mesh VPN platform that creates secure private networks.
> This file provides an index of all documentation pages in markdown format for LLM consumption.

## About

- Website: https://netbird.io
- Documentation: ${BASE_URL}
- GitHub: https://github.com/netbirdio/netbird

## Documentation Index

Each link below points to a clean markdown version of the documentation page.

`;

  // Section display names
  const sectionNames = {
    'introduction': 'Introduction',
    'about-netbird': 'About NetBird',
    'get-started': 'Getting Started',
    'manage': 'Managing NetBird',
    'selfhosted': 'Self-Hosting',
    'ipa': 'API Reference',
    'use-cases': 'Use Cases',
    'client': 'Client',
    'help': 'Help & Troubleshooting',
  };

  for (const [section, sectionPages] of Object.entries(sections)) {
    const sectionTitle = sectionNames[section] || section.charAt(0).toUpperCase() + section.slice(1);
    content += `### ${sectionTitle}\n\n`;

    for (const page of sectionPages) {
      content += `- [${page.title}](${BASE_URL}${page.path})\n`;
    }
    content += '\n';
  }

  content += `---

## Usage

LLMs can fetch individual markdown files to get detailed information about specific topics.
Each markdown file contains the clean documentation content with a link back to the original page.

Generated: ${new Date().toISOString()}
`;

  return content;
}

// Run
generate().catch(console.error);