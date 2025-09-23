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

