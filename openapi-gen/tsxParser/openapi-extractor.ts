import { OpenAPIV3_1 } from 'openapi-types'

export type Extracted = {
  schema: any | null
  example: any | null
}

export type Parameter = {
  name: string
  required?: boolean
  type?: string
  description?: string
  in?: string
}

export type Request = {
  name: string
  type: string
  required: boolean
  description?: string
  minLength?: number,
  maxLength?: number,
  minimum?: number
  maximum?: number
  example?: string
  enumList?: any[]
  isOneOf?: boolean,
  bodyObj?: Request[]
}

export type Endpoint = {
  path: string
  method: string
  summary?: string
  description?: string
  parameters?: Parameter[]
  responses: Record<string, Extracted | null>
  request?: Request[] | null
  tag: string,
  flags: string[]
}

/* ----------------- main extraction: extractSpec ----------------- */

/**
 * Walks all paths & methods and extracts:
 * - parameters (path/query)
 * - request body (application/json) -> Request[]
 * - responses -> Extracted { schema, example } (application/json)
 */
export function extractSpec(doc: OpenAPIV3_1.Document): Endpoint[] {
  const endpoints: Endpoint[] = []
  const methods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head']

  for (const [p, pathItem] of Object.entries(doc.paths || {})) {
    for (const method of methods) {
      const op: any = (pathItem as any)[method]
      if (!op) continue
      const flags = []
      for (let o in op) {
        if (o.startsWith("x-")) {
          flags.push(o)
        }
      }

      const parameters: Parameter[] = (op.parameters || []).map((param: any) => ({
        name: param.name,
        required: !!param.required,
        type: param.schema?.type,
        description: param.description,
        in: param.in,
      }))

      const endpoint: Endpoint = {
        path: p,
        method: method.toUpperCase(),
        summary: op.summary,
        description: op.description,
        parameters,
        responses: {},
        request: null,
        tag: Array.isArray(op.tags) ? op.tags[0] ?? '' : (op.tags ?? '') as any,
        flags: flags
      }

      // ---------- Request body ----------
      if (op.requestBody) {
        let rb: any = op.requestBody
        if (rb.$ref) {
          const resolved = resolveRef(rb.$ref, doc)
          if (resolved) rb = resolved
        }
        const reqSchema = rb?.content?.['application/json']?.schema
        if (reqSchema) {
          const topReqs = schemaNodeToRequests(reqSchema, doc, 'body', reqSchema.required || [], new Set<string>())
          endpoint.request = topReqs.length ? topReqs : null
        } else if (rb?.content?.['application/json']?.example !== undefined) {
          endpoint.request = [{
            name: 'body',
            type: Array.isArray(rb.content['application/json'].example) ? 'array' : typeof rb.content['application/json'].example,
            required: true,
            description: rb.description || undefined
          }]
        } else {
          endpoint.request = null
        }
      }

      // ---------- Responses ----------
      for (const [statusCode, resp] of Object.entries(op.responses || {})) {
        let respObj: any = resp

        // If response is a $ref to components.responses, resolve it
        if (respObj && respObj.$ref) {
          const resolvedResp = resolveRef(respObj.$ref, doc)
          if (resolvedResp) respObj = resolvedResp
        }

        // content['application/json'].schema is the expected place
        const contentSchema = respObj?.content?.['application/json']?.schema
        if (contentSchema) {
          endpoint.responses[statusCode] = extractFromSchema(contentSchema, doc)
          continue
        }

        // content example fallback (no schema)
        const contentExample = respObj?.content?.['application/json']?.example
        if (contentExample !== undefined) {
          const example = contentExample
          const schemaRep = buildSchemaRepresentationFromExample(example)
          endpoint.responses[statusCode] = { schema: schemaRep, example }
          continue
        }

        // Maybe the response object directly references a schema ($ref inside response 'schema' rare)
        if (respObj && respObj.schema && respObj.schema.$ref) {
          endpoint.responses[statusCode] = extractFromSchema(respObj.schema, doc)
          continue
        }

        // Another fallback: if respObj has a top-level example
        if (respObj && respObj.example !== undefined) {
          const example = respObj.example
          const schemaRep = buildSchemaRepresentationFromExample(example)
          endpoint.responses[statusCode] = { schema: schemaRep, example }
          continue
        }

        // No useful info
        endpoint.responses[statusCode] = null
      }

      endpoints.push(endpoint)
    }
  }

  return endpoints
}

/**
 * Resolve a local JSON Pointer reference (e.g. "#/components/schemas/Foo")
 */
function resolveRef(ref: string | undefined | null, doc: OpenAPIV3_1.Document): any | null {
  if (!ref || typeof ref !== 'string') return null
  if (!ref.startsWith('#/')) return null
  const parts = ref.slice(2).split('/')
  let node: any = doc
  for (const p of parts) {
    if (node == null) return null
    const key = p.replace(/~1/g, '/').replace(/~0/g, '~')
    node = node[key]
  }
  return node
}

/**
 * Merge helper for allOf: merges properties, required, other top-level keys.
 * Later entries override earlier ones for overlapping property names.
 */
function mergeAllOfParts(parts: any[], doc: OpenAPIV3_1.Document, seenRefs: Set<string>) {
  const out: any = {}
  out.properties = {}
  out.required = []
  for (const part of parts) {
    const resolved = dereferenceNode(part, doc, new Set(seenRefs))
    // merge properties
    if (resolved.properties && typeof resolved.properties === 'object') {
      for (const [k, v] of Object.entries(resolved.properties)) {
        out.properties[k] = v
      }
    }
    // merge required
    if (Array.isArray(resolved.required)) {
      for (const r of resolved.required) {
        if (!out.required.includes(r)) out.required.push(r)
      }
    }
    // keep example if present and not set yet
    if (resolved.example !== undefined && out.example === undefined) {
      out.example = resolved.example
    }
    // copy other keys when sensical (type, description, additionalProperties)
    if (resolved.type && !out.type) out.type = resolved.type
    if (resolved.description && !out.description) out.description = resolved.description
    if (resolved.additionalProperties && !out.additionalProperties) out.additionalProperties = resolved.additionalProperties
  }

  // if no required entries => delete empty array
  if (!out.required.length) delete out.required
  if (Object.keys(out.properties).length === 0) delete out.properties

  return out
}

/**
 * Dereference & normalize a schema node:
 * - resolves $ref (recursively)
 * - merges allOf into a single object (resolving contained refs)
 * - resolves arrays/items
 * - returns a node that no longer contains $ref strings (except unknown external refs we can't resolve)
 *
 * Uses seenRefs to avoid infinite recursion.
 */
function dereferenceNode(node: any, doc: OpenAPIV3_1.Document, seenRefs = new Set<string>()): any {
  if (!node) return node

  // If the node is a string ref "#/..."
  if (typeof node === 'string' && node.startsWith('#/')) {
    const resolved = resolveRef(node, doc)
    return dereferenceNode(resolved, doc, seenRefs)
  }

  // If $ref object
  if (node.$ref) {
    const ref = node.$ref as string
    if (seenRefs.has(ref)) {
      // circular -> stop and return an empty placeholder
      return {}
    }
    seenRefs.add(ref)
    const resolved = resolveRef(ref, doc)
    if (!resolved) {
      // unresolved external ref -> return empty placeholder
      return {}
    }
    return dereferenceNode(resolved, doc, seenRefs)
  }

  // allOf: merge parts
  if (Array.isArray(node.allOf)) {
    return mergeAllOfParts(node.allOf, doc, seenRefs)
  }

  // anyOf: return array of resolved options (keep as oneOf structure)
  if (Array.isArray(node.oneOf)) {
    return { oneOf: node.oneOf.map((opt: any) => dereferenceNode(opt, doc, new Set(seenRefs))) }
  }

  // arrays: dereference items
  if (node.type === 'array' || node.items) {
    const items = node.items ?? {}
    const derefItems = dereferenceNode(items, doc, new Set(seenRefs))
    // return normalized array node
    const arr: any = { type: 'array', items: derefItems }
    if (node.minLength !== undefined) arr.minLength = node.minLength
    if (node.maxLength !== undefined) arr.maxLength = node.maxLength
    if (node.description) arr.description = node.description
    if (node.example !== undefined) arr.example = node.example
    return arr
  }

  // object with properties/additionalProperties -> dereference children
  if (node.type === 'object' || node.properties || node.additionalProperties) {
    const out: any = {}
    if (node.type) out.type = node.type
    if (node.description) out.description = node.description
    if (node.example !== undefined) out.example = node.example

    if (node.properties && typeof node.properties === 'object') {
      out.properties = {}
      for (const [k, v] of Object.entries(node.properties)) {
        out.properties[k] = dereferenceNode(v, doc, new Set(seenRefs))
      }
    }
    if (node.required) out.required = Array.isArray(node.required) ? [...node.required] : []
    if (node.additionalProperties) {
      out.additionalProperties = node.additionalProperties === true ? true : dereferenceNode(node.additionalProperties, doc, new Set(seenRefs))
    }
    return out
  }

  // primitives (string/boolean/number...), keep example/enum if present
  if (node.type && ['string', 'integer', 'number', 'boolean'].includes(node.type)) {
    const p: any = { type: node.type }
    if (node.example !== undefined) p.example = node.example
    if (node.enum) p.enum = node.enum
    if (node.format) p.format = node.format
    if (node.description) p.description = node.description
    if (node.minimum !== undefined) p.minimum = node.minimum
    if (node.maximum !== undefined) p.maximum = node.maximum
    if (node.minLength !== undefined) p.minLength = node.minLength
    if (node.maxLength !== undefined) p.maxLength = node.maxLength
    return p
  }

  // fallback: return shallow copy but dereference any child objects
  if (typeof node === 'object') {
    const out: any = {}
    for (const [k, v] of Object.entries(node)) {
      if (k === 'examples') {
        out[k] = v
      } else {
        out[k] = dereferenceNode(v, doc, new Set(seenRefs))
      }
    }
    return out
  }

  return node
}

/**
 * Build a simplified schema representation from a (dereferenced) node.
 * The node is expected to have no $ref strings (dereferenceNode must be used first).
 */
function buildSchemaRepresentation(node: any, doc: OpenAPIV3_1.Document, seenRefs: Set<string> = new Set()): any {
  if (!node) return null

  // If the node still contains a $ref (shouldn't after dereference), attempt to resolve
  if (node.$ref) {
    const resolved = resolveRef(node.$ref, doc)
    return buildSchemaRepresentation(dereferenceNode(resolved, doc, seenRefs), doc, seenRefs)
  }

  // oneOf (already dereferenced to actual nodes)
  if (node.oneOf) {
    return { oneOf: node.oneOf.map((o: any) => buildSchemaRepresentation(o, doc, new Set(seenRefs))) }
  }

  // array
  if (node.type === 'array' || node.items) {
    const items = node.items ?? {}
    return [buildSchemaRepresentation(items, doc, new Set(seenRefs))]
  }

  // primitive type
  if (node.type && ['string', 'integer', 'number', 'boolean'].includes(node.type)) {
    return node.type
  }

  // object with properties
  if (node.type === 'object' || node.properties || node.additionalProperties) {
    if (node.properties && typeof node.properties === 'object') {
      const out: any = {}
      for (const [k, v] of Object.entries(node.properties)) {
        out[k] = buildSchemaRepresentation(v as any, doc, new Set(seenRefs))
      }
      return out
    }

    if (node.additionalProperties) {
      const add = node.additionalProperties === true ? true : buildSchemaRepresentation(node.additionalProperties, doc, new Set(seenRefs))
      const rep: any = { type: 'object', additionalProperties: add }
      if (node.propertyNames) rep.propertyNames = node.propertyNames
      if (node.example !== undefined) rep.example = node.example
      return rep
    }

    return { type: 'object' }
  }

  if (node.enum) return { enum: node.enum }

  // fallback
  return node
}

/**
 * Extract schema representation and example from node AFTER dereferencing.
 * This ensures schema doesn't include $ref strings or allOf wrappers.
 */
function extractFromSchema(node: any, doc: OpenAPIV3_1.Document, seenRefs = new Set<string>()): Extracted {
  if (!node) return { schema: null, example: null }

  // Always dereference first so we operate on normalized node.
  const deref = dereferenceNode(node, doc, seenRefs)

  // If it's a oneOf structure
  if (deref.oneOf) {
    const options = deref.oneOf.map((opt: any) => extractFromSchema(opt, doc, new Set(seenRefs)))
    const firstExample = options.find(o => o.example !== undefined && o.example !== null)?.example ?? null
    return { schema: { oneOf: options.map(o => o.schema) }, example: firstExample }
  }

  // Arrays
  if (deref.type === 'array' || deref.items) {
    const items = deref.items ?? {}
    const itemExtract = extractFromSchema(items, doc, new Set(seenRefs))
    const schema = [itemExtract.schema]
    const example = deref.example !== undefined ? deref.example : (itemExtract.example !== null ? [itemExtract.example] : null)
    return { schema, example }
  }

  // Objects
  if (deref.type === 'object' || deref.properties || deref.additionalProperties) {
    const schemaRep = buildSchemaRepresentation(deref, doc, seenRefs)

    // If explicit example provided at this level, use it
    if (deref.example !== undefined && deref.example !== null) {
      return { schema: schemaRep, example: deref.example }
    }

    // Build example by iterating properties
    const ex: any = {}
    if (deref.properties) {
      for (const [propName, propSchema] of Object.entries(deref.properties)) {
        const sub = extractFromSchema(propSchema as any, doc, new Set(seenRefs))
        if (sub.example !== undefined && sub.example !== null) ex[propName] = sub.example
        else ex[propName] = defaultForSchema(sub.schema)
      }
    }

    // additionalProperties: add a sample value using its example if present
    if (deref.additionalProperties && typeof deref.additionalProperties === 'object') {
      const add = extractFromSchema(deref.additionalProperties as any, doc, new Set(seenRefs))
      if (add.example !== undefined && add.example !== null) {
        const sampleKey = Object.keys(ex)[0] ?? 'key'
        ex[sampleKey] = add.example
      }
    }

    return { schema: schemaRep, example: Object.keys(ex).length ? ex : null }
  }

  // Primitive
  if (deref.type && ['string', 'integer', 'number', 'boolean'].includes(deref.type)) {
    const t = deref.type
    const example = deref.example !== undefined ? deref.example : defaultForPrimitive(t)
    return { schema: t, example }
  }

  // enum
  if (deref.enum) {
    return { schema: { enum: deref.enum }, example: Array.isArray(deref.enum) ? deref.enum[0] : null }
  }

  // Fallback: if there is an example field return it, else return nulls
  if (deref.example !== undefined) {
    const schemaRep = buildSchemaRepresentation(deref, doc, seenRefs)
    return { schema: schemaRep, example: deref.example }
  }

  return { schema: null, example: null }
}

/**
 * Helper: produce a default for a whole schema if examples aren't present
 */
function defaultForSchema(schemaRep: any) {
  if (schemaRep == null) return null
  if (Array.isArray(schemaRep)) {
    return [defaultForSchema(schemaRep[0])]
  }
  if (typeof schemaRep === 'string') {
    return defaultForPrimitive(schemaRep)
  }
  if (typeof schemaRep === 'object') {
    const out: any = {}
    for (const k of Object.keys(schemaRep)) {
      out[k] = defaultForSchema(schemaRep[k])
    }
    return out
  }
  return null
}

/**
 * Helper: produce a default example for a primitive schema type
 */
function defaultForPrimitive(t: string) {
  switch (t) {
    case 'string': return 'string'
    case 'integer': return 0
    case 'number': return 0
    case 'boolean': return false
    default: return null
  }
}

/**
 * Small best-effort function to build a schema representation from a concrete example.
 * This is only used as a fallback when a schema is missing but an example exists.
 */
function buildSchemaRepresentationFromExample(example: any): any {
  if (example === null || example === undefined) return null
  if (Array.isArray(example)) {
    return [buildSchemaRepresentationFromExample(example[0])]
  }
  if (typeof example === 'object') {
    const out: any = {}
    for (const [k, v] of Object.entries(example)) {
      out[k] = buildSchemaRepresentationFromExample(v)
    }
    return out
  }
  const t = typeof example
  if (t === 'string') return 'string'
  if (t === 'number') return Number.isInteger(example as number) ? 'integer' : 'number'
  if (t === 'boolean') return 'boolean'
  return null
}

/**
 * Convert a schema node into an array of Request entries.
 * - node: the schema object (can be ReferenceObject, SchemaObject)
 * - nameForRoot: name to use when the node isn't an object with properties (eg 'body')
 * - requiredNames: array of required property names (only used when node.properties exists)
 */
function schemaNodeToRequests(
  node: any,
  doc: OpenAPIV3_1.Document,
  nameForRoot = 'body',
  requiredNames: string[] = [],
  seenRefs = new Set<string>()
): Request[] {
  if (!node) return []

  // Normalize & dereference first (this resolves $ref, merges allOf, derefs children)
  const normalized = dereferenceNode(node, doc, seenRefs) ?? node

  // If normalized ended up being a reference string (unlikely after deref), resolve
  if (typeof normalized === 'string' && normalized.startsWith('#/')) {
    const resolved = resolveRef(normalized, doc)
    return schemaNodeToRequests(resolved, doc, nameForRoot, requiredNames, seenRefs)
  }

  // Object handling (properties or additionalProperties)
  if ((normalized as any).type === 'object' || (normalized as any).properties || (normalized as any).additionalProperties) {
    const n = normalized as any

    // If we have explicit properties -> enumerate them
    if (n.properties && typeof n.properties === 'object') {
      const out: Request[] = []
      const reqArr: string[] = Array.isArray(n.required) ? n.required : requiredNames || []
      for (const [propName, propSchema] of Object.entries(n.properties)) {
        // ensure property is normalized
        const prop = dereferenceNode(propSchema, doc, new Set(seenRefs)) ?? propSchema
        if (Array.isArray((prop as any).oneOf)) {


          const options: Request[] = (prop.oneOf as any[]).map((opt, idx) => {
            const propNode = dereferenceNode(opt, doc, new Set(seenRefs)) ?? opt
            const optReqs = schemaNodeToRequests(propNode, doc, `option_${idx + 1}`, [], new Set(seenRefs))
            return {
              name: `Option ${idx + 1}`,
              type: 'object',
              required: false,
              example: opt.example,
              bodyObj: optReqs

            }
          })
          out.push({
            name: propName,
            type: 'object',
            required: true,
            description: "One of",
            bodyObj: options,
            isOneOf: true,
          })
          continue
        }
        // array property
        if (prop.type === 'array' || prop.items) {
          const items = prop.items ?? {}
          const itemsNorm = dereferenceNode(items, doc, new Set(seenRefs)) ?? items
          if (itemsNorm.type === 'object' || itemsNorm.properties) {
            const nested = schemaNodeToRequests(itemsNorm, doc, propName, itemsNorm.required || [], new Set(seenRefs))
            out.push({
              name: propName,
              type: 'object[]',
              example: prop.example ?? (nested.length
                ? [Object.fromEntries(
                  nested.map(nr => [nr.name, nr.example ?? defaultForSchema(nr.type ?? nr)])
                )]
                : undefined),
              required: reqArr.includes(propName),
              maxLength: prop.maxLength,
              minLength: prop.minLength,
              description: prop.description || undefined,
              bodyObj: nested
            })
          } else {
            out.push({
              name: propName,
              type: `${itemsNorm.type || 'any'}[]`,
              example: prop.example ?? (itemsNorm.example !== undefined ? [itemsNorm.example] : undefined),
              required: reqArr.includes(propName),
              description: prop.description || undefined,
              maxLength: prop.maxLength,
              minLength: prop.minLength,
              enumList: itemsNorm.enum
            })
          }
          continue
        }

        // nested object property
        if (prop.type === 'object' || prop.properties || prop.additionalProperties) {
          const nested = schemaNodeToRequests(prop, doc, propName, prop.required || [], new Set(seenRefs))
          out.push({
            name: propName,
            type: 'object',
            example: prop.example ?? (nested.length ? nested.reduce((acc, it) => {
              if (it.name) acc[it.name] = it.example ?? defaultForSchema(it.type ?? it)
              return acc
            }, {} as any) : undefined),
            required: reqArr.includes(propName),
            description: prop.description || undefined,
            bodyObj: nested
          })
          continue
        }

        // primitive property (string/number/boolean/enum)
        const primType = prop.type || (prop.enum ? 'string' : 'any')
        const r: Request = {
          name: propName,
          type: primType,
          required: reqArr.includes(propName),
          example: prop.example !== undefined ? prop.example : defaultForPrimitive(primType),
          description: prop.description || undefined
        }
        if (prop.minimum !== undefined) r.minimum = prop.minimum
        if (prop.maximum !== undefined) r.maximum = prop.maximum
        if (prop.minLength !== undefined) r.minLength = prop.minLength
        if (prop.maxLength !== undefined) r.maxLength = prop.maxLength
        if (prop.enum) r.enumList = Array.isArray(prop.enum) ? prop.enum : undefined
        out.push(r)
      }

      return out
    }

    // additionalProperties (map-like object)
    if ((n as any).additionalProperties) {
      const add = (n as any).additionalProperties === true ? { type: 'any' } : (n as any).additionalProperties
      const addNorm = dereferenceNode(add, doc, new Set(seenRefs)) ?? add
      const nested = schemaNodeToRequests(addNorm, doc, 'value', addNorm.required || [], new Set(seenRefs))
      return [{
        name: nameForRoot,
        type: 'object',
        example: n.example ?? (nested.length ? nested[0].example : undefined),
        required: requiredNames.includes(nameForRoot),
        description: n.description || undefined,
        bodyObj: nested.length ? nested : undefined
      }]
    }

    // empty object
    return [{
      name: nameForRoot,
      type: 'object',
      example: (normalized as any).example ?? undefined,
      required: requiredNames.includes(nameForRoot),
      description: (normalized as any).description || undefined
    }]
  }

  // Primitive at root (string/number/boolean/etc)
  if (typeof (normalized as any).type === 'string') {
    const t = (normalized as any).type
    const r: Request = {
      name: nameForRoot,
      type: t,
      example: (normalized as any).example !== undefined ? (normalized as any).example : defaultForPrimitive(t),
      required: requiredNames.includes(nameForRoot),
      description: (normalized as any).description || undefined
    }
    if ((normalized as any).minLength !== undefined) r.minLength = (normalized as any).minLength
    if ((normalized as any).maxLength !== undefined) r.maxLength = (normalized as any).maxLength
    if ((normalized as any).minimum !== undefined) r.minimum = (normalized as any).minimum
    if ((normalized as any).maximum !== undefined) r.maximum = (normalized as any).maximum

    if ((normalized as any).enum) r.enumList = (normalized as any).enum
    return [r]
  }

  // enum fallback
  if ((normalized as any).enum) {
    return [{
      name: nameForRoot,
      type: 'string',
      example: (normalized as any).example !== undefined ? (normalized as any).example : ((normalized as any).enum ? (normalized as any).enum[0] : undefined),
      required: requiredNames.includes(nameForRoot),
      enumList: Array.isArray((normalized as any).enum) ? (normalized as any).enum : undefined,
      description: (normalized as any).description || undefined
    }]
  }

  // fallback generic
  return [{
    name: nameForRoot,
    example: (normalized as any).example,
    type: typeof normalized === 'object' ? 'object' : 'any',
    required: requiredNames.includes(nameForRoot),
    description: (normalized as any)?.description || undefined
  }]
}
