const template = `

export const title = '<%- tag %>'

<% operations.forEach(function(operation){ %>

## <%- operation.summary %> <% if(operation.deprecated) { %> <Badge status="warning" text="deprecated" /> <% } %><% if(operation["x-cloud-only"]) { %> <Badge status="cloud-only" text="cloud-only" hoverText="This feature is only available in the cloud version of NetBird." /> <% } %><% if(operation["x-experimental"]) { %> <Badge status="experimental" text="experimental" hoverText="This feature is experimental. The endpoint will likely change and we do not guarantee backwards compatibility." /> <% } %> {{ tag: '<%- operation.operation.toUpperCase() %>' , label: '<%- operation.path %>' }}

<Row>
  <Col>
    <%- operation.description %>
    <% if(operation.parameters && operation.parameters.filter((parameter) => parameter.in === 'path').length > 0){ %>
    ### Path Parameters
    <Properties>
        <%  operation.parameters.filter((parameter) => parameter.in === 'path').forEach(function(parameter){ %>
          <Property name="<%- parameter.name %>" type="string" required=\{true\}> 
            <%- parameter.description %>
          </Property>   
        <% }); -%>
    </Properties>
    <% }; -%>
    <% if(operation.parameters && operation.parameters.filter((parameter) => parameter.in === 'query').length > 0){ %>
    ### Query Parameters
    <Properties>
        <%  operation.parameters.filter((parameter) => parameter.in === 'query').forEach(function(parameter){ %>
            <Property name="<%- parameter.name %>" type="<%- parameter.schema.type %>" required=\{false\}>
              <%- parameter.description %>
            </Property>
        <% }); -%>
    </Properties>
    <% }; -%>
    <% if(operation.requestBody && operation.requestBody["content"]["application/json"].schema.properties){ %>
    ### Request-Body Parameters
    
    <%
function renderProperties(properties, required = [], depth = 0) {
    %><Properties><%
    Object.entries(properties).forEach(([key, value]) => {
        let type = value.type;
        var isRequired = required.includes(key) ? '{true}' : '{false}';

        if (type === 'array' && value.items) {
            if (value.items.type === 'object' && value.items.properties) {
                type = 'object[]';
            } else {
                type = value.items.type + '[]';
            }
        }

        %><Property name="<%- key %>" type="<%- type %>" required=<%- isRequired %><%
        if(value.enum) { 
            %> enumList={<%- JSON.stringify(value.enum) %>}<%
        }
        if(value.minimum !== undefined) { 
            %> min={<%- value.minimum %>}<%
        }
        if(value.maximum !== undefined) { 
            %> max={<%- value.maximum %>}<%
        }
        if(value.minLength !== undefined) { 
            %> minLen={<%- value.minLength %>}<%
        }
        if(value.maxLength !== undefined) { 
            %> maxLen={<%- value.maxLength %>}<%
        }
        %>>%>
        <% if ((type === 'object' && value.properties) || (type === 'object[]' && value.items.properties)) { %>
            <details className="custom-details" open>
                <summary><%- value.description || 'More Information' %></summary>
                <Properties>
                <% if (type === 'object[]') { %>
                    <% renderProperties(value.items.properties, value.items.required || [], depth + 1); %>
                <% } else { %>
                    <% renderProperties(value.properties, value.required || [], depth + 1); %>
                <% } %>
                </Properties>
            </details>
        <% } else { %>
            <% if(value.description) { %><%- value.description %><% } %>
        <% } %>
        </Property>
    <% });
    %></Properties><%
}

var schema = operation.requestBody["content"]["application/json"].schema;
if(schema && schema.properties) {
    renderProperties(schema.properties, schema.required || []);
}
%>

    
     <% }; -%>
  </Col>

  <Col sticky>
    <CodeGroup title="Request" tag="<%- operation.operation.toUpperCase() %>" label="<%- operation.path %>">
\`\`\`bash {{ title: 'cURL' }}
<% if(true){ -%>
curl -X <%- operation.operation.toUpperCase() %> <%- operation.fullPath %> \\<% }; -%>
<% if(operation.responseList[0].content && operation.responseList[0].content['application/json']){ %>
-H 'Accept: application/json' \\<% }; -%>
<% if(operation.requestBody?.content && operation.requestBody?.content['application/json']){ %>
-H 'Content-Type: application/json' \\<% }; %>
-H 'Authorization: Token <TOKEN>' <% if(operation.requestBody?.content && operation.requestBody?.content['application/json']){ %>\\\n--data-raw '<%- JSON.stringify(operation.request.example, null, 2) -%>'<% }; %>
\`\`\`

\`\`\`js
const axios = require('axios');
<% if(operation.requestBody?.content && operation.requestBody?.content['application/json']){ -%>
let data = JSON.stringify(<%- JSON.stringify(operation.request.example, null, 2) %>);<% }; -%>

let config = {
  method: '<%- operation.operation.toLowerCase() %>',
  maxBodyLength: Infinity,
  url: '<%- operation.path %>',
  <% if(true){%>headers: { <% }; -%>
    <% if(operation.responseList[0].content && operation.responseList[0].content['application/json']){ %>
    'Accept': 'application/json',<% }; -%>
    <% if(operation.requestBody?.content && operation.requestBody?.content['application/json']){ %>
    'Content-Type': 'application/json',<% }; %>
    'Authorization': 'Token <TOKEN>'
  <% if(true){ -%>}<% }; -%><% if(operation.requestBody?.content && operation.requestBody?.content['application/json']){ -%>,<% }; -%>
  <% if(operation.requestBody?.content && operation.requestBody?.content['application/json']){ %>
  data : data<% }; %>
};

axios(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});
\`\`\`

\`\`\`python
import requests
import json

url = "<%- operation.fullPath %>"
<% if(operation.requestBody?.content && operation.requestBody?.content['application/json']){ -%>
payload = json.dumps(<%- JSON.stringify(operation.request.example, null, 2) %>)<% }; -%>

<% if(true){%>headers = { <% }; -%>
  <% if(operation.requestBody?.content && operation.requestBody?.content['application/json']){ %>
  'Content-Type': 'application/json',<% }; -%>
  <% if(operation.responseList[0].content && operation.responseList[0].content['application/json']){ %>
  'Accept': 'application/json',<% }; %>
  'Authorization': 'Token <TOKEN>'
}

response = requests.request("<%- operation.operation.toUpperCase() %>", url, headers=headers<% if(operation.requestBody?.content && operation.requestBody?.content['application/json']){ %>, data=payload<% }; %>)

print(response.text)
\`\`\`

\`\`\`go
package main

import (
  "fmt"
  "strings"
  "net/http"
  "io/ioutil"
)

func main() {

  url := "<%- operation.fullPath %>"
  method := "<%- operation.operation.toUpperCase() %>"
  <% if(operation.requestBody?.content && operation.requestBody?.content['application/json']){ %>
  payload := strings.NewReader(\`<%- JSON.stringify(operation.request.example, null, 2) %>\`)<% }; -%>

  client := &http.Client {
  }
  req, err := http.NewRequest(method, url, <% if(operation.requestBody?.content && operation.requestBody?.content['application/json']){ %>payload<% } else { %>nil<% }; %>)

  if err != nil {
    fmt.Println(err)
    return
  <% if(true){%>{<% }; -%>
  
  <% if(operation.requestBody?.content && operation.requestBody?.content['application/json']){ %>
  req.Header.Add("Content-Type", "application/json")<% }; -%>
  <% if(operation.responseList[0].content && operation.responseList[0].content['application/json']){ %>
  req.Header.Add("Accept", "application/json")<% }; %>
  req.Header.Add("Authorization", "Token <TOKEN>")

  res, err := client.Do(req)
  if err != nil {
    fmt.Println(err)
    return
  }
  defer res.Body.Close()

  body, err := ioutil.ReadAll(res.Body)
  if err != nil {
    fmt.Println(err)
    return
  }
  fmt.Println(string(body))
}
\`\`\`

\`\`\`ruby
require "uri"
require "json"
require "net/http"

url = URI("<%- operation.fullPath %>")

https = Net::HTTP.new(url.host, url.port)
https.use_ssl = true

<% if(true){ %>request = Net::HTTP::<%- operation.operation.slice(0,1).toUpperCase() + operation.operation.slice(1).toLowerCase()%>.new(url)<% }; -%>
<% if(operation.requestBody?.content && operation.requestBody?.content['application/json']){ %>
request["Content-Type"] = "application/json"<% }; -%>
<% if(operation.responseList[0].content && operation.responseList[0].content['application/json']){ %>
request["Accept"] = "application/json"<% }; %>
request["Authorization"] = "Token <TOKEN>"
<% if(operation.requestBody?.content && operation.requestBody?.content['application/json']){ %>
request.body = JSON.dump(<%- JSON.stringify(operation.request.example, null, 2) %>)<% }; -%>

response = https.request(request)
puts response.read_body
\`\`\`

\`\`\`java
OkHttpClient client = new OkHttpClient().newBuilder()
  .build();
<% if(operation.requestBody?.content && operation.requestBody?.content['application/json']){ -%>
MediaType mediaType = MediaType.parse("application/json");
RequestBody body = RequestBody.create(mediaType, '<%- JSON.stringify(operation.request.example, null, 2) %>');<% }; %>
Request request = new Request.Builder()
  .url("<%- operation.fullPath %>")
  <% if(true){ %>.method("<%- operation.operation.toUpperCase() %>"<% if(operation.requestBody?.content && operation.requestBody?.content['application/json']){ %>, body<% }; %>)<% }; -%>
  <% if(operation.requestBody?.content && operation.requestBody?.content['application/json']){ %>
  .addHeader("Content-Type", "application/json")<% }; -%>
  <% if(operation.responseList[0].content && operation.responseList[0].content['application/json']){ %>
  .addHeader("Accept", "application/json")<% }; %>
  .addHeader("Authorization: Token <TOKEN>")
  .build();
Response response = client.newCall(request).execute();
\`\`\`

\`\`\`php
<?php

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => '<%- operation.fullPath %>',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  <% if(true){ %>CURLOPT_CUSTOMREQUEST => '<%- operation.operation.toUpperCase() %>',<% }; -%>
  <% if(operation.requestBody?.content && operation.requestBody?.content['application/json']){ %>
  CURLOPT_POSTFIELDS => '<%- JSON.stringify(operation.request.example, null, 2) %>',<% }; %>
  <% if(true){ %>CURLOPT_HTTPHEADER => array(<% }; -%>
    <% if(operation.requestBody?.content && operation.requestBody?.content['application/json']){ %>
    'Content-Type: application/json',<% }; -%>
    <% if(operation.responseList[0].content && operation.responseList[0].content['application/json']){ %>
    'Accept: application/json',<% }; %>
    'Authorization: Token <TOKEN>'
  ),
));

$response = curl_exec($curl);

curl_close($curl);
echo $response;
\`\`\`

    </CodeGroup>
    
    <% if(operation.response){ %>
    <CodeGroup title="Response">
\`\`\`json {{ title: 'Example' }}
<%- JSON.stringify(operation.response.example, null, 2) %>
\`\`\`
\`\`\`json {{ title: 'Schema' }}
<%- JSON.stringify(operation.response.schema, null, 2) %>
\`\`\`
    </CodeGroup>
    <% }; %>
 
  </Col>
</Row>

---
<% }); -%>
`.trim()

export default template
