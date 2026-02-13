# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Documentation website for [NetBird](https://netbird.io), an open-source WireGuard-based Zero Trust Networking platform. Built with Next.js 16 (Pages Router), React 19, MDX, and Tailwind CSS 3.

There is no test suite in this project. Validate changes with `npm run build`.

## Common Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (also runs gen:llm)
npm run build        # Production build (also runs gen:llm)
npm run lint         # ESLint (next/core-web-vitals) on src/
npm run gen          # Regenerate API docs from NetBird OpenAPI spec
npm run gen:llm      # Regenerate LLM-friendly markdown (auto-runs with dev/build)
```

## Architecture

### Content Structure
Documentation pages are MDX files in `src/pages/` using the Next.js Pages Router (not App Router). Key directories:
- `about-netbird/` - Conceptual docs
- `get-started/` - Installation and quickstart guides
- `manage/` - Feature documentation (peers, networks, DNS, access control, etc.)
- `selfhosted/` - Self-hosting deployment guides
- `ipa/` - API documentation (served at `/api` via rewrite)
- `use-cases/` - Tutorials and examples
- `client/` - Client configuration
- `help/` - Troubleshooting

### MDX Page Conventions
- Page title comes from the first `# Heading` in the MDX file
- Optional `export const description = '...'` for meta description
- Import components as needed: `import {Note} from "@/components/mdx"`
- Images go in `public/docs-static/img/<section>/` and are referenced as `/docs-static/img/<section>/filename.png`

### Navigation
`src/components/NavigationDocs.jsx` contains the `docsNavigation` array defining the sidebar. **Must be updated when adding or moving pages.** Supports nested `links` arrays for sub-navigation.

### MDX Components
Custom components available in MDX files (see `README.md` for full usage examples):
- Alert boxes: `<Note>`, `<Warning>`, `<Success>` (from `@/components/mdx`)
- Layout: `<Row>`, `<Col>`, `<Tiles>` (from `@/components/Tiles`), `<CodeGroup>`
- Media: `<YouTube videoId="...">` (from `@/components/YouTube`)
- UI: `<Button>` (from `@/components/Button`), `<Badge>`
- API docs: `<Properties>`, `<Property>`

### API Documentation Generator
- `generator/` - TypeScript generator that creates MDX pages from the NetBird OpenAPI spec
- `generator/templates/ApiTemplate.ts` - Template for generated pages
- Output: `src/pages/ipa/resources/` (don't edit these files manually)

### MDX Processing Pipeline
- `mdx/remark.mjs` - Remark plugins
- `mdx/rehype.mjs` - Rehype plugins (syntax highlighting via Shiki)
- `mdx/recma.mjs` - Recma plugins

### LLM Documentation
- `scripts/generate-llm-docs.mjs` generates clean markdown to `public/llms/` (gitignored)
- Runs automatically with `dev` and `build`

## URL Routing

- Root `/` rewrites to `/introduction`
- `/api/*` rewrites to `/ipa/*` (API docs live in `src/pages/ipa/` but are served under `/api`)
- Extensive legacy redirects from `/docs/*` and `/how-to/*` paths in `next.config.mjs`
