
export const responseCode = (schema: string, example: string) => {
  const langCode = []
  langCode.push(`\`\`\`json {{ title: 'Example' }}
${example}
\`\`\``)

  langCode.push(`\`\`\`json {{ title: 'Schema' }}
${schema}
\`\`\``)

  return langCode
} 
