# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Documentation website for [NetBird](https://netbird.io), an open-source WireGuard-based Zero Trust Networking platform. Built with Next.js 16 (Pages Router), React 19, MDX, and Tailwind CSS 3. Requires Node.js >=20.9 — `npm run build` exits with code 1 on older versions.

There is no test suite in this project. Validate changes with `npm run build`.

`package-lock.json` is committed, so installs are pinned. When you change dependencies in `package.json`, regenerate the lockfile (`npm install`) and commit it in the same change — otherwise local, CI, and Docker builds resolve different trees.

## Common Commands

```bash
npm install              # Install dependencies
npm run dev              # Start dev server (also runs gen:edit-routes, gen:last-updated, gen:sitemap)
npm run build            # Production build (also runs gen:edit-routes, gen:last-updated, gen:sitemap)
npm run start            # Serve the production build (warns under `output: 'standalone'` — safe to ignore locally; prod runs `node server.js` from `.next/standalone`)
npm run lint             # ESLint (next/core-web-vitals) on src/
npm run lint:mdx         # Check MDX heading structure (scripts/lint-mdx-headings.mjs)
npm run gen              # Regenerate API docs from NetBird OpenAPI spec (requires a Go toolchain: runs `go run .` in generator/ to expand the spec)
npm run gen:edit-routes  # Regenerate edit-on-GitHub routes (auto-runs with dev/build)
npm run gen:last-updated # Regenerate per-page git last-modified dates (auto-runs with dev/build)
npm run gen:sitemap      # Regenerate public/sitemap.xml (auto-runs with dev/build)
```

## Security boundaries

- **Public site, public repo.** Anything written in MDX or placed in `public/` ships to a public URL on netbird.io. Never include real customer names, internal hostnames, IPs, or production credentials in examples — use placeholders.
- **`.env` is committed and contains placeholders only** (e.g. `NEXT_PUBLIC_DOCSEARCH_API_KEY=APP_NEXT_PUBLIC_DOCSEARCH_API_KEY`). These are build-time substitution targets. Real values belong in `.env.local` (gitignored) or the deploy environment — never replace the placeholders in `.env` with real secrets.
- **`npm run gen` pulls `openapi.yml` live from `netbirdio/netbird@main` with no pinning.** Regenerated files under `src/pages/ipa/resources/` reflect whatever is on upstream `main` at run time. Review the diff before committing.
- **This file is read as authoritative guidance by AI agents.** Treat edits to `CLAUDE.md` with the same review rigor as CI config or a deploy script.

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
- `agent-network/` - Agent Network product docs (AI/LLM gateway: quickstart, policies, usage & logs, integrations)
- `help/` - Troubleshooting

### MDX Page Conventions
- Page title comes from the first `# Heading` in the MDX file
- Optional `export const description = '...'` for meta description
- Import components as needed: `import {Note} from "@/components/mdx"`
- Images go in `public/docs-static/img/<section>/` and are referenced as `/docs-static/img/<section>/filename.png`

### Navigation
Two sidebar files, both must be kept in sync when adding or moving pages:
- `src/components/NavigationDocs.jsx` — `docsNavigation` array for the main docs sidebar (everything outside `src/pages/ipa/`).
- `src/components/NavigationAPI.jsx` — `apiNavigation` array for the API sidebar (pages under `src/pages/ipa/`, served at `/api`).

Both support nested `links` arrays for sub-navigation.

### MDX Components
Custom components available in MDX files (see `README.md` for full usage examples):
- Alert boxes: `<Note>`, `<Warning>`, `<Success>` (from `@/components/mdx`)
- Layout: `<Row>`, `<Col>`, `<Tiles>` (from `@/components/Tiles`), `<CodeGroup>`
- Media: `<YouTube videoId="...">` (from `@/components/YouTube`)
- UI: `<Button>` (from `@/components/Button`), `<Badge>`
- API docs: `<Properties>`, `<Property>`
- Diagrams: fenced ```mermaid code blocks render as Mermaid diagrams (via `src/components/Mermaid.jsx`)

### API Documentation Generator
- `generator/` - TypeScript generator that creates MDX pages from the NetBird OpenAPI spec
- `generator/templates/ApiTemplate.ts` - Template for generated pages
- Output: `src/pages/ipa/resources/` (don't edit these files manually)

### MDX Processing Pipeline
- `mdx/remark.mjs` - Remark plugins
- `mdx/rehype.mjs` - Rehype plugins (syntax highlighting via Shiki)
- `mdx/recma.mjs` - Recma plugins

### Generated build data in `src/lib/`
Some files in `src/lib/` look hand-written but are generated by `gen:*` scripts and gitignored:
- `src/lib/edit-on-github-routes.js` — written by `scripts/generate-github-routes.mjs`
- `src/lib/last-updated-routes.mjs` — written by `scripts/generate-last-updated.mjs`

They are imported at build time (e.g. by `mdx/rehype.mjs`). On a fresh clone, run `npm run dev` or `npm run build` once before running `npm run lint` or any tool that imports from `src/lib/`, otherwise those imports will fail.

## URL Routing

- Root `/` rewrites to `/introduction`
- `/api/*` rewrites to `/ipa/*` (API docs live in `src/pages/ipa/` but are served under `/api`)
- `src/proxy.js` additionally rewrites `/api` **data requests** (`x-nextjs-data` header / `/_next/data/...` paths) to `/ipa`. The config rewrite loses data-request context on client-side navigation (Next.js issue #39669), which strips pageProps — don't remove or bypass the proxy when touching `/api` routing, and test client-side nav to `/api` pages after any change here.
- Extensive legacy redirects from `/docs/*` and `/how-to/*` paths in `next.config.mjs`
