// Latest posts from blogs.snowballsh.com, fetched once at build time. The blog
// API only allows its own origin, so the browser cannot fetch these itself; a
// new post appears here on the portfolio's next build and deploy.

const BLOG_URL = "https://blogs.snowballsh.com";
const API_URL = "https://api.blogs.snowballsh.com/api/v1/posts";

export interface Post {
  title: string;
  description: string;
  url: string;
  publishedAt: Date;
  tags: string[];
}

interface ApiPost {
  slug: string;
  title: string;
  description?: string;
  published_at: string;
  tags?: string[];
}

let cached: Promise<Post[]> | undefined;

async function fetchPosts(): Promise<Post[]> {
  try {
    const response = await fetch(API_URL, {
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const { posts } = (await response.json()) as { posts: ApiPost[] };
    return posts
      .map((post) => ({
        title: post.title,
        description: post.description ?? "",
        url: `${BLOG_URL}/posts/${encodeURIComponent(post.slug)}`,
        publishedAt: new Date(post.published_at),
        tags: post.tags ?? [],
      }))
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  } catch (error) {
    // The site should still build when the blog is down; the section hides.
    console.warn(`[posts] could not fetch ${API_URL}: ${error}`);
    return [];
  }
}

export async function getLatestPosts(limit = 3): Promise<Post[]> {
  cached ??= fetchPosts();
  return (await cached).slice(0, limit);
}

export { BLOG_URL };
