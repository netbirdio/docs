import { Endpoint, Parameter, Request } from "../tsxParser/openapi-extractor"
import { CodeGroup, Col, Row, Stringify, Property, Properties, Details, Summary } from "../tsxParser/components"

export type ApiTemplateProps = {
  tag: string,
  endpoints: Endpoint[]
}

export const ApiTemplate = ({ tag, endpoints}: ApiTemplateProps) => {
  return (
    <>
      <Stringify str={`export const title = '${tag}'`} />

      {endpoints.map((ap, index) => {
        return (
          <div key={`${ap.method}-${ap.path}-${index}`}>
            <h2>
              {ap.summary}
              {` {{ tag: '${ap.method.toUpperCase()}', label: '${ap.path}' }}`}
            </h2>

            <Row>
              <Col>
                {ap.description}

                {/* Handle Path Parameters for all methods that might have them */}
                {ap.parameters && ap.parameters.length > 0 && (
                  <ParametersApi parameters={ap.parameters} />
                )}

                {/* Handle Request Body for POST/PUT methods */}
                {(ap.method === "POST" || ap.method === "PUT") && ap.request && (
                  <PostBodyApi bodyRequest={ap.request} />
                )}
              </Col>

              <Col sticky>
                <CodeGroup
                  title="Request"
                  endPoint={ap}
                />
                {ap.responses["200"]?.schema &&
                  <CodeGroup
                    title="Response"
                    endPoint={ap}
                  />}
                {ap.responses["201"]?.schema &&
                  <CodeGroup
                    title="Response"
                    endPoint={ap}
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
  return (
    <>
      <h3>Path Parameters</h3>
      <Properties>
        {parameters.map((p, index) => {
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
    </>
  )
}

const PostBodyApi = ({ bodyRequest }: { bodyRequest: Request[] }) => {
  return (
    <>
      <h3>Request-Body Parameters</h3>
      <Properties>
        {bodyRequest.map((req, index) => {
          if (req.type === "object[]" || req.type === "object") {
            return (
              <Property
                key={`body-${req.name}-${index}`}
                name={req.name}
                type={req.type}
                required={req.required}
                minLen={req.minLen}
                maxLen={req.maxLen}
                enumList={req.enumList}
              >
                <Details className="custom-details" open>
                  <Summary>{req.description || "Object list"}</Summary>
                  <Properties>
                    <Properties>
                      {req?.bodyObj?.map((ob, objIndex) => {
                        return (
                          <Property
                            key={`nested-${ob.name}-${objIndex}`}
                            name={ob.name}
                            type={ob.type}
                            required={ob.required}
                            minLen={ob.minLen}
                            maxLen={ob.maxLen}
                            enumList={ob.enumList}
                          >
                            {ob.description}
                          </Property>
                        )
                      })}
                    </Properties>
                  </Properties>
                </Details>
              </Property>
            )
          } else {
            // Handle regular properties (not object arrays)
            return (
              <Property
                key={`body-${req.name}-${index}`}
                name={req.name}
                type={req.type}
                required={req.required}
                minLen={req.minLen}
                maxLen={req.maxLen}
                enumList={req.enumList}
              >
                {req.description}
              </Property>
            )
          }
        })}
      </Properties>
    </>
  )
}
