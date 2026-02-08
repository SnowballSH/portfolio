## SnowballSH (Yinuo Huang) Portfolio v2

![favicon](https://github.com/user-attachments/assets/36962955-c4ab-42fa-9b44-f5e8ede9233f)

### Development

- `bun install`
- `bun run dev`
- `bun run check`
- `bun run format`
- `bun run format:check`
- `bun run build`
- `bun run preview`

### Typst Blogs

- Blog list page: `/blogs`
- Blog posts live in: `src/content/blogs/*.typ`
- Each `.typ` post must include frontmatter metadata:

```typ
#metadata(
  (
    title: "Post title",
    description: "One-line summary",
    date: "2026-02-08",
    tags: ("typst", "astro"),
  ),
)<frontmatter>
```

- Example post: `src/content/blogs/welcome.typ`
