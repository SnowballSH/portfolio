import { z } from "astro/zod";

export const BLOG_URL = "https://blogs.snowballsh.com";
export const POSTS_API_URL = "https://api.blogs.snowballsh.com/api/v1/posts";

export interface Post {
  title: string;
  description: string;
  url: string;
  publishedAt: Date;
  tags: string[];
}

const postsResponseSchema = z.object({
  posts: z.array(
    z.object({
      slug: z.string().min(1),
      title: z.string(),
      description: z.string().default(""),
      published_at: z.coerce.date(),
      tags: z.array(z.string()).default([]),
    }),
  ),
});

export function parsePosts(body: unknown): Post[] {
  return postsResponseSchema
    .parse(body)
    .posts.map((post) => ({
      title: post.title,
      description: post.description,
      url: `${BLOG_URL}/posts/${encodeURIComponent(post.slug)}`,
      publishedAt: post.published_at,
      tags: post.tags,
    }))
    .toSorted((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
}

export async function fetchPosts(
  fetcher: typeof fetch = fetch,
): Promise<Post[]> {
  try {
    const response = await fetcher(POSTS_API_URL, {
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return parsePosts(await response.json());
  } catch (error) {
    console.warn(`[blog] could not load ${POSTS_API_URL}: ${error}`);
    return [];
  }
}

let latest: Promise<Post[]> | undefined;

export async function getLatestPosts(limit: number): Promise<Post[]> {
  latest ??= fetchPosts();
  return (await latest).slice(0, limit);
}
