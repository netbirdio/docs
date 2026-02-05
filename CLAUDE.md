# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the documentation website for [NetBird](https://netbird.io), an open-source WireGuard-based Zero Trust Networking platform. The site is built with Next.js 14 and MDX support.

## Common Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Regenerate API documentation from OpenAPI spec
npm run gen

# Regenerate LLM-friendly markdown docs (runs automatically with dev/build)
npm run gen:llm
```

## Architecture

### Content Structure
- Documentation pages are MDX files in `src/pages/` organized by topic:
  - `about-netbird/` - Conceptual docs
  - `get-started/` - Installation and quickstart guides
  - `manage/` - Feature documentation (peers, networks, DNS, access control, etc.)
  - `selfhosted/` - Self-hosting deployment guides
  - `ipa/` - API documentation (mapped to `/api` route via rewrite)
  - `use-cases/` - Tutorials and examples
  - `client/` - Client configuration
  - `help/` - Troubleshooting

### Navigation
- `src/components/NavigationDocs.jsx` - Contains `docsNavigation` array that defines the sidebar structure. Update this when adding new pages.

### MDX Components
Custom components available in MDX files (import from `@/components/mdx` or their respective files):

- `<Note>` - Orange info box for important notes
- `<Warning>` - Red warning box
- `<Success>` - Green success message
- `<Tiles>` - Grid of clickable cards for related links
- `<YouTube videoId="...">` - Embedded YouTube videos
- `<Button>` - Styled buttons/links
- `<Row>` and `<Col>` - Two-column layouts
- `<Properties>` and `<Property>` - API property documentation
- `<CodeGroup>` - Tabbed code blocks for multiple languages

### API Documentation Generator
- `generator/` - TypeScript-based generator that creates MDX pages from the NetBird OpenAPI spec
- `generator/templates/ApiTemplate.ts` - Template for generated API pages
- Generated pages go to `src/pages/ipa/resources/`

### MDX Processing Pipeline
- `mdx/remark.mjs` - Remark plugins
- `mdx/rehype.mjs` - Rehype plugins (syntax highlighting via Shiki)
- `mdx/recma.mjs` - Recma plugins

### LLM Documentation
- `scripts/generate-llm-docs.mjs` - Generates clean markdown versions of all pages
- Output goes to `public/llms/` with index at `public/llms.txt`
- Runs automatically on `npm run dev` and `npm run build`

## URL Routing

- Root `/` rewrites to `/introduction`
- `/api/*` rewrites to `/ipa/*` (API docs)
- Many legacy `/docs/*` and `/how-to/*` paths redirect to new locations (see `next.config.mjs`)
