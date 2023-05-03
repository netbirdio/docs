import template from './templates/ApiTemplate'
import { slugify, toArrayWithKey, toTitle, writeToDisk } from './helpers'
import { OpenAPIV3, OpenAPIV2 } from 'openapi-types'
import * as fs from 'fs'
import * as ejs from 'ejs'

export default async function gen(inputFileName: string, outputDir: string, apiUrl: string) {
  const specRaw = fs.readFileSync(inputFileName, 'utf8')
  const spec = JSON.parse(specRaw) as any
  // console.log('spec', spec)

  switch (spec.openapi || spec.swagger) {
    case '3.0.0':
    case '3.0.1':
    case '3.0.3':
      await gen_v3(spec, outputDir, { apiUrl })
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

export type schemaObject = {
  examples: Object
  parameters: schemaParameter[]
}

async function gen_v3(spec: OpenAPIV3.Document, dest: string, { apiUrl }: { apiUrl: string }) {
  const specLayout = spec.tags || []
  // const operations: enrichedOperation[] = []
  const tagGroups = new Map<string, enrichedOperation[]>()
  Object.entries(spec.paths).forEach(([key, val]) => {
    const fullPath = `${apiUrl}${key}`

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

  let schemas = new Map<string, schemaObject>();
  Object.entries(spec.components?.schemas).forEach(([key, val]) => {
    const schema = val as OpenAPIV3.SchemaObject
    let examples = new Map<string, any>();
    let parameters : schemaParameter[] = []
    if(schema.allOf){
      schema.allOf.forEach((item) => {
        if((item as OpenAPIV3.ReferenceObject).$ref){
          let schemaObject = schemas.get((item as OpenAPIV3.ReferenceObject).$ref.split('/').pop())
          let examplesMap = new Map(Object.entries(schemaObject.examples))
          examplesMap.forEach((value, key) => {
            examples.set(key, value)
          })
          parameters = parameters.concat(schemaObject.parameters)
        }
        if((item as OpenAPIV3.SchemaObject).properties){
          Object.entries((item as OpenAPIV3.SchemaObject).properties).forEach(([key, val]) => {
            let property = val as OpenAPIV3.SchemaObject
            let type
            if (property.type === "array") {
              type = new Array(resolveType(property.items, spec.components?.schemas))
            } else {
              type = resolveType(property, spec.components?.schemas)
            }
            examples.set(key, type)
            let parameter: schemaParameter = {
              name: key,
              type: property.type === "array" ? ((property.items as OpenAPIV3.SchemaObject).type || (property.items as OpenAPIV3.ReferenceObject).$ref.split('/').pop()) + "[]" : property.type,
              description: property.description,
              required: schema.required?.includes(key) || false,
              minimum: property.minimum,
              maximum: property.maximum,
              minLength: property.minLength,
              maxLength: property.maxLength,
              enum: property.enum
            }
            parameters.push(parameter)
          })
        }
      })
    } else {
      Object.entries(schema.properties).forEach(([key, val]) => {
        let property = val as OpenAPIV3.SchemaObject
        let type
        if(property.type === "array"){
          type = new Array(resolveType(property.items, spec.components?.schemas))
        } else {
          type = resolveType(property, spec.components?.schemas)
        }
        examples.set(key, type)
        let parameter : schemaParameter = {
          name: key,
          type: property.type === "array" ? ((property.items as OpenAPIV3.SchemaObject).type || (property.items as OpenAPIV3.ReferenceObject).$ref.split('/').pop()) + "[]" : property.type,
          description: property.description,
          required: schema.required?.includes(key) || false,
          minimum: property.minimum,
          maximum: property.maximum,
          minLength: property.minLength,
          maxLength: property.maxLength,
          enum: property.enum
        }
        parameters.push(parameter)
      })
    }


    let output : schemaObject = {
      examples: Object.fromEntries(examples),
      parameters: parameters
    }
    schemas.set(key, output)
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
      schemas,
    })

    // Write to disk
    let outputFile = dest + "/" + key.toLowerCase().replace(" ", "-") + ".mdx"
    writeToDisk(outputFile, content)
    // console.log('Saved: ', outputFile)
  })
}

function resolveType(items: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject | OpenAPIV3.NonArraySchemaObjectType, schemas) : any {
  if((items as OpenAPIV3.ReferenceObject).$ref){
    let ref = (items as OpenAPIV3.ReferenceObject).$ref
    let map = new Map<string, any>()
    Object.entries(schemas[ref.split('/').pop()].properties).forEach(([key, val]) => {
      let property = val as OpenAPIV3.SchemaObject
      let type
      if(property.type === "array"){
        type = new Array(resolveType(property.items, schemas))
      } else {
        type = resolveType(property, schemas)
      }
      map.set(key, type)
    })
    return Object.fromEntries(map)
  }
  return (items as OpenAPIV3.ArraySchemaObject).type
}

