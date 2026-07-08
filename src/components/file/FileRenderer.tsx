import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { CodeBlock } from "../ui/CodeBlock"
import { ImageLightbox } from "../ui/ImageLightbox"

const EXT_LANG: Record<string, string> = {
  py: "python",
  ts: "ts",
  tsx: "tsx",
  js: "js",
  jsx: "jsx",
  json: "json",
  yaml: "yaml",
  yml: "yml",
  tf: "tf",
  sh: "bash",
  bash: "bash",
  java: "java",
}

function MarkdownCode(props: Record<string, unknown>) {
  const className = (props.className as string) ?? ""
  const children = props.children
  const match = /language-(\w+)/.exec(className)
  if (match) {
    return (
      <CodeBlock
        language={match[1]}
        value={String(children).replace(/\n$/, "")}
      />
    )
  }
  return (
    <code className="bg-muted border border-border text-text-code px-1 py-0.5 rounded-sm font-medium">
      {children as React.ReactNode}
    </code>
  )
}

function MarkdownPre(props: Record<string, unknown>) {
  return <>{props.children as React.ReactNode}</>
}

function MarkdownA(props: Record<string, unknown>) {
  return (
    <a
      href={props.href as string}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary font-medium underline decoration-primary/50 decoration-2 underline-offset-2 hover:text-primary/80 hover:decoration-primary transition-colors"
    >
      {props.children as React.ReactNode}
    </a>
  )
}

function MarkdownImg(props: Record<string, unknown>) {
  const src = (props.src as string) ?? ""
  const alt = (props.alt as string) ?? ""

  return <ImageLightbox src={src} alt={alt} />
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MD_COMPONENTS = {
  code: MarkdownCode,
  pre:  MarkdownPre,
  a:    MarkdownA,
  img:  MarkdownImg,
} as any

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
        components={MD_COMPONENTS}
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