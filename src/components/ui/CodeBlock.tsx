import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter"
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism"

// Prism language imports
import bash from "react-syntax-highlighter/dist/cjs/languages/prism/bash"
import json from "react-syntax-highlighter/dist/cjs/languages/prism/json"
import yaml from "react-syntax-highlighter/dist/cjs/languages/prism/yaml"
import markdown from "react-syntax-highlighter/dist/cjs/languages/prism/markdown"
import typescript from "react-syntax-highlighter/dist/cjs/languages/prism/typescript"
import javascript from "react-syntax-highlighter/dist/cjs/languages/prism/javascript"
import python from "react-syntax-highlighter/dist/cjs/languages/prism/python"
import terraform from "react-syntax-highlighter/dist/cjs/languages/prism/hcl"
import java from "react-syntax-highlighter/dist/cjs/languages/prism/java"

// Register languages once
SyntaxHighlighter.registerLanguage("bash", bash)
SyntaxHighlighter.registerLanguage("json", json)
SyntaxHighlighter.registerLanguage("yaml", yaml)
SyntaxHighlighter.registerLanguage("yml", yaml)
SyntaxHighlighter.registerLanguage("markdown", markdown)
SyntaxHighlighter.registerLanguage("md", markdown)
SyntaxHighlighter.registerLanguage("ts", typescript)
SyntaxHighlighter.registerLanguage("tsx", typescript)
SyntaxHighlighter.registerLanguage("js", javascript)
SyntaxHighlighter.registerLanguage("jsx", javascript)
SyntaxHighlighter.registerLanguage("python", python)
SyntaxHighlighter.registerLanguage("tf", terraform)
SyntaxHighlighter.registerLanguage("java", java)

interface CodeBlockProps {
  language: string
  value: string
}

export const CodeBlock = ({ language, value }: CodeBlockProps) => {
  return (
    <SyntaxHighlighter
      language={language}
      style={atomDark}
      PreTag="div"
      customStyle={{ borderRadius: "0.5rem", fontSize: "0.85rem" }}
    >
      {value}
    </SyntaxHighlighter>
  )
}
