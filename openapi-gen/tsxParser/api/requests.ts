export const requestCode = (method: string, url: string, body: string) => {
  switch (method) {
    case 'GET':
      return getRequestCode(url)
    case "POST":
      return postRequestCode(url, body)
    case "PUT":
    return putRequestCode(url, body)
    case "DELETE":
    return deleteRequestCode(url)
  }
}

const deleteRequestCode = (url:string) => {
  const langCode = []
  langCode.push(`\`\`\`bash {{ title: 'cURL' }}
curl -X DELETE https://api.netbird.io${url} \\
-H 'Authorization: Token <TOKEN>' \\
\`\`\``)

  return langCode
}

const putRequestCode = (url:string, body:string) => {
  const langCode = []
  langCode.push(`\`\`\`bash {{ title: 'cURL' }}
curl -X PUT https://api.netbird.io${url} \\
-H 'Accept: application/json' \\
-H 'Content-Type: application/json' \\
-H 'Authorization: Token <TOKEN>' \\
--data-raw '${body}'
\`\`\``)

  return langCode
}



const postRequestCode = (url: string, body: string) => {
  const langCode = []
  langCode.push(`\`\`\`bash {{ title: 'cURL' }}
curl -X POST https://api.netbird.io${url} \\
-H 'Accept: application/json' \\
-H 'Content-Type: application/json' \\
-H 'Authorization: Token <TOKEN>' \\
--data-raw '${body}'
\`\`\``)

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

