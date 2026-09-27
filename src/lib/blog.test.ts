import { describe, expect, test } from "bun:test";
import { BLOG_URL, fetchPosts, parsePosts } from "./blog";

const apiPost = (overrides: Record<string, unknown> = {}) => ({
  slug: "imo_2026",
  title: "IMO 2026",
  description: "My attempts.",
  published_at: "2026-07-18T00:00:00Z",
  tags: ["math"],
  id: "ignored",
  ...overrides,
});

describe("parsePosts", () => {
  test("maps API posts to site posts", () => {
    expect(parsePosts({ posts: [apiPost()] })).toEqual([
      {
        title: "IMO 2026",
        description: "My attempts.",
        url: `${BLOG_URL}/posts/imo_2026`,
        publishedAt: new Date("2026-07-18T00:00:00Z"),
        tags: ["math"],
      },
    ]);
  });

  test("sorts newest first", () => {
    const posts = parsePosts({
      posts: [
        apiPost({ slug: "old", published_at: "2026-01-01T00:00:00Z" }),
        apiPost({ slug: "new", published_at: "2026-09-01T00:00:00Z" }),
      ],
    });
    expect(posts.map((post) => post.url)).toEqual([
      `${BLOG_URL}/posts/new`,
      `${BLOG_URL}/posts/old`,
    ]);
  });

  test("defaults missing description and tags", () => {
    const [post] = parsePosts({
      posts: [apiPost({ description: undefined, tags: undefined })],
    });
    expect(post?.description).toBe("");
    expect(post?.tags).toEqual([]);
  });

  test("encodes slugs into the URL", () => {
    const [post] = parsePosts({ posts: [apiPost({ slug: "a b/c" })] });
    expect(post?.url).toBe(`${BLOG_URL}/posts/a%20b%2Fc`);
  });

  test("rejects a malformed response", () => {
    expect(() => parsePosts({ posts: [{ title: "No slug" }] })).toThrow();
    expect(() => parsePosts([])).toThrow();
  });
});

describe("fetchPosts", () => {
  const respond = (body: unknown, status = 200): typeof fetch =>
    (async () => Response.json(body, { status })) as unknown as typeof fetch;

  test("returns parsed posts", async () => {
    const posts = await fetchPosts(respond({ posts: [apiPost()] }));
    expect(posts).toHaveLength(1);
  });

  test("returns no posts when the API fails", async () => {
    expect(await fetchPosts(respond({}, 503))).toEqual([]);
  });

  test("returns no posts when the network fails", async () => {
    const offline = (async () => {
      throw new TypeError("offline");
    }) as unknown as typeof fetch;
    expect(await fetchPosts(offline)).toEqual([]);
  });
});
