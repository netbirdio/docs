import { Endpoint } from "../../tsxParser/openapi-extractor"


export const requestCode = (endPoint: Endpoint) => {
  const body = {};
  endPoint?.request?.map(req => {
    if (req.example !== undefined) {
      body[req.name] = req.example
    }
  })

  const bodyJson = JSON.stringify(body, null, 2)

  switch (endPoint.method) {
    case 'GET':
      return getRequestCode(endPoint.path)
    case "POST":
      return postRequestCode(endPoint.path, bodyJson)
    case "PUT":
      return putRequestCode(endPoint.path, bodyJson)
    case "DELETE":
      return deleteRequestCode(endPoint.path)
  }
}

const deleteRequestCode = (url: string) => {
  const langCode = []
  langCode.push(`\`\`\`bash {{ title: 'cURL' }}
curl -X DELETE https://api.netbird.io${url} \\
-H 'Authorization: Token <TOKEN>' \\
\`\`\``)

  return langCode
}

const putRequestCode = (url: string, body: string | null) => {
  const langCode = []
  const lines: string[] = [
    `curl -X PUT https://api.netbird.io${url} \\`,
    `-H 'Authorization: Token <TOKEN>' \\`,
  ]

  if (body && body !== "{}") {
    lines.push(`-H 'Accept: application/json' \\`)
    lines.push(`-H 'Content-Type: application/json' \\`)
    lines.push(`--data-raw '${body}'`)
  }

  langCode.push(`\`\`\`bash {{ title: 'cURL' }}\n${lines.join("\n")}\n\`\`\``)
  return langCode
}



const postRequestCode = (url: string, body: string | null) => {
  const langCode = []
  const lines: string[] = [
    `curl -X POST https://api.netbird.io${url} \\`,
    `-H 'Authorization: Token <TOKEN>' \\`,
  ]

  if (body && body !== "{}") {
    lines.push(`-H 'Accept: application/json' \\`)
    lines.push(`-H 'Content-Type: application/json' \\`)
    lines.push(`--data-raw '${body}'`)
  }

  langCode.push(`\`\`\`bash {{ title: 'cURL' }}\n${lines.join("\n")}\n\`\`\``)

  return langCode
}




const getRequestCode = (label: string) => {
  const langCode = []
  langCode.push(`\`\`\`bash {{ title: 'cURL' }}
curl -X GET https://api.netbird.io${label} \\
-H 'Accept: application/json' \\
-H 'Authorization: Token <TOKEN>' 
\`\`\``)

  return langCode
}

