import path from 'path'
import { fileURLToPath } from 'url'
import { mdxAnnotations } from 'mdx-annotations'
import { visit } from 'unist-util-visit'
import rehypeMdxTitle from 'rehype-mdx-title'
import shiki from 'shiki'
import { toString } from 'mdast-util-to-string'
import * as acorn from 'acorn'
import { slugifyWithCounter } from '@sindresorhus/slugify'
import { LAST_UPDATED_BY_ROUTE } from '../src/lib/last-updated-routes.mjs'

const PAGES_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/pages')

function routeFromFilePath(filePath) {
  if (!filePath) return null
  const rel = path.relative(PAGES_DIR, filePath)
  if (rel.startsWith('..')) return null
  const noExt = rel.replace(/\.mdx$/, '')
  const route = noExt === 'index' ? '/' : '/' + noExt.replace(/\/index$/, '')
  return route
}

function formatLastUpdated(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '')
  if (!m) return null
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
  return `${months[Number(m[2]) - 1]} ${Number(m[3])}, ${m[1]}`
}

function rehypeInsertLastUpdated() {
  return (tree, file) => {
    const filePath = file?.path || file?.history?.[file.history.length - 1]
    const route = routeFromFilePath(filePath)
    if (!route) return
    const iso = LAST_UPDATED_BY_ROUTE[route]
    const formatted = formatLastUpdated(iso)
    if (!formatted) return

    const node = {
      type: 'element',
      tagName: 'p',
      properties: {
        className: ['not-prose', 'text-sm', 'text-slate-400', 'dark:text-zinc-500', 'mt-0', 'mb-8', 'ml-2.5'],
      },
      children: [
        { type: 'text', value: 'Updated ' },
        {
          type: 'element',
          tagName: 'time',
          properties: { dateTime: iso },
          children: [{ type: 'text', value: formatted }],
        },
      ],
    }

    const children = tree.children
    for (let i = 0; i < children.length; i++) {
      const c = children[i]
      if (c.type === 'element' && c.tagName === 'h1') {
        children.splice(i + 1, 0, node)
        return
      }
    }
  }
}

function rehypeParseCodeBlocks() {
  return (tree) => {
    visit(tree, 'element', (node, _nodeIndex, parentNode) => {
      if (node.tagName === 'code' && node.properties.className) {
        parentNode.properties.language = node.properties.className[0]?.replace(
          /^language-/,
          ''
        )
      }
    })
  }
}

let highlighter

function rehypeShiki() {
  return async (tree) => {
    highlighter =
      highlighter ?? (await shiki.getHighlighter({ theme: 'css-variables' }))

    visit(tree, 'element', (node) => {
      if (node.tagName === 'pre' && node.children[0]?.tagName === 'code') {
        let codeNode = node.children[0]
        let textNode = codeNode.children[0]

        node.properties.code = textNode.value

        if (node.properties.language) {
          let tokens = highlighter.codeToThemedTokens(
            textNode.value,
            node.properties.language
          )

          textNode.value = shiki.renderToHtml(tokens, {
            elements: {
              pre: ({ children }) => children,
              code: ({ children }) => children,
              line: ({ children }) => `<span>${children}</span>`,
            },
          })
        }
      }
    })
  }
}

function rehypeSlugify() {
  return (tree) => {
    let slugify = slugifyWithCounter()
    visit(tree, 'element', (node) => {
      if ( ['h2', 'h3', 'h4', 'h5', 'h6'].includes(node.tagName) && !node.properties.id) {
        node.properties.id = slugify(toString(node))
      }
    })
  }
}

function rehypeAddMDXExports(getExports) {
  return (tree) => {
    let exports = Object.entries(getExports(tree))

    for (let [name, value] of exports) {
      for (let node of tree.children) {
        if (
          node.type === 'mdxjsEsm' &&
          new RegExp(`export\\s+const\\s+${name}\\s*=`).test(node.value)
        ) {
          return
        }
      }

      let exportStr = `export const ${name} = ${value}`

      tree.children.push({
        type: 'mdxjsEsm',
        value: exportStr,
        data: {
          estree: acorn.parse(exportStr, {
            sourceType: 'module',
            ecmaVersion: 'latest',
          }),
        },
      })
    }
  }
}

function getSections(node) {
  let sections = []

  for (let child of node.children ?? []) {
    if (child.type === 'element' && ['h2', 'h3', 'h4', 'h5', 'h6'].includes(child.tagName)) {
      sections.push(`{
        title: ${JSON.stringify(toString(child))},
        id: ${JSON.stringify(child.properties.id)},
        tagName: ${JSON.stringify(child.tagName)},
        tag: ${JSON.stringify(child.tag)}, 
        ...${child.properties.annotation}
      }`)
    } else if (child.children) {
      sections.push(...getSections(child))
    }
  }

  return sections
}

export const rehypePlugins = [
  mdxAnnotations.rehype,
  rehypeParseCodeBlocks,
  rehypeShiki,
  rehypeSlugify,
  rehypeMdxTitle,
  rehypeInsertLastUpdated,
  [
    rehypeAddMDXExports,
    (tree) => ({
      sections: `[${getSections(tree).join()}]`,
    }),
  ],
]
