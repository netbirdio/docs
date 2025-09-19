import path from 'path';
import YAML from 'yaml';
import { OpenAPIV3_1 } from 'openapi-types'
import { Endpoint, extractSpec } from './tsxParser/openapi-extractor';
import React from 'react';
import { ApiTemplate } from './templates/ApiTemplate';
import { renderToMDX } from './tsxParser/renderToMDX';
import { mkdir, writeFile } from "fs/promises"

(async function main() {
  const inputUrl = process.argv[2]
  if (!inputUrl) {
    console.error('Usage: ts-node index.ts <openapi-url>');
    process.exit(1);
  }
  const outputDir = process.argv[3] || path.join('..', 'src', 'pages', 'ipa', 'resources');
  const yml = await readYaml(inputUrl)
  const mdxFile: Record<string, Endpoint[]> = {}

  const { endpoints } = extractSpec(yml)
  endpoints.forEach(endpoint => {
    if (!endpoint.tag) {
      console.error('No tag for this endpoint:', endpoint.path)
      return
    }

    if (!mdxFile[endpoint.tag]) {
      mdxFile[endpoint.tag] = []
    }

    mdxFile[endpoint.tag].push(endpoint)
  })

  for (let tag in mdxFile) {
    const element = React.createElement(ApiTemplate, { tag: tag, endpoints: mdxFile[tag] });
    const component = renderToMDX(element)
    const fileName = path.join(outputDir, tag.toLowerCase().replace(" ", "-") + ".mdx")
    const dir = path.dirname(fileName)
    await mkdir(dir, { recursive: true })
    await writeFile(fileName, component)
  }

})()


async function readYaml(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
  const text = await res.text();
  const parsed = YAML.parse(text) as OpenAPIV3_1.Document;
  if (parsed.openapi != "3.1.0") {
    throw new Error('Unsupported OpenAPI version: ' + parsed.openapi);
  }
  return parsed;
}


