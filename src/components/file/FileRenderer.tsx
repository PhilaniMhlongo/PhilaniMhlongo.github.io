import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { CodeBlock } from "../ui/CodeBlock"

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
            <a
              {...props}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline hover:text-blue-300"
            />
          ),
          img: ({ src, alt }) => (
            <img
              src={src || ""}
              alt={alt || ""}
              className="rounded-md border border-slate-700 shadow-lg mx-auto my-4 max-w-full object-contain"
              loading="lazy"
            />
          ),
          code({
            node,
            inline,
            className,
            children,
            ...props
          }: React.HTMLAttributes<HTMLElement> & { inline?: boolean; node?: any }) {
            const match = /language-(\w+)/.exec(className || "")
            return !inline && match ? (
              <CodeBlock
                language={match[1]}
                value={String(children).replace(/\n$/, "")}
              />
            ) : (
              <code className="bg-slate-800 px-1 py-0.5 rounded text-pink-400" {...props}>
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

  return (
    <pre className="text-sm text-slate-300 whitespace-pre-wrap">
      {content}
    </pre>
  )
}
