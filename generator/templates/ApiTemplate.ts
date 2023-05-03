const template = `
import {HeroPattern} from "@/components/HeroPattern"; import {Note} from "@/components/mdx";

<HeroPattern />

export const title = '<%- tag %>'

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
-H "Authorization: Token <TOKEN>" \\
<% if(operation.responseList[0].content && operation.responseList[0].content['application/json']){ -%>
-H 'Accept: application/json' \\<% }; %>
<% if(operation.requestBody?.content && operation.requestBody?.content['application/json']){ -%>
-H 'Content-Type: application/json' \\
--data-raw '<%- JSON.stringify(schemas.get(operation.requestBody?.content['application/json'].schema.$ref?.split('/').pop())?.examples, null, 2) %>'<% }; %>
\`\`\`

\`\`\`js
const axios = require('axios');
<% if(operation.requestBody?.content && operation.requestBody?.content['application/json']){ -%>
let data = JSON.stringify(<%- JSON.stringify(schemas.get(operation.requestBody?.content['application/json'].schema.$ref?.split('/').pop())?.examples, null, 2) %>);<% }; -%>

let config = {
  method: '<%- operation.operation.toLowerCase() %>',
  maxBodyLength: Infinity,
  url: '<%- operation.path %>',
  headers: { 
    <% if(operation.requestBody?.content && operation.requestBody?.content['application/json']){ -%>'Content-Type': 'application/json',<% }; %>
    <% if(operation.responseList[0].content && operation.responseList[0].content['application/json']){ -%>'Accept': 'application/json',<% }; %>
    'Authorization': 'Token <TOKEN>'
  }<% if(operation.requestBody?.content && operation.requestBody?.content['application/json']){ -%>,<% }; %>
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
payload = json.dumps(<%- JSON.stringify(schemas.get(operation.requestBody?.content['application/json'].schema.$ref?.split('/').pop())?.examples, null, 2) %>)<% }; -%>

headers = {
  <% if(operation.requestBody?.content && operation.requestBody?.content['application/json']){ -%>'Content-Type': 'application/json',<% }; %>
  <% if(operation.responseList[0].content && operation.responseList[0].content['application/json']){ -%>'Accept': 'application/json',<% }; %>
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
  payload := strings.NewReader(\`<%- JSON.stringify(schemas.get(operation.requestBody?.content['application/json'].schema.$ref?.split('/').pop())?.examples, null, 2) %>\`)<% }; -%>

  client := &http.Client {
  }
  req, err := http.NewRequest(method, url, <% if(operation.requestBody?.content && operation.requestBody?.content['application/json']){ %>payload<% } else { %>nil<% }; %>)

  if err != nil {
    fmt.Println(err)
    return
  }
  
  <% if(operation.requestBody?.content && operation.requestBody?.content['application/json']){ -%>req.Header.Add("Content-Type", "application/json")<% }; %>
  <% if(operation.responseList[0].content && operation.responseList[0].content['application/json']){ -%>req.Header.Add("Accept", "application/json")<% }; %>
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

request = Net::HTTP::<%- operation.operation.slice(0,1).toUpperCase() + operation.operation.slice(1).toLowerCase()%>.new(url)
<% if(operation.requestBody?.content && operation.requestBody?.content['application/json']){ -%>request["Content-Type"] = "application/json"<% }; %>
<% if(operation.responseList[0].content && operation.responseList[0].content['application/json']){ -%>request["Accept"] = "application/json"<% }; %>
request["Authorization"] = "Token <TOKEN>"
<% if(operation.requestBody?.content && operation.requestBody?.content['application/json']){ %>
request.body = JSON.dump(<%- JSON.stringify(schemas.get(operation.requestBody?.content['application/json'].schema.$ref?.split('/').pop())?.examples, null, 2) %>)<% }; -%>

response = https.request(request)
puts response.read_body
\`\`\`

\`\`\`java
OkHttpClient client = new OkHttpClient().newBuilder()
  .build();
<% if(operation.requestBody?.content && operation.requestBody?.content['application/json']){ -%>
MediaType mediaType = MediaType.parse("application/json");
RequestBody body = RequestBody.create(mediaType, '<%- JSON.stringify(schemas.get(operation.requestBody?.content['application/json'].schema.$ref?.split('/').pop())?.examples, null, 2) %>');<% }; %>
Request request = new Request.Builder()
  .url("<%- operation.fullPath %>")
  .method("<%- operation.operation.toUpperCase() %>"<% if(operation.requestBody?.content && operation.requestBody?.content['application/json']){ -%>, body<% }; %>)
  <% if(operation.requestBody?.content && operation.requestBody?.content['application/json']){ -%>.addHeader("Content-Type", "application/json")<% }; %>
  <% if(operation.responseList[0].content && operation.responseList[0].content['application/json']){ -%>.addHeader("Accept", "application/json")<% }; %>
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
  CURLOPT_CUSTOMREQUEST => '<%- operation.operation.toUpperCase() %>',
  <% if(operation.requestBody?.content && operation.requestBody?.content['application/json']){ %>
  CURLOPT_POSTFIELDS =>'<%- JSON.stringify(schemas.get(operation.requestBody?.content['application/json'].schema.$ref?.split('/').pop())?.examples, null, 2) %>',<% }; %>
  CURLOPT_HTTPHEADER => array(
    <% if(operation.requestBody?.content && operation.requestBody?.content['application/json']){ -%>'Content-Type: application/json',<% }; %>
    <% if(operation.responseList[0].content && operation.responseList[0].content['application/json']){ -%>'Accept: application/json',<% }; %>
    'Authorization: Token <TOKEN>'
  ),
));

$response = curl_exec($curl);

curl_close($curl);
echo $response;
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
