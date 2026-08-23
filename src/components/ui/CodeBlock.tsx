import { useState } from "react"
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter"
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
  bash: "bash",
  json: "json",
  yaml: "yaml",
  yml: "yaml",
  markdown: "markdown",
  md: "markdown",
  ts: "typescript",
  tsx: "tsx",
  js: "javascript",
  jsx: "jsx",
  python: "python",
  py: "python",
  tf: "terraform",
  java: "java",
}

/**
 * Syntax theme built from the site's own tokens rather than an off-the-shelf
 * one. The two accents keep the jobs they have everywhere else — green for
 * values, amber for keywords and numbers — so code reads as part of the page
 * instead of a pasted-in screenshot.
 */
const THEME: Record<string, React.CSSProperties> = {
  'code[class*="language-"]': {
    color: "hsl(var(--text-secondary))",
    background: "none",
    fontFamily: "inherit",
  },
  comment: { color: "hsl(var(--text-tertiary))", fontStyle: "italic" },
  prolog: { color: "hsl(var(--text-tertiary))" },
  doctype: { color: "hsl(var(--text-tertiary))" },
  cdata: { color: "hsl(var(--text-tertiary))" },
  punctuation: { color: "hsl(var(--text-tertiary))" },
  property: { color: "hsl(var(--text-primary))" },
  tag: { color: "hsl(var(--text-primary))" },
  "attr-name": { color: "hsl(var(--text-primary))" },
  boolean: { color: "hsl(var(--warm))" },
  number: { color: "hsl(var(--warm))" },
  constant: { color: "hsl(var(--warm))" },
  symbol: { color: "hsl(var(--warm))" },
  selector: { color: "hsl(var(--accent))" },
  string: { color: "hsl(var(--accent))" },
  char: { color: "hsl(var(--accent))" },
  "attr-value": { color: "hsl(var(--accent))" },
  builtin: { color: "hsl(var(--accent))" },
  inserted: { color: "hsl(var(--accent))" },
  deleted: { color: "hsl(var(--danger))" },
  operator: { color: "hsl(var(--text-secondary))" },
  entity: { color: "hsl(var(--text-secondary))" },
  url: { color: "hsl(var(--warm))" },
  variable: { color: "hsl(var(--text-secondary))" },
  atrule: { color: "hsl(var(--warm))" },
  keyword: { color: "hsl(var(--warm))" },
  "class-name": { color: "hsl(var(--text-primary))", fontWeight: 700 },
  function: { color: "hsl(var(--text-primary))", fontWeight: 700 },
  regex: { color: "hsl(var(--accent))" },
  important: { color: "hsl(var(--danger))", fontWeight: 700 },
  bold: { fontWeight: 700 },
  italic: { fontStyle: "italic" },
}

export const CodeBlock = ({ language, value }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false)
  const lineCount = value.split("\n").length

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
    <div className="code-block group relative my-7 overflow-hidden rounded border border-border">
      <div className="flex items-center gap-3 border-b border-border bg-surface-elevated px-3.5 py-1.5">
        <span className="text-2xs text-text-tertiary">
          {LANGUAGE_LABELS[language] || language}
        </span>

        <span className="ml-auto flex items-center gap-3">
          <span className="text-2xs tabular-nums text-text-tertiary opacity-0 transition-opacity duration-150 group-hover:opacity-100">
            {lineCount} {lineCount === 1 ? "line" : "lines"}
          </span>
          <button
            onClick={handleCopy}
            className="press flex items-center gap-1.5 rounded-sm px-1.5 py-0.5 text-2xs text-text-tertiary opacity-0 hover:text-text-primary focus-visible:opacity-100 group-hover:opacity-100"
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
        </span>
      </div>

      <SyntaxHighlighter
        language={language}
        style={THEME}
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
        // Numbers on anything multi-line: a gutter that comes and goes with
        // length makes two adjacent blocks look like different components.
        showLineNumbers={lineCount > 1}
        lineNumberStyle={{
          minWidth: "2.25em",
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
