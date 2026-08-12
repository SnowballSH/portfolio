import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.{md,mdx}" }),
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

export const collections = {
  projects,
};
