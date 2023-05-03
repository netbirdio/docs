const template = `


---

<% operations.forEach(function(operation){ %>

## <%- operation.summary %> {{ tag: '<%- operation.operation.toUpperCase() %>' , label: '<%- operation.path %>' }}

<Row>
  <Col>
    <%- operation.description %>
    <% if(operation.parameters && operation.parameters.filter((parameter) => parameter.in === 'path').length > 0){ %>
    #### Path Parameters
    <Properties>
        <%  operation.parameters.filter((parameter) => parameter.in === 'path').forEach(function(parameter){ %>
          <Property name="<%- parameter.name %>" type="string" required=\{true\}> 
            <%- parameter.description %>
          </Property>   
        <% }); -%>
    </Properties>
    <% }; -%>
    <% if(operation.parameters && operation.parameters.filter((parameter) => parameter.in === 'query').length > 0){ %>
    #### Query Parameters
    <Properties>
        <%  operation.parameters.filter((parameter) => parameter.in === 'query').forEach(function(parameter){ %>
            <Property name="<%- parameter.name %>" type="<%- parameter.schema.type %>" required=\{false\}>
              <%- parameter.description %>
            </Property>
        <% }); -%>
    </Properties>
    <% }; -%>
    <% if(operation.requestBody?.content && operation.requestBody?.content['application/json']){ %>
    #### Request-Body Parameters
    <Properties>
        <% schemas.get(operation.requestBody?.content['application/json'].schema.$ref.split('/').pop())?.parameters.forEach(function(parameter){ %>
          <Property name="<%- parameter.name %>" type="<%- parameter.type %>" required=\{<%- parameter.required %>\} 
          <% if(parameter.enum){ %>
          enumList="<%- parameter.enum %>"
          <% }; -%> 
          <% if(parameter.minimum){ %>
          min=\{<%- parameter.minimum %>\}
          <% }; -%> 
          <% if(parameter.maximum){ %>
          max=\{<%- parameter.maximum %>\}
          <% }; -%>
          <% if(parameter.minLength){ %>
          minLen=\{<%- parameter.minLength %>\}
          <% }; -%>
          <% if(parameter.maxLength){ %>
          maxLen=\{<%- parameter.maxLength %>\}
          <% }; -%> > 
          <%- parameter.description %>
          </Property>
        <% }); -%>
    </Properties>   
     <% }; -%>
  </Col>

  <Col sticky>
    <CodeGroup title="Request" tag="<%- operation.operation.toUpperCase() %>" label="<%- operation.path %>">
\`\`\`bash {{ title: 'cURL' }}
curl -X <%- operation.operation.toUpperCase() %> <%- operation.fullPath %> \\
-H "Authorization: Bearer {token}" \\
<% if(operation.responseList[0].content && operation.responseList[0].content['application/json']){ -%>
-H 'Accept: application/json' \\<% }; %>
<% if(operation.requestBody?.content && operation.requestBody?.content['application/json']){ -%>
-H 'Content-Type: application/json' \\
--data-raw '<%- JSON.stringify(schemas.get(operation.requestBody?.content['application/json'].schema.$ref?.split('/').pop())?.examples, null, 2) %>'<% }; %>
\`\`\`

    \`\`\`js
    import ApiClient from '@example/protocol-api'

    const client = new ApiClient(token)

    await client.contacts.update('WAz8eIbvDR60rouK', {
        display_name: 'UncleFrank',
    })
    \`\`\`

    \`\`\`python
    from protocol_api import ApiClient

    client = ApiClient(token)

    client.contacts.update("WAz8eIbvDR60rouK", display_name="UncleFrank")
    \`\`\`

    \`\`\`php
    $client = new \\Protocol\\ApiClient($token);

    $client->contacts->update('WAz8eIbvDR60rouK', [
      'display_name' => 'UncleFrank',
    ]);
    \`\`\`

    </CodeGroup>
    <% operation.responseList.forEach(function(response){ %>
        <% if(response?.content && response?.content['application/json']){ %>
            <% if(response?.content['application/json'].schema.type === 'array'){ %>
                <CodeGroup title="Response">
\`\`\`json {{ title: '200' }}
<%- JSON.stringify(new Array(schemas.get(response?.content['application/json'].schema.items.$ref?.split('/').pop())?.examples), null, 2)  %>
\`\`\`
                </CodeGroup>
            <% } else { %>
                <CodeGroup title="Response">
\`\`\`json {{ title: '200' }}
<%- JSON.stringify(schemas.get(response?.content['application/json'].schema.$ref?.split('/').pop())?.examples, null, 2)  %>
\`\`\`
                </CodeGroup>
           <% }; -%>     
        <% }; -%>
    <% }); -%>
  </Col>
</Row>

---
<% }); -%>
`.trim()

export default template
