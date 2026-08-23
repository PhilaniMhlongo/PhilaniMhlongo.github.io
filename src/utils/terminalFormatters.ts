import type { BlogPost } from '@/types/blog';
import { formatDateShort } from './blogUtils';

const RULE = '─'.repeat(52);

/**
 * Section header in the page's markdown-source voice: `## snake_case`.
 * TerminalPanel colours any line starting with `##`.
 */
function sectionHeader(title: string): string[] {
  return ['', `## ${title.trim().toLowerCase().replace(/\s+/g, '_')}`, ''];
}

/**
 * Format a single blog post for terminal display
 */
export function formatBlogPostListing(post: BlogPost, index: number): string[] {
  const output: string[] = [];

  if (index > 0) output.push('');

  // Featured posts carry a single trailing marker rather than an emoji
  output.push(`${post.title}${post.featured ? '  ·  featured' : ''}`);
  output.push(`  ${post.subtitle}`);

  const meta = [
    formatDateShort(post.publishedDate),
    post.readingTime,
    post.tags.slice(0, 3).join(', ') +
      (post.tags.length > 3 ? ` +${post.tags.length - 3}` : ''),
  ].join('  ·  ');
  output.push(`  ${meta}`);
  output.push(`  cat blog/${post.fileName}`);

  return output;
}

/**
 * Format multiple blog posts for terminal display
 */
export function formatBlogListings(posts: BlogPost[], title?: string): string[] {
  const output: string[] = [];

  if (title) output.push(...sectionHeader(title));

  if (posts.length === 0) {
    output.push('// no posts found');
    return output;
  }

  posts.forEach((post, index) => {
    output.push(...formatBlogPostListing(post, index));
  });

  output.push('');
  output.push(RULE);
  output.push(`// ${posts.length} post${posts.length !== 1 ? 's' : ''}`);
  output.push('');
  output.push('blog --tag <tag>     filter by tag');
  output.push('blog --recent <n>    n most recent');
  output.push('search <query>       search posts');

  return output;
}

/**
 * Format search results for terminal display
 */
export function formatSearchResults(posts: BlogPost[], query: string): string[] {
  const output: string[] = [];

  output.push(...sectionHeader(`results for "${query}"`));

  if (posts.length === 0) {
    output.push('// no matches');
    output.push('');
    output.push('// try broader keywords, or `blog --tags` for every tag');
    return output;
  }

  posts.forEach((post, index) => {
    output.push(...formatBlogPostListing(post, index));
  });

  output.push('');
  output.push(RULE);
  output.push(`// ${posts.length} result${posts.length !== 1 ? 's' : ''}`);

  return output;
}

/**
 * Format featured posts for welcome/showcase
 */
export function formatFeaturedPosts(posts: BlogPost[]): string[] {
  if (posts.length === 0) return [];

  const output: string[] = ['', '## featured'];

  posts.slice(0, 3).forEach((post) => {
    output.push(
      `  ${post.title}  ·  ${formatDateShort(post.publishedDate)}  ·  ${post.readingTime}`
    );
  });

  output.push('');
  output.push('// `blog` lists everything · `cat blog/<file>` to read');

  return output;
}

/**
 * Format available tags for terminal display
 */
export function formatTagsList(tags: string[]): string[] {
  const output: string[] = [];

  output.push(...sectionHeader('tags'));

  const columns = 3;
  const perColumn = Math.ceil(tags.length / columns);

  for (let i = 0; i < perColumn; i++) {
    const row: string[] = [];
    for (let col = 0; col < columns; col++) {
      const index = i + col * perColumn;
      if (index < tags.length) row.push(tags[index].padEnd(18));
    }
    output.push(row.join('').trimEnd());
  }

  output.push('');
  output.push('// filter with `blog --tag <tag>`');

  return output;
}

/**
 * Parse command line flags from arguments
 */
export function parseCommandFlags(args: string[]): {
  flags: Record<string, string | boolean>;
  positional: string[];
} {
  const flags: Record<string, string | boolean> = {};
  const positional: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg.startsWith('--')) {
      const flagName = arg.substring(2);

      // Check if next arg is a value (not another flag)
      if (i + 1 < args.length && !args[i + 1].startsWith('--')) {
        flags[flagName] = args[i + 1];
        i++; // Skip next arg since we used it as value
      } else {
        flags[flagName] = true;
      }
    } else if (arg.startsWith('-')) {
      const flagName = arg.substring(1);
      flags[flagName] = true;
    } else {
      positional.push(arg);
    }
  }

  return { flags, positional };
}
