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
  minLen?: number
  maxLen?: number
  minimum?: number
  maximum?: number
  enumList?: any[]
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
  tag: string
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

  // anyOf/oneOf: return array of resolved options (keep as oneOf/anyOf structure)
  if (Array.isArray(node.oneOf)) {
    return { oneOf: node.oneOf.map((opt: any) => dereferenceNode(opt, doc, new Set(seenRefs))) }
  }
  if (Array.isArray(node.anyOf)) {
    return { anyOf: node.anyOf.map((opt: any) => dereferenceNode(opt, doc, new Set(seenRefs))) }
  }

  // arrays: dereference items
  if (node.type === 'array' || node.items) {
    const items = node.items ?? {}
    const derefItems = dereferenceNode(items, doc, new Set(seenRefs))
    // return normalized array node
    const arr: any = { type: 'array', items: derefItems }
    if (node.minItems !== undefined) arr.minItems = node.minItems
    if (node.maxItems !== undefined) arr.maxItems = node.maxItems
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

  // oneOf/anyOf (already dereferenced to actual nodes)
  if (node.oneOf) {
    return { oneOf: node.oneOf.map((o: any) => buildSchemaRepresentation(o, doc, new Set(seenRefs))) }
  }
  if (node.anyOf) {
    return { anyOf: node.anyOf.map((o: any) => buildSchemaRepresentation(o, doc, new Set(seenRefs))) }
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
  if (deref.anyOf) {
    const options = deref.anyOf.map((opt: any) => extractFromSchema(opt, doc, new Set(seenRefs)))
    const firstExample = options.find(o => o.example !== undefined && o.example !== null)?.example ?? null
    return { schema: { anyOf: options.map(o => o.schema) }, example: firstExample }
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



/* ----------------- helpers ----------------- */

function defaultForPrimitive(t: string) {
  switch (t) {
    case 'string': return 'string'
    case 'integer': return 0
    case 'number': return 0
    case 'boolean': return false
    default: return null
  }
}

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

function schemaNodeToRequests(
  node: any,
  doc: OpenAPIV3_1.Document,
  nameForRoot = 'body',
  requiredNames: string[] = [],
  seenRefs = new Set<string>()
): Request[] {
  if (!node) return []

  // If node is a string ref like '#/components/...' -> resolve and recurse
  if (typeof node === 'string' && node.startsWith('#/')) {
    const resolved = resolveRef(node, doc)
    return schemaNodeToRequests(resolved, doc, nameForRoot, requiredNames, seenRefs)
  }

  // If it's a $ref object, resolve (avoid infinite loop)
  if (node.$ref) {
    const ref = node.$ref as string
    if (seenRefs.has(ref)) {
      // circular: return a placeholder
      return [{ name: nameForRoot, type: ref, required: requiredNames.includes(nameForRoot) }]
    }
    seenRefs.add(ref)
    const resolved = resolveRef(ref, doc)
    if (!resolved) return [{ name: nameForRoot, type: ref, required: requiredNames.includes(nameForRoot) }]
    return schemaNodeToRequests(resolved, doc, nameForRoot, requiredNames, seenRefs)
  }

  // If oneOf -> produce one Request entry with type 'oneOf' and bodyObj containing options
  if (Array.isArray(node.oneOf)) {
    const options: Request[] = node.oneOf.map((opt: any, idx: number) => {
      const optReqs = schemaNodeToRequests(opt, doc, `option_${idx+1}`, [], new Set(seenRefs))
      if (optReqs.length === 1 && optReqs[0].type === 'object' && optReqs[0].bodyObj) {
        return {
          name: `Option ${idx+1}`,
          type: 'object',
          required: true,
          description: opt.description || undefined,
          bodyObj: optReqs[0].bodyObj
        }
      }
      return {
        name: `Option ${idx+1}`,
        type: 'object',
        required: true,
        bodyObj: optReqs
      }
    })
    return [{
      name: nameForRoot,
      type: 'oneOf',
      required: true,
      description: node.description || undefined,
      bodyObj: options
    }]
  }

  // If array -> create a single Request describing the array
  if (node.type === 'array' || node.items) {
    const items = node.items ?? {}
    // object[] case
    if ((items.type === 'object') || items.properties || items.$ref || items.oneOf) {
      const nested = schemaNodeToRequests(items, doc, 'item', items.required || [], new Set(seenRefs))
      return [{
        name: nameForRoot,
        type: 'object[]',
        required: requiredNames.includes(nameForRoot),
        description: node.description || undefined,
        bodyObj: nested
      }]
    } else {
      const itemType = items.type || 'any'
      return [{
        name: nameForRoot,
        type: `${itemType}[]`,
        required: requiredNames.includes(nameForRoot),
        description: node.description || undefined,
        minLen: node.minItems,
        maxLen: node.maxItems,
      }]
    }
  }

  // If object with properties -> map each property to Request
  if (node.type === 'object' || node.properties || node.additionalProperties) {
    if (node.properties && typeof node.properties === 'object') {
      const out: Request[] = []
      const reqArr: string[] = Array.isArray(node.required) ? node.required : requiredNames || []
      for (const [propName, propSchema] of Object.entries(node.properties)) {
        const prop = propSchema as any

        // $ref property
        if (prop.$ref) {
          const resolved = resolveRef(prop.$ref, doc)
          const nestedReqs = schemaNodeToRequests(resolved, doc, propName, resolved?.required || [], new Set(seenRefs))
          if (nestedReqs.length === 1 && nestedReqs[0].type === 'object' && nestedReqs[0].bodyObj) {
            out.push({
              name: propName,
              type: 'object',
              required: reqArr.includes(propName),
              description: prop.description || undefined,
              bodyObj: nestedReqs[0].bodyObj
            })
            continue
          } else {
            out.push({
              name: propName,
              type: 'object',
              required: reqArr.includes(propName),
              description: prop.description || undefined,
              bodyObj: nestedReqs
            })
            continue
          }
        }

        // array property
        if (prop.type === 'array' || prop.items) {
          const items = prop.items ?? {}
          if ((items.type === 'object') || items.properties || items.$ref || items.oneOf) {
            const nested = schemaNodeToRequests(items, doc, propName, items.required || [], new Set(seenRefs))
            out.push({
              name: propName,
              type: 'object[]',
              required: reqArr.includes(propName),
              description: prop.description || undefined,
              minLen: prop.minItems,
              maxLen: prop.maxItems,
              bodyObj: nested
            })
          } else {
            out.push({
              name: propName,
              type: `${items.type || 'any'}[]`,
              required: reqArr.includes(propName),
              description: prop.description || undefined,
              minLen: prop.minItems,
              maxLen: prop.maxItems,
              enumList: items.enum
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
            required: reqArr.includes(propName),
            description: prop.description || undefined,
            bodyObj: nested
          })
          continue
        }

        // primitive property
        const r: Request = {
          name: propName,
          type: prop.type || (prop.enum ? 'string' : 'any'),
          required: reqArr.includes(propName),
          description: prop.description || undefined
        }
        if (prop.minLength !== undefined) r.minLen = prop.minLength
        if (prop.maxLength !== undefined) r.maxLen = prop.maxLength
        if (prop.minimum !== undefined) r.minimum = prop.minimum
        if (prop.maximum !== undefined) r.maximum = prop.maximum
        if (prop.enum) r.enumList = Array.isArray(prop.enum) ? prop.enum : undefined
        out.push(r)
      }
      return out
    }

    // additionalProperties (map)
    if (node.additionalProperties) {
      const add = node.additionalProperties === true ? { type: 'any' } : node.additionalProperties
      const nested = schemaNodeToRequests(add, doc, 'value', add?.required || [], new Set(seenRefs))
      return [{
        name: nameForRoot,
        type: 'object',
        required: requiredNames.includes(nameForRoot),
        description: node.description || undefined,
        bodyObj: nested.length ? nested : undefined
      }]
    }

    // empty object
    return [{
      name: nameForRoot,
      type: 'object',
      required: requiredNames.includes(nameForRoot),
      description: node.description || undefined
    }]
  }

  // primitive at root
  if (typeof node.type === 'string') {
    const r: Request = {
      name: nameForRoot,
      type: node.type,
      required: requiredNames.includes(nameForRoot),
      description: node.description || undefined
    }
    if (node.minLength !== undefined) r.minLen = node.minLength
    if (node.maxLength !== undefined) r.maxLen = node.maxLength
    if (node.minimum !== undefined) r.minimum = node.minimum
    if (node.maximum !== undefined) r.maximum = node.maximum
    if (node.enum) r.enumList = node.enum
    return [r]
  }

  // enum fallback
  if (node.enum) {
    return [{
      name: nameForRoot,
      type: 'string',
      required: requiredNames.includes(nameForRoot),
      enumList: Array.isArray(node.enum) ? node.enum : undefined,
      description: node.description || undefined
    }]
  }

  // fallback
  return [{
    name: nameForRoot,
    type: typeof node === 'object' ? 'object' : 'any',
    required: requiredNames.includes(nameForRoot),
    description: node?.description || undefined
  }]
}

/* ----------------- main extraction: extractSpec ----------------- */

/**
 * Walks all paths & methods and extracts:
 * - parameters (path/query)
 * - request body (application/json) -> Request[]
 * - responses -> Extracted { schema, example } (application/json)
 */
export function extractSpec(doc: OpenAPIV3_1.Document): { endpoints: Endpoint[] } {
  const endpoints: Endpoint[] = []
  const methods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head']

  for (const [p, pathItem] of Object.entries(doc.paths || {})) {
    for (const method of methods) {
      const op: any = (pathItem as any)[method]
      if (!op) continue

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

  return { endpoints }
}

