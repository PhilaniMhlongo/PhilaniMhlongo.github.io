import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { CodeBlock } from "../ui/CodeBlock"

const EXT_LANG: Record<string, string> = {
  py:   "python",
  ts:   "ts",
  tsx:  "tsx",
  js:   "js",
  jsx:  "jsx",
  json: "json",
  yaml: "yaml",
  yml:  "yml",
  tf:   "tf",
  sh:   "bash",
  bash: "bash",
  java: "java",
}

type CodeProps = React.HTMLAttributes<HTMLElement> & {
  inline?: boolean
  node?: unknown
  children?: React.ReactNode
}

export const FileRenderer = ({
  content,
  extension,
}: {
  content: string
  extension?: string
}) => {
  if (extension === "md") {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        className="prose prose-invert max-w-none"
        components={{
          a: (props) => (
            
              {...props}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline hover:text-blue-300"
            />
          ),
          img: ({ src, alt }) => (
            <img
              src={src ?? ""}
              alt={alt ?? ""}
              className="rounded-md border border-slate-700 shadow-lg mx-auto my-4 max-w-full object-contain"
              loading="lazy"
            />
          ),
          code: ({ inline, className, children }: CodeProps) => {
            const match = /language-(\w+)/.exec(className ?? "")
            if (!inline && match) {
              return (
                <CodeBlock
                  language={match[1]}
                  value={String(children).replace(/\n$/, "")}
                />
              )
            }
            return (
              <code className="bg-slate-800 px-1 py-0.5 rounded text-pink-400">
                {children}
              </code>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    )
  }

  const lang = extension ? EXT_LANG[extension] : undefined
  if (lang) {
    return <CodeBlock language={lang} value={content} />
  }

  return (
    <pre className="text-sm text-slate-300 whitespace-pre-wrap">
      {content}
    </pre>
  )
}
