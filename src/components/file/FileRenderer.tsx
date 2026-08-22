import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import remarkEmoji from "remark-emoji"
import rehypeKatex from "rehype-katex"
import rehypeSlug from "rehype-slug"
import { CodeBlock } from "../ui/CodeBlock"
import { ImageLightbox } from "../ui/ImageLightbox"
import { BlogPostMetadata } from "../blog/BlogPostMetadata"
import { fetchBlogMetadata, getPostByFileName, sortPostsByDate } from "@/utils/blogUtils"
import type { BlogPost } from "@/types/blog"
import "katex/dist/katex.min.css"

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

function MarkdownH1(props: Record<string, unknown>) {
  return <h1 className="wipe-in">{props.children as React.ReactNode}</h1>
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

function MarkdownBlockquote(props: Record<string, unknown>) {
  const children = props.children as React.ReactNode
  const childString = String(children)

  // Custom container syntax: > [!NOTE], > [!WARNING], > [!TIP], > [!IMPORTANT]
  const match = childString.match(/^\s*\[!(NOTE|WARNING|TIP|IMPORTANT|INFO)\]\s*/i)

  if (match) {
    const type = match[1].toLowerCase()
    // Callouts are distinguished by their label, not by a colour each. Only
    // warnings — a genuine state — take a tinted rule.
    const accentClass =
      type === "warning" ? "border-warning" : "border-border-strong"

    return (
      <div className={`my-6 border-l-2 pl-5 ${accentClass}`}>
        <div className="mb-1.5 font-mono text-2xs uppercase tracking-label text-text-tertiary">
          {type}
        </div>
        <div className="prose-p:my-2">{children}</div>
      </div>
    )
  }

  return (
    <blockquote>{children}</blockquote>
  )
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const MD_COMPONENTS = {
  h1:   MarkdownH1,
  code: MarkdownCode,
  pre:  MarkdownPre,
  a:    MarkdownA,
  img:  MarkdownImg,
  blockquote: MarkdownBlockquote,
} as any
/* eslint-enable @typescript-eslint/no-explicit-any */

export const FileRenderer = ({
  content,
  extension,
  fileName,
}: {
  content: string
  extension?: string
  fileName?: string
}) => {
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null)
  const [siblings, setSiblings] = useState<{ older?: BlogPost; newer?: BlogPost }>({})
  const navigate = useNavigate()

  useEffect(() => {
    // Fetch blog metadata if this is a blog post
    if (extension === "md" && fileName) {
      const fileNameWithoutExt = fileName.replace(/\.md$/, "")
      fetchBlogMetadata()
        .then((metadata: { posts: BlogPost[] }) => {
          const post = getPostByFileName(metadata.posts, fileNameWithoutExt)
          if (post) {
            setBlogPost(post)
            // Newest first, so the next entry is older than this one.
            const ordered = sortPostsByDate(metadata.posts)
            const at = ordered.findIndex(p => p.id === post.id)
            setSiblings({ newer: ordered[at - 1], older: ordered[at + 1] })
          } else {
            setBlogPost(null)
            setSiblings({})
          }
        })
        .catch((error: Error) => {
          console.error("Failed to fetch blog metadata:", error)
        })
    }
  }, [extension, fileName])

  const goToPost = (post: BlogPost) =>
    navigate(`/blog/${post.fileName.replace(/\.md$/, "")}`)

  if (extension === "md") {
    return (
      <div>
        {/* Show blog metadata if available */}
        {blogPost && (
          <div className="rise-in" style={{ "--i": 1 } as React.CSSProperties}>
            <BlogPostMetadata post={blogPost} />
          </div>
        )}

        <ReactMarkdown
          remarkPlugins={[
            remarkGfm, // Includes footnotes support
            remarkMath,
            remarkEmoji,
          ]}
          rehypePlugins={[rehypeKatex, rehypeSlug]}
          className="prose prose-invert max-w-none"
          components={MD_COMPONENTS}
        >
          {content}
        </ReactMarkdown>

        {/* A post used to end in nothing. Give the reader somewhere to go. */}
        {blogPost && (
          <nav
            className="mt-16 border-t border-border pt-6"
            aria-label="More posts"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              {siblings.older ? (
                <button
                  onClick={() => goToPost(siblings.older!)}
                  className="group text-left"
                >
                  <span className="block text-2xs text-text-tertiary">
                    ← older
                  </span>
                  <span className="link-underline text-sm text-text-primary">
                    {siblings.older.title}
                  </span>
                </button>
              ) : (
                <span />
              )}

              {siblings.newer && (
                <button
                  onClick={() => goToPost(siblings.newer!)}
                  className="group text-left sm:text-right"
                >
                  <span className="block text-2xs text-text-tertiary">
                    newer →
                  </span>
                  <span className="link-underline text-sm text-text-primary">
                    {siblings.newer.title}
                  </span>
                </button>
              )}
            </div>

            <p className="mt-6 text-2xs text-text-tertiary">
              // press <span className="text-accent">/</span> for the terminal,
              then <span className="text-accent">blog</span> to list everything
            </p>
          </nav>
        )}
      </div>
    )
  }

  const lang = extension ? EXT_LANG[extension] : undefined
  if (lang) {
    return <CodeBlock language={lang} value={content} />
  }

  return (
    <pre className="whitespace-pre-wrap font-mono text-[0.8125rem] leading-relaxed text-text-secondary">
      {content}
    </pre>
  )
}