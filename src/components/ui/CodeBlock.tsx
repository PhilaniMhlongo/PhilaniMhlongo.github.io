import { useState } from "react"
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter"
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism"
import { Copy, Check } from "lucide-react"

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

const LANGUAGE_LABELS: Record<string, string> = {
  bash: "Bash",
  json: "JSON",
  yaml: "YAML",
  yml: "YAML",
  markdown: "Markdown",
  md: "Markdown",
  ts: "TypeScript",
  tsx: "TypeScript (JSX)",
  js: "JavaScript",
  jsx: "JavaScript (JSX)",
  python: "Python",
  py: "Python",
  tf: "Terraform",
  java: "Java",
}

export const CodeBlock = ({ language, value }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy code:", err)
    }
  }

  return (
    <div className="relative group my-6">
      {/* Header with language label and copy button */}
      <div className="flex items-center justify-between px-4 py-2 bg-[hsl(210,18%,12%)] border border-border rounded-t-lg border-b-0">
        <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
          {LANGUAGE_LABELS[language] || language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 text-xs rounded-md bg-surface-elevated hover:bg-surface-hover text-text-secondary hover:text-text-primary transition-all opacity-0 group-hover:opacity-100"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-success" />
              <span className="text-success">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code block */}
      <div className="border border-border rounded-b-lg overflow-hidden shadow-lg">
        <SyntaxHighlighter
          language={language}
          style={atomDark}
          PreTag="div"
          customStyle={{
            margin: 0,
            borderRadius: 0,
            fontSize: "0.875rem",
            lineHeight: "1.7",
            padding: "1.25rem",
            background: "hsl(210, 18%, 12%)",
          }}
          showLineNumbers={value.split("\n").length > 10}
          lineNumberStyle={{
            minWidth: "3em",
            paddingRight: "1em",
            color: "hsl(212, 9%, 45%)",
            userSelect: "none",
          }}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}
