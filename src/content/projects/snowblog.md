---
title: "SnowBlog"
shortDescription: "A self-hosted blogging service for posts written in Typst, powering blogs.snowballsh.com."
date: "2025-04-19" # YYYY-MM-DD format
technologies: ["Rust", "Typst", "SQLite"]
featured: false
status: "completed"
image: "/snowblog.webp"
imageAlt: "A Technological and Mathematical Blue Snowflake"
githubUrl: "https://github.com/SnowballSH/snowblog"
liveUrl: "https://blogs.snowballsh.com"
category: "web"
priority: 3
---

# SnowBlog

SnowBlog is the all-in-one blogging service behind [blogs.snowballsh.com](https://blogs.snowballsh.com), built around posts written in [Typst](https://typst.app).

- Post sources, translations, and assets live in SQLite
- Every write renders the post to HTML with the embedded Typst compiler, so math and diagrams survive intact
- A versioned JSON API serves published posts publicly and gates every change behind a bearer token
- Ships with a public reading UI and an admin UI for writing and publishing
- Optional Prometheus metrics on a separate listener
