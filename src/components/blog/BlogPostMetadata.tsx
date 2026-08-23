import type { BlogPost } from "@/types/blog"
import { formatDate } from "@/utils/blogUtils"

interface BlogPostMetadataProps {
  post: BlogPost
}

export const BlogPostMetadata = ({ post }: BlogPostMetadataProps) => {
  return (
    <div className="mb-10">
      {/* A single mono line of provenance, set well below the title weight */}
      <p className="font-mono text-2xs text-text-tertiary">
        <time dateTime={post.publishedDate}>{formatDate(post.publishedDate)}</time>
        <span className="mx-2 text-border-strong">/</span>
        {post.readingTime}
        {post.author && (
          <>
            <span className="mx-2 text-border-strong">/</span>
            {post.author}
          </>
        )}
      </p>

      {post.subtitle && (
        <p className="mt-4 text-[1.0625rem] leading-relaxed text-text-secondary">
          {post.subtitle}
        </p>
      )}

      {post.tags && post.tags.length > 0 && (
        <p className="mt-4 font-mono text-2xs text-text-tertiary">
          {post.tags.join("  ·  ")}
        </p>
      )}

      {post.series && (
        <p className="mt-3 font-mono text-2xs text-text-tertiary">
          Part {post.seriesOrder} of {post.series}
        </p>
      )}

      <hr className="mt-8 border-t border-border" />
    </div>
  )
}
