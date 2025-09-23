import { Endpoint } from "../../tsxParser/openapi-extractor"


export const requestCode = (endPoint: Endpoint) => {
  const body = getRequestBody(endPoint)
  switch (endPoint.method) {
    case 'GET':
      return getRequestCode(endPoint.path)
    case "POST":
      return postRequestCode(endPoint.path, body)
    case "PUT":
      return putRequestCode(endPoint.path, body)
    case "DELETE":
      return deleteRequestCode(endPoint.path)
  }
}

export const getRequestBody = (endPoint: Endpoint) => {
  const body: Record<string, any> = {};

  if (!endPoint?.request) return "{}";

  for (const req of endPoint.request) {
    if (req.isOneOf && req.bodyObj?.[0]?.bodyObj) {
      body[req.name] = Object.fromEntries(
        req.bodyObj[0].bodyObj.map(({ name, example }) => [name, example])
      );
      continue;
    }

    if (req.example !== undefined) {
      body[req.name] = req.example;
    }
  }

  return JSON.stringify(body, null, 2);
};


export const deleteRequestCode = (url: string) => {
  const snippets: string[] = []

 // ---------------- cURL ----------------
  snippets.push(`\`\`\`bash {{ title: 'cURL' }}
curl -X DELETE https://api.netbird.io${url} \\
-H 'Authorization: Token <TOKEN>'
\`\`\``)

  // ---------------- JavaScript (Axios) ----------------
  snippets.push(`\`\`\`js
const axios = require('axios');

let config = {
  method: 'delete',
  maxBodyLength: Infinity,
  url: 'https://api.netbird.io${url}',
  headers: {
    'Authorization': 'Token <TOKEN>'
  }
};

axios(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});
\`\`\``)

  // ---------------- Python ----------------
  snippets.push(`\`\`\`python
import requests

url = "https://api.netbird.io${url}"

headers = {
  'Authorization': 'Token <TOKEN>'
}

response = requests.request("DELETE", url, headers=headers)
print(response.text)
\`\`\``)

  // ---------------- Go ----------------
  snippets.push(`\`\`\`go
package main

import (
  "fmt"
  "net/http"
  "io/ioutil"
)

func main() {
  url := "https://api.netbird.io${url}"
  method := "DELETE"

  client := &http.Client{}
  req, err := http.NewRequest(method, url, nil)
  if err != nil {
    fmt.Println(err)
    return
  }

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
\`\`\``)

 // ---------------- Ruby ----------------
  snippets.push(`\`\`\`ruby
require "uri"
require "net/http"

url = URI("https://api.netbird.io${url}")

https = Net::HTTP.new(url.host, url.port)
https.use_ssl = true

request = Net::HTTP::Delete.new(url)
request["Authorization"] = "Token <TOKEN>"

response = https.request(request)
puts response.read_body
\`\`\``)

 // ---------------- Java ----------------
  snippets.push(`\`\`\`java
OkHttpClient client = new OkHttpClient().newBuilder().build();

Request request = new Request.Builder()
  .url("https://api.netbird.io${url}")
  .method("DELETE", null)
  .addHeader("Authorization", "Token <TOKEN>")
  .build();

Response response = client.newCall(request).execute();
\`\`\``)

 // ---------------- PHP ----------------
  snippets.push(`\`\`\`php
<?php

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://api.netbird.io${url}',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'DELETE',
  CURLOPT_HTTPHEADER => array(
    'Authorization: Token <TOKEN>'
  ),
));

$response = curl_exec($curl);
curl_close($curl);
echo $response;
\`\`\``)

  return snippets
}

export const putRequestCode = (url: string, body: string) => {
  const langCode: string[] = []

  // ---------------- cURL ----------------
  const curlLines: string[] = [
    `curl -X PUT https://api.netbird.io${url} \\`,
    `-H 'Accept: application/json' \\`,
    `-H 'Content-Type: application/json' \\`,
    `-H 'Authorization: Token <TOKEN>' \\`,
    `--data-raw '${body}'`
  ]
  langCode.push(`\`\`\`bash {{ title: 'cURL' }}\n${curlLines.join("\n")}\n\`\`\``)

  // ---------------- JavaScript (Axios) ----------------
  langCode.push(`\`\`\`js {{ title: 'JavaScript' }}
const axios = require('axios');
let data = JSON.stringify(${body});
let config = {
  method: 'put',
  maxBodyLength: Infinity,
  url: 'https://api.netbird.io${url}',
  headers: {     
    'Accept': 'application/json',    
    'Content-Type': 'application/json',
    'Authorization': 'Token <TOKEN>'
  },  
  data : data
};

axios(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});
\`\`\``)

  // ---------------- Python ----------------
  langCode.push(`\`\`\`python {{ title: 'Python' }}
import requests
import json

url = "https://api.netbird.io${url}"
payload = json.dumps(${body})
headers = {   
  'Content-Type': 'application/json',  
  'Accept': 'application/json',
  'Authorization': 'Token <TOKEN>'
}

response = requests.request("PUT", url, headers=headers, data=payload)

print(response.text)
\`\`\``)

  // ---------------- Go ----------------
  langCode.push(`\`\`\`go {{ title: 'Go' }}
package main

import (
  "fmt"
  "strings"
  "net/http"
  "io/ioutil"
)

func main() {

  url := "https://api.netbird.io${url}"
  method := "PUT"
  
  payload := strings.NewReader(${body})
  client := &http.Client{}
  req, err := http.NewRequest(method, url, payload)

  if err != nil {
    fmt.Println(err)
    return
  }  
  
  req.Header.Add("Content-Type", "application/json")  
  req.Header.Add("Accept", "application/json")
  req.Header.Add("Authorization", "Token <TOKEN>")

  res, err := client.Do(req)
  if err != nil {
    fmt.Println(err)
    return
  }
  defer res.Body.Close()

  resBody, err := ioutil.ReadAll(res.Body)
  if err != nil {
    fmt.Println(err)
    return
  }
  fmt.Println(string(resBody))
}
\`\`\``)

  // ---------------- Ruby ----------------
  langCode.push(`\`\`\`ruby {{ title: 'Ruby' }}
require "uri"
require "json"
require "net/http"

url = URI("https://api.netbird.io${url}")

https = Net::HTTP.new(url.host, url.port)
https.use_ssl = true

request = Net::HTTP::Put.new(url)
request["Content-Type"] = "application/json"
request["Accept"] = "application/json"
request["Authorization"] = "Token <TOKEN>"

request.body = JSON.dump(${body})
response = https.request(request)
puts response.read_body
\`\`\``)

  // ---------------- Java ----------------
  langCode.push(`\`\`\`java {{ title: 'Java' }}
OkHttpClient client = new OkHttpClient().newBuilder()
  .build();
MediaType mediaType = MediaType.parse("application/json");
RequestBody body = RequestBody.create(mediaType, '${body}');
Request request = new Request.Builder()
  .url("https://api.netbird.io${url}")
  .method("PUT", body)  
  .addHeader("Content-Type", "application/json")  
  .addHeader("Accept", "application/json")
  .addHeader("Authorization", "Token <TOKEN>")
  .build();
Response response = client.newCall(request).execute();
\`\`\``)

  // ---------------- PHP ----------------
  langCode.push(`\`\`\`php {{ title: 'PHP' }}
<?php

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://api.netbird.io${url}',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'PUT',  
  CURLOPT_POSTFIELDS => '${body}',
  CURLOPT_HTTPHEADER => array(    
    'Content-Type: application/json',    
    'Accept: application/json',
    'Authorization: Token <TOKEN>'
  ),
));

$response = curl_exec($curl);

curl_close($curl);
echo $response;
\`\`\``)

  return langCode
}

const postRequestCode = (url: string, body: string) => {
  const langCode: string[] = []

  // ---------------- cURL ----------------
  const curlLines: string[] = [
    `curl -X POST https://api.netbird.io${url} \\`,
    `-H 'Accept: application/json' \\`,
    `-H 'Content-Type: application/json' \\`,
    `-H 'Authorization: Token <TOKEN>' \\`,
    `--data-raw '${body}'`
  ]
  langCode.push(`\`\`\`bash {{ title: 'cURL' }}\n${curlLines.join("\n")}\n\`\`\``)

  // ---------------- JavaScript (Axios) ----------------
  langCode.push(`\`\`\`js {{ title: 'JavaScript' }}
const axios = require('axios');
let data = JSON.stringify(${body});
let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://api.netbird.io${url}',
  headers: {     
    'Accept': 'application/json',    
    'Content-Type': 'application/json',
    'Authorization': 'Token <TOKEN>'
  },  
  data : data
};

axios(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});
\`\`\``)

  // ---------------- Python ----------------
  langCode.push(`\`\`\`python {{ title: 'Python' }}
import requests
import json

url = "https://api.netbird.io${url}"
payload = json.dumps(${body})
headers = {   
  'Content-Type': 'application/json',  
  'Accept': 'application/json',
  'Authorization': 'Token <TOKEN>'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)
\`\`\``)

  // ---------------- Go ----------------
  langCode.push(`\`\`\`go {{ title: 'Go' }}
package main

import (
  "fmt"
  "strings"
  "net/http"
  "io/ioutil"
)

func main() {

  url := "https://api.netbird.io${url}"
  method := "POST"
  
  payload := strings.NewReader('${body}')
  client := &http.Client{}
  req, err := http.NewRequest(method, url, payload)

  if err != nil {
    fmt.Println(err)
    return
  }  
  
  req.Header.Add("Content-Type", "application/json")  
  req.Header.Add("Accept", "application/json")
  req.Header.Add("Authorization", "Token <TOKEN>")

  res, err := client.Do(req)
  if err != nil {
    fmt.Println(err)
    return
  }
  defer res.Body.Close()

  resBody, err := ioutil.ReadAll(res.Body)
  if err != nil {
    fmt.Println(err)
    return
  }
  fmt.Println(string(resBody))
}
\`\`\``)

  // ---------------- Ruby ----------------
  langCode.push(`\`\`\`ruby {{ title: 'Ruby' }}
require "uri"
require "json"
require "net/http"

url = URI("https://api.netbird.io${url}")

https = Net::HTTP.new(url.host, url.port)
https.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Content-Type"] = "application/json"
request["Accept"] = "application/json"
request["Authorization"] = "Token <TOKEN>"

request.body = JSON.dump(${body})
response = https.request(request)
puts response.read_body
\`\`\``)

  // ---------------- Java ----------------
  langCode.push(`\`\`\`java {{ title: 'Java' }}
OkHttpClient client = new OkHttpClient().newBuilder()
  .build();
MediaType mediaType = MediaType.parse("application/json");
RequestBody body = RequestBody.create(mediaType, '${body}';
Request request = new Request.Builder()
  .url("https://api.netbird.io${url}")
  .method("POST", body)  
  .addHeader("Content-Type", "application/json")  
  .addHeader("Accept", "application/json")
  .addHeader("Authorization", "Token <TOKEN>")
  .build();
Response response = client.newCall(request).execute();
\`\`\``)

  // ---------------- PHP ----------------
  langCode.push(`\`\`\`php {{ title: 'PHP' }}
<?php

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://api.netbird.io${url}',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'POST',  
  CURLOPT_POSTFIELDS => '${body}',
  CURLOPT_HTTPHEADER => array(    
    'Content-Type: application/json',    
    'Accept: application/json',
    'Authorization: Token <TOKEN>'
  ),
));

$response = curl_exec($curl);

curl_close($curl);
echo $response;
\`\`\``)

  return langCode
}

const getRequestCode = (label: string) => {
  const langCode: string[] = []

  // ---------------- cURL ----------------
  langCode.push(`\`\`\`bash {{ title: 'cURL' }}
curl -X GET https://api.netbird.io${label} \\
-H 'Accept: application/json' \\
-H 'Authorization: Token <TOKEN>' 
\`\`\``)

  // ---------------- JavaScript (Axios) ----------------
  langCode.push(`\`\`\`js {{ title: 'JavaScript' }}
const axios = require('axios');

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'https://api.netbird.io${label}',
  headers: {     
    'Accept': 'application/json',    
    'Authorization': 'Token <TOKEN>'
  }  
};

axios(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});
\`\`\``)

  // ---------------- Python ----------------
  langCode.push(`\`\`\`python {{ title: 'Python' }}
import requests
import json

url = "https://api.netbird.io${label}"

headers = {     
  'Accept': 'application/json',
  'Authorization': 'Token <TOKEN>'
}

response = requests.request("GET", url, headers=headers)

print(response.text)
\`\`\``)

  // ---------------- Go ----------------
  langCode.push(`\`\`\`go {{ title: 'Go' }}
package main

import (
  "fmt"
  "net/http"
  "io/ioutil"
)

func main() {
  url := "https://api.netbird.io${label}"
  method := "GET"
  
  client := &http.Client{}
  req, err := http.NewRequest(method, url, nil)

  if err != nil {
    fmt.Println(err)
    return
  }
  
  req.Header.Add("Accept", "application/json")
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
\`\`\``)

  // ---------------- Ruby ----------------
  langCode.push(`\`\`\`ruby {{ title: 'Ruby' }}
require "uri"
require "json"
require "net/http"

url = URI("https://api.netbird.io${label}")

https = Net::HTTP.new(url.host, url.port)
https.use_ssl = true

request = Net::HTTP::Get.new(url)
request["Accept"] = "application/json"
request["Authorization"] = "Token <TOKEN>"

response = https.request(request)
puts response.read_body
\`\`\``)

  // ---------------- Java ----------------
  langCode.push(`\`\`\`java {{ title: 'Java' }}
OkHttpClient client = new OkHttpClient().newBuilder()
  .build();

Request request = new Request.Builder()
  .url("https://api.netbird.io${label}")
  .method("GET", null)    
  .addHeader("Accept", "application/json")
  .addHeader("Authorization", "Token <TOKEN>")
  .build();
Response response = client.newCall(request).execute();
\`\`\``)

  // ---------------- PHP ----------------
  langCode.push(`\`\`\`php {{ title: 'PHP' }}
<?php

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://api.netbird.io${label}',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'GET',  
  CURLOPT_HTTPHEADER => array(        
    'Accept: application/json',
    'Authorization: Token <TOKEN>'
  ),
));

$response = curl_exec($curl);

curl_close($curl);
echo $response;
\`\`\``)

  return langCode
}
