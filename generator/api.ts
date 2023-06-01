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

export type component = {
  example: Object
  schema: Object
  parameters: schemaParameter[]
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

  let components = readComponents(spec.components)

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
      components,
    })

    // Write to disk
    let outputFile = dest + "/" + key.toLowerCase().replace(" ", "-") + ".mdx"
    writeToDisk(outputFile, content)
    // console.log('Saved: ', outputFile)
  })
}

function readComponents(components: OpenAPIV3.ComponentsObject) :  Map<string, component> {
  let componentsOutput = new Map<string, component>()

  for (const [key, value] of Object.entries(components.schemas)) {
    let [schema, example, parameter] = resolveComponents(value, components)

    let component = {
        example: example,
        schema: schema,
        parameters: parameter
    }
    componentsOutput.set(key, component)
  }


  return componentsOutput
}

function resolveComponents(value: OpenAPIV3.ReferenceObject | OpenAPIV3.ArraySchemaObject | OpenAPIV3.NonArraySchemaObject, components: OpenAPIV3.ComponentsObject) : [Object, Object, schemaParameter[]] {
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
    return [(value as OpenAPIV3.SchemaObject).type, (value as OpenAPIV3.SchemaObject).example, null]
  }
}

function resolveAllOf(object: OpenAPIV3.SchemaObject, components: OpenAPIV3.ComponentsObject) : [Object, Object, schemaParameter[]] {
  let examples = new Map<string, any>()
  let schemas = new Map<string, any>()
  let parameters: schemaParameter[] = []
  for (const [key, value] of Object.entries(object.allOf)) {
    let example;
    let schema;
    let parameter;
    if((value as OpenAPIV3.ReferenceObject).$ref) {
      let subcomponentName = (value as OpenAPIV3.ReferenceObject).$ref.split('/').pop()
      let subcomponent = components.schemas[subcomponentName];
      [schema, example, parameter] = resolveComponents(subcomponent, components)
    }
    if((value as OpenAPIV3.SchemaObject).properties) {
      [schema, example, parameter] = resolveProperties(value as OpenAPIV3.SchemaObject, components)
    }
    if(!(example instanceof Map)) {
      example = new Map(Object.entries(example))
    }
    if(!(schema instanceof Map)) {
      schema = new Map(Object.entries(schema))
    }
    parameters = parameters.concat(parameter)
    examples = mergeMaps(examples, example)
    schemas = mergeMaps(schemas, schema)
  }
  return [Object.fromEntries(schemas), Object.fromEntries(examples), parameters]
}


function resolveProperties(value: OpenAPIV3.SchemaObject, components: OpenAPIV3.ComponentsObject): [Object, Object, schemaParameter[]] {
  let examples = new Map<string, Object>()
  let schemas = new Map<string, Object>()
  let parameters: schemaParameter[] = []
  for(const [key, property] of Object.entries(value.properties)) {
    let type: string = ""
    if(property["$ref"]) {
      let [schema, example] = resolveComponents(property, components)
      examples.set(key, example)
      schemas.set(key, schema)
      continue
    }
    switch (property["type"]) {
      case "array":
        type = ((property["items"] as OpenAPIV3.SchemaObject).type || (property["items"] as OpenAPIV3.ReferenceObject).$ref.split('/').pop()) + "[]"
        let [schema, example] = resolveComponents(property["items"], components)
        examples.set(key, new Array(example))
        schemas.set(key, new Array(schema))
        break;
      case "object":
      default:
        type = property["type"]
        examples.set(key, property["example"])
        schemas.set(key, property["type"])
    }
    let parameter: schemaParameter = {
      name: key,
      type: type,
      description: property["description"],
      required: value.required?.includes(key) || false,
      minimum: property["minimum"],
      maximum: property["maximum"],
      minLength: property["minLength"],
      maxLength: property["maxLength"],
      enum: property["enum"],
    }
    parameters.push(parameter)
  }
  return [Object.fromEntries(schemas), Object.fromEntries(examples), parameters]
}

function mergeMaps(map1: Map<string, Object>, map2: Map<string, Object>) : Map<string, Object> {
  return new Map([...Array.from(map1.entries()), ...Array.from(map2.entries())]);
}
