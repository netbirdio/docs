import React from "react";

/** heading map */
const headingMap: Record<string, string> = {
  h1: "#",
  h2: "##",
  h3: "###",
  h4: "####",
  h5: "#####",
  h6: "######",
};

type ElementShape = {
  type: string | Function | symbol;
  props?: {
    children?: React.ReactNode;
    [key: string]: any;
  };
  $$typeof?: symbol;
};

/** Detect a React element object (the $$typeof check) */
function isReactElementObject(obj: unknown): obj is React.ReactElement {
  return (
    typeof obj === "object" &&
    obj !== null &&
    // Symbol.for('react.element') is the canonical marker
    (obj as any).$$typeof === Symbol.for("react.element")
  );
}

/** Main renderer: accepts any React node (element, string, number, array, fragment) */
export function renderToMDX(node: React.ReactNode): string {
  function renderNode(n: React.ReactNode): string {
    if (n === null || n === undefined) return "";

    // primitives
    if (typeof n === "string" || typeof n === "number") {
      return String(n);
    }

    // arrays
    if (Array.isArray(n)) {
      return n.map(renderNode).join("");
    }

    // React element object
    if (isReactElementObject(n)) {
      const el = n as ElementShape;

      // Fragment handling: render children directly
      if (el.type === React.Fragment) {
        return renderNode((el.props && el.props.children) ?? "");
      }

      // Functional component: call it and continue rendering result
      if (typeof el.type === "function") {
        // call component with props (some components expect no args, but usually props)
        // TypeScript: we don't know the exact return type, but renderNode handles it
        const res = (el.type as Function)(el.props ?? {});
        return renderNode(res);
      }

      // Native HTML tag: render children and map headings
      if (typeof el.type === "string") {
        const children = renderNode((el.props && el.props.children) ?? "");
        if (el.type in headingMap) {
          // ensure blank lines around headings
          return `\n\n${headingMap[el.type]} ${children}\n\n`;
        }
        // block elements add spacing (a conservative approach)
        // you can refine which tags are blocks vs inline if needed
        const blockTags = new Set([
          "p",
          "div",
          "section",
          "article",
          "header",
          "footer",
          "main",
          "nav",
          "ul",
          "ol",
          "li",
        ]);
        if (blockTags.has(el.type)) {
          return `\n${children}\n`;
        }

        // inline/small tags: just return children
        return children;
      }

      // If el.type is symbol or unknown, fallback to children
      return renderNode((el.props && el.props.children) ?? "");
    }

    // Unknown object (possible Polymorphic returns) -> attempt to stringify
    return "";
  }

  return renderNode(node);
}

