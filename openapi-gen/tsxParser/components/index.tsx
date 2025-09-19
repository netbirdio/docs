import React from "react";
import { requestCode } from "../api/requests";
import { responseCode } from "../api/responses";
import { Endpoint } from "../openapi-extractor";

export const Stringify = ({ str }: { str: string }) => <>{str}</>

export const Row = ({ children }) => <>
  {"\n<"}Row{">\n"}
  {children}
  {"\n</"}Row{">"}
</>

export const Details = ({ children, className, open }: { children: React.ReactNode, className: string, open?: boolean }) => <>
  {"\n<"}details{className ? ` class="${className}" ` : ""}{open ? "open " : ""}{">\n"}
  {children}
  {"\n</"}details{">"}
</>

export const Summary = ({ children }: { children: React.ReactNode }) => <>
  {"\n<"}summary{">"}
  {children}
  {"</"}summary{">"}

</>



export const Col = ({ children, sticky }: { children: React.ReactNode, sticky?: boolean }) => <>
  {"\n<"}Col{sticky ? ' sticky' : ""}{">\n"}
  {children}
  {"\n</"}Col{">\n"}
</>

export const Properties = ({ children }) => <>
  {"\n<"}Properties{">\n"}
  {children}
  {"\n</"}Properties{">\n"}
</>

type PropertyProps = {
  name?: string,
  type?: string,
  required?: boolean,
  minLen?: number,
  maxLen?: number,
  enumList?: string[]
  children: React.ReactNode,
}

export const Property = ({ name, type, required, minLen, maxLen, enumList, children }: PropertyProps) => {
  const childNodes = React.Children.toArray(children).map((child) =>
    typeof child === "string" ? child.trim() : ""
  );
  let header = "<Property "
  if (name) header += `name="${name}"`
  if (type) header += ` type="${type}"`
  if (required) header += ` required={${required}}`
  if (minLen) header += ` minLen={${minLen}}`
  if (maxLen) header += ` maxLen={${maxLen}}`
  if (enumList && enumList.length === 0) header += `enumList={[${enumList.join(",")}]}`

  header += " >\n"
  const footer = `\n</Property>\n`;

  // join each child code fence with newlines
  const content = childNodes.length === 0 ? childNodes.join("\n\n") : children

  return (
    <>
      {header}
      {content}
      {footer}
    </>
  );
}

type CodeGroupProps = {
  title: string;
  endPoint: Endpoint
};

export const CodeGroup = ({ title, endPoint }: CodeGroupProps) => {
  const tag = endPoint.method.toUpperCase()
  const label = endPoint.path
  const obj = endPoint.responses["200"] ?? endPoint.responses["201"]
  const exampleJson = obj?.example ? JSON.stringify(obj.example, null, 2) : ""
  const schemaJson = obj?.schema ? JSON.stringify(obj.schema, null, 2) : ""

  let langCode = []
  if (title === "Request") langCode = requestCode(tag, label, exampleJson)
  if (title === "Response") langCode = responseCode(schemaJson, schemaJson)
  let header = "<CodeGroup "
  if (title) header += `title="${title}"`
  if (tag) header += ` tag="${tag}"`
  if (label) header += ` label="${label}"`

  header += " >\n"
  const footer = `\n</CodeGroup>\n`;

  // join each child code fence with newlines
  const content = langCode.join("\n\n");

  return (
    <>
      {header}
      {content}
      {footer}
    </>
  );
}

