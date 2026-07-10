import type { BlogPost, BlogMetadata } from '@/types/blog';

/**
 * Fetch blog metadata from JSON file
 */
export async function fetchBlogMetadata(): Promise<BlogMetadata> {
  const response = await fetch('/content/blog/metadata.json');
  if (!response.ok) {
    throw new Error('Failed to fetch blog metadata');
  }
  return response.json();
}

/**
 * Calculate reading time based on word count
 * Average reading speed: 200 words per minute
 */
export function calculateReadingTime(markdown: string): string {
  const wordsPerMinute = 200;
  const words = markdown.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);

  if (minutes === 1) {
    return '1 min read';
  }
  return `${minutes} min read`;
}

/**
 * Sort posts by date (newest first)
 */
export function sortPostsByDate(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) =>
    new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  );
}

/**
 * Filter posts by tag
 */
export function filterPostsByTag(posts: BlogPost[], tag: string): BlogPost[] {
  const lowerTag = tag.toLowerCase();
  return posts.filter(post =>
    post.tags.some((t: string) => t.toLowerCase() === lowerTag)
  );
}

/**
 * Filter posts by multiple tags (OR logic)
 */
export function filterPostsByTags(posts: BlogPost[], tags: string[]): BlogPost[] {
  const lowerTags = tags.map((t: string) => t.toLowerCase());
  return posts.filter(post =>
    post.tags.some((t: string) => lowerTags.includes(t.toLowerCase()))
  );
}

/**
 * Get featured posts only
 */
export function getFeaturedPosts(posts: BlogPost[]): BlogPost[] {
  return posts.filter(post => post.featured);
}

/**
 * Get N most recent posts
 */
export function getRecentPosts(posts: BlogPost[], count: number): BlogPost[] {
  return sortPostsByDate(posts).slice(0, count);
}

/**
 * Search posts by title, description, or tags
 */
export function searchPosts(posts: BlogPost[], query: string): BlogPost[] {
  const lowerQuery = query.toLowerCase();
  return posts.filter(post =>
    post.title.toLowerCase().includes(lowerQuery) ||
    post.description.toLowerCase().includes(lowerQuery) ||
    post.subtitle.toLowerCase().includes(lowerQuery) ||
    post.tags.some((tag: string) => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Format date string for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Format date for terminal display (shorter format)
 */
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

/**
 * Get posts in a series, sorted by seriesOrder
 */
export function getPostsInSeries(posts: BlogPost[], seriesName: string): BlogPost[] {
  return posts
    .filter(post => post.series === seriesName)
    .sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0));
}

/**
 * Get next post in series
 */
export function getNextPostInSeries(posts: BlogPost[], currentPost: BlogPost): BlogPost | null {
  if (!currentPost.series) return null;

  const seriesPosts = getPostsInSeries(posts, currentPost.series);
  const currentIndex = seriesPosts.findIndex(p => p.id === currentPost.id);

  if (currentIndex === -1 || currentIndex === seriesPosts.length - 1) {
    return null;
  }

  return seriesPosts[currentIndex + 1];
}

/**
 * Get previous post in series
 */
export function getPreviousPostInSeries(posts: BlogPost[], currentPost: BlogPost): BlogPost | null {
  if (!currentPost.series) return null;

  const seriesPosts = getPostsInSeries(posts, currentPost.series);
  const currentIndex = seriesPosts.findIndex(p => p.id === currentPost.id);

  if (currentIndex <= 0) {
    return null;
  }

  return seriesPosts[currentIndex - 1];
}

/**
 * Get all unique tags from posts
 */
export function getAllTags(posts: BlogPost[]): string[] {
  const tagSet = new Set<string>();
  posts.forEach(post => {
    post.tags.forEach((tag: string) => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}

/**
 * Get post by ID
 */
export function getPostById(posts: BlogPost[], id: string): BlogPost | undefined {
  return posts.find(post => post.id === id);
}

/**
 * Get post by filename (without extension)
 */
export function getPostByFileName(posts: BlogPost[], fileName: string): BlogPost | undefined {
  return posts.find(post => post.fileName === fileName);
}
