import template from './templates/ApiTemplate'
import { slugify, toArrayWithKey, toTitle, writeToDisk } from './helpers'
import {OpenAPIV3, OpenAPIV3_1} from 'openapi-types'
import * as fs from 'fs'
import * as ejs from 'ejs'
import * as yaml from 'js-yaml';
import { merge } from 'allof-merge'
import RequestBodyObject = OpenAPIV3_1.RequestBodyObject;

// Pre-processes the spec to fix allOf with conflicting enums by merging them
function fixConflictingEnumAllOf(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => fixConflictingEnumAllOf(item));
  }

  // Check if this object has an allOf with conflicting enums
  if (obj.allOf && Array.isArray(obj.allOf)) {
    const enumSchemas = obj.allOf.filter((s: any) => s.enum);
    if (enumSchemas.length > 1) {
      // Merge all enums into one combined enum
      const combinedEnum = Array.from(new Set(enumSchemas.flatMap((s: any) => s.enum)));
      const nonEnumSchemas = obj.allOf.filter((s: any) => !s.enum);

      // Merge all properties from enum schemas (type, description, example, etc.)
      const mergedEnumSchema: any = { enum: combinedEnum };
      for (const s of enumSchemas) {
        for (const key of Object.keys(s)) {
          if (key !== 'enum' && !mergedEnumSchema[key]) {
            mergedEnumSchema[key] = s[key];
          }
        }
      }

      if (nonEnumSchemas.length === 0) {
        // All schemas had enums, replace allOf with the merged schema
        const { allOf, ...rest } = obj;
        return { ...rest, ...fixConflictingEnumAllOf(mergedEnumSchema) };
      } else {
        // Keep non-enum schemas in allOf and add merged enum schema
        return {
          ...obj,
          allOf: [...nonEnumSchemas.map((s: any) => fixConflictingEnumAllOf(s)), mergedEnumSchema]
        };
      }
    }
  }

  // Recursively process all properties
  const result: any = {};
  for (const key of Object.keys(obj)) {
    result[key] = fixConflictingEnumAllOf(obj[key]);
  }
  return result;
}

export default async function gen(inputFileName: string, outputDir: string) {
  const specRaw = fs.readFileSync(inputFileName, 'utf8')
  const specYaml = yaml.load(specRaw);
  const fixedSpec = fixConflictingEnumAllOf(specYaml);
  const onMergeError = (msg) => {
    throw new Error(msg)
  }
  const merged = merge(fixedSpec, { onMergeError })

  const spec = merged as OpenAPIV3.Document

  await fs.promises.mkdir(outputDir, { recursive: true });

  switch (spec.openapi) {
    case '3.0.0':
    case '3.0.1':
    case '3.0.3':
    case '3.1.0':
      await gen_v3(spec, outputDir)
      break

    default:
      console.log('Unrecognized specification version:', spec.openapi)
      break
  }
}

type v3OperationWithPath = OpenAPIV3.OperationObject & {
  path: string

}

export type objectRepresentation = {
    example: Object
    schema: Object
}

export type enrichedOperation = OpenAPIV3.OperationObject & {
  path: string
  fullPath: string
  operationId: string
  request: objectRepresentation
  response: objectRepresentation
}

export type schemaParameter = {
  name: string
  type: string
  description: string
  required: boolean
  minimum?: number
  maximum?: number
  minLength?: number
  maxLength?: number
  enum?: string[]
  sub?: Map<string,schemaParameter>
}

async function gen_v3(spec: OpenAPIV3.Document, dest: string) {
  const specLayout = spec.tags || []
  // const operations: enrichedOperation[] = []
  const tagGroups = new Map<string, enrichedOperation[]>()
  const server = spec.servers.pop().url
  Object.entries(spec.paths).forEach(([key, val]) => {
    const fullPath = `${server}${key}`

    toArrayWithKey(val!, 'operation').forEach((o) => {
      const operation = o as v3OperationWithPath

      var request = null
      if (operation.requestBody && 'content' in operation.requestBody && operation.requestBody.content['application/json']) {
        request = {
            example: extractInfo((operation.requestBody as RequestBodyObject).content['application/json'].schema, 'example'),
            schema: extractInfo((operation.requestBody as RequestBodyObject).content['application/json'].schema, 'type')
        }
      }

      var response = null
      if(operation.responses["200"] != undefined && operation.responses["200"]["content"]["application/json"] != undefined) {
        response = {
            example: extractInfo(operation.responses["200"]["content"]["application/json"].schema, 'example'),
            schema: extractInfo(operation.responses["200"]["content"]["application/json"].schema, 'type')
        }
      }

      const enriched = {
        ...operation,
        path: key,
        fullPath,
        operationId: slugify(operation.summary!),
        responseList: toArrayWithKey(operation.responses!, 'responseCode') || [],
        request: request,
        response: response,
      }

      let tag = operation.tags.pop()
      let tagOperations = tagGroups.get(tag) ?? []
      tagGroups.set(tag, tagOperations.concat(enriched))
    })
  })

  tagGroups.forEach((value: enrichedOperation[], key: string) => {

    const operations = value

    const sections = specLayout.map((section) => {
      return {
        ...section,
        title: toTitle(section.name),
        id: slugify(section.name),
        operations: operations,
      }
    })

    const content = ejs.render(template, {
      info: spec.info,
      tag: key,
      sections,
      operations,
      // components,
    })

    // Write to disk
    let outputFile = dest + "/" + key.toLowerCase().replace(" ", "-") + ".mdx"
    writeToDisk(outputFile, content)
    // console.log('Saved: ', outputFile)

  })
}

function extractInfo(obj, mode = 'example') {
  // Handle the root level object that represents an array
  if (obj.type === 'array' && obj.hasOwnProperty('items')) {
    if (obj.items.hasOwnProperty('properties')) {
      return [extractInfo(obj.items.properties, mode)];
    } else {
      if (mode === 'example' && obj.hasOwnProperty('example')) {
        return obj.example;
      }
      return [extractInfo(obj.items, mode)];
    }
  }

  // If mode is 'example' and the object has an 'example', return it immediately
  if (mode === 'example' && obj.hasOwnProperty('example')) {
    return obj.example;
  }

  // For an object with 'properties', check if there's an example at this level first
  if (obj.type === 'object' && obj.hasOwnProperty('properties')) {
    // If an example is provided at the current level, return it, avoiding deeper analysis
    if (obj.hasOwnProperty('example')) {
      return obj.example;
    } else {
      // If no example is provided, then proceed to extract info from its properties
      const result = {};
      for (const key in obj.properties) {
        if (obj.properties.hasOwnProperty(key)) {
          result[key] = extractInfo(obj.properties[key], mode);
        }
      }
      return result;
    }
  }

  // Return the type for elementary types if mode is 'type'
  if (mode === 'type' && ['string', 'number', 'boolean', 'integer'].includes(obj.type)) {
    return obj.type;
  }

  // Handle arrays, assuming each item might be an object with its own structure
  if (Array.isArray(obj)) {
    return obj.map(item => extractInfo(item, mode));
  }

  // Special handling for objects that represent schemas (e.g., with 'type' and 'properties')
  if (typeof obj === 'object' && obj !== null) {
    const result = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        result[key] = extractInfo(obj[key], mode);
      }
    }
    return result;
  }

  // Return the object if it doesn't match any of the above conditions
  return obj;
}
