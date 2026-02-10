import { defineCollection, z } from "astro:content";

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    shortDescription: z.string(),
    date: z.string().transform((str) => new Date(str)),
    technologies: z.array(z.string()),
    featured: z.boolean().default(false),
    status: z
      .enum(["completed", "in-progress", "planned"])
      .default("completed"),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    githubUrl: z.string().optional(),
    liveUrl: z.string().optional(),
    demoUrl: z.string().optional(),
    links: z
      .array(
        z.object({
          label: z.string(),
          url: z.string(),
          type: z
            .enum(["github", "live", "demo", "docs", "other"])
            .default("other"),
        }),
      )
      .optional(),
    category: z
      .enum(["web", "mobile", "desktop", "api", "library", "other"])
      .default("web"),
    priority: z.number().default(0),
  }),
});

const blogs = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    hidden: z.boolean().default(false),
    chineseSource: z.string().optional(),
  }),
});

export const collections = {
  projects,
  blogs,
};
