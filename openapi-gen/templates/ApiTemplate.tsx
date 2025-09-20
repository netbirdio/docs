import { Endpoint, Parameter, Request } from "../tsxParser/openapi-extractor"
import { CodeGroup, Col, Row, Stringify, Property, Properties, Details, Summary, Badge } from "../tsxParser/components"

export type ApiTemplateProps = {
  tag: string,
  endpoints: Endpoint[]
  customFlags?: string[]
}

export const ApiTemplate = ({ tag, endpoints, customFlags }: ApiTemplateProps) => {
  return (
    <>
      <Stringify str={`export const title = '${tag}'`} />

      {endpoints.map((end, index) => {
        const flags = customFlags ? [...customFlags, ...end.flags] : end.flags
        return (
          <div key={`${end.method}-${end.path}-${index}`}>
            <h2>
              {end.summary}
              {flags.length > 0 && flags.map(flag => <Badge key={flag} customFlag={flag} />)}
              {` {{ tag: '${end.method.toUpperCase()}', label: '${end.path}' }}`}
            </h2>

            <Row>
              <Col>
                {end.description}

                {/* Handle Path Parameters for all methods that might have them */}
                {end.parameters && end.parameters.length > 0 && (
                  <ParametersApi parameters={end.parameters} />
                )}

                {/* Handle Request Body for POST/PUT methods */}
                {(end.method === "POST" || end.method === "PUT") && end.request && (
                  <PostBodyApi bodyRequest={end.request} path={end.path} />
                )}
              </Col>

              <Col sticky>
                <CodeGroup
                  title="Request"
                  endPoint={end}
                />
                {end.responses["200"]?.schema &&
                  <CodeGroup
                    title="Response"
                    endPoint={end}
                  />}
                {end.responses["201"]?.schema &&
                  <CodeGroup
                    title="Response"
                    endPoint={end}
                  />}
              </Col>
            </Row>
            {"\n---"}
          </div>
        )
      })}
    </>
  )
}

const ParametersApi = ({ parameters }: { parameters: Parameter[] }) => {
  const params: Parameter[] = [];
  const query: Parameter[] = [];
  for (let p of parameters) {
    if (p.in === "query") {
      query.push(p)
    } else {
      params.push(p)
    }
  }

  return (
    <>
      {params.length > 0 && <>
        <h3>Path Parameters</h3>
        <Properties>
          {params.map((p, index) => {
            return (
              <Property
                key={`param-${p.name}-${index}`}
                name={p.name}
                type={p.type}
                required={p.required}
              >
                {p.description}
              </Property>
            )
          })}
        </Properties>
      </>}
      {query.length > 0 && <>
        <h3>Query Parameters</h3>
        <Properties>
          {query.map((p, index) => {
            return (
              <Property
                key={`query-${p.name}-${index}`}
                name={p.name}
                type={p.type}
                required={p.required}
              >
                {p.description}
              </Property>
            )
          })}
        </Properties>
      </>}
    </>
  )
}

const PostBodyApi = ({ bodyRequest, path }: { bodyRequest: Request[], path: string }) => {
  return (
    <>
      <h3>Request-Body Parameters</h3>
      <Properties>{renderProperties(bodyRequest, path)}</Properties>
    </>
  )
}


const renderProperties = (bodyRequest: Request[], path: string, prefix = "body",) => {
  return bodyRequest.map((req, index) => {
    const key = `${prefix}-${req.name}-${index}`

    if (req.bodyObj && req.bodyObj.length > 0 && req.type === "object" || req.type === "object[]") {
      return (
        <Property
          key={key}
          name={req.name}
          type={req.type}
          required={req.required}
          minLen={req.minLength}
          maxLen={req.maxLength}
          min={req.minimum}
          max={req.maximum}
          enumList={req.enumList}
        >
          <Details className="custom-details" open>
            <Summary>{req.description || "More Information"}</Summary>
            <Properties>
              {req.bodyObj && renderProperties(req.bodyObj, path, `nested-${req.name}`)}
            </Properties>
          </Details>
        </Property>
      )
    }

    // Primitive type
    return (
      <Property
        key={key}
        name={req.name}
        type={req.type}
        required={req.required}
        min={req.minimum}
        max={req.maximum}
        maxLen={req.maxLength}
        minLen={req.minLength}
        enumList={req.enumList}
      >
        {req.description}
      </Property>
    )
  })
}

