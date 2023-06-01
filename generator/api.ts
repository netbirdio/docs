import template from './templates/ApiTemplate'
import { slugify, toArrayWithKey, toTitle, writeToDisk } from './helpers'
import {OpenAPIV3} from 'openapi-types'
import * as fs from 'fs'
import * as ejs from 'ejs'

export default async function gen(inputFileName: string, outputDir: string) {
  const specRaw = fs.readFileSync(inputFileName, 'utf8')
  const spec = JSON.parse(specRaw) as any

  switch (spec.openapi || spec.swagger) {
    case '3.0.0':
    case '3.0.1':
    case '3.0.3':
      await gen_v3(spec, outputDir)
      break

    default:
      console.log('Unrecognized specification version:', spec.openapi)
      break
  }
}

/**
 * Versioned Generator
 */

// OPENAPI-SPEC-VERSION: 3.0.0
type v3OperationWithPath = OpenAPIV3.OperationObject & {
  path: string
}
export type enrichedOperation = OpenAPIV3.OperationObject & {
  path: string
  fullPath: string
  operationId: string
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
      const enriched = {
        ...operation,
        path: key,
        fullPath,
        operationId: slugify(operation.summary!),

        responseList: toArrayWithKey(operation.responses!, 'responseCode') || [],
      }
      let tag = operation.tags.pop()
      let tagOperations = tagGroups.get(tag) ?? []
      tagGroups.set(tag, tagOperations.concat(enriched))
    })
  })

  let [schemas, examples, parameters] = readComponents(spec.components)

  console.log(examples.get("Route"))
  console.log(schemas.get("Route"))

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
      examples,
      schemas,
      parameters,
    })

    // Write to disk
    let outputFile = dest + "/" + key.toLowerCase().replace(" ", "-") + ".mdx"
    writeToDisk(outputFile, content)
    // console.log('Saved: ', outputFile)
  })
}

function resolveParameters(value: OpenAPIV3.ReferenceObject | OpenAPIV3.ArraySchemaObject | OpenAPIV3.NonArraySchemaObject, components: OpenAPIV3.ComponentsObject) : schemaParameter[] {
  if((value as OpenAPIV3.ReferenceObject).$ref) {
    let subcomponentName = (value as OpenAPIV3.ReferenceObject).$ref.split('/').pop()
    let subcomponent = components.schemas[subcomponentName]
    return resolveParameters(subcomponent, components)
  }
  if((value as OpenAPIV3.SchemaObject).properties) {
    return resolveParametersProperties(value as OpenAPIV3.SchemaObject, components)
  }
  if((value as OpenAPIV3.SchemaObject).allOf) {
    return resolveParametersAllOf(value as OpenAPIV3.SchemaObject, components)
  }
  return
}

function resolveParametersAllOf(object: OpenAPIV3.SchemaObject, components: OpenAPIV3.ComponentsObject) : schemaParameter[] {
  let parameters: schemaParameter[] = []
  for (const [key, value] of Object.entries(object.allOf)) {
    if((value as OpenAPIV3.ReferenceObject).$ref) {
      let subcomponentName = (value as OpenAPIV3.ReferenceObject).$ref.split('/').pop()
      let subcomponent = components.schemas[subcomponentName]
      let parameter = resolveParameters(subcomponent, components)
      parameters = parameters.concat(parameter)
    }
    if((value as OpenAPIV3.SchemaObject).properties) {
      let parameter = resolveParametersProperties(value as OpenAPIV3.SchemaObject, components)
      parameters = parameters.concat(parameter)
    }
  }
  return parameters
}


function readParameters(components: OpenAPIV3.ComponentsObject) : Map<string, schemaParameter[]> {
  let parameters = new Map<string, schemaParameter[]>();
  for (const [key, value] of Object.entries(components.schemas)) {
    let parameter = resolveParameters(value, components)
    parameters.set(key, parameter)
  }
  return parameters

}

function readComponents(components: OpenAPIV3.ComponentsObject) :  [Map<string, Object>, Map<string, Object>, Map<string, schemaParameter[]>] {
  let examples = new Map<string, Object>();
  let schemas = new Map<string, Object>();
  let parameters = readParameters(components)

  for (const [key, value] of Object.entries(components.schemas)) {
    let [schema, example] = resolveComponents(value, components)
    examples.set(key, example)
    schemas.set(key, schema)
  }

  return [schemas, examples, parameters]
}

function resolveComponents(value: OpenAPIV3.ReferenceObject | OpenAPIV3.ArraySchemaObject | OpenAPIV3.NonArraySchemaObject, components: OpenAPIV3.ComponentsObject) : [Object, Object] {
  if((value as OpenAPIV3.ReferenceObject).$ref) {
    let subcomponentName = (value as OpenAPIV3.ReferenceObject).$ref.split('/').pop()
    let subcomponent = components.schemas[subcomponentName]
    return resolveComponents(subcomponent, components)
  }
  if((value as OpenAPIV3.SchemaObject).properties) {
    return resolveProperties(value as OpenAPIV3.SchemaObject, components)
  }
  if((value as OpenAPIV3.SchemaObject).allOf) {
    return resolveAllOf(value as OpenAPIV3.SchemaObject, components)
  }
  if((value as OpenAPIV3.SchemaObject).type || (value as OpenAPIV3.SchemaObject).example) {
    return [(value as OpenAPIV3.SchemaObject).type, (value as OpenAPIV3.SchemaObject).example]
  }
}

function resolveAllOf(object: OpenAPIV3.SchemaObject, components: OpenAPIV3.ComponentsObject) : [Object, Object] {
  let examples = new Map<string, any>()
  let schemas = new Map<string, any>()
  for (const [key, value] of Object.entries(object.allOf)) {
    let example;
    let schema;
    if((value as OpenAPIV3.ReferenceObject).$ref) {
      let subcomponentName = (value as OpenAPIV3.ReferenceObject).$ref.split('/').pop()
      let subcomponent = components.schemas[subcomponentName];
      [schema, example] = resolveComponents(subcomponent, components)
    }
    if((value as OpenAPIV3.SchemaObject).properties) {
      [schema, example] = resolveProperties(value as OpenAPIV3.SchemaObject, components)
    }
    if(!(example instanceof Map)) {
      example = new Map(Object.entries(example))
    }
    if(!(schema instanceof Map)) {
      schema = new Map(Object.entries(schema))
    }
    examples = mergeMaps(examples, example)
    schemas = mergeMaps(schemas, schema)
  }
  return [Object.fromEntries(schemas), Object.fromEntries(examples)]
}

function resolveProperties(value: OpenAPIV3.SchemaObject, components: OpenAPIV3.ComponentsObject): [Object, Object] {
  let examples = new Map<string, Object>()
  let schemas = new Map<string, Object>()
  for(const [key, property] of Object.entries(value.properties)) {
    if(property["$ref"]) {
      let [schema, example] = resolveComponents(property, components)
      examples.set(key, example)
      schemas.set(key, schema)
      continue
    }
    switch (property["type"]) {
      case "array":
        let [schema, example] = resolveComponents(property["items"], components)
        examples.set(key, new Array(example))
        schemas.set(key, new Array(schema))
        break;
      case "object":
      default:
        examples.set(key, property["example"])
        schemas.set(key, property["type"])
    }
  }
  return [Object.fromEntries(schemas), Object.fromEntries(examples)]
}


function mergeMaps(map1: Map<string, Object>, map2: Map<string, Object>) : Map<string, Object> {
  return new Map([...Array.from(map1.entries()), ...Array.from(map2.entries())]);
}
