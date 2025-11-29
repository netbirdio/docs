import React from "react";
import { requestCode } from "../api/requests";
import { responseCode } from "../api/responses";
import { Endpoint } from "../openapi-extractor";

export const Stringify = ({ str }: { str: string }) => <>{str}</>

export const Row = ({ children }) => <>
  {"\n<Row>\n"}
  {children}
  {"\n</Row>\n"}
</>

export const Details = ({ children, className, open }: { children: React.ReactNode, className: string, open?: boolean }) => {
  let header = ` <details`
  if (className) header += ` class="${className}"`
  if (open != undefined) header += ` open`
  header += `>\n`
  const footer = "\n</details>\n"

  return <>
    {header}
    {children}
    {footer}
  </>
}

export const Summary = ({ children }: { children: React.ReactNode }) => <>
  {"\n<summary>"}
  {children}
  {"</summary>"}
</>

export const Col = ({ children, sticky }: { children: React.ReactNode, sticky?: boolean }) => {
  let header = " <Col"
  if (sticky != undefined) header += ` sticky`
  header += `>\n`
  const footer = "\n</Col>\n"
  return <>
    {header}
    {children}
    {footer}
  </>
}

export const Properties = ({ children }) => <>
  {"\n<Properties>\n"}
  {children}
  {"\n</Properties>\n"}
</>

export const Badge = ({ customFlag }: { customFlag: string }) => {
  let component = "  <Badge "
  if (customFlag === "x-cloud-only") {
    component += ` status="cloud-only"`
    component += ` text="cloud-only"`
    component += ` hoverText="This feature is only available in the cloud version of NetBird."`
  }

  if (customFlag === "x-experimental") {
    component += ` status="experimental"`
    component += ` text="experimental"`
    component += ` hoverText="This feature is experimental. The endpoint will likely change and we do not guarantee backwards compatibility."`
  }

  component += " />"

  return <>
    {component}
  </>
}
type PropertyProps = {
  name?: string,
  type?: string,
  required?: boolean,
  min?: number,
  max?: number,
  minLen?: number,
  maxLen?: number
  enumList?: string[]
  children: React.ReactNode,
}

export const Property = ({ name, type, required, min, max, minLen, maxLen, enumList, children }: PropertyProps) => {
  const childNodes = React.Children.toArray(children).map((child) =>
    typeof child === "string" ? child.trim() : ""
  );
  let header = "<Property "
  if (name) header += `name="${name}"`
  if (type) header += ` type="${type}"`
  if (required) header += ` required={${required}}`
  if (min != undefined) header += ` min={${min}}`
  if (max != undefined) header += ` max={${max}}`
  if (minLen != undefined) header += ` minLen={${minLen}}`
  if (maxLen != undefined) header += ` maxLen={${maxLen}}`
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
  if (title === "Request") langCode = requestCode(endPoint)
  if (title === "Response") langCode = responseCode(schemaJson, exampleJson)
  let header = "<CodeGroup "
  if (title) header += `title="${title}"`
  if (tag && title === "Request") header += ` tag="${tag}"`
  if (label && title === "Request") header += ` label="${label}"`

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

