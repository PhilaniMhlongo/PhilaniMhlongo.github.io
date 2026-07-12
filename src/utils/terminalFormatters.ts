import type { BlogPost } from '@/types/blog';
import { formatDateShort } from './blogUtils';

/**
 * Format a single blog post for terminal display
 */
export function formatBlogPostListing(post: BlogPost, index: number): string[] {
  const output: string[] = [];

  // Separator for readability (except for first post)
  if (index > 0) {
    output.push('─────────────────────────────────────────');
  }

  // Title with star if featured
  const featuredMark = post.featured ? ' ⭐' : '';
  output.push(`${featuredMark} ${post.title}`.trim());

  // Subtitle
  output.push(`  ${post.subtitle}`);

  // Metadata line
  const date = formatDateShort(post.publishedDate);
  const tags = post.tags.slice(0, 3).join(', '); // Show max 3 tags
  const moreTags = post.tags.length > 3 ? ` +${post.tags.length - 3}` : '';
  output.push(`  📅 ${date}  |  ⏱️  ${post.readingTime}  |  🏷️  ${tags}${moreTags}`);

  // Command to read
  output.push(`  $ cat blog/${post.fileName}`);

  return output;
}

/**
 * Format multiple blog posts for terminal display
 */
export function formatBlogListings(posts: BlogPost[], title?: string): string[] {
  const output: string[] = [];

  // Header
  if (title) {
    output.push('');
    output.push(`╔${'═'.repeat(65)}╗`);
    output.push(`║  ${title.padEnd(63)}║`);
    output.push(`╚${'═'.repeat(65)}╝`);
    output.push('');
  }

  if (posts.length === 0) {
    output.push('No blog posts found.');
    return output;
  }

  // Posts
  posts.forEach((post, index) => {
    output.push(...formatBlogPostListing(post, index));
  });

  // Footer
  output.push('');
  output.push('─────────────────────────────────────────');
  output.push(`Total: ${posts.length} post${posts.length !== 1 ? 's' : ''}`);
  output.push('');

  // Commands help
  output.push('💡 Tips:');
  output.push('  blog --tag <tag>      Filter by tag');
  output.push('  blog --recent <n>     Show N recent posts');
  output.push('  blog --featured       Show featured posts only');
  output.push('  search <query>        Search blog posts');
  output.push('  subscribe <email>     Get notified about new posts');

  return output;
}

/**
 * Format search results for terminal display
 */
export function formatSearchResults(posts: BlogPost[], query: string): string[] {
  const output: string[] = [];

  output.push('');
  output.push(`🔍 Search results for: "${query}"`);
  output.push('');

  if (posts.length === 0) {
    output.push('No results found.');
    output.push('');
    output.push('💡 Try:');
    output.push('  - Different keywords');
    output.push('  - Broader search terms');
    output.push('  - Tag names (kubernetes, docker, terraform)');
    return output;
  }

  posts.forEach((post, index) => {
    output.push(...formatBlogPostListing(post, index));
  });

  output.push('');
  output.push('─────────────────────────────────────────');
  output.push(`Found ${posts.length} result${posts.length !== 1 ? 's' : ''}`);

  return output;
}

/**
 * Format featured posts for welcome/showcase
 */
export function formatFeaturedPosts(posts: BlogPost[]): string[] {
  const output: string[] = [];

  if (posts.length === 0) {
    return output;
  }

  output.push('');
  output.push('📌 Featured Posts:');

  posts.slice(0, 3).forEach((post) => {
    const date = formatDateShort(post.publishedDate);
    output.push(`   • ${post.title} (${date}) - ${post.readingTime}`);
  });

  output.push('');
  output.push('Type "blog" to see all posts or "cat blog/<filename>" to read');
  output.push('Type "subscribe <email>" to get notified about new posts');

  return output;
}

/**
 * Format available tags for terminal display
 */
export function formatTagsList(tags: string[]): string[] {
  const output: string[] = [];

  output.push('');
  output.push('🏷️  Available Tags:');
  output.push('');

  // Display in columns
  const columns = 3;
  const perColumn = Math.ceil(tags.length / columns);

  for (let i = 0; i < perColumn; i++) {
    const row: string[] = [];
    for (let col = 0; col < columns; col++) {
      const index = i + col * perColumn;
      if (index < tags.length) {
        row.push(tags[index].padEnd(20));
      }
    }
    output.push(`  ${row.join('')}`);
  }

  output.push('');
  output.push('💡 Filter by tag: blog --tag <tagname>');

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
