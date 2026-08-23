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
    <div className="group relative my-7 overflow-hidden rounded border border-border">
      <div className="flex items-center justify-between border-b border-border bg-surface-elevated px-3.5 py-1.5">
        <span className="font-mono text-2xs uppercase tracking-label text-text-tertiary">
          {LANGUAGE_LABELS[language] || language}
        </span>
        <button
          onClick={handleCopy}
          className="press flex items-center gap-1.5 rounded-sm px-1.5 py-0.5 font-mono text-2xs text-text-tertiary opacity-0 hover:text-text-primary focus-visible:opacity-100 group-hover:opacity-100"
          aria-label={copied ? "Copied" : "Copy code"}
        >
          {copied ? (
            <>
              <Check className="confirm-pop size-3 text-accent" strokeWidth={2} />
              <span className="text-accent">copied</span>
            </>
          ) : (
            <>
              <Copy className="size-3" strokeWidth={1.75} />
              copy
            </>
          )}
        </button>
      </div>

      <SyntaxHighlighter
        language={language}
        style={atomDark}
        PreTag="div"
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: "0.8125rem",
          lineHeight: "1.7",
          padding: "1.125rem",
          background: "hsl(var(--surface))",
        }}
        codeTagProps={{ style: { fontFamily: "inherit" } }}
        showLineNumbers={value.split("\n").length > 10}
        lineNumberStyle={{
          minWidth: "2.5em",
          paddingRight: "1.25em",
          color: "hsl(var(--text-tertiary))",
          userSelect: "none",
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  )
}
