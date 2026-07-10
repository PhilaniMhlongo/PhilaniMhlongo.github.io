import { Clock, Calendar, Tag } from "lucide-react"
import type { BlogPost } from "@/types/blog"
import { formatDate } from "@/utils/blogUtils"

interface BlogPostMetadataProps {
  post: BlogPost
}

export const BlogPostMetadata = ({ post }: BlogPostMetadataProps) => {
  return (
    <div className="mb-8 pb-6 border-b border-border">
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        {/* Published Date */}
        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(post.publishedDate)}</span>
        </div>

        {/* Reading Time */}
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          <span>{post.readingTime}</span>
        </div>

        {/* Author */}
        {post.author && (
          <div className="flex items-center gap-1.5">
            <span>by {post.author}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <Tag className="w-4 h-4 text-muted-foreground" />
          {post.tags.map((tag: string) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-md border border-primary/20"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Subtitle */}
      {post.subtitle && (
        <p className="mt-4 text-muted-foreground italic">{post.subtitle}</p>
      )}

      {/* Series Info */}
      {post.series && (
        <div className="mt-3 text-sm text-primary">
          📚 Part {post.seriesOrder} of "{post.series}" series
        </div>
      )}
    </div>
  )
}
