"use client";

import {
  type CodeBlockProps,
  CodeBlock as CodeBlockServer,
} from "./code-block";

function CodeBlock(props: CodeBlockProps) {
  return <CodeBlockServer {...props} />;
}

export { CodeBlock, type CodeBlockProps };
